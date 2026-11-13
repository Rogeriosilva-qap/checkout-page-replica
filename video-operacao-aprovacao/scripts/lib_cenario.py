"""Biblioteca de objetos e materiais reutilizáveis (Blender 5.x / bpy).

Cada função cria o objeto já com material e retorna o objeto (ou o empty raiz),
para ser usada por qualquer cena: from lib_cenario import *
Rodas e poças são instâncias; teclado, raios, LEDs e espiral usam modificador Array.
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
    """Asfalto v4: rugosidade variável, trincas e manchas; áreas úmidas brilham sem virar espelho.
    As poças nítidas são objetos separados e instanciados (poca_base / instancia_poca)."""
    m = bpy.data.materials.new("AsfaltoMolhado")
    m.use_nodes = True
    nt = m.node_tree
    b = bsdf(m)
    tc = nt.nodes.new("ShaderNodeTexCoord")
    obj = tc.outputs["Object"]

    def noise(scale, detail=4.0):
        n = nt.nodes.new("ShaderNodeTexNoise")
        n.inputs["Scale"].default_value = scale
        n.inputs["Detail"].default_value = detail
        link(nt, obj, n.inputs["Vector"])
        return n.outputs["Fac"]

    def mrange(sock, a, b_, c, d):
        r = nt.nodes.new("ShaderNodeMapRange")
        r.inputs["From Min"].default_value, r.inputs["From Max"].default_value = a, b_
        r.inputs["To Min"].default_value, r.inputs["To Max"].default_value = c, d
        link(nt, sock, r.inputs["Value"])
        return r.outputs["Result"]

    def math_op(op, x, y):
        n = nt.nodes.new("ShaderNodeMath"); n.operation = op
        for i, v in enumerate((x, y)):
            if isinstance(v, (int, float)):
                n.inputs[i].default_value = v
            else:
                link(nt, v, n.inputs[i])
        return n.outputs[0]

    damp = mrange(noise(0.35, 3), 0.50, 0.62, 0.0, 1.0)          # manchas úmidas (área parcial)
    fine = noise(40, 8)
    patch = mrange(noise(0.06, 2), 0.3, 0.7, 0.0, 1.0)           # remendos claros/escuros
    vor = nt.nodes.new("ShaderNodeTexVoronoi")
    vor.feature = "DISTANCE_TO_EDGE"
    vor.inputs["Scale"].default_value = 0.45
    link(nt, obj, vor.inputs["Vector"])
    crack = mrange(vor.outputs["Distance"], 0.0, 0.012, 1.0, 0.0)  # trincas finas
    # cor
    col = nt.nodes.new("ShaderNodeMix"); col.data_type = "RGBA"
    col.inputs["A"].default_value = (0.040, 0.040, 0.043, 1)
    col.inputs["B"].default_value = (0.026, 0.026, 0.029, 1)
    link(nt, patch, col.inputs["Factor"])
    wetc = nt.nodes.new("ShaderNodeMix"); wetc.data_type = "RGBA"
    link(nt, damp, wetc.inputs["Factor"])
    link(nt, col.outputs["Result"], wetc.inputs["A"])
    wetc.inputs["B"].default_value = (0.014, 0.014, 0.016, 1)
    crc = nt.nodes.new("ShaderNodeMix"); crc.data_type = "RGBA"
    link(nt, crack, crc.inputs["Factor"])
    link(nt, wetc.outputs["Result"], crc.inputs["A"])
    crc.inputs["B"].default_value = (0.006, 0.006, 0.007, 1)
    link(nt, crc.outputs["Result"], b.inputs["Base Color"])
    # rugosidade: seco 0.55–0.85, úmido 0.10–0.18, trinca 0.9
    dry_r = mrange(fine, 0.3, 0.7, 0.55, 0.85)
    wet_r = mrange(fine, 0.3, 0.7, 0.10, 0.18)
    r1 = nt.nodes.new("ShaderNodeMix"); r1.data_type = "FLOAT"
    link(nt, damp, r1.inputs["Factor"]); link(nt, dry_r, r1.inputs["A"]); link(nt, wet_r, r1.inputs["B"])
    r2 = nt.nodes.new("ShaderNodeMix"); r2.data_type = "FLOAT"
    link(nt, crack, r2.inputs["Factor"]); link(nt, r1.outputs["Result"], r2.inputs["A"]); r2.inputs["B"].default_value = 0.9
    link(nt, r2.outputs["Result"], b.inputs["Roughness"])
    # relevo: agregado (forte no seco) + trincas
    agg = math_op("MULTIPLY", math_op("SUBTRACT", 1.0, damp), 0.35)
    h = math_op("SUBTRACT", fine, math_op("MULTIPLY", crack, 0.6))
    bp = nt.nodes.new("ShaderNodeBump")
    link(nt, math_op("ADD", agg, 0.06), bp.inputs["Strength"])
    link(nt, h, bp.inputs["Height"])
    link(nt, bp.outputs["Normal"], b.inputs["Normal"])
    return m


def poca_base():
    """Malha + material de poça (contorno irregular por ruído, água quase espelhada)."""
    if "Poca" in bpy.data.meshes:
        return bpy.data.meshes["Poca"]
    m = bpy.data.materials.new("AguaPoca")
    m.use_nodes = True
    nt = m.node_tree
    b = bsdf(m)
    b.inputs["Base Color"].default_value = (0.01, 0.01, 0.012, 1)
    b.inputs["Roughness"].default_value = 0.03
    b.inputs["Coat Weight"].default_value = 1.0
    b.inputs["Coat Roughness"].default_value = 0.0
    tc = nt.nodes.new("ShaderNodeTexCoord")
    vm = nt.nodes.new("ShaderNodeVectorMath"); vm.operation = "SUBTRACT"
    vm.inputs[1].default_value = (0.5, 0.5, 0.5)
    link(nt, tc.outputs["Generated"], vm.inputs[0])
    ln = nt.nodes.new("ShaderNodeVectorMath"); ln.operation = "LENGTH"
    link(nt, vm.outputs[0], ln.inputs[0])
    nz = nt.nodes.new("ShaderNodeTexNoise")
    nz.inputs["Scale"].default_value = 3.0
    nz.inputs["Detail"].default_value = 6
    link(nt, tc.outputs["Generated"], nz.inputs["Vector"])
    edge = nt.nodes.new("ShaderNodeMath"); edge.operation = "ADD"
    link(nt, ln.outputs["Value"], edge.inputs[0])
    k = nt.nodes.new("ShaderNodeMath"); k.operation = "MULTIPLY"; k.inputs[1].default_value = 0.35
    link(nt, nz.outputs["Fac"], k.inputs[0])
    link(nt, k.outputs[0], edge.inputs[1])
    mask = nt.nodes.new("ShaderNodeMath"); mask.operation = "LESS_THAN"; mask.inputs[1].default_value = 0.56
    link(nt, edge.outputs[0], mask.inputs[0])
    out = m.node_tree.nodes["Material Output"]
    tr = nt.nodes.new("ShaderNodeBsdfTransparent")
    mix = nt.nodes.new("ShaderNodeMixShader")
    link(nt, mask.outputs[0], mix.inputs["Fac"])
    link(nt, tr.outputs[0], mix.inputs[1])
    link(nt, b.outputs[0], mix.inputs[2])
    link(nt, mix.outputs[0], out.inputs["Surface"])
    bpy.ops.mesh.primitive_plane_add(size=1)
    tmp = bpy.context.active_object
    me = tmp.data
    me.name = "Poca"
    me.materials.append(m)
    bpy.data.objects.remove(tmp)
    return me


def instancia_poca(name, loc, size, rotz, coll=None):
    """Instância (malha compartilhada) de poça, 4 mm acima do asfalto."""
    o = bpy.data.objects.new(name, poca_base())
    (coll or scene().collection).objects.link(o)
    o.location = (loc[0], loc[1], 0.004)
    o.scale = (size[0], size[1], 1)
    o.rotation_euler = (0, 0, math.radians(rotz))
    o.visible_shadow = False
    return o


def windows_material(name, seed=0.0, lit=0.62, scale=3.2, dim=0.35):
    """Fachada v4: janelas por célula com brilho e cor variados, andares inteiros apagados, caixilhos."""
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    b = bsdf(m)
    b.inputs["Base Color"].default_value = (0.010, 0.011, 0.014, 1)
    b.inputs["Roughness"].default_value = 0.75
    tc = nt.nodes.new("ShaderNodeTexCoord")
    mp = nt.nodes.new("ShaderNodeMapping")
    mp.inputs["Location"].default_value = (seed, seed * 0.7, seed * 0.3)
    mp.inputs["Rotation"].default_value = (math.radians(90), 0, 0)
    link(nt, tc.outputs["Object"], mp.inputs["Vector"])

    def brick(c1, c2, bias):
        br = nt.nodes.new("ShaderNodeTexBrick")
        br.offset, br.squash = 0.0, 1.0
        br.inputs["Scale"].default_value = scale
        br.inputs["Mortar Size"].default_value = 0.28
        br.inputs["Brick Width"].default_value = 1.0
        br.inputs["Row Height"].default_value = 1.15
        br.inputs["Color1"].default_value = c1
        br.inputs["Color2"].default_value = c2
        br.inputs["Bias"].default_value = bias
        link(nt, mp.outputs["Vector"], br.inputs["Vector"])
        return br

    rnd = brick((0, 0, 0, 1), (1, 1, 1, 1), 0.0)
    hue = brick((*WARM, 1), (0.75, 0.82, 1.0, 1), 0.3)
    sep = nt.nodes.new("ShaderNodeSeparateColor")
    link(nt, rnd.outputs["Color"], sep.inputs["Color"])
    on = nt.nodes.new("ShaderNodeMath"); on.operation = "GREATER_THAN"; on.inputs[1].default_value = lit
    link(nt, sep.outputs[0], on.inputs[0])
    glass = nt.nodes.new("ShaderNodeMath"); glass.operation = "SUBTRACT"; glass.inputs[0].default_value = 1.0
    link(nt, rnd.outputs["Fac"], glass.inputs[1])
    # andares apagados: ruído de baixa frequência em Z
    fl = nt.nodes.new("ShaderNodeTexNoise")
    fl.inputs["Scale"].default_value = 0.35
    link(nt, mp.outputs["Vector"], fl.inputs["Vector"])
    flm = nt.nodes.new("ShaderNodeMapRange")
    flm.inputs["From Min"].default_value, flm.inputs["From Max"].default_value = 0.42, 0.55
    link(nt, fl.outputs["Fac"], flm.inputs["Value"])
    a = nt.nodes.new("ShaderNodeMath"); a.operation = "MULTIPLY"
    link(nt, on.outputs[0], a.inputs[0]); link(nt, glass.outputs[0], a.inputs[1])
    a2 = nt.nodes.new("ShaderNodeMath"); a2.operation = "MULTIPLY"
    link(nt, a.outputs[0], a2.inputs[0]); link(nt, flm.outputs["Result"], a2.inputs[1])
    var = nt.nodes.new("ShaderNodeMapRange")                     # brilho por janela 0.25–1.0
    var.inputs["From Min"].default_value, var.inputs["From Max"].default_value = lit, 1.0
    var.inputs["To Min"].default_value, var.inputs["To Max"].default_value = 0.25, 1.0
    link(nt, sep.outputs[0], var.inputs["Value"])
    a3 = nt.nodes.new("ShaderNodeMath"); a3.operation = "MULTIPLY"
    link(nt, a2.outputs[0], a3.inputs[0]); link(nt, var.outputs["Result"], a3.inputs[1])
    st = nt.nodes.new("ShaderNodeMath"); st.operation = "MULTIPLY"; st.inputs[1].default_value = dim
    link(nt, a3.outputs[0], st.inputs[0])
    link(nt, hue.outputs["Color"], b.inputs["Emission Color"])
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


# ------------------------------------------------------------------ viatura genérica (v4: PBR, rodas instanciadas)
_CAR_MATS = {}


def _car_mats():
    if not _CAR_MATS:
        paint = principled("Pintura", (0.62, 0.63, 0.64), rough=0.36, coat=1.0, coat_rough=0.03)
        add_bump(paint, "noise", 220, 0.012)                                   # leve casca de laranja
        trim = add_bump(principled("PlasticoPreto", (0.014, 0.014, 0.016), rough=0.58), "noise", 450, 0.12)
        _CAR_MATS.update(
            paint=paint,
            trim=trim,
            gloss_black=principled("PretoBrilhante", (0.006, 0.006, 0.007), rough=0.12, coat=1.0, coat_rough=0.02),
            glass=principled("VidroCarro", (0.0, 0.0, 0.002), rough=0.02, coat=1.0, coat_rough=0.0),
            lens=principled("LenteFarol", (0.95, 0.95, 0.97), rough=0.04),
            tire=add_bump(principled("Pneu", (0.018, 0.018, 0.019), rough=0.85), "noise", 120, 0.18),
            rim=add_bump(principled("RodaLiga", (0.55, 0.56, 0.58), rough=0.28, metal=1.0), "noise", 600, 0.02),
            disc=principled("DiscoFreio", (0.22, 0.22, 0.23), rough=0.45, metal=1.0),
            head=emission("Farol", (1.0, 0.95, 0.88), 3.5)[0],
            drl=emission("LuzDiurna", (0.9, 0.95, 1.0), 2.0)[0],
            tail=emission("Lanterna", (1.0, 0.04, 0.02), 3.0)[0],
        )
        grille = principled("Grade", (0.01, 0.01, 0.011), rough=0.4, metal=0.3)
        nt = grille.node_tree
        br = nt.nodes.new("ShaderNodeTexBrick")
        br.inputs["Scale"].default_value = 22
        br.inputs["Mortar Size"].default_value = 0.25
        tc = nt.nodes.new("ShaderNodeTexCoord")
        link(nt, tc.outputs["Object"], br.inputs["Vector"])
        bp = nt.nodes.new("ShaderNodeBump")
        bp.inputs["Strength"].default_value = 0.6
        link(nt, br.outputs["Fac"], bp.inputs["Height"])
        link(nt, bp.outputs["Normal"], bsdf(grille).inputs["Normal"])
        _CAR_MATS["grille"] = grille
        bsdf(_CAR_MATS["lens"]).inputs["Transmission Weight"].default_value = 1.0   # lente translúcida
        _CAR_MATS["bar_red"], _CAR_MATS["bar_red_e"] = emission("GiroflexVermelho", (1.0, 0.03, 0.02), 4.0)
        _CAR_MATS["bar_blue"], _CAR_MATS["bar_blue_e"] = emission("GiroflexAzul", (0.05, 0.15, 1.0), 4.0)
    return _CAR_MATS


def roda_base(name="RodaBase"):
    """Conjunto de roda (pneu, aro, 5 raios via Array, disco, cubo) numa coleção para instanciar.
    Eixo da roda em Y; face externa em +Y."""
    if name in bpy.data.collections:
        return bpy.data.collections[name]
    M = _car_mats()
    coll = bpy.data.collections.new(name)            # não ligada à cena: só existe como instância
    r = math.pi / 2
    cylinder(f"{name}_pneu", 0.33, 0.225, (0, 0, 0), M["tire"], rot=(r, 0, 0), verts=48, bev=0.08, segs=5, coll=coll)
    cylinder(f"{name}_tambor", 0.215, 0.20, (0, 0, 0), M["disc"], rot=(r, 0, 0), verts=40, coll=coll)
    cylinder(f"{name}_aro", 0.222, 0.03, (0, 0.096, 0), M["rim"], rot=(r, 0, 0), verts=48, bev=0.008, coll=coll)
    cylinder(f"{name}_disco", 0.17, 0.018, (0, 0.03, 0), M["disc"], rot=(r, 0, 0), verts=40, coll=coll)
    cylinder(f"{name}_cubo", 0.055, 0.05, (0, 0.105, 0), M["rim"], rot=(r, 0, 0), verts=24, bev=0.01, coll=coll)
    sp = box(f"{name}_raio", (0.038, 0.03, 0.15), (0, 0.105, 0.125), M["rim"], bev=0.006)
    bpy.ops.object.select_all(action="DESELECT")
    bpy.context.view_layer.objects.active = sp
    sp.select_set(True)
    bpy.ops.object.transform_apply(location=True, rotation=False, scale=False)   # origem no eixo da roda
    to_coll(sp, coll)
    piv = empty(f"{name}_pivo", (0, 0, 0), (0, math.radians(72), 0), coll=coll)
    arr = sp.modifiers.new("Raios", "ARRAY")
    arr.use_relative_offset, arr.use_object_offset = False, True
    arr.offset_object, arr.count = piv, 5
    # o aro precisa ficar vazado entre raios: o aro é um anel (boolean com cilindro interno)
    hole = cylinder(f"{name}_furo", 0.175, 0.2, (0, 0.096, 0), M["rim"], rot=(r, 0, 0), verts=40, coll=coll)
    hole.hide_render = True
    hole.display_type = "WIRE"
    rim = bpy.data.objects[f"{name}_aro"]
    bo = rim.modifiers.new("Anel", "BOOLEAN")
    bo.operation, bo.object, bo.solver = "DIFFERENCE", hole, "EXACT"
    return coll


def instancia_roda(name, loc, outward, parent=None, coll=None):
    e = bpy.data.objects.new(name, None)
    (coll or scene().collection).objects.link(e)
    e.instance_type = "COLLECTION"
    e.instance_collection = roda_base()
    e.location = loc
    e.rotation_euler = (0, 0, 0 if outward > 0 else math.pi)
    if parent:
        e.parent = parent
    return e


def viatura(name, loc=(0, 0, 0), rotz=0.0, coll=None):
    """Sedã genérico com sinalizador no teto. Sem brasões, faixas oficiais, números ou inscrições."""
    M = _car_mats()
    root = empty(name, loc, (0, 0, math.radians(rotz)), coll=coll)
    W = 1.80
    body_pts = [(-2.22, 0.32), (2.18, 0.32), (2.24, 0.58), (2.12, 0.80), (0.95, 0.92),
                (-1.75, 0.97), (-2.22, 0.93), (-2.28, 0.62)]
    body = profile_extrude(f"{name}_carroceria", body_pts, W, M["paint"], parent=root, coll=coll)
    bevel(body, 0.07, 4, angle=20)
    wheels = [(1.42, 0.33), (-1.42, 0.33)]
    for i, (wx, wz) in enumerate(wheels):
        cut = cylinder(f"{name}_corte{i}", 0.42, W + 0.4, (wx, 0, wz), M["trim"], rot=(math.pi / 2, 0, 0),
                       verts=48, parent=root, coll=coll)
        cut.hide_render = True
        cut.display_type = "WIRE"
        bo = body.modifiers.new(f"Arco{i}", "BOOLEAN")
        bo.operation, bo.object, bo.solver = "DIFFERENCE", cut, "EXACT"
        # forro preto da caixa de roda (esconde o vazio interno)
        cylinder(f"{name}_forro{i}", 0.415, W - 0.20, (wx, 0, wz), M["trim"], rot=(math.pi / 2, 0, 0), verts=48,
                 parent=root, coll=coll)
    smooth(body, 30)
    # cabine pintada, colunas pretas e vidros
    cab = [(0.98, 0.90), (0.18, 1.40), (-0.98, 1.40), (-1.74, 0.95)]
    c = profile_extrude(f"{name}_cabine", cab, W - 0.24, M["paint"], parent=root, coll=coll)
    bevel(c, 0.06, 4, angle=20)
    smooth(c, 30)
    for k, pts in enumerate(([(0.86, 0.95), (0.16, 1.34), (-0.10, 1.34), (-0.10, 0.95)],
                             [(-0.22, 0.95), (-0.22, 1.34), (-0.92, 1.34), (-1.56, 0.98)])):
        g = profile_extrude(f"{name}_vidroLat{k}", pts, W - 0.22, M["glass"], parent=root, coll=coll)
        bevel(g, 0.02, 2, angle=20)
    for k, (a, b) in enumerate((((0.98, 0.90), (0.18, 1.40)), ((-0.98, 1.40), (-1.74, 0.95)))):
        dx, dz = b[0] - a[0], b[1] - a[1]
        n = math.hypot(dx, dz)
        nx, nz = (dz / n, -dx / n) if k == 0 else (-dz / n, dx / n)
        o, ins = 0.006, 0.05
        a2 = (a[0] + dx * ins / n, a[1] + dz * ins / n)
        b2 = (b[0] - dx * ins / n, b[1] - dz * ins / n)
        pts = [(a2[0] + nx * o, a2[1] + nz * o), (b2[0] + nx * o, b2[1] + nz * o),
               (b2[0] + nx * (o + 0.008), b2[1] + nz * (o + 0.008)), (a2[0] + nx * (o + 0.008), a2[1] + nz * (o + 0.008))]
        if k == 1:
            pts = list(reversed(pts))
        profile_extrude(f"{name}_vidro{'Frente' if k == 0 else 'Tras'}", pts, W - 0.40, M["glass"], parent=root, coll=coll)
    for s in (1, -1):
        y = s * (W / 2 + 0.001)
        # coluna B preta, friso de vidro, vincos, maçanetas, retrovisor
        box(f"{name}_colunaB{s}", (0.11, 0.012, 0.40), (-0.16, s * (W / 2 - 0.105), 1.15), M["gloss_black"], bev=0.004,
            parent=root, coll=coll)
        box(f"{name}_frisoVidro{s}", (2.40, 0.014, 0.022), (-0.36, s * (W / 2 - 0.105), 0.945), M["trim"], bev=0.004,
            parent=root, coll=coll)
        for xs in (0.92, -0.16, -1.30):
            box(f"{name}_vinco{s}{xs}", (0.006, 0.004, 0.56), (xs, y, 0.64), M["gloss_black"], bev=0, parent=root, coll=coll)
        box(f"{name}_vincoInf{s}", (2.24, 0.004, 0.006), (-0.19, y, 0.36), M["gloss_black"], bev=0, parent=root, coll=coll)
        for xs in (0.30, -0.80):
            box(f"{name}_macaneta{s}{xs}", (0.15, 0.016, 0.028), (xs, s * (W / 2 + 0.006), 0.84), M["gloss_black"],
                bev=0.006, parent=root, coll=coll)
        box(f"{name}_retrovisor{s}", (0.17, 0.11, 0.10), (0.78, s * (W / 2 + 0.06), 1.00), M["gloss_black"], bev=0.03,
            parent=root, coll=coll)
        box(f"{name}_saia{s}", (2.0, 0.03, 0.08), (0.0, s * (W / 2 - 0.005), 0.33), M["trim"], bev=0.012, parent=root,
            coll=coll)
    # para-choques com perfil (cor da carroceria) e parte inferior preta
    fb = [(2.10, 0.26), (2.38, 0.28), (2.44, 0.42), (2.40, 0.60), (2.16, 0.62)]
    b1 = profile_extrude(f"{name}_pcDianteiro", fb, W + 0.03, M["paint"], parent=root, coll=coll)
    bevel(b1, 0.05, 4, angle=25)
    smooth(b1, 30)
    rb = [(-2.16, 0.28), (-2.38, 0.30), (-2.44, 0.46), (-2.40, 0.64), (-2.14, 0.66)]
    b2 = profile_extrude(f"{name}_pcTraseiro", list(reversed(rb)), W + 0.03, M["paint"], parent=root, coll=coll)
    bevel(b2, 0.05, 4, angle=25)
    smooth(b2, 30)
    box(f"{name}_spoiler", (0.10, W - 0.1, 0.07), (2.40, 0, 0.29), M["trim"], bev=0.02, parent=root, coll=coll)
    box(f"{name}_gradeInf", (0.04, 0.95, 0.12), (2.44, 0, 0.42), M["grille"], bev=0.012, parent=root, coll=coll)
    box(f"{name}_gradeSup", (0.04, 0.72, 0.08), (2.25, 0, 0.70), M["grille"], bev=0.01, parent=root, coll=coll)
    box(f"{name}_difusor", (0.08, 1.2, 0.08), (-2.42, 0, 0.32), M["trim"], bev=0.02, parent=root, coll=coll)
    # faróis: carcaça preta, refletor emissivo fraco, lente; DRL em filete
    for s in (1, -1):
        box(f"{name}_farolCarcaca{s}", (0.08, 0.40, 0.11), (2.205, s * 0.60, 0.70), M["gloss_black"], bev=0.025,
            parent=root, coll=coll)
        box(f"{name}_farolEmissor{s}", (0.02, 0.14, 0.06), (2.245, s * 0.66, 0.70), M["head"], bev=0.01, parent=root,
            coll=coll)
        box(f"{name}_drl{s}", (0.012, 0.30, 0.012), (2.25, s * 0.58, 0.745), M["drl"], bev=0.004, parent=root, coll=coll)
        box(f"{name}_farolLente{s}", (0.02, 0.40, 0.11), (2.255, s * 0.60, 0.70), M["lens"], bev=0.02, parent=root,
            coll=coll).visible_shadow = False
        box(f"{name}_neblina{s}", (0.02, 0.10, 0.04), (2.43, s * 0.65, 0.40), M["drl"], bev=0.008, parent=root, coll=coll)
        box(f"{name}_lanternaCarcaca{s}", (0.06, 0.44, 0.10), (-2.25, s * 0.58, 0.80), M["gloss_black"], bev=0.02,
            parent=root, coll=coll)
        box(f"{name}_lanterna{s}", (0.012, 0.40, 0.02), (-2.285, s * 0.58, 0.82), M["tail"], bev=0.005, parent=root,
            coll=coll)
    # rodas instanciadas (uma geometria, quatro instâncias)
    for i, (wx, wz) in enumerate(wheels):
        for s in (1, -1):
            instancia_roda(f"{name}_roda{i}{'E' if s > 0 else 'D'}", (wx, s * 0.80, wz), s, parent=root, coll=coll)
    # sinalizador: base, cúpula translúcida e módulos de LED em Array
    box(f"{name}_barraBase", (0.32, 1.24, 0.05), (-0.30, 0, 1.455), M["trim"], bev=0.015, parent=root, coll=coll)
    for side, mat, y0 in (("V", M["bar_red"], -0.55), ("A", M["bar_blue"], 0.07)):
        led = box(f"{name}_led{side}", (0.20, 0.08, 0.035), (-0.30, y0 + 0.04, 1.50), mat, bev=0.008, parent=root,
                  coll=coll)
        a = led.modifiers.new("Modulos", "ARRAY")
        a.relative_offset_displace = (0, 1.5, 0)
        a.count = 4
    box(f"{name}_cupula", (0.30, 1.22, 0.07), (-0.30, 0, 1.505), M["lens"], bev=0.025, parent=root,
        coll=coll).visible_shadow = False
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


def predio(name, loc, size, seed, coll=None, **win):
    m = windows_material(f"Fachada_{name}", seed, **win)
    return box(name, size, (loc[0], loc[1], size[2] / 2), m, bev=0, coll=coll)


# ------------------------------------------------------------------ estudo (v4)
_BOOK_MATS = {}


def _book_mats():
    if not _BOOK_MATS:
        pages = principled("Paginas", PAPER, rough=0.85)
        nt = pages.node_tree
        tc = nt.nodes.new("ShaderNodeTexCoord")
        wv = nt.nodes.new("ShaderNodeTexWave")
        wv.wave_type, wv.bands_direction = "BANDS", "Z"
        wv.inputs["Scale"].default_value = 900
        wv.inputs["Distortion"].default_value = 2.0
        link(nt, tc.outputs["Object"], wv.inputs["Vector"])
        cr = nt.nodes.new("ShaderNodeMix"); cr.data_type = "RGBA"          # leve variação de tom entre folhas
        cr.inputs["A"].default_value = (*PAPER, 1)
        cr.inputs["B"].default_value = (0.66, 0.62, 0.54, 1)
        link(nt, wv.outputs["Fac"], cr.inputs["Factor"])
        link(nt, cr.outputs["Result"], bsdf(pages).inputs["Base Color"])
        bp = nt.nodes.new("ShaderNodeBump")
        bp.inputs["Strength"].default_value = 0.3
        link(nt, wv.outputs["Fac"], bp.inputs["Height"])
        link(nt, bp.outputs["Normal"], bsdf(pages).inputs["Normal"])
        _BOOK_MATS["pages"] = pages
        _BOOK_MATS["gold"] = principled("Dourado", (0.85, 0.55, 0.20), rough=0.32, metal=1.0)
    return _BOOK_MATS


def cover_material(name, color, rough=0.55, leather=False):
    m = principled(name, color, rough=rough + (0.1 if leather else 0.0), coat=0.08 if leather else 0.15,
                   coat_rough=0.4)
    return add_bump(m, "noise", 260 if leather else 700, 0.10 if leather else 0.06, detail=6)


def livro(name, L, W, H, cover, loc, rotz, tilt=(0.0, 0.0), coll=None, gold=False):
    """Livro de capa dura: capas com cantos arredondados e sobra, lombada curva, cabeceado e miolo.
    gold=True acrescenta frisos dourados na lombada e moldura dourada na capa (sem texto)."""
    M = _book_mats()
    root = empty(name, loc, (math.radians(tilt[0]), math.radians(tilt[1]), math.radians(rotz)), coll=coll)
    ct, oh = 0.0045 * max(1, H / 0.06), 0.006
    wp = W - oh - 0.006
    ph = (H - 2 * ct) * random.uniform(0.97, 1.0)
    box(f"{name}_paginas", (L - 2 * oh, wp, ph), (0, -W / 2 + 0.006 + wp / 2, 0), M["pages"], bev=0.0015, segs=2,
        parent=root, coll=coll)
    for sgn in (1, -1):
        box(f"{name}_capa{sgn}", (L, W, ct), (0, 0.001, sgn * (H / 2 - ct / 2)), cover, bev=0.0035, segs=4,
            parent=root, coll=coll)
    sp = cylinder(f"{name}_lombada", 1, L, (0, -W / 2 + 0.006, 0), cover, rot=(0, math.pi / 2, 0), parent=root,
                  coll=coll)
    sp.scale = (H / 2, 0.011, 1)
    band = M["gold"] if gold else cover
    for k, xo in enumerate((-L * 0.40, -L * 0.33, L * 0.33, L * 0.40) if gold else (-L * 0.38, L * 0.38)):
        bpy.ops.mesh.primitive_torus_add(major_radius=1, minor_radius=0.05, major_segments=32, minor_segments=6,
                                         location=(xo, -W / 2 + 0.006, 0), rotation=(0, math.pi / 2, 0))
        r = bpy.context.active_object
        r.name = f"{name}_friso{k}"
        r.scale = (H / 2 * 1.02, 0.0115, 0.08)          # filete de ~4 mm ao longo da lombada
        r.data.materials.append(band)
        bpy.ops.object.shade_smooth()
        r.parent = root
        to_coll(r, coll)
    if gold:
        # cabeceado (fita colorida nas pontas do miolo) e moldura dourada em baixo-relevo na capa
        for sx in (1, -1):
            cylinder(f"{name}_cabeceado{sx}", 0.0035, ph * 0.9, (sx * (L / 2 - 0.007), -W / 2 + 0.010, 0),
                     principled(f"Cabeceado{sx}", (0.5, 0.42, 0.10), rough=0.6), verts=8, parent=root, coll=coll)
        fw = 0.004
        for (dx, dy, sx_, sy_) in ((0, W * 0.36, L * 0.78, fw), (0, -W * 0.30, L * 0.78, fw),
                                   (L * 0.39, W * 0.03, fw, W * 0.66), (-L * 0.39, W * 0.03, fw, W * 0.66)):
            box(f"{name}_moldura{dx:.2f}{dy:.2f}", (sx_, sy_, 0.0008), (dx, dy, H / 2 + 0.0004), M["gold"], bev=0,
                parent=root, coll=coll)
    return root


def marcadores(book_root, L, W, H, n=8, coll=None, side="head"):
    """Marcadores de página coloridos saindo do miolo (pista visual de livro de estudo, sem texto)."""
    cols = [(0.9, 0.7, 0.05), (0.75, 0.02, 0.02), (0.05, 0.2, 0.8), (0.1, 0.5, 0.15), (0.9, 0.35, 0.02)]
    for i in range(n):
        m = principled(f"Marcador{i % len(cols)}", cols[i % len(cols)], rough=0.45, coat=0.4)
        t = 0.12 + 0.76 * i / max(1, n - 1)
        z = (random.uniform(-0.3, 0.3)) * H
        if side == "head":     # sai pela ponta +X do livro
            box(f"{book_root.name}_marcador{i}", (0.032, 0.022, 0.0012), (L / 2 + 0.006, -W / 2 + W * t, z), m, bev=0,
                parent=book_root, coll=coll)
        else:                  # sai pelo corte frontal (+Y)
            box(f"{book_root.name}_marcador{i}", (0.022, 0.032, 0.0012), (-L / 2 + L * t, W / 2 + 0.006, z), m, bev=0,
                parent=book_root, coll=coll)


def caderno(name, loc, rotz, coll=None):
    """Caderno aberto pautado com marca-texto e post-its (sem escrita)."""
    paper = principled("FolhaPautada", (0.62, 0.61, 0.58), rough=0.8)
    nt = paper.node_tree
    tc = nt.nodes.new("ShaderNodeTexCoord")
    wv = nt.nodes.new("ShaderNodeTexWave")
    wv.wave_type, wv.bands_direction = "BANDS", "Y"
    wv.wave_profile = "SAW"
    wv.inputs["Scale"].default_value = 40
    link(nt, tc.outputs["Object"], wv.inputs["Vector"])
    ln = nt.nodes.new("ShaderNodeMath"); ln.operation = "GREATER_THAN"; ln.inputs[1].default_value = 0.93
    link(nt, wv.outputs["Fac"], ln.inputs[0])
    mx = nt.nodes.new("ShaderNodeMix"); mx.data_type = "RGBA"
    mx.inputs["A"].default_value = (0.62, 0.61, 0.58, 1)
    mx.inputs["B"].default_value = (0.35, 0.45, 0.65, 1)
    link(nt, ln.outputs[0], mx.inputs["Factor"])
    link(nt, mx.outputs["Result"], bsdf(paper).inputs["Base Color"])
    root = empty(name, loc, (0, 0, math.radians(rotz)), coll=coll)
    cover = principled("CapaCaderno", (0.01, 0.012, 0.02), rough=0.5)
    box(f"{name}_capa", (0.42, 0.29, 0.003), (0, 0, 0.0015), cover, bev=0.004, parent=root, coll=coll)
    for sx, ang in ((-1, 2.5), (1, -2.5)):
        p = box(f"{name}_folhas{sx}", (0.20, 0.28, 0.006), (sx * 0.103, 0, 0.006), paper, bev=0.002, parent=root,
                coll=coll)
        p.rotation_euler.y = math.radians(ang)
    spiral = principled("Espiral", (0.4, 0.4, 0.42), rough=0.3, metal=1.0)
    ring = cylinder(f"{name}_espiral", 0.006, 0.004, (0, -0.13, 0.009), spiral, rot=(0, math.pi / 2, 0), verts=12,
                    parent=root, coll=coll)
    a = ring.modifiers.new("Argolas", "ARRAY")
    a.use_relative_offset, a.use_constant_offset = False, True
    a.constant_offset_displace = (0, 0, 0.013)    # eixo local Z do cilindro = eixo Y do caderno após a rotação
    a.count = 20
    # marca-texto e post-its
    hl = principled("MarcaTexto", (0.95, 0.85, 0.05), rough=0.35, coat=0.5)
    cylinder(f"{name}_marcatexto", 0.009, 0.13, (0.30, 0.02, 0.009), hl, rot=(0, math.pi / 2, math.radians(70)),
             verts=16, bev=0.002, parent=root, coll=coll)
    for i, (c, dx, dy, rz) in enumerate((((0.95, 0.80, 0.10), 0.15, 0.05, 6), ((0.95, 0.35, 0.40), 0.17, -0.06, -8))):
        pm = principled(f"PostIt{i}", c, rough=0.7)
        pi_ = box(f"{name}_postit{i}", (0.075, 0.075, 0.0008), (dx, dy, 0.0105 + i * 0.001), pm, bev=0, parent=root,
                  coll=coll)
        pi_.rotation_euler.z = math.radians(rz)
    return root


def notebook(name, loc, rotz, coll=None, screen_strength=1.8):
    """Notebook v4: alumínio escovado, teclas reais (Array), touchpad de vidro, moldura preta e tela abstrata."""
    alu = principled("Aluminio", (0.11, 0.11, 0.12), rough=0.30, metal=1.0)
    nt = alu.node_tree
    tc = nt.nodes.new("ShaderNodeTexCoord")
    mp = nt.nodes.new("ShaderNodeMapping")
    mp.inputs["Scale"].default_value = (1, 400, 1)                     # escovado
    link(nt, tc.outputs["Object"], mp.inputs["Vector"])
    nz = nt.nodes.new("ShaderNodeTexNoise")
    nz.inputs["Scale"].default_value = 20
    link(nt, mp.outputs["Vector"], nz.inputs["Vector"])
    rr = nt.nodes.new("ShaderNodeMapRange")
    rr.inputs["To Min"].default_value, rr.inputs["To Max"].default_value = 0.24, 0.38
    link(nt, nz.outputs["Fac"], rr.inputs["Value"])
    link(nt, rr.outputs["Result"], bsdf(alu).inputs["Roughness"])
    key_m = principled("Tecla", (0.012, 0.012, 0.014), rough=0.55)
    well = principled("Poco", (0.004, 0.004, 0.005), rough=0.7)
    bezel = principled("Moldura", (0.003, 0.003, 0.004), rough=0.08, coat=1.0, coat_rough=0.0)
    pad = principled("Touchpad", (0.09, 0.09, 0.10), rough=0.18, metal=0.6)
    # tela: barra vermelha, coluna lateral e cartões de conteúdo (blocos abstratos, sem texto)
    scr = bpy.data.materials.new("TelaNotebook")
    scr.use_nodes = True
    nt = scr.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    tc = nt.nodes.new("ShaderNodeTexCoord")
    sep = nt.nodes.new("ShaderNodeSeparateXYZ")
    link(nt, tc.outputs["Generated"], sep.inputs["Vector"])

    def band(axis, lo, hi):
        a = nt.nodes.new("ShaderNodeMath"); a.operation = "GREATER_THAN"; a.inputs[1].default_value = lo
        link(nt, sep.outputs[axis], a.inputs[0])
        b_ = nt.nodes.new("ShaderNodeMath"); b_.operation = "LESS_THAN"; b_.inputs[1].default_value = hi
        link(nt, sep.outputs[axis], b_.inputs[0])
        m_ = nt.nodes.new("ShaderNodeMath"); m_.operation = "MULTIPLY"
        link(nt, a.outputs[0], m_.inputs[0]); link(nt, b_.outputs[0], m_.inputs[1])
        return m_.outputs[0]

    def mul(x, y):
        m_ = nt.nodes.new("ShaderNodeMath"); m_.operation = "MULTIPLY"
        link(nt, x, m_.inputs[0]); link(nt, y, m_.inputs[1])
        return m_.outputs[0]

    def layer(base, mask, color):
        mx = nt.nodes.new("ShaderNodeMix"); mx.data_type = "RGBA"
        link(nt, mask, mx.inputs["Factor"])
        if isinstance(base, tuple):
            mx.inputs["A"].default_value = base
        else:
            link(nt, base, mx.inputs["A"])
        mx.inputs["B"].default_value = color
        return mx.outputs["Result"]

    c = layer((0.012, 0.022, 0.06, 1), band("X", 0.0, 0.22), (0.006, 0.010, 0.03, 1))           # coluna lateral
    c = layer(c, band("Z", 0.88, 1.01), (*RED, 1))                                                # barra superior
    c = layer(c, mul(band("X", 0.27, 0.60), band("Z", 0.50, 0.82)), (0.05, 0.09, 0.20, 1))         # cartão 1
    c = layer(c, mul(band("X", 0.64, 0.96), band("Z", 0.50, 0.82)), (0.05, 0.09, 0.20, 1))         # cartão 2
    c = layer(c, mul(band("X", 0.27, 0.96), band("Z", 0.10, 0.44)), (0.04, 0.07, 0.16, 1))         # cartão 3
    wv = nt.nodes.new("ShaderNodeTexWave")
    wv.wave_type, wv.bands_direction, wv.wave_profile = "BANDS", "Z", "SAW"
    wv.inputs["Scale"].default_value = 14
    link(nt, tc.outputs["Generated"], wv.inputs["Vector"])
    gt = nt.nodes.new("ShaderNodeMath"); gt.operation = "GREATER_THAN"; gt.inputs[1].default_value = 0.8
    link(nt, wv.outputs["Fac"], gt.inputs[0])
    lines = mul(mul(gt.outputs[0], band("X", 0.30, 0.80)), band("Z", 0.13, 0.42))
    c = layer(c, lines, (0.45, 0.5, 0.62, 1))                                                     # linhas abstratas
    c = layer(c, mul(band("X", 0.04, 0.18), band("Z", 0.70, 0.74)), (*RED, 1))                    # item ativo
    e = nt.nodes.new("ShaderNodeEmission")
    e.inputs["Strength"].default_value = screen_strength
    link(nt, c, e.inputs["Color"])
    link(nt, e.outputs[0], out.inputs["Surface"])

    root = empty(name, loc, (0, 0, math.radians(rotz)), coll=coll)
    box(f"{name}_base", (0.34, 0.235, 0.015), (0, 0, 0.0075), alu, bev=0.005, segs=4, parent=root, coll=coll)
    box(f"{name}_poco", (0.30, 0.108, 0.0008), (0, 0.035, 0.0151), well, bev=0, parent=root, coll=coll)
    key = box(f"{name}_tecla", (0.0165, 0.0155, 0.0022), (-0.1395, -0.012, 0.0158), key_m, bev=0.0012, segs=2,
              parent=root, coll=coll)
    a1 = key.modifiers.new("Colunas", "ARRAY")
    a1.relative_offset_displace, a1.count = (1.18, 0, 0), 14
    a2 = key.modifiers.new("Linhas", "ARRAY")
    a2.relative_offset_displace, a2.count = (0, 1.20, 0), 5
    box(f"{name}_espaco", (0.10, 0.0155, 0.0022), (0, -0.0305, 0.0158), key_m, bev=0.0012, segs=2, parent=root,
        coll=coll)
    box(f"{name}_touchpad", (0.11, 0.066, 0.0006), (0, -0.078, 0.0153), pad, bev=0.003, parent=root, coll=coll)
    cylinder(f"{name}_dobradica", 0.005, 0.26, (0, 0.116, 0.016), alu, rot=(0, math.pi / 2, 0), verts=16, parent=root,
             coll=coll)
    hinge = empty(f"{name}_dobradicaPivo", (0, 0.115, 0.016), (math.radians(-15), 0, 0), coll=coll)  # tampa a 105°
    hinge.parent = root
    box(f"{name}_tampa", (0.34, 0.006, 0.225), (0, 0.003, 0.112), alu, bev=0.005, segs=4, parent=hinge, coll=coll)
    box(f"{name}_moldura", (0.334, 0.0008, 0.219), (0, -0.0003, 0.112), bezel, bev=0.004, parent=hinge, coll=coll)
    box(f"{name}_tela", (0.318, 0.0008, 0.196), (0, -0.0008, 0.114), scr, bev=0, parent=hinge, coll=coll)
    return root
