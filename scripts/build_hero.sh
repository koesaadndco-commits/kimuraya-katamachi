#!/bin/bash
# ホームのヒーロー映像（public/img/hero.mp4）を組み立てる。
# 前半＝元の「昔の木村屋」（初期コミットの hero.mp4 の 0〜5.6 秒）、後半＝assets/film/hero-scene.mp4（生成した売り場の動画）を
# 0.5 秒のディゾルブでつなぐ。元の後半（トマトが小さく、手の動きが不自然だった部分）は使わない。
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
git -C "$ROOT" show 30088e4:public/img/hero.mp4 > "$TMP/hero-original.mp4"
ffmpeg -y -v error -i "$TMP/hero-original.mp4" -i "$ROOT/assets/film/hero-scene.mp4" -filter_complex \
  "[0:v]trim=0:5.6,setpts=PTS-STARTPTS,fps=24,settb=AVTB[a];[1:v]setpts=PTS-STARTPTS,fps=24,settb=AVTB[b];[a][b]xfade=transition=fade:duration=0.5:offset=5.1,format=yuv420p[v]" \
  -map "[v]" -an -c:v libx264 -preset slow -crf 22 -movflags +faststart "$ROOT/public/img/hero.mp4"
echo "→ public/img/hero.mp4 ($(ffprobe -v error -show_entries format=duration -of csv=p=0 "$ROOT/public/img/hero.mp4") 秒)"
