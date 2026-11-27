// Gera as artes do Instagram (destaques + CTA dos simulados) em PNG.
// Uso: node tools/gerar.mjs   → destaques/**.png e simulados/**.png
// Edite os textos nos objetos abaixo e rode de novo.
import { createRequire } from "module";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const asset = (f) => "data:image/png;base64," + fs.readFileSync(path.join(ROOT, "assets", f)).toString("base64");
const SELO = asset("selo.png");
const CAPA = asset("capa-guia.png");

// ---------- ícones (traço simples, sem símbolos oficiais) ----------
const I = {
  livro: `<svg viewBox="0 0 64 64"><path d="M8 12h18a6 6 0 0 1 6 6v34a5 5 0 0 0-5-5H8zM56 12H38a6 6 0 0 0-6 6v34a5 5 0 0 1 5-5h19z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/></svg>`,
  bussola: `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="25" fill="none" stroke="currentColor" stroke-width="4"/><path d="M32 3v8M32 53v8M3 32h8M53 32h8" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="M42 22l-7 13-13 7 7-13z" fill="currentColor"/></svg>`,
  duvida: `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" fill="none" stroke="currentColor" stroke-width="4"/><path d="M24 25a8 8 0 1 1 11.5 7.2c-2.3 1.1-3.5 2.6-3.5 5.3V40" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="round"/><circle cx="32" cy="47.5" r="3" fill="currentColor"/></svg>`,
  alvo: `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="25" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="32" cy="32" r="14" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="32" cy="32" r="4" fill="currentColor"/></svg>`,
  check: `<svg viewBox="0 0 24 24"><path d="M4 12.5l5 5L20 6.5" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="square"/></svg>`,
  seta: `<svg viewBox="0 0 24 24"><path d="M12 4v15M5 12l7 7 7-7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square"/></svg>`,
};

const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
body{width:var(--w);height:var(--h);overflow:hidden;font-family:Inter,sans-serif;color:#fff;
  background:radial-gradient(ellipse 75% 45% at 50% 50%,rgba(227,25,43,.15),rgba(227,25,43,0) 70%),
  linear-gradient(#1C1C22 2px,transparent 2px) -1px -1px/72px 72px,linear-gradient(90deg,#1C1C22 2px,transparent 2px) -1px -1px/72px 72px,#0E0E11}
.top{position:absolute;left:0;right:0;top:0;height:8px;background:#E3192B}
.c{position:absolute;width:72px;height:72px}
.c::before,.c::after{content:"";position:absolute;background:#E3192B;left:0;top:0}
.c::before{width:72px;height:8px}.c::after{width:8px;height:72px}
.tl{left:30px;top:38px}.tr{right:30px;top:38px;transform:rotate(90deg)}.br{right:30px;bottom:30px;transform:rotate(180deg)}.bl{left:30px;bottom:30px;transform:rotate(270deg)}
.mono{font-family:"JetBrains Mono",monospace;font-weight:700;letter-spacing:1px}
.red{color:#E3192B}.gray{color:#A7A7AD}
.hit{color:#E3192B;font-style:italic;padding-right:.06em}
h1{font-weight:900;text-transform:uppercase;letter-spacing:-.04em;line-height:.95}
.lbl{font-family:"JetBrains Mono",monospace;font-weight:700;font-size:32px;color:#E3192B;letter-spacing:1px}
.bar{height:14px;width:300px;background:#E3192B}
.box{background:#16161B;border:2px solid #2A2A32;border-left:8px solid #E3192B;border-radius:8px}
.tag{display:inline-block;font-family:"JetBrains Mono",monospace;font-weight:700;color:#E3192B;border:3px solid #E3192B;border-radius:4px;padding:6px 14px 5px;font-size:26px;background:rgba(227,25,43,.08)}
.page{position:absolute;font-family:"JetBrains Mono",monospace;font-weight:700;font-size:26px;color:#A7A7AD}
.wrap{position:absolute;left:90px;right:90px}
.list .it{display:flex;gap:22px;align-items:flex-start;padding:26px 28px;margin-bottom:18px}
.list .ic{width:44px;height:44px;flex:none;color:#E3192B;margin-top:2px}
.list b{display:block;font-weight:900;font-size:36px;letter-spacing:-.5px;line-height:1.1}
.list span{display:block;font-weight:600;font-size:27px;color:#A7A7AD;line-height:1.3;margin-top:6px}
.btn{display:flex;align-items:center;justify-content:center;gap:20px;background:#E3192B;border-radius:12px;font-weight:900;text-transform:uppercase;letter-spacing:-1px;box-shadow:0 0 50px rgba(227,25,43,.45)}
.disc{font-family:"JetBrains Mono",monospace;font-size:21px;color:#A7A7AD;line-height:1.4}
svg{display:block;width:100%;height:100%}
`;

const frame = (inner, w, h, pg) => `<!doctype html><html><head><meta charset="utf-8"><style>:root{--w:${w}px;--h:${h}px}${CSS}</style></head>
<body><div class="top"></div><div class="c tl"></div><div class="c tr"></div><div class="c br"></div><div class="c bl"></div>
${inner}${pg ? `<div class="page" style="right:110px;top:${h > 1500 ? 262 : 110}px">${pg}</div>` : ""}</body></html>`;

// Stories 1080×1920: texto importante entre y≈250 e y≈1580 (barra do perfil e campo de resposta).
const S = { w: 1080, h: 1920 };
const header = (lbl) => `<div class="wrap" style="top:262px"><div class="lbl">${lbl}</div></div>`;
const title = (top, html, size = 104) => `<div class="wrap" style="top:${top}px"><h1 style="font-size:${size}px">${html}</h1><div class="bar" style="margin-top:28px"></div></div>`;
const listBox = (top, items, gap = 18) => `<div class="wrap list" style="top:${top}px">${items
  .map(([t, d, ic = "check"]) => `<div class="box it" style="margin-bottom:${gap}px"><div class="ic">${I[ic]}</div><div><b>${t}</b>${d ? `<span>${d}</span>` : ""}</div></div>`)
  .join("")}</div>`;
const linkArea = (top, txt = "TOQUE NO LINK") => `<div class="wrap" style="top:${top}px;text-align:center">
  <div class="mono" style="font-size:34px;display:flex;align-items:center;justify-content:center;gap:14px"><span style="width:40px;height:40px;color:#E3192B">${I.seta}</span>${txt}<span style="width:40px;height:40px;color:#E3192B">${I.seta}</span></div></div>`;

// ---------- CAPAS DOS DESTAQUES (o Instagram recorta o centro em círculo) ----------
const capa = (ic, nome) => frame(`<div style="position:absolute;left:290px;top:610px;width:500px;height:500px;border-radius:50%;border:10px solid #E3192B;background:#16161B;box-shadow:0 0 80px rgba(227,25,43,.35);display:flex;align-items:center;justify-content:center">
  <div style="width:250px;height:250px;color:#fff">${I[ic]}</div></div>
  <div class="mono" style="position:absolute;left:0;right:0;top:1170px;text-align:center;font-size:44px;letter-spacing:4px">${nome}</div>`, S.w, S.h);

// ---------- DESTAQUE: O GUIA ----------
const guia = [
  frame(`${header("// O GUIA")}
    ${title(320, `O guia definitivo do concurseiro policial<br><span class="hit">cibernético</span>`, 78)}
    <div style="position:absolute;left:90px;top:690px;transform:rotate(-3deg);box-shadow:0 40px 90px rgba(0,0,0,.7),0 0 70px rgba(227,25,43,.35)"><img src="${CAPA}" style="width:430px;display:block"></div>
    <div style="position:absolute;left:580px;right:90px;top:740px">
      ${["22 comandos prontos", "Método Bússola", "Caderno de erros automatizado", "Simulados por banca"].map((t) => `<div class="mono" style="font-size:31px;line-height:1.25;margin-bottom:34px;display:flex;gap:14px"><span style="width:14px;height:14px;background:#E3192B;flex:none;margin-top:12px"></span>${t}</div>`).join("")}
    </div>
    <div class="wrap" style="top:1370px"><p style="font-weight:700;font-size:36px;line-height:1.3">Como usar inteligência artificial para dominar editais, criar simulados e organizar sua revisão.</p></div>`, S.w, S.h, "01/05"),
  frame(`${header("// O QUE TEM DENTRO")}${title(320, `4 <span class="hit">operações</span>`)}
    ${listBox(560, [
      ["OP 01 · Método Bússola", "Edital → micro-tópicos com prioridade Alfa, Bravo e Charlie → cronograma com margem.", "bussola"],
      ["OP 02 · Engenharia de prompt", "Comandos para lei seca, mapas mentais e simulados nos formatos Cebraspe, FGV e AOCP.", "livro"],
      ["OP 03 · Arsenal", "Qual ferramenta usar em cada missão e como proteger seus dados.", "alvo"],
      ["OP 04 · Fim do erro manual", "Caderno de erros com fórmulas prontas, flashcards e revisões com data marcada.", "check"],
    ])}`, S.w, S.h, "02/05"),
  frame(`${header("// PARA QUEM É")}${title(320, `Para quem estuda para <span class="hit">segurança pública</span>`, 80)}
    <div class="wrap" style="top:720px;display:flex;flex-wrap:wrap;gap:16px">${["POLÍCIA PENAL", "PM", "PC", "PF", "PRF", "GUARDA MUNICIPAL"].map((t) => `<span class="tag" style="font-size:30px;color:#fff;border-color:#E3192B">${t}</span>`).join("")}</div>
    ${listBox(930, [
      ["Concilia estudo com trabalho e escala", "Plano que deixa margem para plantão e imprevistos."],
      ["Quer usar IA como ferramenta, não atalho", "Comandos prontos com etapa de conferência."],
      ["Não sabe por onde começar o edital", "O Método Bússola organiza tudo em 4 fases."],
    ])}`, S.w, S.h, "03/05"),
  frame(`${header("// REGRA DE ENGAJAMENTO Nº 1")}${title(320, `Conferir <span class="hit">sempre</span>`)}
    <div class="wrap box" style="top:590px;padding:44px 40px"><p style="font-weight:800;font-size:44px;line-height:1.25;letter-spacing:-.5px">Nenhuma resposta de IA vira matéria de estudo antes de ser conferida na fonte.</p></div>
    ${listBox(960, [["O edital, no canal oficial", ""], ["A lei, na versão oficial", ""], ["A questão, com o gabarito oficial", ""]], 16)}
    <div class="wrap" style="top:1400px"><p style="font-weight:700;font-size:34px;line-height:1.3" class="gray">A IA acelera o trabalho. A conferência garante a direção certa.</p></div>`, S.w, S.h, "04/05"),
  frame(`${header("// GARANTA O SEU")}${title(320, `E-book em PDF<br><span class="hit">R$ 47</span>`, 112)}
    <div style="position:absolute;left:325px;top:680px;transform:rotate(-3deg);box-shadow:0 40px 90px rgba(0,0,0,.7),0 0 70px rgba(227,25,43,.35)"><img src="${CAPA}" style="width:430px;display:block"></div>
    ${linkArea(1340)}
    <div class="wrap" style="top:1530px;text-align:center"><p class="disc">Material educacional e independente. Confira sempre na fonte oficial.</p></div>`, S.w, S.h, "05/05"),
];

// ---------- DESTAQUE: MÉTODO BÚSSOLA ----------
const fase = (n, nome, tit, corpo, pg) =>
  frame(`${header(`// FASE ${n} · ${nome}`)}${title(320, tit, 100)}${corpo}`, S.w, S.h, pg);
const bussola = [
  frame(`${header("// OPERAÇÃO 01")}
    <div style="position:absolute;left:0;right:0;top:330px;display:flex;justify-content:center"><img src="${SELO}" style="width:230px"></div>
    <div class="wrap" style="top:600px;text-align:center"><h1 style="font-size:150px">Método<br><span class="hit">Bússola</span></h1></div>
    <div class="wrap" style="top:960px;text-align:center"><p style="font-weight:800;font-size:44px;line-height:1.2">4 fases para transformar o seu edital em um plano de estudos.</p></div>
    <div class="wrap" style="top:1180px;display:grid;grid-template-columns:1fr 1fr;gap:16px">${["01 EXTRAÇÃO", "02 FATIAMENTO", "03 PRIORIZAÇÃO", "04 CALENDÁRIO"].map((t) => `<div class="box mono" style="font-size:30px;padding:24px 22px">${t.replace(/^(\d+)/, '<span class="red">$1</span>')}</div>`).join("")}</div>`, S.w, S.h, "01/06"),
  fase("01", "EXTRAÇÃO", `Extraia o <span class="hit">conteúdo</span>`,
    `<div class="wrap box" style="top:640px;padding:36px 36px"><p class="mono red" style="font-size:24px;margin-bottom:14px">COMECE PELO EDITAL</p><p style="font-weight:800;font-size:42px;line-height:1.25">Separe os assuntos do seu cargo por matéria, com os itens exatamente como estão escritos.</p></div>
     ${listBox(1080, [["Use o edital oficial e as retificações", ""], ["Confira a contagem de itens por matéria", "Listas longas são onde itens somem."]], 16)}`, "02/06"),
  fase("02", "FATIAMENTO", `Divida em <span class="hit">tarefas</span>`,
    `<div class="wrap box" style="top:640px;padding:32px 36px"><p class="mono gray" style="font-size:24px">ITEM DO EDITAL</p><p style="font-weight:900;font-size:40px;margin-top:8px">Lei de Execução Penal</p></div>
     <div class="wrap" style="top:820px;text-align:center;height:60px;color:#E3192B"><div style="width:60px;height:60px;margin:0 auto">${I.seta}</div></div>
     ${listBox(900, [["Objeto e aplicação da lei", "1 sessão"], ["Trabalho, deveres, direitos e disciplina", "2 a 3 sessões"], ["Regimes, progressão, saídas e remição", "2 a 3 sessões"]], 14)}
     <div class="wrap" style="top:1440px"><p class="disc">Exemplo ilustrativo do guia. Cada tarefa deve caber em uma sessão de estudo.</p></div>`, "03/06"),
  fase("03", "PRIORIZAÇÃO", `Defina as <span class="hit">prioridades</span>`,
    `<div class="wrap" style="top:640px">${[["ALFA", "#E3192B", "#fff", "estude primeiro"], ["BRAVO", "#9E0F1C", "#fff", "estude em seguida"], ["CHARLIE", "#2A2A32", "#A7A7AD", "mantenha em revisão"]].map(([n, bg, fg, d]) => `<div class="box" style="display:flex;align-items:center;gap:28px;padding:26px 28px;margin-bottom:16px"><span class="mono" style="background:${bg};color:${fg};font-size:30px;padding:8px 16px;letter-spacing:3px;width:200px;text-align:center">${n}</span><b style="font-weight:900;font-size:40px">${d}</b></div>`).join("")}</div>
     <div class="wrap" style="top:1100px"><p class="mono red" style="font-size:26px;margin-bottom:18px">CRITÉRIOS</p><p style="font-weight:800;font-size:38px;line-height:1.3">Peso no seu edital · sua dificuldade · assuntos que servem de base para outros.</p></div>
     <div class="wrap" style="top:1440px"><p class="disc">A prioridade depende do seu edital e da sua dificuldade.</p></div>`, "04/06"),
  fase("04", "CALENDÁRIO", `Monte o <span class="hit">calendário</span>`,
    `<div class="wrap" style="top:640px">${[["SEG", "ALFA · Regimes e progressão", "#E3192B"], ["TER", "PLANTÃO", ""], ["QUA", "ALFA · Trabalho e disciplina", "#E3192B"], ["QUI", "BRAVO · Órgãos da execução", "#9E0F1C"], ["SEX", "PLANTÃO", ""], ["DOM", "MARGEM", "dash"]].map(([d, t, c]) => `<div class="box" style="display:flex;align-items:center;gap:22px;padding:14px 18px;margin-bottom:12px;border-left-color:#2A2A32"><span class="mono" style="font-size:28px;width:80px">${d}</span><span class="mono" style="flex:1;font-size:24px;padding:16px 18px;border-radius:4px;${c === "dash" ? "border:3px dashed #A7A7AD;color:#A7A7AD" : c ? `background:${c}` : "background:#2A2A32;color:#A7A7AD;letter-spacing:3px"}">${t}</span></div>`).join("")}</div>
     <div class="wrap" style="top:1330px"><p style="font-weight:800;font-size:36px;line-height:1.3">Alfa primeiro, respeitando a sua escala. Deixe espaço para revisões e imprevistos.</p></div>`, "05/06"),
  frame(`${header("// ENTRE CADA FASE")}${title(320, `E entre cada fase:<br><span class="hit">conferir.</span>`, 100)}
    ${listBox(720, [["Contagem bate com o edital", ""], ["Nada criado fora do edital", ""], ["Pesos do edital", ""], ["Retificações conferidas", ""]], 14)}
    <div class="wrap" style="top:1290px;text-align:center"><p style="font-weight:800;font-size:36px;line-height:1.3">O passo a passo e os comandos prontos estão no guia.</p></div>
    ${linkArea(1450, "VEJA O DESTAQUE “O GUIA”")}`, S.w, S.h, "06/06"),
];

// ---------- DESTAQUE: DÚVIDAS (respostas confirmadas na página do guia) ----------
const qa = (q, a, pg) => frame(`${header("// DÚVIDAS")}
  <div class="wrap" style="top:340px"><h1 style="font-size:84px;line-height:1">${q}</h1><div class="bar" style="margin-top:30px"></div>
  <div class="box" style="margin-top:80px;padding:44px 40px"><p style="font-weight:700;font-size:42px;line-height:1.32">${a}</p></div></div>`, S.w, S.h, pg);
const DUV = [
  ["É curso ou <span class='hit'>e-book</span>?", "É um e-book em PDF, sem aulas em vídeo."],
  ["Preciso saber usar <span class='hit'>IA</span>?", "Não. Os comandos já vêm prontos: você troca os campos entre colchetes e cola o texto que vai estudar."],
  ["Funciona com ferramentas <span class='hit'>gratuitas</span>?", "Sim. Os comandos são textos para copiar e colar e funcionam em ferramentas que aceitam pedidos por escrito, inclusive versões gratuitas. Recursos e limites variam entre ferramentas e planos."],
  ["A IA pode <span class='hit'>errar</span>?", "Sim. Os comandos reduzem o espaço para erro, mas não o eliminam. Por isso o guia tem uma etapa de conferência em cada operação."],
  ["Serve para qual <span class='hit'>carreira</span>?", "Polícia Penal, PM, PC, PF, PRF e Guarda Municipal. Você aplica o método ao edital do seu cargo."],
  ["Garante <span class='hit'>aprovação</span>?", "Não. É um material educacional e independente: não garante aprovação nem nomeação e não substitui o edital, as fontes oficiais ou o professor."],
  ["Tem vínculo com alguma <span class='hit'>corporação</span>?", "Não. Não há vínculo com corporações policiais, bancas organizadoras ou empresas de tecnologia."],
];
const duvidas = [
  frame(`${header("// DÚVIDAS FREQUENTES")}
    <div style="position:absolute;left:390px;top:420px;width:300px;height:300px;color:#E3192B">${I.duvida}</div>
    <div class="wrap" style="top:800px;text-align:center"><h1 style="font-size:120px">Ficou com<br><span class="hit">dúvida?</span></h1></div>
    <div class="wrap" style="top:1110px;text-align:center"><p style="font-weight:700;font-size:40px;line-height:1.3">As respostas sobre o Guia do Concurseiro Policial Cibernético estão aqui.</p></div>
    <div class="wrap" style="top:1360px;text-align:center"><p class="mono gray" style="font-size:28px">ARRASTE PARA O LADO →</p></div>`, S.w, S.h, `01/${String(DUV.length + 2).padStart(2, "0")}`),
  ...DUV.map(([q, a], i) => qa(q, a, `${String(i + 2).padStart(2, "0")}/${String(DUV.length + 2).padStart(2, "0")}`)),
  frame(`${header("// DÚVIDAS")}${title(340, `Outra <span class="hit">dúvida</span>?`, 110)}
    <div class="wrap box" style="top:700px;padding:44px 40px"><p style="font-weight:800;font-size:46px;line-height:1.25">Manda no direct. A gente responde.</p></div>
    ${linkArea(1100, "OU TOQUE NO LINK DO GUIA")}`, S.w, S.h, `${String(DUV.length + 2).padStart(2, "0")}/${String(DUV.length + 2).padStart(2, "0")}`),
];

// ---------- CTA: GRUPO DE ESPERA DOS SIMULADOS ----------
const RECURSOS = [
  ["Simulados no padrão da sua banca", "AOCP, FGV, Cebraspe e outras, com base no último edital.", "alvo"],
  ["Caderno de Erros automático", "Modo Redenção: cada erro vira missão até ficar dominado.", "livro"],
  ["Raio-X Tático", "Seu desempenho por disciplina e ranking.", "bussola"],
  ["Cartão-resposta com QR Code", "Imprima, marque e corrija pela câmera do celular.", "check"],
  ["Redação corrigida por foto", "Nota por critério e erros apontados linha a linha.", "check"],
  ["Flashcards e seu próprio edital", "Revisão espaçada e treino com o PDF do seu concurso.", "check"],
];
const simStories = [
  frame(`${header("// VEM AÍ")}
    <div style="position:absolute;left:0;right:0;top:330px;display:flex;justify-content:center"><img src="${SELO}" style="width:250px"></div>
    <div class="wrap" style="top:640px;text-align:center"><h1 style="font-size:118px">Simulados<br><span class="hit">Operação<br>Aprovação</span></h1></div>
    <div class="wrap" style="top:1110px;text-align:center"><p style="font-weight:800;font-size:44px;line-height:1.2">Simulados para concursos de segurança pública.</p></div>
    <div class="wrap" style="top:1290px;display:flex;flex-wrap:wrap;gap:14px;justify-content:center">${["PM", "PC", "PF", "PRF", "POLÍCIA PENAL", "GCM"].map((t) => `<span class="tag" style="color:#fff">${t}</span>`).join("")}</div>`, S.w, S.h, "01/03"),
  frame(`${header("// DENTRO DA PLATAFORMA")}${title(320, `Treine como no <span class="hit">dia da prova</span>`, 88)}
    ${listBox(620, RECURSOS, 12).replace(/padding:26px 28px/g, "padding:20px 26px")}
    <div class="wrap" style="top:1555px"><p class="disc">Recursos variam conforme o plano.</p></div>`, S.w, S.h, "02/03"),
  frame(`${header("// GRUPO DE ESPERA")}${title(320, `Entre no<br><span class="hit">grupo de espera</span>`, 104)}
    ${listBox(640, [
      ["Seja o primeiro a receber a plataforma", "Quem está no grupo é avisado antes de todo mundo.", "alvo"],
      ["Desconto exclusivo", "Condição especial só para quem está no grupo.", "check"],
      ["Grupo no WhatsApp", "Entrar é gratuito.", "check"],
    ])}
    <div class="wrap" style="top:1240px"><div class="btn" style="height:130px;font-size:50px">Quero entrar no grupo</div></div>
    ${linkArea(1420)}
    <div class="wrap" style="top:1515px;text-align:center"><p class="disc">Plataforma educacional independente. Não garantimos aprovação.</p></div>`, S.w, S.h, "03/03"),
];

// Feed 1080×1350 (carrossel)
const F = { w: 1080, h: 1350 };
const simFeed = [
  frame(`<div class="wrap" style="top:110px"><div class="lbl">// VEM AÍ</div></div>
    <div style="position:absolute;right:100px;top:160px"><img src="${SELO}" style="width:170px"></div>
    <div class="wrap" style="top:380px"><h1 style="font-size:122px">Simulados<br><span class="hit">Operação<br>Aprovação</span></h1><div class="bar" style="margin-top:30px"></div></div>
    <div class="wrap" style="top:880px"><p style="font-weight:800;font-size:46px;line-height:1.2">Simulados para concursos de segurança pública.</p></div>
    <div class="wrap" style="top:1080px"><div class="btn" style="height:110px;font-size:42px">Entre no grupo de espera →</div></div>`, F.w, F.h, "01/04"),
  frame(`<div class="wrap" style="top:110px"><div class="lbl">// DENTRO DA PLATAFORMA</div></div>
    <div class="wrap" style="top:170px"><h1 style="font-size:76px">Treine como no<br><span class="hit">dia da prova</span></h1></div>
    ${listBox(380, RECURSOS.slice(0, 3), 14)}`, F.w, F.h, "02/04"),
  frame(`<div class="wrap" style="top:110px"><div class="lbl">// TECNOLOGIA</div></div>
    <div class="wrap" style="top:170px"><h1 style="font-size:76px">Do papel ao resultado<br><span class="hit">pelo celular</span></h1></div>
    ${listBox(470, RECURSOS.slice(3), 14)}
    <div class="wrap" style="top:1180px"><p class="disc">Recursos variam conforme o plano.</p></div>`, F.w, F.h, "03/04"),
  frame(`<div class="wrap" style="top:110px"><div class="lbl">// GRUPO DE ESPERA</div></div>
    <div class="wrap" style="top:170px"><h1 style="font-size:88px">Quem entra<br><span class="hit">primeiro</span> ganha</h1></div>
    ${listBox(450, [["Recebe a plataforma antes", "Aviso em primeira mão no lançamento.", "alvo"], ["Desconto exclusivo", "Só para quem está no grupo.", "check"]], 14)}
    <div class="wrap" style="top:930px"><div class="btn" style="height:120px;font-size:46px">Link na bio →</div></div>
    <div class="wrap" style="top:1110px;text-align:center"><p class="disc">Grupo gratuito no WhatsApp. Plataforma educacional independente.<br>Não garantimos aprovação.</p></div>`, F.w, F.h, "04/04"),
];

// ---------- render ----------
// ---------- KIT: 2 e-books pelo preço de 1 ----------
const PROMPTS_CAPA = "data:image/jpeg;base64," + fs.readFileSync(path.join(ROOT, "assets", "capa-prompts.jpg")).toString("base64");
const kitCovers = (top, w) => `<div style="position:absolute;left:0;right:0;top:${top}px;display:flex;justify-content:center;gap:28px">
  <img src="${CAPA}" style="width:${w}px;transform:rotate(-4deg);box-shadow:0 30px 70px rgba(0,0,0,.7),0 0 50px rgba(227,25,43,.3)">
  <img src="${PROMPTS_CAPA}" style="width:${w}px;aspect-ratio:640/908;object-fit:cover;transform:rotate(4deg);box-shadow:0 30px 70px rgba(0,0,0,.7),0 0 50px rgba(227,25,43,.3)"></div>`;
const KIT_ITENS = [
  ["Guia do Concurseiro Policial Cibernético", "Método Bússola, 22 comandos prontos e caderno de erros automatizado.", "bussola"],
  ["IA para Concursos Policiais · 60 prompts", "Questões, revisões e plano de estudo a partir do seu material.", "livro"],
  ["Todos os bônus", "NotebookLM, roteiro de 7 dias, checklist de conferência e índice por necessidade.", "check"],
  ["Desconto na plataforma de simulados", "Exclusivo para quem compra o kit, no lançamento.", "alvo"],
];
const kitStory = frame(`${header("// KIT CONCURSEIRO POLICIAL COM IA")}${title(320, `2 e-books pelo<br><span class="hit">preço de 1</span>`, 104)}
  ${kitCovers(640, 330)}
  <div class="wrap" style="top:1180px;text-align:center"><div class="mono gray" style="font-size:30px">SEPARADOS: <s>R$ 94</s></div>
  <div style="font-weight:900;font-size:120px;letter-spacing:-4px;line-height:1">R$ <span class="red">47</span></div></div>
  ${linkArea(1430, "TOQUE NO LINK")}
  <div class="wrap" style="top:1515px;text-align:center"><p class="disc">Material educacional independente. Não garantimos aprovação.</p></div>`, S.w, S.h);
const kitFeed = [
  frame(`<div class="wrap" style="top:110px"><div class="lbl">// KIT CONCURSEIRO POLICIAL COM IA</div></div>
    <div class="wrap" style="top:170px"><h1 style="font-size:100px">2 e-books pelo<br><span class="hit">preço de 1</span></h1></div>
    ${kitCovers(480, 270)}
    <div class="wrap" style="top:950px;text-align:center"><div class="mono gray" style="font-size:28px">SEPARADOS: <s>R$ 94</s></div>
    <div style="font-weight:900;font-size:104px;letter-spacing:-4px;line-height:1">R$ <span class="red">47</span></div></div>
    <div class="wrap mono" style="top:1180px;text-align:center;font-size:28px">ARRASTA →</div>`, F.w, F.h, "01/02"),
  frame(`<div class="wrap" style="top:110px"><div class="lbl">// O QUE VEM NO KIT</div></div>
    <div class="wrap" style="top:170px"><h1 style="font-size:84px">Organize <span class="hit">e</span> estude<br>com IA</h1></div>
    ${listBox(400, KIT_ITENS, 12).replace(/padding:26px 28px/g, "padding:20px 26px")}
    <div class="wrap" style="top:1110px"><div class="btn" style="height:104px;font-size:44px">Link na bio →</div></div>
    <div class="wrap" style="top:1235px;text-align:center"><p class="disc">E-books em PDF · garantia de 7 dias · não garantimos aprovação.</p></div>`, F.w, F.h, "02/02"),
];

// ---------- PROMOÇÃO: em vez de 1 e-book, leve 2 ----------
const card1 = (img, nome, w) => `<div style="display:flex;flex-direction:column;align-items:center;gap:14px">
  <img src="${img}" style="width:${w}px;aspect-ratio:640/908;object-fit:cover;border-radius:6px;box-shadow:0 26px 60px rgba(0,0,0,.7),0 0 46px rgba(227,25,43,.3)">
  <span class="mono" style="font-size:${Math.round(w / 12)}px;text-align:center;line-height:1.3">${nome}</span></div>`;
const plus = (s) => `<div style="font-weight:900;font-size:${s}px;color:#E3192B;line-height:1;align-self:center;margin-bottom:60px">+</div>`;
const duo = (top, w, plusSize) => `<div style="position:absolute;left:0;right:0;top:${top}px;display:flex;justify-content:center;gap:26px">
  ${card1(CAPA, "GUIA CIBERNÉTICO", w)}${plus(plusSize)}${card1(PROMPTS_CAPA, "60 PROMPTS", w)}</div>`;
const antesDepois = (top, fs) => `<div class="wrap" style="top:${top}px;display:grid;grid-template-columns:1fr 1fr;gap:14px">
  <div class="box" style="padding:22px 24px;border-left-color:#2A2A32;opacity:.75"><div class="mono gray" style="font-size:${fs - 6}px">ANTES</div>
    <div style="font-weight:900;font-size:${fs}px;margin-top:6px">1 e-book</div><div class="mono gray" style="font-size:${fs - 4}px;margin-top:4px">R$ 47</div></div>
  <div class="box" style="padding:22px 24px;border-color:#E3192B;background:rgba(227,25,43,.14)"><div class="mono red" style="font-size:${fs - 6}px">AGORA</div>
    <div style="font-weight:900;font-size:${fs}px;margin-top:6px">2 e-books + bônus</div><div class="mono" style="font-size:${fs - 4}px;margin-top:4px">R$ 47</div></div></div>`;
const PROMO_ITENS = [
  ["Guia do Concurseiro Policial Cibernético", "Método Bússola, 22 comandos prontos e caderno de erros automatizado.", "bussola"],
  ["IA para Concursos Policiais", "60 prompts + biblioteca resumida para consulta rápida.", "livro"],
  ["4 bônus", "NotebookLM, roteiro de 7 dias, checklist de conferência e índice por necessidade.", "check"],
  ["Desconto na plataforma de simulados", "Exclusivo para quem compra o kit, no lançamento.", "alvo"],
];
const promoStories = [
  frame(`${header("// PROMOÇÃO · OPERAÇÃO APROVAÇÃO")}
    <div class="wrap" style="top:330px"><h1 style="font-size:96px">Em vez de<br>1 e-book…</h1></div>
    <div class="wrap" style="top:560px"><h1 style="font-size:150px"><span class="hit">leve 2</span></h1><div class="bar" style="margin-top:22px"></div></div>
    ${duo(820, 300, 110)}
    <div class="wrap" style="top:1380px;text-align:center"><div style="font-weight:900;font-size:56px;letter-spacing:-1px">pelo preço de <span class="red">1</span></div></div>`, S.w, S.h, "01/03"),
  frame(`${header("// O QUE VOCÊ LEVA")}${title(320, `2 e-books<br><span class="hit">+ 4 bônus</span>`, 104)}
    ${listBox(640, PROMO_ITENS, 22)}
    <div class="wrap" style="top:1460px;text-align:center"><p class="mono" style="font-size:30px">TUDO NA MESMA COMPRA 🎯</p></div>`, S.w, S.h, "02/03"),
  frame(`${header("// MESMO PREÇO, O DOBRO DE MATERIAL")}
    <div style="position:absolute;left:0;right:0;top:320px;display:flex;justify-content:center"><img src="${SELO}" style="width:170px"></div>
    ${antesDepois(530, 50)}
    <div class="wrap" style="top:900px;text-align:center"><div class="mono gray" style="font-size:32px">SEPARADOS: <s>R$ 94</s></div>
      <div style="font-weight:900;font-size:190px;letter-spacing:-8px;line-height:1">R$ <span class="red">47</span></div>
      <div class="mono" style="font-size:26px;margin-top:6px">pagamento único · garantia de 7 dias</div></div>
    <div class="wrap" style="top:1260px"><div class="btn" style="height:130px;font-size:52px">Quero os 2 e-books</div></div>
    ${linkArea(1420, "TOQUE NO LINK")}
    <div class="wrap" style="top:1510px;text-align:center"><p class="disc">E-books em PDF. Material educacional independente. Não garantimos aprovação.</p></div>`, S.w, S.h, "03/03"),
];
const promoFeed = frame(`<div class="wrap" style="top:100px"><div class="lbl">// PROMOÇÃO</div></div>
  <div class="wrap" style="top:150px"><h1 style="font-size:78px">Em vez de 1 e-book,<br><span class="hit">leve 2</span> pelo preço de 1</h1></div>
  ${duo(420, 230, 90)}
  ${antesDepois(880, 32)}
  <div class="wrap" style="top:1060px;display:flex;align-items:center;justify-content:space-between">
    <div><div class="mono gray" style="font-size:24px">SEPARADOS: <s>R$ 94</s></div><div style="font-weight:900;font-size:96px;letter-spacing:-4px;line-height:1">R$ <span class="red">47</span></div></div>
    <div class="btn" style="height:96px;padding:0 34px;font-size:38px">Link na bio →</div></div>
  <div class="wrap" style="top:1240px"><p class="disc">+ 4 bônus e desconto exclusivo na plataforma de simulados no lançamento. Garantia de 7 dias.</p></div>`, F.w, F.h);
const Q = { w: 1080, h: 1080 };
const promoQuadrado = frame(`<div class="wrap" style="top:96px;text-align:center"><div class="lbl">// PROMOÇÃO · OPERAÇÃO APROVAÇÃO</div></div>
  <div class="wrap" style="top:150px;text-align:center"><h1 style="font-size:84px">Em vez de 1,<br><span class="hit">leve 2 e-books</span></h1></div>
  ${duo(390, 210, 84)}
  <div class="wrap" style="top:850px;text-align:center"><span class="mono gray" style="font-size:26px">SEPARADOS: <s>R$ 94</s> · </span>
    <span style="font-weight:900;font-size:76px;letter-spacing:-3px">R$ <span class="red">47</span></span></div>
  <div class="wrap mono" style="top:968px;text-align:center;font-size:22px">+ 4 BÔNUS · GARANTIA DE 7 DIAS</div>`, Q.w, Q.h);

const jobs = [
  ["destaques/capas/capa-o-guia.png", capa("livro", "O GUIA"), S],
  ["destaques/capas/capa-metodo-bussola.png", capa("bussola", "MÉTODO BÚSSOLA"), S],
  ["destaques/capas/capa-duvidas.png", capa("duvida", "DÚVIDAS"), S],
  ...guia.map((h, i) => [`destaques/o-guia/${String(i + 1).padStart(2, "0")}.png`, h, S]),
  ...bussola.map((h, i) => [`destaques/metodo-bussola/${String(i + 1).padStart(2, "0")}.png`, h, S]),
  ...duvidas.map((h, i) => [`destaques/duvidas/${String(i + 1).padStart(2, "0")}.png`, h, S]),
  ...simStories.map((h, i) => [`simulados/stories/${String(i + 1).padStart(2, "0")}.png`, h, S]),
  ...simFeed.map((h, i) => [`simulados/feed-carrossel/${String(i + 1).padStart(2, "0")}.png`, h, F]),
  ["kit/story-kit.png", kitStory, S],
  ...promoStories.map((h, i) => [`kit/promo-story-${String(i + 1).padStart(2, "0")}.png`, h, S]),
  ["kit/promo-feed.png", promoFeed, F],
  ["kit/promo-quadrado.png", promoQuadrado, Q],
  ...kitFeed.map((h, i) => [`kit/feed-${String(i + 1).padStart(2, "0")}.png`, h, F]),
];
const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 1 });
for (const [out, html, size] of jobs) {
  await page.setViewportSize({ width: size.w, height: size.h });
  await page.setContent(html, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  const file = path.join(ROOT, out);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  await page.screenshot({ path: file });
}
await browser.close();
console.log(`${jobs.length} artes geradas`);
