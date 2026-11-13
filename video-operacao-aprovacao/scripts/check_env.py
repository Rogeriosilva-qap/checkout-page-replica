"""Verifica o ambiente de produção.

Uso:
  python3 scripts/check_env.py               # Python + FFmpeg
  blender -b -P scripts/check_env.py         # inclui versão do Blender e motores
"""
import shutil
import subprocess
import sys

print(f"Python: {sys.version.split()[0]}")

for tool in ("ffmpeg", "ffprobe"):
    path = shutil.which(tool)
    if path:
        first = subprocess.run([tool, "-version"], capture_output=True, text=True).stdout.splitlines()[0]
        print(f"{tool}: OK ({first})")
    else:
        print(f"{tool}: NÃO ENCONTRADO")

try:
    import bpy  # disponível só dentro do Blender ou com o módulo bpy instalado

    print(f"Blender: {bpy.app.version_string}")
    engines = [e.identifier for e in bpy.types.RenderSettings.bl_rna.properties["engine"].enum_items]
    print(f"Motores: {', '.join(engines)}")
    try:
        prefs = bpy.context.preferences.addons["cycles"].preferences
        prefs.get_devices()
        devs = [f"{d.type}:{d.name}" for d in prefs.devices]
        print(f"Dispositivos Cycles: {', '.join(devs) or 'só CPU'}")
    except Exception as exc:  # noqa: BLE001
        print(f"Dispositivos Cycles: não consultados ({exc})")
except ImportError:
    print("Blender/bpy: NÃO DISPONÍVEL neste interpretador")
