"""Cena 1 — Gancho (quadros 1–210, 0:00–0:07) · v2 "cinematográfica".

Testado com bpy 5.3.0 (Cycles CPU).
Uso:
  blender -b -P scripts/cena01_gancho.py -- --still 150 --preview   # 1 quadro 540×960
  blender -b -P scripts/cena01_gancho.py -- --preview               # sequência 540×960, 16 amostras
  blender -b -P scripts/cena01_gancho.py                            # final 1080×1920, 64 amostras
  (com o módulo bpy: python scripts/cena01_gancho.py -- ...)
Versão anterior: renders/cena01/backup_v1/

Linha do tempo
  1–30    escuro, foco nos livros, câmera avança devagar
  28–78   feixe vermelho varre o título da esquerda para a direita e o revela
  40–75   foco passa dos livros para o título
  80–98   fio vermelho se abre sob o título
  100–114 "NOVO CONCURSO PMGO?" entra
  128–140 aviso entra
  até 210 câmera continua o avanço lento (dolly + leve subida)
"""
import math
import os
import random
import sys
import time

import bpy

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUT = os.path.join(ROOT, "renders", "cena01")
FONT_BOLD = os.path.join(ROOT, "assets", "fontes", "Poppins-ExtraBold.ttf")
FONT_REG = os.path.join(ROOT, "assets", "fontes", "Poppins-Medium.ttf")

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
PREVIEW = "--preview" in argv
STILL = int(argv[argv.index("--still") + 1]) if "--still" in argv else None
SAMPLES = int(argv[argv.index("--samples") + 1]) if "--samples" in argv else (16 if PREVIEW else 64)

F_START, F_END = 1, 210
random.seed(7)

# paleta (valores lineares)
BLACK = (0.0035, 0.0035, 0.0042)      # grafite quase preto
GRAPHITE = (0.010, 0.010, 0.012)
NAVY_SHADOW = (0.0012, 0.0024, 0.0080)
WHITE = (0.888, 0.905, 0.930)
RED = (0.745, 0.013, 0.010)           # vermelho da capa (~#E01A1A)
PAPER = (0.74, 0.70, 0.62)

DESK_Z = 0.95                         # tampo da mesa
TEXT_Y = 1.0                          # plano dos textos
BEAM_START, BEAM_END = 28, 78         # varredura do feixe
TITLE_HALF_W = 1.0                    # varredura de x = -1.0 a +1.0


# ---------------------------------------------------------------- utilidades
def link(nt, a, b):
    nt.links.new(a, b)


def principled(name, color, rough=0.5, metal=0.0, coat=0.0, coat_rough=0.1):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*color, 1)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    b.inputs["Coat Weight"].default_value = coat
    b.inputs["Coat Roughness"].default_value = coat_rough
    return m, b


def add_bump(m, bsdf, kind, scale, strength, coord="Object", **kw):
    """Relevo procedural barato (sem imagens): tecido/couro ou linhas de página."""
    nt = m.node_tree
    tc = nt.nodes.new("ShaderNodeTexCoord")
    if kind == "noise":
        tex = nt.nodes.new("ShaderNodeTexNoise")
        tex.inputs["Scale"].default_value = scale
        tex.inputs["Detail"].default_value = 4
    else:
        tex = nt.nodes.new("ShaderNodeTexWave")
        tex.wave_type = "BANDS"
        tex.bands_direction = kw.get("axis", "Z")
        tex.inputs["Scale"].default_value = scale
        tex.inputs["Distortion"].default_value = 2.0
        tex.inputs["Detail"].default_value = 1.0
    link(nt, tc.outputs[coord], tex.inputs["Vector"])
    bump = nt.nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = strength
    link(nt, tex.outputs["Fac"], bump.inputs["Height"])
    link(nt, bump.outputs["Normal"], bsdf.inputs["Normal"])
    return tex


def obj_box(name, size, loc, material, bevel=0.003, segs=3, parent=None):
    bpy.ops.mesh.primitive_cube_add(location=loc)
    o = bpy.context.active_object
    o.name = name
    o.scale = (size[0] / 2, size[1] / 2, size[2] / 2)
    bpy.ops.object.transform_apply(scale=True)
    if bevel:
        mod = o.modifiers.new("Bevel", "BEVEL")
        mod.width, mod.segments = bevel, segs
        mod.limit_method = "ANGLE"
    o.data.materials.append(material)
    bpy.ops.object.shade_smooth()
    if parent:
        o.parent = parent
    return o


def empty(name, loc=(0, 0, 0), rot=(0, 0, 0)):
    e = bpy.data.objects.new(name, None)
    bpy.context.scene.collection.objects.link(e)
    e.location, e.rotation_euler = loc, rot
    return e


# ---------------------------------------------------------------- cena base
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.frame_start, scene.frame_end = F_START, F_END
scene.render.fps = 30
scene.render.resolution_x, scene.render.resolution_y = 1080, 1920
scene.render.resolution_percentage = 50 if PREVIEW else 100
scene.render.engine = "CYCLES"
scene.cycles.device = "CPU"
scene.cycles.samples = SAMPLES
scene.cycles.use_denoising = True
scene.cycles.max_bounces = 6
scene.cycles.transparent_max_bounces = 8
scene.render.image_settings.file_format = "PNG"
scene.render.filepath = os.path.join(OUT, "cena01_")
for vt, look in (("Khronos PBR Neutral", "None"), ("AgX", "AgX - Medium High Contrast")):
    try:
        scene.view_settings.view_transform = vt
        scene.view_settings.look = look
        break
    except TypeError:
        continue

world = bpy.data.worlds.new("Mundo")
scene.world = world
world.use_nodes = True
bg = world.node_tree.nodes["Background"]
bg.inputs["Color"].default_value = (*NAVY_SHADOW, 1)   # sombras puxam para o marinho
bg.inputs["Strength"].default_value = 0.5

# ---------------------------------------------------------------- materiais
m_desk, b_desk = principled("Mesa", GRAPHITE, rough=0.7)
add_bump(m_desk, b_desk, "noise", 60, 0.03)
m_wall, _ = principled("Fundo", BLACK, rough=0.95)

m_pages, b_pages = principled("Paginas", PAPER, rough=0.85)
add_bump(m_pages, b_pages, "wave", 900, 0.25, axis="Z")       # linhas das folhas

covers = {}
for key, col, rough in (("preto", (0.012, 0.012, 0.014), 0.55),
                        ("vermelho", RED, 0.5),
                        ("marinho", (0.006, 0.012, 0.040), 0.55),
                        ("grafite", (0.045, 0.045, 0.05), 0.5)):
    m, bsdf = principled(f"Capa_{key}", col, rough=rough, coat=0.15, coat_rough=0.35)
    add_bump(m, bsdf, "noise", 700, 0.06)                       # textura de percalina
    covers[key] = m

m_phone_body, _ = principled("CelularCorpo", (0.035, 0.035, 0.04), rough=0.28, metal=1.0)
m_glass, _ = principled("Vidro", (0.0, 0.0, 0.0), rough=0.04, coat=1.0, coat_rough=0.02)

# tela do celular: gradiente marinho escuro + faixa vermelha fina (sem marcas)
m_screen = bpy.data.materials.new("Tela")
m_screen.use_nodes = True
nt = m_screen.node_tree
nt.nodes.clear()
out = nt.nodes.new("ShaderNodeOutputMaterial")
tc = nt.nodes.new("ShaderNodeTexCoord")
sep = nt.nodes.new("ShaderNodeSeparateXYZ")
link(nt, tc.outputs["Generated"], sep.inputs["Vector"])
ramp = nt.nodes.new("ShaderNodeValToRGB")
ramp.color_ramp.elements[0].color = (0.004, 0.008, 0.03, 1)
ramp.color_ramp.elements[1].position = 0.55
ramp.color_ramp.elements[1].color = (0.015, 0.03, 0.09, 1)
e = ramp.color_ramp.elements.new(0.60)
e.color = (*RED, 1)
e2 = ramp.color_ramp.elements.new(0.62)
e2.color = (0.015, 0.03, 0.09, 1)
link(nt, sep.outputs["Y"], ramp.inputs["Fac"])
em = nt.nodes.new("ShaderNodeEmission")
em.inputs["Strength"].default_value = 1.2
link(nt, ramp.outputs["Color"], em.inputs["Color"])
gl = nt.nodes.new("ShaderNodeBsdfPrincipled")
gl.inputs["Base Color"].default_value = (0, 0, 0, 1)
gl.inputs["Roughness"].default_value = 0.03
add = nt.nodes.new("ShaderNodeAddShader")
link(nt, em.outputs[0], add.inputs[0])
link(nt, gl.outputs[0], add.inputs[1])
link(nt, add.outputs[0], out.inputs["Surface"])

m_red_bar, b_red_bar = principled("FioVermelho", RED, rough=0.3)
b_red_bar.inputs["Emission Color"].default_value = (*RED, 1)
b_red_bar.inputs["Emission Strength"].default_value = 1.5
m_t2, b_t2 = principled("Chamada", RED, rough=0.35, coat=0.3)
b_t2.inputs["Emission Color"].default_value = (*RED, 1)
b_t2.inputs["Emission Strength"].default_value = 0.25
m_sub, _ = principled("Aviso", (0.62, 0.64, 0.70), rough=0.5)


# título: revelado pela varredura do feixe (limiar em X animado) + borda incandescente
def title_material():
    m = bpy.data.materials.new("Titulo")
    m.use_nodes = True
    nt = m.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    tc = nt.nodes.new("ShaderNodeTexCoord")
    sep = nt.nodes.new("ShaderNodeSeparateXYZ")
    link(nt, tc.outputs["Object"], sep.inputs["Vector"])
    thr = nt.nodes.new("ShaderNodeValue")
    thr.name = "Limiar"
    # revelado = 1 quando x < limiar (transição de 4 cm)
    lo = nt.nodes.new("ShaderNodeMath"); lo.operation = "SUBTRACT"
    lo.inputs[1].default_value = 0.04
    link(nt, thr.outputs[0], lo.inputs[0])
    mr = nt.nodes.new("ShaderNodeMapRange")
    mr.clamp = True
    link(nt, sep.outputs["X"], mr.inputs["Value"])
    link(nt, thr.outputs[0], mr.inputs["From Min"])
    link(nt, lo.outputs[0], mr.inputs["From Max"])
    # borda: 1 − |x − limiar| / 0.10
    d = nt.nodes.new("ShaderNodeMath"); d.operation = "SUBTRACT"
    link(nt, sep.outputs["X"], d.inputs[0]); link(nt, thr.outputs[0], d.inputs[1])
    ab = nt.nodes.new("ShaderNodeMath"); ab.operation = "ABSOLUTE"
    link(nt, d.outputs[0], ab.inputs[0])
    edge = nt.nodes.new("ShaderNodeMapRange"); edge.clamp = True
    edge.inputs["From Min"].default_value = 0.0
    edge.inputs["From Max"].default_value = 0.10
    edge.inputs["To Min"].default_value = 1.0
    edge.inputs["To Max"].default_value = 0.0
    link(nt, ab.outputs[0], edge.inputs["Value"])
    # superfície branca, transparência e emissão vermelha
    white = nt.nodes.new("ShaderNodeBsdfPrincipled")
    white.inputs["Base Color"].default_value = (*WHITE, 1)
    white.inputs["Roughness"].default_value = 0.38
    white.inputs["Coat Weight"].default_value = 0.3
    transp = nt.nodes.new("ShaderNodeBsdfTransparent")
    mix = nt.nodes.new("ShaderNodeMixShader")
    link(nt, mr.outputs["Result"], mix.inputs["Fac"])
    link(nt, transp.outputs[0], mix.inputs[1])
    link(nt, white.outputs[0], mix.inputs[2])
    glow_amt = nt.nodes.new("ShaderNodeMath"); glow_amt.operation = "MULTIPLY"
    glow_amt.inputs[1].default_value = 12.0
    link(nt, edge.outputs["Result"], glow_amt.inputs[0])
    emi = nt.nodes.new("ShaderNodeEmission")
    emi.inputs["Color"].default_value = (*RED, 1)
    link(nt, glow_amt.outputs[0], emi.inputs["Strength"])
    add = nt.nodes.new("ShaderNodeAddShader")
    link(nt, mix.outputs[0], add.inputs[0]); link(nt, emi.outputs[0], add.inputs[1])
    link(nt, add.outputs[0], out.inputs["Surface"])
    return m, thr


# lâmina do feixe: plano emissivo com núcleo fino e halo suave (bloom falso, sem pós-processo)
def beam_material():
    m = bpy.data.materials.new("Feixe")
    m.use_nodes = True
    nt = m.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    tc = nt.nodes.new("ShaderNodeTexCoord")
    sep = nt.nodes.new("ShaderNodeSeparateXYZ")
    link(nt, tc.outputs["Generated"], sep.inputs["Vector"])

    def falloff(sock, power):
        a = nt.nodes.new("ShaderNodeMath"); a.operation = "SUBTRACT"; a.inputs[1].default_value = 0.5
        link(nt, sock, a.inputs[0])
        b = nt.nodes.new("ShaderNodeMath"); b.operation = "ABSOLUTE"; link(nt, a.outputs[0], b.inputs[0])
        c = nt.nodes.new("ShaderNodeMapRange"); c.clamp = True
        c.inputs["From Min"].default_value = 0.0; c.inputs["From Max"].default_value = 0.5
        c.inputs["To Min"].default_value = 1.0; c.inputs["To Max"].default_value = 0.0
        link(nt, b.outputs[0], c.inputs["Value"])
        p = nt.nodes.new("ShaderNodeMath"); p.operation = "POWER"; p.inputs[1].default_value = power
        link(nt, c.outputs["Result"], p.inputs[0])
        return p.outputs[0]

    core = falloff(sep.outputs["X"], 40.0)
    halo = falloff(sep.outputs["X"], 5.0)
    vert = falloff(sep.outputs["Y"], 0.7)
    k1 = nt.nodes.new("ShaderNodeMath"); k1.operation = "MULTIPLY"; k1.inputs[1].default_value = 25.0
    link(nt, core, k1.inputs[0])
    k2 = nt.nodes.new("ShaderNodeMath"); k2.operation = "MULTIPLY"; k2.inputs[1].default_value = 1.6
    link(nt, halo, k2.inputs[0])
    s = nt.nodes.new("ShaderNodeMath"); s.operation = "ADD"
    link(nt, k1.outputs[0], s.inputs[0]); link(nt, k2.outputs[0], s.inputs[1])
    sv = nt.nodes.new("ShaderNodeMath"); sv.operation = "MULTIPLY"
    link(nt, s.outputs[0], sv.inputs[0]); link(nt, vert, sv.inputs[1])
    master = nt.nodes.new("ShaderNodeValue"); master.name = "Intensidade"
    sm = nt.nodes.new("ShaderNodeMath"); sm.operation = "MULTIPLY"
    link(nt, sv.outputs[0], sm.inputs[0]); link(nt, master.outputs[0], sm.inputs[1])
    emi = nt.nodes.new("ShaderNodeEmission")
    emi.inputs["Color"].default_value = (1.0, 0.06, 0.04, 1)
    link(nt, sm.outputs[0], emi.inputs["Strength"])
    tr = nt.nodes.new("ShaderNodeBsdfTransparent")
    add = nt.nodes.new("ShaderNodeAddShader")
    link(nt, tr.outputs[0], add.inputs[0]); link(nt, emi.outputs[0], add.inputs[1])
    link(nt, add.outputs[0], out.inputs["Surface"])
    return m, master


# ---------------------------------------------------------------- cenário
obj_box("Mesa", (7.0, 6.0, 0.08), (0, -0.4, DESK_Z - 0.04), m_desk, bevel=0.01)
obj_box("Parede", (12.0, 0.1, 8.0), (0, 2.8, 3.0), m_wall, bevel=0)


def book(name, L, W, H, cover, loc, rotz, tilt=(0.0, 0.0)):
    """Livro de capa dura: duas capas com cantos arredondados, lombada curva e miolo de páginas."""
    root = empty(name, loc, (math.radians(tilt[0]), math.radians(tilt[1]), math.radians(rotz)))
    ct, oh = 0.0045, 0.006                      # espessura da capa e sobra além das páginas
    pages_h = H - 2 * ct
    wp = W - oh - 0.006
    obj_box(f"{name}_paginas", (L - 2 * oh, wp, pages_h * random.uniform(0.97, 1.0)),
            (0, -W / 2 + 0.006 + wp / 2, 0), m_pages, bevel=0.0015, segs=2, parent=root)
    for sgn in (1, -1):
        obj_box(f"{name}_capa{sgn}", (L, W, ct), (0, 0.001, sgn * (H / 2 - ct / 2)), cover,
                bevel=0.0035, segs=4, parent=root)
    bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=1, depth=L,
                                        location=(0, -W / 2 + 0.006, 0), rotation=(0, math.pi / 2, 0))
    sp = bpy.context.active_object
    sp.name = f"{name}_lombada"
    sp.scale = (H / 2, 0.011, 1)
    sp.data.materials.append(cover)
    bpy.ops.object.shade_smooth()
    sp.parent = root
    # nervuras da lombada (dois frisos discretos, sem texto)
    for xo in (-L * 0.38, L * 0.38):
        bpy.ops.mesh.primitive_torus_add(major_radius=1, minor_radius=0.08, major_segments=32, minor_segments=8,
                                         location=(xo, -W / 2 + 0.006, 0), rotation=(0, math.pi / 2, 0))
        r = bpy.context.active_object
        r.scale = (H / 2 * 1.02, 0.0115, 1)
        r.data.materials.append(cover)
        bpy.ops.object.shade_smooth()
        r.parent = root
    return root


# pilha central logo abaixo do texto, com lombadas viradas para a câmera
stack_x, stack_y = -0.10, 0.55
z = DESK_Z
for i, (L, W, H, c, rz) in enumerate([
    (0.62, 0.44, 0.075, "preto", -3.0),
    (0.58, 0.41, 0.060, "marinho", 4.5),
    (0.55, 0.39, 0.068, "vermelho", -6.5),
    (0.52, 0.37, 0.055, "grafite", 3.0),
]):
    book(f"Livro{i}", L, W, H, covers[c],
         (stack_x + random.uniform(-0.025, 0.025), stack_y + random.uniform(-0.02, 0.02), z + H / 2),
         rz, tilt=(random.uniform(-0.4, 0.4), random.uniform(-0.4, 0.4)))
    z += H
# livro deitado ao lado, em ângulo aberto, dá profundidade lateral
book("LivroLado", 0.56, 0.40, 0.055, covers["preto"], (0.62, 1.05, DESK_Z + 0.0275), 28)

# celular em primeiro plano, desfocado pela profundidade de campo
ph = empty("Celular", (0.30, -0.55, DESK_Z + 0.009), (0, 0, math.radians(-24)))
obj_box("Celular_corpo", (0.15, 0.31, 0.017), (0, 0, 0), m_phone_body, bevel=0.018, segs=8, parent=ph)
obj_box("Celular_vidro", (0.142, 0.302, 0.002), (0, 0, 0.0085), m_glass, bevel=0.016, segs=8, parent=ph)
obj_box("Celular_tela", (0.132, 0.29, 0.0005), (0, 0, 0.0097), m_screen, bevel=0.012, segs=6, parent=ph)
for i, yo in enumerate((0.06, 0.015)):         # botões laterais
    obj_box(f"Celular_botao{i}", (0.003, 0.03, 0.006), (0.0755, yo, 0.0), m_phone_body,
            bevel=0.0012, segs=2, parent=ph)

# ---------------------------------------------------------------- textos
fb = bpy.data.fonts.load(FONT_BOLD) if os.path.exists(FONT_BOLD) else None
fr = bpy.data.fonts.load(FONT_REG) if os.path.exists(FONT_REG) else None


def text(name, body, loc, size, material, font, extrude=0.012, spacing=1.0):
    cu = bpy.data.curves.new(name, "FONT")
    cu.body = body
    cu.align_x, cu.align_y = "CENTER", "CENTER"
    cu.size, cu.extrude, cu.space_line = size, extrude, spacing
    cu.bevel_depth, cu.bevel_resolution = min(extrude * 0.2, 0.002), 2
    if font:
        cu.font = font
    o = bpy.data.objects.new(name, cu)
    scene.collection.objects.link(o)
    o.location = loc
    o.rotation_euler = (math.radians(90), 0, 0)
    o.data.materials.append(material)
    return o


def fit_width(o, max_w):
    bpy.context.view_layer.update()
    if o.dimensions.x > max_w:
        o.data.size *= max_w / o.dimensions.x
    bpy.context.view_layer.update()


m_title, thr = title_material()
t1 = text("Titulo", "QUER ENTRAR\nPARA A POLÍCIA?", (0, TEXT_Y, 2.36), 0.40, m_title, fb, extrude=0.016, spacing=0.92)
fit_width(t1, 1.62)
t2 = text("Chamada", "NOVO CONCURSO PMGO?", (0, TEXT_Y, 1.78), 0.16, m_t2, fb, extrude=0.010)
fit_width(t2, 1.30)
t3 = text("Aviso", "Edital e data: só com confirmação oficial.", (0, TEXT_Y, 1.60), 0.085, m_sub, fr, extrude=0.003)
fit_width(t3, 1.30)
bar = obj_box("Fio", (0.8, 0.012, 0.022), (0, TEXT_Y, 1.95), m_red_bar, bevel=0.004)
print(f"DIMENSOES titulo={t1.dimensions.x:.2f}x{t1.dimensions.y:.2f} "
      f"chamada={t2.dimensions.x:.2f} aviso={t3.dimensions.x:.2f}")

# varredura do limiar (revela o título)
thr.outputs[0].default_value = -TITLE_HALF_W - 0.15
thr.outputs[0].keyframe_insert("default_value", frame=BEAM_START)
thr.outputs[0].default_value = TITLE_HALF_W + 0.25
thr.outputs[0].keyframe_insert("default_value", frame=BEAM_END)


def reveal(o, frame, rise=0.05, dur=14):
    final = o.location.copy()
    o.hide_render = True
    o.keyframe_insert("hide_render", frame=frame - 1)
    o.hide_render = False
    o.keyframe_insert("hide_render", frame=frame)
    o.location.z = final.z - rise
    o.keyframe_insert("location", frame=frame)
    o.location = final
    o.keyframe_insert("location", frame=frame + dur)


# fio vermelho abre do centro
bar.hide_render = True
bar.keyframe_insert("hide_render", frame=79)
bar.hide_render = False
bar.keyframe_insert("hide_render", frame=80)
bar.scale = (0.001, 1, 1)
bar.keyframe_insert("scale", frame=80)
bar.scale = (1, 1, 1)
bar.keyframe_insert("scale", frame=98)
reveal(t2, 100)
reveal(t3, 128, rise=0.025, dur=12)

# lâmina do feixe acompanha o limiar, um pouco à frente do texto
m_beam, beam_master = beam_material()
bpy.ops.mesh.primitive_plane_add(size=1, location=(0, TEXT_Y - 0.06, 2.40), rotation=(math.radians(90), 0, 0))
beam = bpy.context.active_object
beam.name = "Feixe"
beam.scale = (0.5, 1.5, 1)
beam.data.materials.append(m_beam)
beam.visible_shadow = False
for f, x in ((BEAM_START, -TITLE_HALF_W - 0.15), (BEAM_END, TITLE_HALF_W + 0.25)):
    beam.location.x = x
    beam.keyframe_insert("location", index=0, frame=f)
for f, v in ((BEAM_START - 6, 0.0), (BEAM_START + 4, 1.0), (BEAM_END - 6, 1.0), (BEAM_END + 6, 0.0)):
    beam_master.outputs[0].default_value = v
    beam_master.outputs[0].keyframe_insert("default_value", frame=f)


# ---------------------------------------------------------------- luzes
def light(name, kind, loc, rot, energy, color, size=1.0, spread=180):
    d = bpy.data.lights.new(name, kind)
    d.energy, d.color = energy, color
    if kind == "AREA":
        d.size = size
        d.spread = math.radians(spread)
    else:
        d.shadow_soft_size = size
    o = bpy.data.objects.new(name, d)
    scene.collection.objects.link(o)
    o.location, o.rotation_euler = loc, [math.radians(v) for v in rot]
    o.visible_camera = False
    return o, d


light("Key", "AREA", (-1.8, -1.6, 3.4), (45, 0, -40), 160, (1.0, 0.94, 0.88), size=1.2, spread=100)
# recorte: duas luzes atrás dos livros, rasantes, separam as silhuetas do fundo
light("RecorteFrio", "AREA", (-0.55, 1.45, DESK_Z + 0.55), (-62, 0, 20), 60, (0.75, 0.82, 1.0), size=0.6, spread=35)
_, red_rim = light("RecorteVermelho", "AREA", (0.45, 1.45, DESK_Z + 0.5), (-62, 0, -20), 0.0, (1.0, 0.08, 0.05), size=0.6, spread=35)
light("SombraMarinho", "AREA", (0, -3.5, 1.2), (85, 0, 0), 25, (0.25, 0.4, 1.0), size=4.0)
# luz vermelha que viaja com o feixe e banha texto, parede e topo dos livros
beam_light, beam_ld = light("LuzFeixe", "POINT", (0, TEXT_Y - 0.25, 2.36), (0, 0, 0), 0.0, (1.0, 0.07, 0.04), size=0.15)
for f, x in ((BEAM_START, -TITLE_HALF_W - 0.15), (BEAM_END, TITLE_HALF_W + 0.25)):
    beam_light.location.x = x
    beam_light.keyframe_insert("location", index=0, frame=f)
for f, e in ((BEAM_START - 6, 0), (BEAM_START + 4, 130), (BEAM_END - 6, 130), (BEAM_END + 6, 0)):
    beam_ld.energy = e
    beam_ld.keyframe_insert("energy", frame=f)
# depois da varredura fica um recorte vermelho residual nos livros
for f, e in ((BEAM_END - 10, 0), (BEAM_END + 15, 40)):
    red_rim.energy = e
    red_rim.keyframe_insert("energy", frame=f)

# light linking: o recorte ilumina só livros e celular (sem manchas na mesa)
rim_coll = bpy.data.collections.new("RecebeRecorte")
for o in scene.objects:
    if o.type == "MESH" and (o.name.startswith("Livro") or o.name.startswith("Celular")):
        rim_coll.objects.link(o)
for lname in ("RecorteFrio", "RecorteVermelho"):
    scene.objects[lname].light_linking.receiver_collection = rim_coll

# ---------------------------------------------------------------- câmera
cam_data = bpy.data.cameras.new("Cam")
cam_data.lens = 40
cam_data.dof.use_dof = True
cam_data.dof.aperture_fstop = 2.2
cam = bpy.data.objects.new("Cam", cam_data)
scene.collection.objects.link(cam)
scene.camera = cam

target = empty("Alvo")
track = cam.constraints.new("TRACK_TO")
track.target, track.track_axis, track.up_axis = target, "TRACK_NEGATIVE_Z", "UP_Y"
focus = empty("Foco")
cam_data.dof.focus_object = focus

# dolly-in lento com leve subida; o alvo sobe dos livros para o título
for f, cl, tl in ((F_START, (0.10, -3.55, 1.40), (0.0, 0.6, 1.40)),
                  (75, (0.05, -3.25, 1.48), (0.0, 0.8, 1.62)),
                  (F_END, (0.0, -2.95, 1.55), (0.0, 0.9, 1.68))):
    cam.location = cl
    cam.keyframe_insert("location", frame=f)
    target.location = tl
    target.keyframe_insert("location", frame=f)
for f, fl in ((F_START, (stack_x, stack_y - 0.2, DESK_Z + 0.15)),
              (40, (stack_x, stack_y - 0.2, DESK_Z + 0.15)),
              (75, (0, TEXT_Y, 2.15))):
    focus.location = fl
    focus.keyframe_insert("location", frame=f)

# ---------------------------------------------------------------- render
os.makedirs(OUT, exist_ok=True)
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, "cena01.blend"))
t0 = time.time()
if STILL is not None:
    scene.frame_set(STILL)
    scene.render.filepath = os.path.join(OUT, f"still_{STILL:04d}.png")
    bpy.ops.render.render(write_still=True)
else:
    bpy.ops.render.render(animation=True)
print(f"CENA01: render concluído em {time.time() - t0:.1f}s →", OUT)
