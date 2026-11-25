// Reels "Goiás sinalizou concurso na segurança para 2027": fato, o que falta, último concurso da PMGO e CTA do grupo.
// Fontes: declaração do governador noticiada em 24/11/2026; edital PMGO 2022 (Instituto AOCP).
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import narrJson from "../data/narracao-goias.json";
import { C, FONT, MONO } from "../theme";
import { Mono, TermBox, Title, useSpring } from "../components/ui";
import { Selo } from "../components/assets";
import { Narr, Scene, ShortVideo, total, wordAt } from "../kit";

const NARR = narrJson as Narr;
const fr = (id: string, extra = 12) => Math.ceil(NARR.cenas[id].duracao * 30) + 3 + extra;
export const SCENES_GOIAS: Scene[] = [
  { id: "gancho", frames: fr("g1"), voz: "g1" },
  { id: "calma", frames: fr("g2", 14), voz: "g2" },
  { id: "quando", frames: fr("g3"), voz: "g3" },
  { id: "ultimo", frames: fr("g4", 14), voz: "g4" },
  { id: "pontos", frames: fr("g5", 20), voz: "g5" },
  { id: "agora", frames: fr("g6", 14), voz: "g6" },
  { id: "cta", frames: fr("g7", 70), voz: "g7" },
];
export const TOTAL_GOIAS = total(SCENES_GOIAS);
const KEYS = ["2027.", "edital,", "banca.", "aocp.", "direito.", "frente.", "goiás"];

const Gancho: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - 2, fps, config: { damping: 11, stiffness: 260, mass: 0.6 } });
  return (
    <AbsoluteFill>
      <Mono size={30} color={C.red} style={{ position: "absolute", left: 100, top: 250 }}>// SEGURANÇA PÚBLICA · GO</Mono>
      <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontStyle: "italic", fontSize: 220, letterSpacing: -9, color: C.red, transform: `scale(${interpolate(s, [0, 1], [1.8, 1])})`, opacity: s, textShadow: "0 0 70px rgba(227,25,43,.45)" }}>
        GOIÁS
      </div>
      <Title size={96} delay={10} parts={[{ t: "CONCURSO NA", br: true }, { t: "SEGURANÇA" }, { t: "2027?", hit: true }]} style={{ position: "absolute", left: 0, width: 1080, top: 620, textAlign: "center" }} />
      <Mono size={26} color={C.gray} style={{ position: "absolute", left: 0, width: 1080, top: 900, textAlign: "center", opacity: useSpring(24) }}>
        governador sinalizou ampliação do efetivo
      </Mono>
    </AbsoluteFill>
  );
};

const Calma: React.FC = () => {
  const f = useCurrentFrame();
  const itens = ["EDITAL", "Nº DE VAGAS", "BANCA"];
  const at = [wordAt(NARR, "g2", "edital", 20), wordAt(NARR, "g2", "número", 45), wordAt(NARR, "g2", "banca", 70)];
  return (
    <AbsoluteFill>
      <Title size={110} parts={[{ t: "AINDA", br: true }, { t: "NÃO TEM:", hit: true }]} style={{ position: "absolute", left: 100, top: 260 }} />
      <div style={{ position: "absolute", left: 100, right: 160, top: 560 }}>
        {itens.map((t, i) => {
          const a = interpolate(f, [at[i], at[i] + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <TermBox key={t} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "26px 34px", marginBottom: 22, opacity: a, transform: `translateX(${(1 - a) * -40}px)` }}>
              <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 62, color: C.white, letterSpacing: -1.5 }}>{t}</span>
              <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 70, color: C.red }}>✕</span>
            </TermBox>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Quando: React.FC = () => {
  const s = useSpring(4);
  return (
    <AbsoluteFill>
      <Mono size={30} color={C.red} style={{ position: "absolute", left: 100, top: 250 }}>// O QUE SE SABE</Mono>
      <div style={{ position: "absolute", left: 0, right: 0, top: 380, display: "flex", justifyContent: "center", opacity: s, transform: `scale(${0.85 + s * 0.15})` }}>
        <div style={{ width: 520, borderRadius: 18, overflow: "hidden", border: `4px solid ${C.red}`, background: C.box, boxShadow: "0 0 60px rgba(227,25,43,.35)" }}>
          <div style={{ background: C.red, padding: "18px 0", textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 40, color: C.white, letterSpacing: 3 }}>2027</div>
          <div style={{ padding: "40px 0", textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 92, color: C.white, lineHeight: 1, letterSpacing: -3 }}>INÍCIO<br /><span style={{ color: C.red, fontStyle: "italic" }}>DO ANO</span></div>
        </div>
      </div>
      <Title size={64} delay={14} parts={[{ t: "ANÚNCIOS", hit: true }, { t: "PREVISTOS" }]} style={{ position: "absolute", left: 0, width: 1080, top: 920, textAlign: "center" }} />
    </AbsoluteFill>
  );
};

const Ultimo: React.FC = () => {
  const f = useCurrentFrame();
  const n = Math.round(interpolate(f, [8, 40], [0, 1500], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const aocp = useSpring(wordAt(NARR, "g4", "aocp", 90) - 4);
  return (
    <AbsoluteFill>
      <Mono size={30} color={C.red} style={{ position: "absolute", left: 100, top: 250 }}>// ÚLTIMO CONCURSO · PMGO 2022</Mono>
      <div style={{ position: "absolute", left: 0, right: 0, top: 360, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 210, color: C.white, letterSpacing: -6 }}>{n.toLocaleString("pt-BR")}</div>
      <Title size={76} delay={6} parts={[{ t: "VAGAS PARA" }, { t: "SOLDADO", hit: true }]} style={{ position: "absolute", left: 0, width: 1080, top: 640, textAlign: "center" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 820, display: "flex", justifyContent: "center", gap: 20, opacity: aocp, transform: `translateY(${(1 - aocp) * 20}px)` }}>
        {["BANCA AOCP", "50 QUESTÕES"].map((t) => (
          <div key={t} style={{ fontFamily: MONO, fontWeight: 700, fontSize: 36, color: C.white, border: `3px solid ${C.red}`, borderRadius: 8, padding: "12px 22px" }}>{t}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const Pontos: React.FC = () => {
  const f = useCurrentFrame();
  const w = interpolate(f, [10, 40], [0, 82], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bar = (label: string, pts: string, pct: number, cor: string, top: number, d: number) => {
    const a = interpolate(f, [d, d + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return (
      <div style={{ position: "absolute", left: 100, right: 160, top, opacity: a }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT, fontWeight: 900, fontSize: 46, color: C.white }}><span>{label}</span><span style={{ fontFamily: MONO, color: cor }}>{pts}</span></div>
        <div style={{ height: 46, marginTop: 12, background: "#1f1f26", borderRadius: 8, overflow: "hidden" }}><div style={{ width: `${pct}%`, height: "100%", background: cor }} /></div>
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <Title size={100} parts={[{ t: "70 DE 85", hit: true, br: true }, { t: "PONTOS" }]} style={{ position: "absolute", left: 100, top: 240 }} />
      {bar("DIREITO", "70 pts", w, C.red, 560, 6)}
      {bar("PORTUGUÊS", "10 pts", Math.min(w, 12), C.gray, 740, 22)}
      {bar("REALIDADE DE GO", "5 pts", Math.min(w, 6), C.gray, 920, 30)}
      <Mono size={22} color={C.gray} style={{ position: "absolute", left: 100, right: 160, top: 1100 }}>Prova de Soldado PMGO 2022: Direito com peso 2</Mono>
    </AbsoluteFill>
  );
};

const Agora: React.FC = () => {
  const passos = ["CONSTITUCIONAL", "ADMINISTRATIVO", "PENAL E PROC. PENAL", "PENAL MILITAR"];
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Title size={100} parts={[{ t: "QUEM COMEÇA", br: true }, { t: "AGORA", hit: true }, { t: "SAI NA FRENTE" }]} style={{ position: "absolute", left: 100, right: 140, top: 230 }} />
      <div style={{ position: "absolute", left: 100, right: 160, top: 640 }}>
        {passos.map((t, i) => {
          const a = interpolate(f, [16 + i * 6, 24 + i * 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 22, marginBottom: 18, opacity: a, transform: `translateX(${(1 - a) * -30}px)` }}>
              <div style={{ width: 58, height: 58, borderRadius: 8, background: C.red, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontWeight: 700, fontSize: 32, color: C.white }}>{i + 1}</div>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 48, color: C.white, letterSpacing: -1 }}>{t}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Cta: React.FC<{ frames: number }> = ({ frames }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const btnAt = Math.min(frames - 50, wordAt(NARR, "g7", "comenta", 2));
  const btn = spring({ frame: f - btnAt, fps, config: { damping: 200, stiffness: 300 } });
  const pulse = f > btnAt + 8 ? 1 + Math.sin(((f - btnAt) / fps) * Math.PI * 3.2) * 0.035 : 1;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, width: 1080, top: 210, display: "flex", justifyContent: "center", opacity: useSpring(0) }}><Selo size={180} /></div>
      <Title size={100} delay={3} parts={[{ t: "MISSÃO", br: true }, { t: "GOIÁS 2027", hit: true }]} style={{ position: "absolute", left: 0, width: 1080, top: 430, textAlign: "center" }} />
      <div style={{ position: "absolute", left: 80, top: 700, width: 860, height: 130, background: C.red, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 66, letterSpacing: -1.5, color: C.white, opacity: btn, transform: `translateY(${(1 - btn) * 30}px) scale(${pulse})`, boxShadow: `0 0 ${30 + (pulse - 1) * 800}px rgba(227,25,43,.55)` }}>
        COMENTE “GOIÁS”
      </div>
      <div style={{ position: "absolute", left: 80, top: 860, width: 860, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 30, color: C.white, lineHeight: 1.4, opacity: btn }}>
        grupo de estudos gratuito<br /><span style={{ color: C.red }}>PMGO · PCGO</span>
      </div>
      <div style={{ position: "absolute", left: 80, top: 1440, width: 860, textAlign: "center", fontFamily: MONO, fontSize: 19, color: C.gray, lineHeight: 1.45 }}>
        Sem edital publicado até agora. Confira as fontes oficiais do Governo de Goiás.<br />Conteúdo educativo, sem vínculo com o governo ou bancas. Não garantimos aprovação.
      </div>
    </AbsoluteFill>
  );
};

export const GoiasVideo: React.FC = () => (
  <ShortVideo
    scenes={SCENES_GOIAS}
    narr={NARR}
    keys={KEYS}
    musica="trilha-goias.wav"
    render={(id, frames) => {
      switch (id) {
        case "gancho": return <Gancho />;
        case "calma": return <Calma />;
        case "quando": return <Quando />;
        case "ultimo": return <Ultimo />;
        case "pontos": return <Pontos />;
        case "agora": return <Agora />;
        default: return <Cta frames={frames} />;
      }
    }}
  />
);
