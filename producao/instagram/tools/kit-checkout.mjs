// Imagens do checkout do Kit na Kirvano: banner 1200×328, banner 719×292 e bloco 461×600.
import { createRequire } from "module";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const b64 = (f, t) => `data:${t};base64,` + fs.readFileSync(path.join(ROOT, "assets", f)).toString("base64");
const CIBER = b64("capa-guia.png", "image/png"), PROMPTS = b64("capa-prompts.jpg", "image/jpeg"), SELO = b64("selo.png", "image/png");
const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{width:var(--w);height:var(--h);overflow:hidden;font-family:Inter,sans-serif;color:#fff;position:relative;
background:radial-gradient(ellipse 60% 80% at 75% 55%,rgba(227,25,43,.25),rgba(227,25,43,0) 70%),
linear-gradient(#1C1C22 2px,transparent 2px) -1px -1px/48px 48px,linear-gradient(90deg,#1C1C22 2px,transparent 2px) -1px -1px/48px 48px,#0E0E11}
.top{position:absolute;left:0;right:0;top:0;height:6px;background:#E3192B}
.mono{font-family:"JetBrains Mono",monospace;font-weight:700;letter-spacing:1.5px}
.hit{color:#E3192B;font-style:italic}
h1{font-weight:900;text-transform:uppercase;letter-spacing:-.04em;line-height:.95}
.cv img{aspect-ratio:640/908;object-fit:cover;border-radius:4px;box-shadow:0 20px 44px rgba(0,0,0,.75),0 0 40px rgba(227,25,43,.3)}
.chip{display:inline-block;border:2px solid #E3192B;border-radius:6px;padding:4px 10px}
.it{display:flex;gap:10px;align-items:flex-start;background:#16161B;border:1px solid #2A2A32;border-left:6px solid #E3192B;border-radius:8px;padding:10px 12px;margin-bottom:8px}
.it b{display:block;font-weight:900;font-size:17px;line-height:1.15}.it span{display:block;color:#A7A7AD;font-size:14px;line-height:1.28;margin-top:2px}
.ck{color:#E3192B;font-weight:900;font-size:20px;line-height:1}`;
const page = (w, h, inner) => `<!doctype html><html><head><meta charset="utf-8"><style>:root{--w:${w}px;--h:${h}px}${CSS}</style></head><body><div class="top"></div>${inner}</body></html>`;
const covers = (w, gap, rot = 5) => `<div class="cv" style="display:flex;gap:${gap}px"><img src="${CIBER}" style="width:${w}px;transform:rotate(-${rot}deg)"><img src="${PROMPTS}" style="width:${w}px;transform:rotate(${rot}deg)"></div>`;

const JOBS = {
  "checkout-banner-1200x328": [1200, 328, `
    <div style="position:absolute;left:56px;top:46px;width:640px">
      <div style="display:flex;align-items:center;gap:10px"><img src="${SELO}" style="width:42px"><span class="mono" style="font-size:16px">OPERAÇÃO APROVAÇÃO</span></div>
      <h1 style="font-size:58px;margin-top:14px">Kit Concurseiro<br><span class="hit">Policial com IA</span></h1>
      <div class="mono" style="font-size:16px;margin-top:16px;color:#d8d8de">2 E-BOOKS PELO PREÇO DE 1 · TODOS OS BÔNUS</div></div>
    <div style="position:absolute;right:70px;top:34px">${covers(176, 22)}</div>`],
  "checkout-banner-719x292": [719, 292, `
    <div style="position:absolute;left:30px;top:30px;width:380px">
      <div style="display:flex;align-items:center;gap:8px"><img src="${SELO}" style="width:34px"><span class="mono" style="font-size:12px">OPERAÇÃO APROVAÇÃO</span></div>
      <h1 style="font-size:42px;margin-top:12px">Kit Concurseiro<br><span class="hit">Policial com IA</span></h1>
      <div class="mono" style="font-size:12px;margin-top:14px;color:#d8d8de;line-height:1.5">2 E-BOOKS PELO PREÇO DE 1<br>+ TODOS OS BÔNUS</div></div>
    <div style="position:absolute;right:28px;top:36px">${covers(130, 14)}</div>`],
  "checkout-bloco-461x600": [461, 600, `
    <div style="position:absolute;left:22px;right:22px;top:26px">
      <div class="mono" style="font-size:13px;color:#E3192B">// O QUE VOCÊ RECEBE</div>
      <h1 style="font-size:34px;margin:6px 0 14px">2 e-books pelo<br><span class="hit">preço de 1</span></h1>
      <div class="it"><span class="ck">✓</span><div><b>Guia do Concurseiro Policial Cibernético</b><span>Método Bússola, 22 comandos prontos e caderno de erros automatizado</span></div></div>
      <div class="it"><span class="ck">✓</span><div><b>IA para Concursos Policiais</b><span>60 prompts + biblioteca resumida em PDF separado</span></div></div>
      <div class="it"><span class="ck">✓</span><div><b>Todos os bônus</b><span>NotebookLM, roteiro de 7 dias, checklist de conferência e índice por necessidade</span></div></div>
      <div class="it" style="background:rgba(227,25,43,.12);border-color:#E3192B"><span class="ck">★</span><div><b>Desconto na plataforma de simulados</b><span>Exclusivo para quem compra o kit, no lançamento</span></div></div>
      <div class="mono" style="font-size:12px;color:#d8d8de;text-align:center;margin-top:10px;line-height:1.5">🔒 GARANTIA DE 7 DIAS<br>ACESSO NO CELULAR E NO PC</div>
    </div>`],
};
const out = path.join(ROOT, "kit");
const browser = await chromium.launch();
const pg = await browser.newPage();
for (const [name, [w, h, inner]] of Object.entries(JOBS)) {
  await pg.setViewportSize({ width: w, height: h });
  await pg.setContent(page(w, h, inner), { waitUntil: "load" });
  await pg.evaluate(() => document.fonts.ready);
  await pg.screenshot({ path: path.join(out, `${name}.png`) });
  console.log(name);
}
await browser.close();
