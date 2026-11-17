import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { CONFIG, getCyberCheckoutHref, getCyberWaitlistHref } from "@/config";
import { copyAdvertorialPrompt } from "@/lib/copy-advertorial-prompt";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo-operacao-aprovacao.png.asset.json";

const URL_PAGE = "https://operacaoaprovacaoebooks.com.br/concurseiro-cibernetico";
const TITLE = "O Guia Definitivo do Concurseiro Policial Cibernético | Operação Aprovação";
const DESC = "Como usar inteligência artificial para dominar editais, criar simulados e acelerar sua posse.";
const PRICE = "R$ 37,00";
const CTA = `Quero o guia por ${PRICE}`;

export const Route = createFileRoute("/concurseiro-cibernetico")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "product" },
      { property: "og:url", content: URL_PAGE },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: URL_PAGE }],
  }),
  component: CyberPage,
});

function BuyButton({ linkRef, children = CTA }: { linkRef?: RefObject<HTMLAnchorElement | null>; children?: ReactNode }) {
  const href = getCyberCheckoutHref();
  return (
    <div>
      {href ? (
        <a ref={linkRef} className="btn-c" href={href} target="_blank" rel="noopener noreferrer">{children}</a>
      ) : (
        <a ref={linkRef} className="btn-c" role="link" aria-disabled="true" tabIndex={0} onClick={(e) => e.preventDefault()}>{children}</a>
      )}
      {!href && <p className="soon">Link de compra em breve.</p>}
    </div>
  );
}

const CMD: (string | { f: string })[] = [
  "Crie ", { f: "[10]" }, " itens de certo ou errado sobre o texto abaixo, no formato usado em provas do Cebraspe: uma afirmação por item, que o candidato julga como C (certo) ou E (errado).\nRegras:\n- Use apenas o texto fornecido. Nos itens errados, a alteração deve estar em uma palavra ou expressão identificável (prazo, sujeito, verbo, exceção).\n- Apresente um item por vez e espere minha resposta.\n- Depois de cada resposta, dê o gabarito, a justificativa e o trecho do texto que a comprova.\n- No final, mostre meus acertos e erros e calcule a nota pelo critério ",
  { f: "[um errado anula um certo / sem desconto]" }, ".\nIdentifique os itens como exercícios de treino, não como questões da banca.\nTEXTO: ", { f: "[cole aqui]" },
];

const OPS: [string, string][] = [
  ["OP 01 · Método Bússola", "transforme o edital em micro-tópicos com prioridade Alfa, Bravo e Charlie, e em um cronograma com margem para imprevistos."],
  ["OP 02 · Engenharia de prompt", "comandos prontos para resumir lei seca (como a LEP), criar mapas mentais e gerar simulados nos formatos de Cebraspe, FGV e Instituto AOCP."],
  ["OP 03 · Arsenal", "qual ferramenta usar em cada missão (ChatGPT, Claude, Gemini Notebook, Anki e planilha) e regras de segurança para não expor seus dados."],
  ["OP 04 · Fim do erro manual", "caderno de erros com fórmulas prontas, flashcards importáveis no Anki e revisões com data marcada."],
];

const FAQ: [string, string][] = [
  ["O que é o Método Bússola e como ele ajuda no meu estudo?", "É o método do guia para transformar o edital em um mapa de estudo: em vez de encarar uma lista extensa de conteúdos sem saber por onde começar, você usa a IA para dividir os assuntos em micro-tópicos, organizá-los por prioridade Alfa, Bravo e Charlie e montar um cronograma com margem para imprevistos. O processo tem 4 fases e inclui a checagem do mapa com o edital oficial, para conferir se algo ficou de fora. O benefício é ter mais clareza sobre o que estudar e reduzir o trabalho de organização — especialmente para quem concilia estudo, trabalho e escala. No e-book, você encontra o passo a passo e os comandos para aplicar o método ao seu edital, sem precisar montar tudo do zero. A IA apoia o planejamento; a conferência e o estudo continuam com você."],
  ["É um curso ou um e-book?", "É um e-book em PDF, sem aulas em vídeo."],
  ["Preciso saber usar IA?", "Não. Os comandos já vêm prontos; você troca os campos entre colchetes e cola o texto que vai estudar."],
  ["Funciona com ferramentas gratuitas?", "Os comandos são textos para copiar e colar e podem ser usados em ferramentas que aceitem pedidos por escrito, inclusive versões gratuitas. Recursos e limites variam entre ferramentas e planos."],
  ["A IA pode errar mesmo com esses comandos?", "Sim. Os comandos reduzem o espaço para erro, mas não o eliminam. Por isso o guia tem uma etapa de conferência em cada operação."],
];

function CyberPage() {
  const heroRef = useRef<HTMLAnchorElement>(null);
  const offerRef = useRef<HTMLAnchorElement>(null);
  const finalRef = useRef<HTMLAnchorElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const [showBar, setShowBar] = useState(false);
  const [copied, setCopied] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const onPointer = (event: PointerEvent) => {
      if (event.target instanceof Node && !menuRef.current?.contains(event.target)) setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [menuOpen]);

  useEffect(() => {
    const els = [heroRef, offerRef, finalRef].map((r) => r.current).filter(Boolean) as Element[];
    const visible = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
      setShowBar(visible.size === 0);
    });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  async function copy() {
    if (!preRef.current) return;
    const ok = await copyAdvertorialPrompt(preRef.current);
    setCopied(ok ? "Comando copiado." : "Não foi possível copiar. O texto foi selecionado para você copiar.");
  }

  return (
    <div className="cyber">
      <header className="cyber-top grid-bg">
        <div className="cw" ref={menuRef}>
          <Link to="/" className="brand"><img src={logo.url} alt="" width={32} height={32} />Operação Aprovação</Link>
          <Button ref={menuButtonRef} type="button" variant="ghost" size="icon" className="cy-menu-toggle" aria-label={menuOpen ? "Fechar menu de páginas" : "Abrir menu de páginas"} aria-expanded={menuOpen} aria-controls="cy-menu" onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </Button>
          <nav id="cy-menu" className="cy-menu" aria-label="Páginas da Operação Aprovação" hidden={!menuOpen}>
            <Link to="/" onClick={() => setMenuOpen(false)}>E-books</Link>
            <span aria-current="page">Concurseiro Policial Cibernético</span>
            <Link to="/ia-para-concursos" onClick={() => setMenuOpen(false)}>Blog</Link>
            <Link to="/explicar-questao" onClick={() => setMenuOpen(false)}>Explicar questão</Link>
            <Link to="/termos-de-uso" onClick={() => setMenuOpen(false)}>Termos de uso</Link>
            <Link to="/politica-de-privacidade" onClick={() => setMenuOpen(false)}>Política de privacidade</Link>
          </nav>
        </div>
      </header>
      <main>
        <section className="cyber-hero grid-bg" aria-labelledby="cy-h1">
          <div className="cw">
            <div>
              <span className="label">// E-BOOK DIGITAL EM PDF</span>
              <h1 id="cy-h1">Pare de gastar horas organizando. Use a IA para mapear o edital, treinar e revisar.</h1>
              <p className="mu">22 comandos prontos, o Método Bússola para fatiar editais e um caderno de erros automatizado, para quem estuda para Polícia Penal, PM, PC, PF, PRF ou Guarda Municipal.</p>
              <p className="price">{PRICE}</p>
              <BuyButton linkRef={heroRef} />
              <p className="micro">E-book em PDF com 38 páginas, sumário e links clicáveis para consultar no celular.</p>
            </div>
            {/* CAPA: componente em HTML/CSS provisório. Quando houver a capa real, troque este bloco
                por <img src={capaReal.url} alt="Capa do e-book ..." /> (asset em src/assets). */}
            <div className="cyber-cover grid-bg" role="img" aria-label="Capa do e-book O Guia Definitivo do Concurseiro Policial Cibernético">
              <img src={logo.url} alt="" />
              <span className="c1">O GUIA DEFINITIVO DO</span>
              <span className="c2">CONCURSEIRO</span>
              <span className="c2">POLICIAL</span>
              <span className="c3">CIBERNÉTICO</span>
            </div>
          </div>
        </section>

        <section className="sec" aria-labelledby="cy-s2"><div className="cw">
          <h2 id="cy-s2">O tempo que o estudo analógico consome</h2>
          <div className="cards">
            <div className="card"><p>Copiar o conteúdo programático para o caderno e decidir sozinho por onde começar.</p></div>
            <div className="card"><p>Montar lista de exercícios e cronograma à mão, e refazer tudo a cada plantão extra.</p></div>
            <div className="card"><p>Procurar o que você errou semanas atrás, sem saber o que revisar.</p></div>
          </div>
          <p><strong className="hl">A IA faz esse trabalho operacional em minutos.</strong> O guia mostra como pedir e como conferir o resultado.</p>
        </div></section>

        <section className="sec" aria-labelledby="cy-s3"><div className="cw">
          <h2 id="cy-s3">As 4 operações do guia</h2>
          <ol className="cards" style={{ listStyle: "none", padding: 0 }}>
            {OPS.map(([t, d]) => (
              <li key={t} className="card"><span className="op">{t.split(" · ")[0]}</span><h3>{t.split(" · ")[1]}</h3><p>{d.charAt(0).toUpperCase() + d.slice(1)}</p></li>
            ))}
          </ol>
        </div></section>

        <section className="sec" aria-labelledby="cy-s4"><div className="cw">
          <h2 id="cy-s4">Um dos 22 comandos, como está no guia</h2>
          <div className="term">
            <div className="term-head"><span>CMD-12 · Simulado certo ou errado (formato Cebraspe)</span>
              <button type="button" className="btn-copy" onClick={copy}>Copiar o comando</button>
            </div>
            <pre ref={preRef}>{CMD.map((p, i) => (typeof p === "string" ? p : <b key={i}>{p.f}</b>))}</pre>
          </div>
          <p className="mu" aria-live="polite" style={{ marginTop: 10 }}>{copied}</p>
          <p className="mu">Pode usar agora: troque os campos entre colchetes e cole um trecho da lei copiado da fonte oficial.</p>
        </div></section>

        <section className="sec" aria-labelledby="cy-s5"><div className="cw">
          <div className="rule">
            <h2 id="cy-s5">Regra de engajamento nº 1</h2>
            <p>Nenhuma resposta de IA vira matéria de estudo antes de ser conferida na fonte: o edital no canal oficial, a lei na versão oficial, a questão com gabarito oficial. O guia ensina a usar a IA com conferência, porque ela pode errar prazos, artigos e números com total segurança.</p>
          </div>
        </div></section>

        <section className="sec" aria-labelledby="cy-s6"><div className="cw">
          <h2 id="cy-s6">O que vem no guia</h2>
          <ul className="dots">
            <li>22 comandos prontos para copiar e colar, com campos para o seu cargo e banca</li>
            <li>Método Bússola em 4 fases, com checagem do mapa</li>
            <li>Simulados nos formatos Cebraspe, FGV e Instituto AOCP</li>
            <li>Mapas mentais em texto e em código Mermaid</li>
            <li>Fichas de 5 ferramentas, com links para os sites oficiais</li>
            <li>Planilha de caderno de erros com fórmulas e passo a passo para importar flashcards no Anki</li>
            <li>Índice clicável dos 22 comandos</li>
          </ul>
        </div></section>

        <section className="sec" aria-labelledby="cy-s7"><div className="cw">
          <h2 id="cy-s7">Para quem é</h2>
          <div className="two">
            <div className="card"><h3>Combina com você se:</h3><ul className="dots">
              <li>estuda para carreiras de segurança pública;</li><li>já usa IA mas recebe respostas genéricas;</li>
              <li>concilia trabalho, escala e estudo;</li><li>aceita conferir as respostas nas fontes oficiais.</li></ul></div>
            <div className="card"><h3>O que ele não é:</h3><ul className="dots">
              <li>não é curso em vídeo;</li><li>não inclui assinatura de ferramentas de IA;</li>
              <li>não substitui edital, lei oficial nem questões reais;</li><li>não garante aprovação.</li></ul></div>
          </div>
        </div></section>

        <section className="sec" aria-labelledby="cy-s8"><div className="cw">
          <div className="offer">
            <span className="label">// OFERTA</span>
            <h2 id="cy-s8">O Guia Definitivo do Concurseiro Policial Cibernético</h2>
            <p className="mu mono">E-book digital em PDF · 38 páginas</p>
            <ul className="dots">{OPS.map(([t]) => <li key={t}>{t}</li>)}</ul>
            <p className="price">{PRICE}</p>
            <BuyButton linkRef={offerRef} />
          </div>
        </div></section>

        <section className="sec" aria-labelledby="cy-waitlist"><div className="cw">
          <div className="waitlist">
            <span className="label">// PRÓXIMA MISSÃO</span>
            <h2 id="cy-waitlist">Plataforma de simulados Operação Aprovação: entre no grupo de espera</h2>
            <p>Estamos finalizando uma plataforma de simulados no formato da sua banca, com cartão-resposta corrigido pelo celular, caderno de erros automático e correção de redação por foto. Quem entrar no grupo de espera do WhatsApp será avisado primeiro do lançamento e terá um desconto exclusivo.</p>
            {getCyberWaitlistHref() && (
              <a className="btn-w" href={getCyberWaitlistHref()!} target="_blank" rel="noopener noreferrer">Entrar no grupo de espera</a>
            )}
            <p className="micro">Grupo gratuito no WhatsApp. A plataforma ainda não foi lançada; os recursos podem mudar até o lançamento.</p>
          </div>
        </div></section>

        <section className="sec" aria-labelledby="cy-s9"><div className="cw">
          <h2 id="cy-s9">Perguntas frequentes</h2>
          {FAQ.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
          <details><summary>Qual a diferença para o e-book IA para Concursos Policiais?</summary>
            <p>O <Link to="/">IA para Concursos Policiais</Link> é a biblioteca completa de 60 prompts com o método de conferência. O Concurseiro Policial Cibernético é um guia mais curto e direto, focado em mapear o edital, gerar simulados por banca e automatizar o caderno de erros.</p>
          </details>
        </div></section>

        <section className="sec grid-bg" aria-labelledby="cy-s10"><div className="cw">
          <h2 id="cy-s10">Menos tempo organizando. Mais tempo estudando.</h2>
          <p className="mu">Se você quer usar a IA com método e conferência, o guia reúne os comandos, as planilhas e o passo a passo.</p>
          <BuyButton linkRef={finalRef} />
        </div></section>
      </main>

      <footer className="cf"><div className="cw">
        <p><strong>Operação Aprovação</strong> · Estudos para Segurança Pública</p>
        <p>CNPJ 70.147.280/0001-40</p>
        <p>Material educacional independente. Não garante aprovação e não tem vínculo com corporações policiais, bancas ou empresas de IA. ChatGPT, Claude, Gemini Notebook e Anki são marcas de seus titulares.</p>
        {CONFIG.supportEmail && <p><a href={`mailto:${CONFIG.supportEmail}`}>{CONFIG.contactText}</a></p>}
        {CONFIG.whatsappNumber && <p><a href={`https://wa.me/${CONFIG.whatsappNumber}`} target="_blank" rel="noopener noreferrer">WhatsApp: {CONFIG.whatsappText}</a></p>}
        <p>{CONFIG.termsUrl && <a href={CONFIG.termsUrl}>Termos de uso</a>}{" · "}{CONFIG.privacyUrl && <a href={CONFIG.privacyUrl}>Política de privacidade</a>}</p>
      </div></footer>

      <div className={`cbar${showBar ? " show" : ""}`} aria-hidden={!showBar}>
        <strong>{PRICE}</strong>
        <BuyButtonBar hidden={!showBar} />
      </div>
    </div>
  );
}

function BuyButtonBar({ hidden }: { hidden: boolean }) {
  const href = getCyberCheckoutHref();
  if (href) return <a className="btn-c" href={href} target="_blank" rel="noopener noreferrer" tabIndex={hidden ? -1 : 0}>{CTA}</a>;
  return <a className="btn-c" role="link" aria-disabled="true" tabIndex={hidden ? -1 : 0} onClick={(e) => e.preventDefault()}>Em breve · {PRICE}</a>;
}
