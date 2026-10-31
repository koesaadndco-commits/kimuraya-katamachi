#!/usr/bin/env python3
"""記念映像（public/img/film.mp4）と「物語を聴く」の音声（public/img/narration.mp3）を組み立てる。

使い方:  python3 scripts/build_film.py
必要なもの: ffmpeg / ffprobe / git

入力
  assets/film/phrases/*.wav   TTS でフレーズ（読点・句点で区切った単位）ごとに生成した音声。
                              名前は「行番号＋a,b,c」（例: 4a, 4b, 4c = 4行目の1〜3フレーズ目。docs/narration-script.md 参照）
  assets/film/scene3-new.mp4  令和八年（午前六時）のシーン（動画。キャプション入り）
  git の初期コミットの film.mp4  元の映像（映像部分だけ使う。音声は作り直す）

処理
  1. 各フレーズの前後と途中の余計な無音を切る
  2. フレーズごとに、1音（モーラ）あたりの読む速さを同じにそろえる → 行の途中でも速くなったり遅くなったりしない
  3. フレーズの間に一定の間（PAUSE）を入れて1行にし、音量をそろえる
  4. 映像のシーンに合わせて配置し、film.mp4 の音声にする（最後の行を言い終えるまでタイトルカードを延長）
  5. 1〜6 行目を 0.6 秒の間隔でつないで narration.mp3 にし、字幕の切り替え時刻を public/kimura.js に書き込む
"""
import os, re, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PHRASES = os.path.join(ROOT, "assets/film/phrases")
SCENE3 = os.path.join(ROOT, "assets/film/scene3-new.mp4")
ORIG_COMMIT = "30088e4"  # 初期コミット（元の film.mp4）

# 行ごとのフレーズと、各フレーズの読みの音数（モーラ）。台本を変えたらここも直す
LINES = {
    1: [("1a", 10), ("1b", 3)],                      # 昭和二十一年、／福井。
    2: [("2a", 19), ("2b", 11)],                     # 小さな食料品店の木村屋から、／すべては始まりました。
    3: [("3a", 4), ("3b", 8), ("3c", 6)],            # 毎朝、／誰よりも早く、／うりばに立つ。
    4: [("4a", 11), ("4b", 13), ("4c", 9)],          # 昭和四十年には、／片町フードセンターとして、／歩みはじめました。
    5: [("5a", 11), ("5b", 10)],                     # あの日の「いらっしゃい」から、／今日の「ありがとう」まで。
    6: [("6a", 12), ("6b", 6), ("6c", 12)],          # 八十年経った今も、／私たちは、／この町の台所です。
    7: [("7a", 6), ("7b", 6)],                       # ありがとうの、／八十年。
}
SEC_PER_MORA = 0.16   # 1音あたり 0.16 秒（毎秒 6.25 音）で全フレーズをそろえる
PAUSE = 0.22          # フレーズの間（読点の間）。すべて同じ長さ
TEMPO_LIMIT = (0.75, 1.3)  # 速さの補正はこの範囲まで（音質を保つため）
GAP = 0.6             # narration.mp3 の行間（秒）

# 元映像のシーンの切れ目（秒）。この範囲だけが、前後のシーンが混ざらない部分
ORIG_KEEP_A_END = 19.9    # 昭和四十年のシーンが終わる直前（この先は令和のトマトのシーンの切り替え）
ORIG_KEEP_C_START = 28.5  # 家族の夕食のシーンが始まった後（この前は元のトマトのシーンが残る）
ORIG_END = 38.0
XFADE = 0.5
# 映像の中での各行の開始秒の決め方（シーン3の開始・終了からの相対）
LINE3_AFTER_SCENE3_START = 1.0   # 令和のシーンが見え始めてから 3 行目まで
LINE5_AFTER_VC_START = 0.8       # 家族のシーンが見え始めてから 5 行目まで
LINE6_AT_ORIG = 34.2             # 6 行目は、元映像のこの時点（タイトルカードが出る）から
FIXED_STARTS = {1: 2.2, 2: 5.55, 4: 12.5}


def run(*cmd):
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)


def dur(path):
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path]).strip())


def build_line(i, tmp):
    parts = []
    for k, (name, mora) in enumerate(LINES[i]):
        raw = os.path.join(PHRASES, f"{name}.wav")
        trimmed = os.path.join(tmp, f"{name}-t.wav")
        # 前後の無音を切り、途中の長い無音は 0.1 秒に詰める
        run("ffmpeg", "-y", "-v", "error", "-i", raw, "-af",
            "silenceremove=start_periods=1:start_threshold=-40dB:start_silence=0.06,areverse,"
            "silenceremove=start_periods=1:start_threshold=-40dB:start_silence=0.08,areverse,"
            "silenceremove=stop_periods=-1:stop_duration=0.15:stop_threshold=-38dB:stop_silence=0.1", trimmed)
        d0 = dur(trimmed)
        factor = min(max((d0 / mora) / SEC_PER_MORA, TEMPO_LIMIT[0]), TEMPO_LIMIT[1])  # >1 なら速くする
        tempo = os.path.join(tmp, f"{name}-s.wav")
        run("ffmpeg", "-y", "-v", "error", "-i", trimmed, "-af", f"atempo={factor:.4f},aresample=48000", "-ac", "1", tempo)
        parts.append(tempo)
        print(f"    {name}: {d0:.2f}秒 ({d0 / mora:.3f}秒/音) → ×{factor:.3f} → {dur(tempo):.2f}秒 ({dur(tempo) / mora:.3f}秒/音)")
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
        s3 = ORIG_KEEP_A_END - XFADE            # 令和のシーンが映像に入ってくる時刻
        vc_off = s3 + d3 - XFADE                # 家族のシーンが入ってくる時刻
        starts = dict(FIXED_STARTS)
        starts[3] = s3 + LINE3_AFTER_SCENE3_START
        starts[5] = vc_off + LINE5_AFTER_VC_START
        starts[6] = vc_off + (LINE6_AT_ORIG - ORIG_KEEP_C_START)
        starts[7] = starts[6] + d[6] + 0.8
        total = round(starts[7] + d[7] + 2.2, 2)
        order = sorted(starts, key=lambda k: starts[k])
        for a, b in zip(order, order[1:]):
            if starts[a] + d[a] > starts[b] - 0.2:
                print(f"  ※注意: {a}行目と{b}行目が近すぎます（{starts[a] + d[a]:.2f}秒に終わり、{starts[b]:.2f}秒に始まる）")
        vclen = total - vc_off
        print(f"映像の長さ: {total}秒（令和のシーン {s3:.1f}〜{s3 + d3:.1f}秒、家族のシーン {vc_off:.1f}秒〜）")

        order_in = (1, 2, 4, 3, 5, 6, 7)
        inputs = ["-i", orig, "-i", SCENE3] + sum([["-i", t[i]] for i in order_in], [])
        idx = {line: 2 + k for k, line in enumerate(order_in)}
        delays = ";".join(f"[{idx[i]}:a]adelay={int(starts[i] * 1000)}:all=1[a{i}]" for i in order_in)
        mix = "".join(f"[a{i}]" for i in order_in)
        fc = (
            f"[0:v]trim=0:{ORIG_KEEP_A_END},setpts=PTS-STARTPTS,settb=AVTB,fps=24[va];"
            "[1:v]setpts=PTS-STARTPTS,settb=AVTB,fps=24,scale=1600:900[vb];"
            f"[0:v]trim={ORIG_KEEP_C_START}:{ORIG_END},setpts=PTS-STARTPTS,"
            f"tpad=stop_mode=clone:stop_duration={max(vclen - (ORIG_END - ORIG_KEEP_C_START), 0):.2f},"
            f"fade=t=out:st={vclen - 0.8:.2f}:d=0.8,settb=AVTB,fps=24[vc];"
            f"[va][vb]xfade=transition=fade:duration={XFADE}:offset={s3:.2f}[vab];"
            f"[vab][vc]xfade=transition=fade:duration={XFADE}:offset={vc_off:.2f}[vout];"
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
