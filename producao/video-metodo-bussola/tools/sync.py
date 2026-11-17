#!/usr/bin/env python3
"""Gera projeto/timeline.json (+ timeline.js) e saida/*.srt a partir de projeto/roteiro.json.

Sem áudio: tempos estimados pela velocidade média de fala (prévia).
Com áudio (narracao-metodo-bussola.wav ou .mp3 na pasta do projeto): os cortes entre
legendas são encaixados nas pausas reais da locução (ffmpeg silencedetect), usando a
estimativa proporcional ao texto só como guia. A voz não é alterada.

Uso: python3 tools/sync.py [--audio caminho] [--fps 30]
"""
import argparse, json, os, re, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROTEIRO = os.path.join(ROOT, "projeto", "roteiro.json")
OUT_JSON = os.path.join(ROOT, "projeto", "timeline.json")
OUT_JS = os.path.join(ROOT, "projeto", "timeline.js")
SRT = os.path.join(ROOT, "saida", "metodo-bussola.srt")

CHARS_POR_SEG = 16.5      # ritmo médio de leitura em voz alta (pt-BR)
PAUSA = {"": 0.12, "s": 0.45, "p": 0.75}
INICIO = 0.35             # respiro antes da primeira fala
OUTRO = 2.8               # tempo de tela do fechamento depois da última fala


def find_audio():
    for ext in ("wav", "mp3", "m4a"):
        p = os.path.join(ROOT, f"narracao-metodo-bussola.{ext}")
        if os.path.exists(p):
            return p
    return None


def duration(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                          "-of", "default=nw=1:nk=1", path], capture_output=True, text=True)
    return float(out.stdout.strip())


def silences(path, noise="-34dB", d=0.18):
    p = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", path, "-af",
                        f"silencedetect=noise={noise}:d={d}", "-f", "null", "-"],
                       capture_output=True, text=True)
    starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", p.stderr)]
    ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", p.stderr)]
    total = duration(path)
    if len(ends) < len(starts):
        ends.append(total)
    return list(zip(starts, ends)), total


def weight(c):
    # peso de cada legenda = caracteres falados + pausa que a precede
    return len(c.get("fala", c["legenda"])) / CHARS_POR_SEG


def estimate(caps):
    t = INICIO
    for i, c in enumerate(caps):
        if i:
            t += PAUSA[c["pausa_antes"]]
        c["start"] = round(t, 3)
        t += weight(c)
        c["end"] = round(t, 3)
    return t + OUTRO


def from_audio(caps, path):
    sil, total = silences(path)
    speech_start = sil[0][1] if sil and sil[0][0] < 0.05 else 0.0
    speech_end = sil[-1][0] if sil and sil[-1][1] >= total - 0.05 else total
    # estimativa proporcional dentro do trecho falado
    est_total = estimate(caps) - OUTRO - INICIO
    scale = (speech_end - speech_start) / est_total
    guesses = [speech_start + (c["start"] - INICIO) * scale for c in caps]
    inner = [(a, b) for a, b in sil if a > speech_start + 0.05 and b < speech_end - 0.05]
    used = -1
    starts, ends = [speech_start], []
    for i in range(1, len(caps)):
        g = guesses[i]
        tol = 1.6 if caps[i]["pausa_antes"] else 1.0
        best = None
        for j, (a, b) in enumerate(inner):
            if j <= used:
                continue
            mid = (a + b) / 2
            if abs(mid - g) <= tol and (best is None or abs(mid - g) < abs(sum(inner[best]) / 2 - g)):
                best = j
        if best is not None:
            used = best
            a, b = inner[best]
            ends.append(a)
            starts.append(b)
        else:  # sem pausa clara: corte na estimativa
            ends.append(g)
            starts.append(g)
    ends.append(speech_end)
    for c, s, e in zip(caps, starts, ends):
        c["start"], c["end"] = round(s, 3), round(max(e, s + 0.4), 3)
    return max(total, speech_end + OUTRO)


PALAVRAS = os.path.join(ROOT, "projeto", "palavras.json")


def norm_tokens(text):
    import unicodedata
    t = unicodedata.normalize("NFKD", text.lower())
    t = "".join(ch for ch in t if not unicodedata.combining(ch))
    return re.findall(r"[a-z0-9]+", t)


def from_words(caps, words, audio):
    """Sincroniza pelas palavras transcritas (tools/transcribe.py), com cortes ajustados às pausas reais."""
    import difflib
    sil, total = silences(audio, d=0.12)
    # tokens do roteiro (o que é falado)
    stoks, owner = [], []
    for i, c in enumerate(caps):
        for tk in norm_tokens(c.get("fala", c["legenda"])):
            stoks.append(tk); owner.append(i)
    atoks, atime = [], []
    for w in words:
        for tk in norm_tokens(w["w"]):
            atoks.append(tk); atime.append((w["s"], w["e"]))
    sm = difflib.SequenceMatcher(None, stoks, atoks, autojunk=False)
    tt = [None] * len(stoks)
    for a, b, n in sm.get_matching_blocks():
        for k in range(n):
            tt[a + k] = atime[b + k]
    # interpola tokens sem correspondência
    known = [i for i, x in enumerate(tt) if x]
    for i in range(len(tt)):
        if tt[i] is None:
            prv = max([k for k in known if k < i], default=None); nxt = min([k for k in known if k > i], default=None)
            if prv is None: tt[i] = (tt[nxt][0] - .3, tt[nxt][0])
            elif nxt is None: tt[i] = (tt[prv][1], tt[prv][1] + .3)
            else:
                f = (i - prv) / (nxt - prv); a0, b0 = tt[prv][1], tt[nxt][0]
                tt[i] = (a0 + (b0 - a0) * f, a0 + (b0 - a0) * f + .05)
    def snap_start(t):
        for a, b in sil:
            if a - .05 <= t <= b + .05 or (b > t and b - t < .3 and a <= t + .3):
                return b
        return t
    def snap_end(t):
        for a, b in sil:
            if a - .3 <= t <= b:
                return a
        return t
    for i, c in enumerate(caps):
        idx = [k for k, o in enumerate(owner) if o == i]
        st = snap_start(tt[idx[0]][0]); en = snap_end(tt[idx[-1]][1])
        c["start"], c["end"] = round(st, 3), round(max(en, st + .4), 3)
        # tempo de cada palavra exibida (destaque na legenda)
        disp = c["legenda"].split()
        if "fala" not in c:
            times, k = [], 0
            for w in disp:
                n = max(1, len(norm_tokens(w)))
                times.append(tt[idx[min(k, len(idx) - 1)]][0]); k += n
        else:
            times = [tt[idx[min(len(idx) - 1, round(j * len(idx) / len(disp)))]][0] for j in range(len(disp))]
        times[0] = c["start"]
        c["palavras"] = [round(max(c["start"], x), 3) for x in times]
    for i in range(1, len(caps)):  # sem sobreposição
        if caps[i]["start"] < caps[i - 1]["end"]:
            caps[i - 1]["end"] = caps[i]["start"]
    speech_end = caps[-1]["end"]
    return max(total, speech_end + OUTRO)


def split_lines(text, maxc=34):
    """Quebra equilibrada em no máximo 2 linhas."""
    if len(text) <= maxc:
        return [text]
    words = text.split()
    best = None
    for i in range(1, len(words)):
        a, b = " ".join(words[:i]), " ".join(words[i:])
        score = max(len(a), len(b))
        if best is None or score < best[0]:
            best = (score, [a, b])
    return best[1]


def srt_time(t):
    ms = int(round(t * 1000))
    h, ms = divmod(ms, 3600000)
    m, ms = divmod(ms, 60000)
    s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--audio")
    ap.add_argument("--palavras", help="tempos por palavra (padrão: projeto/palavras.json)")
    ap.add_argument("--fps", type=int, default=30)
    a = ap.parse_args()
    rot = json.load(open(ROTEIRO, encoding="utf-8"))
    caps = rot["legendas"]
    audio = a.audio or find_audio()
    pal = a.palavras or PALAVRAS
    if audio and os.path.exists(pal):
        total = from_words(caps, json.load(open(pal, encoding="utf-8")), audio)
        mode = "audio"
    elif audio:
        total = from_audio(caps, audio)
        mode = "audio"
    else:
        total = estimate(caps)
        mode = "estimado"
    # legenda permanece até a próxima entrar (sem piscar), com teto de 0.6 s após a fala
    for i, c in enumerate(caps):
        nxt = caps[i + 1]["start"] if i + 1 < len(caps) else total - 0.5
        c["show_end"] = round(min(nxt, c["end"] + 0.6), 3)
        c["linhas"] = split_lines(c["legenda"])
    scenes = []
    for s in rot["cenas"]:
        first = next(c for c in caps if c["cena"] == s["id"])
        scenes.append({**s, "start": round(max(0.0, first["start"] - 0.35), 3) if scenes else 0.0})
    total = round(total, 3)
    tl = {"modo": mode, "audio": os.path.relpath(os.path.abspath(audio), ROOT) if audio else None,
          "fps": a.fps, "duracao": total, "cenas": scenes, "legendas": caps}
    with open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump(tl, f, ensure_ascii=False, indent=2)
    with open(OUT_JS, "w", encoding="utf-8") as f:
        f.write("// gerado por tools/sync.py — edite roteiro.json ou timeline.json\n")
        f.write("window.TIMELINE = " + json.dumps(tl, ensure_ascii=False) + ";\n")
    os.makedirs(os.path.dirname(SRT), exist_ok=True)
    with open(SRT, "w", encoding="utf-8") as f:
        for i, c in enumerate(caps, 1):
            f.write(f"{i}\n{srt_time(c['start'])} --> {srt_time(c['show_end'])}\n" + "\n".join(c["linhas"]) + "\n\n")
    print(f"modo={mode} duracao={total:.2f}s legendas={len(caps)}")
    for s in scenes:
        print(f"  cena {s['id']:<12} {s['start']:6.2f}s")


if __name__ == "__main__":
    main()
