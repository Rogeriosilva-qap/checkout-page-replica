// "Na prova do Cebraspe, chutar pode te reprovar" + PC TO (Cebraspe contratado, 452 vagas previstas, edital anunciado).
// Regra Cebraspe (itens C/E): nota líquida = certas − erradas; em branco não pontua nem desconta.
// Duas chamadas: Instagram ("comenta TOCANTINS", ManyChat) e TikTok ("link na bio").
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import narrJson from "../data/narracao-cebraspe.json";
import { C, FONT, MONO } from "../theme";
import { Mono, Title, useSpring } from "../components/ui";
import { Selo } from "../components/assets";
import { Narr, Scene, ShortVideo, total, wordAt } from "../kit";

const NARR = narrJson as Narr;
const VERDE = "#2FBF71";
const fr = (id: string, extra = 12) => Math.ceil(NARR.cenas[id].duracao * 30) + 3 + extra;
export type CtaCebraspe = "ig" | "tiktok";
export const scenesCebraspe = (cta: CtaCebraspe): Scene[] => [
  { id: "gancho", frames: fr("c1", 14), voz: "c1" },
  { id: "regra", frames: fr("c2", 14), voz: "c2" },
  { id: "chutou", frames: fr("c3", 16), voz: "c3" },
  { id: "branco", frames: fr("c4", 16), voz: "c4" },
  { id: "media", frames: fr("c5", 14), voz: "c5" },
  { id: "pcto", frames: fr("c6", 12), voz: "c6" },
  { id: "cta", frames: fr(cta === "ig" ? "c7" : "c7b", 75), voz: cta === "ig" ? "c7" : "c7b" },
];
export const totalCebraspe = (cta: CtaCebraspe) => total(scenesCebraspe(cta));
const KEYS = ["setenta", "vinte", "anula", "erradas", "branco", "risco", "cebraspe", "tocantins", "bio"];

const Placar: React.FC<{ linhas: [string, number, string][]; nota: number; cor: string; at: number }> = ({ linhas, nota, cor, at }) => {
  const f = useCurrentFrame();
  const n = Math.round(interpolate(f, [at, at + 18], [0, nota], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const a = interpolate(f, [at - 4, at + 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 100, right: 160, top: 330 }}>
      {linhas.map(([t, v, c], i) => {
        const s = interpolate(f, [2 + i * 6, 10 + i * 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={t} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "22px 30px", marginBottom: 16, background: C.box, border: `2px solid ${C.border}`, borderLeft: `10px solid ${c}`, borderRadius: 10, opacity: s }}>
            <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 56, color: C.white }}>{t}</span>
            <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 72, color: c }}>{v}</span>
          </div>
        );
      })}
      <div style={{ marginTop: 40, textAlign: "center", opacity: a, transform: `scale(${0.8 + a * 0.2})` }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 40, color: C.gray, letterSpacing: 4 }}>NOTA LÍQUIDA</div>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 240, color: cor, lineHeight: 1, letterSpacing: -10, textShadow: `0 0 70px ${cor}66` }}>{n}</div>
      </div>
    </div>
  );
};

const Gancho: React.FC = () => {
  const f = useCurrentFrame();
  const at = wordAt(NARR, "c1", "nota", 40);
  const nota = interpolate(f, [at - 2, at + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Mono size={30} color={C.red} style={{ position: "absolute", left: 100, top: 250 }}>// PROVA CEBRASPE</Mono>
      <div style={{ position: "absolute", left: 0, right: 0, top: 320, textAlign: "center" }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 64, color: C.white }}>ACERTOU</div>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 230, color: VERDE, lineHeight: 1, letterSpacing: -10 }}>70</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 720, textAlign: "center", opacity: nota, transform: `scale(${1.4 - nota * 0.4})` }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 64, color: C.white }}>E TIROU NOTA</div>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontStyle: "italic", fontSize: 230, color: C.red, lineHeight: 1, letterSpacing: -10, textShadow: "0 0 70px rgba(227,25,43,.5)" }}>20?</div>
      </div>
    </AbsoluteFill>
  );
};

const Regra: React.FC = () => {
  const s = useSpring(4);
  return (
    <AbsoluteFill>
      <Mono size={30} color={C.red} style={{ position: "absolute", left: 100, top: 250 }}>// A REGRA DO CEBRASPE</Mono>
      <div style={{ position: "absolute", left: 0, right: 0, top: 420, display: "flex", justifyContent: "center", alignItems: "center", gap: 30, opacity: s, transform: `scale(${0.85 + s * 0.15})` }}>
        <div style={{ textAlign: "center" }}><div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 200, color: C.red, lineHeight: 1 }}>1</div><div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 40, color: C.white }}>ERRADA</div></div>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 150, color: C.gray }}>=</div>
        <div style={{ textAlign: "center" }}><div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 200, color: C.white, lineHeight: 1 }}>−1</div><div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 40, color: C.white }}>CERTA</div></div>
      </div>
      <Title size={70} delay={14} parts={[{ t: "UMA ERRADA" }, { t: "ANULA", hit: true }, { t: "UMA CERTA" }]} style={{ position: "absolute", left: 80, right: 80, top: 820, textAlign: "center" }} />
    </AbsoluteFill>
  );
};

const Chutou: React.FC = () => (
  <AbsoluteFill>
    <Mono size={30} color={C.red} style={{ position: "absolute", left: 100, top: 250 }}>// QUEM CHUTOU</Mono>
    <Placar linhas={[["CERTAS", 70, VERDE], ["ERRADAS", 50, C.red]]} nota={20} cor={C.red} at={wordAt(NARR, "c3", "nota", 60)} />
  </AbsoluteFill>
);

const Branco: React.FC = () => (
  <AbsoluteFill>
    <Mono size={30} color={VERDE} style={{ position: "absolute", left: 100, top: 250 }}>// QUEM DEIXOU EM BRANCO</Mono>
    <Placar linhas={[["CERTAS", 70, VERDE], ["EM BRANCO", 50, C.gray]]} nota={70} cor={VERDE} at={wordAt(NARR, "c4", "nota", 70)} />
  </AbsoluteFill>
);

const Media: React.FC = () => {
  const f = useCurrentFrame();
  const flip = Math.floor(f / 7) % 2 === 0;
  const risco = useSpring(wordAt(NARR, "c5", "risco", 90) - 4);
  return (
    <AbsoluteFill>
      <Mono size={30} color={C.red} style={{ position: "absolute", left: 100, top: 250 }}>// E O CHUTE?</Mono>
      <div style={{ position: "absolute", left: 0, right: 0, top: 340, display: "flex", justifyContent: "center", gap: 40 }}>
        {["+1", "−1"].map((t, i) => (
          <div key={t} style={{ width: 300, height: 300, borderRadius: 150, border: `8px solid ${i === 0 ? VERDE : C.red}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 130, color: i === 0 ? VERDE : C.red, opacity: (flip ? i === 0 : i === 1) ? 1 : 0.35, transform: `scale(${(flip ? i === 0 : i === 1) ? 1.05 : 0.95})` }}>{t}</div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 700, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 44, color: C.white }}>50% de chance de cada</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 790, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 90, color: C.white, letterSpacing: -3 }}>NA MÉDIA: <span style={{ color: C.red }}>0</span></div>
      <Title size={76} parts={[{ t: "SÓ AUMENTA O" }, { t: "RISCO", hit: true }]} style={{ position: "absolute", left: 0, width: 1080, top: 960, textAlign: "center", opacity: risco }} />
    </AbsoluteFill>
  );
};

const Pcto: React.FC = () => {
  const f = useCurrentFrame();
  const n = Math.round(interpolate(f, [wordAt(NARR, "c6", "quatrocentas", 80) - 4, wordAt(NARR, "c6", "quatrocentas", 80) + 20], [0, 452], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const ed = useSpring(wordAt(NARR, "c6", "edital", 160) - 4);
  return (
    <AbsoluteFill>
      <Mono size={30} color={C.red} style={{ position: "absolute", left: 100, top: 250 }}>// POLÍCIA CIVIL DO TOCANTINS</Mono>
      <div style={{ position: "absolute", left: 100, top: 330, display: "flex", alignItems: "center", gap: 18, opacity: useSpring(2) }}>
        <span style={{ fontSize: 60 }}>✅</span>
        <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 64, color: C.white, letterSpacing: -1.5 }}>CEBRASPE <span style={{ color: C.red, fontStyle: "italic" }}>CONTRATADO</span></span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 470, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 230, color: C.white, letterSpacing: -8 }}>{n}</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 730, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 60, color: C.white }}>VAGAS <span style={{ color: C.gray }}>PREVISTAS</span></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 830, display: "flex", justifyContent: "center", gap: 14, opacity: useSpring(20) }}>
        {["DELEGADO", "INVESTIGADOR", "PERITO"].map((t) => <span key={t} style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, color: C.white, border: `3px solid ${C.red}`, borderRadius: 8, padding: "10px 16px" }}>{t}</span>)}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 960, textAlign: "center", opacity: ed }}>
        <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 58, color: C.white, background: C.red, padding: "10px 26px", borderRadius: 8 }}>EDITAL ANUNCIADO</span>
      </div>
    </AbsoluteFill>
  );
};

const Cta: React.FC<{ frames: number; cta: CtaCebraspe }> = ({ frames, cta }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = Math.min(frames - 50, cta === "ig" ? wordAt(NARR, "c7", "comenta", 2) : wordAt(NARR, "c7b", "link", 40) - 6);
  const s = spring({ frame: f - at, fps, config: { damping: 200, stiffness: 300 } });
  const pulse = f > at + 8 ? 1 + Math.sin(((f - at) / fps) * Math.PI * 3.2) * 0.035 : 1;
  const bob = f > at ? Math.sin((f - at) / 5) * 14 : 0;
  return (
    <AbsoluteFill>
      {cta === "tiktok" ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 220, display: "flex", flexDirection: "column", alignItems: "center", opacity: s, transform: `translateY(${bob}px)` }}>
          <svg width={150} height={170} viewBox="0 0 150 170"><path d="M75 6 L140 80 H100 V164 H50 V80 H10 Z" fill={C.red} /></svg>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 100, letterSpacing: -4, color: C.white, marginTop: 10 }}>LINK NA <span style={{ color: C.red, fontStyle: "italic" }}>BIO</span></div>
        </div>
      ) : null}
      <div style={{ position: "absolute", left: 0, width: 1080, top: cta === "tiktok" ? 620 : 220, display: "flex", justifyContent: "center", opacity: useSpring(0) }}><Selo size={cta === "tiktok" ? 150 : 180} /></div>
      <Title size={cta === "tiktok" ? 76 : 92} delay={4} parts={[{ t: "MISSÃO", br: true }, { t: "PC TO", hit: true }]} style={{ position: "absolute", left: 0, width: 1080, top: cta === "tiktok" ? 800 : 440, textAlign: "center" }} />
      {cta === "ig" ? (
        <div style={{ position: "absolute", left: 80, top: 700, width: 860, height: 130, background: C.red, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 62, letterSpacing: -1.5, color: C.white, opacity: s, transform: `translateY(${(1 - s) * 30}px) scale(${pulse})`, boxShadow: `0 0 ${30 + (pulse - 1) * 800}px rgba(227,25,43,.55)` }}>
          COMENTE “TOCANTINS”
        </div>
      ) : null}
      <Mono size={30} color={C.white} style={{ position: "absolute", left: 0, width: 1080, top: cta === "tiktok" ? 990 : 870, textAlign: "center", opacity: useSpring(10) }}>grupo de estudos gratuito · estilo Cebraspe</Mono>
      <div style={{ position: "absolute", left: 80, top: 1440, width: 860, textAlign: "center", fontFamily: MONO, fontSize: 19, color: C.gray, lineHeight: 1.45 }}>
        Edital da PC TO ainda não publicado: acompanhe o site do Cebraspe. Exemplo de nota ilustrativo.<br />Conteúdo educativo, sem vínculo com a PC TO, o Governo do Tocantins ou o Cebraspe.
      </div>
    </AbsoluteFill>
  );
};

const CebraspeVideo: React.FC<{ cta: CtaCebraspe }> = ({ cta }) => (
  <ShortVideo
    scenes={scenesCebraspe(cta)}
    narr={NARR}
    keys={KEYS}
    musica="trilha-cebraspe.wav"
    render={(id, frames) => {
      switch (id) {
        case "gancho": return <Gancho />;
        case "regra": return <Regra />;
        case "chutou": return <Chutou />;
        case "branco": return <Branco />;
        case "media": return <Media />;
        case "pcto": return <Pcto />;
        default: return <Cta frames={frames} cta={cta} />;
      }
    }}
  />
);
export const CebraspeIg: React.FC = () => <CebraspeVideo cta="ig" />;
export const CebraspeTiktok: React.FC = () => <CebraspeVideo cta="tiktok" />;
