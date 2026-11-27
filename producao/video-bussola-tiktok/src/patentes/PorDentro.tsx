// "Corrigi o simulado só apontando o celular" — por dentro da plataforma, com gravações reais.
// As gravações são cortadas por scripts/footage.py (public/footage/<cena>.mp4).
import React from "react";
import { AbsoluteFill, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import narrJson from "../data/narracao-por-dentro.json";
import footage from "../data/footage.json";
import { C, FONT, MONO } from "../theme";
import { Mono, Title, useSpring } from "../components/ui";
import { Selo } from "../components/assets";
import { Narr, Scene, ShortVideo, total, wordAt } from "../kit";

const NARR = narrJson as Narr;
const VEL = footage as Record<string, { velocidade: number }>;

/** TEMPOS (frames a 30 fps) — ajuste aqui e rode scripts/footage.py de novo */
export const SCENES_POR_DENTRO: Scene[] = [
  { id: "gancho", frames: 75, voz: "d1" },
  { id: "imprime", frames: 107, voz: "d2" },
  { id: "marca", frames: 66, voz: "d3" },
  { id: "camera", frames: 60, voz: "d4" },
  { id: "le", frames: 114, voz: "d5" },
  { id: "falhas", frames: 102, voz: "d6" },
  { id: "redencao", frames: 150, voz: "d7" },
  { id: "cta", frames: 178, voz: "d8" },
];
export const TOTAL_POR_DENTRO = total(SCENES_POR_DENTRO);
const KEYS = ["celular", "banca", "camera", "nota", "erros", "redencao", "dominada", "simulado"];

const ETAPAS: Record<string, [string, string]> = {
  gancho: ["// RESULTADO REAL", "CORRIGIDO PELO CELULAR"],
  imprime: ["// 01", "IMPRIMA A PROVA"],
  marca: ["// 02", "MARQUE O CARTÃO"],
  camera: ["// 03", "APONTE A CÂMERA"],
  le: ["// 04", "NOTA, ACERTOS E ERROS"],
  falhas: ["// 05", "CADERNO DE ERROS"],
  redencao: ["// 06", "MODO REDENÇÃO"],
};

const Footage: React.FC<{ id: string }> = ({ id }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [lbl, txt] = ETAPAS[id];
  const s = spring({ frame: f - 2, fps, config: { damping: 200, stiffness: 300 } });
  const vel = VEL[id]?.velocidade ?? 1;
  const zoom = id === "gancho" ? interpolate(f, [0, 75], [1.0, 1.08]) : 1.02;
  // sobe a imagem quando o resultado fica no pé da tela (para não ficar sob a legenda)
  const dy = id === "gancho" ? -430 : id === "le" ? interpolate(f, [62, 74], [0, -480], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateY(${dy}px) scale(${zoom})` }}>
        <OffthreadVideo src={staticFile(`footage/${id}.mp4`)} muted style={{ width: 1080, height: 1920 }} />
      </AbsoluteFill>
      {/* faixas escuras para leitura do título e da legenda */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 420, background: "linear-gradient(rgba(14,14,17,.92), rgba(14,14,17,.75) 55%, rgba(14,14,17,0))" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1180, height: 740, background: "linear-gradient(rgba(14,14,17,0), rgba(14,14,17,.55) 30%, rgba(14,14,17,.85))" }} />
      <div style={{ position: "absolute", left: 80, top: 190, opacity: s, transform: `translateX(${(1 - s) * -40}px)` }}>
        <Mono size={28} color={C.red}>{lbl}</Mono>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 76, letterSpacing: -2.5, lineHeight: 1, color: C.white, marginTop: 8, textShadow: "0 4px 20px rgba(0,0,0,.6)" }}>{txt}</div>
      </div>
      {vel > 1.3 && id !== "gancho" ? (
        <div style={{ position: "absolute", right: 150, top: 200, fontFamily: MONO, fontWeight: 700, fontSize: 22, color: C.white, background: "rgba(14,14,17,.8)", border: `2px solid ${C.red}`, padding: "5px 10px", borderRadius: 4 }}>
          ⏩ ACELERADO {vel.toFixed(0)}×
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const Cta: React.FC<{ frames: number }> = ({ frames }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const btnAt = Math.min(frames - 50, wordAt(NARR, "d8", "comenta", 30));
  const btn = spring({ frame: f - btnAt, fps, config: { damping: 200, stiffness: 300 } });
  const pulse = f > btnAt + 8 ? 1 + Math.sin(((f - btnAt) / fps) * Math.PI * 3.2) * 0.035 : 1;
  const sub = useSpring(wordAt(NARR, "d8", "grupo", 60));
  const selo = useSpring(0);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, width: 1080, top: 200, display: "flex", justifyContent: "center", opacity: selo, transform: `scale(${0.8 + selo * 0.2})` }}><Selo size={210} /></div>
      <Title size={104} parts={[{ t: "SIMULADOS", br: true }, { t: "OPERAÇÃO", hit: true, br: true }, { t: "APROVAÇÃO", hit: true }]} style={{ position: "absolute", left: 0, width: 1080, top: 450, textAlign: "center" }} delay={2} />
      <Mono size={30} color={C.white} style={{ position: "absolute", left: 0, width: 1080, top: 790, textAlign: "center", letterSpacing: 6 }}>● QUASE SAINDO</Mono>
      <div style={{ position: "absolute", left: 80, top: 880, width: 860, height: 120, background: C.red, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 58, letterSpacing: -1.5, color: C.white, opacity: btn, transform: `translateY(${(1 - btn) * 30}px) scale(${pulse})`, boxShadow: `0 0 ${30 + (pulse - 1) * 800}px rgba(227,25,43,.55)` }}>
        COMENTE “SIMULADO”
      </div>
      <Mono size={28} color={C.white} style={{ position: "absolute", left: 80, top: 1030, width: 860, textAlign: "center", opacity: sub, lineHeight: 1.4 }}>
        e entre no grupo de espera<br /><span style={{ color: C.red }}>desconto de lançamento</span>
      </Mono>
      <div style={{ position: "absolute", left: 80, top: 1440, width: 860, textAlign: "center", fontFamily: MONO, fontSize: 18, color: C.gray, lineHeight: 1.45 }}>
        Imagens reais da versão de pré-lançamento. Correção pela câmera disponível no plano Anual.<br />Plataforma educacional independente. Não garantimos aprovação.
      </div>
    </AbsoluteFill>
  );
};

export const PorDentroVideo: React.FC = () => (
  <ShortVideo
    scenes={SCENES_POR_DENTRO}
    narr={NARR}
    keys={KEYS}
    musica="trilha-por-dentro.wav"
    render={(id, frames) => (id === "cta" ? <Cta frames={frames} /> : <Footage id={id} />)}
  />
);
