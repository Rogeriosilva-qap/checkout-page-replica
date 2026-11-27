// Reels "A prova da PM SP quase não tem Direito": grade do edital DP-4/321/26 (Vunesp) + telas reais do simulado + CTA PMSP.
// Fontes: edital DP-4/321/26 (inscrições até 22/12/2026); grade cadastrada na plataforma. Telas: conta de demonstração.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import narrJson from "../data/narracao-pmsp.json";
import { C, FONT, MONO } from "../theme";
import { Mono, Title, useSpring } from "../components/ui";
import { Selo } from "../components/assets";
import { Narr, Scene, ShortVideo, total, wordAt } from "../kit";

const NARR = narrJson as Narr;
const GOLD = "#D4A63A";
const fr = (id: string, extra = 12) => Math.ceil(NARR.cenas[id].duracao * 30) + 3 + extra;
export const SCENES_PMSP: Scene[] = [
  { id: "gancho", frames: fr("p1", 14), voz: "p1" },
  { id: "pesos", frames: fr("p2", 16), voz: "p2" },
  { id: "direito", frames: fr("p3", 14), voz: "p3" },
  { id: "prazo", frames: fr("p4", 16), voz: "p4" },
  { id: "simulado", frames: fr("p5", 30), voz: "p5" },
  { id: "cta", frames: fr("p6", 70), voz: "p6" },
];
export const TOTAL_PMSP = total(SCENES_PMSP);
const KEYS = ["direito", "tudo.", "trinta", "cinco", "dezembro.", "vunesp,", "graça."];

const Gancho: React.FC = () => {
  const f = useCurrentFrame();
  const cut = interpolate(f, [wordAt(NARR, "p1", "para", 40) + 4, wordAt(NARR, "p1", "para", 40) + 12], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Mono size={30} color={C.red} style={{ position: "absolute", left: 100, top: 250 }}>// PM SP · ALUNO-SOLDADO · VUNESP</Mono>
      <Title size={104} parts={[{ t: "A PROVA DA", br: true }, { t: "PM SP QUASE", br: true }, { t: "NÃO TEM" }]} style={{ position: "absolute", left: 100, right: 120, top: 350 }} />
      <div style={{ position: "absolute", left: 100, top: 690, fontFamily: FONT, fontWeight: 900, fontStyle: "italic", fontSize: 170, letterSpacing: -7, color: C.red, opacity: useSpring(8), textShadow: "0 0 60px rgba(227,25,43,.45)" }}>
        DIREITO
        <div style={{ position: "absolute", left: -10, top: "52%", height: 16, width: `${cut}%`, background: C.white, borderRadius: 4 }} />
      </div>
    </AbsoluteFill>
  );
};

const Pesos: React.FC = () => {
  const f = useCurrentFrame();
  const n = Math.round(interpolate(f, [10, 34], [0, 35], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const fill = interpolate(f, [10, 34], [0, 35 / 60], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const R = 230, L = 2 * Math.PI * R;
  return (
    <AbsoluteFill>
      <Title size={84} parts={[{ t: "PORTUGUÊS +", br: true }, { t: "MATEMÁTICA", hit: true }]} style={{ position: "absolute", left: 0, width: 1080, top: 230, textAlign: "center" }} />
      <svg width={560} height={560} style={{ position: "absolute", left: 260, top: 450 }}>
        <circle cx={280} cy={280} r={R} fill="none" stroke="#24242b" strokeWidth={56} />
        <circle cx={280} cy={280} r={R} fill="none" stroke={C.red} strokeWidth={56} strokeDasharray={`${L * fill} ${L}`} transform="rotate(-90 280 280)" />
      </svg>
      <div style={{ position: "absolute", left: 0, width: 1080, top: 610, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 150, color: C.white, letterSpacing: -4 }}>{n}</div>
      <div style={{ position: "absolute", left: 0, width: 1080, top: 790, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 36, color: C.gray }}>DE 60 QUESTÕES</div>
    </AbsoluteFill>
  );
};

const GRADE: [string, number, boolean][] = [["Português e Interpretação", 20, false], ["Matemática", 15, false], ["Conhecimentos Gerais", 15, false], ["Informática", 5, false], ["Administração Pública", 5, true]];
const Direito: React.FC = () => {
  const f = useCurrentFrame();
  const hl = interpolate(f, [wordAt(NARR, "p3", "cinco", 30), wordAt(NARR, "p3", "cinco", 30) + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Mono size={30} color={C.red} style={{ position: "absolute", left: 100, top: 250 }}>// A GRADE DA PROVA</Mono>
      <div style={{ position: "absolute", left: 100, right: 150, top: 330 }}>
        {GRADE.map(([nome, q, dir], i) => {
          const a = interpolate(f, [2 + i * 4, 10 + i * 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const on = dir ? hl : 0;
          return (
            <div key={nome} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "22px 28px", marginBottom: 14, borderRadius: 10, background: C.box, border: `3px solid ${on ? C.red : C.border}`, opacity: a * (dir ? 1 : 1 - hl * 0.55), transform: `scale(${1 + on * 0.04})`, boxShadow: on ? "0 0 40px rgba(227,25,43,.4)" : "none" }}>
              <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.white }}>{nome}{dir ? <span style={{ display: "block", fontFamily: MONO, fontSize: 24, color: C.red, opacity: hl }}>Constituição e administração pública</span> : null}</span>
              <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 52, color: dir ? C.red : C.white }}>{q}</span>
            </div>
          );
        })}
      </div>
      <Mono size={22} color={C.gray} style={{ position: "absolute", left: 100, right: 150, top: 1160 }}>+ redação · edital DP-4/321/26</Mono>
    </AbsoluteFill>
  );
};

const Prazo: React.FC = () => {
  const s = useSpring(3);
  return (
    <AbsoluteFill>
      <Mono size={30} color={C.red} style={{ position: "absolute", left: 100, top: 250 }}>// INSCRIÇÕES</Mono>
      <div style={{ position: "absolute", left: 0, right: 0, top: 350, display: "flex", justifyContent: "center", opacity: s, transform: `scale(${0.85 + s * 0.15})` }}>
        <div style={{ width: 560, borderRadius: 18, overflow: "hidden", border: `4px solid ${C.red}`, background: C.box, boxShadow: "0 0 60px rgba(227,25,43,.35)" }}>
          <div style={{ background: C.red, padding: "16px 0", textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 38, color: C.white, letterSpacing: 3 }}>DEZEMBRO</div>
          <div style={{ padding: "24px 0 8px", textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 210, color: C.white, lineHeight: 1, letterSpacing: -8 }}>22</div>
          <div style={{ paddingBottom: 26, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 32, color: C.red }}>ÚLTIMO DIA</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 870, display: "flex", justifyContent: "center", gap: 18, opacity: useSpring(12) }}>
        {["2.000 VAGAS", "NÍVEL MÉDIO"].map((t) => <div key={t} style={{ fontFamily: MONO, fontWeight: 700, fontSize: 36, color: C.white, border: `3px solid ${C.red}`, borderRadius: 8, padding: "12px 22px" }}>{t}</div>)}
      </div>
      <Mono size={24} color={C.gray} style={{ position: "absolute", left: 0, width: 1080, top: 990, textAlign: "center", opacity: useSpring(18) }}>prova prevista para fevereiro de 2027</Mono>
    </AbsoluteFill>
  );
};

/* tela real da plataforma, grande e legível */
type Shot = { src: string; h: number; from: number; to: number; at: number; dur: number };
const Tela: React.FC<{ shots: Shot[]; frames: number }> = ({ shots, frames }) => {
  const f = useCurrentFrame();
  const w = 880, h = 860, k = w / 1290;
  const enter = useSpring(2);
  return (
    <div style={{ position: "absolute", left: 92, top: 370, width: w + 16, height: h + 16, padding: 8, borderRadius: 26, background: "#0a0a0c", boxShadow: `0 30px 90px rgba(0,0,0,.65), 0 0 0 3px ${GOLD}, 0 0 70px rgba(212,166,58,.2)`, opacity: enter * interpolate(f, [frames - 8, frames], [1, 0], { extrapolateLeft: "clamp" }), transform: `translateY(${(1 - enter) * 50}px)` }}>
      <div style={{ position: "relative", width: w, height: h, borderRadius: 18, overflow: "hidden", background: "#0b0b0d" }}>
        {shots.map((s, i) => {
          const o = interpolate(f, [s.at, s.at + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * (i < shots.length - 1 ? interpolate(f, [s.at + s.dur, s.at + s.dur + 8], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1);
          const y = interpolate(f, [s.at + 8, s.at + s.dur], [s.from, Math.min(s.to, s.h - h / k)], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.45, 0, 0.2, 1) });
          return <Img key={s.src} src={staticFile(`site/${s.src}.jpg`)} style={{ position: "absolute", left: 0, top: -y * k, width: w, opacity: o }} />;
        })}
      </div>
    </div>
  );
};
const Simulado: React.FC<{ frames: number }> = ({ frames }) => {
  const f = useCurrentFrame();
  const t1 = wordAt(NARR, "p5", "correção", 70) - 6;
  const t2 = wordAt(NARR, "p5", "nota", 110) - 6;
  const lbl = f < t1 ? "SIMULADO NO PADRÃO VUNESP" : f < t2 ? "CORREÇÃO NA HORA" : "SUA NOTA POR MATÉRIA";
  return (
    <AbsoluteFill>
      <Mono size={26} color={GOLD} style={{ position: "absolute", left: 100, top: 240 }}>// TELAS REAIS DA PLATAFORMA</Mono>
      <div style={{ position: "absolute", left: 100, right: 120, top: 286, fontFamily: FONT, fontWeight: 900, fontSize: 46, whiteSpace: "nowrap", color: C.white, letterSpacing: -1.5, textTransform: "uppercase" }}>{lbl}</div>
      <Tela frames={frames} shots={[
        { src: "prova", h: 2796, from: 0, to: 500, at: 0, dur: t1 },
        { src: "resultado", h: 3456, from: 230, to: 560, at: t1, dur: t2 - t1 },
        { src: "resultado", h: 3456, from: 1150, to: 1350, at: t2, dur: frames - t2 },
      ]} />
    </AbsoluteFill>
  );
};

const Cta: React.FC<{ frames: number }> = ({ frames }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const btnAt = Math.min(frames - 50, wordAt(NARR, "p6", "comenta", 2));
  const btn = spring({ frame: f - btnAt, fps, config: { damping: 200, stiffness: 300 } });
  const pulse = f > btnAt + 8 ? 1 + Math.sin(((f - btnAt) / fps) * Math.PI * 3.2) * 0.035 : 1;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, width: 1080, top: 210, display: "flex", justifyContent: "center", opacity: useSpring(0) }}><Selo size={180} /></div>
      <Title size={92} delay={3} parts={[{ t: "1º SIMULADO", br: true }, { t: "GRÁTIS", hit: true }]} style={{ position: "absolute", left: 0, width: 1080, top: 430, textAlign: "center" }} />
      <div style={{ position: "absolute", left: 80, top: 690, width: 860, height: 130, background: C.red, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 70, letterSpacing: -1.5, color: C.white, opacity: btn, transform: `translateY(${(1 - btn) * 30}px) scale(${pulse})`, boxShadow: `0 0 ${30 + (pulse - 1) * 800}px rgba(227,25,43,.55)` }}>
        COMENTE “PMSP”
      </div>
      <div style={{ position: "absolute", left: 80, top: 850, width: 860, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 30, color: C.white, lineHeight: 1.4, opacity: btn }}>
        padrão Vunesp · sem cartão de crédito
      </div>
      <div style={{ position: "absolute", left: 80, top: 1440, width: 860, textAlign: "center", fontFamily: MONO, fontSize: 19, color: C.gray, lineHeight: 1.45 }}>
        Confira o edital DP-4/321/26 no site da Vunesp. Telas reais, conta de demonstração.<br />Plataforma independente, sem vínculo com a PM SP ou a Vunesp. Não garantimos aprovação.
      </div>
    </AbsoluteFill>
  );
};

export const PmspVideo: React.FC = () => (
  <ShortVideo
    scenes={SCENES_PMSP}
    narr={NARR}
    keys={KEYS}
    musica="trilha-pmsp.wav"
    render={(id, frames) => {
      switch (id) {
        case "gancho": return <Gancho />;
        case "pesos": return <Pesos />;
        case "direito": return <Direito />;
        case "prazo": return <Prazo />;
        case "simulado": return <Simulado frames={frames} />;
        default: return <Cta frames={frames} />;
      }
    }}
  />
);
