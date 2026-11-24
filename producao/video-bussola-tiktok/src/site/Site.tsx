// Vídeo da página inicial dos Simulados Operação Aprovação: resolve a dor "treino sem saber onde perco ponto".
// Telas reais capturadas em 24/11/2026 com uma conta de demonstração (public/site/*.jpg, 1290 px de largura).
// Dois formatos: 16:9 (computador) e 4:5 (celular). Começa sem som na página: a mensagem está toda na tela.
import React, { useMemo } from "react";
import { AbsoluteFill, Audio, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import narrJson from "../data/narracao-site.json";
import { C, FONT, MONO } from "../theme";
import { buildCaps, Narr, Scene, starts, total, VOICE_DELAY } from "../kit";
import { Selo } from "../components/assets";

const NARR = narrJson as Narr;
const GOLD = "#D4A63A";
const RED = "#E3192B";
const SHOT_W = 1290;
const SHOT_H = 2796; // altura de uma tela do celular (430×932 a 3x)

const fr = (id: string, extra = 14) => Math.ceil(NARR.cenas[id].duracao * 30) + VOICE_DELAY + extra;
export const SCENES_SITE: Scene[] = [
  { id: "s1", frames: fr("s1", 10), voz: "s1" },
  { id: "s2", frames: fr("s2", 16), voz: "s2" },
  { id: "s3", frames: fr("s3", 16), voz: "s3" },
  { id: "s4", frames: fr("s4", 16), voz: "s4" },
  { id: "s5", frames: fr("s5", 14), voz: "s5" },
  { id: "s6", frames: fr("s6", 22), voz: "s6" },
  { id: "s7", frames: fr("s7", 18), voz: "s7" },
  { id: "s8", frames: fr("s8", 18), voz: "s8" },
  { id: "s9", frames: fr("s9", 75), voz: "s9" },
];
export const TOTAL_SITE = total(SCENES_SITE);
const KEYS = ["erra", "ponto.", "banca,", "cronômetro,", "hora,", "pegadinha", "dominar.", "cobra.", "grátis."];

type Fmt = "16x9" | "4x5";
const useFmt = (): Fmt => (useVideoConfig().width > useVideoConfig().height ? "16x9" : "4x5");

const ease = Easing.bezier(0.45, 0, 0.2, 1);
const useIn = (delay = 0) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - delay, fps, config: { damping: 200, stiffness: 180, mass: 0.7 } });
};

/* ---------- celular com telas reais ---------- */
type Shot = { src: string; from?: number; to?: number; at?: number; dur?: number };
const Phone: React.FC<{ h: number; shots: Shot[]; frames: number; mark?: { x: number; y: number; w: number; h: number; from: number; shot?: number } }> = ({ h, shots, frames, mark }) => {
  const f = useCurrentFrame();
  const sw = (h - 28) * (SHOT_W / SHOT_H); // largura da tela
  const k = sw / SHOT_W; // px da captura -> px do vídeo
  const enter = useIn(2);
  const fadeOut = interpolate(f, [frames - 8, frames], [1, 0.0], { extrapolateLeft: "clamp" });
  return (
    <div style={{ position: "relative", width: sw + 28, height: h, borderRadius: 64 * (h / 960), background: "#050507", boxShadow: `0 40px 120px rgba(0,0,0,.7), 0 0 0 2px #2E2E36, 0 0 90px rgba(212,166,58,${0.12 * enter})`, transform: `translateY(${(1 - enter) * 60}px) scale(${0.96 + enter * 0.04})`, opacity: enter * fadeOut }}>
      <div style={{ position: "absolute", left: 14, top: 14, width: sw, height: h - 28, borderRadius: 52 * (h / 960), overflow: "hidden", background: "#0b0b0d" }}>
        {shots.map((s, i) => {
          const at = s.at ?? 0;
          const dur = s.dur ?? frames - at;
          const o = interpolate(f, [at, at + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * (i < shots.length - 1 ? interpolate(f, [at + dur, at + dur + 8], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1);
          const y = interpolate(f, [at + 10, at + dur - 6], [s.from ?? 0, s.to ?? s.from ?? 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
          return <Img key={i} src={staticFile(`site/${s.src}.jpg`)} style={{ position: "absolute", left: 0, top: -y * k, width: sw, opacity: o }} />;
        })}
        {mark ? (() => {
          const s = shots[mark.shot ?? 0];
          const at = s.at ?? 0;
          const dur = s.dur ?? frames - at;
          const y = interpolate(f, [at + 10, at + dur - 6], [s.from ?? 0, s.to ?? s.from ?? 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
          const a = interpolate(f, [mark.from, mark.from + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const pulse = 1 + Math.sin((f - mark.from) / 5) * 0.015;
          return <div style={{ position: "absolute", left: mark.x * k - 6, top: (mark.y - y) * k - 6, width: mark.w * k + 12, height: mark.h * k + 12, border: `4px solid ${GOLD}`, borderRadius: 14, boxShadow: `0 0 30px rgba(212,166,58,.55), inset 0 0 0 9999px rgba(212,166,58,.06)`, opacity: a, transform: `scale(${pulse})` }} />;
        })() : null}
      </div>
      <div style={{ position: "absolute", left: "50%", top: 24 * (h / 960), width: 110 * (h / 960), height: 30 * (h / 960), marginLeft: -55 * (h / 960), borderRadius: 20, background: "#050507" }} />
    </div>
  );
};

/* ---------- textos ---------- */
const Label: React.FC<{ t: string; size: number; color?: string; delay?: number }> = ({ t, size, color = GOLD, delay = 0 }) => {
  const s = useIn(delay);
  return <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: size, color, letterSpacing: 2, opacity: s, transform: `translateX(${(1 - s) * -30}px)` }}>{t}</div>;
};
const Headline: React.FC<{ parts: { t: string; hit?: boolean; br?: boolean }[]; size: number; color?: string; delay?: number; align?: "left" | "center" }> = ({ parts, size, color = GOLD, delay = 4, align = "left" }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: size, lineHeight: 0.98, letterSpacing: -size * 0.035, textTransform: "uppercase", color: C.white, textAlign: align }}>
      {parts.map((p, i) => {
        const s = spring({ frame: f - delay - i * 3, fps, config: { damping: 200, stiffness: 200, mass: 0.6 } });
        return (
          <React.Fragment key={i}>
            <span style={{ display: "inline-block", opacity: s, transform: `translateY(${(1 - s) * 34}px)`, color: p.hit ? color : undefined, fontStyle: p.hit ? "italic" : undefined, paddingRight: p.hit ? size * 0.05 : 0 }}>{p.t}</span>
            {p.br ? <br /> : " "}
          </React.Fragment>
        );
      })}
    </div>
  );
};
const Sub: React.FC<{ t: React.ReactNode; size: number; delay?: number; align?: "left" | "center" }> = ({ t, size, delay = 14, align = "left" }) => {
  const s = useIn(delay);
  return <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, lineHeight: 1.3, color: C.gray, opacity: s, transform: `translateY(${(1 - s) * 16}px)`, textAlign: align, textTransform: "none", letterSpacing: -0.3 }}>{t}</div>;
};
const Chips: React.FC<{ items: string[]; size: number; delay?: number; justify?: string }> = ({ items, size, delay = 18, justify = "flex-start" }) => (
  <div style={{ display: "flex", gap: size * 0.6, flexWrap: "wrap", justifyContent: justify }}>
    {items.map((t, i) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const s = useIn(delay + i * 4);
      return <div key={t} style={{ fontFamily: MONO, fontWeight: 700, fontSize: size, color: GOLD, border: `2px solid rgba(212,166,58,.55)`, background: "rgba(212,166,58,.08)", padding: `${size * 0.35}px ${size * 0.7}px`, borderRadius: 6, opacity: s, transform: `translateY(${(1 - s) * 14}px)` }}>{t}</div>;
    })}
  </div>
);

/* ---------- layout de uma cena com celular ---------- */
const Feature: React.FC<{ frames: number; label: string; parts: { t: string; hit?: boolean; br?: boolean }[]; sub: React.ReactNode; chips?: string[]; shots: Shot[]; mark?: React.ComponentProps<typeof Phone>["mark"]; note?: string }> = ({ frames, label, parts, sub, chips, shots, mark, note }) => {
  const fmt = useFmt();
  if (fmt === "16x9") {
    return (
      <AbsoluteFill>
        <div style={{ position: "absolute", left: 150, top: 0, bottom: 0, width: 880, display: "flex", flexDirection: "column", justifyContent: "center", gap: 26 }}>
          <Label t={label} size={26} />
          <Headline parts={parts} size={86} />
          <Sub t={sub} size={32} />
          {chips ? <Chips items={chips} size={22} /> : null}
          {note ? <div style={{ fontFamily: MONO, fontSize: 17, color: "#6f6f78", marginTop: 6 }}>{note}</div> : null}
        </div>
        <div style={{ position: "absolute", right: 210, top: 60 }}><Phone h={960} shots={shots} frames={frames} mark={mark} /></div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 70, right: 70, top: 80, display: "flex", flexDirection: "column", gap: 16 }}>
        <Label t={label} size={24} />
        <Headline parts={parts} size={66} />
        <Sub t={sub} size={27} />
        {note ? <div style={{ fontFamily: MONO, fontSize: 16, color: "#6f6f78" }}>{note}</div> : null}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 480, display: "flex", justifyContent: "center" }}><Phone h={770} shots={shots} frames={frames} mark={mark} /></div>
    </AbsoluteFill>
  );
};

/* ---------- abertura: a dor ---------- */
const Dor1: React.FC = () => {
  const fmt = useFmt();
  const big = fmt === "16x9" ? 120 : 96;
  const f = useCurrentFrame();
  const shake = f > 52 && f < 60 ? Math.sin(f * 3) * 6 : 0;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 80 }}>
      <div style={{ transform: `translateX(${shake}px)` }}>
        <Headline align="center" size={big} delay={2} parts={[{ t: "Você estuda." , br: true }, { t: "Resolve questão.", br: true }]} />
        <div style={{ height: 24 }} />
        <Headline align="center" size={big * 0.82} delay={44} color={RED} parts={[{ t: "E na prova" }, { t: "erra de novo.", hit: true }]} />
      </div>
    </AbsoluteFill>
  );
};
const Dor2: React.FC<{ frames: number }> = () => {
  const fmt = useFmt();
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const items = ["PDF genérico", "Gabarito no grupo", "Corrigir na mão"];
  const size = fmt === "16x9" ? 40 : 34;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: fmt === "16x9" ? 50 : 40, flexDirection: "column", padding: 70 }}>
      <div style={{ display: "flex", gap: 22, flexDirection: fmt === "16x9" ? "row" : "column", alignItems: "center" }}>
        {items.map((t, i) => {
          const s = spring({ frame: f - 2 - i * 5, fps, config: { damping: 200, stiffness: 220 } });
          const cut = interpolate(f, [22 + i * 6, 32 + i * 6], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={t} style={{ position: "relative", fontFamily: FONT, fontWeight: 800, fontSize: size, color: "#bfbfc6", border: "2px solid #34343c", background: "#17171c", padding: "18px 30px", borderRadius: 10, opacity: s * interpolate(cut, [0, 100], [1, 0.55]), transform: `translateY(${(1 - s) * 30}px)` }}>
              {t}
              <div style={{ position: "absolute", left: 16, top: "52%", height: 5, width: `calc(${cut}% - 32px)`, background: RED, borderRadius: 3 }} />
            </div>
          );
        })}
      </div>
      <Headline align="center" size={fmt === "16x9" ? 84 : 70} delay={34} color={GOLD} parts={[{ t: "O problema é treinar", br: true }, { t: "sem saber onde" }, { t: "perde ponto.", hit: true }]} />
    </AbsoluteFill>
  );
};

/* ---------- chamada final ---------- */
const Cta: React.FC<{ frames: number }> = ({ frames }) => {
  const fmt = useFmt();
  const f = useCurrentFrame();
  const btn = useIn(22);
  const pulse = f > 40 ? 1 + Math.sin((f - 40) / 6) * 0.025 : 1;
  const wide = fmt === "16x9";
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: wide ? 30 : 28, padding: 60 }}>
      <div style={{ opacity: useIn(0), transform: `scale(${0.9 + useIn(0) * 0.1})` }}><Selo size={wide ? 150 : 170} /></div>
      <Headline align="center" size={wide ? 96 : 80} delay={6} parts={[{ t: "Faça seu 1º simulado", br: true }, { t: "grátis.", hit: true }]} />
      <div style={{ opacity: btn, transform: `translateY(${(1 - btn) * 24}px) scale(${pulse})`, background: GOLD, color: "#111", fontFamily: FONT, fontWeight: 900, fontSize: wide ? 40 : 42, letterSpacing: -0.5, padding: wide ? "26px 60px" : "28px 52px", borderRadius: 10, boxShadow: `0 0 ${40 + (pulse - 1) * 900}px rgba(212,166,58,.45)` }}>
        CRIAR CONTA GRÁTIS
      </div>
      <Sub align="center" delay={30} size={wide ? 28 : 28} t={<>Sem cartão de crédito · PM · PC · PF · PRF · Penal · GCM · CBM</>} />
      <div style={{ position: "absolute", bottom: wide ? 34 : 40, left: 60, right: 60, textAlign: "center", fontFamily: MONO, fontSize: wide ? 16 : 16, color: "#6f6f78", lineHeight: 1.5, opacity: interpolate(f, [30, 45], [0, 1], { extrapolateRight: "clamp" }) * interpolate(f, [frames - 10, frames], [1, 1]) }}>
        Plataforma educacional independente, sem vínculo com bancas ou órgãos públicos. Não garantimos aprovação.
      </div>
    </AbsoluteFill>
  );
};

/* ---------- legenda discreta (a página toca sem som) ---------- */
const Legenda: React.FC = () => {
  const fmt = useFmt();
  const f = useCurrentFrame();
  const caps = useMemo(() => buildCaps(SCENES_SITE, NARR, KEYS), []);
  const t = f / 30;
  const cur = caps.find((c) => t >= c.from - 0.02 && t < c.to);
  if (!cur || t > total(SCENES_SITE.slice(0, 8)) / 30) return null; // na chamada final o texto já está na tela
  const wide = fmt === "16x9";
  return (
    <div style={{ position: "absolute", left: wide ? 150 : 40, width: wide ? 880 : 1000, bottom: wide ? 70 : 26, display: "flex", justifyContent: wide ? "flex-start" : "center" }}>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: wide ? 30 : 30, color: C.white, background: "rgba(10,10,12,.82)", border: "1px solid #2a2a32", padding: "8px 16px", borderRadius: 8, letterSpacing: -0.3 }}>
        {cur.words.map((w, i) => (
          <span key={i} style={{ color: w.key ? GOLD : undefined }}>{w.text}{i < cur.words.length - 1 ? " " : ""}</span>
        ))}
      </div>
    </div>
  );
};

/* ---------- vídeo ---------- */
const Fundo: React.FC = () => {
  const f = useCurrentFrame();
  const st = starts(SCENES_SITE);
  const dor = interpolate(f, [st[2] - 6, st[2] + 10], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, backgroundImage: `radial-gradient(ellipse 60% 55% at 50% 45%, rgba(227,25,43,${0.13 * dor}), transparent 70%), radial-gradient(ellipse 55% 60% at 72% 50%, rgba(212,166,58,${0.12 * (1 - dor)}), transparent 70%), linear-gradient(${C.grid} 2px, transparent 2px), linear-gradient(90deg, ${C.grid} 2px, transparent 2px)`, backgroundSize: "100% 100%, 100% 100%, 72px 72px, 72px 72px" }} />
  );
};

export const SiteVideo: React.FC = () => {
  const st = starts(SCENES_SITE);
  const { width, height } = useVideoConfig();
  const wide = width > height;
  const scene = (id: string, frames: number) => {
    switch (id) {
      case "s1": return <Dor1 />;
      case "s2": return <Dor2 frames={frames} />;
      case "s3": return <Feature frames={frames} label="// 01 · ESCOLHA SEU CONCURSO" parts={[{ t: "No padrão da" }, { t: "sua banca.", hit: true }]} sub="Simulado montado pelo último edital, com o peso de cada matéria." chips={["PM SP", "Vunesp", "Edital 2026", "60 questões"]} shots={[{ src: "config", from: 0, to: 3500, at: 0, dur: frames - 34 }, { src: "gerando", from: 0, at: frames - 34 }]} />;
      case "s4": return <Feature frames={frames} label="// 02 · RESOLVA" parts={[{ t: "Como no" }, { t: "dia da prova.", hit: true }]} sub="Cronômetro, cartão de navegação e revisão antes de entregar." shots={[{ src: "prova", from: 0 }]} mark={{ x: 836, y: 231, w: 407, h: 137, from: 18 }} />;
      case "s5": return <Feature frames={frames} label="// 03 · CORREÇÃO NA HORA" parts={[{ t: "Sem esperar" }, { t: "ninguém.", hit: true }]} sub="Nota, acertos e desempenho por matéria assim que você entrega." shots={[{ src: "resultado", from: 0, to: 660 }]} />;
      case "s6": return <Feature frames={frames} label="// GABARITO COMENTADO" parts={[{ t: "E a" }, { t: "pegadinha", hit: true }, { t: "da banca." }]} sub="Cada questão explica a resposta certa e onde a banca tenta te derrubar." shots={[{ src: "gabarito", from: 0, to: 270 }]} mark={{ x: 24, y: 2745, w: 1242, h: 290, from: 50 }} />;
      case "s7": return <Feature frames={frames} label="// 04 · CADERNO DE ERROS" parts={[{ t: "Seu erro vira" }, { t: "missão.", hit: true }]} sub="Cada erro entra sozinho no Caderno. Você refaz no Modo Redenção até dominar." shots={[{ src: "red-questao", from: 0, at: 0, dur: 40 }, { src: "red-marcada", from: 0, at: 40, dur: 30 }, { src: "red-dominada", from: 0, at: 70 }]} />;
      case "s8": return <Feature frames={frames} label="// BÚSSOLA TÁTICA" parts={[{ t: "O que sua banca" }, { t: "mais cobra.", hit: true }]} sub="Raio-X do edital: peso de cada matéria e tópicos com prioridade alta." shots={[{ src: "bussola", from: 1650, to: 3700 }]} note="Estimativa baseada no histórico de provas da banca, não é dado oficial." />;
      default: return <Cta frames={frames} />;
    }
  };
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Fundo />
      {SCENES_SITE.map((s, i) => (
        <Sequence key={s.id} from={st[i]} durationInFrames={s.frames} name={s.id}>{scene(s.id, s.frames)}</Sequence>
      ))}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 6, background: GOLD }} />
      <div style={{ position: "absolute", right: wide ? 40 : 30, top: wide ? 28 : 24, fontFamily: MONO, fontWeight: 700, fontSize: wide ? 18 : 17, color: "#7c7c86", letterSpacing: 1.5 }}>OPERAÇÃO APROVAÇÃO · SIMULADOS</div>
      <Sequence from={st[2]} durationInFrames={st[8] - st[2]}>
        <div style={{ position: "absolute", left: wide ? 40 : 30, top: wide ? 28 : 24, fontFamily: MONO, fontSize: wide ? 16 : 15, color: "#6f6f78" }}>Telas reais · conta de demonstração</div>
      </Sequence>
      <Legenda />
      {SCENES_SITE.map((s, i) => (
        <Sequence key={`v${s.id}`} from={st[i] + VOICE_DELAY} durationInFrames={Math.ceil(NARR.cenas[s.id].duracao * 30) + 2}>
          <Audio src={staticFile(NARR.cenas[s.id].arquivo)} />
        </Sequence>
      ))}
      <Audio src={staticFile("trilha-site.wav")} volume={(fr2) => interpolate(fr2, [0, 15], [0, 0.42], { extrapolateRight: "clamp" }) * interpolate(fr2, [TOTAL_SITE - 25, TOTAL_SITE], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
    </AbsoluteFill>
  );
};
