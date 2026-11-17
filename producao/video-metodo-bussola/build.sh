#!/usr/bin/env bash
# Gera tempos + legendas e renderiza o vídeo.
# Sem narracao-metodo-bussola.(wav|mp3|m4a) nesta pasta → saida/metodo-bussola-PREVIA.mp4 (tempos estimados, sem voz)
# Com o áudio → sincroniza nas pausas reais da locução e gera saida/metodo-bussola.mp4
# Use ./build.sh --sem-sync para renderizar com um timeline.json ajustado à mão.
set -euo pipefail
cd "$(dirname "$0")"
[[ "${1:-}" == "--sem-sync" ]] || python3 tools/sync.py
node tools/render.mjs
