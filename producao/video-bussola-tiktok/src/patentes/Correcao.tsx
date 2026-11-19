// "Sem esperar o gabarito" — o sistema de correção da plataforma, com gravações reais.
// Clipes: scripts/footage.py --conjunto correcao → public/footage/correcao-<cena>.mp4
import React from "react";
import { AbsoluteFill, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import narrJson from "../data/narracao-correcao.json";
import footage from "../data/footage-correcao.json";
import { C, FONT, MONO } from "../theme";
import { Mono, Title, useSpring } from "../components/ui";
import { Selo } from "../components/assets";
import { Narr, Scene, ShortVideo, total, wordAt } from "../kit";

const NARR = narrJson as Narr;
const VEL = footage as Record<string, { velocidade: number }>;

/** TEMPOS (frames a 30 fps) — ajuste aqui e rode scripts/footage.py --conjunto correcao de novo */
export const SCENES_CORRECAO: Scene[] = [
  { id: "gancho", frames: 84, voz: "c1" },
  { id: "camera", frames: 96, voz: "c2" },
  { id: "le", frames: 116, voz: "c3" },
  { id: "mao", frames: 68, voz: "c4" },
  { id: "gabarito", frames: 62, voz: "c5" },
  { id: "comentario", frames: 70, voz: "c6" },
  { id: "pegadinha", frames: 92, voz: "c7" },
  { id: "falhas", frames: 80, voz: "c8" },
  { id: "cta", frames: 180, voz: "c9" },
];
export const TOTAL_CORRECAO = total(SCENES_CORRECAO);
const KEYS = ["gabarito?", "gabarito", "ninguem", "camera", "corrige", "comentario", "pegadinha", "banca", "erros", "simulado"];

type Cfg = {
  lbl: string;
  txt: string;
  hit?: string;
  /** zoom: centro (y no quadro 1080×1920) que vai para y=800, escala, faixa destacada [y0, y1] já na tela */
  zoom?: { cy: number; s: number; band?: [number, number]; tag: string };
  dy?: (f: number) => number;
};
const CFG: Record<string, Cfg> = {
  gancho: { lbl: "// SIMULADO FEITO", txt: "E AGORA, CADÊ O", hit: "GABARITO?" },
  camera: { lbl: "// SEM ESPERA", txt: "APONTE A", hit: "CÂMERA" },
  le: { lbl: "// CORREÇÃO AUTOMÁTICA", txt: "NOTA, ACERTOS", hit: "E ERROS", dy: (f) => interpolate(f, [62, 74], [0, -480], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) },
  mao: { lbl: "// SEM TRABALHO MANUAL", txt: "NADA DE CORRIGIR", hit: "NA MÃO" },
  gabarito: { lbl: "// EM CADA QUESTÃO", txt: "", hit: "GABARITO", zoom: { cy: 990, s: 1.55, band: [785, 915], tag: "GABARITO" } },
  comentario: { lbl: "// EM CADA QUESTÃO", txt: "", hit: "COMENTÁRIO", zoom: { cy: 1000, s: 1.45, band: [600, 1040], tag: "COMENTÁRIO · FUNDAMENTAÇÃO" } },
  pegadinha: { lbl: "// EM CADA QUESTÃO", txt: "", hit: "PEGADINHA", zoom: { cy: 660, s: 1.6, band: [640, 950], tag: "ALERTA DE PEGADINHA" } },
  falhas: { lbl: "// CADERNO DE ERROS", txt: "O ERRO NÃO", hit: "SE PERDE" },
};

const Footage: React.FC<{ id: string; frames: number }> = ({ id, frames }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cfg = CFG[id];
  const s = spring({ frame: f - 2, fps, config: { damping: 200, stiffness: 300 } });
  const vel = VEL[id]?.velocidade ?? 1;
  const z = cfg.zoom;
  const zk = z ? spring({ frame: f, fps, config: { damping: 200, stiffness: 120 } }) : 0;
  const scale = z ? interpolate(zk, [0, 1], [1.15, z.s]) : 1.02;
  const ty = z ? 800 - z.cy : cfg.dy ? cfg.dy(f) : 0;
  const origin = z ? `540px ${z.cy}px` : "50% 50%";
  const band = z?.band;
  const bandOn = spring({ frame: f - 8, fps, config: { damping: 200, stiffness: 260 } });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transformOrigin: origin, transform: `translateY(${ty}px) scale(${scale})` }}>
        <OffthreadVideo src={staticFile(`footage/correcao-${id}.mp4`)} muted style={{ width: 1080, height: 1920 }} />
      </AbsoluteFill>
      {z ? <AbsoluteFill style={{ background: "rgba(14,14,17,.35)" }} /> : null}
      {band ? (
        <>
          <div style={{ position: "absolute", left: 40, right: 40, top: band[0], height: band[1] - band[0], border: `5px solid ${C.red}`, borderRadius: 14, boxShadow: `0 0 0 2000px rgba(14,14,17,${0.45 * bandOn}), 0 0 40px rgba(227,25,43,.5)`, opacity: bandOn }} />
          <div style={{ position: "absolute", left: 40, top: band[0] - 52, fontFamily: MONO, fontWeight: 700, fontSize: 26, color: C.white, background: C.red, padding: "8px 14px", borderRadius: 6, opacity: bandOn, transform: `translateY(${(1 - bandOn) * 14}px)` }}>
            {z?.tag}
          </div>
        </>
      ) : null}
      {id === "mao" ? <XMao frames={frames} /> : null}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 400, background: "linear-gradient(rgba(14,14,17,.94), rgba(14,14,17,.78) 55%, rgba(14,14,17,0))" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1180, height: 740, background: "linear-gradient(rgba(14,14,17,0), rgba(14,14,17,.55) 30%, rgba(14,14,17,.9))" }} />
      <div style={{ position: "absolute", left: 80, top: 190, opacity: s, transform: `translateX(${(1 - s) * -40}px)` }}>
        <Mono size={28} color={C.red}>{cfg.lbl}</Mono>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 80, letterSpacing: -2.5, lineHeight: 1, color: C.white, marginTop: 8, textShadow: "0 4px 20px rgba(0,0,0,.6)" }}>
          {cfg.txt} {cfg.hit ? <span style={{ color: C.red, fontStyle: "italic" }}>{cfg.hit}</span> : null}
        </div>
      </div>
      {vel >= 1.8 ? (
        <div style={{ position: "absolute", right: 150, top: 200, fontFamily: MONO, fontWeight: 700, fontSize: 22, color: C.white, background: "rgba(14,14,17,.8)", border: `2px solid ${C.red}`, padding: "5px 10px", borderRadius: 4 }}>
          ⏩ ACELERADO {vel.toFixed(0)}×
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/** "✕" carimbado sobre a correção manual */
const XMao: React.FC<{ frames: number }> = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - 10, fps, config: { damping: 12, stiffness: 320, mass: 0.6 } });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center", opacity: f >= 10 ? 1 : 0 }}>
      <div style={{ transform: `scale(${interpolate(s, [0, 1], [2, 1])}) rotate(-8deg)`, border: `10px solid ${C.red}`, borderRadius: 18, padding: "10px 34px", background: "rgba(14,14,17,.75)", fontFamily: FONT, fontWeight: 900, fontSize: 88, color: C.red, letterSpacing: -2 }}>
        ✕ CONFERIR 1 POR 1
      </div>
    </div>
  );
};

const Cta: React.FC<{ frames: number }> = ({ frames }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const btnAt = Math.min(frames - 50, wordAt(NARR, "c9", "comenta", 30));
  const btn = spring({ frame: f - btnAt, fps, config: { damping: 200, stiffness: 300 } });
  const pulse = f > btnAt + 8 ? 1 + Math.sin(((f - btnAt) / fps) * Math.PI * 3.2) * 0.035 : 1;
  const sub = useSpring(wordAt(NARR, "c9", "grupo", 60));
  const selo = useSpring(0);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, width: 1080, top: 200, display: "flex", justifyContent: "center", opacity: selo, transform: `scale(${0.8 + selo * 0.2})` }}><Selo size={200} /></div>
      <Title size={100} parts={[{ t: "SIMULADOS", br: true }, { t: "OPERAÇÃO", hit: true, br: true }, { t: "APROVAÇÃO", hit: true }]} style={{ position: "absolute", left: 0, width: 1080, top: 440, textAlign: "center" }} delay={2} />
      <div style={{ position: "absolute", left: 80, top: 770, width: 860, display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
        {["CORREÇÃO PELA CÂMERA", "GABARITO", "COMENTÁRIO", "PEGADINHA DA BANCA"].map((t, i) => (
          <span key={t} style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, color: C.white, border: `2px solid ${C.red}`, borderRadius: 6, padding: "6px 12px", opacity: f >= 6 + i * 4 ? 1 : 0 }}>✓ {t}</span>
        ))}
      </div>
      <div style={{ position: "absolute", left: 80, top: 900, width: 860, height: 120, background: C.red, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 58, letterSpacing: -1.5, color: C.white, opacity: btn, transform: `translateY(${(1 - btn) * 30}px) scale(${pulse})`, boxShadow: `0 0 ${30 + (pulse - 1) * 800}px rgba(227,25,43,.55)` }}>
        COMENTE “SIMULADO”
      </div>
      <Mono size={28} color={C.white} style={{ position: "absolute", left: 80, top: 1045, width: 860, textAlign: "center", opacity: sub, lineHeight: 1.4 }}>
        e entre no grupo de espera<br /><span style={{ color: C.red }}>desconto de lançamento</span>
      </Mono>
      <div style={{ position: "absolute", left: 80, top: 1440, width: 860, textAlign: "center", fontFamily: MONO, fontSize: 18, color: C.gray, lineHeight: 1.45 }}>
        Imagens reais da versão de pré-lançamento. Correção pela câmera disponível no plano Anual.<br />Plataforma educacional independente. Não garantimos aprovação.
      </div>
    </AbsoluteFill>
  );
};

export const CorrecaoVideo: React.FC = () => (
  <ShortVideo
    scenes={SCENES_CORRECAO}
    narr={NARR}
    keys={KEYS}
    musica="trilha-correcao.wav"
    render={(id, frames) => (id === "cta" ? <Cta frames={frames} /> : <Footage id={id} frames={frames} />)}
  />
);
