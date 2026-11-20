// Fotos da série "Questão do Dia" para carrossel misto (1 vídeo + 3 fotos) e stories.
// Uso: node tools/questao-carrossel.mjs → questao-do-dia/*.png
import { createRequire } from "module";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SELO = "data:image/png;base64," + fs.readFileSync(path.join(ROOT, "assets/selo.png")).toString("base64");
const HANDLE = "@operacaoaprovacaoconcursos";
const HORARIO = "19h";
const GREEN = "#22B35E";

const ENUN = `Ao fiscalizar um estabelecimento, um agente público <span class="hl">exige</span> vantagem indevida para deixar de lavrar a ocorrência. Em termos penais, essa conduta configura qual crime?`;
const ALTS = [["A", "Corrupção passiva"], ["B", "Corrupção ativa"], ["C", "Concussão"], ["D", "Prevaricação"]];
const VERBOS = [
  ["EXIGIR", "Concussão", "art. 316"],
  ["SOLICITAR / RECEBER", "Corrupção passiva", "art. 317"],
  ["OFERECER / PROMETER", "Corrupção ativa", "art. 333"],
  ["RETARDAR / DEIXAR DE PRATICAR ato de ofício por interesse pessoal", "Prevaricação", "art. 319"],
];

const CSS = `*{box-sizing:border-box;margin:0;padding:0}
body{width:var(--w);height:var(--h);overflow:hidden;font-family:Inter,sans-serif;color:#fff;
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
.box{background:#16161B;border:2px solid #2A2A32;border-left:8px solid #E3192B;border-radius:8px}
.hl{background:#E3192B;color:#fff;padding:0 8px;border-radius:4px;font-weight:900}
.alt{display:flex;align-items:center;gap:18px;padding:0 22px;height:84px;background:#16161B;border:3px solid #2A2A32;border-radius:10px;margin-bottom:12px}
.alt .l{width:50px;height:50px;flex:none;border-radius:25px;border:3px solid #E3192B;display:flex;align-items:center;justify-content:center;font-family:"JetBrains Mono",monospace;font-weight:700;font-size:26px}
.alt .t{font-weight:800;font-size:34px;letter-spacing:-.5px}
.alt.ok{background:${GREEN};border-color:${GREEN}}.alt.ok .l{border-color:#fff}
.alt.x{background:rgba(227,25,43,.18);border-color:#E3192B}
.alt .m{margin-left:auto;font-weight:900;font-size:40px}
.tag{display:inline-block;font-family:"JetBrains Mono",monospace;font-weight:700;font-size:24px;color:#fff;background:#E3192B;padding:8px 14px;border-radius:8px 8px 0 0}
.card{background:#16161B;border:3px solid #E3192B;border-radius:0 12px 12px 12px;padding:28px 30px}
.btn{display:flex;align-items:center;justify-content:center;background:#E3192B;border-radius:12px;font-weight:900;letter-spacing:-1px;color:#fff;box-shadow:0 0 40px rgba(227,25,43,.45)}
.disc{font-family:"JetBrains Mono",monospace;font-size:19px;color:#A7A7AD;line-height:1.4}
.pg{position:absolute;right:104px;font-family:"JetBrains Mono",monospace;font-weight:700;font-size:24px;color:#A7A7AD}`;

const page = (inner, w, h, pg) => `<!doctype html><html><head><meta charset="utf-8"><style>:root{--w:${w}px;--h:${h}px}${CSS}</style></head>
<body><div class="top"></div><div class="c tl"></div><div class="c tr"></div><div class="c br"></div><div class="c bl"></div>${inner}
${pg ? `<div class="pg" style="top:${h > 1500 ? 262 : 100}px">${pg}</div>` : ""}</body></html>`;
const F = [1080, 1350];
const S = [1080, 1920];
const lbl = (t, top = 100) => `<div class="w mono red" style="top:${top}px;font-size:28px">${t}</div>`;
const alts = (top, state = {}) => `<div class="w" style="top:${top}px">${ALTS.map(([l, t]) => `<div class="alt ${state[l] || ""}"><span class="l">${l}</span><span class="t">${t}</span>${state[l] === "ok" ? '<span class="m">✓</span>' : state[l] === "x" ? '<span class="m red">✕</span>' : ""}</div>`).join("")}</div>`;
const enun = (top, size = 34) => `<div class="w box" style="top:${top}px;padding:26px 28px"><div class="mono gray" style="font-size:19px">QUESTÃO DE TREINO · DIREITO PENAL · PADRÃO DA BANCA</div><div style="font-weight:700;font-size:${size}px;line-height:1.32;margin-top:10px">${ENUN}</div></div>`;
const stopwatch = (s) => `<svg width="${s}" height="${s}" viewBox="0 0 64 64"><circle cx="32" cy="36" r="22" fill="none" stroke="#E3192B" stroke-width="5"/><path d="M26 6h12M32 6v8M48 18l4-4" stroke="#E3192B" stroke-width="5" stroke-linecap="round"/><path d="M32 36V24" stroke="#fff" stroke-width="5" stroke-linecap="round"/></svg>`;
const verbos = (fs = 28) => VERBOS.map(([v, c, a], i) => `<div style="display:flex;align-items:center;gap:16px;padding:18px 0;${i ? "border-top:2px solid #2A2A32" : ""}">
  <div class="mono" style="flex:1;font-size:${i === 3 ? fs - 6 : fs}px;line-height:1.25;color:${i ? "#fff" : "#E3192B"}">${v}</div>
  <div style="font-weight:900;font-size:30px;color:#E3192B">→</div>
  <div style="width:320px;text-align:right"><div style="font-weight:900;font-size:34px;color:${i ? "#fff" : GREEN}">${c}</div><div class="mono gray" style="font-size:19px;font-weight:400">${a} do CP</div></div></div>`).join("");

const FOTOS = {
  // ---- POST 1: QUESTÃO (vídeo + 3 fotos) ----
  "post1-1-capa": [page(`${lbl("// QUESTÃO DE CONCURSO POLICIAL", 110)}
    <div class="w" style="top:170px"><h1 style="font-size:130px">Pegadinha<br><span class="hit">clássica</span></h1></div>
    <div class="w" style="top:520px;display:flex;flex-direction:column;align-items:center">${stopwatch(220)}<div style="font-weight:900;font-size:96px;letter-spacing:-3px;margin-top:10px">VOCÊ TEM <span class="red">10s</span></div></div>
    <div class="w mono" style="top:1060px;text-align:center;font-size:30px">ARRASTA E RESPONDE →</div>`, ...F, "01/04")],
  "post1-2-questao": [page(`${lbl("// RESPONDA EM 10 SEGUNDOS")}${enun(150)}${alts(560)}
    <div class="w" style="top:1080px;text-align:center;font-weight:900;font-size:52px;letter-spacing:-1px">COMENTA <span class="red">A, B, C</span> OU <span class="red">D</span> 👇</div>`, ...F, "02/04")],
  "post1-3-gabarito-19h": [page(`<div style="position:absolute;left:0;right:0;top:120px;display:flex;justify-content:center"><img src="${SELO}" style="width:170px"></div>
    <div class="w" style="top:330px;text-align:center"><div class="mono gray" style="font-size:32px">GABARITO COMENTADO</div>
    <div style="font-weight:900;font-size:200px;letter-spacing:-8px;line-height:1">ÀS <span class="hit">${HORARIO}</span></div>
    <div class="mono" style="font-size:28px;margin-top:6px">comentário + pegadinha da banca</div></div>
    <div class="w" style="top:830px"><div class="btn" style="height:120px;font-size:56px">+ SEGUIR O PERFIL</div><div class="mono" style="text-align:center;font-size:30px;margin-top:16px">${HANDLE}</div></div>
    <div class="w disc" style="top:1200px;text-align:center">Questão de treino gerada pela plataforma Simulados Operação Aprovação (pré-lançamento).</div>`, ...F, "04/04")],
  // ---- POST 2: GABARITO (vídeo + 3 fotos) ----
  "post2-1-resposta": [page(`${lbl("// GABARITO COMENTADO", 110)}
    <div class="w" style="top:160px"><h1 style="font-size:104px">Letra <span style="color:${GREEN}">C</span><br><span class="hit">Concussão</span></h1></div>
    ${alts(420, { A: "x", C: "ok" })}
    <div class="w" style="top:900px;font-weight:800;font-size:40px;line-height:1.25">Marcou A? <span class="red">Caiu na pegadinha.</span> Arrasta pra entender →</div>`, ...F, "01/04")],
  "post2-2-comentario": [page(`${lbl("// POR QUE É C?")}
    <div class="w" style="top:170px"><div class="tag">💬 COMENTÁRIO</div><div class="card">
      <div style="font-weight:900;font-size:76px;letter-spacing:-2px;line-height:1.02">O verbo do crime é <span class="hl" style="padding:0 12px">EXIGIR</span>.</div>
      <div style="font-weight:700;font-size:40px;line-height:1.32;color:#d8d8de;margin-top:28px">Exigir, para si ou para outrem, vantagem indevida em razão da função = <b style="color:#fff">concussão</b>.</div>
      <div class="mono red" style="font-size:30px;margin-top:30px">ART. 316 DO CÓDIGO PENAL</div></div></div>`, ...F, "03/04")],
  "post2-3-pegadinha": [page(`${lbl("// NÃO CAIA DE NOVO")}
    <div class="w" style="top:160px"><div class="tag">⚠️ PEGADINHA DA BANCA: O VERBO DECIDE</div><div class="card" style="padding:10px 30px">${verbos()}</div></div>
    <div class="w mono" style="top:1130px;text-align:center;font-size:28px">🔖 SALVA PRA REVISAR</div>`, ...F, "04/04")],
  // ---- EXTRAS (feed) ----
  "extra-resumo-salve": [page(`${lbl("// RESUMO PARA SALVAR", 110)}
    <div class="w" style="top:160px"><h1 style="font-size:84px">Crimes contra a<br><span class="hit">administração pública</span></h1></div>
    <div class="w card" style="top:440px;border-radius:12px;padding:10px 30px">${verbos(26)}</div>
    <div class="w mono" style="top:1150px;text-align:center;font-size:26px">🔖 SALVA · Código Penal, arts. 316, 317, 319 e 333</div>`, ...F)],
  "extra-plataforma-cta": [page(`<div style="position:absolute;left:0;right:0;top:110px;display:flex;justify-content:center"><img src="${SELO}" style="width:160px"></div>
    <div class="w" style="top:300px;text-align:center"><h1 style="font-size:92px">Em cada<br><span class="hit">questão</span></h1></div>
    <div class="w" style="top:540px">${["✅ Gabarito", "💬 Comentário explicando o porquê", "⚠️ Alerta da pegadinha da banca", "📸 Correção do cartão pela câmera"].map((t) => `<div class="box" style="padding:20px 26px;margin-bottom:12px;font-weight:800;font-size:36px">${t}</div>`).join("")}</div>
    <div class="w" style="top:1030px"><div class="btn" style="height:110px;font-size:50px">COMENTE “SIMULADO”</div></div>
    <div class="w disc" style="top:1165px;text-align:center">Grupo de espera dos Simulados Operação Aprovação · desconto de lançamento.<br>Recursos variam conforme o plano. Não garantimos aprovação.</div>`, ...F)],
  // ---- STORIES (9:16) ----
  "story-enquete": [page(`${lbl("// QUESTÃO DO DIA", 262)}
    <div class="w" style="top:320px"><h1 style="font-size:96px">Você tem<br><span class="hit">10 segundos</span></h1></div>
    ${enun(590, 36)}
    <div class="w mono" style="top:1080px;text-align:center;font-size:34px">VOTE NA ENQUETE 👇</div>
    <div class="w mono gray" style="top:1510px;text-align:center;font-size:24px">Gabarito comentado às ${HORARIO} no perfil</div>`, ...S)],
  "story-gabarito-19h": [page(`<div style="position:absolute;left:0;right:0;top:300px;display:flex;justify-content:center"><img src="${SELO}" style="width:200px"></div>
    <div class="w" style="top:560px;text-align:center"><div class="mono gray" style="font-size:34px">GABARITO COMENTADO</div>
    <div style="font-weight:900;font-size:230px;letter-spacing:-9px;line-height:1">ÀS <span class="hit">${HORARIO}</span></div>
    <div class="mono" style="font-size:30px;margin-top:10px">ative o lembrete 👇</div></div>
    <div class="w mono" style="top:1480px;text-align:center;font-size:26px">${HANDLE}</div>`, ...S)],
};

const out = path.join(ROOT, "questao-do-dia");
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const pg = await browser.newPage({ deviceScaleFactor: 1 });
for (const [name, [html]] of Object.entries(FOTOS)) {
  const [w, h] = name.startsWith("story") ? S : F;
  await pg.setViewportSize({ width: w, height: h });
  await pg.setContent(html, { waitUntil: "load" });
  await pg.evaluate(() => document.fonts.ready);
  await pg.screenshot({ path: path.join(out, `${name}.png`) });
}
await browser.close();
console.log(`${Object.keys(FOTOS).length} fotos em questao-do-dia/`);
