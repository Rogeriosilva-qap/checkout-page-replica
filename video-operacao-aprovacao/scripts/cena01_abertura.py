"""Cena 01 — Abertura cinematográfica (7 s · 30 fps · 1080×1920 · quadros 1–210).

Conceito: o sonho da carreira policial (rua noturna, viatura genérica) → a preparação (mesa de estudo).
Textos NÃO são renderizados aqui: entram como camada 2D na montagem (scripts/textos_cena01.py).

Linha do tempo
  1–60    câmera rente ao asfalto molhado aproxima-se da frente da viatura
  60–120  movimento lateral revela a silhueta (luz de recorte cresce)
  120–134 câmera passa atrás de um poste em primeiro plano (cortina escura) → corte
  134–165 câmera do estudo sai de trás da lateral de uma estante (cortina) e a luminária acende
  165–210 câmera encontra o livro de legislação e o notebook (aproximação lenta)

Uso (bpy):  python scripts/cena01_abertura.py -- --preview --still 105
            python scripts/cena01_abertura.py -- --preview          (210 quadros, só com aprovação)
v4: objetos refinados (viatura PBR, rodas instanciadas, poças, cidade em camadas, estudo detalhado).
Saídas: renders/cena01/abertura_qNNNN.png · blender/cena01_abertura.blend
"""
import math
import os
import random
import sys
import time

import bpy

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import lib_cenario as L  # noqa: E402

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUT = os.path.join(ROOT, "renders", "cena01")
BLEND = os.path.join(ROOT, "blender", "cena01_abertura.blend")

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
PREVIEW = "--preview" in argv
STILL = int(argv[argv.index("--still") + 1]) if "--still" in argv else None
SAMPLES = int(argv[argv.index("--samples") + 1]) if "--samples" in argv else (16 if PREVIEW else 64)

F_START, F_END, F_CUT = 1, 210, 134
STUDY_X = 100.0
random.seed(11)

# ------------------------------------------------------------------ cena
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.frame_start, sc.frame_end = F_START, F_END
sc.render.fps = 30
sc.render.resolution_x, sc.render.resolution_y = 1080, 1920
sc.render.resolution_percentage = 50 if PREVIEW else 100
sc.render.engine = "CYCLES"
sc.cycles.device = "CPU"
sc.cycles.samples = SAMPLES
sc.cycles.use_denoising = True
sc.cycles.max_bounces = 6
sc.cycles.caustics_reflective = sc.cycles.caustics_refractive = False
sc.render.image_settings.file_format = "PNG"
sc.render.filepath = os.path.join(OUT, "seq" if PREVIEW else "seq_final", "abertura_q")   # sequência animada
for vt, look in (("AgX", "AgX - Medium High Contrast"), ("Khronos PBR Neutral", "None")):
    try:
        sc.view_settings.view_transform = vt
        sc.view_settings.look = look
        break
    except TypeError:
        continue

world = bpy.data.worlds.new("Noite")
sc.world = world
world.use_nodes = True
world.node_tree.nodes["Background"].inputs["Color"].default_value = (0.002, 0.004, 0.013, 1)
world.node_tree.nodes["Background"].inputs["Strength"].default_value = 1.0

C_RUA = L.new_collection("Rua")
C_CARRO = L.new_collection("Viatura")
C_ESTUDO = L.new_collection("Estudo")
C_CAM = L.new_collection("Cameras")

# ------------------------------------------------------------------ RUA
asphalt = L.wet_asphalt()
bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 0.6, 0))
road = bpy.context.active_object
road.name = "Asfalto"
road.scale = (140, 10.0, 1)
bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)   # coordenadas do objeto em metros (poças com escala real)
road.data.materials.append(asphalt)
L.to_coll(road, C_RUA)

concrete = L.add_bump(L.principled("Calcada", (0.025, 0.025, 0.027), rough=0.8), "noise", 20, 0.15)
L.box("CalcadaFrente", (140, 4.0, 0.16), (0, -6.2, 0.08), concrete, bev=0.01, coll=C_RUA)
L.box("CalcadaFundo", (140, 5.0, 0.16), (0, 8.1, 0.08), concrete, bev=0.01, coll=C_RUA)

paint = L.principled("FaixaPintura", (0.55, 0.55, 0.52), rough=0.55)
for i, x in enumerate(range(-60, 61, 6)):
    L.box(f"Faixa{i}", (3.0, 0.12, 0.004), (x, 1.9, 0.002), paint, bev=0, coll=C_RUA)
L.box("FaixaBorda", (140, 0.12, 0.004), (0, -3.95, 0.002), paint, bev=0, coll=C_RUA)

# poças: instâncias de uma única malha (posições pensadas para refletir giroflex e faróis)
for i, (px, py, sx, sy, rz) in enumerate(((6.2, -2.1, 2.6, 1.6, 10), (3.7, -0.9, 1.8, 1.1, -20),
                                          (1.0, -3.0, 1.6, 0.9, 35), (-1.2, -2.4, 2.2, 1.2, 5),
                                          (9.5, 0.8, 2.0, 1.0, 0), (-4.0, 1.0, 2.5, 1.3, 15))):
    L.instancia_poca(f"Poca{i}", (px, py), (sx, sy), rz, coll=C_RUA)

for i, x in enumerate((-26, -14, -2, 10, 22, 34)):
    L.poste(f"Poste{i}", (x, 6.6, 0), arm_dir=-1, coll=C_RUA, energy=380)

# prédios em três camadas de profundidade: frente baixa, meio, fundo alto e quase apagado
roof_m = L.principled("Cobertura", (0.008, 0.008, 0.01), rough=0.8)
k = 0
for y0, jit, (hmin, hmax), win in ((14, 3, (6, 14), dict(lit=0.68, dim=0.28)),
                                  (23, 4, (14, 30), dict(lit=0.74, dim=0.20)),
                                  (35, 5, (24, 46), dict(lit=0.84, dim=0.10))):
    x = -64.0
    while x < 64:
        w, d, h = random.uniform(6, 13), random.uniform(5, 10), random.uniform(hmin, hmax)
        yy = y0 + random.uniform(0, jit)
        L.predio(f"Predio{k}", (x + w / 2, yy), (w, d, h), seed=k * 3.7, coll=C_RUA,
                 scale=random.uniform(2.6, 3.8), **win)
        if random.random() < 0.5:   # casa de máquinas / caixa d'água: varia a silhueta
            rw = random.uniform(1.5, 3.5)
            L.box(f"Cobertura{k}", (rw, rw, random.uniform(1.5, 3.0)), (x + w / 2 + random.uniform(-1, 1), yy, h + 1.0),
                  roof_m, bev=0, coll=C_RUA)
        x += w + random.uniform(0.5, 3.0)
        k += 1

for i, (y, s) in enumerate(((11.0, 0.10), (19.0, 0.16), (30.0, 0.24))):
    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, y, 8), rotation=(math.radians(90), 0, 0))
    hz = bpy.context.active_object
    hz.name = f"Nevoa{i}"
    hz.scale = (160, 16, 1)
    hz.data.materials.append(L.haze_material(f"Nevoa{i}", (0.25, 0.35, 0.7), s))
    hz.visible_shadow = False
    L.to_coll(hz, C_RUA)

# poste de concreto em primeiro plano: cortina escura da transição
pole_mat = L.principled("PosteConcreto", (0.02, 0.02, 0.022), rough=0.7)
L.cylinder("PosteCortina", 0.25, 9.0, (-1.14, -6.19, 4.5), pole_mat, verts=32, coll=C_RUA)

# ------------------------------------------------------------------ VIATURA
car = L.viatura("Viatura", (0, 0, 0), 0, coll=C_CARRO)
lr = L.light("GiroflexLuzV", "POINT", (-0.3, -0.45, 1.75), (0, 0, 0), 10, (1.0, 0.05, 0.03), size=0.1, coll=C_CARRO)
lb = L.light("GiroflexLuzA", "POINT", (-0.3, 0.45, 1.75), (0, 0, 0), 10, (0.1, 0.25, 1.0), size=0.1, coll=C_CARRO)
L.animate_lightbar("Viatura", F_START, F_CUT, period=36, lo=1.2, hi=5.0, light_red=lr, light_blue=lb)
for s in (1, -1):
    L.light(f"FarolLuz{s}", "SPOT", (2.4, s * 0.62, 0.66), (0, 90, 0), 70, (1.0, 0.94, 0.85), size=0.08,
            spot=(55, 0.4), coll=C_CARRO)
side = L.light("LuzLateral", "AREA", (1.5, -7.5, 2.2), (72, 0, 8), 25, (0.78, 0.84, 1.0), size=5.0, spread=70,
               coll=C_CARRO)   # luz lateral suave que revela a carroceria
L.key_energy(side, ((F_START, 25), (60, 45), (120, 80)))
rim = L.light("RecorteViatura", "AREA", (-0.6, 5.2, 1.6), (-80, 0, 0), 120, (0.70, 0.80, 1.0), size=3.0,
              spread=50, coll=C_CARRO)
L.key_energy(rim, ((F_START, 120), (60, 160), (120, 520)))  # silhueta ganha força no movimento lateral

# ------------------------------------------------------------------ ESTUDO (x = 100)
X = STUDY_X
wood = L.add_bump(L.principled("MesaMadeira", (0.028, 0.019, 0.014), rough=0.42, coat=0.2), "noise", 8, 0.04)
L.box("Mesa", (1.7, 0.85, 0.045), (X, 0.05, 0.74), wood, bev=0.006, coll=C_ESTUDO)
L.box("MesaPerna1", (0.05, 0.75, 0.72), (X - 0.78, 0.05, 0.36), wood, bev=0.004, coll=C_ESTUDO)
L.box("MesaPerna2", (0.05, 0.75, 0.72), (X + 0.78, 0.05, 0.36), wood, bev=0.004, coll=C_ESTUDO)
wall = L.principled("ParedeEstudo", (0.006, 0.008, 0.016), rough=0.9)
L.box("ParedeFundo", (6, 0.1, 3.2), (X, 1.8, 1.6), wall, bev=0, coll=C_ESTUDO)
L.box("Piso", (6, 5, 0.02), (X, 0.0, -0.01), L.principled("PisoEstudo", (0.012, 0.010, 0.010), rough=0.6),
      bev=0, coll=C_ESTUDO)

# janela com a cidade noturna desfocada (bokeh) — ecoa a rua
win_m = bpy.data.materials.new("JanelaCidade")
win_m.use_nodes = True
nt = win_m.node_tree
nt.nodes.clear()
out = nt.nodes.new("ShaderNodeOutputMaterial")
tc = nt.nodes.new("ShaderNodeTexCoord")
vor = nt.nodes.new("ShaderNodeTexVoronoi")
vor.inputs["Scale"].default_value = 9
L.link(nt, tc.outputs["Generated"], vor.inputs["Vector"])
dots = nt.nodes.new("ShaderNodeMath"); dots.operation = "LESS_THAN"; dots.inputs[1].default_value = 0.09
L.link(nt, vor.outputs["Distance"], dots.inputs[0])
k = nt.nodes.new("ShaderNodeMath"); k.operation = "MULTIPLY"; k.inputs[1].default_value = 5.0
L.link(nt, dots.outputs[0], k.inputs[0])
cr = nt.nodes.new("ShaderNodeValToRGB")
cr.color_ramp.elements[0].color = (*L.WARM, 1)
cr.color_ramp.elements[1].color = (0.25, 0.4, 1.0, 1)
L.link(nt, vor.outputs["Color"], cr.inputs["Fac"])
base = nt.nodes.new("ShaderNodeMix"); base.data_type = "RGBA"
base.inputs["A"].default_value = (0.003, 0.006, 0.02, 1)
L.link(nt, dots.outputs[0], base.inputs["Factor"])
L.link(nt, cr.outputs["Color"], base.inputs["B"])
em = nt.nodes.new("ShaderNodeEmission")
L.link(nt, base.outputs["Result"], em.inputs["Color"])
add_s = nt.nodes.new("ShaderNodeMath"); add_s.operation = "ADD"; add_s.inputs[1].default_value = 0.6
L.link(nt, k.outputs[0], add_s.inputs[0])
L.link(nt, add_s.outputs[0], em.inputs["Strength"])
L.link(nt, em.outputs[0], out.inputs["Surface"])
L.box("Janela", (1.3, 0.02, 1.0), (X + 0.35, 1.74, 1.55), win_m, bev=0, coll=C_ESTUDO)
frame_m = L.principled("Caixilho", (0.02, 0.02, 0.022), rough=0.5)
L.box("CaixilhoV", (0.04, 0.05, 1.0), (X + 0.35, 1.72, 1.55), frame_m, bev=0.004, coll=C_ESTUDO)
L.box("CaixilhoH", (1.3, 0.05, 0.04), (X + 0.35, 1.72, 1.55), frame_m, bev=0.004, coll=C_ESTUDO)

# livro de legislação (sem título renderizado), notebook e apoio
law_cover = L.cover_material("CapaLegislacao", (0.085, 0.006, 0.005), rough=0.45, leather=True)
law = L.livro("LivroLegislacao", 0.25, 0.18, 0.07, law_cover, (X - 0.21, -0.02, 0.7625 + 0.035), -20,
              coll=C_ESTUDO, gold=True)   # lombada com frisos dourados voltada para a câmera
L.marcadores(law, 0.25, 0.18, 0.07, n=8, coll=C_ESTUDO, side="head")
L.caderno("Caderno", (X - 0.02, -0.25, 0.7625), 6, coll=C_ESTUDO)
L.livro("LivroApoio", 0.24, 0.17, 0.04, L.cover_material("CapaApoio", (0.01, 0.012, 0.02)),
        (X - 0.20, 0.17, 0.7625 + 0.02), 8, coll=C_ESTUDO)
L.notebook("Notebook", (X + 0.18, 0.10, 0.7625), -14, coll=C_ESTUDO)
mug = L.principled("Caneca", (0.02, 0.02, 0.025), rough=0.35, coat=0.6)
L.cylinder("Caneca", 0.04, 0.10, (X - 0.52, 0.22, 0.8125), mug, verts=32, bev=0.004, coll=C_ESTUDO)
pen = L.principled("Caneta", (0.6, 0.02, 0.015), rough=0.3, coat=0.5)
L.cylinder("Caneta", 0.005, 0.14, (X + 0.06, -0.22, 0.7765), pen, rot=(0, math.pi / 2, math.radians(25)),
           verts=12, coll=C_ESTUDO)
# estante à esquerda (fundo) com lombadas desfocadas
shelf_m = L.principled("Estante", (0.015, 0.012, 0.011), rough=0.6)
L.box("Estante", (0.06, 0.35, 2.0), (X - 1.05, 1.45, 1.0), shelf_m, bev=0.005, coll=C_ESTUDO)
for i in range(9):
    c = L.cover_material(f"CapaEstante{i}", random.choice([(0.01, 0.012, 0.02), (0.25, 0.006, 0.005),
                                                            (0.04, 0.04, 0.045)]))
    L.livro(f"Estante{i}", random.uniform(0.22, 0.28), 0.17, random.uniform(0.03, 0.05), c,
            (X - 0.95 + i * 0.05, 1.45, 1.25), 90, tilt=(0, 90 + random.uniform(-3, 3), 0), coll=C_ESTUDO)
# lateral de estante em primeiro plano: cortina da transição
L.box("CortinaEstante", (0.24, 0.04, 2.4), (X - 0.514, -1.211, 1.2), shelf_m, bev=0.01, coll=C_ESTUDO).rotation_euler.z = \
    math.radians(-17.5)

# luzes do estudo (acendem depois do corte)
lamp = L.light("Luminaria", "AREA", (X - 0.20, -0.30, 1.32), (22, 0, -10), 0, L.WARM, size=0.22, spread=55,
               coll=C_ESTUDO)   # luz direcionada sobre livro, caderno e notebook
L.key_energy(lamp, ((F_CUT, 2), (F_CUT + 16, 11), (F_END, 12)))
winrim = L.light("RecorteJanela", "AREA", (X + 0.05, 0.95, 1.20), (-62, 0, 0), 0, (0.6, 0.72, 1.0), size=0.8,
                 spread=50, coll=C_ESTUDO)
L.key_energy(winrim, ((F_CUT, 0), (F_CUT + 20, 9)))
fill = L.light("PreenchimentoFrio", "AREA", (X + 0.9, -1.2, 1.6), (60, 0, 40), 0, (0.6, 0.72, 1.0), size=1.0,
               coll=C_ESTUDO)
L.key_energy(fill, ((F_CUT, 0), (F_CUT + 20, 6)))
rimS = L.light("RecorteEstudo", "AREA", (X + 0.2, 1.3, 1.3), (-60, 0, 0), 0, (1.0, 0.25, 0.2), size=0.6, spread=60,
               coll=C_ESTUDO)
L.key_energy(rimS, ((F_CUT, 0), (F_CUT + 25, 10)))
desk_items = bpy.data.collections.new("RecebeRecorteEstudo")
for o in C_ESTUDO.objects:
    if o.type == "MESH" and o.name.split("_")[0] in ("LivroLegislacao", "LivroApoio", "Notebook", "Caneca", "Caneta",
                                                     "Caderno"):
        desk_items.objects.link(o)
rimS.light_linking.receiver_collection = desk_items
winrim.light_linking.receiver_collection = desk_items

# ------------------------------------------------------------------ CÂMERAS
def make_cam(name, lens, fstop):
    cd = bpy.data.cameras.new(name)
    cd.lens, cd.dof.use_dof, cd.dof.aperture_fstop = lens, True, fstop
    cd.clip_start = 0.02
    co = bpy.data.objects.new(name, cd)
    C_CAM.objects.link(co)
    tgt = L.empty(f"{name}_alvo", coll=C_CAM)
    foc = L.empty(f"{name}_foco", coll=C_CAM)
    tr = co.constraints.new("TRACK_TO")
    tr.target, tr.track_axis, tr.up_axis = tgt, "TRACK_NEGATIVE_Z", "UP_Y"
    cd.dof.focus_object = foc
    return co, tgt, foc


def keys(obj, pts):
    for f, p in pts:
        obj.location = p
        obj.keyframe_insert("location", frame=f)


cam_rua, alvo_rua, foco_rua = make_cam("CamRua", 24, 2.8)
keys(cam_rua, ((1, (7.0, -2.4, 0.18)), (60, (5.2, -2.9, 0.28)), (120, (0.8, -6.6, 0.85)), (F_CUT, (-1.2, -6.69, 0.95))))
keys(alvo_rua, ((1, (0.8, 0, 0.6)), (60, (0.6, 0, 0.65)), (120, (0.0, 0, 0.8)), (F_CUT, (-0.4, 0, 0.8))))
keys(foco_rua, ((1, (2.3, -0.5, 0.6)), (60, (2.1, -0.6, 0.65)), (120, (0.0, -0.9, 0.8))))

cam_est, alvo_est, foco_est = make_cam("CamEstudo", 35, 2.2)
keys(cam_est, ((F_CUT, (X - 0.60, -1.55, 1.22)), (150, (X - 0.38, -1.51, 1.20)), (165, (X - 0.25, -1.48, 1.18)), (F_END, (X - 0.06, -1.34, 1.13))))
keys(alvo_est, ((F_CUT, (X - 0.10, 0.03, 0.84)), (165, (X - 0.04, 0.04, 0.83)), (F_END, (X - 0.05, 0.05, 0.82))))
keys(foco_est, ((F_CUT, (X - 0.22, -0.02, 0.80)), (F_END, (X - 0.15, 0.0, 0.81))))

m1 = sc.timeline_markers.new("rua", frame=F_START)
m1.camera = cam_rua
m2 = sc.timeline_markers.new("estudo", frame=F_CUT)
m2.camera = cam_est
sc.camera = cam_rua

# ------------------------------------------------------------------ salvar e renderizar
os.makedirs(OUT, exist_ok=True)
os.makedirs(os.path.dirname(BLEND), exist_ok=True)
bpy.ops.wm.save_as_mainfile(filepath=BLEND)
t0 = time.time()
if STILL is not None:
    sc.frame_set(STILL)
    sc.camera = cam_rua if STILL < F_CUT else cam_est
    sc.render.filepath = os.path.join(OUT, f"abertura_{'q' if PREVIEW else 'f'}{STILL:04d}.png")
    bpy.ops.render.render(write_still=True)
else:
    sc.render.use_overwrite = PREVIEW          # final: retomável, pula quadros já salvos
    bpy.ops.render.render(animation=True)
print(f"ABERTURA: render em {time.time() - t0:.1f}s → {OUT}")
