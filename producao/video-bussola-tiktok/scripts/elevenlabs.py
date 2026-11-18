#!/usr/bin/env python3
"""Gera a narração cena a cena no ElevenLabs, com tempo por caractere.

Saída: public/voz/cena-XX.mp3 (+ cena-09-stories.mp3) e public/voz/narracao.json.
A chave da API é injetada pelo proxy do ambiente no cabeçalho xi-api-key
(ou use ELEVENLABS_API_KEY localmente). Só roda se public/narracao.mp3 NÃO existir.

Uso: python3 scripts/elevenlabs.py [--voz VOICE_ID] [--velocidade 1.1] [--so cena-08]
"""
import argparse, base64, json, os, subprocess, urllib.request, urllib.error

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUB = os.path.join(ROOT, "public")
OUT = os.path.join(PUB, "voz")

FALAS = [
    ("cena-01", "Essa linha do seu edital esconde 204 artigos."),
    ("cena-02", "E é por isso que tanto concurseiro trava antes de começar."),
    ("cena-03", "O Método Bússola resolve isso em quatro fases."),
    ("cena-04", "Fase um: você extrai o conteúdo do edital com um comando pronto."),
    ("cena-05", "Fase dois: cada item vira micro-tópicos que cabem em uma sessão de estudo."),
    ("cena-06", "Fase três: prioridade Alfa, Bravo e Charlie, pelo peso no edital e pela sua dificuldade."),
    ("cena-07", "Fase quatro: tudo vira semana de estudo, respeitando a sua escala."),
    ("cena-08", "E entre cada fase, você confere contra o edital. A IA acelera, e a conferência garante a direção certa."),
    ("cena-09", "São 22 comandos prontos, o Método Bússola e o caderno de erros automatizado. O link tá na bio."),
    ("cena-09-stories", "São 22 comandos prontos, o Método Bússola e o caderno de erros automatizado. O link tá nos stories."),
    ("cena-09-direct", "São 22 comandos prontos, o Método Bússola e o caderno de erros automatizado. Comente BÚSSOLA que eu te mando no direct."),
]


def tts(text, voice, speed, prev, nxt):
    body = {
        "text": text, "model_id": "eleven_multilingual_v2", "language_code": "pt",
        "apply_text_normalization": "on",
        "voice_settings": {"stability": 0.45, "similarity_boost": 0.8, "style": 0.25,
                           "use_speaker_boost": True, "speed": speed},
    }
    if prev: body["previous_text"] = prev
    if nxt: body["next_text"] = nxt
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice}/with-timestamps?output_format=mp3_44100_128"
    req = urllib.request.Request(url, data=json.dumps(body).encode(), headers={
        "Content-Type": "application/json", "xi-api-key": os.environ.get("ELEVENLABS_API_KEY", "proxy-injected")})
    try:
        return json.load(urllib.request.urlopen(req, timeout=180))
    except urllib.error.HTTPError as e:
        raise SystemExit(f"ElevenLabs {e.code}: {e.read()[:400]!r}")


def words_from(al):
    chars, st, en = al["characters"], al["character_start_times_seconds"], al["character_end_times_seconds"]
    out, cur = [], None
    for ch, a, b in zip(chars, st, en):
        if ch.isspace():
            if cur: out.append(cur); cur = None
        else:
            if cur is None: cur = {"text": "", "start": a, "end": b}
            cur["text"] += ch; cur["end"] = b
    if cur: out.append(cur)
    return [{**w, "start": round(w["start"], 3), "end": round(w["end"], 3)} for w in out]


def duration(path):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path],
                       capture_output=True, text=True)
    return float(r.stdout.strip())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--voz", default="4J31DrhygVjvFsoj7BsM")  # Eduardo S. - Brazilian Clear & Pro
    ap.add_argument("--velocidade", type=float, default=1.1)
    ap.add_argument("--so", action="append", help="gera só estas cenas (pode repetir)")
    ap.add_argument("--vel-cena", action="append", default=[], help="cena=velocidade, ex.: cena-08=1.2")
    a = ap.parse_args()
    if os.path.exists(os.path.join(PUB, "narracao.mp3")):
        raise SystemExit("public/narracao.mp3 existe: a narração fornecida tem prioridade; nada gerado.")
    os.makedirs(OUT, exist_ok=True)
    meta_path = os.path.join(OUT, "narracao.json")
    meta = json.load(open(meta_path, encoding="utf-8")) if os.path.exists(meta_path) else {"cenas": {}}
    vel = {k: float(v) for k, v in (x.split("=") for x in a.vel_cena)}
    main_seq = [f for f in FALAS if f[0] not in ("cena-09-stories", "cena-09-direct")]
    for i, (cid, text) in enumerate(FALAS):
        if a.so and cid not in a.so:
            continue
        idx = next(j for j, f in enumerate(main_seq) if f[0] == cid.replace("-stories", "").replace("-direct", ""))
        prev = " ".join(t for _, t in main_seq[max(0, idx - 2):idx]) or None
        nxt = main_seq[idx + 1][1] if idx + 1 < len(main_seq) else None
        speed = vel.get(cid, a.velocidade)
        r = tts(text, a.voz, speed, prev, nxt)
        path = os.path.join(OUT, cid + ".mp3")
        open(path, "wb").write(base64.b64decode(r["audio_base64"]))
        w = words_from(r["alignment"])  # tempos sobre o texto original (204, 22, IA)
        meta["cenas"][cid] = {"arquivo": f"voz/{cid}.mp3", "texto": text, "velocidade": speed,
                              "duracao": round(duration(path), 3), "fala_fim": w[-1]["end"], "palavras": w}
        print(f"{cid}: {meta['cenas'][cid]['duracao']:.2f}s (fala até {w[-1]['end']:.2f}s, vel {speed})")
    meta["voz"] = a.voz
    json.dump(meta, open(meta_path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
