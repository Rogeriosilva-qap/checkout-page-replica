// Anúncio em formato de matéria: "Jornal do Concurseiro" (marca própria da Operação Aprovação), 3 slides 1080×1350.
// Fatos: edital PM SP DP-4/321/26 (Vunesp). Telas: conta de demonstração da plataforma.
import { createRequire } from "module";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SITE = path.join(ROOT, "..", "video-bussola-tiktok", "public", "site");
const b64 = (p, t) => `data:${t};base64,` + fs.readFileSync(p).toString("base64");
const SELO = b64(path.join(ROOT, "assets/selo.png"), "image/png");
const RES = b64(path.join(SITE, "resultado.jpg"), "image/jpeg");
const PROVA = b64(path.join(SITE, "prova.jpg"), "image/jpeg");
const W = 1080, H = 1350;
const CSS = `*{box-sizing:border-box;margin:0;padding:0}body{width:${W}px;height:${H}px;overflow:hidden;background:#F4F1EA;color:#111;font-family:Inter,sans-serif}
.mono{font-family:"JetBrains Mono",monospace;font-weight:700}
.mast{position:absolute;left:0;right:0;top:0;height:120px;background:#0B1220;display:flex;align-items:center;padding:0 56px;gap:18px}
.logo{background:#E3192B;color:#fff;font-weight:900;line-height:1;padding:12px 16px;font-size:32px;letter-spacing:-1px}.logo span{display:block;font-size:22px;letter-spacing:0}
.mast .by{color:#cfd5e2;font-size:20px;font-weight:700;line-height:1.3}
.ed{position:absolute;left:56px;top:160px;font-size:24px;color:#E3192B;letter-spacing:2px}
.w{position:absolute;left:56px;right:56px}
h1{font-family:Georgia,"Times New Roman",serif;font-weight:700;line-height:1.08;letter-spacing:-1px}
.lf{font-size:32px;line-height:1.35;color:#333}
.meta{font-size:20px;color:#666;border-top:2px solid #ddd;padding-top:14px}
.p{font-family:Georgia,serif;font-size:31px;line-height:1.5;color:#222}
.foot{position:absolute;left:56px;right:56px;bottom:34px;font-size:17px;color:#777;line-height:1.4}`;
const page = (inner) => `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>
<div class="mast"><div class="logo">JORNAL<span>DO CONCURSEIRO</span></div><div class="by">BOLETIM · CONCURSOS<br>uma produção Operação Aprovação</div></div>${inner}</body></html>`;
const bar = (n, q, cor) => `<div style="display:flex;align-items:center;gap:16px;margin-bottom:14px"><div style="width:330px;font-weight:800;font-size:27px">${n}</div><div style="flex:1;height:38px;background:#e3dfd6"><div style="width:${(q / 20) * 100}%;height:100%;background:${cor};display:flex;align-items:center;justify-content:flex-end;padding-right:10px;color:#fff;font-weight:900;font-size:24px">${q}</div></div></div>`;
const SLIDES = [
  page(`<div class="ed mono">CONCURSOS · SÃO PAULO</div>
  <div class="w" style="top:210px"><h1 style="font-size:78px">Português e Matemática somam 35 das 60 questões da prova da PM SP</h1></div>
  <div class="w lf" style="top:530px">Inscrições para Aluno-Soldado vão até 22 de dezembro. Edital tem 2.000 vagas de nível médio.</div>
  <div class="w" style="top:690px;background:#fff;border:2px solid #ddd;padding:28px 30px">
    <div class="mono" style="font-size:20px;color:#E3192B;margin-bottom:18px">INFOGRÁFICO · QUESTÕES POR MATÉRIA</div>
    ${bar("Português", 20, "#E3192B")}${bar("Matemática", 15, "#E3192B")}${bar("Conhecimentos Gerais", 15, "#0B1220")}${bar("Informática", 5, "#0B1220")}${bar("Administração Pública", 5, "#0B1220")}
    <div style="font-size:19px;color:#666;margin-top:6px">+ redação · Fonte: edital DP-4/321/26 (Vunesp)</div></div>
  <div class="w meta" style="top:1205px">Por Redação Operação Aprovação · 27/11/2026 · Arraste para ler →</div>`),
  page(`<div class="ed mono">CONCURSOS · SÃO PAULO</div>
  <div class="w" style="top:210px"><h1 style="font-size:52px">O que o dado muda na preparação</h1></div>
  <div class="w p" style="top:360px">
    <p>Com <b>35 das 60 questões</b> em Português e Matemática, a maior parte da nota da prova objetiva da PM SP está em duas matérias.</p><br>
    <p>As matérias de Direito aparecem só em <b>Noções de Administração Pública</b>, com 5 questões sobre a Constituição.</p><br>
    <p>A banca é a <b>Vunesp</b>, conhecida por cobrar interpretação de texto e problemas de matemática do dia a dia.</p></div>
  <div class="w" style="top:840px;border-left:8px solid #E3192B;background:#fff;padding:22px 26px"><div style="font-family:Georgia,serif;font-style:italic;font-size:32px;line-height:1.35">Treinar no formato da prova mostra onde você perde ponto antes do dia oficial.</div></div>
  <div class="foot">Análise da Redação com base no edital DP-4/321/26. Prova prevista para fevereiro de 2027; confira a data oficial no site da Vunesp.</div>`),
  page(`<div class="ed mono">PUBLICIDADE · OPERAÇÃO APROVAÇÃO</div>
  <div class="w" style="top:210px"><h1 style="font-size:56px">Simulado no padrão Vunesp, com correção na hora</h1></div>
  <div class="w" style="top:400px;display:flex;gap:24px">
    ${[[PROVA, "Prova com cronômetro"], [RES, "Nota e acertos na hora"]].map(([s, t]) => `<div style="flex:1"><div style="height:560px;overflow:hidden;border:4px solid #0B1220;border-radius:14px;background:#0b0b0d"><img src="${s}" style="width:100%"></div><div class="mono" style="font-size:22px;margin-top:10px">${t}</div></div>`).join("")}</div>
  <div class="w" style="top:1040px;display:flex;align-items:center;gap:24px"><img src="${SELO}" style="width:110px">
    <div style="flex:1;background:#E3192B;color:#fff;font-weight:900;font-size:44px;text-align:center;padding:24px 0;border-radius:10px">1º SIMULADO GRÁTIS</div></div>
  <div class="foot">Sem cartão de crédito · simuladosoperaçãoaprovação.com.br · Telas reais, conta de demonstração. Sem vínculo com a PM SP ou a Vunesp. Não garantimos aprovação.</div>`),
];
const out = path.join(ROOT, "jornal-pmsp");
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const pg = await browser.newPage({ viewport: { width: W, height: H } });
for (const [i, html] of SLIDES.entries()) {
  await pg.setContent(html, { waitUntil: "load" });
  await pg.evaluate(() => document.fonts.ready);
  await pg.screenshot({ path: path.join(out, `jornal-${String(i + 1).padStart(2, "0")}.png`) });
}
await browser.close();
console.log(`${SLIDES.length} slides em jornal-pmsp/`);
