#!/usr/bin/env python3
"""Corta as gravações reais da plataforma em clipes 1080×1920 com a duração exata de cada cena.

- trechos com dados sensíveis (URL com código do cartão) ficam de fora;
- o QR Code do cartão é desfocado onde aparece grande;
- trechos longos são acelerados para caber na cena (a cena mostra a etiqueta "ACELERADO").
Uso: python3 scripts/footage.py --brutos PASTA_DOS_VIDEOS
Saída: public/footage/<cena>.mp4 (sem áudio) e src/data/footage.json (velocidade de cada clipe).
"""
import argparse, json, os, subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FPS = 30

# cena: (arquivo, início s, fim s, [caixas de desfoque (x, y, w, h, t0, t1) no vídeo de origem já girado])
# Coordenadas no espaço do vídeo de origem (576×1024 ou 720×1280); tempos relativos ao início do trecho.
CORTES = {
    "gancho":   ("WA0042", 61.6, 66.0, [(240, 0, 210, 350, 0, 5)]),
    "imprime":  ("WA0041", 26.0, 47.0, []),
    "marca":    ("WA0040", 0.4, 11.0, [(380, 0, 196, 150, 0, 11)]),
    "camera":   ("WA0042", 23.5, 37.0, [(290, 140, 160, 190, 5.0, 13.5)]),
    "le":       ("WA0042", 53.5, 66.0, [(200, 100, 230, 470, 0, 13)]),
    "falhas":   ("WA0042", 72.0, 83.0, []),
    "redencao": ("WA0042", 104.0, 131.5, []),
}

# Vídeo da correção: foco em gabarito, comentário e pegadinha (trechos de tela parada, quase em tempo real).
CORTES_CORRECAO = {
    "gancho":     ("WA0040", 0.4, 11.0, [(380, 0, 196, 150, 0, 11)]),
    "camera":     ("WA0042", 23.5, 37.0, [(290, 140, 160, 190, 5.0, 13.5)]),
    "le":         ("WA0042", 53.5, 66.0, [(200, 100, 230, 470, 0, 13)]),
    "mao":        ("WA0042", 0.0, 4.5, [(350, 0, 226, 260, 0, 4.5)]),
    "gabarito":   ("WA0042", 118.3, 121.3, []),
    "comentario": ("WA0042", 127.8, 130.6, []),
    "pegadinha":  ("WA0042", 127.8, 130.9, []),
    "falhas":     ("WA0042", 72.0, 83.0, []),
}
CONJUNTOS = {"por-dentro": ("", CORTES), "correcao": ("correcao-", CORTES_CORRECAO)}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--brutos", required=True, help="pasta com os vídeos VID-…-WA0040/41/42")
    ap.add_argument("--conjunto", default="por-dentro", choices=list(CONJUNTOS))
    a = ap.parse_args()
    prefixo, cortes = CONJUNTOS[a.conjunto]
    scenes = {s["id"]: s for s in json.load(open(os.path.join(ROOT, ".cache", f"timeline-{a.conjunto}.json")))["scenes"]}
    files = {k: next(os.path.join(a.brutos, f) for f in os.listdir(a.brutos) if k in f) for k in ("WA0040", "WA0041", "WA0042")}
    out_dir = os.path.join(ROOT, "public", "footage"); os.makedirs(out_dir, exist_ok=True)
    info = {}
    for cid, (src, t0, t1, blurs) in cortes.items():
        frames = scenes[cid]["frames"]
        dur_out = frames / FPS
        speed = (t1 - t0) / dur_out
        chain, last = [], "[0:v]"
        for i, (x, y, w, h, b0, b1) in enumerate(blurs):
            chain.append(f"{last}split[m{i}][c{i}];[c{i}]crop={w}:{h}:{x}:{y},boxblur=18:2[b{i}];"
                         f"[m{i}][b{i}]overlay={x}:{y}:enable='between(t,{b0},{b1})'[o{i}]")
            last = f"[o{i}]"
        chain.append(f"{last}setpts=(PTS-STARTPTS)/{speed:.5f},fps={FPS},"
                     f"scale=1080:1920:force_original_aspect_ratio=increase:flags=lanczos,crop=1080:1920,"
                     f"unsharp=5:5:0.6,format=yuv420p[v]")
        out = os.path.join(out_dir, f"{prefixo}{cid}.mp4")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(t0), "-to", str(t1), "-i", files[src],
                        "-filter_complex", ";".join(chain), "-map", "[v]", "-an", "-frames:v", str(frames),
                        "-c:v", "libx264", "-crf", "16", "-preset", "medium", out], check=True)
        info[cid] = {"velocidade": round(speed, 2), "frames": frames}
        print(f"{cid}: {src} {t0}–{t1}s → {dur_out:.2f}s ({speed:.2f}×)")
    nome = "footage.json" if a.conjunto == "por-dentro" else f"footage-{a.conjunto}.json"
    json.dump(info, open(os.path.join(ROOT, "src", "data", nome), "w"), indent=1)


if __name__ == "__main__":
    main()
