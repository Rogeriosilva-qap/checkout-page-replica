"""Camada 2D de textos da cena 01 (FFmpeg drawtext): nítida, editável e fora das superfícies 3D.

Uso:
  python3 scripts/textos_cena01.py still <entrada.png> <quadro> <saida.png>
  python3 scripts/textos_cena01.py video <entrada.mp4> <saida.mp4>
Área reservada para legendas automáticas: y 1350–1650 px (nenhum texto aqui).
"""
import os
import subprocess
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
BOLD = os.path.join(ROOT, "assets", "fontes", "Poppins-ExtraBold.ttf")
MED = os.path.join(ROOT, "assets", "fontes", "Poppins-Medium.ttf")
FPS = 30

# (texto, fonte, tamanho, cor, y, entra_s, sai_s)
TEXTOS = [
    ("SEU SONHO É", BOLD, 100, "white", 240, 0.30, 4.20),
    ("ENTRAR PARA", BOLD, 100, "white", 392, 0.40, 4.20),
    ("A PMGO?", BOLD, 116, "0xE01A1A", 522, 0.55, 4.20),
    ("Novo concurso em discussão", MED, 48, "0xE4E7EE", 735, 1.20, 4.20),
]
FADE_IN, FADE_OUT, RISE = 0.35, 0.30, 18


def alpha(T, a, b):
    return (f"if(lt({T},{a}),0,if(lt({T},{a + FADE_IN}),({T}-{a})/{FADE_IN},"
            f"if(lt({T},{b - FADE_OUT}),1,if(lt({T},{b}),({b}-{T})/{FADE_OUT},0))))")


GRAD = os.path.join(ROOT, "assets", "overlay_degrade_topo.png")


def degrade():
    """Degradê escuro no topo (alpha 0.6 → 0 até y=1000) para legibilidade; gerado uma vez."""
    if not os.path.exists(GRAD):
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-f", "lavfi", "-i", "color=black:s=1080x1920,format=rgba",
                        "-vf", "geq=r=0:g=0:b=0:a='255*0.62*pow(max(0,1-Y/1000),1.6)'", "-frames:v", "1", GRAD],
                       check=True)
    return GRAD


def filtro(T):
    parts = [f"[0:v]scale=1080:1920:flags=lanczos[b];[1:v]format=rgba[g];"
             f"[b][g]overlay=0:0:format=auto:enable='lt({T},4.2)'"]
    for txt, font, size, color, y, a, b in TEXTOS:
        yy = f"{y}+{RISE}*(1-min(1,max(0,({T}-{a})/{FADE_IN})))"
        parts.append(
            f"drawtext=fontfile='{font}':text='{txt}':fontsize={size}:fontcolor={color}:"
            f"x=(w-text_w)/2:y='{yy}':alpha='{alpha(T, a, b)}':"
            f"shadowcolor=black@0.55:shadowx=0:shadowy=4")
    # fio vermelho entre título e texto secundário
    parts.append(f"drawbox=x=(iw-140)/2:y=700:w=140:h=8:color=0xE01A1A@1:t=fill:enable='between({T},1.0,4.2)'")
    return ",".join(parts)


def main():
    mode = sys.argv[1]
    if mode == "still":
        src, frame, dst = sys.argv[2], int(sys.argv[3]), sys.argv[4]
        T = f"{(frame - 1) / FPS:.4f}"
        cmd = ["ffmpeg", "-loglevel", "error", "-y", "-i", src, "-i", degrade(), "-filter_complex", filtro(T), dst]
    else:
        src, dst = sys.argv[2], sys.argv[3]
        cmd = ["ffmpeg", "-loglevel", "error", "-y", "-i", src, "-loop", "1", "-i", degrade(), "-filter_complex",
               filtro("t"), "-shortest", "-c:v", "libx264",
               "-crf", "18", "-pix_fmt", "yuv420p", "-movflags", "+faststart", dst]
    subprocess.run(cmd, check=True)
    print("ok:", dst)


if __name__ == "__main__":
    main()
