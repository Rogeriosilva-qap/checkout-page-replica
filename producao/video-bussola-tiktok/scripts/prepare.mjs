// Verifica os arquivos de public/, gera narração/legendas/trilha quando necessário
// e grava src/data/assets.json (lido pelo vídeo).
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const pub = (p) => path.join(root, "public", p);
const has = (p) => fs.existsSync(pub(p));
const run = (cmd, args) => execFileSync(cmd, args, { cwd: root, stdio: "inherit" });

const avisos = [];
const narracaoUsuario = has("narracao.mp3");
const dataDir = path.join(root, "src/data");
fs.mkdirSync(dataDir, { recursive: true });
const narr = path.join(dataDir, "narracao.json");
if (!narracaoUsuario) {
  if (!has("voz/narracao.json")) {
    console.log("› public/narracao.mp3 ausente: gerando narração no ElevenLabs…");
    run("python3", ["scripts/elevenlabs.py", "--velocidade", "1.2"]);
  }
  if (!fs.existsSync(narr) || fs.statSync(narr).mtimeMs < fs.statSync(pub("voz/narracao.json")).mtimeMs) {
    run("python3", ["scripts/processa_voz.py"]);
  }
} else {
  avisos.push("Usando public/narracao.mp3 (do autor): legendas distribuídas pelo tempo de cada cena.");
  if (!fs.existsSync(narr)) fs.writeFileSync(narr, JSON.stringify({ cenas: {} }));
}
const assets = {
  selo: has("selo.png"),
  capa: has("capa-guia.png"),
  narracaoUsuario,
  musica: has("musica.mp3") ? "musica.mp3" : "trilha-original.wav",
  sfx: true,
};
if (!assets.selo) avisos.push("public/selo.png ausente: usando substituto (círculo vermelho 'OA').");
if (!assets.capa) avisos.push("public/capa-guia.png ausente: usando substituto (retângulo escuro com o título).");
fs.writeFileSync(path.join(dataDir, "assets.json"), JSON.stringify(assets, null, 1));

run("npx", ["tsx", "scripts/export-timeline.ts"]);
if (!has("musica.mp3") || !has("sfx/glitch.wav")) run("python3", ["scripts/trilha.py"]);
if (has("musica.mp3")) avisos.push("Usando public/musica.mp3 como trilha.");
for (const a of avisos) console.log("AVISO:", a);
fs.writeFileSync(path.join(root, ".cache/avisos.txt"), avisos.join("\n"));
