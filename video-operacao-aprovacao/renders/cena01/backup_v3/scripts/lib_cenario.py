"""Biblioteca de objetos e materiais reutilizáveis (Blender 5.x / bpy).

Cada função cria o objeto já com material e retorna o objeto (ou o empty raiz),
para ser usada por qualquer cena: from lib_cenario import *
Nada aqui escreve texto em superfícies; os textos do vídeo entram como camada 2D na montagem.
"""
import math
import random

import bmesh
import bpy

# ------------------------------------------------------------------ paleta (linear)
RED = (0.745, 0.013, 0.010)
BLUE = (0.02, 0.10, 1.0)
WHITE = (0.888, 0.905, 0.930)
NAVY = (0.004, 0.008, 0.028)
PAPER = (0.74, 0.70, 0.62)
WARM = (1.0, 0.72, 0.42)


# ------------------------------------------------------------------ utilidades
def scene():
    return bpy.context.scene


def link(nt, a, b):
    nt.links.new(a, b)


def new_collection(name):
    c = bpy.data.collections.new(name)
    scene().collection.children.link(c)
    return c


def to_coll(o, coll):
    if coll is None:
        return o
    for c in list(o.users_collection):
        c.objects.unlink(o)
    coll.objects.link(o)
    return o


def empty(name, loc=(0, 0, 0), rot=(0, 0, 0), coll=None):
    e = bpy.data.objects.new(name, None)
    (coll or scene().collection).objects.link(e)
    e.location, e.rotation_euler = loc, rot
    return e


def smooth(o, angle=35):
    try:
        bpy.context.view_layer.objects.active = o
        o.select_set(True)
        bpy.ops.object.shade_smooth_by_angle(angle=math.radians(angle))
    except Exception:  # noqa: BLE001
        bpy.ops.object.shade_smooth()


def bevel(o, width, segs=3, angle=30):
    m = o.modifiers.new("Bevel", "BEVEL")
    m.width, m.segments = width, segs
    m.limit_method = "ANGLE"
    m.angle_limit = math.radians(angle)
    m.harden_normals = False
    return m


def box(name, size, loc, mat, bev=0.003, segs=3, parent=None, coll=None):
    bpy.ops.mesh.primitive_cube_add(location=loc)
    o = bpy.context.active_object
    o.name = name
    o.scale = (size[0] / 2, size[1] / 2, size[2] / 2)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if bev:
        bevel(o, bev, segs)
    o.data.materials.append(mat)
    smooth(o)
    if parent:
        o.parent = parent
    return to_coll(o, coll)


def cylinder(name, r, depth, loc, mat, rot=(0, 0, 0), verts=32, bev=0.0, segs=3, parent=None, coll=None):
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=r, depth=depth, location=loc, rotation=rot)
    o = bpy.context.active_object
    o.name = name
    if bev:
        bevel(o, bev, segs)
    o.data.materials.append(mat)
    smooth(o)
    if parent:
        o.parent = parent
    return to_coll(o, coll)


def profile_extrude(name, pts_xz, width, mat, y0=0.0, parent=None, coll=None):
    """Extrude um perfil lateral (x, z) na largura Y — base dos carros e móveis."""
    bm = bmesh.new()
    a = [bm.verts.new((x, y0 - width / 2, z)) for x, z in pts_xz]
    b = [bm.verts.new((x, y0 + width / 2, z)) for x, z in pts_xz]
    bm.faces.new(a)
    bm.faces.new(list(reversed(b)))
    n = len(pts_xz)
    for i in range(n):
        j = (i + 1) % n
        bm.faces.new((a[i], a[j], b[j], b[i]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    o = bpy.data.objects.new(name, me)
    (coll or scene().collection).objects.link(o)
    o.data.materials.append(mat)
    if parent:
        o.parent = parent
    return o


# ------------------------------------------------------------------ materiais
def principled(name, color, rough=0.5, metal=0.0, coat=0.0, coat_rough=0.1, emit=0.0, emit_color=None):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*color, 1)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    b.inputs["Coat Weight"].default_value = coat
    b.inputs["Coat Roughness"].default_value = coat_rough
    if emit:
        b.inputs["Emission Color"].default_value = (*(emit_color or color), 1)
        b.inputs["Emission Strength"].default_value = emit
    return m


def bsdf(m):
    return m.node_tree.nodes["Principled BSDF"]


def add_bump(m, kind, scale, strength, detail=4.0):
    nt = m.node_tree
    tc = nt.nodes.new("ShaderNodeTexCoord")
    if kind == "noise":
        tex = nt.nodes.new("ShaderNodeTexNoise")
        tex.inputs["Scale"].default_value = scale
        tex.inputs["Detail"].default_value = detail
    else:
        tex = nt.nodes.new("ShaderNodeTexWave")
        tex.wave_type = "BANDS"
        tex.bands_direction = "Z"
        tex.inputs["Scale"].default_value = scale
        tex.inputs["Distortion"].default_value = 2.0
    link(nt, tc.outputs["Object"], tex.inputs["Vector"])
    bp = nt.nodes.new("ShaderNodeBump")
    bp.inputs["Strength"].default_value = strength
    link(nt, tex.outputs["Fac"], bp.inputs["Height"])
    link(nt, bp.outputs["Normal"], bsdf(m).inputs["Normal"])
    return m


def emission(name, color, strength):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    e = nt.nodes.new("ShaderNodeEmission")
    e.inputs["Color"].default_value = (*color, 1)
    e.inputs["Strength"].default_value = strength
    link(nt, e.outputs[0], out.inputs["Surface"])
    return m, e


def wet_asphalt():
    """Asfalto com poças: rugosidade baixa e cor mais escura onde há água; relevo só no seco."""
    m = bpy.data.materials.new("AsfaltoMolhado")
    m.use_nodes = True
    nt = m.node_tree
    b = bsdf(m)
    tc = nt.nodes.new("ShaderNodeTexCoord")
    puddle = nt.nodes.new("ShaderNodeTexNoise")
    puddle.inputs["Scale"].default_value = 0.22
    puddle.inputs["Detail"].default_value = 3
    link(nt, tc.outputs["Object"], puddle.inputs["Vector"])
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].position = 0.47
    ramp.color_ramp.elements[1].position = 0.56
    link(nt, puddle.outputs["Fac"], ramp.inputs["Fac"])
    wet = ramp.outputs["Color"]
    col = nt.nodes.new("ShaderNodeMix"); col.data_type = "RGBA"
    col.inputs["A"].default_value = (0.032, 0.032, 0.034, 1)
    col.inputs["B"].default_value = (0.010, 0.010, 0.012, 1)
    link(nt, wet, col.inputs["Factor"])
    link(nt, col.outputs["Result"], b.inputs["Base Color"])
    # rugosidade: seco 0.6 com variação fina, molhado 0.04
    fine = nt.nodes.new("ShaderNodeTexNoise")
    fine.inputs["Scale"].default_value = 35
    fine.inputs["Detail"].default_value = 8
    link(nt, tc.outputs["Object"], fine.inputs["Vector"])
    dry_r = nt.nodes.new("ShaderNodeMapRange")
    dry_r.inputs["To Min"].default_value = 0.45
    dry_r.inputs["To Max"].default_value = 0.75
    link(nt, fine.outputs["Fac"], dry_r.inputs["Value"])
    rough = nt.nodes.new("ShaderNodeMix"); rough.data_type = "FLOAT"
    link(nt, wet, rough.inputs["Factor"])
    link(nt, dry_r.outputs["Result"], rough.inputs["A"])
    rough.inputs["B"].default_value = 0.035
    link(nt, rough.outputs["Result"], b.inputs["Roughness"])
    # relevo (agregado) só onde está seco
    inv = nt.nodes.new("ShaderNodeMath"); inv.operation = "SUBTRACT"
    inv.inputs[0].default_value = 1.0
    sep = nt.nodes.new("ShaderNodeSeparateColor")
    link(nt, wet, sep.inputs["Color"])
    link(nt, sep.outputs[0], inv.inputs[1])
    bstr = nt.nodes.new("ShaderNodeMath"); bstr.operation = "MULTIPLY"
    bstr.inputs[1].default_value = 0.3
    link(nt, inv.outputs[0], bstr.inputs[0])
    bp = nt.nodes.new("ShaderNodeBump")
    link(nt, bstr.outputs[0], bp.inputs["Strength"])
    link(nt, fine.outputs["Fac"], bp.inputs["Height"])
    link(nt, bp.outputs["Normal"], b.inputs["Normal"])
    return m


def windows_material(name, seed=0.0):
    """Fachada escura com janelas acesas aleatórias (textura de tijolos como grade)."""
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    b = bsdf(m)
    b.inputs["Base Color"].default_value = (0.012, 0.013, 0.016, 1)
    b.inputs["Roughness"].default_value = 0.8
    tc = nt.nodes.new("ShaderNodeTexCoord")
    mp = nt.nodes.new("ShaderNodeMapping")
    mp.inputs["Location"].default_value = (seed, seed * 0.7, 0)
    mp.inputs["Rotation"].default_value = (math.radians(90), 0, 0)   # grade na fachada (X,Z)
    link(nt, tc.outputs["Object"], mp.inputs["Vector"])
    brick = nt.nodes.new("ShaderNodeTexBrick")
    brick.offset = 0.0
    brick.inputs["Scale"].default_value = 2.6
    brick.inputs["Mortar Size"].default_value = 0.22
    brick.inputs["Brick Width"].default_value = 1.4
    brick.inputs["Row Height"].default_value = 1.6
    brick.inputs["Color1"].default_value = (0, 0, 0, 1)
    brick.inputs["Color2"].default_value = (1, 1, 1, 1)
    brick.inputs["Bias"].default_value = -0.25
    link(nt, mp.outputs["Vector"], brick.inputs["Vector"])
    sep = nt.nodes.new("ShaderNodeSeparateColor")
    link(nt, brick.outputs["Color"], sep.inputs["Color"])
    lit = nt.nodes.new("ShaderNodeMath"); lit.operation = "GREATER_THAN"
    lit.inputs[1].default_value = 0.5
    link(nt, sep.outputs[0], lit.inputs[0])
    notm = nt.nodes.new("ShaderNodeMath"); notm.operation = "SUBTRACT"
    notm.inputs[0].default_value = 1.0
    link(nt, brick.outputs["Fac"], notm.inputs[1])
    win = nt.nodes.new("ShaderNodeMath"); win.operation = "MULTIPLY"
    link(nt, lit.outputs[0], win.inputs[0]); link(nt, notm.outputs[0], win.inputs[1])
    st = nt.nodes.new("ShaderNodeMath"); st.operation = "MULTIPLY"
    st.inputs[1].default_value = 0.5
    link(nt, win.outputs[0], st.inputs[0])
    b.inputs["Emission Color"].default_value = (*WARM, 1)
    link(nt, st.outputs[0], b.inputs["Emission Strength"])
    return m


def haze_material(name, color, strength):
    """Cartão de névoa: emissão fraca com gradiente vertical (mais denso perto do chão)."""
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    tc = nt.nodes.new("ShaderNodeTexCoord")
    sep = nt.nodes.new("ShaderNodeSeparateXYZ")
    link(nt, tc.outputs["Generated"], sep.inputs["Vector"])
    mr = nt.nodes.new("ShaderNodeMapRange")
    mr.inputs["To Min"].default_value = 1.0
    mr.inputs["To Max"].default_value = 0.0
    link(nt, sep.outputs["Y"], mr.inputs["Value"])
    pw = nt.nodes.new("ShaderNodeMath"); pw.operation = "POWER"; pw.inputs[1].default_value = 2.5
    link(nt, mr.outputs["Result"], pw.inputs[0])
    k = nt.nodes.new("ShaderNodeMath"); k.operation = "MULTIPLY"; k.inputs[1].default_value = strength
    link(nt, pw.outputs[0], k.inputs[0])
    e = nt.nodes.new("ShaderNodeEmission")
    e.inputs["Color"].default_value = (*color, 1)
    link(nt, k.outputs[0], e.inputs["Strength"])
    t = nt.nodes.new("ShaderNodeBsdfTransparent")
    add = nt.nodes.new("ShaderNodeAddShader")
    link(nt, t.outputs[0], add.inputs[0]); link(nt, e.outputs[0], add.inputs[1])
    link(nt, add.outputs[0], out.inputs["Surface"])
    return m


# ------------------------------------------------------------------ luzes
def light(name, kind, loc, rot, energy, color, size=0.5, spread=180, spot=None, coll=None):
    d = bpy.data.lights.new(name, kind)
    d.energy, d.color = energy, color
    if kind == "AREA":
        d.size = size
        d.spread = math.radians(spread)
    else:
        d.shadow_soft_size = size
    if kind == "SPOT" and spot:
        d.spot_size, d.spot_blend = math.radians(spot[0]), spot[1]
    o = bpy.data.objects.new(name, d)
    (coll or scene().collection).objects.link(o)
    o.location, o.rotation_euler = loc, [math.radians(v) for v in rot]
    o.visible_camera = False
    return o


def key_energy(light_obj, pairs):
    for f, e in pairs:
        light_obj.data.energy = e
        light_obj.data.keyframe_insert("energy", frame=f)


# ------------------------------------------------------------------ viatura genérica
_CAR_MATS = {}


def _car_mats():
    if not _CAR_MATS:
        _CAR_MATS.update(
            paint=principled("Pintura", (0.55, 0.56, 0.58), rough=0.32, coat=1.0, coat_rough=0.04),
            trim=principled("Acabamento", (0.012, 0.012, 0.014), rough=0.5),
            glass=principled("VidroCarro", (0.0, 0.0, 0.002), rough=0.03, coat=1.0, coat_rough=0.01),
            tire=add_bump(principled("Pneu", (0.015, 0.015, 0.016), rough=0.75), "noise", 300, 0.05),
            rim=principled("Roda", (0.35, 0.36, 0.38), rough=0.25, metal=1.0),
            head=emission("Farol", (1.0, 0.95, 0.88), 25.0)[0],
            tail=emission("Lanterna", (1.0, 0.04, 0.02), 8.0)[0],
        )
        _CAR_MATS["bar_red"], _CAR_MATS["bar_red_e"] = emission("GiroflexVermelho", (1.0, 0.03, 0.02), 4.0)
        _CAR_MATS["bar_blue"], _CAR_MATS["bar_blue_e"] = emission("GiroflexAzul", (0.05, 0.15, 1.0), 4.0)
    return _CAR_MATS


def viatura(name, loc=(0, 0, 0), rotz=0.0, coll=None):
    """Sedã genérico com sinalizador no teto. Sem brasões, faixas oficiais, números ou inscrições."""
    M = _car_mats()
    root = empty(name, loc, (0, 0, math.radians(rotz)), coll=coll)
    W = 1.80
    body_pts = [(-2.32, 0.30), (2.28, 0.30), (2.36, 0.46), (2.33, 0.66), (2.10, 0.82), (0.95, 0.92),
                (-1.75, 0.97), (-2.25, 0.93), (-2.36, 0.70), (-2.36, 0.42)]
    body = profile_extrude(f"{name}_carroceria", body_pts, W, M["paint"], parent=root, coll=coll)
    bevel(body, 0.07, 4, angle=20)
    # caixas de roda (boolean)
    wheels = [(1.42, 0.33), (-1.42, 0.33)]
    for i, (wx, wz) in enumerate(wheels):
        cut = cylinder(f"{name}_corte{i}", 0.42, W + 0.4, (wx, 0, wz), M["trim"], rot=(math.pi / 2, 0, 0),
                       verts=48, parent=root, coll=coll)
        cut.hide_render = True
        cut.display_type = "WIRE"
        bo = body.modifiers.new(f"Arco{i}", "BOOLEAN")
        bo.operation, bo.object, bo.solver = "DIFFERENCE", cut, "EXACT"
    smooth(body, 30)
    # cabine de vidro escuro e teto
    cab = [(0.98, 0.90), (0.18, 1.40), (-0.98, 1.40), (-1.74, 0.95)]
    c = profile_extrude(f"{name}_cabine", cab, W - 0.24, M["paint"], parent=root, coll=coll)
    bevel(c, 0.06, 4, angle=20)
    smooth(c, 30)
    # vidros laterais (dianteiro e traseiro, separados pela coluna B) salientes 1 cm
    for k, pts in enumerate(([(0.86, 0.95), (0.16, 1.34), (-0.10, 1.34), (-0.10, 0.95)],
                             [(-0.22, 0.95), (-0.22, 1.34), (-0.92, 1.34), (-1.56, 0.98)])):
        g = profile_extrude(f"{name}_vidroLat{k}", pts, W - 0.22, M["glass"], parent=root, coll=coll)
        bevel(g, 0.02, 2, angle=20)
    # para-brisa e vidro traseiro: lâminas sobre as faces inclinadas da cabine
    for k, (a, b) in enumerate((((0.98, 0.90), (0.18, 1.40)), ((-0.98, 1.40), (-1.74, 0.95)))):
        dx, dz = b[0] - a[0], b[1] - a[1]
        n = math.hypot(dx, dz)
        nx, nz = (dz / n, -dx / n) if k == 0 else (-dz / n, dx / n)
        o = 0.006
        ins = 0.05
        a2 = (a[0] + dx * ins / n, a[1] + dz * ins / n)
        b2 = (b[0] - dx * ins / n, b[1] - dz * ins / n)
        pts = [(a2[0] + nx * o, a2[1] + nz * o), (b2[0] + nx * o, b2[1] + nz * o),
               (b2[0] + nx * (o + 0.008), b2[1] + nz * (o + 0.008)), (a2[0] + nx * (o + 0.008), a2[1] + nz * (o + 0.008))]
        if k == 1:
            pts = list(reversed(pts))
        g = profile_extrude(f"{name}_vidro{'Frente' if k == 0 else 'Tras'}", pts, W - 0.40, M["glass"],
                            parent=root, coll=coll)
    # vincos das portas, maçanetas e retrovisores
    for s in (1, -1):
        for xs in (0.92, -0.16, -1.30):
            box(f"{name}_vinco{s}{xs}", (0.008, 0.004, 0.50), (xs, s * (W / 2 + 0.001), 0.66), M["trim"], bev=0,
                parent=root, coll=coll)
        for xs in (0.30, -0.80):
            box(f"{name}_macaneta{s}{xs}", (0.14, 0.012, 0.025), (xs, s * (W / 2 + 0.004), 0.84), M["trim"],
                bev=0.004, parent=root, coll=coll)
        box(f"{name}_retrovisor{s}", (0.16, 0.12, 0.09), (0.80, s * (W / 2 + 0.06), 1.00), M["paint"], bev=0.025,
            parent=root, coll=coll)
    # para-choques e saias pretas
    box(f"{name}_pcdianteiro", (0.14, W + 0.02, 0.16), (2.30, 0, 0.38), M["trim"], bev=0.04, parent=root, coll=coll)
    box(f"{name}_pctraseiro", (0.14, W + 0.02, 0.16), (-2.33, 0, 0.42), M["trim"], bev=0.04, parent=root, coll=coll)
    box(f"{name}_saia", (2.0, W + 0.01, 0.07), (0.0, 0, 0.33), M["trim"], bev=0.02, parent=root, coll=coll)
    # faróis e lanternas
    for s in (1, -1):
        box(f"{name}_farol{s}", (0.06, 0.38, 0.07), (2.31, s * 0.62, 0.66), M["head"], bev=0.02, parent=root, coll=coll)
        box(f"{name}_lanterna{s}", (0.05, 0.42, 0.08), (-2.35, s * 0.6, 0.80), M["tail"], bev=0.015, parent=root, coll=coll)
    # rodas
    for i, (wx, wz) in enumerate(wheels):
        for s in (1, -1):
            cylinder(f"{name}_pneu{i}{s}", 0.33, 0.23, (wx, s * 0.80, wz), M["tire"], rot=(math.pi / 2, 0, 0),
                     verts=48, bev=0.07, segs=4, parent=root, coll=coll)
            cylinder(f"{name}_aro{i}{s}", 0.21, 0.235, (wx, s * 0.80, wz), M["rim"], rot=(math.pi / 2, 0, 0),
                     verts=32, bev=0.01, parent=root, coll=coll)
    # sinalizador (vermelho e azul), sem inscrições
    box(f"{name}_barra", (0.30, 1.22, 0.07), (-0.30, 0, 1.47), M["trim"], bev=0.02, parent=root, coll=coll)
    box(f"{name}_lenteV", (0.24, 0.52, 0.06), (-0.30, -0.31, 1.52), M["bar_red"], bev=0.02, parent=root, coll=coll)
    box(f"{name}_lenteA", (0.24, 0.52, 0.06), (-0.30, 0.31, 1.52), M["bar_blue"], bev=0.02, parent=root, coll=coll)
    return root


def animate_lightbar(name, f0, f1, period=30, lo=1.5, hi=6.0, light_red=None, light_blue=None):
    """Alternância lenta e discreta (sem estroboscópio): vermelho e azul se revezam a cada meio período."""
    M = _car_mats()
    r, b = M["bar_red_e"].inputs["Strength"], M["bar_blue_e"].inputs["Strength"]
    f, phase = f0, 0
    while f <= f1 + period:
        hi_r = phase % 2 == 0
        r.default_value = hi if hi_r else lo
        b.default_value = lo if hi_r else hi
        r.keyframe_insert("default_value", frame=f)
        b.keyframe_insert("default_value", frame=f)
        if light_red:
            light_red.data.energy = 40 if hi_r else 10
            light_red.data.keyframe_insert("energy", frame=f)
        if light_blue:
            light_blue.data.energy = 10 if hi_r else 40
            light_blue.data.keyframe_insert("energy", frame=f)
        f += period // 2
        phase += 1


# ------------------------------------------------------------------ rua
def poste(name, loc, arm_dir=-1, coll=None, energy=900):
    metal = principled("PosteMetal", (0.03, 0.03, 0.035), rough=0.5, metal=0.8)
    lamp = emission("Lampada", WARM, 18.0)[0]
    x, y, _ = loc
    cylinder(f"{name}_haste", 0.08, 7.0, (x, y, 3.5), metal, verts=16, coll=coll)
    box(f"{name}_braco", (0.08, 1.6, 0.08), (x, y + arm_dir * 0.8, 6.9), metal, bev=0.01, coll=coll)
    box(f"{name}_luminaria", (0.35, 0.6, 0.10), (x, y + arm_dir * 1.6, 6.85), metal, bev=0.02, coll=coll)
    box(f"{name}_lente", (0.28, 0.5, 0.01), (x, y + arm_dir * 1.6, 6.795), lamp, bev=0, coll=coll)
    return light(f"{name}_luz", "SPOT", (x, y + arm_dir * 1.6, 6.7), (0, 0, 0), energy, WARM, size=0.3,
                 spot=(120, 0.6), coll=coll)


def predio(name, loc, size, seed, coll=None):
    m = windows_material(f"Fachada_{name}", seed)
    return box(name, size, (loc[0], loc[1], size[2] / 2), m, bev=0, coll=coll)


# ------------------------------------------------------------------ estudo
_BOOK_MATS = {}


def _book_mats():
    if not _BOOK_MATS:
        _BOOK_MATS["pages"] = add_bump(principled("Paginas", PAPER, rough=0.85), "wave", 900, 0.25)
    return _BOOK_MATS


def cover_material(name, color, rough=0.55):
    return add_bump(principled(name, color, rough=rough, coat=0.15, coat_rough=0.35), "noise", 700, 0.06)


def livro(name, L, W, H, cover, loc, rotz, tilt=(0.0, 0.0), coll=None):
    """Livro de capa dura: capas com cantos arredondados, lombada curva com frisos e miolo de páginas."""
    pages = _book_mats()["pages"]
    root = empty(name, loc, (math.radians(tilt[0]), math.radians(tilt[1]), math.radians(rotz)), coll=coll)
    ct, oh = 0.0045 * max(1, H / 0.06), 0.006
    wp = W - oh - 0.006
    box(f"{name}_paginas", (L - 2 * oh, wp, (H - 2 * ct) * random.uniform(0.97, 1.0)),
        (0, -W / 2 + 0.006 + wp / 2, 0), pages, bev=0.0015, segs=2, parent=root, coll=coll)
    for sgn in (1, -1):
        box(f"{name}_capa{sgn}", (L, W, ct), (0, 0.001, sgn * (H / 2 - ct / 2)), cover, bev=0.0035, segs=4,
            parent=root, coll=coll)
    sp = cylinder(f"{name}_lombada", 1, L, (0, -W / 2 + 0.006, 0), cover, rot=(0, math.pi / 2, 0), parent=root, coll=coll)
    sp.scale = (H / 2, 0.011, 1)
    for k, xo in enumerate((-L * 0.38, L * 0.38)):
        bpy.ops.mesh.primitive_torus_add(major_radius=1, minor_radius=0.08, major_segments=32, minor_segments=8,
                                         location=(xo, -W / 2 + 0.006, 0), rotation=(0, math.pi / 2, 0))
        r = bpy.context.active_object
        r.name = f"{name}_friso{k}"
        r.scale = (H / 2 * 1.02, 0.0115, 1)
        r.data.materials.append(cover)
        bpy.ops.object.shade_smooth()
        r.parent = root
        to_coll(r, coll)
    return root


def notebook(name, loc, rotz, coll=None, screen_strength=2.2):
    """Notebook aberto: base de alumínio escuro, teclado em grade, tela com blocos abstratos (sem texto)."""
    alu = principled("Aluminio", (0.09, 0.09, 0.10), rough=0.32, metal=1.0)
    keys = bpy.data.materials.new("Teclado")
    keys.use_nodes = True
    nt = keys.node_tree
    b = bsdf(keys)
    br = nt.nodes.new("ShaderNodeTexBrick")
    br.offset = 0.0
    br.inputs["Scale"].default_value = 30
    br.inputs["Mortar Size"].default_value = 0.08
    br.inputs["Color1"].default_value = (0.01, 0.01, 0.012, 1)
    br.inputs["Color2"].default_value = (0.012, 0.012, 0.014, 1)
    br.inputs["Mortar"].default_value = (0.05, 0.05, 0.055, 1)
    tc = nt.nodes.new("ShaderNodeTexCoord")
    link(nt, tc.outputs["Object"], br.inputs["Vector"])
    link(nt, br.outputs["Color"], b.inputs["Base Color"])
    b.inputs["Roughness"].default_value = 0.6
    # tela: fundo marinho, faixas claras abstratas e um bloco vermelho
    scr = bpy.data.materials.new("TelaNotebook")
    scr.use_nodes = True
    nt = scr.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    tc = nt.nodes.new("ShaderNodeTexCoord")
    sep = nt.nodes.new("ShaderNodeSeparateXYZ")
    link(nt, tc.outputs["Generated"], sep.inputs["Vector"])
    wave = nt.nodes.new("ShaderNodeTexWave")
    wave.wave_type = "BANDS"
    wave.bands_direction = "Z"
    wave.wave_profile = "SAW"
    wave.inputs["Scale"].default_value = 9
    link(nt, tc.outputs["Generated"], wave.inputs["Vector"])
    stripes = nt.nodes.new("ShaderNodeMath"); stripes.operation = "GREATER_THAN"
    stripes.inputs[1].default_value = 0.82
    link(nt, wave.outputs["Fac"], stripes.inputs[0])
    margin = nt.nodes.new("ShaderNodeMath"); margin.operation = "LESS_THAN"
    margin.inputs[1].default_value = 0.72
    link(nt, sep.outputs["X"], margin.inputs[0])
    m2 = nt.nodes.new("ShaderNodeMath"); m2.operation = "GREATER_THAN"
    m2.inputs[1].default_value = 0.12
    link(nt, sep.outputs["X"], m2.inputs[0])
    lines = nt.nodes.new("ShaderNodeMath"); lines.operation = "MULTIPLY"
    link(nt, stripes.outputs[0], lines.inputs[0]); link(nt, margin.outputs[0], lines.inputs[1])
    lines2 = nt.nodes.new("ShaderNodeMath"); lines2.operation = "MULTIPLY"
    link(nt, lines.outputs[0], lines2.inputs[0]); link(nt, m2.outputs[0], lines2.inputs[1])
    mix = nt.nodes.new("ShaderNodeMix"); mix.data_type = "RGBA"
    mix.inputs["A"].default_value = (0.010, 0.022, 0.07, 1)
    mix.inputs["B"].default_value = (0.55, 0.6, 0.72, 1)
    link(nt, lines2.outputs[0], mix.inputs["Factor"])
    top = nt.nodes.new("ShaderNodeMath"); top.operation = "GREATER_THAN"
    top.inputs[1].default_value = 0.86
    link(nt, sep.outputs["Z"], top.inputs[0])
    mix2 = nt.nodes.new("ShaderNodeMix"); mix2.data_type = "RGBA"
    link(nt, top.outputs[0], mix2.inputs["Factor"])
    link(nt, mix.outputs["Result"], mix2.inputs["A"])
    mix2.inputs["B"].default_value = (*RED, 1)
    e = nt.nodes.new("ShaderNodeEmission")
    e.inputs["Strength"].default_value = screen_strength
    link(nt, mix2.outputs["Result"], e.inputs["Color"])
    link(nt, e.outputs[0], out.inputs["Surface"])

    root = empty(name, loc, (0, 0, math.radians(rotz)), coll=coll)
    box(f"{name}_base", (0.34, 0.235, 0.016), (0, 0, 0.008), alu, bev=0.006, segs=4, parent=root, coll=coll)
    box(f"{name}_teclado", (0.29, 0.10, 0.001), (0, 0.025, 0.0165), keys, bev=0, parent=root, coll=coll)
    box(f"{name}_touchpad", (0.10, 0.06, 0.0008), (0, -0.075, 0.0163), alu, bev=0.002, parent=root, coll=coll)
    hinge = empty(f"{name}_dobradica", (0, 0.115, 0.016), (math.radians(-15), 0, 0), coll=coll)  # tampa a 105°
    hinge.parent = root
    box(f"{name}_tampa", (0.34, 0.006, 0.225), (0, 0.003, 0.112), alu, bev=0.005, segs=4, parent=hinge, coll=coll)
    box(f"{name}_tela", (0.315, 0.0008, 0.195), (0, -0.0005, 0.114), scr, bev=0, parent=hinge, coll=coll)
    return root


def marcadores(book_root, L, W, H, n=5, coll=None):
    """Marcadores de página coloridos saindo do miolo (pista visual de livro de legislação, sem texto)."""
    cols = [(0.9, 0.7, 0.05), (0.75, 0.02, 0.02), (0.05, 0.2, 0.8), (0.9, 0.7, 0.05), (0.1, 0.5, 0.15)]
    for i in range(n):
        m = principled(f"Marcador{i}", cols[i % len(cols)], rough=0.5)
        x = -L / 2 + L * (0.15 + 0.7 * i / max(1, n - 1))
        box(f"{book_root.name}_marcador{i}", (0.018, 0.03, 0.0012), (x, W / 2 + 0.008, (i % 3 - 1) * H * 0.25), m,
            bev=0, parent=book_root, coll=coll)
