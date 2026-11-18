#!/usr/bin/env python3
"""Enxuga a narração gerada (sem alterar timbre nem velocidade da voz):
- remove o silêncio do fim de cada cena;
- encurta pausas internas longas (vírgulas/pontos) para no máximo PAUSA_MAX;
- remapeia o tempo de cada palavra.
Saída: public/voz/final/<cena>.wav e src/data/narracao.json (lido pelo vídeo e pelo .srt).
"""
import json, os, re, subprocess, wave
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
import argparse
_ap = argparse.ArgumentParser()
_ap.add_argument("--pasta", default="voz", help="subpasta de public/ com a narração gerada")
_ap.add_argument("--saida", default="src/data/narracao.json", help="JSON com tempos por palavra")
ARGS = _ap.parse_args()
VOZ = os.path.join(ROOT, "public", ARGS.pasta)
FINAL = os.path.join(VOZ, "final")
SR = 48000
PAUSA_MAX = 0.18      # pausa de vírgula
PAUSA_PONTO = 0.24    # pausa de fim de frase
LIMIAR = "-40dB"


def decode(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
                         capture_output=True).stdout
    return np.frombuffer(raw, np.float32).copy()


def silences(path):
    p = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", path, "-af",
                        f"silencedetect=noise={LIMIAR}:d=0.12", "-f", "null", "-"], capture_output=True, text=True)
    st = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", p.stderr)]
    en = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", p.stderr)]
    return list(zip(st, en + [None] * (len(st) - len(en))))


ALVO_LUFS = -14.0


def nivela(path):
    """leva a fala a ~-14 LUFS (padrão de redes) com limitador de pico em -1,5 dBFS"""
    p = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", path, "-af", "ebur128", "-f", "null", "-"],
                       capture_output=True, text=True)
    i = float(re.findall(r"I:\s+(-?[\d.]+) LUFS", p.stderr)[-1])
    tmp = path + ".tmp.wav"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", path, "-af",
                    f"volume={ALVO_LUFS - i:.2f}dB,alimiter=limit=0.84:level=false", "-ar", str(SR), tmp], check=True)
    os.replace(tmp, path)


def main():
    meta = json.load(open(os.path.join(VOZ, "narracao.json"), encoding="utf-8"))
    os.makedirs(FINAL, exist_ok=True)
    out = {"voz": meta.get("voz"), "cenas": {}}
    for cid, c in sorted(meta["cenas"].items()):
        src = os.path.join(ROOT, "public", c["arquivo"])
        x = decode(src)
        dur = len(x) / SR
        words = c["palavras"]
        cuts = []  # (ini, fim) de trechos removidos
        for a, b in silences(src):
            if b is None or b >= dur - 0.02:      # silêncio final: corta tudo (deixa 40 ms)
                cuts.append((a + 0.04, dur)); continue
            if a < 0.02:                          # silêncio inicial: deixa 20 ms
                cuts.append((0, max(0, b - 0.02))); continue
            # pausa entre palavras: a palavra anterior termina com ponto?
            prev = [w for w in words if w["end"] <= b + 0.05]
            keep = PAUSA_PONTO if prev and prev[-1]["text"][-1] in ".!?:" else PAUSA_MAX
            if b - a > keep:
                cuts.append((a + keep / 2, b - keep / 2))  # mantém 'keep' de pausa, metade de cada lado
        cuts = sorted((max(0, a), min(dur, b)) for a, b in cuts if b > a)
        def remap(t):
            shift = 0.0
            for a, b in cuts:
                if t >= b: shift += b - a
                elif t > a: shift += t - a
            return t - shift
        keep_mask = np.ones(len(x), bool)
        for a, b in cuts:
            keep_mask[int(a * SR):int(b * SR)] = False
        y = x[keep_mask]
        # micro-fades nas emendas para não estalar
        f = int(0.004 * SR)
        idx = np.cumsum(keep_mask) - 1
        for a, b in cuts:
            j = int(min(max(idx[min(len(idx) - 1, int(a * SR))], 0), len(y)))
            lo, hi = max(0, j - f), min(len(y), j + f)
            y[lo:hi] *= np.concatenate([np.linspace(1, 0, j - lo), np.linspace(0, 1, hi - j)]) if hi > lo else 1
        path = os.path.join(FINAL, cid + ".wav")
        with wave.open(path, "wb") as w:
            w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
            w.writeframes((np.clip(y, -1, 1) * 32767).astype("<i2").tobytes())
        nivela(path)
        new_words = [{"text": w["text"], "start": round(remap(w["start"]), 3), "end": round(remap(w["end"]), 3)}
                     for w in words]
        out["cenas"][cid] = {"arquivo": f"{ARGS.pasta}/final/{cid}.wav", "duracao": round(len(y) / SR, 3),
                             "texto": c["texto"], "palavras": new_words}
        print(f"{cid}: {dur:.2f}s → {len(y)/SR:.2f}s")
    os.makedirs(os.path.dirname(os.path.join(ROOT, ARGS.saida)), exist_ok=True)
    json.dump(out, open(os.path.join(ROOT, ARGS.saida), "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)
    tot = sum(v["duracao"] for k, v in out["cenas"].items() if k not in ("cena-09-stories",))
    print(f"total (versão bio): {tot:.2f}s")


if __name__ == "__main__":
    main()
