#!/usr/bin/env python3
"""Gera a narração no ElevenLabs (com tempos por caractere) → vozes/<nome>.mp3 + vozes/<nome>.palavras.json.
A chave da API é injetada pelo proxy do ambiente (cabeçalho xi-api-key); nada de chave no código.
Uso: python3 tools/elevenlabs.py VOICE_ID NOME [modelo]"""
import base64, json, os, re, sys, urllib.request
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
voice, nome = sys.argv[1], sys.argv[2]
model = sys.argv[3] if len(sys.argv) > 3 else "eleven_multilingual_v2"
text = open(os.path.join(ROOT, "narracao-metodo-bussola.txt"), encoding="utf-8").read().strip()
body = {"text": text, "model_id": model, "language_code": "pt",
        "voice_settings": {"stability": 0.5, "similarity_boost": 0.8, "style": 0.15, "use_speaker_boost": True}}
req = urllib.request.Request(
    f"https://api.elevenlabs.io/v1/text-to-speech/{voice}/with-timestamps?output_format=mp3_44100_128",
    data=json.dumps(body).encode(), headers={"Content-Type": "application/json",
    "xi-api-key": os.environ.get("ELEVENLABS_API_KEY", "proxy-injected")})
try:
    r = json.load(urllib.request.urlopen(req, timeout=180))
except urllib.error.HTTPError as e:
    if e.code == 400 and "language_code" in body:  # modelos sem language_code
        body.pop("language_code"); req.data = json.dumps(body).encode()
        r = json.load(urllib.request.urlopen(req, timeout=180))
    else:
        raise SystemExit(f"ElevenLabs {e.code}: {e.read()[:300]!r}")
os.makedirs(os.path.join(ROOT, "vozes"), exist_ok=True)
mp3 = os.path.join(ROOT, "vozes", nome + ".mp3")
open(mp3, "wb").write(base64.b64decode(r["audio_base64"]))
al = r.get("normalized_alignment") or r["alignment"]
chars, st, en = al["characters"], al["character_start_times_seconds"], al["character_end_times_seconds"]
words, cur = [], None
for ch, a, b in zip(chars, st, en):
    if ch.isspace():
        if cur: words.append(cur); cur = None
    else:
        if cur is None: cur = {"w": "", "s": a, "e": b}
        cur["w"] += ch; cur["e"] = b
if cur: words.append(cur)
for w in words: w["s"], w["e"] = round(w["s"], 3), round(w["e"], 3)
json.dump(words, open(os.path.join(ROOT, "vozes", nome + ".palavras.json"), "w"), ensure_ascii=False, indent=0)
print(f"ok: {mp3} · {len(words)} palavras · fim da fala {words[-1]['e']:.2f}s")
