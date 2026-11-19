// Timelines dos vídeos curtos (patentes e teaser) para a trilha + legendas .srt.
import fs from "node:fs";
import path from "node:path";
import { SCENES_PATENTES } from "../src/patentes/Patentes";
import { SCENES_TEASER } from "../src/patentes/Teaser";
import { SCENES_POR_DENTRO } from "../src/patentes/PorDentro";
import pdn from "../src/data/narracao-por-dentro.json";
import { SCENES_CORRECAO } from "../src/patentes/Correcao";
import cor from "../src/data/narracao-correcao.json";
import { buildCaps, overflow, starts, total, Narr, Scene } from "../src/kit";
import pat from "../src/data/narracao-patentes.json";
import tea from "../src/data/narracao-teaser.json";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const ts = (t: number) => {
  const ms = Math.round(t * 1000), p = (n: number, l = 2) => String(n).padStart(l, "0");
  return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`;
};
for (const [nome, scenes, narr] of [["patentes", SCENES_PATENTES, pat], ["teaser", SCENES_TEASER, tea], ["por-dentro", SCENES_POR_DENTRO, pdn], ["correcao", SCENES_CORRECAO, cor]] as [string, Scene[], Narr][]) {
  const st = starts(scenes);
  fs.mkdirSync(path.join(root, ".cache"), { recursive: true });
  fs.writeFileSync(path.join(root, `.cache/timeline-${nome}.json`), JSON.stringify({ total: total(scenes) / 30, scenes: scenes.map((s, i) => ({ id: s.id, start: st[i] / 30, frames: s.frames })) }));
  const srt = buildCaps(scenes, narr, []).map((c, i) => `${i + 1}\n${ts(c.from)} --> ${ts(c.to)}\n${c.words.map((w) => w.text).join(" ")}\n`).join("\n");
  fs.writeFileSync(path.join(root, `out/legendas-${nome}.srt`), srt);
  const o = overflow(scenes, narr);
  console.log(`${nome}: ${total(scenes)} frames (${(total(scenes) / 30).toFixed(2)} s)${o.length ? " · ATENÇÃO, fala maior que a cena: " + o.join(", ") : ""}`);
}
