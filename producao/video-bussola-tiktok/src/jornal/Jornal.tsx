// Anúncio em formato de telejornal: "Jornal do Concurseiro", marca própria da Operação Aprovação (não imita veículo real).
// Fatos: edital PM SP DP-4/321/26 (Vunesp): 2.000 vagas, nível médio, inscrições até 22/12/2026, 60 questões (Port 20 + Mat 15).
import React from "react";
import { AbsoluteFill, Audio, Easing, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import narrJson from "../data/narracao-jornal.json";
import { C, FONT, MONO } from "../theme";
import { Narr, Scene, starts, total, VOICE_DELAY, wordAt } from "../kit";
import { Selo } from "../components/assets";

const NARR = narrJson as Narr;
const RED = C.red;
const GOLD = "#D4A63A";
const NAVY = "#0B1220";
const fr = (id: string, extra = 10) => Math.ceil(NARR.cenas[id].duracao * 30) + VOICE_DELAY + extra;
export const SCENES_JORNAL: Scene[] = [
  { id: "prazo", frames: fr("j1"), voz: "j1" },
  { id: "vagas", frames: fr("j2"), voz: "j2" },
  { id: "dado", frames: fr("j3", 14), voz: "j3" },
  { id: "plataforma", frames: fr("j4", 16), voz: "j4" },
  { id: "cta", frames: fr("j5", 75), voz: "j5" },
];
export const TOTAL_JORNAL = total(SCENES_JORNAL);
const MANCHETES: Record<string, string> = {
  prazo: "INSCRIÇÕES DA PM SP TERMINAM EM 22/12",
  vagas: "2.000 VAGAS PARA ALUNO-SOLDADO · NÍVEL MÉDIO",
  dado: "PORTUGUÊS E MATEMÁTICA: 35 DAS 60 QUESTÕES",
  plataforma: "SIMULADO NO PADRÃO VUNESP, COM CORREÇÃO NA HORA",
  cta: "1º SIMULADO GRÁTIS, SEM CARTÃO DE CRÉDITO",
};
const TICKER = "INSCRIÇÕES ATÉ 22/12 NO SITE DA VUNESP  •  EDITAL DP-4/321/26  •  2.000 VAGAS  •  NÍVEL MÉDIO  •  PROVA PREVISTA PARA FEVEREIRO DE 2027  •  ";

const useIn = (d = 0) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - d, fps, config: { damping: 200, stiffness: 220, mass: 0.6 } });
};

/* ---------- vinheta e moldura do telejornal ---------- */
const Estudio: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 50% at 50% 40%, #16233d, ${NAVY} 70%)` }}>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i} style={{ position: "absolute", left: -200, right: -200, top: 200 + i * 260, height: 2, background: "rgba(255,255,255,.05)", transform: `translateX(${((f * (1 + i * 0.3)) % 400) - 200}px) rotate(-8deg)` }} />
      ))}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 40% at 50% 45%, rgba(227,25,43,.10), transparent 70%)" }} />
    </AbsoluteFill>
  );
};

const Cabecalho: React.FC = () => {
  const f = useCurrentFrame();
  const s = useIn(0);
  const blink = Math.floor(f / 18) % 2 === 0;
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 150, display: "flex", alignItems: "stretch", opacity: s, transform: `translateY(${(1 - s) * -30}px)` }}>
      <div style={{ background: RED, padding: "14px 22px", fontFamily: FONT, fontWeight: 900, fontSize: 40, letterSpacing: -1, color: "#fff", lineHeight: 1 }}>
        JORNAL<br /><span style={{ fontSize: 30, letterSpacing: 0 }}>DO CONCURSEIRO</span>
      </div>
      <div style={{ flex: 1, background: "rgba(255,255,255,.95)", padding: "12px 20px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, color: NAVY, letterSpacing: 1 }}>BOLETIM · CONCURSOS</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 22, color: "#555" }}>uma produção Operação Aprovação</div>
      </div>
      <div style={{ background: NAVY, border: "2px solid rgba(255,255,255,.25)", padding: "0 18px", display: "flex", alignItems: "center", gap: 10, fontFamily: MONO, fontWeight: 700, fontSize: 24, color: "#fff" }}>
        <span style={{ width: 14, height: 14, borderRadius: 7, background: RED, opacity: blink ? 1 : 0.3 }} />SP
      </div>
    </div>
  );
};

const Manchete: React.FC<{ id: string }> = ({ id }) => {
  const f = useCurrentFrame();
  const w = interpolate(f, [2, 12], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const t = interpolate(f, [8, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 1170 }}>
      <div style={{ display: "inline-block", background: RED, color: "#fff", fontFamily: MONO, fontWeight: 700, fontSize: 26, padding: "8px 16px", letterSpacing: 2 }}>PM SP</div>
      <div style={{ overflow: "hidden", width: `${w}%`, background: "#fff", boxShadow: "0 12px 40px rgba(0,0,0,.45)" }}>
        <div style={{ padding: "18px 24px", fontFamily: FONT, fontWeight: 900, fontSize: 46, lineHeight: 1.05, letterSpacing: -1.2, color: NAVY, opacity: t, minWidth: 900 }}>{MANCHETES[id]}</div>
      </div>
    </div>
  );
};

const Ticker: React.FC = () => {
  const f = useCurrentFrame();
  const x = -((f * 5) % 2400);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 1360, height: 58, background: NAVY, borderTop: `4px solid ${RED}`, overflow: "hidden", display: "flex", alignItems: "center" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, zIndex: 2, background: RED, padding: "0 18px", display: "flex", alignItems: "center", fontFamily: MONO, fontWeight: 700, fontSize: 24, color: "#fff" }}>AGORA</div>
      <div style={{ whiteSpace: "nowrap", transform: `translateX(${x + 170}px)`, fontFamily: MONO, fontWeight: 700, fontSize: 26, color: "#fff" }}>{TICKER.repeat(4)}</div>
    </div>
  );
};

/* ---------- cenas ---------- */
const Prazo: React.FC = () => {
  const s = useIn(4);
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 380 }}>
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 32, color: "#fff", letterSpacing: 3, opacity: s }}>ÚLTIMO DIA DE INSCRIÇÃO</div>
      <div style={{ marginTop: 26, width: 560, background: "#fff", borderRadius: 18, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,.5)", transform: `scale(${0.8 + s * 0.2}) rotate(${(1 - s) * -6}deg)`, opacity: s }}>
        <div style={{ background: RED, padding: "16px 0", textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 40, color: "#fff", letterSpacing: 4 }}>DEZEMBRO</div>
        <div style={{ textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 260, color: NAVY, lineHeight: 1.05, letterSpacing: -10 }}>22</div>
      </div>
      <div style={{ marginTop: 30, fontFamily: FONT, fontWeight: 900, fontSize: 52, color: "#fff", opacity: useIn(14) }}>PM SP · ALUNO-SOLDADO</div>
    </AbsoluteFill>
  );
};

const Vagas: React.FC = () => {
  const f = useCurrentFrame();
  const n = Math.round(interpolate(f, [6, 30], [0, 2000], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const cards: [string, string, number][] = [["NÍVEL", "MÉDIO", wordAt(NARR, "j2", "nível", 40)], ["BANCA", "VUNESP", wordAt(NARR, "j2", "vunesp", 80) - 6]];
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 360 }}>
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 240, color: "#fff", letterSpacing: -8, lineHeight: 1 }}>{n.toLocaleString("pt-BR")}</div>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 64, color: RED, fontStyle: "italic", marginTop: 6 }}>VAGAS</div>
      <div style={{ display: "flex", gap: 24, marginTop: 60 }}>
        {cards.map(([a, b, d]) => {
          const s = interpolate(f, [d, d + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={a} style={{ width: 380, background: "rgba(255,255,255,.06)", border: "2px solid rgba(255,255,255,.2)", borderTop: `6px solid ${RED}`, padding: "22px 0", textAlign: "center", opacity: s, transform: `translateY(${(1 - s) * 30}px)` }}>
              <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 26, color: "#9aa4b8", letterSpacing: 3 }}>{a}</div>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 64, color: "#fff", letterSpacing: -2 }}>{b}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Dado: React.FC = () => {
  const f = useCurrentFrame();
  const at = wordAt(NARR, "j3", "português", 30);
  const fill = interpolate(f, [at, at + 30], [0, 35 / 60], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const n = Math.round(fill * 60);
  const R = 220, L = 2 * Math.PI * R;
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 330 }}>
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, color: "#fff", letterSpacing: 3, opacity: useIn(2) }}>A PROVA EM NÚMEROS</div>
      <div style={{ position: "relative", width: 540, height: 540, marginTop: 30 }}>
        <svg width={540} height={540}><circle cx={270} cy={270} r={R} fill="none" stroke="rgba(255,255,255,.12)" strokeWidth={60} /><circle cx={270} cy={270} r={R} fill="none" stroke={RED} strokeWidth={60} strokeDasharray={`${L * fill} ${L}`} transform="rotate(-90 270 270)" /></svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 150, color: "#fff", letterSpacing: -4, lineHeight: 1 }}>{n}</div>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, color: "#9aa4b8" }}>DE 60</div>
        </div>
      </div>
      <div style={{ marginTop: 20, fontFamily: FONT, fontWeight: 900, fontSize: 46, color: "#fff", opacity: interpolate(f, [at + 20, at + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        PORTUGUÊS <span style={{ color: "#9aa4b8" }}>20</span> + MATEMÁTICA <span style={{ color: "#9aa4b8" }}>15</span>
      </div>
    </AbsoluteFill>
  );
};

type Shot = { src: string; h: number; from: number; to: number; at: number; dur: number };
const Plataforma: React.FC<{ frames: number }> = ({ frames }) => {
  const f = useCurrentFrame();
  const t1 = wordAt(NARR, "j4", "correção", 120) - 6;
  const t2 = wordAt(NARR, "j4", "nota", 170) - 6;
  const shots: Shot[] = [
    { src: "prova", h: 2796, from: 0, to: 450, at: 0, dur: t1 },
    { src: "resultado", h: 3456, from: 230, to: 560, at: t1, dur: t2 - t1 },
    { src: "resultado", h: 3456, from: 1150, to: 1350, at: t2, dur: frames - t2 },
  ];
  const w = 860, h = 760, k = w / 1290;
  const enter = useIn(2);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 60, top: 300, display: "flex", alignItems: "center", gap: 12, opacity: enter }}>
        <span style={{ background: GOLD, color: "#111", fontFamily: MONO, fontWeight: 700, fontSize: 22, padding: "6px 12px" }}>IMAGENS DA PLATAFORMA</span>
        <span style={{ fontFamily: MONO, fontSize: 20, color: "#9aa4b8" }}>conta de demonstração</span>
      </div>
      <div style={{ position: "absolute", left: 102, top: 360, width: w + 16, height: h + 16, padding: 8, borderRadius: 22, background: "#0a0a0c", boxShadow: `0 30px 90px rgba(0,0,0,.6), 0 0 0 3px ${GOLD}`, opacity: enter, transform: `scale(${0.95 + enter * 0.05})` }}>
        <div style={{ position: "relative", width: w, height: h, borderRadius: 14, overflow: "hidden" }}>
          {shots.map((s, i) => {
            const o = interpolate(f, [s.at, s.at + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * (i < shots.length - 1 ? interpolate(f, [s.at + s.dur, s.at + s.dur + 8], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1);
            const y = interpolate(f, [s.at + 8, s.at + s.dur], [s.from, Math.min(s.to, s.h - h / k)], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.45, 0, 0.2, 1) });
            return <Img key={i} src={staticFile(`site/${s.src}.jpg`)} style={{ position: "absolute", left: 0, top: -y * k, width: w, opacity: o }} />;
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Cta: React.FC<{ frames: number }> = ({ frames }) => {
  const f = useCurrentFrame();
  const btn = useIn(wordAt(NARR, "j5", "faça", 60) - 4);
  const pulse = f > 70 ? 1 + Math.sin(f / 5) * 0.03 : 1;
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 320 }}>
      <div style={{ opacity: useIn(0) }}><Selo size={190} /></div>
      <div style={{ marginTop: 26, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 96, lineHeight: 0.95, letterSpacing: -3, color: "#fff", opacity: useIn(4) }}>
        1º SIMULADO<br /><span style={{ color: RED, fontStyle: "italic" }}>GRÁTIS</span>
      </div>
      <div style={{ marginTop: 40, background: RED, color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 60, padding: "26px 70px", borderRadius: 12, opacity: btn, transform: `scale(${(0.9 + btn * 0.1) * pulse})`, boxShadow: "0 0 50px rgba(227,25,43,.55)" }}>FAÇA O SEU</div>
      <div style={{ marginTop: 22, fontFamily: MONO, fontWeight: 700, fontSize: 26, color: "#fff", opacity: btn }}>simuladosoperaçãoaprovação.com.br</div>
      <div style={{ position: "absolute", left: 80, right: 80, top: 1215, textAlign: "center", fontFamily: MONO, fontSize: 19, color: "#9aa4b8", lineHeight: 1.45, opacity: interpolate(f, [10, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        Conteúdo publicitário da Operação Aprovação · edital DP-4/321/26 no site da Vunesp.<br />Sem vínculo com a PM SP ou a Vunesp. Não garantimos aprovação.
      </div>
    </AbsoluteFill>
  );
};

export const JornalVideo: React.FC = () => {
  const st = starts(SCENES_JORNAL);
  const f = useCurrentFrame();
  const render = (id: string, frames: number) => {
    switch (id) {
      case "prazo": return <Prazo />;
      case "vagas": return <Vagas />;
      case "dado": return <Dado />;
      case "plataforma": return <Plataforma frames={frames} />;
      default: return <Cta frames={frames} />;
    }
  };
  const vol = (fr2: number) => interpolate(fr2, [0, 10], [0, 0.32], { extrapolateRight: "clamp" }) * interpolate(fr2, [TOTAL_JORNAL - 25, TOTAL_JORNAL], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // flash branco curto nas trocas (corte de telejornal)
  const k = st.findIndex((s, i) => i > 0 && f >= s && f < s + 4);
  const flash = k > 0 ? interpolate(f - st[k], [0, 4], [0.35, 0]) : 0;
  return (
    <AbsoluteFill style={{ background: NAVY }}>
      <Estudio />
      {SCENES_JORNAL.map((s, i) => (
        <Sequence key={s.id} from={st[i]} durationInFrames={s.frames} name={s.id}>
          {render(s.id, s.frames)}
          {s.id !== "cta" ? <Manchete id={s.id} /> : null}
        </Sequence>
      ))}
      <Cabecalho />
      <Ticker />
      <AbsoluteFill style={{ background: "#fff", opacity: flash, pointerEvents: "none" }} />
      {SCENES_JORNAL.map((s, i) => (
        <Sequence key={`v${s.id}`} from={st[i] + VOICE_DELAY} durationInFrames={Math.ceil(NARR.cenas[s.voz!].duracao * 30) + 2}>
          <Audio src={staticFile(NARR.cenas[s.voz!].arquivo)} />
        </Sequence>
      ))}
      <Audio src={staticFile("trilha-jornal.wav")} volume={vol} />
    </AbsoluteFill>
  );
};
