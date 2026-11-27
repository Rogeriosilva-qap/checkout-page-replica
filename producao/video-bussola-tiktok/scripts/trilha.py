#!/usr/bin/env python3
"""Trilha ORIGINAL (sintetizada aqui, sem amostras de terceiros) + efeito de glitch.

Só é usada quando public/musica.mp3 não existe. Lê .cache/timeline.json (tempos das cenas)
e gera public/trilha-original.wav na duração exata do vídeo:
  gancho/dor: pulso grave e tique tenso; no Método Bússola entra a bateria (110 BPM, Ré menor);
  impactos curtos nas trocas de cena; acorde final no CTA.
Também gera public/sfx/glitch.wav (ruído digital curto para as trocas).
"""
import json, os, wave
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 48000
rng = np.random.default_rng(11)
import argparse
_ap = argparse.ArgumentParser()
_ap.add_argument("--timeline", default=os.path.join(ROOT, ".cache", "timeline.json"))
_ap.add_argument("--drop", default="metodo", help="cena em que a bateria entra")
_ap.add_argument("--cta", default="cta", help="cena do acorde final")
_ap.add_argument("--out", default="trilha-original.wav", help="arquivo em public/")
ARGS = _ap.parse_args()
TL = json.load(open(ARGS.timeline, encoding="utf-8"))
DUR = TL["total"]
N = int(DUR * SR)
ST = {s["id"]: s["start"] for s in TL["scenes"]}
BPM = 110.0
BEAT = 60 / BPM


def lp(x, cutoff):
    try:
        from scipy.signal import butter, lfilter
        b, a = butter(2, min(0.99, cutoff / (SR / 2)))
        return lfilter(b, a, x)
    except Exception:
        k = max(1, int(SR / cutoff / 2))
        return np.convolve(x, np.ones(k) / k, mode="same")


def add(buf, t, sig):
    i = int(t * SR)
    if i >= len(buf) or i < 0: return
    j = min(len(buf), i + len(sig))
    buf[i:j] += sig[: j - i]


def midi(n): return 440 * 2 ** ((n - 69) / 12)


def kick(a=0.6):
    n = int(.38 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * np.cumsum(44 + 110 * np.exp(-t * 30)) / SR) * np.exp(-t * 10) * a


def snare(a=0.16):
    n = int(.2 * SR); t = np.arange(n) / SR
    return (lp(rng.standard_normal(n), 7000) * np.exp(-t * 24) + .35 * np.sin(2 * np.pi * 200 * t) * np.exp(-t * 30)) * a


def hat(a=0.05):
    n = int(.04 * SR); t = np.arange(n) / SR
    x = rng.standard_normal(n); x = x - lp(x, 6000)
    return x * np.exp(-t * 120) * a


def impact(a=0.5):
    n = int(1.1 * SR); t = np.arange(n) / SR
    body = np.sin(2 * np.pi * (36 + 40 * np.exp(-t * 12)) * t) * np.exp(-t * 3.5)
    nz = lp(rng.standard_normal(n), 2500) * np.exp(-t * 14) * .5
    return (body + nz) * a


def riser(d=0.45, a=0.12):
    n = int(d * SR); t = np.arange(n) / SR
    x = rng.standard_normal(n); x = x - lp(x, 1500)
    return x * (t / d) ** 2 * a


music = np.zeros(N)
t_all = np.arange(N) / SR
T_DROP = ST[ARGS.drop]
T_CTA = ST[ARGS.cta]

# pad grave contínuo (Dm → Bb → F → C), mais aberto depois do drop
CH = [[50, 53, 57], [46, 50, 53], [53, 57, 60], [48, 52, 55]]
bar = 4 * BEAT
k = 0; t = 0.0
while t < DUR:
    n = int(min(2 * bar + .5, DUR - t) * SR)
    if n <= 0: break
    tt = np.arange(n) / SR
    s = sum(np.sin(2 * np.pi * midi(nn) * (1 + d) * tt) for nn in CH[k % 4] for d in (-.0012, .0012))
    env = np.minimum(1, tt / .4) * np.minimum(1, (n / SR - tt) / .4)
    add(music, t, s * env * .03)
    t += 2 * bar; k += 1

# tensão no gancho: grave pulsando em colcheias + tique de relógio
t = 0.0
while t < T_DROP:
    n = int(BEAT / 2 * .8 * SR); tt = np.arange(n) / SR
    add(music, t, np.sin(2 * np.pi * midi(38) * tt) * np.exp(-tt * 9) * .22)
    add(music, t, hat(.06))
    t += BEAT / 2

# bateria + baixo em semicolcheias a partir do Método Bússola
ROOTS = [38, 34, 41, 36]
t = T_DROP; b = 0
while t < T_CTA + 2 * BEAT:
    if b % 4 in (0, 2) or (b % 8 == 7): add(music, t, kick(.55 if b % 4 == 0 else .45))
    if b % 4 in (1, 3): add(music, t, snare())
    root = ROOTS[int((t - T_DROP) / (2 * bar)) % 4]
    for q in range(4):
        n = int(BEAT / 4 * .85 * SR); tt = np.arange(n) / SR
        f0 = midi(root + (12 if q == 2 else 0))
        add(music, t + q * BEAT / 4, (np.sin(2 * np.pi * f0 * tt) + .25 * np.sign(np.sin(2 * np.pi * f0 * tt))) * np.exp(-tt * 14) * .1)
        add(music, t + q * BEAT / 4, hat(.035 if q % 2 else .05))
    t += BEAT; b += 1

# impactos nas trocas de cena, riser antes do drop
for sid, st in ST.items():
    if st > 0.1:
        add(music, st, impact(.45 if sid in (ARGS.drop, ARGS.cta) else .25))
add(music, T_DROP - .45, riser(.45, .16))

# CTA: grade some, acorde final sustentado
i0 = int((T_CTA + 2 * BEAT) * SR)
if i0 < N:
    music[i0:] *= np.exp(-(np.arange(N - i0) / SR) * 2.5)
n = int((DUR - T_CTA) * SR); tt = np.arange(n) / SR
chord = sum(np.sin(2 * np.pi * midi(nn) * tt) * (.05 if nn > 40 else .14) for nn in (38, 50, 57, 62, 65))
add(music, T_CTA, chord * np.minimum(1, tt / .3) * np.exp(-tt * .35))

fo = int(.6 * SR)
music[-fo:] *= np.linspace(1, 0, fo)


def save(path, x, peak=.89):
    x = x / max(1e-9, np.abs(x).max()) * peak
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with wave.open(path, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.stack([x, x], 1) * 32767).astype("<i2").tobytes())


save(os.path.join(ROOT, "public", ARGS.out), music)

# efeito de glitch: rajadas de ruído digital quantizado (≈0,15 s)
n = int(.16 * SR); tt = np.arange(n) / SR
g = rng.standard_normal(n)
g = np.round(g * 3) / 3                      # "bitcrush"
g *= (np.sin(2 * np.pi * 37 * tt) > -.2)     # recortes
g = g - lp(g, 900)
g *= np.exp(-tt * 18)
save(os.path.join(ROOT, "public", "sfx", "glitch.wav"), g, .7)
print(f"trilha original: {DUR:.2f}s · drop em {T_DROP:.2f}s · CTA em {T_CTA:.2f}s")
