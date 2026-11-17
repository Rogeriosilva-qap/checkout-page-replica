#!/usr/bin/env bash
# Gera tempos + legendas + trilha e renderiza o vídeo.
# Sem narracao-metodo-bussola.(wav|mp3|m4a) nesta pasta → saida/metodo-bussola-PREVIA.mp4 (tempos estimados, sem voz)
# Com o áudio → sincroniza pela fala (projeto/palavras.json, se existir; senão pelas pausas) e gera saida/metodo-bussola.mp4
# --sem-sync: renderiza com um timeline.json ajustado à mão.   --sem-trilha: só a voz.
set -euo pipefail
cd "$(dirname "$0")"
[[ " $* " == *" --sem-sync "* ]] || python3 tools/sync.py
python3 tools/trilha.py
node tools/render.mjs "$@"
