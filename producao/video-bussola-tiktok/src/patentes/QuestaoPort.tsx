// Questão do Dia · PORTUGUÊS (regência: assistir, preferir, aspirar): questão + cronômetro e gabarito comentado.
// Questão de treino elaborada pela Operação Aprovação.
import React from "react";
import { AbsoluteFill, Audio, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import narrQ from "../data/narracao-questao-port.json";
import narrG from "../data/narracao-gabarito-port.json";
import { C, FONT, MONO } from "../theme";
import { Mono, TermBox, useSpring } from "../components/ui";
import { Selo } from "../components/assets";
import { Narr, Scene, ShortVideo, total, wordAt } from "../kit";

const NQ = narrQ as Narr;
const NG = narrG as Narr;
const HANDLE = "@operacaoaprovacaoconcursos";
const HORARIO = "19h";
const GREEN = "#22B35E";

const ENUNCIADO = ["Qual frase está de acordo com a ", "norma-padrão", " da língua portuguesa?"];
const ALTS: [string, string][] = [["A", "Assisti o jogo do Brasil ontem."], ["B", "Assisti ao jogo do Brasil ontem."], ["C", "Prefiro estudar do que jogar."], ["D", "Ele aspira o cargo de delegado."]];

/** TEMPOS (frames a 30 fps) — ajuste aqui */
export const SCENES_QUESTAO_PORT: Scene[] = [
  { id: "abertura", frames: 124, voz: "q1" },
  { id: "questao", frames: 290, voz: "q2" },
  { id: "timer", frames: 300 },
  { id: "cta", frames: 160, voz: "q3" },
];
export const SCENES_GABARITO_PORT: Scene[] = [
  { id: "gancho", frames: 62, voz: "g1" },
  { id: "resposta", frames: 74, voz: "g2" },
  { id: "comentario", frames: 168, voz: "g3" },
  { id: "pegadinha", frames: 220, voz: "g4" },
  { id: "plataforma", frames: 178, voz: "g5" },
  { id: "cta", frames: 150, voz: "g6" },
];
export const TOTAL_QUESTAO_PORT = total(SCENES_QUESTAO_PORT);
export const TOTAL_GABARITO_PORT = total(SCENES_GABARITO_PORT);

const Label: React.FC<{ t: string; top?: number }> = ({ t, top = 200 }) => (
  <Mono size={28} color={C.red} style={{ position: "absolute", left: 80, top, opacity: useSpring(1) }}>{t}</Mono>
);

const Stopwatch: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <circle cx="32" cy="36" r="22" fill="none" stroke={C.red} strokeWidth="5" />
    <path d="M26 6h12M32 6v8M48 18l4-4" stroke={C.red} strokeWidth="5" strokeLinecap="round" />
    <path d="M32 36V24" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
  </svg>
);

/** enunciado com a palavra-chave destacada */
const Enunciado: React.FC<{ top: number; size: number; hl: boolean }> = ({ top, size, hl }) => (
  <TermBox style={{ position: "absolute", left: 80, top, width: 860, padding: "28px 30px" }}>
    <Mono size={20} color={C.gray}>QUESTÃO DE TREINO · LÍNGUA PORTUGUESA · REGÊNCIA</Mono>
    <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: size, lineHeight: 1.3, color: C.white, marginTop: 12 }}>
      {ENUNCIADO[0]}
      <span style={{ color: hl ? C.white : C.white, background: hl ? C.red : "transparent", padding: "0 8px", borderRadius: 4, fontWeight: 900 }}>{ENUNCIADO[1]}</span>
      {ENUNCIADO[2]}
    </div>
  </TermBox>
);

const Alt: React.FC<{ l: string; t: string; top: number; left?: number; w?: number; h?: number; on?: boolean; state?: "certa" | "errada" | null; fs?: number }> = ({ l, t, top, left = 80, w = 860, h = 92, on = true, state = null, fs = 38 }) => {
  const bg = state === "certa" ? GREEN : state === "errada" ? "rgba(227,25,43,.18)" : C.box;
  const bd = state === "certa" ? GREEN : state === "errada" ? C.red : C.border;
  return (
    <div style={{ position: "absolute", left, top, width: w, height: h, display: "flex", alignItems: "center", gap: 20, padding: "0 24px", background: bg, border: `3px solid ${bd}`, borderRadius: 10, opacity: on ? 1 : 0, transform: `translateX(${on ? 0 : -30}px)` }}>
      <span style={{ width: 54, height: 54, flex: "none", borderRadius: 27, border: `3px solid ${state === "certa" ? "#fff" : C.red}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontWeight: 700, fontSize: 28, color: C.white }}>{l}</span>
      <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: fs, color: C.white, letterSpacing: -0.5 }}>{t}</span>
      {state === "certa" ? <span style={{ marginLeft: "auto", fontFamily: FONT, fontWeight: 900, fontSize: 44, color: "#fff" }}>✓</span> : null}
      {state === "errada" ? <span style={{ marginLeft: "auto", fontFamily: FONT, fontWeight: 900, fontSize: 44, color: C.red }}>✕</span> : null}
    </div>
  );
};

// ---------------- VÍDEO 1: QUESTÃO ----------------
const Abertura: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - wordAt(NQ, "q1", "voce", 50), fps, config: { damping: 12, stiffness: 300, mass: 0.6 } });
  return (
    <AbsoluteFill>
      <Label t="// PORTUGUÊS · VALE PARA TODAS AS CARREIRAS" top={230} />
      <div style={{ position: "absolute", left: 80, top: 290, fontFamily: FONT, fontWeight: 900, fontSize: 104, lineHeight: 0.95, letterSpacing: -4, color: C.white, opacity: useSpring(2) }}>
        QUAL ESTÁ<br /><span style={{ color: C.red, fontStyle: "italic" }}>CERTA?</span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, display: "flex", flexDirection: "column", alignItems: "center", opacity: f >= wordAt(NQ, "q1", "voce", 50) ? 1 : 0, transform: `scale(${interpolate(s, [0, 1], [1.6, 1])})` }}>
        <Stopwatch size={200} />
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 92, letterSpacing: -3, color: C.white, marginTop: 10 }}>VOCÊ TEM <span style={{ color: C.red }}>10s</span></div>
      </div>
    </AbsoluteFill>
  );
};

const Questao: React.FC = () => {
  const f = useCurrentFrame();
  const hl = f >= wordAt(NQ, "q2", "norma", 30);
  // instante exato em que a voz lê cada letra ("A:", "B:"…)
  const ws = NQ.cenas.q2?.palavras ?? [];
  const altAt = ALTS.map(([l], i) => {
    const w = ws.find((p) => p.text.replace(/[^A-Za-z]/g, "") === l && p.text.includes(":"));
    return w ? Math.round(w.start * 30) + 3 : 200 + i * 30;
  });
  return (
    <AbsoluteFill>
      <Label t="// RESPONDA EM 10 SEGUNDOS" />
      <Enunciado top={260} size={38} hl={hl} />
      {ALTS.map(([l, t], i) => (
        <Alt key={l} l={l} t={t} top={700 + i * 108} on={f >= altAt[i]} />
      ))}
    </AbsoluteFill>
  );
};

const Timer: React.FC<{ frames: number }> = ({ frames }) => {
  const f = useCurrentFrame();
  const n = Math.max(1, Math.ceil((frames - f) / 30));
  const frac = 1 - f / frames;
  const R = 150;
  const circ = 2 * Math.PI * R;
  const pulse = 1 + Math.max(0, 1 - (f % 30) / 8) * 0.06;
  const urg = n <= 3;
  return (
    <AbsoluteFill>
      <Enunciado top={200} size={30} hl />
      {ALTS.map(([l, t], i) => (
        <Alt key={l} l={l} t={t} top={600 + Math.floor(i / 2) * 104} left={80 + (i % 2) * 440} w={420} h={90} fs={26} />
      ))}
      <div style={{ position: "absolute", left: 540 - R - 20, top: 830, width: (R + 20) * 2, height: (R + 20) * 2, transform: `scale(${pulse})` }}>
        <svg width={(R + 20) * 2} height={(R + 20) * 2}>
          <circle cx={R + 20} cy={R + 20} r={R} fill={C.box} stroke={C.border} strokeWidth={18} />
          <circle cx={R + 20} cy={R + 20} r={R} fill="none" stroke={urg ? C.red : "#fff"} strokeWidth={18} strokeDasharray={circ} strokeDashoffset={circ * (1 - frac)} transform={`rotate(-90 ${R + 20} ${R + 20})`} strokeLinecap="round" />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 170, letterSpacing: -6, color: urg ? C.red : C.white }}>{n}</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1300, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 60, letterSpacing: -1.5, color: C.white, WebkitTextStroke: "10px #000", paintOrder: "stroke fill" }}>
        COMENTA <span style={{ color: C.red }}>A, B, C</span> OU <span style={{ color: C.red }}>D</span> 👇
      </div>
      {Array.from({ length: 10 }, (_, i) => (
        <Sequence key={i} from={i * 30} durationInFrames={10}><Audio src={staticFile("sfx/tick.wav")} volume={0.8} /></Sequence>
      ))}
      <Sequence from={frames - 4} durationInFrames={25}><Audio src={staticFile("sfx/fim.wav")} volume={0.5} /></Sequence>
    </AbsoluteFill>
  );
};

const FollowBtn: React.FC<{ at: number; top: number }> = ({ at, top }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - at, fps, config: { damping: 200, stiffness: 300 } });
  const pulse = f > at + 8 ? 1 + Math.sin(((f - at) / fps) * Math.PI * 3.2) * 0.03 : 1;
  return (
    <div style={{ position: "absolute", left: 80, top, width: 860, opacity: s, transform: `translateY(${(1 - s) * 30}px) scale(${pulse})` }}>
      <div style={{ height: 120, background: C.red, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 18, fontFamily: FONT, fontWeight: 900, fontSize: 56, letterSpacing: -1.5, color: C.white, boxShadow: "0 0 40px rgba(227,25,43,.5)" }}>
        + SEGUIR O PERFIL
      </div>
      <Mono size={30} color={C.white} style={{ textAlign: "center", marginTop: 16 }}>{HANDLE}</Mono>
    </div>
  );
};

const CtaQuestao: React.FC = () => {
  const f = useCurrentFrame();
  const segue = wordAt(NQ, "q3", "segue", 90);
  const hora = useSpring(wordAt(NQ, "q3", "gabarito", 30));
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 200, display: "flex", justifyContent: "center", opacity: useSpring(0) }}><Selo size={170} /></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 410, textAlign: "center", opacity: hora, transform: `scale(${0.9 + hora * 0.1})` }}>
        <Mono size={32} color={C.gray}>GABARITO COMENTADO</Mono>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 190, letterSpacing: -8, lineHeight: 1, color: C.white }}>
          ÀS <span style={{ color: C.red, fontStyle: "italic" }}>{HORARIO}</span>
        </div>
        <Mono size={28} color={C.white} style={{ marginTop: 10 }}>comentário + pegadinha da banca</Mono>
      </div>
      <FollowBtn at={segue} top={860} />
      <Mono size={30} color={C.white} style={{ position: "absolute", left: 0, right: 0, top: 1110, textAlign: "center", opacity: f > 10 ? 1 : 0 }}>
        e comenta a sua resposta 👇
      </Mono>
      <div style={{ position: "absolute", left: 80, top: 1460, width: 860, textAlign: "center", fontFamily: MONO, fontSize: 18, color: C.gray }}>
        Questão de treino elaborada pela Operação Aprovação.
      </div>
    </AbsoluteFill>
  );
};

export const QuestaoPortVideo: React.FC = () => (
  <ShortVideo
    scenes={SCENES_QUESTAO_PORT}
    narr={NQ}
    keys={["portugues", "dez", "norma-padrao?", "19", "segue", "comenta"]}
    musica="trilha-questao-port.wav"
    render={(id, frames) => (id === "abertura" ? <Abertura /> : id === "questao" ? <Questao /> : id === "timer" ? <Timer frames={frames} /> : <CtaQuestao />)}
  />
);

// ---------------- VÍDEO 2: GABARITO COMENTADO ----------------
const GGancho: React.FC = () => {
  const f = useCurrentFrame();
  const x = f >= wordAt(NG, "g1", "caiu", 30);
  return (
    <AbsoluteFill>
      <Label t="// GABARITO COMENTADO" top={230} />
      <div style={{ position: "absolute", left: 80, top: 290, fontFamily: FONT, fontWeight: 900, fontSize: 100, lineHeight: 0.95, letterSpacing: -4, color: C.white }}>
        MARCOU A?<br /><span style={{ color: C.red, fontStyle: "italic" }}>CAIU NA PEGADINHA.</span>
      </div>
      <Enunciado top={660} size={30} hl />
      <Alt l="A" t="Assisti o jogo do Brasil ontem." top={1050} state={x ? "errada" : null} />
    </AbsoluteFill>
  );
};

const GResposta: React.FC = () => {
  const f = useCurrentFrame();
  const on = f >= wordAt(NG, "g2", "b:", 25);
  return (
    <AbsoluteFill>
      <Label t="// RESPOSTA" />
      <div style={{ position: "absolute", left: 80, top: 260, fontFamily: FONT, fontWeight: 900, fontSize: 110, letterSpacing: -4, color: C.white, lineHeight: 0.95 }}>
        LETRA <span style={{ color: GREEN }}>B</span>
      </div>
      {ALTS.map(([l, t], i) => (
        <Alt key={l} l={l} t={t} top={480 + i * 108} state={on ? (l === "B" ? "certa" : l === "A" ? "errada" : null) : null} />
      ))}
    </AbsoluteFill>
  );
};

const Card: React.FC<{ icon: string; tag: string; top: number; children: React.ReactNode; color?: string }> = ({ icon, tag, top, children, color = C.red }) => {
  const s = useSpring(2);
  return (
    <div style={{ position: "absolute", left: 80, top, width: 860, opacity: s, transform: `translateY(${(1 - s) * 30}px)` }}>
      <div style={{ display: "inline-block", fontFamily: MONO, fontWeight: 700, fontSize: 26, color: C.white, background: color, padding: "8px 16px", borderRadius: "8px 8px 0 0" }}>{icon} {tag}</div>
      <div style={{ background: C.box, border: `3px solid ${color}`, borderRadius: "0 12px 12px 12px", padding: "30px 32px" }}>{children}</div>
    </div>
  );
};

const GComentario: React.FC = () => {
  const f = useCurrentFrame();
  const ex = f >= wordAt(NG, "g3", "preposicao", 30);
  const art = useSpring(wordAt(NG, "g3", "quem", 90));
  return (
    <AbsoluteFill>
      <Label t="// POR QUE É B?" />
      <Card icon="💬" tag="COMENTÁRIO" top={270}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 64, letterSpacing: -2, color: C.white, lineHeight: 1.05 }}>
          Assistir (= ver) pede a preposição <span style={{ color: C.white, background: ex ? C.red : "transparent", padding: "0 10px", borderRadius: 6 }}>A</span>.
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 38, lineHeight: 1.3, color: "#d8d8de", marginTop: 24 }}>
          Quem assiste, assiste <b style={{ color: C.white }}>a</b> alguma coisa: <b style={{ color: C.white }}>assisti ao jogo</b>, assisti à aula, assisti aos vídeos.
        </div>
        <div style={{ marginTop: 26, opacity: art, fontFamily: MONO, fontWeight: 700, fontSize: 28, color: C.red }}>REGÊNCIA VERBAL · NORMA-PADRÃO</div>
      </Card>
    </AbsoluteFill>
  );
};

const VERBOS: [string, string, string, string][] = [
  ["ASSISTIR (= VER)", "assistir A algo", "assisti ao jogo", ""],
  ["PREFERIR", "preferir X A Y", "prefiro estudar a jogar", "preferir"],
  ["ASPIRAR (= DESEJAR)", "aspirar A algo", "aspira ao cargo", "aspirar"],
  ["ASSISTIR (= AJUDAR)", "assistir alguém", "o médico assistiu o paciente", "__fim"],
];

const GPegadinha: React.FC<{ frames: number }> = ({ frames }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Label t="// NÃO CAIA DE NOVO" />
      <Card icon="⚠️" tag="PEGADINHA DA BANCA: A PREPOSIÇÃO" top={270}>
        {VERBOS.map(([v, crime, art, needle], i) => {
          const at = needle === "" ? 0 : needle === "__fim" ? frames - 50 : wordAt(NG, "g4", needle, 40 * i);
          const on = f >= at;
          const first = i === 0;
          return (
            <div key={v} style={{ display: "flex", alignItems: "center", gap: 18, padding: "18px 0", borderTop: i ? `2px solid ${C.border}` : "none", opacity: on ? 1 : 0.12 }}>
              <div style={{ flex: 1, fontFamily: MONO, fontWeight: 700, fontSize: 25, color: first ? C.red : C.white, lineHeight: 1.25 }}>{v}</div>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 30, color: C.red }}>→</div>
              <div style={{ width: 330, textAlign: "right" }}>
                <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 36, color: first ? GREEN : C.white, letterSpacing: -0.5 }}>{crime}</div>
                <div style={{ fontFamily: MONO, fontSize: 20, color: C.gray }}>{art}</div>
              </div>
            </div>
          );
        })}
      </Card>
    </AbsoluteFill>
  );
};

/** imagens reais da plataforma: gabarito e alerta de pegadinha (clipes do vídeo da correção) */
const GPlataforma: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const parte = f < 62 ? 0 : 1;
  const lf = parte ? f - 62 : f;
  const z = parte ? { cy: 660, s: 1.6, band: [640, 950] as [number, number], tag: "ALERTA DE PEGADINHA" } : { cy: 990, s: 1.55, band: [785, 915] as [number, number], tag: "GABARITO" };
  const zk = spring({ frame: lf, fps, config: { damping: 200, stiffness: 120 } });
  const bandOn = spring({ frame: lf - 6, fps, config: { damping: 200, stiffness: 260 } });
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={62}>
        <AbsoluteFill style={{ transformOrigin: `540px ${990}px`, transform: `translateY(${800 - 990}px) scale(${interpolate(zk, [0, 1], [1.15, 1.55])})` }}>
          <OffthreadVideo src={staticFile("footage/correcao-gabarito.mp4")} muted style={{ width: 1080, height: 1920 }} />
        </AbsoluteFill>
      </Sequence>
      <Sequence from={62} durationInFrames={116}>
        <AbsoluteFill style={{ transformOrigin: `540px ${660}px`, transform: `translateY(${800 - 660}px) scale(${interpolate(zk, [0, 1], [1.15, 1.6])})` }}>
          <OffthreadVideo src={staticFile("footage/correcao-pegadinha.mp4")} muted playbackRate={0.79} style={{ width: 1080, height: 1920 }} />
        </AbsoluteFill>
      </Sequence>
      <AbsoluteFill style={{ background: "rgba(14,14,17,.35)" }} />
      <div style={{ position: "absolute", left: 40, right: 40, top: z.band[0], height: z.band[1] - z.band[0], border: `5px solid ${C.red}`, borderRadius: 14, boxShadow: `0 0 0 2000px rgba(14,14,17,${0.45 * bandOn}), 0 0 40px rgba(227,25,43,.5)`, opacity: bandOn }} />
      <div style={{ position: "absolute", left: 40, top: z.band[0] - 52, fontFamily: MONO, fontWeight: 700, fontSize: 26, color: C.white, background: C.red, padding: "8px 14px", borderRadius: 6, opacity: bandOn }}>{z.tag}</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 400, background: "linear-gradient(rgba(14,14,17,.94), rgba(14,14,17,.78) 55%, rgba(14,14,17,0))" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1180, height: 740, background: "linear-gradient(rgba(14,14,17,0), rgba(14,14,17,.55) 30%, rgba(14,14,17,.9))" }} />
      <div style={{ position: "absolute", left: 80, top: 190 }}>
        <Mono size={28} color={C.red}>// NA PLATAFORMA · IMAGEM REAL</Mono>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 80, letterSpacing: -2.5, lineHeight: 1, color: C.white, marginTop: 8 }}>
          EM CADA <span style={{ color: C.red, fontStyle: "italic" }}>QUESTÃO</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const CtaGabarito: React.FC<{ frames: number }> = ({ frames }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const btnAt = Math.min(frames - 50, wordAt(NG, "g6", "comenta", 4));
  const btn = spring({ frame: f - btnAt, fps, config: { damping: 200, stiffness: 300 } });
  const pulse = f > btnAt + 8 ? 1 + Math.sin(((f - btnAt) / fps) * Math.PI * 3.2) * 0.035 : 1;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, width: 1080, top: 200, display: "flex", justifyContent: "center" }}><Selo size={190} /></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 430, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 96, lineHeight: 0.95, letterSpacing: -3.5, color: C.white }}>
        SIMULADOS<br /><span style={{ color: C.red, fontStyle: "italic" }}>OPERAÇÃO<br />APROVAÇÃO</span>
      </div>
      <div style={{ position: "absolute", left: 80, top: 790, width: 860, height: 120, background: C.red, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 58, letterSpacing: -1.5, color: C.white, opacity: btn, transform: `translateY(${(1 - btn) * 30}px) scale(${pulse})`, boxShadow: `0 0 ${30 + (pulse - 1) * 800}px rgba(227,25,43,.55)` }}>
        COMENTE “SIMULADO”
      </div>
      <Mono size={28} color={C.white} style={{ position: "absolute", left: 80, top: 935, width: 860, textAlign: "center", lineHeight: 1.4, opacity: btn }}>
        e entre no grupo de espera<br /><span style={{ color: C.red }}>desconto de lançamento</span>
      </Mono>
      <Mono size={26} color={C.gray} style={{ position: "absolute", left: 80, top: 1060, width: 860, textAlign: "center" }}>
        siga {HANDLE} para a próxima questão
      </Mono>
      <div style={{ position: "absolute", left: 80, top: 1460, width: 860, textAlign: "center", fontFamily: MONO, fontSize: 18, color: C.gray }}>
        Questão de treino. Imagens reais da plataforma (pré-lançamento). Não garantimos aprovação.
      </div>
    </AbsoluteFill>
  );
};

export const GabaritoPortVideo: React.FC = () => (
  <ShortVideo
    scenes={SCENES_GABARITO_PORT}
    narr={NG}
    keys={["pegadinha", "b:", "assisti", "a.", "preferir", "aspirar", "simulado"]}
    musica="trilha-gabarito-port.wav"
    render={(id, frames) =>
      id === "gancho" ? <GGancho /> : id === "resposta" ? <GResposta /> : id === "comentario" ? <GComentario /> : id === "pegadinha" ? <GPegadinha frames={frames} /> : id === "plataforma" ? <GPlataforma /> : <CtaGabarito frames={frames} />
    }
  />
);
