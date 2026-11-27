// Figurinhas de WhatsApp (512×512, fundo transparente) no estilo "patch tático" da Operação Aprovação.
// Uso: node tools/gerar.mjs  → png/*.png e webp/*.webp (WebP é convertido em tools/webp.py)
import { createRequire } from "module";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SELO = "data:image/png;base64," + fs.readFileSync(path.join(ROOT, "assets/selo.png")).toString("base64");

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
html,body{width:512px;height:512px;background:transparent;overflow:hidden;font-family:Inter,sans-serif}
.st{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}
/* contorno branco de figurinha + sombra */
.patch{position:relative;background:#0E0E11;border:6px solid #E3192B;border-radius:34px;
  box-shadow:0 0 0 12px #fff, 0 10px 18px 12px rgba(0,0,0,.35);overflow:hidden;
  display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;color:#fff}
.patch::before{content:"";position:absolute;inset:0;opacity:.9;
  background:linear-gradient(#1C1C22 2px,transparent 2px) -1px -1px/36px 36px,linear-gradient(90deg,#1C1C22 2px,transparent 2px) -1px -1px/36px 36px;z-index:0}
.patch>*{position:relative;z-index:1}
.stripe{position:absolute;left:0;right:0;top:0;height:16px;background:#E3192B;z-index:1}
.big{font-weight:900;letter-spacing:-.04em;line-height:.9;text-transform:uppercase}
.hit{color:#E3192B;font-style:italic;padding-right:.05em}
.mono{font-family:"JetBrains Mono",monospace;font-weight:800;letter-spacing:2px}
.sig{display:flex;align-items:center;gap:8px;margin-top:14px}
.sig img{width:46px;height:46px}
.sig span{font-family:"JetBrains Mono",monospace;font-weight:800;font-size:17px;letter-spacing:1.5px;color:#fff}
.corner{position:absolute;width:30px;height:30px;border-color:#E3192B;border-style:solid;z-index:1}
`;
const corners = `<div class="corner" style="left:18px;top:28px;border-width:6px 0 0 6px"></div><div class="corner" style="right:18px;top:28px;border-width:6px 6px 0 0"></div>
<div class="corner" style="left:18px;bottom:18px;border-width:0 0 6px 6px"></div><div class="corner" style="right:18px;bottom:18px;border-width:0 6px 6px 0"></div>`;
const sig = `<div class="sig"><img src="${SELO}"><span>OPERAÇÃO APROVAÇÃO</span></div>`;
const page = (inner, rot = 0) => `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body><div class="st"><div style="transform:rotate(${rot}deg)">${inner}</div></div></body></html>`;

// código de rádio grande + significado
const radio = (code, mean, rot) => page(`<div class="patch" style="width:440px;height:380px"><div class="stripe"></div>${corners}
  <div class="mono" style="font-size:22px;color:#A7A7AD;margin-top:8px">● CANAL ABERTO</div>
  <div class="big" style="font-size:168px;margin-top:4px">${code}</div>
  <div class="big" style="font-size:40px;color:#E3192B;font-style:italic;margin-top:2px">${mean}</div>${sig}</div>`, rot);

const STICKERS = {
  "01-qap-na-escuta": radio("QAP", "na escuta", -3),
  "02-qsl-entendido": radio("QSL", "entendido!", 2),
  "03-tks-obrigado": radio("TKS", "valeu!", -2),
  "04-missao-dada": page(`<div class="patch" style="width:450px;height:400px;padding:0 24px"><div class="stripe"></div>${corners}
    <div class="big" style="font-size:72px">Missão<br>dada,</div>
    <div class="big" style="font-size:72px;margin-top:8px"><span class="hit">missão<br>cumprida</span></div>${sig}</div>`, -3),
  "05-foco-na-missao": page(`<div class="patch" style="width:440px;height:390px"><div class="stripe"></div>${corners}
    <svg width="120" height="120" viewBox="0 0 64 64" style="margin-top:6px"><circle cx="32" cy="32" r="25" fill="none" stroke="#E3192B" stroke-width="5"/><circle cx="32" cy="32" r="13" fill="none" stroke="#fff" stroke-width="5"/><circle cx="32" cy="32" r="4" fill="#E3192B"/><path d="M32 2v12M32 50v12M2 32h12M50 32h12" stroke="#fff" stroke-width="4" stroke-linecap="round"/></svg>
    <div class="big" style="font-size:66px;margin-top:10px">Foco na<br><span class="hit">missão</span></div>${sig}</div>`, 2),
  "06-modo-estudo-on": page(`<div class="patch" style="width:450px;height:360px"><div class="stripe"></div>${corners}
    <div class="mono" style="font-size:24px;color:#A7A7AD">STATUS DO OPERADOR</div>
    <div class="big" style="font-size:78px;margin-top:10px">Modo<br>estudo</div>
    <div style="display:flex;align-items:center;gap:12px;margin-top:12px;background:#E3192B;border-radius:40px;padding:6px 22px 6px 8px">
      <div style="width:40px;height:40px;border-radius:50%;background:#fff"></div><span class="big" style="font-size:40px">ON</span></div>${sig}</div>`, -2),
  "07-bora-pra-cima": page(`<div class="patch" style="width:440px;height:380px"><div class="stripe"></div>${corners}
    <svg width="110" height="90" viewBox="0 0 64 52" style="margin-top:4px"><path d="M6 44l18-18 10 10L58 12" fill="none" stroke="#E3192B" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><path d="M42 10h17v17" fill="none" stroke="#E3192B" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>
    <div class="big" style="font-size:80px;margin-top:8px">Bora pra<br><span class="hit">cima!</span></div>${sig}</div>`, 3),
  "08-selo": page(`<div style="width:420px;height:420px;border-radius:50%;box-shadow:0 0 0 12px #fff,0 10px 18px 12px rgba(0,0,0,.35);background:#0E0E11"><img src="${SELO}" style="width:420px;height:420px;display:block"></div>`),
};

const out = (d) => { const p = path.join(ROOT, d); fs.mkdirSync(p, { recursive: true }); return p; };
const browser = await chromium.launch();
const pg = await browser.newPage({ viewport: { width: 512, height: 512 }, deviceScaleFactor: 1 });
for (const [name, html] of Object.entries(STICKERS)) {
  await pg.setContent(html, { waitUntil: "load" });
  await pg.evaluate(() => document.fonts.ready);
  await pg.screenshot({ path: path.join(out("png"), `${name}.png`), omitBackground: true });
}
await browser.close();
console.log(`${Object.keys(STICKERS).length} figurinhas em png/`);
