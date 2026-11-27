#!/usr/bin/env python3
"""Transcreve a locução com tempos por palavra (faster-whisper) → projeto/palavras.json.
O sync.py usa esse arquivo para encaixar legendas, destaques e cortes na fala real.
Uso: python3 tools/transcribe.py CAMINHO_DO_MODELO [audio]
Modelo usado nesta versão: Whisper small (CTranslate2 int8), licença MIT."""
import json, os, subprocess, sys
import numpy as np
from faster_whisper import WhisperModel
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
model = sys.argv[1]
audio = sys.argv[2] if len(sys.argv) > 2 else os.path.join(ROOT, "narracao-metodo-bussola.wav")
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", audio, "-ac", "1", "-ar", "16000", "-f", "f32le", "-"], capture_output=True).stdout
segs, _ = WhisperModel(model, device="cpu", compute_type="int8").transcribe(
    np.frombuffer(raw, np.float32), language="pt", word_timestamps=True, beam_size=5,
    initial_prompt="Método Bússola, edital, retificações, concordância verbal, Alfa, Bravo, Charlie.")
words = []
for s in segs:
    print(f"[{s.start:6.2f}-{s.end:6.2f}] {s.text}")
    words += [dict(w=x.word.strip(), s=round(x.start, 3), e=round(x.end, 3)) for x in s.words]
json.dump(words, open(os.path.join(ROOT, "projeto/palavras.json"), "w"), ensure_ascii=False, indent=0)
