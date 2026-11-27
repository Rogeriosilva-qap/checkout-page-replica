import { createFileRoute, Link } from "@tanstack/react-router";
import { CONFIG, getKitCheckoutHref, getSimuladosHref } from "@/config";
import capaPrompts from "@/assets/capa-ebook.jpg.asset.json";
import logo from "@/assets/logo-operacao-aprovacao.png.asset.json";

const URL_PAGE = "https://operacaoaprovacaoebooks.com.br/kit-concurseiro-policial";
const TITLE = "Kit Concurseiro Policial com IA: 2 e-books pelo preço de 1 | Operação Aprovação";
const DESC =
  "O Guia do Concurseiro Policial Cibernético e o IA para Concursos Policiais (60 prompts) em um só kit, com todos os bônus e desconto exclusivo na plataforma de simulados.";

export const Route = createFileRoute("/kit-concurseiro-policial")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: "Kit Concurseiro Policial com IA · 2 e-books pelo preço de 1" },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "product" },
      { property: "og:url", content: URL_PAGE },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: URL_PAGE }],
  }),
  component: KitPage,
});

function BuyButton({ label }: { label?: string }) {
  const href = getKitCheckoutHref();
  const text = label ?? `Quero o kit por ${CONFIG.kitPriceText}`;
  return href ? (
    <a className="kit-btn" href={href} target="_blank" rel="noopener noreferrer">{text}</a>
  ) : (
    <>
      <a className="kit-btn" role="link" aria-disabled="true" tabIndex={0} onClick={(e) => e.preventDefault()}>{text}</a>
      <p className="kit-soon">Link de compra em breve.</p>
    </>
  );
}

const CIBER = [
  "Método Bússola: o edital vira micro-tópicos, prioridade Alfa, Bravo e Charlie e calendário",
  "22 comandos prontos para copiar e colar, com campos para o seu cargo e banca",
  "Simulados nos formatos Cebraspe, FGV e Instituto AOCP",
  "Mapas mentais em texto e em código Mermaid",
  "Planilha de caderno de erros com fórmulas e passo a passo para importar flashcards no Anki",
  "Fichas de 5 ferramentas e índice clicável dos 22 comandos",
];
const PROMPTS = [
  "60 modelos de prompt para transformar seu material em questões, revisões e plano de estudo",
  "E-book completo de 70 páginas com o método e três demonstrações completas",
  "Biblioteca resumida de prompts em um PDF separado, para consulta rápida",
];
const BONUS: [string, string][] = [
  ["Configurar NotebookLM", "Passo a passo para montar seu caderno de estudo com edital, lei seca e apostilas, e perguntar à IA a partir das suas fontes."],
  ["Roteiro de 7 dias", "Objetivo, atividade, tempo estimado e critério de conferência para cada dia da primeira semana."],
  ["Checklist de conferência", "Uma lista prática para checar números, prazos e exceções na fonte antes de memorizar."],
  ["Índice por necessidade", "12 situações comuns, cada uma com o código e a página do modelo indicado."],
];
const FAQ: [string, string][] = [
  ["O que vem no kit?", "Os dois e-books completos em PDF: o Guia Definitivo do Concurseiro Policial Cibernético e o IA para Concursos Policiais (60 prompts, com a biblioteca resumida em PDF separado), mais todos os bônus que já acompanham cada um."],
  ["Qual a diferença entre os dois e-books?", "O Guia Cibernético ajuda a organizar o estudo: transformar o edital em plano, priorizar e montar o caderno de erros. O IA para Concursos Policiais ajuda a estudar o conteúdo: gerar questões, revisões e explicações a partir do seu material. Um completa o outro."],
  ["É curso em vídeo?", "Não. São e-books em PDF, sem aulas em vídeo, e não incluem assinatura de ferramentas de IA."],
  ["Como funciona o desconto na plataforma de simulados?", "A plataforma Simulados Operação Aprovação já está no ar. Para informações sobre as condições do desconto exclusivo do kit, fale com o suporte da Operação Aprovação."],
  ["Tem garantia?", `Sim. Garantia de ${CONFIG.guaranteeDays} dias: leia, teste no seu estudo e decida com calma.`],
];

function KitPage() {
  const simuladosHref = getSimuladosHref();
  return (
    <main className="kit">
      <header className="kit-head">
        <Link to="/links" className="kit-brand">
          <img src={logo.url} alt="" width={44} height={44} />
          <span>Operação Aprovação</span>
        </Link>
      </header>

      <section className="kit-hero">
        <p className="kit-label">// KIT CONCURSEIRO POLICIAL COM IA</p>
        <h1>
          2 e-books pelo <em>preço de 1</em>
        </h1>
        <p className="kit-lead">
          Organize o edital <strong>e</strong> estude o conteúdo com inteligência artificial: o Guia do Concurseiro Policial Cibernético e o IA
          para Concursos Policiais juntos, com todos os bônus e desconto exclusivo na plataforma de simulados.
        </p>
        <div className="kit-covers" aria-hidden="true">
          <img src="/kit/capa-cibernetico.jpg" alt="" width={640} height={908} />
          <img src={capaPrompts.url} alt="" />
        </div>
        <div className="kit-price">
          <span className="kit-sep">Separados: <s>{CONFIG.kitSeparatePriceText}</s></span>
          <strong>{CONFIG.kitPriceText}</strong>
          <span className="kit-micro">no kit · pagamento único · garantia de {CONFIG.guaranteeDays} dias</span>
        </div>
        <BuyButton />
      </section>

      <section className="kit-sec">
        <h2>O que vem no kit</h2>
        <div className="kit-two">
          <article className="kit-card">
            <p className="kit-tag">E-BOOK 1 · ORGANIZAR O ESTUDO</p>
            <h3>Guia Definitivo do Concurseiro Policial Cibernético</h3>
            <ul>{CIBER.map((t) => <li key={t}>{t}</li>)}</ul>
            <Link to="/concurseiro-cibernetico" className="kit-more">Ver detalhes do guia →</Link>
          </article>
          <article className="kit-card">
            <p className="kit-tag">E-BOOK 2 · ESTUDAR O CONTEÚDO</p>
            <h3>IA para Concursos Policiais · 60 prompts</h3>
            <ul>{PROMPTS.map((t) => <li key={t}>{t}</li>)}</ul>
            <Link to="/" className="kit-more">Ver detalhes do e-book →</Link>
          </article>
        </div>
      </section>

      <section className="kit-sec">
        <h2>Bônus inclusos</h2>
        <div className="kit-bonus">
          {BONUS.map(([t, d]) => (
            <article key={t}><h3>{t}</h3><p>{d}</p></article>
          ))}
        </div>
      </section>

      <section className="kit-sec">
        <div className="kit-plat">
          <p className="kit-tag">EXCLUSIVO PARA QUEM COMPRA O KIT</p>
          <h2>Desconto na plataforma Simulados Operação Aprovação</h2>
          <p>
            A plataforma Simulados Operação Aprovação já está no ar. Simulados no padrão da sua banca: crie sua conta e faça o 1º simulado grátis.
          </p>
          <p>
            Para informações sobre as condições do desconto exclusivo do kit, fale com o suporte da Operação Aprovação.
          </p>
          {simuladosHref && <a className="kit-btn" href={simuladosHref} target="_blank" rel="noopener noreferrer">Criar conta e fazer o 1º simulado grátis</a>}
        </div>
      </section>

      <section className="kit-sec kit-final">
        <h2>Os dois e-books por {CONFIG.kitPriceText}</h2>
        <p className="kit-micro">Em vez de {CONFIG.kitSeparatePriceText} comprando separados.</p>
        <BuyButton />
      </section>

      <section className="kit-sec">
        <h2>Dúvidas</h2>
        {FAQ.map(([q, a]) => (
          <details key={q}><summary>{q}</summary><p>{a}</p></details>
        ))}
      </section>

      <footer className="kit-foot">
        <p>Material educacional independente, sem vínculo com bancas, órgãos públicos ou empresas de tecnologia. Não garantimos aprovação.</p>
        <p>
          {CONFIG.contactText} · <Link to="/politica-de-privacidade">Privacidade</Link> · <Link to="/termos-de-uso">Termos</Link>
        </p>
      </footer>
    </main>
  );
}
