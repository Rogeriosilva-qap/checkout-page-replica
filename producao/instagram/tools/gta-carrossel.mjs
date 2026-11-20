// Carrossel "Se o GTA 6 fosse no Brasil: que crime é esse?" (9 slides, 1080×1350).
// Só texto e arte própria: nenhuma imagem, logotipo, fonte ou personagem do jogo.
// Uso: node tools/gta-carrossel.mjs → gta-6/*.png
import { createRequire } from "module";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SELO = "data:image/png;base64," + fs.readFileSync(path.join(ROOT, "assets/selo.png")).toString("base64");
const W = 1080, H = 1350;

// [ação no jogo, crime, base legal, pegadinha de prova, nível de procurado 1–5]
const CRIMES = [
  ["Pegar um carro estacionado, sem ninguém dentro, e sair dirigindo.", "Furto", "Art. 155 do Código Penal",
    "Sem violência nem grave ameaça é <b>furto</b>. Usou violência ou ameaçou alguém? Aí já é <b>roubo</b>.", 1],
  ["Tirar o motorista do carro apontando uma arma e fugir com o veículo.", "Roubo com aumento de pena", "Art. 157, § 2º-A, I, do CP",
    "Arma de fogo aumenta a pena em 2/3. <b>Arma de brinquedo</b> não aplica esse aumento, mas ainda é grave ameaça: continua sendo roubo.", 2],
  ["Comprar ou ficar com um carro sabendo que ele é roubado.", "Receptação", "Art. 180 do Código Penal",
    "Quem recebe o carro sabendo da origem criminosa não responde pelo roubo: responde por <b>receptação</b>.", 2],
  ["Fazer racha na avenida contra outro carro.", "Competição não autorizada (racha)", "Art. 308 do CTB",
    "Para ser crime, o racha precisa <b>gerar situação de risco</b> à incolumidade pública ou privada.", 3],
  ["Bater em outro carro e sair em disparada sem parar.", "Fuga do local do acidente", "Art. 305 do CTB",
    "O crime é se afastar para <b>fugir da responsabilidade</b> penal ou civil. O STF já decidiu que o artigo é constitucional.", 3],
  ["Andar pela cidade com uma arma na cintura, sem autorização.", "Porte ilegal de arma de fogo", "Arts. 14 e 16 do Estatuto do Desarmamento",
    "<b>Uso permitido</b> → art. 14. <b>Uso restrito</b> → art. 16. A banca adora trocar os dois.", 4],
  ["Ignorar a ordem de parada da viatura e fugir em alta velocidade.", "Desobediência", "Art. 330 do CP · STJ, Tema 1060",
    "Desobedecer à ordem de parada em policiamento ostensivo é crime. Se usar <b>violência ou ameaça</b> contra o policial, vira <b>resistência</b> (art. 329).", 5],
];

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
.btn{display:flex;align-items:center;justify-content:center;background:#E3192B;border-radius:12px;font-weight:900;letter-spacing:-1px;color:#fff;box-shadow:0 0 40px rgba(227,25,43,.45)}`;

const page = (inner) => `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head>
<body><div class="top"></div><div class="c tl"></div><div class="c tr"></div><div class="c br"></div><div class="c bl"></div>${inner}</body></html>`;
const stars = (n) => `<div class="stars">${[1, 2, 3, 4, 5].map((i) => `<span style="color:${i <= n ? "#E3192B" : "#2A2A32"}">★</span>`).join("")}</div>`;

const capa = page(`
  <div class="w mono red" style="top:110px;font-size:28px">// EDIÇÃO GTA 6</div>
  ${stars(5)}
  <div class="w" style="top:190px"><h1 style="font-size:118px">Se o GTA 6<br>fosse no<br><span class="hit">Brasil…</span></h1></div>
  <div class="w" style="top:630px;font-weight:800;font-size:54px;line-height:1.15;letter-spacing:-1px">…quantos crimes você cometeria nos <span class="red">primeiros 5 minutos?</span></div>
  <div class="w" style="top:900px;display:flex;flex-wrap:wrap;gap:12px">${["CÓDIGO PENAL", "CTB", "ESTATUTO DO DESARMAMENTO"].map((t) => `<span class="mono" style="font-size:24px;border:2px solid #E3192B;border-radius:6px;padding:6px 12px">${t}</span>`).join("")}</div>
  <div class="w mono" style="top:1080px;font-size:32px">ARRASTA E CONFERE →</div>
  <div class="w disc" style="top:1210px">Conteúdo educativo. GTA é marca de seus titulares; sem vínculo com a Operação Aprovação.</div>`);

const slide = ([acao, crime, base, trap, n], i) => page(`
  <div class="w mono red" style="top:110px;font-size:28px">// SE FOSSE NO BRASIL · ${String(i + 1).padStart(2, "0")}/07</div>
  ${stars(n)}
  <div class="w" style="top:180px"><div class="tag" style="background:#3a3a44">🎮 NO JOGO</div><div class="game">${acao}</div></div>
  <div class="w" style="top:500px"><div class="tag" style="background:#E3192B">⚖️ NA LEI</div><div class="law">
    <div style="font-weight:900;font-size:${crime.length > 22 ? 62 : 80}px;letter-spacing:-2px;line-height:1;color:#E3192B;font-style:italic">${crime}</div>
    <div class="mono" style="font-size:30px;margin-top:16px">${base}</div></div></div>
  <div class="w" style="top:870px"><div class="mono" style="font-size:26px;margin-bottom:12px">⚠️ PEGADINHA DE PROVA</div><div class="trap">${trap}</div></div>
  <div class="w mono gray" style="top:1230px;font-size:22px;text-align:right">ARRASTA →</div>`);

const fim = page(`
  <div style="position:absolute;left:0;right:0;top:110px;display:flex;justify-content:center"><img src="${SELO}" style="width:160px"></div>
  <div class="w" style="top:300px;text-align:center"><h1 style="font-size:96px">Quantas você<br><span class="hit">acertou?</span></h1></div>
  <div class="w" style="top:530px;text-align:center;font-weight:800;font-size:40px;line-height:1.25">Comenta de 0 a 7 👇<br><span class="gray" style="font-weight:600;font-size:32px">e salva 🔖 pra revisar antes da prova</span></div>
  <div class="w" style="top:760px;text-align:center;font-weight:700;font-size:32px;line-height:1.3">Quer treinar questões assim, com <span class="red">gabarito, comentário e pegadinha da banca</span>?</div>
  <div class="w" style="top:900px"><div class="btn" style="height:120px;font-size:54px">COMENTE “SIMULADO”</div></div>
  <div class="w mono" style="top:1040px;text-align:center;font-size:24px">grupo de espera · desconto de lançamento</div>
  <div class="w disc" style="top:1180px;text-align:center">Conteúdo educativo e resumido; confira sempre a lei atualizada.<br>Plataforma educacional independente. Não garantimos aprovação.</div>`);

const out = path.join(ROOT, "gta-6");
fs.mkdirSync(out, { recursive: true });
const slides = [capa, ...CRIMES.map(slide), fim];
const browser = await chromium.launch();
const pg = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
for (const [i, html] of slides.entries()) {
  await pg.setContent(html, { waitUntil: "load" });
  await pg.evaluate(() => document.fonts.ready);
  await pg.screenshot({ path: path.join(out, `gta6-${String(i + 1).padStart(2, "0")}.png`) });
}
await browser.close();
console.log(`${slides.length} slides em gta-6/`);
