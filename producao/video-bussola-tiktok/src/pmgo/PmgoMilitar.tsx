// TikTok PMGO: "18 pontos numa matéria que muita gente deixa pra depois" (Penal Militar + Processo Penal Militar).
// Fonte: edital PMGO 2022 Soldado (Instituto AOCP): 4 + 5 questões de peso 2 = 18 de 85 pontos; Português 10 × peso 1.
import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import narrJson from "../data/narracao-pmgo-militar.json";
import { C, FONT, MONO } from "../theme";
import { Mono, TermBox, Title, useSpring } from "../components/ui";
import { Selo } from "../components/assets";
import { Narr, Scene, ShortVideo, total, wordAt } from "../kit";

const NARR = narrJson as Narr;
const fr = (id: string, extra = 12) => Math.ceil(NARR.cenas[id].duracao * 30) + 3 + extra;
export const SCENES_PMGO_MILITAR: Scene[] = [
  { id: "gancho", frames: fr("m1"), voz: "m1" },
  { id: "questoes", frames: fr("m2", 14), voz: "m2" },
  { id: "comparacao", frames: fr("m3", 16), voz: "m3" },
  { id: "leiseca", frames: fr("m4", 14), voz: "m4" },
  { id: "agora", frames: fr("m5", 10), voz: "m5" },
  { id: "cta", frames: fr("m6", 75), voz: "m6" },
];
export const TOTAL_PMGO_MILITAR = total(SCENES_PMGO_MILITAR);
const KEYS = ["dezoito", "depois", "militar", "dois", "dobro", "seca", "frente", "bio"];

const Gancho: React.FC = () => {
  const f = useCurrentFrame();
  // primeiro quadro já mostra o número (miniatura do TikTok)
  const pulse = 1 + Math.sin(f / 6) * 0.015;
  return (
    <AbsoluteFill>
      <Mono size={30} color={C.red} style={{ position: "absolute", left: 100, top: 250 }}>// PMGO · SOLDADO</Mono>
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontStyle: "italic", fontSize: 360, letterSpacing: -16, color: C.red, lineHeight: 1, transform: `scale(${pulse})`, textShadow: "0 0 80px rgba(227,25,43,.45)" }}>18</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 660, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 110, letterSpacing: -4, color: C.white }}>PONTOS</div>
      <Title size={58} delay={10} parts={[{ t: "numa matéria que muita", br: true }, { t: "gente deixa pra" }, { t: "depois", hit: true }]} style={{ position: "absolute", left: 0, width: 1080, top: 820, textAlign: "center" }} />
    </AbsoluteFill>
  );
};

const Questoes: React.FC = () => {
  const f = useCurrentFrame();
  const at = [wordAt(NARR, "m2", "penal", 30), wordAt(NARR, "m2", "processo", 50)];
  const tot = interpolate(f, [wordAt(NARR, "m2", "peso", 110) - 2, wordAt(NARR, "m2", "peso", 110) + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cards: [string, string, number][] = [["DIREITO PENAL", "MILITAR", 4], ["PROCESSO PENAL", "MILITAR", 5]];
  return (
    <AbsoluteFill>
      <Mono size={30} color={C.red} style={{ position: "absolute", left: 100, top: 250 }}>// ÚLTIMO CONCURSO · 2022</Mono>
      <div style={{ position: "absolute", left: 100, right: 160, top: 340 }}>
        {cards.map(([a, b, q], i) => {
          const s = interpolate(f, [at[i], at[i] + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <TermBox key={a} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "26px 34px", marginBottom: 22, opacity: s, transform: `translateX(${(1 - s) * -40}px)` }}>
              <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 50, color: C.white, lineHeight: 1, letterSpacing: -1 }}>{a}<br /><span style={{ color: C.red, fontStyle: "italic" }}>{b}</span></span>
              <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 80, color: C.white }}>{q}</span>
            </TermBox>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 790, textAlign: "center", opacity: tot, transform: `scale(${0.85 + tot * 0.15})` }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 58, color: C.gray }}>9 questões × peso 2</div>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 130, color: C.red, letterSpacing: -5, fontStyle: "italic" }}>= 18 PTS</div>
      </div>
    </AbsoluteFill>
  );
};

const Comparacao: React.FC = () => {
  const f = useCurrentFrame();
  const g = interpolate(f, [6, 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const dobro = useSpring(wordAt(NARR, "m3", "dobro", 40) - 4);
  const bar = (label: string, pts: number, cor: string, top: number) => (
    <div style={{ position: "absolute", left: 100, right: 160, top }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT, fontWeight: 900, fontSize: 48, color: C.white }}><span>{label}</span><span style={{ fontFamily: MONO, color: cor, whiteSpace: "nowrap" }}>{Math.round(pts * g)} pts</span></div>
      <div style={{ height: 70, marginTop: 12, background: "#1f1f26", borderRadius: 8, overflow: "hidden" }}><div style={{ width: `${(pts / 18) * 100 * g}%`, height: "100%", background: cor }} /></div>
    </div>
  );
  return (
    <AbsoluteFill>
      <Title size={90} parts={[{ t: "QUASE O", br: true }, { t: "DOBRO", hit: true }]} style={{ position: "absolute", left: 100, top: 240, opacity: dobro }} />
      {bar("PENAL MILITAR + PROC.", 18, C.red, 540)}
      {bar("PORTUGUÊS", 10, C.gray, 760)}
      <Mono size={22} color={C.gray} style={{ position: "absolute", left: 100, right: 160, top: 990 }}>Português: a prova inteira, 10 questões × peso 1 · total da prova: 85 pontos</Mono>
    </AbsoluteFill>
  );
};

const LeiSeca: React.FC = () => {
  const f = useCurrentFrame();
  const livros: [string, string, number][] = [["CÓDIGO PENAL MILITAR", "Decreto-Lei 1.001/1969", wordAt(NARR, "m4", "código", 30)], ["CÓDIGO DE PROCESSO PENAL MILITAR", "Decreto-Lei 1.002/1969", wordAt(NARR, "m4", "processo", 70)]];
  return (
    <AbsoluteFill>
      <Title size={100} parts={[{ t: "É LEI", br: true }, { t: "SECA", hit: true }]} style={{ position: "absolute", left: 100, top: 240 }} />
      <div style={{ position: "absolute", left: 100, right: 160, top: 540 }}>
        {livros.map(([t, s, d]) => {
          const a = interpolate(f, [d - 4, d + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={t} style={{ display: "flex", gap: 24, alignItems: "center", marginBottom: 26, opacity: a, transform: `translateY(${(1 - a) * 24}px)` }}>
              <div style={{ width: 90, height: 120, flex: "none", borderRadius: 6, background: C.red, boxShadow: "inset -10px 0 0 rgba(0,0,0,.25)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 40, color: C.white }}>§</div>
              <div>
                <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 44, color: C.white, lineHeight: 1.05, letterSpacing: -1 }}>{t}</div>
                <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 26, color: C.gray, marginTop: 6 }}>{s}</div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Agora: React.FC = () => (
  <AbsoluteFill>
    <div style={{ position: "absolute", left: 100, top: 260, fontFamily: MONO, fontWeight: 700, fontSize: 40, color: C.gray, border: `3px solid ${C.gray}`, padding: "10px 20px", borderRadius: 8, opacity: useSpring(0) }}>SEM EDITAL AINDA</div>
    <Title size={110} delay={8} parts={[{ t: "QUEM COMEÇA", br: true }, { t: "AGORA", hit: true, br: true }, { t: "SAI NA FRENTE" }]} style={{ position: "absolute", left: 100, right: 120, top: 420 }} />
  </AbsoluteFill>
);

const Cta: React.FC<{ frames: number }> = ({ frames }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = Math.min(frames - 50, wordAt(NARR, "m6", "link", 40) - 6);
  const s = spring({ frame: f - at, fps, config: { damping: 200, stiffness: 300 } });
  const bob = f > at ? Math.sin((f - at) / 5) * 14 : 0;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 220, display: "flex", flexDirection: "column", alignItems: "center", opacity: s, transform: `translateY(${bob}px)` }}>
        <svg width={150} height={170} viewBox="0 0 150 170"><path d="M75 6 L140 80 H100 V164 H50 V80 H10 Z" fill={C.red} /></svg>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 100, letterSpacing: -4, color: C.white, marginTop: 10 }}>LINK NA <span style={{ color: C.red, fontStyle: "italic" }}>BIO</span></div>
      </div>
      <div style={{ position: "absolute", left: 0, width: 1080, top: 620, display: "flex", justifyContent: "center", opacity: useSpring(0) }}><Selo size={150} /></div>
      <Title size={76} delay={4} parts={[{ t: "GRUPO DE ESTUDOS", br: true }, { t: "GRATUITO", hit: true }]} style={{ position: "absolute", left: 0, width: 1080, top: 800, textAlign: "center" }} />
      <Mono size={30} color={C.white} style={{ position: "absolute", left: 0, width: 1080, top: 990, textAlign: "center", opacity: useSpring(10) }}>MISSÃO GOIÁS 2027 · PMGO · PCGO</Mono>
      <div style={{ position: "absolute", left: 80, top: 1440, width: 860, textAlign: "center", fontFamily: MONO, fontSize: 19, color: C.gray, lineHeight: 1.45 }}>
        Dados da prova de Soldado PMGO 2022 (Instituto AOCP). O próximo edital pode mudar.<br />Conteúdo educativo, sem vínculo com o Governo de Goiás ou bancas.
      </div>
    </AbsoluteFill>
  );
};

export const PmgoMilitarVideo: React.FC = () => (
  <ShortVideo
    scenes={SCENES_PMGO_MILITAR}
    narr={NARR}
    keys={KEYS}
    musica="trilha-pmgo-militar.wav"
    render={(id, frames) => {
      switch (id) {
        case "gancho": return <Gancho />;
        case "questoes": return <Questoes />;
        case "comparacao": return <Comparacao />;
        case "leiseca": return <LeiSeca />;
        case "agora": return <Agora />;
        default: return <Cta frames={frames} />;
      }
    }}
  />
);
