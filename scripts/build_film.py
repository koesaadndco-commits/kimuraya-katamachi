#!/usr/bin/env python3
"""記念映像（public/img/film.mp4）と「物語を聴く」の音声（public/img/narration.mp3）を組み立てる。

使い方:  python3 scripts/build_film.py
必要なもの: ffmpeg / ffprobe / git

入力
  assets/film/lines/l1.wav … l7.wav   TTS で 1 行ずつ生成した音声（docs/narration-script.md の 1〜7 行目）
  assets/film/scene3-new.mp4          令和八年（午前六時）のシーン（差し替え済みの映像）
  git の初期コミットの film.mp4        元の映像（映像部分だけ使う。音声は作り直す）

処理
  1. 各行の前後の無音を切る
  2. 1 音（モーラ）あたりの読む速さをそろえる（TARGET_SEC_PER_MORA）。速い行は遅く、遅い行は速く
  3. 音量をそろえる
  4. 映像のシーンに合わせて配置し、film.mp4 の音声にする（最後の行を言い終えるまでタイトルカードを延長）
  5. 1〜6 行目を 0.6 秒の間隔でつないで narration.mp3 にし、字幕の切り替え時刻を public/kimura.js に書き込む
"""
import os, re, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LINES = os.path.join(ROOT, "assets/film/lines")
SCENE3 = os.path.join(ROOT, "assets/film/scene3-new.mp4")
ORIG_COMMIT = "30088e4"  # 初期コミット（元の film.mp4）

# 各行の読み（モーラ数）。台本を変えたらここも直す（docs/narration-script.md の「読み」から数える）
MORA = {1: 13, 2: 30, 3: 18, 4: 33, 5: 21, 6: 30, 7: 12}
TARGET_SEC_PER_MORA = 0.20  # 1 音あたり 0.20 秒（毎秒 5 音）にそろえる
TEMPO_LIMIT = (0.8, 1.25)  # 速さの補正はこの範囲まで（音質を保つため）
GAP = 0.6  # narration.mp3 の行間（秒）
# 映像の中での各行の開始秒（シーンに合わせて固定）。7 行目は 6 行目の後に自動で置く
STARTS = {1: 2.2, 2: 5.55, 4: 12.5, 3: 20.3, 5: 27.9, 6: 33.8}


def run(*cmd):
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)


def dur(path):
    out = subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path])
    return float(out.strip())


def prepare(tmp):
    """各行を、無音カット → 速さをそろえる → 音量をそろえる"""
    out = {}
    for i in range(1, 8):
        src = os.path.join(LINES, f"l{i}.wav")
        trimmed = os.path.join(tmp, f"trim{i}.wav")
        run("ffmpeg", "-y", "-v", "error", "-i", src, "-af",
            "silenceremove=start_periods=1:start_threshold=-40dB:start_silence=0.12,areverse,"
            "silenceremove=start_periods=1:start_threshold=-40dB:start_silence=0.15,areverse", trimmed)
        d0 = dur(trimmed)
        factor = (d0 / MORA[i]) / TARGET_SEC_PER_MORA  # >1 なら速くする
        factor = min(max(factor, TEMPO_LIMIT[0]), TEMPO_LIMIT[1])
        final = os.path.join(tmp, f"t{i}.wav")
        run("ffmpeg", "-y", "-v", "error", "-i", trimmed, "-af",
            f"atempo={factor:.4f},loudnorm=I=-19:TP=-1.5:LRA=7,aresample=48000", "-ac", "1", final)
        out[i] = final
        print(f"  {i}行目: {d0:.2f}秒 ({d0 / MORA[i]:.3f}秒/音) → ×{factor:.3f} → {dur(final):.2f}秒 ({dur(final) / MORA[i]:.3f}秒/音)")
    return out


def main():
    with tempfile.TemporaryDirectory() as tmp:
        orig = os.path.join(tmp, "film-original.mp4")
        with open(orig, "wb") as f:
            f.write(subprocess.check_output(["git", "-C", ROOT, "show", f"{ORIG_COMMIT}:public/img/film.mp4"]))
        print("音声を整える")
        t = prepare(tmp)
        d = {i: dur(t[i]) for i in t}

        starts = dict(STARTS)
        starts[7] = starts[6] + d[6] + 0.8
        total = round(starts[7] + d[7] + 2.2, 2)
        order = sorted(starts, key=lambda k: starts[k])
        for a, b in zip(order, order[1:]):
            if starts[a] + d[a] > starts[b] - 0.2:
                print(f"  ※注意: {a}行目と{b}行目が近すぎます（{starts[a] + d[a]:.2f}秒に終わり、{starts[b]:.2f}秒に始まる）")
        vclen = total - 27.2  # 終わりのシーン（元映像 27.6〜38.0 秒＋静止）の長さ
        print(f"映像の長さ: {total}秒")

        inputs = ["-i", orig, "-i", SCENE3] + sum([["-i", t[i]] for i in (1, 2, 4, 3, 5, 6, 7)], [])
        # 入力番号: 0=元映像 1=新シーン 2..8 = 1,2,4,3,5,6,7 行目
        idx = {1: 2, 2: 3, 4: 4, 3: 5, 5: 6, 6: 7, 7: 8}
        delays = ";".join(f"[{idx[i]}:a]adelay={int(starts[i] * 1000)}:all=1[a{i}]" for i in (1, 2, 4, 3, 5, 6, 7))
        mix = "".join(f"[a{i}]" for i in (1, 2, 4, 3, 5, 6, 7))
        fc = (
            "[0:v]trim=0:20.0,setpts=PTS-STARTPTS,settb=AVTB,fps=24[va];"
            "[1:v]setpts=PTS-STARTPTS,settb=AVTB,fps=24[vb];"
            f"[0:v]trim=27.6:38.0,setpts=PTS-STARTPTS,tpad=stop_mode=clone:stop_duration={vclen - 10.4:.2f},"
            f"fade=t=out:st={vclen - 0.8:.2f}:d=0.8,settb=AVTB,fps=24[vc];"
            "[va][vb]xfade=transition=fade:duration=0.6:offset=19.4[vab];"
            "[vab][vc]xfade=transition=fade:duration=0.6:offset=27.2[vout];"
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


if __name__ == "__main__":
    sys.exit(main())
