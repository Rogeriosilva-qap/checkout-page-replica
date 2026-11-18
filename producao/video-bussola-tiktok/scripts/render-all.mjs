// Prepara assets, renderiza as duas versões (bio/stories), a capa e copia a versão padrão.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const run = (cmd, args) => execFileSync(cmd, args, { cwd: root, stdio: "inherit" });
const browser = process.env.REMOTION_BROWSER || (fs.existsSync("/opt/pw-browsers") ? path.join(root, "scripts/chrome-proxy.sh") : null);
const b = browser ? [`--browser-executable=${browser}`] : [];

run("node", ["scripts/prepare.mjs"]);
for (const cta of ["bio", "stories"]) {
  run("npx", ["remotion", "render", "src/index.ts", "BussolaTikTok", `out/video-bussola-tiktok-${cta}.mp4`,
    `--props=${JSON.stringify({ cta })}`, "--codec=h264", "--crf=18", "--audio-codec=aac", "--audio-bitrate=192k", ...b]);
}
fs.copyFileSync(path.join(root, "out/video-bussola-tiktok-bio.mp4"), path.join(root, "out/video-bussola-tiktok.mp4"));
run("npx", ["remotion", "still", "src/index.ts", "BussolaTikTok", "out/capa-tiktok.png", "--frame=30", ...b]);
console.log("\nArquivos em out/: video-bussola-tiktok.mp4 (bio), video-bussola-tiktok-bio.mp4, video-bussola-tiktok-stories.mp4, capa-tiktok.png, legendas.srt, legendas-stories.srt");
const avisos = path.join(root, ".cache/avisos.txt");
if (fs.existsSync(avisos) && fs.readFileSync(avisos, "utf8").trim()) console.log(fs.readFileSync(avisos, "utf8"));
