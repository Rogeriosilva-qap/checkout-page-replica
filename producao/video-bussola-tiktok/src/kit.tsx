// Kit genérico para vídeos curtos: cenas + narração por cena + legendas palavra a palavra + trilha com ducking.
import React, { useMemo } from "react";
import { AbsoluteFill, Audio, interpolate, random, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, SAFE } from "./theme";
import { Background, HudFrame } from "./components/ui";

export type Cena = { duracao: number; texto: string; arquivo: string; palavras: { text: string; start: number; end: number }[] };
export type Narr = { cenas: Record<string, Cena> };
export type Scene = { id: string; frames: number; voz?: string };
export type Cap = { words: { text: string; start: number; key: boolean }[]; from: number; to: number };

export const VOICE_DELAY = 3;
const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9-]/g, "");

export const starts = (scenes: Scene[]) => scenes.reduce<number[]>((a, s, i) => [...a, i ? a[i - 1] + scenes[i - 1].frames : 0], []);
export const total = (scenes: Scene[]) => scenes.reduce((a, s) => a + s.frames, 0);

/** frame (relativo à cena) em que a palavra começa a ser dita */
export const wordAt = (narr: Narr, voz: string, needle: string, fallback = 0) => {
  const c = narr.cenas[voz];
  const n = norm(needle);
  const w = c?.palavras.find((p) => norm(p.text).startsWith(n));
  return w ? Math.round(w.start * 30) + VOICE_DELAY : fallback;
};

export const buildCaps = (scenes: Scene[], narr: Narr, keys: string[], fps = 30): Cap[] => {
  const out: Cap[] = [];
  const st = starts(scenes);
  scenes.forEach((s, si) => {
    const c = s.voz ? narr.cenas[s.voz] : undefined;
    if (!c) return;
    const base = (st[si] + VOICE_DELAY) / fps;
    const ws = c.palavras.map((w) => ({ text: w.text, start: base + w.start, end: base + w.end, key: keys.includes(norm(w.text)) }));
    let cur: typeof ws = [];
    const flush = () => {
      if (cur.length) out.push({ words: cur, from: cur[0].start, to: cur[cur.length - 1].end });
      cur = [];
    };
    ws.forEach((w, i) => {
      cur.push(w);
      const next = ws[i + 1];
      if (!next) return;
      const chars = cur.map((x) => x.text).join(" ").length;
      const punct = /[.,:;!?…]$/.test(w.text);
      const withNext = chars + 1 + next.text.length;
      const lastAlone = i + 1 === ws.length - 1 || /[.!?…]$/.test(next.text);
      if (cur.length >= 4 || (punct && cur.length >= 1 && chars >= 6) || withNext > 20) {
        if (!punct && lastAlone && withNext <= 22 && cur.length < 4) return;
        flush();
      }
    });
    flush();
  });
  out.forEach((c, i) => (c.to = out[i + 1] ? Math.min(out[i + 1].from, c.to + 0.5) : c.to + 0.6));
  return out;
};

export const Captions: React.FC<{ caps: Cap[]; y?: number }> = ({ caps, y = 1350 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const cur = caps.find((c) => t >= c.from - 0.02 && t < c.to);
  if (!cur) return null;
  const s = spring({ frame: f - Math.round(cur.from * fps), fps, config: { damping: 200, stiffness: 500, mass: 0.4 } });
  return (
    <div style={{ position: "absolute", left: SAFE.left, width: 1080 - SAFE.left - SAFE.right, top: y, transform: `translateY(-50%) scale(${0.88 + s * 0.12})`, display: "flex", justifyContent: "center", zIndex: 50 }}>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 64, lineHeight: 1.05, letterSpacing: -1.5, textAlign: "center", textTransform: "uppercase", color: C.white, WebkitTextStroke: "12px #000", paintOrder: "stroke fill", maxWidth: 880 }}>
        {cur.words.map((w, i) => (
          <span key={i} style={{ color: w.key ? C.red : C.white }}>
            {w.text.replace(/[,.:…]+$/, "")}
            {i < cur.words.length - 1 ? " " : ""}
          </span>
        ))}
      </div>
    </div>
  );
};

/** moldura comum: fundo, cenas em sequência com glitch nas trocas, HUD, legendas, voz, trilha e efeitos */
export const ShortVideo: React.FC<{
  scenes: Scene[];
  narr: Narr;
  keys: string[];
  musica: string;
  render: (id: string, frames: number) => React.ReactNode;
}> = ({ scenes, narr, keys, musica, render }) => {
  const f = useCurrentFrame();
  const st = starts(scenes);
  const caps = useMemo(() => buildCaps(scenes, narr, keys), [scenes, narr, keys]);
  const k = st.findIndex((s, i) => i > 0 && f >= s && f < s + 3);
  const seed = f * 13.1;
  const off = 10 + random(seed + 1) * 14;
  const glitch = k > 0;
  const spans = scenes.map((s, i) => (s.voz && narr.cenas[s.voz] ? [(st[i] + VOICE_DELAY) / 30, (st[i] + VOICE_DELAY) / 30 + narr.cenas[s.voz].duracao] : null)).filter(Boolean) as number[][];
  const dur = total(scenes);
  const vol = (fr: number) => {
    const tt = fr / 30;
    let d = Infinity;
    for (const [a, b] of spans) d = Math.min(d, tt < a ? a - tt : tt > b ? tt - b : 0);
    return interpolate(d, [0, 0.2], [0.33, 0.6], { extrapolateRight: "clamp" }) * interpolate(fr, [dur - 20, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  };
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Background />
      <AbsoluteFill
        style={{
          filter: glitch ? `drop-shadow(${off}px 0 0 rgba(255,0,40,.75)) drop-shadow(${-off}px 0 0 rgba(0,230,255,.6))` : undefined,
          transform: glitch ? `translateX(${(random(seed) - 0.5) * 40}px) skewX(${(random(seed + 2) - 0.5) * 6}deg)` : undefined,
        }}
      >
        {scenes.map((s, i) => (
          <Sequence key={s.id} from={st[i]} durationInFrames={s.frames} name={s.id}>
            {render(s.id, s.frames)}
          </Sequence>
        ))}
      </AbsoluteFill>
      {glitch ? (
        <AbsoluteFill>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ position: "absolute", left: 0, right: 0, top: random(f * 3 + i) * 1800, height: 6 + random(f * 7 + i) * 40, background: i === 1 ? "rgba(227,25,43,.55)" : "rgba(255,255,255,.12)", transform: `translateX(${(random(f + i * 9) - 0.5) * 120}px)` }} />
          ))}
        </AbsoluteFill>
      ) : null}
      <HudFrame />
      <Captions caps={caps} />
      {scenes.map((s, i) =>
        s.voz && narr.cenas[s.voz] ? (
          <Sequence key={`v${s.id}`} from={st[i] + VOICE_DELAY} durationInFrames={Math.ceil(narr.cenas[s.voz].duracao * 30) + 2}>
            <Audio src={staticFile(narr.cenas[s.voz].arquivo)} />
          </Sequence>
        ) : null,
      )}
      <Audio src={staticFile(musica)} volume={vol} />
      {st.slice(1).map((s, i) => (
        <Sequence key={`g${i}`} from={s - 1} durationInFrames={20}>
          <Audio src={staticFile("sfx/glitch.wav")} volume={0.35} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

/** checa se cada fala cabe na própria cena */
export const overflow = (scenes: Scene[], narr: Narr) =>
  scenes.filter((s) => s.voz && narr.cenas[s.voz] && Math.ceil(narr.cenas[s.voz].duracao * 30) + VOICE_DELAY > s.frames).map((s) => s.id);
