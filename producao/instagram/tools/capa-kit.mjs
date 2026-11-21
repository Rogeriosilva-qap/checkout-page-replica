// Capa do produto "Kit Concurseiro Policial com IA" para a Kirvano (quadrada 1080×1080).
import { createRequire } from "module";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const b64 = (f, t) => `data:${t};base64,` + fs.readFileSync(path.join(ROOT, "assets", f)).toString("base64");
const CIBER = b64("capa-guia.png", "image/png"), PROMPTS = b64("capa-prompts.jpg", "image/jpeg"), SELO = b64("selo.png", "image/png");
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1080px;overflow:hidden;font-family:Inter,sans-serif;color:#fff;position:relative;
background:radial-gradient(ellipse 70% 50% at 50% 58%,rgba(227,25,43,.28),rgba(227,25,43,0) 70%),
linear-gradient(#1C1C22 2px,transparent 2px) -1px -1px/72px 72px,linear-gradient(90deg,#1C1C22 2px,transparent 2px) -1px -1px/72px 72px,#0E0E11}
.top{position:absolute;left:0;right:0;top:0;height:10px;background:#E3192B}
.c{position:absolute;width:64px;height:64px}.c::before,.c::after{content:"";position:absolute;background:#E3192B;left:0;top:0}
.c::before{width:64px;height:8px}.c::after{width:8px;height:64px}
.tl{left:28px;top:36px}.tr{right:28px;top:36px;transform:rotate(90deg)}.br{right:28px;bottom:28px;transform:rotate(180deg)}.bl{left:28px;bottom:28px;transform:rotate(270deg)}
.mono{font-family:"JetBrains Mono",monospace;font-weight:700;letter-spacing:2px}
h1{font-weight:900;text-transform:uppercase;letter-spacing:-.04em;line-height:.92;text-align:center}
.hit{color:#E3192B;font-style:italic}
.covers{position:absolute;left:0;right:0;top:400px;display:flex;justify-content:center;gap:34px}
.covers img{width:300px;aspect-ratio:640/908;object-fit:cover;border-radius:6px;box-shadow:0 36px 80px rgba(0,0,0,.75),0 0 60px rgba(227,25,43,.35)}
.badge{position:absolute;right:120px;top:350px;width:170px;height:170px;border-radius:50%;background:#E3192B;display:flex;flex-direction:column;align-items:center;justify-content:center;transform:rotate(10deg);box-shadow:0 14px 40px rgba(0,0,0,.6);border:5px solid #fff}
</style></head><body><div class="top"></div><div class="c tl"></div><div class="c tr"></div><div class="c br"></div><div class="c bl"></div>
<div style="position:absolute;left:0;right:0;top:78px;display:flex;justify-content:center;align-items:center;gap:14px">
 <img src="${SELO}" style="width:64px"><span class="mono" style="font-size:24px">OPERAÇÃO APROVAÇÃO</span></div>
<div style="position:absolute;left:0;right:0;top:170px"><h1 style="font-size:84px">Kit Concurseiro<br><span class="hit">Policial com IA</span></h1></div>
<div class="covers"><img src="${CIBER}" style="transform:rotate(-5deg)"><img src="${PROMPTS}" style="transform:rotate(5deg)"></div>
<div class="badge"><span style="font-weight:900;font-size:62px;line-height:.9">2</span><span class="mono" style="font-size:17px;letter-spacing:1px;text-align:center;line-height:1.2">E-BOOKS<br>+ BÔNUS</span></div>
<div class="mono" style="position:absolute;left:0;right:0;bottom:70px;text-align:center;font-size:24px;color:#d8d8de">MÉTODO BÚSSOLA · 60 PROMPTS · BÔNUS</div>
</body></html>`;
const out = path.join(ROOT, "kit", "capa-produto-kit.png");
const browser = await chromium.launch();
const pg = await browser.newPage({ viewport: { width: 1080, height: 1080 } });
await pg.setContent(html, { waitUntil: "load" });
await pg.evaluate(() => document.fonts.ready);
await pg.screenshot({ path: out });
await browser.close();
console.log(out);
