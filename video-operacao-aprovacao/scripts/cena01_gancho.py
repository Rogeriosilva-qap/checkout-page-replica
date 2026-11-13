"""Cena 1 — Gancho (quadros 1–210, 0:00–0:07).

NÃO TESTADO: escrito para Blender 4.2+ / 5.x, ainda não executado em nenhum Blender.

Uso:
  blender -b -P scripts/cena01_gancho.py -- --still 150   # 1 quadro para validar o visual
  blender -b -P scripts/cena01_gancho.py -- --preview     # sequência a 50%, 16 amostras
  blender -b -P scripts/cena01_gancho.py                  # final: 100%, 64 amostras
Saída: renders/cena01/  (também salva cena01.blend para abrir e ajustar)
"""
import math
import os
import sys

import bpy

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUT = os.path.join(ROOT, "renders", "cena01")
FONT_BOLD = os.path.join(ROOT, "assets", "fontes", "Montserrat-ExtraBold.ttf")
FONT_REG = os.path.join(ROOT, "assets", "fontes", "Montserrat-Medium.ttf")

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
PREVIEW = "--preview" in argv
STILL = int(argv[argv.index("--still") + 1]) if "--still" in argv else None

F_START, F_END = 1, 210

NAVY_BG = (0.0021, 0.0037, 0.0070)    # #070B14 linear
NAVY = (0.0044, 0.0103, 0.0331)       # #0E1A33 linear
WHITE = (0.888, 0.905, 0.930)         # #F2F4F7 linear
RED = (0.672, 0.019, 0.047)           # #D7263D linear


# ---------- utilidades ----------
def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def mat(name, color, rough=0.5, metal=0.0, emit=0.0, coat=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*color, 1)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    if "Coat Weight" in b.inputs:
        b.inputs["Coat Weight"].default_value = coat
    if emit:
        b.inputs["Emission Color"].default_value = (*color, 1)
        b.inputs["Emission Strength"].default_value = emit
    return m


def box(name, size, loc, material, bevel=0.004):
    bpy.ops.mesh.primitive_cube_add(location=loc)
    o = bpy.context.active_object
    o.name = name
    o.scale = (size[0] / 2, size[1] / 2, size[2] / 2)
    bpy.ops.object.transform_apply(scale=True)
    mod = o.modifiers.new("Bevel", "BEVEL")
    mod.width, mod.segments = bevel, 3
    o.data.materials.append(material)
    bpy.ops.object.shade_smooth()
    return o


def load_font(path):
    return bpy.data.fonts.load(path) if os.path.exists(path) else None


def text(name, body, loc, size, material, font=None, extrude=0.012):
    cu = bpy.data.curves.new(name, "FONT")
    cu.body = body
    cu.align_x, cu.align_y = "CENTER", "CENTER"
    cu.size, cu.extrude = size, extrude
    cu.bevel_depth, cu.bevel_resolution = extrude * 0.25, 2
    if font:
        cu.font = font
    o = bpy.data.objects.new(name, cu)
    bpy.context.collection.objects.link(o)
    o.location = loc
    o.rotation_euler = (math.radians(90), 0, 0)  # de frente para a câmera (-Y)
    o.data.materials.append(material)
    return o


def ease_keys(obj):
    if obj.animation_data and obj.animation_data.action:
        for fc in getattr(obj.animation_data.action, "fcurves", []):
            for k in fc.keyframe_points:
                k.interpolation, k.easing = "BEZIER", "AUTO"


def reveal(obj, frame, rise=0.08, dur=12):
    """Entrada: sobe 8 cm e cresce de 92% a 100%. Fica invisível antes do quadro."""
    final = obj.location.copy()
    obj.hide_render = True
    obj.keyframe_insert("hide_render", frame=frame - 1)
    obj.hide_render = False
    obj.keyframe_insert("hide_render", frame=frame)
    obj.location.z = final.z - rise
    obj.scale = (0.92,) * 3
    obj.keyframe_insert("location", frame=frame)
    obj.keyframe_insert("scale", frame=frame)
    obj.location = final
    obj.scale = (1,) * 3
    obj.keyframe_insert("location", frame=frame + dur)
    obj.keyframe_insert("scale", frame=frame + dur)
    ease_keys(obj)


# ---------- cena ----------
reset()
scene = bpy.context.scene
scene.frame_start, scene.frame_end = F_START, F_END
scene.render.fps = 30
scene.render.resolution_x, scene.render.resolution_y = 1080, 1920
scene.render.resolution_percentage = 50 if PREVIEW else 100
scene.render.engine = "CYCLES"
scene.cycles.device = "CPU"
scene.cycles.samples = 16 if PREVIEW else 64
scene.cycles.use_denoising = True
scene.render.image_settings.file_format = "PNG"
scene.render.filepath = os.path.join(OUT, "cena01_")
try:
    scene.view_settings.view_transform = "AgX"
    scene.view_settings.look = "AgX - Medium High Contrast"
except TypeError:
    pass  # nomes de "look" variam entre versões; mantém o padrão

world = bpy.data.worlds.new("Mundo")
scene.world = world
world.use_nodes = True
world.node_tree.nodes["Background"].inputs["Color"].default_value = (*NAVY_BG, 1)
world.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.6

# materiais
m_desk = mat("Mesa", NAVY, rough=0.35, coat=0.3)
m_wall = mat("Fundo", NAVY_BG, rough=0.9)
m_book1 = mat("LivroMarinho", NAVY, rough=0.75)
m_book2 = mat("LivroBranco", WHITE, rough=0.8)
m_book3 = mat("LivroVermelho", RED, rough=0.7)
m_pages = mat("Paginas", (0.80, 0.77, 0.70), rough=0.9)
m_phone = mat("Celular", (0.01, 0.01, 0.012), rough=0.25, metal=0.6)
m_screen = mat("Tela", (0.05, 0.09, 0.20), rough=0.2, emit=1.5)
m_title = mat("Titulo", WHITE, rough=0.35, coat=0.5)
m_red = mat("Acento", RED, rough=0.3, emit=0.6)
m_sub = mat("Subtitulo", (0.55, 0.60, 0.70), rough=0.5)

# set: mesa + parede de fundo
box("Mesa", (4.0, 2.0, 0.06), (0, 0.4, 0.72), m_desk, bevel=0.01)
box("Parede", (8.0, 0.1, 6.0), (0, 2.6, 2.0), m_wall, bevel=0)

# pilha de livros (sem nenhum título ou marca)
y0, x0, top = 0.35, -0.55, 0.75
for i, (w, d, h, m, rot) in enumerate([
    (0.42, 0.30, 0.05, m_book1, 4),
    (0.40, 0.28, 0.04, m_book2, -3),
    (0.38, 0.27, 0.045, m_book3, 7),
]):
    b = box(f"Livro{i}", (w, d, h), (x0, y0, top + h / 2), m)
    b.rotation_euler.z = math.radians(rot)
    p = box(f"Paginas{i}", (w - 0.02, d - 0.01, h * 0.8), (x0 + 0.01, y0, top + h / 2), m_pages, bevel=0.002)
    p.rotation_euler.z = math.radians(rot)
    top += h

# celular deitado com a tela acesa
phone = box("Celular", (0.08, 0.16, 0.009), (0.48, 0.25, 0.755), m_phone, bevel=0.008)
phone.rotation_euler.z = math.radians(-18)
scr = box("Tela", (0.072, 0.15, 0.001), (0.48, 0.25, 0.7605), m_screen, bevel=0)
scr.rotation_euler.z = math.radians(-18)

# textos (área segura: dentro do quadro central)
fb, fr = load_font(FONT_BOLD), load_font(FONT_REG)
t1 = text("T1", "VOCÊ QUER ENTRAR\nPARA A POLÍCIA?", (0, 1.1, 1.85), 0.20, m_title, fb)
bar = box("FioVermelho", (0.9, 0.01, 0.012), (0, 1.1, 1.55), m_red, bevel=0.002)
t2 = text("T2", "NOVO CONCURSO\nPMGO?", (0, 1.1, 1.28), 0.17, m_title, fb)
t3 = text("T3", "Edital e data: só com confirmação oficial.", (0, 1.1, 1.06), 0.055, m_sub, fr, extrude=0.003)

reveal(t1, 20)
reveal(bar, 32, rise=0.0)
# T1 sai suavemente para ceder espaço; T2 entra no lugar
t1.keyframe_insert("location", frame=100)
t1.location.z += 0.12
t1.keyframe_insert("location", frame=112)
ease_keys(t1)
reveal(t2, 110)
reveal(t3, 140, rise=0.03)

# luzes
def area(name, loc, rot, energy, size, color):
    d = bpy.data.lights.new(name, "AREA")
    d.energy, d.size, d.color = energy, size, color
    o = bpy.data.objects.new(name, d)
    scene.collection.objects.link(o)
    o.location, o.rotation_euler = loc, [math.radians(a) for a in rot]
    return o

area("Key", (-2.0, -1.5, 3.0), (50, 0, -45), 450, 1.5, (1.0, 0.93, 0.85))   # ~4500 K
area("Rim", (1.8, 2.2, 2.6), (-60, 0, 150), 600, 1.0, (0.65, 0.78, 1.0))   # contraluz frio
area("Fill", (1.5, -2.5, 1.2), (75, 0, 30), 60, 3.0, (0.85, 0.9, 1.0))

# câmera: dolly-in lento + puxada de foco (livros -> título)
cam_data = bpy.data.cameras.new("Cam")
cam_data.lens = 35
cam_data.dof.use_dof = True
cam_data.dof.aperture_fstop = 2.8
cam = bpy.data.objects.new("Cam", cam_data)
scene.collection.objects.link(cam)
scene.camera = cam

target = bpy.data.objects.new("Alvo", None)
scene.collection.objects.link(target)
target.location = (0, 0.9, 1.3)
track = cam.constraints.new("TRACK_TO")
track.target, track.track_axis, track.up_axis = target, "TRACK_NEGATIVE_Z", "UP_Y"

focus = bpy.data.objects.new("Foco", None)
scene.collection.objects.link(focus)
cam_data.dof.focus_object = focus

cam.location = (0, -3.6, 1.55)
cam.keyframe_insert("location", frame=F_START)
cam.location = (0, -3.0, 1.45)
cam.keyframe_insert("location", frame=F_END)
focus.location = (-0.55, 0.35, 0.85)
focus.keyframe_insert("location", frame=1)
focus.keyframe_insert("location", frame=10)
focus.location = (0, 1.1, 1.6)
focus.keyframe_insert("location", frame=30)
ease_keys(cam)
ease_keys(focus)

os.makedirs(OUT, exist_ok=True)
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, "cena01.blend"))

if STILL is not None:
    scene.frame_set(STILL)
    scene.render.filepath = os.path.join(OUT, f"still_{STILL:04d}.png")
    bpy.ops.render.render(write_still=True)
else:
    bpy.ops.render.render(animation=True)
print("CENA01: render concluído em", OUT)
