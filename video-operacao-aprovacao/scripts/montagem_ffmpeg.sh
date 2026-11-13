#!/usr/bin/env bash
# Junta as sequências PNG das cenas aprovadas + áudio em output/.
# Uso: bash scripts/montagem_ffmpeg.sh            (todas as cenas existentes)
#      bash scripts/montagem_ffmpeg.sh cena01     (só uma cena, para validação)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
mkdir -p output/tmp
scenes=("${@:-cena01 cena02 cena03 cena04 cena05 cena06 cena07}")
: > output/tmp/lista.txt
for s in ${scenes[@]}; do
  first=$(ls renders/$s/${s}_*.png 2>/dev/null | head -1 || true)
  [ -z "$first" ] && { echo "pulando $s (sem quadros)"; continue; }
  start=$(basename "$first" .png | sed "s/${s}_//" | sed 's/^0*//')
  ffmpeg -y -loglevel error -framerate 30 -start_number "${start:-0}" -i "renders/$s/${s}_%04d.png" \
    -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -vf "scale=1080:1920:flags=lanczos" "output/tmp/$s.mp4"
  echo "file '$ROOT/output/tmp/$s.mp4'" >> output/tmp/lista.txt
  echo "ok: $s"
done
ffmpeg -y -loglevel error -f concat -safe 0 -i output/tmp/lista.txt -c copy output/tmp/video.mp4
if [ -f assets/audio/narracao_trilha.wav ]; then
  ffmpeg -y -loglevel error -i output/tmp/video.mp4 -i assets/audio/narracao_trilha.wav \
    -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart output/operacao_aprovacao_v1.mp4
else
  ffmpeg -y -loglevel error -i output/tmp/video.mp4 -c copy -movflags +faststart output/operacao_aprovacao_v1.mp4
  echo "aviso: sem áudio (assets/audio/narracao_trilha.wav ausente)"
fi
ffprobe -v error -show_entries stream=codec_name,width,height,r_frame_rate -show_entries format=duration \
  -of compact output/operacao_aprovacao_v1.mp4
