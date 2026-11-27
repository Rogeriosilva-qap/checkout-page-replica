// Imagens da Comunidade de WhatsApp "Missão Goiás 2027": ícones (círculo seguro) e banner de boas-vindas.
import { createRequire } from "module";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SELO = "data:image/png;base64," + fs.readFileSync(path.join(ROOT, "assets/selo.png")).toString("base64");
const BG = `radial-gradient(ellipse 60% 55% at 50% 50%,rgba(227,25,43,.22),rgba(227,25,43,0) 70%),
 linear-gradient(#1C1C22 2px,transparent 2px) -1px -1px/64px 64px,linear-gradient(90deg,#1C1C22 2px,transparent 2px) -1px -1px/64px 64px,#0E0E11`;
const base = (w, h, inner) => `<!doctype html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0;padding:0}body{width:${w}px;height:${h}px;overflow:hidden;font-family:Inter,sans-serif;color:#fff;background:${BG}}
.mono{font-family:"JetBrains Mono",monospace;font-weight:700;letter-spacing:2px}h1{font-weight:900;text-transform:uppercase;letter-spacing:-.04em;line-height:.92}
.hit{color:#E3192B;font-style:italic;padding-right:.04em}.red{color:#E3192B}.gray{color:#A7A7AD}
</style></head><body>${inner}</body></html>`;

// Ícone: tudo dentro do círculo central (o WhatsApp recorta em círculo).
const icone = (sub) => base(1080, 1080, `
  <div style="position:absolute;inset:60px;border-radius:50%;border:10px solid #E3192B;box-shadow:0 0 80px rgba(227,25,43,.35),inset 0 0 80px rgba(227,25,43,.12)"></div>
  <div style="position:absolute;left:0;right:0;top:150px;display:flex;justify-content:center"><img src="${SELO}" style="width:250px"></div>
  <div style="position:absolute;left:0;right:0;top:430px;text-align:center"><h1 style="font-size:132px">Missão<br><span class="hit">Goiás</span></h1></div>
  <div style="position:absolute;left:0;right:0;top:700px;text-align:center;font-weight:900;font-size:96px;letter-spacing:-3px">2027</div>
  <div class="mono" style="position:absolute;left:0;right:0;top:830px;text-align:center;font-size:40px;color:${sub ? "#fff" : "#A7A7AD"}">${sub ?? "PMGO · PCGO"}</div>`);

// Banner de boas-vindas (para a mensagem fixada e a descrição).
const banner = base(1080, 1350, `
  <div style="position:absolute;left:0;right:0;top:0;height:10px;background:#E3192B"></div>
  <div style="position:absolute;left:0;right:0;top:90px;display:flex;justify-content:center"><img src="${SELO}" style="width:190px"></div>
  <div class="mono red" style="position:absolute;left:0;right:0;top:320px;text-align:center;font-size:30px">// GRUPO DE ESTUDOS GRATUITO</div>
  <div style="position:absolute;left:0;right:0;top:380px;text-align:center"><h1 style="font-size:150px">Missão<br><span class="hit">Goiás 2027</span></h1></div>
  <div style="position:absolute;left:0;right:0;top:720px;display:flex;justify-content:center;gap:16px">${["PMGO", "PCGO", "ESTILO AOCP"].map((t) => `<span class="mono" style="font-size:34px;border:3px solid #E3192B;border-radius:8px;padding:12px 22px">${t}</span>`).join("")}</div>
  <div style="position:absolute;left:110px;right:110px;top:860px;font-weight:800;font-size:40px;line-height:1.55">
    ✅ Questão do Dia às 12h<br>✅ Gabarito comentado às 19h<br>✅ Notícias só com fonte oficial</div>
  <div class="mono gray" style="position:absolute;left:80px;right:80px;top:1215px;text-align:center;font-size:20px;line-height:1.5;letter-spacing:0">Ainda não há edital publicado. Conteúdo educativo, sem vínculo com o Governo de Goiás, PM, PC ou bancas.</div>`);

const out = path.join(ROOT, "goias-2027", "grupo");
fs.mkdirSync(out, { recursive: true });
const jobs = [["icone-comunidade", icone(), 1080, 1080], ["icone-avisos", icone("📢 AVISOS"), 1080, 1080], ["icone-papo-pmgo", icone("💬 PAPO PMGO"), 1080, 1080], ["icone-papo-pcgo", icone("💬 PAPO PCGO"), 1080, 1080], ["banner-boas-vindas", banner, 1080, 1350]];
const browser = await chromium.launch();
for (const [nome, html, w, h] of jobs) {
  const pg = await browser.newPage({ viewport: { width: w, height: h } });
  await pg.setContent(html, { waitUntil: "load" });
  await pg.evaluate(() => document.fonts.ready);
  await pg.screenshot({ path: path.join(out, `${nome}.png`) });
  await pg.close();
}
await browser.close();
console.log(`${jobs.length} imagens em goias-2027/grupo/`);
