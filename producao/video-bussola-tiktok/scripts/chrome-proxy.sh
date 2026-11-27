#!/usr/bin/env bash
# Chromium headless do ambiente usando o proxy de saída (para o @remotion/google-fonts baixar
# as fontes durante o render). O Remotion abre o navegador com conexão direta; aqui trocamos
# esses parâmetros pelo proxy. O certificado do proxy já está no repositório NSS do usuário.
args=()
for a in "$@"; do
  case "$a" in --no-proxy-server|--proxy-server=*|--proxy-bypass-list=*) ;; *) args+=("$a");; esac
done
[[ -n "${HTTPS_PROXY:-}" ]] && args+=("--proxy-server=$HTTPS_PROXY" "--proxy-bypass-list=localhost;127.0.0.1")
exec /opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell "${args[@]}"
