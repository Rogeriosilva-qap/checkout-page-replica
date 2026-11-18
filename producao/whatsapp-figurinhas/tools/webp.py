#!/usr/bin/env python3
"""Converte png/*.png em webp/*.webp (512×512, transparente, <100 KB, padrão de figurinha do WhatsApp)."""
import glob, io, os
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.makedirs(os.path.join(ROOT, "webp"), exist_ok=True)
for f in sorted(glob.glob(os.path.join(ROOT, "png", "*.png"))):
    im = Image.open(f).convert("RGBA").resize((512, 512))
    for q in (90, 80, 70, 60, 50):
        b = io.BytesIO(); im.save(b, "WEBP", quality=q, method=6)
        if b.tell() < 100_000: break
    out = os.path.join(ROOT, "webp", os.path.basename(f)[:-4] + ".webp")
    open(out, "wb").write(b.getvalue())
    print(f"{os.path.basename(out)}: {b.tell()//1024} KB (q{q})")
# ícone da bandeja (96×96) para apps de pacote de figurinhas
Image.open(os.path.join(ROOT, "png", "08-selo.png")).convert("RGBA").resize((96, 96), Image.LANCZOS).save(os.path.join(ROOT, "webp", "tray-icon.png"))
