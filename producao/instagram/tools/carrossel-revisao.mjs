// Carrossel de valor: "Você estuda e esquece? Revisão 24h · 7 dias · 30 dias" (7 slides, 1080×1350).
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
const curve = `<svg width="920" height="420" viewBox="0 0 920 420">
  <path d="M60 20V370H900" fill="none" stroke="#3a3a44" stroke-width="4"/>
  <path d="M60 40 C160 260 300 320 900 345" fill="none" stroke="#6b6b75" stroke-width="8" stroke-dasharray="14 12"/>
  <path d="M60 40 C110 150 150 170 200 175 L200 50 C270 120 320 130 400 135 L400 55 C520 95 620 100 700 102 L700 60 C780 75 850 78 900 80" fill="none" stroke="#E3192B" stroke-width="9" stroke-linejoin="round"/>
  <text x="70" y="405" fill="#A7A7AD" font-family="JetBrains Mono" font-size="22">estudo</text>
  <text x="170" y="405" fill="#fff" font-family="JetBrains Mono" font-size="22">24h</text>
  <text x="370" y="405" fill="#fff" font-family="JetBrains Mono" font-size="22">7d</text>
  <text x="665" y="405" fill="#fff" font-family="JetBrains Mono" font-size="22">30d</text>
  <text x="640" y="320" fill="#A7A7AD" font-family="JetBrains Mono" font-size="22">sem revisão</text>
  <text x="640" y="60" fill="#E3192B" font-family="JetBrains Mono" font-size="22">com revisão</text></svg>`;
const SLIDES = [
  P(`${lbl("// MÉTODO DE ESTUDO")}
    <div class="w" style="top:180px"><h1 style="font-size:104px">Você estuda…<br>e uma semana<br>depois <span class="hit">esqueceu?</span></h1></div>
    <div class="w" style="top:700px;font-weight:800;font-size:48px;line-height:1.2">O problema não é a sua memória.<br><span class="red">É a falta de revisão.</span></div>
    <div class="w" style="top:960px;display:flex;gap:12px">${["24H", "7 DIAS", "30 DIAS"].map((t) => `<span class="mono" style="font-size:30px;border:3px solid #E3192B;border-radius:8px;padding:10px 18px">${t}</span>`).join("")}</div>
    <div class="w mono" style="top:1150px;font-size:30px">ARRASTA E SALVA →</div>`),
  P(`${lbl("// A CURVA DO ESQUECIMENTO")}
    <div class="w" style="top:160px"><h1 style="font-size:72px;line-height:1">Sem revisão, o conteúdo <span class="hit">escapa rápido</span></h1></div>
    <div class="w" style="top:450px">${curve}</div>
    <div class="w" style="top:920px;font-weight:700;font-size:38px;line-height:1.35">A perda é maior <b class="red">nos primeiros dias</b>. Cada revisão no momento certo segura o conteúdo por mais tempo.</div>`, "02"),
  P(`${lbl("// A REGRA")}
    <div class="w" style="top:160px"><h1 style="font-size:96px">24h · 7 dias<br><span class="hit">· 30 dias</span></h1></div>
    <div class="w" style="top:470px">
      <div class="card"><b>1ª revisão · 24 horas</b><span>No dia seguinte ao estudo. É a que mais segura o conteúdo.</span></div>
      <div class="card"><b>2ª revisão · 7 dias</b><span>Uma semana depois, mais rápida: só o que você errou ou hesitou.</span></div>
      <div class="card"><b>3ª revisão · 30 dias</b><span>Um mês depois, para levar o assunto até a prova.</span></div></div>`, "03"),
  P(`${lbl("// COMO REVISAR EM 15 MINUTOS")}
    <div class="w" style="top:160px"><h1 style="font-size:84px">Reler <span class="hit">não</span> é revisar</h1></div>
    <div class="w" style="top:400px">
      <div class="card"><b>❌ Reler o resumo</b><span>Dá sensação de que sabe, mas não testa nada.</span></div>
      <div class="card" style="border-color:#E3192B"><b>✅ Fazer questões</b><span>5 a 10 questões do assunto, no padrão da sua banca.</span></div>
      <div class="card" style="border-color:#E3192B"><b>✅ Explicar sem olhar</b><span>Fale em voz alta ou escreva de memória. Depois confira na fonte.</span></div></div>`, "04"),
  P(`${lbl("// NA PRÁTICA")}
    <div class="w" style="top:160px"><h1 style="font-size:80px">Estudou <span class="hit">segunda?</span></h1></div>
    <div class="w" style="top:330px">${[["SEG · 03", "ESTUDO", "Lei de Execução Penal: regimes e progressão", "#3a3a44"], ["TER · 04", "24H", "15 min · 10 questões do assunto", "#E3192B"], ["SEG · 10", "7 DIAS", "10 min · só as que errou", "#E3192B"], ["QUA · 03", "30 DIAS", "10 min · questões novas do assunto", "#E3192B"]].map(([d, t, x, c]) => `<div class="card" style="display:flex;gap:22px;align-items:center;border-left-color:${c}"><div class="mono" style="font-size:26px;width:150px;flex:none">${d}<br><span style="color:${c === "#3a3a44" ? "#A7A7AD" : "#E3192B"}">${t}</span></div><div style="font-weight:700;font-size:32px;line-height:1.25">${x}</div></div>`).join("")}</div>
    <div class="w mono gray" style="top:1180px;font-size:24px">Datas ilustrativas. Marque as revisões no calendário assim que terminar o estudo.</div>`, "05"),
  P(`${lbl("// O PULO DO GATO")}
    <div class="w" style="top:160px"><h1 style="font-size:84px">Cada erro vira <span class="hit">revisão</span></h1></div>
    <div class="w" style="top:420px;font-weight:700;font-size:40px;line-height:1.35">Errou uma questão? Anote no <b class="red">caderno de erros</b>:</div>
    <div class="w" style="top:560px">
      <div class="card"><b>O que você marcou</b><span>e qual era a resposta certa</span></div>
      <div class="card"><b>Por que errou</b><span>não sabia, confundiu, leu rápido ou caiu na pegadinha</span></div>
      <div class="card"><b>Quando revisar</b><span>data da próxima revisão: 24h, 7 ou 30 dias</span></div></div>`, "06"),
  P(`<div style="position:absolute;left:0;right:0;top:110px;display:flex;justify-content:center"><img src="${SELO}" style="width:150px"></div>
    <div class="w" style="top:290px;text-align:center"><h1 style="font-size:84px">Resumo para<br><span class="hit">não esquecer</span></h1></div>
    <div class="w" style="top:500px;text-align:center;font-weight:800;font-size:40px;line-height:1.5">Revise em <span class="red">24h · 7 dias · 30 dias</span><br>Revise com questões, não relendo<br>Todo erro vai pro caderno, com data</div>
    <div class="w mono" style="top:770px;text-align:center;font-size:32px">🔖 SALVA E MANDA PRA QUEM ESTUDA COM VOCÊ</div>
    <div class="w" style="top:880px"><div class="card" style="text-align:center;border-color:#E3192B"><span style="color:#fff;margin:0">Planilha de caderno de erros com fórmulas e revisões com data marcada, mais comandos de IA para revisar: está no <b style="display:inline;font-size:32px;color:#E3192B">Kit Concurseiro Policial</b>. Link na bio.</span></div></div>
    <div class="w disc" style="top:1210px;text-align:center">Conteúdo educativo. Não garantimos aprovação.</div>`, "07"),
];
const out = path.join(ROOT, "carrossel-revisao");
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const pg = await browser.newPage({ viewport: { width: W, height: H } });
for (const [i, html] of SLIDES.entries()) {
  await pg.setContent(html, { waitUntil: "load" });
  await pg.evaluate(() => document.fonts.ready);
  await pg.screenshot({ path: path.join(out, `revisao-${String(i + 1).padStart(2, "0")}.png`) });
}
await browser.close();
console.log(`${SLIDES.length} slides em carrossel-revisao/`);
