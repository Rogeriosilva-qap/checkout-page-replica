// Exporta os tempos (para a trilha) e gera as legendas .srt das duas versões.
import fs from "node:fs";
import path from "node:path";
import { FPS, SCENES, TOTAL_FRAMES } from "../src/timing";
import { buildCaptions, overflowReport } from "../src/captions";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
let f = 0;
const scenes = SCENES.map((s) => {
  const o = { id: s.id, start: f / FPS, frames: s.frames };
  f += s.frames;
  return o;
});
fs.mkdirSync(path.join(root, ".cache"), { recursive: true });
fs.writeFileSync(path.join(root, ".cache/timeline.json"), JSON.stringify({ total: TOTAL_FRAMES / FPS, scenes }, null, 1));

const ts = (t: number) => {
  const ms = Math.round(t * 1000);
  const p = (n: number, l = 2) => String(n).padStart(l, "0");
  return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`;
};
fs.mkdirSync(path.join(root, "out"), { recursive: true });
for (const cta of ["bio", "stories"] as const) {
  const srt = buildCaptions(cta)
    .map((c, i) => `${i + 1}\n${ts(c.from)} --> ${ts(c.to)}\n${c.words.map((w) => w.text).join(" ")}\n`)
    .join("\n");
  fs.writeFileSync(path.join(root, `out/legendas${cta === "bio" ? "" : "-stories"}.srt`), srt);
  const over = overflowReport(cta);
  if (over.length) console.warn(`[${cta}] ATENÇÃO, fala maior que a cena:\n  ` + over.join("\n  "));
}
console.log(`timeline: ${TOTAL_FRAMES} frames (${(TOTAL_FRAMES / FPS).toFixed(2)} s) · legendas geradas`);
