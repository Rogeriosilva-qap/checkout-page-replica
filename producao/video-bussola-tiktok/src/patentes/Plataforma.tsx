// "Escolhi meu concurso e a plataforma montou meu plano" — Bússola Tática da plataforma de simulados.
// Gravação real (23/11) em public/footage/bussola-tatica.mp4 (1080×2400, 30 fps). Paleta dourada da plataforma.
import React from "react";
import { AbsoluteFill, Img, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import narrJson from "../data/narracao-plataforma.json";
import { C, FONT, MONO } from "../theme";
import { Narr, Scene, ShortVideo, total, wordAt } from "../kit";
import { Selo } from "../components/assets";

const NARR = narrJson as Narr;
export const GOLD = "#D4A63A";
const GLOW = "rgba(212,166,58,0.14)";

/** TEMPOS (frames a 30 fps) — ajuste aqui */
export const SCENES_PLATAFORMA: Scene[] = [
  { id: "gancho", frames: 90, voz: "b1" },
  { id: "escolha", frames: 112, voz: "b2" },
  { id: "perfil", frames: 96, voz: "b3" },
  { id: "incidencia", frames: 100, voz: "b4" },
  { id: "plano", frames: 134, voz: "b5" },
  { id: "desempenho", frames: 102, voz: "b6" },
  { id: "cta", frames: 150, voz: "b7" },
];
export const TOTAL_PLATAFORMA = total(SCENES_PLATAFORMA);
const KEYS = ["concurso", "raio-x.", "banca:", "vunesp", "peso", "plano", "ponto.", "simulado"];

/** trecho da gravação: início (s), velocidade e deslocamento vertical */
const Clip: React.FC<{ from: number; rate?: number; dy?: number; dur?: number }> = ({ from, rate = 1, dy = 0, dur = 400 }) => (
  <Sequence durationInFrames={dur}>
    <AbsoluteFill style={{ transform: `translateY(${dy}px)` }}>
      <OffthreadVideo src={staticFile("footage/bussola-tatica.mp4")} startFrom={Math.round(from * 30)} playbackRate={rate} muted style={{ width: 1080, height: 2400 }} />
    </AbsoluteFill>
  </Sequence>
);

const Overlay: React.FC<{ lbl: string; txt: string; hit: string; note?: string; speed?: number }> = ({ lbl, txt, hit, note, speed }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - 2, fps, config: { damping: 200, stiffness: 300 } });
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 470, background: "linear-gradient(rgba(14,14,17,.98), rgba(14,14,17,.93) 65%, rgba(14,14,17,0))" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1170, height: 750, background: "linear-gradient(rgba(14,14,17,0), rgba(14,14,17,.6) 30%, rgba(14,14,17,.92))" }} />
      <div style={{ position: "absolute", left: 80, top: 190, opacity: s, transform: `translateX(${(1 - s) * -40}px)` }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 28, color: GOLD, letterSpacing: 1 }}>{lbl}</div>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 76, letterSpacing: -2.5, lineHeight: 1, color: C.white, marginTop: 8, textShadow: "0 4px 20px rgba(0,0,0,.6)", textTransform: "uppercase" }}>
          {txt} <span style={{ color: GOLD, fontStyle: "italic" }}>{hit}</span>
        </div>
      </div>
      {speed ? (
        <div style={{ position: "absolute", right: 150, top: 200, fontFamily: MONO, fontWeight: 700, fontSize: 22, color: C.white, background: "rgba(14,14,17,.85)", border: `2px solid ${GOLD}`, padding: "5px 10px", borderRadius: 4 }}>⏩ ACELERADO</div>
      ) : null}
      {note ? (
        <div style={{ position: "absolute", left: 80, right: 140, top: 1450, fontFamily: MONO, fontSize: 19, color: C.gray, textAlign: "center", lineHeight: 1.4 }}>{note}</div>
      ) : null}
    </>
  );
};

const NOTE = "Raio-X: estimativa baseada no histórico de provas da banca, não é dado oficial.";

const Gancho: React.FC = () => (
  <AbsoluteFill>
    <Clip from={50.5} rate={0.45} dy={-260} />
    <AbsoluteFill style={{ background: "rgba(14,14,17,.55)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 760, background: "linear-gradient(rgba(14,14,17,.97), rgba(14,14,17,.9) 70%, rgba(14,14,17,0))" }} />
    <div style={{ position: "absolute", left: 80, top: 200, right: 80 }}>
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 28, color: GOLD }}>// SIMULADOS OPERAÇÃO APROVAÇÃO</div>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 104, letterSpacing: -4, lineHeight: 0.95, color: C.white, marginTop: 14, textTransform: "uppercase" }}>
        Escolhi meu concurso…<br /><span style={{ color: GOLD, fontStyle: "italic" }}>e ganhei um plano.</span>
      </div>
    </div>
  </AbsoluteFill>
);

const Escolha: React.FC<{ frames: number }> = ({ frames }) => (
  <AbsoluteFill>
    <Sequence durationInFrames={70}><Clip from={0} rate={1} dy={120} /></Sequence>
    <Sequence from={70} durationInFrames={frames - 70}><Clip from={33} rate={2.2} dy={120} /></Sequence>
    <Overlay lbl="// BÚSSOLA TÁTICA" txt="Edital, cargo e" hit="banca" speed={1} />
  </AbsoluteFill>
);

const Desempenho: React.FC<{ frames: number }> = ({ frames }) => {
  const f = useCurrentFrame();
  const dy = interpolate(f, [0, frames], [-300, -760], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Img src={staticFile("footage/disciplinas.png")} style={{ position: "absolute", left: 0, top: dy, width: 1080, height: 2400, clipPath: "inset(380px 0 190px 0)" }} />
      <Overlay lbl="// DEPOIS DE CADA SIMULADO" txt="Onde você" hit="perde ponto" />
    </AbsoluteFill>
  );
};

const Cta: React.FC<{ frames: number }> = ({ frames }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const btnAt = Math.min(frames - 50, wordAt(NARR, "b7", "comenta", 30));
  const btn = spring({ frame: f - btnAt, fps, config: { damping: 200, stiffness: 300 } });
  const pulse = f > btnAt + 8 ? 1 + Math.sin(((f - btnAt) / fps) * Math.PI * 3.2) * 0.035 : 1;
  const nums: [string, string][] = [["19.053", "questões no acervo"], ["91", "editais mapeados"], ["2.334", "flashcards"]];
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, width: 1080, top: 190, display: "flex", justifyContent: "center" }}><Selo size={170} /></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 390, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 80, lineHeight: 0.95, letterSpacing: -3.5, color: C.white, textTransform: "uppercase" }}>
        Simulados<br /><span style={{ color: GOLD, fontStyle: "italic" }}>Operação Aprovação</span>
      </div>
      <div style={{ position: "absolute", left: 80, right: 80, top: 650, display: "flex", justifyContent: "space-between" }}>
        {nums.map(([n, t], i) => {
          const s = spring({ frame: f - 6 - i * 5, fps, config: { damping: 200, stiffness: 300 } });
          return (
            <div key={t} style={{ width: 280, textAlign: "center", opacity: s, transform: `translateY(${(1 - s) * 20}px)`, border: `2px solid ${C.border}`, borderTop: `4px solid ${GOLD}`, borderRadius: 8, padding: "16px 8px", background: C.box }}>
              <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 46, color: C.white }}>{n}</div>
              <div style={{ fontFamily: MONO, fontSize: 19, color: C.gray, marginTop: 4 }}>{t}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 80, top: 870, width: 860, height: 120, background: GOLD, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 58, letterSpacing: -1.5, color: "#111", opacity: btn, transform: `translateY(${(1 - btn) * 30}px) scale(${pulse})`, boxShadow: `0 0 ${30 + (pulse - 1) * 800}px rgba(212,166,58,.5)` }}>
        COMENTE “SIMULADO”
      </div>
      <div style={{ position: "absolute", left: 80, top: 1015, width: 860, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 28, color: C.white, lineHeight: 1.4, opacity: btn }}>
        e entre no grupo de espera<br /><span style={{ color: GOLD }}>desconto de lançamento</span>
      </div>
      <div style={{ position: "absolute", left: 80, top: 1440, width: 860, textAlign: "center", fontFamily: MONO, fontSize: 18, color: C.gray, lineHeight: 1.45 }}>
        Imagens reais da versão de pré-lançamento. Recursos variam conforme o plano.<br />Plataforma educacional independente. Não garantimos aprovação.
      </div>
    </AbsoluteFill>
  );
};

export const PlataformaVideo: React.FC = () => (
  <ShortVideo
    scenes={SCENES_PLATAFORMA}
    narr={NARR}
    keys={KEYS}
    musica="trilha-plataforma.wav"
    accent={GOLD}
    glow={GLOW}
    render={(id, frames) => {
      switch (id) {
        case "gancho": return <Gancho />;
        case "escolha": return <Escolha frames={frames} />;
        case "perfil": return <AbsoluteFill><Clip from={37} rate={0.6} dy={-380} /><Overlay lbl="// RAIO-X DA BANCA" txt="O que a banca" hit="mais cobra" note={NOTE} /></AbsoluteFill>;
        case "incidencia": return <AbsoluteFill><Clip from={41.6} rate={1.7} dy={-330} /><Overlay lbl="// RAIO-X DE INCIDÊNCIA" txt="Peso de cada" hit="matéria" note={NOTE} speed={1} /></AbsoluteFill>;
        case "plano": return <AbsoluteFill><Clip from={49.4} rate={0.7} dy={-300} /><Overlay lbl="// PLANO DE ATAQUE SEMANAL" txt="Dia por" hit="dia" speed={1} /></AbsoluteFill>;
        case "desempenho": return <Desempenho frames={frames} />;
        default: return <Cta frames={frames} />;
      }
    }}
  />
);
