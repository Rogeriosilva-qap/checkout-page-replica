// Carrossel "Goiás sinalizou concurso na segurança para 2027": como foi o último da PMGO e por onde começar (7 slides, 1080×1350).
// Dados: declarações do governador (24/11/2026) e edital PMGO 2022 (AOCP). Confira sempre o edital oficial.
import { createRequire } from "module";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SELO = "data:image/png;base64," + fs.readFileSync(path.join(ROOT, "assets/selo.png")).toString("base64");
const W = 1080, H = 1350;
const CSS = `*{box-sizing:border-box;margin:0;padding:0}
body{width:${W}px;height:${H}px;overflow:hidden;font-family:Inter,sans-serif;color:#fff;
 background:radial-gradient(ellipse 75% 45% at 50% 50%,rgba(227,25,43,.15),rgba(227,25,43,0) 70%),
 linear-gradient(#1C1C22 2px,transparent 2px) -1px -1px/72px 72px,linear-gradient(90deg,#1C1C22 2px,transparent 2px) -1px -1px/72px 72px,#0E0E11}
.top{position:absolute;left:0;right:0;top:0;height:8px;background:#E3192B}
.c{position:absolute;width:64px;height:64px}.c::before,.c::after{content:"";position:absolute;background:#E3192B;left:0;top:0}
.c::before{width:64px;height:8px}.c::after{width:8px;height:64px}
.tl{left:28px;top:34px}.tr{right:28px;top:34px;transform:rotate(90deg)}.br{right:28px;bottom:28px;transform:rotate(180deg)}.bl{left:28px;bottom:28px;transform:rotate(270deg)}
.mono{font-family:"JetBrains Mono",monospace;font-weight:700;letter-spacing:1px}
.red{color:#E3192B}.gray{color:#A7A7AD}.hit{color:#E3192B;font-style:italic;padding-right:.05em}
h1{font-weight:900;text-transform:uppercase;letter-spacing:-.04em;line-height:.95}
.w{position:absolute;left:80px;right:80px}
.tag{display:inline-block;font-family:"JetBrains Mono",monospace;font-weight:700;font-size:24px;color:#fff;padding:8px 14px;border-radius:8px 8px 0 0}
.game{background:#16161B;border:3px solid #3a3a44;border-radius:0 12px 12px 12px;padding:28px 32px;font-weight:700;font-size:44px;line-height:1.28}
.law{background:#16161B;border:3px solid #E3192B;border-radius:0 12px 12px 12px;padding:26px 30px}
.trap{background:rgba(227,25,43,.10);border:3px dashed #E3192B;border-radius:12px;padding:26px 30px;font-weight:600;font-size:37px;line-height:1.35}
.trap b{color:#fff;font-weight:900}
.stars{position:absolute;right:96px;top:96px;font-size:40px;letter-spacing:4px}
.disc{font-family:"JetBrains Mono",monospace;font-size:18px;color:#A7A7AD;line-height:1.4}
.CSSX{}

.card{background:#16161B;border:2px solid #2A2A32;border-left:8px solid #E3192B;border-radius:10px;padding:24px 28px;margin-bottom:16px}
.card b{display:block;font-weight:900;font-size:44px;letter-spacing:-1px;line-height:1.05}.card span{display:block;color:#A7A7AD;font-size:32px;line-height:1.3;margin-top:8px}
.big{font-weight:900;font-size:72px;color:#E3192B;font-style:italic;letter-spacing:-2px;line-height:1}
.pg{position:absolute;right:96px;top:104px;font-family:"JetBrains Mono",monospace;font-weight:700;font-size:24px;color:#A7A7AD}
.btn{display:flex;align-items:center;justify-content:center;background:#E3192B;border-radius:12px;font-weight:900;letter-spacing:-1px;color:#fff;box-shadow:0 0 40px rgba(227,25,43,.45)}`;

const page = (inner) => `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head>
<body><div class="top"></div><div class="c tl"></div><div class="c tr"></div><div class="c br"></div><div class="c bl"></div>${inner}</body></html>`;
const P = (inner, n) => page(`${inner}${n ? `<div class="pg">${n}/07</div>` : ""}`);
const lbl = (t) => `<div class="w mono red" style="top:104px;font-size:28px">${t}</div>`;

const bar = (nome, q, peso, pts, pct, cor) => `<div style="margin-bottom:26px"><div style="display:flex;justify-content:space-between;font-weight:800;font-size:34px"><span>${nome}</span><span class="mono" style="font-size:30px;color:${cor}">${pts} pts</span></div>
  <div class="mono gray" style="font-size:22px;margin:6px 0 10px">${q} questões × peso ${peso}</div>
  <div style="height:34px;background:#1f1f26;border-radius:6px;overflow:hidden"><div style="width:${pct}%;height:100%;background:${cor}"></div></div></div>`;
const SLIDES = [
  P(`${lbl("// GOIÁS · SEGURANÇA PÚBLICA")}
    <div class="w" style="top:180px"><h1 style="font-size:100px">Goiás sinalizou<br>concurso na<br>segurança para <span class="hit">2027</span></h1></div>
    <div class="w" style="top:760px;font-weight:800;font-size:46px;line-height:1.25">Veja como foi o último da <span class="red">PMGO</span><br>e por onde começar agora.</div>
    <div class="w" style="top:1000px;display:flex;gap:12px">${["PMGO", "PCGO", "AOCP"].map((t) => `<span class="mono" style="font-size:30px;border:3px solid #E3192B;border-radius:8px;padding:10px 18px">${t}</span>`).join("")}</div>
    <div class="w mono" style="top:1150px;font-size:30px">ARRASTA E SALVA →</div>`),
  P(`${lbl("// O QUE FOI DITO")}
    <div class="w" style="top:160px"><h1 style="font-size:84px">Fato x <span class="hit">o que falta</span></h1></div>
    <div class="w" style="top:380px">
      <div class="card"><b>✅ Sinal do governo</b><span>O governador Daniel Vilela sinalizou ampliação do efetivo da segurança pública.</span></div>
      <div class="card"><b>📅 Quando</b><span>Os anúncios ficaram para o início de 2027.</span></div>
      <div class="card" style="border-left-color:#6b6b75"><b>❓ Ainda não divulgado</b><span>Quais corporações, quantas vagas, banca e datas. Sem edital por enquanto.</span></div></div>
    <div class="w disc" style="top:1190px">Declaração noticiada em 24/11/2026. Acompanhe as fontes oficiais do Governo de Goiás.</div>`, "02"),
  P(`${lbl("// O ÚLTIMO CONCURSO · 2022")}
    <div class="w" style="top:160px"><h1 style="font-size:84px">Como foi a <span class="hit">PMGO</span></h1></div>
    <div class="w" style="top:360px;display:grid;grid-template-columns:1fr 1fr;gap:16px">
      ${[["1.670", "vagas no total"], ["1.500", "Soldado Combatente"], ["AOCP", "banca organizadora"], ["50", "questões + redação"]].map(([n, t]) => `<div class="card" style="margin:0"><div class="big" style="font-size:80px">${n}</div><span>${t}</span></div>`).join("")}</div>
    <div class="w" style="top:850px"><div class="card" style="border-left-color:#6b6b75"><b style="font-size:38px">E a PCGO?</b><span>Último concurso também em 2022, pelo AOCP, com cerca de 860 vagas para Agente, Escrivão, Papiloscopista e Delegado.</span></div></div>`, "03"),
  P(`${lbl("// REQUISITOS NO ÚLTIMO EDITAL · SOLDADO")}
    <div class="w" style="top:160px"><h1 style="font-size:84px">Quem <span class="hit">podia</span> fazer</h1></div>
    <div class="w" style="top:380px">
      <div class="card"><b>🎓 Nível superior</b><span>Em qualquer área de formação.</span></div>
      <div class="card"><b>🎂 18 a 30 anos</b><span>Idade máxima contada na data de publicação do edital.</span></div>
      <div class="card"><b>📏 Altura mínima</b><span>1,65 m para homens e 1,60 m para mulheres.</span></div></div>
    <div class="w" style="top:1040px;font-weight:800;font-size:36px;line-height:1.3">⚠️ Isso pode mudar no próximo edital. <span class="red">Confira quando sair.</span></div>`, "04"),
  P(`${lbl("// ONDE ESTÃO OS PONTOS")}
    <div class="w" style="top:160px"><h1 style="font-size:80px">70 de 85 pontos<br>vêm do <span class="hit">Direito</span></h1></div>
    <div class="w" style="top:460px">
      ${bar("Matérias de Direito", 35, 2, 70, 82, "#E3192B")}
      ${bar("Língua Portuguesa", 10, 1, 10, 12, "#A7A7AD")}
      ${bar("Realidade de Goiás", 5, 1, 5, 6, "#A7A7AD")}</div>
    <div class="w" style="top:1010px;font-weight:700;font-size:34px;line-height:1.35">Para passar na objetiva: <b class="red">60% da nota total</b> e não zerar nenhuma área.</div>
    <div class="w disc" style="top:1190px">Prova de Soldado PMGO 2022 (Instituto AOCP). Direito: Constitucional, Administrativo, Penal, Processo Penal, Penal Militar, Processo Penal Militar e Legislação Extravagante.</div>`, "05"),
  P(`${lbl("// POR ONDE COMEÇAR AGORA")}
    <div class="w" style="top:160px"><h1 style="font-size:74px">Sem edital? <span class="hit">Comece já</span></h1></div>
    <div class="w" style="top:380px">${[["1", "Constitucional e Administrativo", "Lei seca primeiro. É a base de tudo que vem depois."], ["2", "Penal e Processo Penal", "Os assuntos que mais caem em prova policial."], ["3", "Penal Militar e Processo Penal Militar", "Muita gente deixa pro fim. Valem peso 2."], ["4", "Questões AOCP toda semana", "Treine o jeito da banca, não só o conteúdo."]].map(([n, t, x]) => `<div class="card" style="display:flex;gap:22px;align-items:center"><div class="big" style="font-size:64px;width:60px;flex:none">${n}</div><div><b style="font-size:38px">${t}</b><span style="font-size:28px">${x}</span></div></div>`).join("")}</div>
    <div class="w mono gray" style="top:1200px;font-size:24px">Português e Realidade de Goiás: blocos curtos, toda semana.</div>`, "06"),
  P(`<div style="position:absolute;left:0;right:0;top:110px;display:flex;justify-content:center"><img src="${SELO}" style="width:150px"></div>
    <div class="w" style="top:290px;text-align:center"><h1 style="font-size:88px">Missão<br><span class="hit">Goiás 2027</span></h1></div>
    <div class="w" style="top:520px;text-align:center;font-weight:800;font-size:38px;line-height:1.45">Grupo de estudos gratuito para<br>quem mira <span class="red">PMGO e PCGO</span>:<br>questões no estilo AOCP, notícias<br>confirmadas e troca de ideia.</div>
    <div class="w btn" style="top:850px;height:130px;font-size:60px">COMENTE "GOIÁS"</div>
    <div class="w mono" style="top:1010px;text-align:center;font-size:30px">que eu te mando o link do grupo</div>
    <div class="w disc" style="top:1200px;text-align:center">Conteúdo educativo, sem vínculo com o Governo de Goiás ou bancas. Não garantimos aprovação.</div>`, "07"),
];
const out = path.join(ROOT, "goias-2027");
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const pg = await browser.newPage({ viewport: { width: W, height: H } });
for (const [i, html] of SLIDES.entries()) {
  await pg.setContent(html, { waitUntil: "load" });
  await pg.evaluate(() => document.fonts.ready);
  await pg.screenshot({ path: path.join(out, `goias-${String(i + 1).padStart(2, "0")}.png`) });
}
await browser.close();
console.log(`${SLIDES.length} slides em goias-2027/`);
