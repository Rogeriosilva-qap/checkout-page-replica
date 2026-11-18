// Legendas estilo TikTok (2 a 4 palavras), geradas da narração palavra por palavra.
// Sem React: usado pelo vídeo e pelo gerador do .srt.
import narracao from "./data/narracao.json";
import assets from "./data/assets.json";
import { FPS, SCENES, VOICE_DELAY, vozDaCena } from "./timing";

export type Cta = "bio" | "stories";
export type Word = { text: string; start: number; end: number; key: boolean };
export type Caption = { words: Word[]; from: number; to: number; cena: string };

/** palavras-chave em vermelho (comparação sem acento e sem pontuação) */
const KEYS = ["204", "comecar", "bussola", "extrai", "micro-topicos", "alfa", "semana", "confere", "22", "comandos"];

const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "");

type Cena = { duracao: number; texto: string; palavras: { text: string; start: number; end: number }[] };
const CENAS = (narracao as { cenas: Record<string, Cena> }).cenas;

/** sem tempos por palavra (narração fornecida pelo autor): distribui as palavras pela cena */
const evenWords = (texto: string, dur: number) => {
  const ws = texto.split(/\s+/);
  const total = ws.reduce((a, w) => a + w.length + 1, 0);
  let t = 0;
  return ws.map((w) => {
    const d = ((w.length + 1) / total) * dur;
    const o = { text: w, start: t, end: t + d * 0.9 };
    t += d;
    return o;
  });
};

export const buildCaptions = (cta: Cta): Caption[] => {
  const out: Caption[] = [];
  let sceneFrom = 0;
  for (const s of SCENES) {
    const vid = vozDaCena(s.voz, cta);
    const c = CENAS[vid];
    const base = (sceneFrom + VOICE_DELAY) / FPS;
    const raw =
      assets.narracaoUsuario || !c
        ? evenWords(c?.texto ?? "", (s.frames - VOICE_DELAY - 6) / FPS)
        : c.palavras;
    const words: Word[] = raw.map((w) => ({
      text: w.text,
      start: base + w.start,
      end: base + w.end,
      key: KEYS.includes(norm(w.text)),
    }));
    // agrupa: até 4 palavras / 20 caracteres, quebra em pontuação; mínimo 2 quando possível
    let cur: Word[] = [];
    const flush = () => {
      if (!cur.length) return;
      out.push({ words: cur, from: cur[0].start, to: cur[cur.length - 1].end, cena: s.id });
      cur = [];
    };
    words.forEach((w, i) => {
      cur.push(w);
      const next = words[i + 1];
      if (!next) return;
      const chars = cur.map((x) => x.text).join(" ").length;
      const punct = /[.,:;!?]$/.test(w.text);
      const withNext = chars + 1 + next.text.length;
      const nextIsLastAlone = i + 1 === words.length - 1 || /[.!?]$/.test(next.text);
      if (cur.length >= 4 || (punct && cur.length >= 2) || withNext > 20) {
        // não deixa uma palavra curta sozinha no fim da frase, se couber
        if (!punct && nextIsLastAlone && withNext <= 22 && cur.length < 4) return;
        flush();
      }
    });
    flush();
    sceneFrom += s.frames;
  }
  // cada legenda fica até a próxima entrar (máx. 0,5 s depois da última palavra)
  for (let i = 0; i < out.length; i++) {
    const nxt = out[i + 1];
    out[i].to = nxt ? Math.min(nxt.from, out[i].to + 0.5) : out[i].to + 0.6;
  }
  return out;
};

/** intervalos (em segundos) em que há voz — usados para abaixar a trilha */
export const speechSpans = (cta: Cta): [number, number][] => {
  const spans: [number, number][] = [];
  let f = 0;
  for (const s of SCENES) {
    const c = CENAS[vozDaCena(s.voz, cta)];
    if (c) spans.push([(f + VOICE_DELAY) / FPS, (f + VOICE_DELAY) / FPS + c.duracao]);
    f += s.frames;
  }
  return spans;
};

/** confere se alguma fala passa do fim da própria cena */
export const overflowReport = (cta: Cta) => {
  const msgs: string[] = [];
  for (const s of SCENES) {
    const c = CENAS[vozDaCena(s.voz, cta)];
    if (!c) continue;
    const need = Math.ceil(c.duracao * FPS) + VOICE_DELAY;
    if (need > s.frames) msgs.push(`${s.id}: fala precisa de ${need} frames, cena tem ${s.frames}`);
  }
  return msgs;
};

/** frame (relativo ao início da cena) em que a palavra é dita; fallback = fração da cena */
export const wordFrame = (voz: string, needle: string, fallback = 0.5, sceneFramesN = 90): number => {
  const c = CENAS[voz];
  if (!c || assets.narracaoUsuario) return Math.round(sceneFramesN * fallback);
  const w = c.palavras.find((p) => norm(p.text).startsWith(norm(needle)));
  return w ? Math.round(w.start * FPS) + VOICE_DELAY : Math.round(sceneFramesN * fallback);
};
