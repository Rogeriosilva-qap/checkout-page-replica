// Vídeo "Qual seria a sua patente?" — gamificação da plataforma Simulados Operação Aprovação.
// Regras de XP e patentes copiadas de src/lib/patentes.ts da plataforma (versão de pré-lançamento).
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import narrJson from "../data/narracao-patentes.json";
import { C, FONT, MONO, TACTICAL } from "../theme";
import { Check, Mono, Title, TermBox, useSpring } from "../components/ui";
import { Selo } from "../components/assets";
import { Narr, Scene, ShortVideo, total, wordAt } from "../kit";

const NARR = narrJson as Narr;

/** TEMPOS (frames a 30 fps) — ajuste aqui */
export const SCENES_PATENTES: Scene[] = [
  { id: "gancho", frames: 90, voz: "p1" },
  { id: "simulado", frames: 138, voz: "p2" },
  { id: "dominada", frames: 130, voz: "p3" },
  { id: "ofensiva", frames: 72, voz: "p4" },
  { id: "escada", frames: 218, voz: "p5" },
  { id: "cta", frames: 143, voz: "p6" },
];
export const TOTAL_PATENTES = total(SCENES_PATENTES);

export const PATENTES = [
  { nome: "Recruta", xp: 0 },
  { nome: "Soldado", xp: 300 },
  { nome: "Cabo", xp: 800 },
  { nome: "Sargento", xp: 1600 },
  { nome: "Subtenente", xp: 2800 },
  { nome: "Tenente", xp: 4500 },
  { nome: "Capitão", xp: 7000 },
  { nome: "Caveira", xp: 10000 },
];
const KEYS = ["patente", "100", "xp", "25", "15", "recruta", "soldado", "caveira", "simulado"];

const Label: React.FC<{ t: string }> = ({ t }) => (
  <Mono size={30} color={C.red} style={{ position: "absolute", left: 80, top: 200, opacity: useSpring(1) }}>{t}</Mono>
);

/** insígnia genérica de nível (sem símbolos de corporações) */
const Badge: React.FC<{ n: number; size?: number; on?: boolean }> = ({ n, size = 64, on = true }) => {
  const top = n === 8;
  return (
    <div style={{ width: size, height: size, flex: "none", borderRadius: 10, border: `4px solid ${on ? C.red : C.border}`, background: top && on ? C.red : C.box, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontWeight: 700, fontSize: size * 0.36, color: on ? C.white : C.gray }}>
      {top ? "★" : `N${n}`}
    </div>
  );
};

const XpBar: React.FC<{ value: number; max: number; label: string; top: number }> = ({ value, max, label, top }) => (
  <div style={{ position: "absolute", left: 80, top, width: 860 }}>
    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontWeight: 700, fontSize: 26, color: C.gray, marginBottom: 12 }}>
      <span>{label}</span>
      <span style={{ color: C.white }}>{Math.round(value)} / {max} XP</span>
    </div>
    <div style={{ height: 34, background: C.box, border: `2px solid ${C.border}`, borderRadius: 6, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${Math.min(100, (value / max) * 100)}%`, background: `linear-gradient(90deg, ${C.redDark}, ${C.red})` }} />
    </div>
  </div>
);

const Plus: React.FC<{ txt: string; at: number; top: number }> = ({ txt, at, top }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - at, fps, config: { damping: 12, stiffness: 300, mass: 0.6 } });
  return (
    <div style={{ position: "absolute", left: 0, width: 1080, top, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontStyle: "italic", fontSize: 136, letterSpacing: -5, color: C.red, opacity: f >= at ? 1 : 0, transform: `scale(${interpolate(s, [0, 1], [1.8, 1])})`, textShadow: "0 0 50px rgba(227,25,43,.45)" }}>
      {txt}
    </div>
  );
};

// ---------------- cenas ----------------
const Gancho: React.FC = () => {
  const f = useCurrentFrame();
  const i = Math.min(PATENTES.length - 1, Math.floor(f / 5) % PATENTES.length);
  const final = f > 60;
  const p = final ? PATENTES[7] : PATENTES[i];
  return (
    <AbsoluteFill>
      <Title size={118} parts={[{ t: "QUAL SERIA A", br: true }, { t: "SUA", br: false }, { t: "PATENTE?", hit: true }]} style={{ position: "absolute", left: 80, top: 230, width: 900 }} />
      <div style={{ position: "absolute", left: 80, top: 700, width: 860, height: 300, display: "flex", alignItems: "center", gap: 40, padding: "0 50px", background: C.box, border: `3px solid ${final ? C.red : C.border}`, borderRadius: 16, boxShadow: final ? "0 0 60px rgba(227,25,43,.35)" : "none" }}>
        <Badge n={final ? 8 : i + 1} size={150} />
        <div>
          <Mono size={28} color={C.gray}>PATENTE ATUAL</Mono>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 96, letterSpacing: -3, textTransform: "uppercase", color: final ? C.red : C.white, fontStyle: final ? "italic" : "normal" }}>{final ? "???" : p.nome}</div>
        </div>
      </div>
      <Mono size={24} style={{ position: "absolute", left: 80, top: 1050 }}>// PLATAFORMA SIMULADOS OPERAÇÃO APROVAÇÃO</Mono>
    </AbsoluteFill>
  );
};

const Simulado: React.FC = () => {
  const f = useCurrentFrame();
  const at = wordAt(NARR, "p2", "100", 70);
  const card = useSpring(6);
  const xp = interpolate(f, [at, at + 20], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Label t="// REGRA 1 · SIMULADO" />
      <Title size={100} parts={[{ t: "CADA", br: false }, { t: "SIMULADO", hit: true, br: true }, { t: "FEITO VALE" }]} style={{ position: "absolute", left: 80, top: 262 }} delay={1} />
      <TermBox style={{ position: "absolute", left: 80, top: 520, width: 860, padding: "30px 34px", opacity: card, transform: `translateY(${(1 - card) * 40}px)` }}>
        <Mono size={24} color={C.gray}>SIMULADO CONCLUÍDO</Mono>
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 10 }}>
          <div style={{ width: 54, height: 54, background: C.red, display: "flex", alignItems: "center", justifyContent: "center" }}><Check size={36} /></div>
          <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 46, letterSpacing: -1, color: C.white }}>Prova no padrão da banca</span>
        </div>
      </TermBox>
      <Plus txt="+100 XP" at={at} top={770} />
      <XpBar value={xp} max={300} label="RECRUTA → SOLDADO" top={1080} />
    </AbsoluteFill>
  );
};

const Dominada: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const flip = wordAt(NARR, "p3", "dominou", 50);
  const plus = wordAt(NARR, "p3", "25", 90);
  const s = spring({ frame: f - flip, fps, config: { damping: 14, stiffness: 260 } });
  const errada = f < flip;
  return (
    <AbsoluteFill>
      <Label t="// REGRA 2 · MODO REDENÇÃO" />
      <Title size={100} parts={[{ t: "ERROU?", br: true }, { t: "DOMINE.", hit: true }]} style={{ position: "absolute", left: 80, top: 262 }} delay={1} />
      <div style={{ position: "absolute", left: 80, top: 540, width: 860, padding: "34px 36px", background: C.box, border: `3px solid ${errada ? C.border : C.red}`, borderRadius: 12, transform: `rotateX(${errada ? 0 : (1 - s) * 90}deg)` }}>
        <Mono size={24} color={C.gray}>CADERNO DE ERROS · QUESTÃO DE TREINO</Mono>
        <div style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 18 }}>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, padding: "10px 18px", borderRadius: 6, background: errada ? "#2A2A32" : C.red, color: errada ? C.gray : C.white, letterSpacing: 2 }}>
            {errada ? "✕ ERRADA" : "✓ DOMINADA"}
          </div>
          <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: errada ? C.gray : C.white }}>{errada ? "volta até você acertar" : "selo conquistado"}</span>
        </div>
      </div>
      <Plus txt="+25 XP" at={plus} top={830} />
    </AbsoluteFill>
  );
};

const Flame: React.FC<{ on: boolean }> = ({ on }) => (
  <svg width="70" height="84" viewBox="0 0 40 48">
    <path d="M20 2c3 9 14 13 14 27a14 14 0 0 1-28 0c0-7 4-11 7-14 0 5 2 8 5 9-2-8 0-15 2-22z" fill={on ? C.red : "#2A2A32"} />
    <path d="M20 26c2 4 6 6 6 11a6 6 0 0 1-12 0c0-3 2-5 3-6 0 2 1 3 2 3-1-3 0-5 1-8z" fill={on ? "#FFB3B8" : "#16161B"} />
  </svg>
);

const Ofensiva: React.FC = () => {
  const f = useCurrentFrame();
  const plus = wordAt(NARR, "p4", "15", 40);
  return (
    <AbsoluteFill>
      <Label t="// REGRA 3 · OFENSIVA" />
      <Title size={100} parts={[{ t: "DIAS", br: false }, { t: "SEGUIDOS", hit: true, br: true }, { t: "DE ESTUDO" }]} style={{ position: "absolute", left: 80, top: 262 }} delay={1} />
      <div style={{ position: "absolute", left: 80, top: 560, width: 860, display: "flex", justifyContent: "space-between" }}>
        {["S", "T", "Q", "Q", "S", "S", "D"].map((d, i) => {
          const on = f >= 4 + i * 4;
          return (
            <div key={i} style={{ width: 112, height: 170, background: C.box, border: `3px solid ${on ? C.red : C.border}`, borderRadius: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <Flame on={on} />
              <Mono size={26} color={on ? C.white : C.gray}>{d}</Mono>
            </div>
          );
        })}
      </div>
      <Plus txt="+15 XP" at={plus} top={800} />
      <Mono size={26} style={{ position: "absolute", left: 80, top: 1040, width: 860, textAlign: "center" }}>POR DIA DE OFENSIVA</Mono>
    </AbsoluteFill>
  );
};

const Escada: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ROW = 104;
  const at = PATENTES.map((p, i) => wordAt(NARR, "p5", p.nome, 20 + i * 24));
  let cur = 0;
  at.forEach((a, i) => { if (f >= a) cur = i; });
  const tres = wordAt(NARR, "p5", "tres", 40);
  const call = spring({ frame: f - tres, fps, config: TACTICAL });
  const callOut = interpolate(f, [at[2] - 4, at[2] + 4], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Label t="// AS 8 PATENTES" />
      {PATENTES.map((p, i) => {
        const row = 7 - i; // Recruta embaixo, Caveira no topo
        const reached = i <= cur;
        const isCur = i === cur;
        const top = i === 7;
        return (
          <div key={p.nome} style={{ position: "absolute", left: 80, top: 260 + row * ROW, width: 860, height: ROW - 12, display: "flex", alignItems: "center", gap: 24, padding: "0 24px", background: isCur ? (top ? C.red : "rgba(227,25,43,.16)") : C.box, border: `3px solid ${reached ? C.red : C.border}`, borderRadius: 10, transform: `scale(${isCur ? 1.03 : 1})`, boxShadow: isCur ? "0 0 40px rgba(227,25,43,.35)" : "none", zIndex: isCur ? 2 : 1 }}>
            <Badge n={i + 1} size={62} on={reached} />
            <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 44, letterSpacing: -1, textTransform: "uppercase", color: reached ? C.white : C.gray, fontStyle: top ? "italic" : "normal" }}>{p.nome}</span>
            <span style={{ marginLeft: "auto", fontFamily: MONO, fontWeight: 700, fontSize: 26, color: isCur && top ? C.white : reached ? C.white : C.gray }}>{p.xp.toLocaleString("pt-BR")} XP</span>
          </div>
        );
      })}
      {/* 3 simulados = Soldado */}
      <div style={{ position: "absolute", right: 140, top: 260 + 6 * ROW - 70, opacity: call * callOut, transform: `translateY(${(1 - call) * 20}px)`, background: C.white, color: "#111", fontFamily: MONO, fontWeight: 700, fontSize: 24, padding: "8px 14px", borderRadius: 6, zIndex: 3 }}>
        3 simulados × 100 XP = SOLDADO
      </div>
    </AbsoluteFill>
  );
};

const Cta: React.FC<{ frames: number }> = ({ frames }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const selo = useSpring(0);
  const btnAt = Math.min(frames - 50, wordAt(NARR, "p6", "comenta", 6));
  const btn = spring({ frame: f - btnAt, fps, config: { damping: 200, stiffness: 300 } });
  const pulse = f > btnAt + 8 ? 1 + Math.sin(((f - btnAt) / fps) * Math.PI * 3.2) * 0.035 : 1;
  const sub = useSpring(wordAt(NARR, "p6", "grupo", 40));
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, width: 1080, top: 200, display: "flex", justifyContent: "center", opacity: selo, transform: `scale(${0.8 + selo * 0.2})` }}><Selo size={210} /></div>
      <Title size={104} parts={[{ t: "SIMULADOS", br: true }, { t: "OPERAÇÃO", hit: true, br: true }, { t: "APROVAÇÃO", hit: true }]} style={{ position: "absolute", left: 0, width: 1080, top: 450, textAlign: "center" }} delay={2} />
      <Mono size={30} color={C.white} style={{ position: "absolute", left: 0, width: 1080, top: 790, textAlign: "center", letterSpacing: 6 }}>● EM BREVE</Mono>
      <div style={{ position: "absolute", left: 80, top: 880, width: 860, height: 120, background: C.red, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 58, letterSpacing: -1.5, color: C.white, opacity: btn, transform: `translateY(${(1 - btn) * 30}px) scale(${pulse})`, boxShadow: `0 0 ${30 + (pulse - 1) * 800}px rgba(227,25,43,.55)` }}>
        COMENTE “SIMULADO”
      </div>
      <Mono size={28} color={C.white} style={{ position: "absolute", left: 80, top: 1030, width: 860, textAlign: "center", opacity: sub, lineHeight: 1.4 }}>
        e entre no grupo de espera<br /><span style={{ color: C.red }}>desconto de lançamento</span>
      </Mono>
      <div style={{ position: "absolute", left: 80, top: 1440, width: 860, textAlign: "center", fontFamily: MONO, fontSize: 18, color: C.gray, lineHeight: 1.45 }}>
        Pré-lançamento: valores de XP da versão atual, podem mudar até o lançamento.<br />Plataforma educacional independente. Não garantimos aprovação.
      </div>
    </AbsoluteFill>
  );
};

export const PatentesVideo: React.FC = () => (
  <ShortVideo
    scenes={SCENES_PATENTES}
    narr={NARR}
    keys={KEYS}
    musica="trilha-patentes.wav"
    render={(id, frames) => {
      switch (id) {
        case "gancho": return <Gancho />;
        case "simulado": return <Simulado />;
        case "dominada": return <Dominada />;
        case "ofensiva": return <Ofensiva />;
        case "escada": return <Escada />;
        default: return <Cta frames={frames} />;
      }
    }}
  />
);
