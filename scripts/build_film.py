#!/usr/bin/env python3
"""記念映像（public/img/film.mp4）と「物語を聴く」の音声（public/img/narration.mp3）を組み立てる。

使い方:  python3 scripts/build_film.py
必要なもの: ffmpeg / ffprobe / git

入力
  assets/film/lines/l1.wav … l7.wav  TTS で 1 文ずつ（文の途中を切らずに）生成した音声。1 文まるごと読ませるのは、
                                      抑揚（イントネーション）をつなげて自然に保つため
  assets/film/phrases/6a.wav          6 行目の最初のフレーズ「八十年経った今も、」を単独で読ませた音声
                                      （1 文の中だと「たったいまも」が詰め込まれて速くなるため、ここだけ差し替える）
  assets/film/scene3-new.mp4          令和八年（午前六時）のシーン（動画。キャプション入り）
  assets/film/endcard-text.png        終わりのタイトル画面の文字（透過画像。元の画面と同じ配置）
  git の初期コミットの film.mp4         元の映像（映像部分だけ使う。音声は作り直す）

処理
  1. 各行の前後の無音を切る
  2. 行を、読点の長い間（0.25 秒以上）でフレーズに分け、フレーズごとに 1 音（モーラ）あたりの読む速さをそろえる
     → 声の高さの流れは変えず（atempo は音程を保つ）、行の途中の「加速」だけをなくす
  3. フレーズの間は、すべて同じ長さ（PAUSE）にそろえてつなぎ、音量をそろえる
  4. 映像のシーンに合わせて配置し、film.mp4 の音声にする（家族のシーンをスローモーションで延ばして 6 行目を載せ、
     最後の一言「ありがとうの、八十年。」は、終わりのタイトル文字が浮かぶのと同じタイミングで言う）
  5. 1〜6 行目を 0.6 秒の間隔でつないで narration.mp3 にし、字幕の切り替え時刻を public/kimura.js に書き込む
"""
import os, re, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LINES_DIR = os.path.join(ROOT, "assets/film/lines")
PHRASES = os.path.join(ROOT, "assets/film/phrases")
SCENE3 = os.path.join(ROOT, "assets/film/scene3-new.mp4")
ORIG_COMMIT = "30088e4"  # 初期コミット（元の film.mp4）

# 行ごとの設定。moras = フレーズごとの読みの音数（モーラ）。台本を変えたらここも直す
#   thr   … この長さ以上の無音をフレーズの切れ目とみなす（秒）
#   head  … 先頭の n フレーズを、phrases/ の単独音声（名前, 音数）に置き換える（6 行目のみ）
LINES = {
    1: {"moras": [10, 3]},                                  # 昭和二十一年、／福井。
    2: {"moras": [19, 11]},                                 # 小さな食料品店の木村屋から、／すべては始まりました。
    3: {"moras": [4, 8, 6]},                                # 毎朝、／誰よりも早く、／うりばに立つ。
    4: {"moras": [11, 13, 9]},                              # 昭和四十年には、／片町フードセンターとして、／歩みはじめました。
    5: {"moras": [11, 10]},                                 # あの日の「いらっしゃい」から、／今日の「ありがとう」まで。
    6: {"moras": [6, 6, 6, 12], "thr": 0.12,                # 八十年／経った今も、／私たちは、／この町の台所です。
        "head": (2, "6a", 12)},                             #   先頭の「八十年／経った今も」は 6a.wav（単独）に置き換え
    7: {"moras": [6, 6], "natural": True},                  # ありがとうの、／八十年。 … 感謝をこめて、読まれたままの速さと間を使う（補正しない）
}
SEC_PER_MORA = 0.175  # 1 音あたりの目標（秒）。実測の中央値（約 0.153）より少しゆったり。「言葉がくっついて聞こえる」との指摘で 0.155 から広げた
PAUSE = 0.55          # フレーズの間（読点の間）。すべて同じ長さ（0.40 から広げた）
TEMPO_LIMIT = (0.55, 1.3)  # 速さの補正はこの範囲まで（音質を保つため）
GAP = 0.6             # narration.mp3 の行間（秒）

# 元映像のシーンの切れ目（秒）。この範囲だけが、前後のシーンが混ざらない部分
ORIG_KEEP_A_END = 19.9    # 昭和四十年のシーンが終わる直前（この先は令和のトマトのシーンの切り替え）
ORIG_KEEP_C_START = 28.5  # 家族の夕食のシーンが始まった後（この前は元のトマトのシーンが残る）
ORIG_FAMILY_END = 34.8    # 元映像で家族の夕食のシーンが終わる時刻（この後は元のタイトル画面。文字は自前で作り直す）
FAMILY_NORMAL = 1.5       # 家族のシーンは、最初の 1.5 秒は元の速さ、そのあとをスローモーションにして延ばす
END_CARD = os.path.join(ROOT, "assets/film/endcard-text.png")  # 終わりのタイトル画面の文字（元と同じ配置の透過画像）
CARD_FADE_IN = 1.2        # 終わりの文字が浮かぶ時間
CARD_FADE_OUT = 0.8
# 冒頭のタイトル画面（「1946 — 2026 木村グループ 創業八十周年記念映像」）を長く見せる。
# 元は 0.4〜1.4 秒でゆっくり表示され、文字がはっきり見えるのは約 0.6 秒、約 2 秒で次のシーンへ切り替わっていた。
# 文字が表示しきった静止の状態（INTRO_HOLD_AT 秒）の画面を INTRO_HOLD 秒のばす（合計で約 4.8 秒）
INTRO_HOLD_AT = 1.75
INTRO_HOLD = 2.8
XFADE = 0.5
# 映像の中での各行の開始秒の決め方（シーン3の開始・終了からの相対）
LINE3_AFTER_SCENE3_START = 1.0   # 令和のシーンが見え始めてから 3 行目まで
LINE5_AFTER_VC_START = 0.8       # 家族のシーンが見え始めてから 5 行目まで
LINE6_AFTER_LINE5 = 0.7          # 5 行目を言い終えてから 6 行目まで
FAMILY_END_AFTER_LINE6 = 0.3     # 6 行目を言い終えてから、家族のシーンが暗くなり終わるまで
LINE7_AFTER_FAMILY = 0.9         # 暗くなってから、最後の一言まで（余韻）
CARD_BEFORE_VOICE = 0.1          # 終わりの文字は、最後の一言の少し前から浮かび始める（声と文字がそろう）
END_HOLD = 2.6                   # 最後の一言のあと、文字を見せる時間（最後の 0.8 秒で暗くなる）
FIXED_STARTS = {1: 2.2 + INTRO_HOLD, 2: 5.55 + INTRO_HOLD, 4: 12.5 + INTRO_HOLD}  # 元の映像でのシーンの位置＋冒頭ののばした分


def run(*cmd):
    r = subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True)
    if r.returncode != 0:
        sys.exit(f"コマンドが失敗しました: {cmd[0]}\n{r.stderr[-1500:]}")


def dur(path):
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path]).strip())


def trim_ends(src, dst):
    run("ffmpeg", "-y", "-v", "error", "-i", src, "-af",
        "silenceremove=start_periods=1:start_threshold=-40dB:start_silence=0.06,areverse,"
        "silenceremove=start_periods=1:start_threshold=-40dB:start_silence=0.08,areverse", dst)


def find_pauses(path, thr):
    """(開始, 終了) の無音区間のうち、thr 秒以上のもの"""
    err = subprocess.run(["ffmpeg", "-v", "info", "-i", path, "-af", "silencedetect=noise=-36dB:d=0.08", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    st = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", err)]
    en = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", err)]
    return [(a, b) for a, b in zip(st, en) if b - a >= thr]


def stretch(src, mora, dst, label):
    d0 = dur(src)
    factor = min(max((d0 / mora) / SEC_PER_MORA, TEMPO_LIMIT[0]), TEMPO_LIMIT[1])  # >1 なら速くする
    run("ffmpeg", "-y", "-v", "error", "-i", src, "-af", f"atempo={factor:.4f},aresample=48000", "-ac", "1", dst)
    print(f"    {label}: {d0:.2f}秒 ({d0 / mora:.3f}秒/音) → ×{factor:.3f} → {dur(dst):.2f}秒 ({dur(dst) / mora:.3f}秒/音)")
    return dst


def build_line(i, tmp):
    cfg = LINES[i]
    trimmed = os.path.join(tmp, f"l{i}-t.wav")
    trim_ends(os.path.join(LINES_DIR, f"l{i}.wav"), trimmed)
    if cfg.get("natural"):
        # 速さも間も補正せず、読まれたまま使う（音量だけそろえる）
        final = os.path.join(tmp, f"t{i}.wav")
        run("ffmpeg", "-y", "-v", "error", "-i", trimmed, "-af", "loudnorm=I=-19:TP=-1.5:LRA=7,aresample=48000", "-ac", "1", final)
        print(f"    そのまま使用: {dur(final):.2f}秒")
        return final
    total = dur(trimmed)
    pauses = find_pauses(trimmed, cfg.get("thr", 0.25))
    cuts = [0.0]
    for a, b in pauses:
        cuts += [a, b]
    cuts.append(total)
    spans = [(cuts[k], cuts[k + 1]) for k in range(0, len(cuts), 2)]
    full = cfg["moras"]
    if len(spans) != len(full):
        sys.exit(f"{i}行目: 無音で分けた数（{len(spans)}）が音数の指定（{len(full)}）と合いません。LINES を確認してください")

    parts = []
    skip = 0
    if "head" in cfg:
        skip, name, mora = cfg["head"]
        trimmed_head = os.path.join(tmp, f"{name}-t.wav")
        trim_ends(os.path.join(PHRASES, f"{name}.wav"), trimmed_head)
        parts.append(stretch(trimmed_head, mora, os.path.join(tmp, f"{name}-s.wav"), f"{name}（単独）"))
    for k in range(skip, len(spans)):
        s0, e0 = spans[k]
        seg = os.path.join(tmp, f"l{i}-seg{k}.wav")
        fade = min(0.006, (e0 - s0) / 4)
        run("ffmpeg", "-y", "-v", "error", "-i", trimmed, "-af",
            f"atrim=start={s0:.4f}:end={e0:.4f},asetpts=PTS-STARTPTS,afade=t=in:d={fade:.4f},afade=t=out:st={max(e0 - s0 - fade, 0):.4f}:d={fade:.4f}", seg)
        parts.append(stretch(seg, full[k], os.path.join(tmp, f"l{i}-seg{k}-s.wav"), f"{k + 1}つ目"))

    # フレーズを一定の間でつなぐ
    inputs = []
    for p in parts:
        inputs += ["-i", p]
    n = len(parts)
    labels = "".join(f"[{k}:a]" + (f"apad=pad_dur={PAUSE}[p{k}];" if k < n - 1 else f"anull[p{k}];") for k in range(n))
    cat = "".join(f"[p{k}]" for k in range(n))
    joined = os.path.join(tmp, f"j{i}.wav")
    run("ffmpeg", "-y", "-v", "error", *inputs, "-filter_complex", f"{labels}{cat}concat=n={n}:v=0:a=1[a]", "-map", "[a]", joined)
    final = os.path.join(tmp, f"t{i}.wav")
    run("ffmpeg", "-y", "-v", "error", "-i", joined, "-af", "loudnorm=I=-19:TP=-1.5:LRA=7,aresample=48000", "-ac", "1", final)
    return final


def main():
    with tempfile.TemporaryDirectory() as tmp:
        orig = os.path.join(tmp, "film-original.mp4")
        with open(orig, "wb") as f:
            f.write(subprocess.check_output(["git", "-C", ROOT, "show", f"{ORIG_COMMIT}:public/img/film.mp4"]))
        t, d = {}, {}
        for i in LINES:
            print(f"{i}行目")
            t[i] = build_line(i, tmp)
            d[i] = dur(t[i])
            print(f"  → {d[i]:.2f}秒")

        d3 = dur(SCENE3)
        s3 = ORIG_KEEP_A_END + INTRO_HOLD - XFADE  # 令和のシーンが映像に入ってくる時刻（冒頭ののばした分を足す）
        vc_off = s3 + d3 - XFADE                # 家族のシーンが入ってくる時刻
        starts = dict(FIXED_STARTS)
        starts[3] = s3 + LINE3_AFTER_SCENE3_START
        starts[5] = vc_off + LINE5_AFTER_VC_START
        starts[6] = starts[5] + d[5] + LINE6_AFTER_LINE5
        fam_end = starts[6] + d[6] + FAMILY_END_AFTER_LINE6   # 家族のシーンが暗くなり終わる時刻
        starts[7] = fam_end + LINE7_AFTER_FAMILY              # 最後の一言（このとき画面の文字も浮かぶ）
        card_in = starts[7] - CARD_BEFORE_VOICE
        total = round(starts[7] + d[7] + END_HOLD, 2)
        order = sorted(starts, key=lambda k: starts[k])
        for a, b in zip(order, order[1:]):
            if starts[a] + d[a] > starts[b] - 0.2:
                print(f"  ※注意: {a}行目と{b}行目が近すぎます（{starts[a] + d[a]:.2f}秒に終わり、{starts[b]:.2f}秒に始まる）")

        # 家族のシーン：最初は元の速さ、あとはスローモーション（動きを補間してなめらかに）で、6 行目の終わりまで延ばす
        fam_len = fam_end - vc_off
        src_slow = ORIG_FAMILY_END - (ORIG_KEEP_C_START + FAMILY_NORMAL)
        slow_factor = max((fam_len - FAMILY_NORMAL) / src_slow, 1.0)
        if slow_factor > 2.8:
            print(f"  ※注意: 家族のシーンを {slow_factor:.1f} 倍に延ばします（遅すぎる場合は PAUSE や目標の速さを見直してください）")
        card_len = total - fam_end
        print(f"映像の長さ: {total}秒（令和 {s3:.1f}〜{s3 + d3:.1f}秒 / 家族 {vc_off:.1f}〜{fam_end:.1f}秒（×{slow_factor:.2f}遅く） / 終わりの文字 {card_in:.1f}秒〜）")

        order_in = (1, 2, 4, 3, 5, 6, 7)
        inputs = ["-i", orig, "-i", SCENE3] + sum([["-i", t[i]] for i in order_in], [])
        inputs += ["-loop", "1", "-framerate", "24", "-t", f"{card_len:.2f}", "-i", END_CARD]
        card_idx = 2 + len(order_in)
        idx = {line: 2 + k for k, line in enumerate(order_in)}
        delays = ";".join(f"[{idx[i]}:a]adelay={int(starts[i] * 1000)}:all=1[a{i}]" for i in order_in)
        mix = "".join(f"[a{i}]" for i in order_in)
        fc = (
            f"[0:v]trim=0:{INTRO_HOLD_AT},setpts=PTS-STARTPTS,tpad=stop_mode=clone:stop_duration={INTRO_HOLD},settb=AVTB,fps=24[v0];"
            f"[0:v]trim={INTRO_HOLD_AT}:{ORIG_KEEP_A_END},setpts=PTS-STARTPTS,settb=AVTB,fps=24[v1];"
            "[v0][v1]concat=n=2:v=1:a=0,settb=AVTB,fps=24[va];"
            "[1:v]setpts=PTS-STARTPTS,settb=AVTB,fps=24,scale=1600:900[vb];"
            f"[0:v]trim={ORIG_KEEP_C_START}:{ORIG_KEEP_C_START + FAMILY_NORMAL},setpts=PTS-STARTPTS,settb=AVTB,fps=24[f1];"
            f"[0:v]trim={ORIG_KEEP_C_START + FAMILY_NORMAL}:{ORIG_FAMILY_END},setpts={slow_factor:.4f}*(PTS-STARTPTS),"
            "minterpolate=fps=24:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1,settb=AVTB,fps=24[f2];"
            f"[f1][f2]concat=n=2:v=1:a=0,fade=t=out:st={fam_len - 0.9:.2f}:d=0.9,settb=AVTB,fps=24[vc];"
            f"[va][vb]xfade=transition=fade:duration={XFADE}:offset={s3:.2f}[vab];"
            f"[vab][vc]xfade=transition=fade:duration={XFADE}:offset={vc_off:.2f}[vx];"
            f"color=c=0x050506:s=1600x900:r=24:d={card_len:.2f}[bg];"
            f"[{card_idx}:v]format=rgba,fade=t=in:st={card_in - fam_end:.2f}:d={CARD_FADE_IN}:alpha=1,"
            f"fade=t=out:st={card_len - CARD_FADE_OUT:.2f}:d={CARD_FADE_OUT}:alpha=1[txt];"
            "[bg][txt]overlay=format=auto,format=yuv420p,settb=AVTB,fps=24[vcard];"
            "[vx][vcard]concat=n=2:v=1:a=0[vout];"
            f"{delays};{mix}amix=inputs=7:normalize=0:dropout_transition=0,apad=whole_dur={total}[aout]"
        )
        film = os.path.join(ROOT, "public/img/film.mp4")
        run("ffmpeg", "-y", "-v", "error", *inputs, "-filter_complex", fc, "-map", "[vout]", "-map", "[aout]",
            "-c:v", "libx264", "-preset", "slow", "-crf", "23", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
            "-c:a", "aac", "-b:a", "96k", "-ac", "1", "-ar", "48000", "-t", str(total), film)
        print("→ public/img/film.mp4")

        # narration.mp3：1〜6 行目を一定の間隔でつなぐ
        cues, at = [], 0.0
        for i in range(1, 7):
            cues.append(round(at, 2))
            at += d[i] + GAP
        ins = sum([["-i", t[i]] for i in range(1, 7)], [])
        pads = "".join(f"[{i}:a]apad=pad_dur={GAP}[p{i}];" for i in range(5))
        cat = "".join(f"[p{i}]" for i in range(5)) + "[5:a]"
        run("ffmpeg", "-y", "-v", "error", *ins, "-filter_complex", f"{pads}{cat}concat=n=6:v=0:a=1[a]", "-map", "[a]",
            "-c:a", "libmp3lame", "-q:a", "4", "-ar", "44100", "-ac", "1", os.path.join(ROOT, "public/img/narration.mp3"))
        print(f"→ public/img/narration.mp3（{at - GAP:.1f}秒）字幕の切り替え時刻: {cues}")

        js = os.path.join(ROOT, "public/kimura.js")
        text = open(js, encoding="utf-8").read()
        m = re.search(r"var cues=\[.*?\];", text, re.S)
        it = iter(cues)
        new = re.sub(r"\[(\d+(?:\.\d+)?),'", lambda _m: f"[{next(it)},'", m.group(0))
        open(js, "w", encoding="utf-8").write(text.replace(m.group(0), new))
        print("→ public/kimura.js の cues を更新")
        print(f"film の各行の開始秒: {{ {', '.join(f'{k}: {v:.2f}' for k, v in sorted(starts.items()))} }}")
        print(f"映像の総時間: {total}秒")


if __name__ == "__main__":
    sys.exit(main())
