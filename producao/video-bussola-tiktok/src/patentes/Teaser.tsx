// Teaser de 10 s da plataforma Simulados Operação Aprovação (pré-lançamento).
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import narrJson from "../data/narracao-teaser.json";
import { C, FONT, MONO } from "../theme";
import { Mono, Title, useSpring } from "../components/ui";
import { Selo } from "../components/assets";
import { Narr, Scene, ShortVideo, total, wordAt } from "../kit";

const NARR = narrJson as Narr;

/** TEMPOS (frames a 30 fps) — ajuste aqui */
export const SCENES_TEASER: Scene[] = [
  { id: "vem", frames: 36, voz: "t1" },
  { id: "nome", frames: 75, voz: "t2" },
  { id: "recursos", frames: 76 },
  { id: "cta", frames: 113, voz: "t3" },
];
export const TOTAL_TEASER = total(SCENES_TEASER);
const KEYS = ["simulados", "simulado", "vem"];

const RECURSOS = [
  ["SIMULADO NO PADRÃO", "DA SUA BANCA"],
  ["CORREÇÃO PELA", "CÂMERA DO CELULAR"],
  ["MODO", "REDENÇÃO"],
  ["DE RECRUTA", "A CAVEIRA"],
];

const Vem: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - 2, fps, config: { damping: 10, stiffness: 300, mass: 0.6 } });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontStyle: "italic", fontSize: 230, letterSpacing: -10, color: C.red, transform: `scale(${interpolate(s, [0, 1], [2.2, 1])})`, opacity: s, textShadow: "0 0 70px rgba(227,25,43,.5)", marginTop: -200 }}>
        VEM AÍ
      </div>
    </AbsoluteFill>
  );
};

const Nome: React.FC = () => {
  const selo = useSpring(0);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, width: 1080, top: 240, display: "flex", justifyContent: "center", opacity: selo, transform: `scale(${0.7 + selo * 0.3}) rotate(${(1 - selo) * -30}deg)` }}><Selo size={280} /></div>
      <Title size={118} parts={[{ t: "SIMULADOS", br: true }, { t: "OPERAÇÃO", hit: true, br: true }, { t: "APROVAÇÃO", hit: true }]} style={{ position: "absolute", left: 0, width: 1080, top: 600, textAlign: "center" }} delay={3} />
      <Mono size={28} color={C.white} style={{ position: "absolute", left: 0, width: 1080, top: 1010, textAlign: "center", letterSpacing: 3, opacity: useSpring(14) }}>
        PM · PC · PF · PRF · POLÍCIA PENAL · GCM
      </Mono>
    </AbsoluteFill>
  );
};

const Recursos: React.FC<{ frames: number }> = ({ frames }) => {
  const f = useCurrentFrame();
  const per = Math.floor(frames / RECURSOS.length);
  const i = Math.min(RECURSOS.length - 1, Math.floor(f / per));
  const local = f - i * per;
  const jit = local < 2 ? (local === 0 ? 14 : -8) : 0;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Mono size={30} color={C.red} style={{ position: "absolute", top: 380, left: 0, width: 1080, textAlign: "center" }}>
        // RECURSO 0{i + 1}/04
      </Mono>
      <div style={{ textAlign: "center", transform: `translateX(${jit}px)`, marginTop: -160 }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 84, letterSpacing: -3, color: C.white, lineHeight: 1 }}>{RECURSOS[i][0]}</div>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontStyle: "italic", fontSize: 96, letterSpacing: -3, color: C.red, lineHeight: 1.05 }}>{RECURSOS[i][1]}</div>
      </div>
      <div style={{ position: "absolute", top: 1130, left: 240, width: 600, height: 10, background: C.box, border: `2px solid ${C.border}` }}>
        <div style={{ width: `${((f + 1) / frames) * 100}%`, height: "100%", background: C.red }} />
      </div>
    </AbsoluteFill>
  );
};

const Cta: React.FC<{ frames: number }> = ({ frames }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const btnAt = Math.min(frames - 40, wordAt(NARR, "t3", "comenta", 4));
  const btn = spring({ frame: f - btnAt, fps, config: { damping: 200, stiffness: 300 } });
  const pulse = f > btnAt + 8 ? 1 + Math.sin(((f - btnAt) / fps) * Math.PI * 3.2) * 0.035 : 1;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, width: 1080, top: 230, display: "flex", justifyContent: "center" }}><Selo size={200} /></div>
      <Mono size={34} color={C.white} style={{ position: "absolute", left: 0, width: 1080, top: 480, textAlign: "center", letterSpacing: 8 }}>● EM BREVE</Mono>
      <div style={{ position: "absolute", left: 80, top: 600, width: 860, height: 130, background: C.red, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 62, letterSpacing: -1.5, color: C.white, opacity: btn, transform: `translateY(${(1 - btn) * 30}px) scale(${pulse})`, boxShadow: `0 0 ${30 + (pulse - 1) * 800}px rgba(227,25,43,.55)` }}>
        COMENTE “SIMULADO”
      </div>
      <Mono size={30} color={C.white} style={{ position: "absolute", left: 80, top: 770, width: 860, textAlign: "center", lineHeight: 1.45, opacity: btn }}>
        e entre no grupo de espera<br /><span style={{ color: C.red }}>desconto de lançamento</span>
      </Mono>
      <div style={{ position: "absolute", left: 80, top: 1450, width: 860, textAlign: "center", fontFamily: MONO, fontSize: 18, color: C.gray }}>
        Plataforma educacional independente. Recursos variam conforme o plano.
      </div>
    </AbsoluteFill>
  );
};

export const TeaserVideo: React.FC = () => (
  <ShortVideo
    scenes={SCENES_TEASER}
    narr={NARR}
    keys={KEYS}
    musica="trilha-teaser.wav"
    render={(id, frames) => (id === "vem" ? <Vem /> : id === "nome" ? <Nome /> : id === "recursos" ? <Recursos frames={frames} /> : <Cta frames={frames} />)}
  />
);
