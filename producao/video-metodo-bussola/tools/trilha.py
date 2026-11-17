#!/usr/bin/env python3
"""Trilha ORIGINAL da Operação Aprovação, sintetizada aqui (sem amostras de terceiros).

Lê projeto/timeline.json e gera, na duração exata do vídeo:
  projeto/audio/trilha-original.wav  → pulso tático em Ré menor, 100 BPM (entra no Método Bússola)
  projeto/audio/efeitos.wav          → whoosh nas trocas de cena e "ticks" nos destaques
O render mixa ambos ABAIXO da narração, com ducking (a música abaixa enquanto a voz fala).
"""
import json, os, wave
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TL = json.load(open(os.path.join(ROOT, "projeto/timeline.json"), encoding="utf-8"))
SR = 48000
DUR = TL["duracao"]
N = int(DUR * SR)
rng = np.random.default_rng(7)
BPM = 100.0
BEAT = 60.0 / BPM


def cap(i):
    return next(c for c in TL["legendas"] if c["id"] == i)


def word(cid, needle):
    import unicodedata
    c = cap(cid)
    ws = c["legenda"].split()
    nz = lambda x: "".join(ch for ch in unicodedata.normalize("NFKD", x.lower()) if not unicodedata.combining(ch))
    k = next((j for j, w in enumerate(ws) if needle in nz(w)), 0)
    if c.get("palavras"):
        return c["palavras"][k]
    return c["start"] + (c["end"] - c["start"]) * k / len(ws)


scene = {s["id"]: s["start"] for s in TL["cenas"]}
T_METODO = cap("g3")["start"]
T_END = scene["fechamento"]


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def env_adsr(n, a, r):
    e = np.ones(n)
    na, nr = int(a * SR), int(r * SR)
    if na: e[:na] = np.linspace(0, 1, na)
    if nr: e[-nr:] *= np.linspace(1, 0, nr)
    return e


def add(buf, t, sig):
    i = int(t * SR)
    if i >= len(buf): return
    j = min(len(buf), i + len(sig))
    buf[i:j] += sig[: j - i]


def lp_fast(x, cutoff):
    try:
        from scipy.signal import butter, lfilter
        b, a = butter(2, cutoff / (SR / 2))
        return lfilter(b, a, x)
    except Exception:
        k = max(1, int(SR / cutoff / 2))
        return np.convolve(x, np.ones(k) / k, mode="same")


music = np.zeros(N)
sfx = np.zeros(N)
t_all = np.arange(N) / SR

# ---- pad (Dm – Bb – F – C), 2 compassos por acorde, entrada suave desde o início
CHORDS = [[50, 53, 57, 62], [46, 50, 53, 58], [53, 57, 60, 65], [48, 52, 55, 60]]
bar = 4 * BEAT
pad = np.zeros(N)
k = 0; t = 0.0
while t < DUR:
    ln = 2 * bar
    n = int(min(ln + .6, DUR - t) * SR)
    if n <= 0: break
    tt = np.arange(n) / SR
    s = np.zeros(n)
    for note in CHORDS[k % 4]:
        f = midi(note)
        for det in (-0.12, 0.12):
            ph = rng.uniform(0, 2 * np.pi)
            s += np.sin(2 * np.pi * f * (1 + det / 100) * tt + ph) + 0.35 * np.sin(2 * np.pi * 2 * f * tt + ph)
    s *= env_adsr(n, .9, .8) * 0.035
    add(pad, t, s)
    t += ln; k += 1
pad *= 0.75 + 0.25 * np.sin(2 * np.pi * 0.11 * t_all)  # respiração lenta

# ---- relógio: tique em colcheias desde o início (tensão do gancho), mais baixo depois
def tick(amp, f=5200, d=.025):
    n = int(d * SR); tt = np.arange(n) / SR
    return (rng.standard_normal(n) * 0.5 + np.sin(2 * np.pi * f * tt)) * np.exp(-tt * 180) * amp

t = 0.0; i = 0
while t < T_END + 2 * bar:
    amp = 0.05 if t < T_METODO else 0.028
    add(music, t, tick(amp * (1.25 if i % 2 == 0 else .8)))
    t += BEAT / 2; i += 1

# ---- bumbo, baixo e caixa entram no Método Bússola (grade alinhada a esse instante)
def kick(amp=0.55):
    n = int(.42 * SR); tt = np.arange(n) / SR
    f = 46 + 90 * np.exp(-tt * 28)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 9) * amp

def snare(amp=0.12):
    n = int(.22 * SR); tt = np.arange(n) / SR
    nz = lp_fast(rng.standard_normal(n), 6000)
    return (nz * np.exp(-tt * 22) + 0.4 * np.sin(2 * np.pi * 190 * tt) * np.exp(-tt * 30)) * amp

ROOTS = [38, 34, 41, 36]  # D, Bb, F, C (graves)
t = T_METODO; beat = 0
while t < T_END + 4 * BEAT:
    b_in_bar = beat % 4
    if b_in_bar in (0, 2) or (b_in_bar == 3 and (beat // 4) % 2 == 1):
        add(music, t, kick(0.5 if b_in_bar == 0 else 0.4))
    if b_in_bar in (1, 3):
        add(music, t, snare())
    # baixo pulsado em colcheias
    root = ROOTS[int(((t - 0) / (2 * bar))) % 4]
    for half in (0, 1):
        n = int(BEAT / 2 * 0.9 * SR); tt = np.arange(n) / SR
        f = midi(root)
        s = (np.sin(2 * np.pi * f * tt) + .3 * np.sin(2 * np.pi * 2 * f * tt)) * np.exp(-tt * 6) * 0.17
        add(music, t + half * BEAT / 2, s)
    t += BEAT; beat += 1

music += pad

# a grade rítmica se dissolve no fechamento (fica só o acorde final)
i0 = int((T_END + 0.05) * SR)
music[i0:] *= np.exp(-(np.arange(N - i0) / SR) * 3.0)

# fechamento: acorde final de Ré menor e cauda
n = int(min(4.0, DUR - T_END) * SR)
if n > 0:
    tt = np.arange(n) / SR; s = np.zeros(n)
    for note in (38, 50, 53, 57, 62):
        s += np.sin(2 * np.pi * midi(note) * tt) * (0.07 if note > 40 else 0.16)
    add(music, T_END, s * np.exp(-tt * 0.9))
    add(music, T_END, kick(0.7))

# fades gerais
fi, fo = int(.25 * SR), int(1.8 * SR)
music[:fi] *= np.linspace(0, 1, fi); music[-fo:] *= np.linspace(1, 0, fo)

# ---- efeitos
def whoosh(d=.55, amp=.22):
    n = int(d * SR); tt = np.arange(n) / SR
    nz = rng.standard_normal(n)
    lo = lp_fast(nz, 900); hi = nz - lp_fast(nz, 2500)
    mixw = np.linspace(0, 1, n)
    s = lo * (1 - mixw) + hi * mixw * .5
    e = np.sin(np.pi * np.clip(tt / d, 0, 1)) ** 2
    return s * e * amp

def boom(amp=.35):
    n = int(.9 * SR); tt = np.arange(n) / SR
    return np.sin(2 * np.pi * (38 + 30 * np.exp(-tt * 10)) * tt) * np.exp(-tt * 4) * amp

def click(amp=.18, f=1800):
    n = int(.06 * SR); tt = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * tt) + .5 * np.sin(2 * np.pi * f * 1.5 * tt)) * np.exp(-tt * 70) * amp

for sid in ("extracao", "fatiamento", "priorizacao", "calendario", "fechamento"):
    add(sfx, scene[sid] - .3, whoosh())
    add(sfx, scene[sid] + .1, boom(.25))
add(sfx, T_METODO - .2, whoosh(.5, .18)); add(sfx, T_METODO, boom(.3))
for at in (word("f4", "resolver"), word("f4", "corrigir"), word("p4", "alfa"), word("c2", "19"),
           word("e3", "confira"), word("c4", "revisar"), word("c5", "margem")):
    add(sfx, at + .08, click())
add(sfx, word("g1", "travou") + .02, click(.12, 900))

def save(path, x):
    x = x / max(1e-9, np.max(np.abs(x))) * 0.89
    x2 = np.stack([x, x], axis=1)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with wave.open(path, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x2 * 32767).astype("<i2").tobytes())

save(os.path.join(ROOT, "projeto/audio/trilha-original.wav"), music)
save(os.path.join(ROOT, "projeto/audio/efeitos.wav"), sfx)
print(f"trilha e efeitos gerados: {DUR:.2f}s, {BPM:.0f} BPM, grade a partir de {T_METODO:.2f}s")
