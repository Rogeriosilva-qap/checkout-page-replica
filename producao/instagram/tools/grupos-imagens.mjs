// Imagens das Comunidades de WhatsApp: ícone (círculo seguro), ícones dos subgrupos e banner de boas-vindas.
// Uso: node tools/grupos-imagens.mjs   (gera para todos os grupos de GRUPOS)
import { createRequire } from "module";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SELO = "data:image/png;base64," + fs.readFileSync(path.join(ROOT, "assets/selo.png")).toString("base64");

const GRUPOS = [
  { pasta: "gcm-goiania", l1: "GCM", l2: "Goiânia", sub: "GUARDA CIVIL", tags: ["GCM", "GOIÂNIA", "GUARDA CIVIL"], papo: "PAPO GCM",
    rodape: "Conteúdo educativo, sem vínculo com a Prefeitura de Goiânia, a Guarda Civil Metropolitana ou bancas." },
  { pasta: "pcmg", l1: "Polícia Civil", l2: "Minas", sub: "PCMG · INVESTIGADOR", tags: ["PCMG", "INVESTIGADOR", "MINAS GERAIS"], papo: "PAPO PCMG",
    rodape: "Ainda não há edital publicado. Conteúdo educativo, sem vínculo com a PCMG, o Governo de Minas ou bancas." },
  { pasta: "pmsp", l1: "PM", l2: "São Paulo", sub: "ALUNO-SOLDADO", tags: ["PM SP", "ALUNO-SOLDADO", "VUNESP"], papo: "PAPO PM SP",
    rodape: "Edital DP-4/321/26: confira prazos no site da Vunesp. Sem vínculo com a PM SP ou a Vunesp." },
];

const BG = `radial-gradient(ellipse 60% 55% at 50% 50%,rgba(227,25,43,.22),rgba(227,25,43,0) 70%),
 linear-gradient(#1C1C22 2px,transparent 2px) -1px -1px/64px 64px,linear-gradient(90deg,#1C1C22 2px,transparent 2px) -1px -1px/64px 64px,#0E0E11`;
const base = (w, h, inner) => `<!doctype html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0;padding:0}body{width:${w}px;height:${h}px;overflow:hidden;font-family:Inter,sans-serif;color:#fff;background:${BG}}
.mono{font-family:"JetBrains Mono",monospace;font-weight:700;letter-spacing:2px}h1{font-weight:900;text-transform:uppercase;letter-spacing:-.04em;line-height:.92}
.hit{color:#E3192B;font-style:italic;padding-right:.04em}.red{color:#E3192B}.gray{color:#A7A7AD}
</style></head><body>${inner}</body></html>`;
// tamanho da fonte para caber na largura útil do círculo
const fit = (t, max, larg) => Math.min(max, Math.floor(larg / (t.length * 0.62)));

const icone = (g, sub) => {
  const s1 = fit(g.l1, 132, 700), s2 = fit(g.l2, 132, 760);
  return base(1080, 1080, `
  <div style="position:absolute;inset:60px;border-radius:50%;border:10px solid #E3192B;box-shadow:0 0 80px rgba(227,25,43,.35),inset 0 0 80px rgba(227,25,43,.12)"></div>
  <div style="position:absolute;left:0;right:0;top:150px;display:flex;justify-content:center"><img src="${SELO}" style="width:240px"></div>
  <div class="mono red" style="position:absolute;left:0;right:0;top:410px;text-align:center;font-size:40px">MISSÃO</div>
  <div style="position:absolute;left:0;right:0;top:470px;text-align:center"><h1 style="font-size:${s1}px">${g.l1}</h1></div>
  <div style="position:absolute;left:0;right:0;top:${470 + s1 * 0.95}px;text-align:center"><h1 style="font-size:${s2}px"><span class="hit">${g.l2}</span></h1></div>
  <div class="mono" style="position:absolute;left:0;right:0;top:830px;text-align:center;font-size:38px;color:${sub ? "#fff" : "#A7A7AD"}">${sub ?? g.sub}</div>`);
};

const banner = (g) => base(1080, 1350, `
  <div style="position:absolute;left:0;right:0;top:0;height:10px;background:#E3192B"></div>
  <div style="position:absolute;left:0;right:0;top:90px;display:flex;justify-content:center"><img src="${SELO}" style="width:190px"></div>
  <div class="mono red" style="position:absolute;left:0;right:0;top:320px;text-align:center;font-size:30px">// GRUPO DE ESTUDOS GRATUITO</div>
  <div style="position:absolute;left:40px;right:40px;top:380px;text-align:center"><h1 style="font-size:${fit("MISSÃO " + g.l1, 140, 1000)}px">Missão ${g.l1}</h1><h1 style="font-size:${fit(g.l2, 150, 1000)}px;margin-top:6px"><span class="hit">${g.l2}</span></h1></div>
  <div style="position:absolute;left:0;right:0;top:730px;display:flex;justify-content:center;gap:16px">${g.tags.map((t) => `<span class="mono" style="font-size:32px;border:3px solid #E3192B;border-radius:8px;padding:12px 20px">${t}</span>`).join("")}</div>
  <div style="position:absolute;left:110px;right:110px;top:870px;font-weight:800;font-size:40px;line-height:1.55">
    ✅ Questão do Dia às 12h<br>✅ Gabarito comentado às 19h<br>✅ Notícias só com fonte oficial</div>
  <div class="mono gray" style="position:absolute;left:80px;right:80px;top:1215px;text-align:center;font-size:20px;line-height:1.5;letter-spacing:0">${g.rodape}</div>`);

const browser = await chromium.launch();
for (const g of GRUPOS) {
  const out = path.join(ROOT, "grupos", g.pasta);
  fs.mkdirSync(out, { recursive: true });
  const jobs = [["icone-comunidade", icone(g), 1080, 1080], ["icone-avisos", icone(g, "📢 AVISOS"), 1080, 1080], ["icone-papo", icone(g, `💬 ${g.papo}`), 1080, 1080], ["banner-boas-vindas", banner(g), 1080, 1350]];
  for (const [nome, html, w, h] of jobs) {
    const pg = await browser.newPage({ viewport: { width: w, height: h } });
    await pg.setContent(html, { waitUntil: "load" });
    await pg.evaluate(() => document.fonts.ready);
    await pg.screenshot({ path: path.join(out, `${nome}.png`) });
    await pg.close();
  }
}
await browser.close();
console.log(`imagens em grupos/{${GRUPOS.map((g) => g.pasta).join(",")}}/`);
