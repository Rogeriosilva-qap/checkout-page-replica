#!/usr/bin/env bash
# Gera tempos + legendas + trilha e renderiza o vídeo.
#   ./build.sh                          → locução do autor (narracao-metodo-bussola.wav) → saida/metodo-bussola.mp4
#   ./build.sh --voz eduardo-elevenlabs → vozes/eduardo-elevenlabs.mp3 → saida/metodo-bussola-voz-eduardo-elevenlabs.mp4
#   --sem-sync: usa um timeline.json ajustado à mão.   --sem-trilha: só a voz.
# Sem nenhum áudio → saida/metodo-bussola-PREVIA.mp4 (tempos estimados)
set -euo pipefail
cd "$(dirname "$0")"
VOZ=""; REST=()
while [[ $# -gt 0 ]]; do
  case "$1" in --voz) VOZ="$2"; shift 2;; *) REST+=("$1"); shift;; esac
done
SYNC=(python3 tools/sync.py); OUT=()
if [[ -n "$VOZ" ]]; then
  SYNC+=(--audio "vozes/$VOZ.mp3" --palavras "vozes/$VOZ.palavras.json")
  OUT=(--out "metodo-bussola-voz-$VOZ.mp4")
fi
[[ " ${REST[*]:-} " == *" --sem-sync "* ]] || "${SYNC[@]}"
python3 tools/trilha.py
node tools/render.mjs "${OUT[@]}" "${REST[@]}"
if [[ -n "$VOZ" ]]; then cp saida/metodo-bussola.srt "saida/metodo-bussola-voz-$VOZ.srt"; fi
