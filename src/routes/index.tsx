import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";

import { CONFIG, getPurchaseFaq } from "@/config";
import { Button } from "@/components/ui/button";
import { VisitorForms } from "@/components/visitor-forms";
import logo from "@/assets/logo-operacao-aprovacao.png.asset.json";
import capa from "@/assets/capa-ebook.jpg.asset.json";
import pag14 from "@/assets/pagina-14.jpg.asset.json";
import pag33 from "@/assets/pagina-33.jpg.asset.json";
import pag30 from "@/assets/pagina-30.jpg.asset.json";
import pag05 from "@/assets/pagina-05.jpg.asset.json";

export const Route = createFileRoute("/")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "IA para Concursos Policiais · E-book da Operação Aprovação" },
      {
        name: "description",
        content:
          "E-book digital com 60 modelos de prompt para transformar seu material de concurso em questões, revisões e plano de estudo com IA, conferindo as respostas nas fontes. Para PM, PC, Polícia Penal e GCM. R$ 47,00.",
      },
      { property: "og:type", content: "product" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:title", content: "IA para Concursos Policiais · E-book" },
      {
        property: "og:description",
        content:
          "60 modelos de prompt organizados por tarefa, 3 demonstrações completas e um passo a passo para conferir as respostas. R$ 47,00.",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://operacaoaprovacaoebooks.com.br/" },
      { property: "og:site_name", content: "Operação Aprovação" },
    ],
    links: [{ rel: "canonical", href: "https://operacaoaprovacaoebooks.com.br/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "Organization", name: "Operação Aprovação", url: "https://operacaoaprovacaoebooks.com.br/", email: "operacaoaprovacao.edu@gmail.com" },
            { "@type": "WebSite", name: "Operação Aprovação", url: "https://operacaoaprovacaoebooks.com.br/", inLanguage: "pt-BR" },
            {
              "@type": "Product",
              name: "IA para Concursos Policiais",
              description:
                "E-book digital em PDF com 60 modelos de prompt para transformar o edital em questões, revisões e plano de estudo com IA.",
              brand: { "@type": "Brand", name: "Operação Aprovação" },
              offers: {
                "@type": "Offer",
                price: "47.00",
                priceCurrency: "BRL",
                availability: "https://schema.org/InStock",
                url: "https://operacaoaprovacaoebooks.com.br/",
              },
            },
          ],
        }),
      },
    ],
  }),
  component: Index,
});

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

// Medição: só envia eventos se a página já tiver um dataLayer configurado por você.
function track(name: string, detail: Record<string, unknown>) {
  if (typeof window !== "undefined" && Array.isArray(window.dataLayer)) {
    window.dataLayer.push(Object.assign({ event: name }, detail));
  }
}

type CheckoutProps = {
  cta: string;
  id?: string;
  className?: string;
  tabIndex?: number;
  withMessage?: boolean;
  children: ReactNode;
  linkRef?: RefObject<HTMLAnchorElement | null>;
};

function CheckoutButton({ cta, id, className = "btn", tabIndex, withMessage = true, children, linkRef }: CheckoutProps) {
  const [msg, setMsg] = useState("");
  return (
    <>
      <Button asChild><a
        ref={linkRef}
        className={className}
        href={CONFIG.checkoutUrl || "#"}
        rel={CONFIG.checkoutUrl ? "noopener" : undefined}
        data-cta={cta}
        id={id}
        tabIndex={tabIndex}
        onClick={(e) => {
          track("checkout_click", { cta, price: 47, currency: "BRL" });
          if (!CONFIG.checkoutUrl) {
            e.preventDefault();
            console.warn("Checkout não configurado: preencha CONFIG.checkoutUrl.");
            if (withMessage) setMsg("O link de compra ainda não foi configurado nesta página.");
          }
        }}
      >
        {children}
      </a></Button>
      {withMessage && (
        <p className={msg ? "checkout-msg show" : "checkout-msg"} role="status">
          {msg}
        </p>
      )}
    </>
  );
}

const PAGES = [
  {
    src: pag14.url,
    cap: "Página 14: capítulo 2, com o modelo P02.",
    alt: "Página 14: fim do capítulo sobre conferência e o modelo P02, Comparar a resposta com a fonte.",
    title: "Um modelo de conferência",
    text: "Página 14: o P02 compara a resposta da IA com o texto, frase por frase.",
  },
  {
    src: pag33.url,
    cap: "Página 33: Demonstração A, conferência do erro.",
    alt: "Página 33: Demonstração A, com a afirmação errada, o trecho da lei e a correção.",
    title: "Um exemplo aplicado",
    text: "Página 33: a Demonstração A mostra como localizar um erro e corrigi-lo pela fonte.",
  },
  {
    src: pag30.url,
    cap: "Página 30: Demonstração C, semana reorganizada.",
    alt: "Página 30: tabela da semana reorganizada após um atraso, com o motivo de cada tarefa.",
    title: "Uma página de planejamento",
    text: "Página 30: a semana reorganizada depois de um atraso, com o motivo de cada tarefa.",
  },
  {
    src: pag05.url,
    cap: "Página 5: índice por necessidade.",
    alt: "Página 5: índice por necessidade, com situações e os modelos indicados.",
    title: "O índice por necessidade",
    text: "Página 5: você procura pelo problema e chega ao modelo.",
  },
];

function Index() {
  // Copiar modelo
  const cmdRef = useRef<HTMLDivElement>(null);
  const [copyStatus, setCopyStatus] = useState("");
  const copyModel = () => {
    const text = cmdRef.current?.innerText ?? "";
    const done = () => setCopyStatus(" Modelo copiado.");
    const fail = () => setCopyStatus(" Selecione o texto e copie manualmente.");
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, fail);
    else fail();
  };

  // Visualizador de páginas
  const dlgRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const [view, setView] = useState({ src: "", alt: "", cap: "" });
  const [zoom, setZoom] = useState(false);
  const openViewer = (btn: HTMLButtonElement, p: (typeof PAGES)[number]) => {
    openerRef.current = btn;
    setView({ src: p.src, alt: p.alt, cap: p.cap });
    setZoom(false);
    const dlg = dlgRef.current;
    if (dlg && typeof dlg.showModal === "function") dlg.showModal();
    else window.open(p.src);
  };

  // Barra fixa no celular: aparece quando nenhum botão principal está visível
  const heroRef = useRef<HTMLAnchorElement>(null);
  const offerRef = useRef<HTMLElement>(null);
  const finalRef = useRef<HTMLAnchorElement>(null);
  const [barOn, setBarOn] = useState(false);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const watched = [heroRef.current, offerRef.current, finalRef.current].filter(Boolean) as Element[];
    const visible = new Set<Element>();
    const update = () => setBarOn(visible.size === 0 && window.scrollY > 200);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => (en.isIntersecting ? visible.add(en.target) : visible.delete(en.target)));
      update();
    });
    watched.forEach((el) => io.observe(el));
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        update();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("bar-on", barOn);
    return () => document.body.classList.remove("bar-on");
  }, [barOn]);

  return (
    <>
      <a className="skip" href="#conteudo">
        Ir para o conteúdo
      </a>

      <header className="top">
        <div className="wrap">
          <div className="brand">
            <img src={logo.url} alt="" width={52} height={52} />
            <span>
              Operação Aprovação<small>Estudos para Segurança Pública</small>
            </span>
          </div>
          <div className="hero">
            <div className="hero-text">
              <span className="kind">E-book digital em PDF</span>
              <h1>Use IA para transformar seu edital em questões, revisões e um plano de estudo.</h1>
              <p className="lead">
                O e-book <strong>IA para Concursos Policiais</strong> reúne 60 modelos de prompt para quem estuda para PM, PC, Polícia Penal ou GCM. Aprenda a adaptar os comandos ao seu concurso e a conferir as respostas na fonte antes de usá-las no estudo.
                {" "}Use a IA como um “professor” de apoio sempre que desejar: para explicar um trecho, tirar dúvidas e treinar — sem deixar de conferir as respostas.
              </p>
              <p className="price">
                <span className="label">Preço de lançamento · pagamento único</span>
                {CONFIG.listPriceText && (
                  <span className="was">
                    De <s>{CONFIG.listPriceText}</s>
                  </span>
                )}
                <span className="value">{CONFIG.launchPriceText}</span>
              </p>
              <CheckoutButton cta="hero" id="cta-hero" className="btn btn-block" linkRef={heroRef}>
                Quero o e-book por {CONFIG.launchPriceText}
              </CheckoutButton>
              <Button asChild variant="link" className="sample-link"><a href="#modelo-p35">Ver um prompt na prática</a></Button>
              <ul className="badges" aria-label="Resumo da oferta">
                <li>Acesso pela plataforma, no celular e no PC</li>
                <li>Garantia de 7 dias</li>
                <li>60 modelos prontos</li>
                <li>PDF de 70 páginas</li>
              </ul>
              <p className="micro">
                Você recebe um arquivo PDF de 70 páginas, com sumário e links internos para consultar pelo celular.
              </p>
            </div>
            <figure className="cover">
              <img
                src={capa.url}
                width={816}
                height={1158}
                alt="Capa do e-book IA para Concursos Policiais, da Operação Aprovação."
              />
              <figcaption>Capa do e-book (arquivo digital)</figcaption>
            </figure>
            <ul className="gains">
              <li>
                Encontre o modelo pelo problema: “não entendi um artigo”, “errei e não sei por quê”, “atrasei o
                cronograma”.
              </li>
              <li>Veja o método aplicado em três demonstrações completas, do material de estudo até a revisão.</li>
              <li>Aprenda a localizar na fonte os números, prazos e exceções antes de memorizar.</li>
            </ul>
          </div>
        </div>
      </header>

      <main id="conteudo">
        <section className="problems" aria-labelledby="t-prob">
          <div className="wrap">
            <h2 id="t-prob">Se você já tentou estudar com IA, provavelmente já passou por isso</h2>
            <p className="narrow">
              A gente sabe: não é falta de vontade. Você estuda depois do trabalho, cansado, e ainda perde tempo com respostas que não ajudam. O pedido não diz à ferramenta o que entregar, e
              ninguém explicou como conferir o que ela respondeu.
            </p>
            <div className="plist">
              <article>
                <h3>Você pediu um resumo e veio texto demais</h3>
                <p>Sem formato nem limite, a resposta fica longa e mistura o que estava no texto com informações de fora.</p>
                <p className="fix">
                  <strong>No e-book:</strong> modelos que definem formato e tamanho e pedem resumo fiel às palavras da lei.
                </p>
              </article>
              <article>
                <h3>Você gerou questões e o gabarito veio junto</h3>
                <p>Com a resposta na tela, o exercício vira leitura.</p>
                <p className="fix">
                  <strong>No e-book:</strong> modelos que apresentam um item por vez e só corrigem depois da sua resposta.
                </p>
              </article>
              <article>
                <h3>Você aceitou uma explicação sem saber de onde ela veio</h3>
                <p>Um tom confiante não mostra se o artigo, o prazo ou a pena estão certos.</p>
                <p className="fix">
                  <strong>No e-book:</strong> um passo a passo de conferência, uma tabela de fontes por tipo de dúvida e
                  modelos que comparam a resposta com o texto original.
                </p>
              </article>
              <article>
                <h3>Seu cronograma não coube na semana</h3>
                <p>Um plano feito sem considerar trabalho, escala e cansaço costuma quebrar nos primeiros dias.</p>
                <p className="fix">
                  <strong>No e-book:</strong> modelos para mapear o tempo real, montar a semana com margem e replanejar
                  depois de um atraso.
                </p>
              </article>
              <article>
                <h3>Seus erros se acumulam e você não sabe o que revisar</h3>
                <p>Anotar só a resposta certa não mostra por que você errou.</p>
                <p className="fix">
                  <strong>No e-book:</strong> caderno de erros com o seu raciocínio, diagnóstico da dificuldade e data de
                  retomada.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section aria-labelledby="t-demo">
          <div className="wrap">
            <h2 id="t-demo">A diferença entre pedir e pedir com um modelo</h2>
            <p className="source">Trecho reproduzido do capítulo 3 do e-book.</p>
            <div className="compare">
              <div className="req vague">
                <h3>Pedido genérico</h3>
                <p className="quote">“Me explica legítima defesa.”</p>
                <p>
                  Sem material, a resposta vem do que a ferramenta aprendeu ou de páginas que você não escolheu. Sem
                  nível, formato ou limites, você não sabe o que esperar nem com o que comparar.
                </p>
              </div>
              <div className="req good">
                <h3>Pedido estruturado</h3>
                <ol className="parts">
                  <li>
                    <b>Contexto</b>Estudo para soldado da PM e estou começando Direito Penal.
                  </li>
                  <li>
                    <b>Tarefa e formato</b>Explique o texto abaixo em até 10 linhas, em linguagem simples. Depois, liste
                    as expressões que devo memorizar, exatamente como aparecem.
                  </li>
                  <li>
                    <b>Limites</b>Use apenas o texto. Se algo necessário não estiver nele, avise em vez de completar.
                  </li>
                  <li>
                    <b>Material</b>TEXTO: Art. 25 - Entende-se em legítima defesa quem, usando moderadamente dos meios
                    necessários, repele injusta agressão, atual ou iminente, a direito seu ou de outrem.
                  </li>
                </ol>
              </div>
            </div>
            <h3>O que muda na tarefa</h3>
            <ul className="changes">
              <li>A ferramenta trabalha sobre o texto que você colou, e você sabe exatamente onde conferir.</li>
              <li>O tamanho e o formato da resposta estão definidos antes de ela chegar.</li>
              <li>As expressões para memorizar vêm copiadas do texto, prontas para comparação.</li>
              <li>
                Quando faltar informação, o pedido orienta a ferramenta a avisar, em vez de completar por conta própria.
              </li>
            </ul>
            <p className="note">
              O e-book não mostra respostas lado a lado porque o resultado varia entre ferramentas. Fornecer o material
              reduz o espaço para erros, mas não os elimina. Por isso o livro ensina a conferir.
            </p>

            <h3 className="demo-sub">Um dos 60 modelos, como aparece no e-book</h3>
            <div className="card prompt-sample" id="modelo-p35" role="group" aria-labelledby="titulo-p35">
              <div className="card-head">
                <span className="code">P35</span>
                <h3 className="t" id="titulo-p35">Certo ou errado, um item por vez</h3>
              </div>
              <div className="card-body">
                <p>
                  <b>Use quando</b> quer treinar sem ver o gabarito, no formato certo ou errado.
                </p>
                <p>
                  <b>Forneça:</b> o texto estudado.
                </p>
                <ol className="howto">
                  <li>Copie o modelo abaixo.</li>
                  <li>Cole no ChatGPT, Claude, Gemini ou NotebookLM, junto com um trecho da sua matéria.</li>
                  <li>Responda C ou E e confira a justificativa no próprio texto.</li>
                </ol>
                <div className="cmd" id="p35" ref={cmdRef}>
                  {"Crie "}
                  <span className="f">[10]</span>
                  {
                    " itens de certo ou errado sobre o texto abaixo. Apresente um item por vez e espere minha resposta (C ou E). Depois de cada resposta, diga o gabarito, explique e mostre o trecho do texto que o comprova.\nNos itens errados, a alteração deve estar em uma palavra ou expressão identificável. Ao final, mostre quantos acertei e quais itens revisar.\nTEXTO: "
                  }
                  <span className="f">[cole aqui]</span>
                </div>
                <Button className="copy" type="button" onClick={copyModel}>
                  Copiar este modelo
                </Button>
                <span className="note" role="status" aria-live="polite">
                  {copyStatus}
                </span>
              </div>
            </div>
            <p className="note">
              Pode usar este modelo agora: troque os campos entre colchetes, incluindo os colchetes, e cole um trecho do
              seu material.
            </p>

            <h3 className="demo-sub">E como o livro ensina a conferir</h3>
            <p>
              Na Demonstração A, uma resposta ilustrativa traz um erro colocado de propósito. O exercício é encontrá-lo
              comparando palavra por palavra com o texto da lei.
            </p>
            <div className="check" role="group" aria-label="Exemplo de conferência do e-book">
              <div className="bad">
                <span className="tag">Erro na resposta</span>“A agressão deve ser atual, iminente{" "}
                <u>
                  <b>ou futura</b>
                </u>
                .” A expressão “ou futura” não aparece no texto.
              </div>
              <div className="src">
                <span className="tag">Trecho da fonte (Código Penal, art. 25, caput)</span>“(…) repele injusta
                agressão,{" "}
                <u>
                  <b>atual ou iminente</b>
                </u>
                , a direito seu ou de outrem.”
              </div>
              <div className="good">
                <span className="tag">Correção</span>A agressão deve ser atual ou iminente.
              </div>
            </div>
            <p className="note">
              Exemplo ilustrativo do e-book, criado para fins didáticos. Não é resultado de teste de uma ferramenta.
            </p>
          </div>
        </section>

        <section className="method" aria-labelledby="t-met">
          <div className="wrap">
            <h2 id="t-met">O método que organiza todos os modelos</h2>
            <p className="intro narrow">
              Cada modelo do livro se encaixa em uma destas cinco etapas. Para cada uma, o e-book diz o que fazer e como
              saber que você pode avançar.
            </p>
            <ol className="steps">
              <li>
                <b>Selecionar o material</b>
                <span>Um trecho curto e de origem conhecida: lei em site oficial, apostila, edital.</span>
              </li>
              <li>
                <b>Fazer o pedido</b>
                <span>Preencher um modelo com a tarefa, o formato e o material.</span>
              </li>
              <li className="key">
                <b>Conferir a resposta</b>
                <span>Localizar na fonte os números, prazos, sujeitos e exceções.</span>
              </li>
              <li>
                <b>Praticar</b>
                <span>Responder sem consultar, primeiro às questões geradas e depois a questões reais.</span>
              </li>
              <li>
                <b>Revisar os erros</b>
                <span>Registrar o raciocínio, reforçar e retomar dias depois.</span>
              </li>
            </ol>
            <p className="intro narrow">
              A IA organiza, explica e cria exercícios. Estudar, conferir as informações e resolver questões reais com
              gabarito oficial continua sendo trabalho seu, e o livro mostra como fazer isso.
            </p>
          </div>
        </section>

        <section aria-labelledby="t-inc">
          <div className="wrap">
            <h2 id="t-inc">O que está no e-book</h2>
            <p className="narrow">
              Os 60 modelos estão distribuídos pelos capítulos, cada um com indicação de uso, o que fornecer e, quando
              necessário, como conferir o resultado.
            </p>
            <div className="inc">
              <article>
                <h3>
                  Primeiros passos <small>5 modelos</small>
                </h3>
                <p>
                  Uma atividade guiada de cerca de 30 minutos e modelos para escrever pedidos, deixar a IA fazer perguntas
                  e estudar por perguntas.
                </p>
              </article>
              <article>
                <h3>
                  Conferência das respostas <small>6 modelos</small>
                </h3>
                <p>
                  Comparar uma resposta com o texto, localizar a evidência de cada afirmação e descobrir que fonte
                  consultar para cada dúvida.
                </p>
              </article>
              <article>
                <h3>
                  Planejamento <small>7 modelos</small>
                </h3>
                <p>
                  Organizar o edital, mapear o tempo real, montar a semana com margem, encaixar revisões e replanejar
                  depois de um atraso.
                </p>
              </article>
              <article>
                <h3>
                  Lei seca <small>7 modelos</small>
                </h3>
                <p>
                  Resumo fiel, tabela de prazos e competências, regra e exceções, comparação de institutos e mnemônicos
                  conferidos.
                </p>
              </article>
              <article>
                <h3>
                  Português e Raciocínio Lógico <small>8 modelos</small>
                </h3>
                <p>
                  Treino de crase, concordância, regência, interpretação e sintaxe, além de negações, tabela-verdade e
                  problemas resolvidos passo a passo.
                </p>
              </article>
              <article>
                <h3>
                  Questões <small>10 modelos</small>
                </h3>
                <p>
                  Múltipla escolha, certo ou errado item por item, casos concretos, eliminação de alternativas e análise
                  de questões reais de prova.
                </p>
              </article>
              <article>
                <h3>
                  Simulados e análise de erros <small>7 modelos</small>
                </h3>
                <p>
                  Simulado de treino, teste de acerto inseguro, diagnóstico do erro a partir do seu raciocínio e plano de
                  reforço.
                </p>
              </article>
              <article>
                <h3>
                  Revisão <small>6 modelos</small>
                </h3>
                <p>
                  Flashcards, mapa mental em texto, resumo de uma página, calendário de revisão, explicação com as
                  próprias palavras e quiz rápido.
                </p>
              </article>
              <article>
                <h3>
                  PDFs e fontes <small>4 modelos</small>
                </h3>
                <p>
                  Estudar com base nos seus próprios arquivos, perguntar só às fontes enviadas e comparar fontes que
                  parecem divergir.
                </p>
              </article>
            </div>
            <div className="also">
              <h3>Também no livro</h3>
              <ul>
                <li>Índice por necessidade com 12 situações, cada uma com o código e a página do modelo indicado.</li>
                <li>Três demonstrações completas: do texto ao treino, do erro ao reforço e do atraso ao novo plano.</li>
                <li>
                  Roteiro de 7 dias, com objetivo, atividade, tempo estimado, resultado e critério de conferência para
                  cada dia.
                </li>
                <li>Checklist de conferência e lista dos 60 modelos com links para cada um.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="previews" aria-labelledby="t-prev">
          <div className="wrap">
            <h2 id="t-prev">Veja páginas reais do e-book</h2>
            <p className="narrow">Toque em uma página para ampliá-la.</p>
            <div className="gallery">
              {PAGES.map((p) => (
                <figure className="shot" key={p.src}>
                  <button type="button" onClick={(e) => openViewer(e.currentTarget, p)}>
                    <img src={p.src} width={816} height={1158} alt={p.alt} />
                  </button>
                  <figcaption>
                    <b>{p.title}</b>
                    {p.text}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <dialog
          className="viewer"
          id="viewer"
          aria-label="Página ampliada"
          ref={dlgRef}
          onClick={(e) => {
            if (e.target === dlgRef.current) dlgRef.current?.close();
          }}
          onClose={() => openerRef.current?.focus()}
        >
          <div className="vbar">
            <p id="viewer-cap">{view.cap}</p>
            <span>
              <button type="button" onClick={() => setZoom((z) => !z)}>
                {zoom ? "Reduzir" : "Ampliar"}
              </button>{" "}
              <button type="button" onClick={() => dlgRef.current?.close()}>
                Fechar
              </button>
            </span>
          </div>
          <div className={zoom ? "vimg zoom" : "vimg"}>
            {view.src && <img src={view.src} alt={view.alt} />}
          </div>
        </dialog>

        <section aria-labelledby="t-fit">
          <div className="wrap">
            <h2 id="t-fit">Para quem é este e-book</h2>
            <div className="fit">
              <article>
                <h3>Combina com você se</h3>
                <ul>
                  <li>
                    Você estuda para PM, PC, Polícia Penal ou GCM e quer usar IA com um processo, não com pedidos soltos.
                  </li>
                  <li>Você está começando com IA ou recebe respostas genéricas.</li>
                  <li>Você concilia trabalho e estudo e precisa de um plano que caiba na semana.</li>
                  <li>Você aceita conferir as respostas nas fontes antes de memorizar.</li>
                </ul>
              </article>
              <article>
                <h3>O que ele não é</h3>
                <ul>
                  <li>É um e-book em PDF, não um curso em vídeo.</li>
                  <li>Não inclui assinatura de nenhuma ferramenta de IA.</li>
                  <li>Não substitui edital, material de referência nem questões reais com gabarito oficial.</li>
                  <li>Não garante aprovação. A IA pode errar mesmo com bons modelos, e o livro ensina a lidar com isso.</li>
                </ul>
              </article>
            </div>
            <h3 className="fit-sub">Quem publica</h3>
            <p className="narrow">
              O e-book é publicado pela Operação Aprovação, Estudos para Segurança Pública, e divulgado por Silvaa+ no
              TikTok (
              <a href="https://www.tiktok.com/@r_silvaa19" rel="noopener">
                @r_silvaa19
              </a>
              ). É um material educacional independente, sem vínculo com corporações policiais, bancas organizadoras ou
              as empresas de IA citadas como exemplo.
            </p>
          </div>
        </section>

        <section className="bonus" aria-labelledby="t-bonus">
          <div className="wrap">
            <h2 id="t-bonus">Bônus inclusos na sua compra</h2>
            <p className="narrow">Além dos 60 modelos, você leva materiais de apoio para colocar o método em prática desde o primeiro dia.</p>
            <div className="bonus-grid">
              <article className="bonus-card featured">
                <span className="bonus-tag">Bônus exclusivo</span>
                <h3>Configurar NotebookLM</h3>
                <p>Passo a passo para montar seu caderno de estudo no NotebookLM com edital, lei seca e apostilas, e fazer perguntas que a IA responde a partir das fontes que você enviou.</p>
              </article>
              <article className="bonus-card">
                <span className="bonus-tag">Bônus 1</span>
                <h3>Roteiro de 7 dias</h3>
                <p>Objetivo, atividade, tempo estimado e critério de conferência para cada dia da primeira semana.</p>
              </article>
              <article className="bonus-card">
                <span className="bonus-tag">Bônus 2</span>
                <h3>Checklist de conferência</h3>
                <p>Uma lista prática para checar números, prazos e exceções na fonte antes de memorizar.</p>
              </article>
              <article className="bonus-card">
                <span className="bonus-tag">Bônus 3</span>
                <h3>Índice por necessidade</h3>
                <p>12 situações comuns, cada uma com o código e a página do modelo indicado.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="offer" id="oferta" aria-labelledby="t-off" ref={offerRef}>
          <div className="wrap">
            <div className="offer-box">
              <h2 id="t-off">IA para Concursos Policiais</h2>
              <ul>
                <li>E-book digital em PDF, 70 páginas.</li>
                <li>60 modelos de prompt com indicação de uso.</li>
                <li>Método em cinco etapas, com critério para avançar.</li>
                <li>Três demonstrações completas e seis figuras didáticas.</li>
                <li>Índice por necessidade, roteiro de 7 dias e checklist de conferência.</li>
                <li>Sumário e links internos para consulta no celular.</li>
                <li><strong>Bônus exclusivo:</strong> Configurar NotebookLM.</li>
              </ul>
              <p className="price">
                <span className="label">Preço de lançamento · pagamento único</span>
                {CONFIG.listPriceText && (
                  <span className="was">
                    De <s>{CONFIG.listPriceText}</s>
                  </span>
                )}
                <span className="value">{CONFIG.launchPriceText}</span>
              </p>
              <CheckoutButton cta="oferta" id="cta-offer" className="btn btn-block">
                Quero o e-book por {CONFIG.launchPriceText}
              </CheckoutButton>
              {CONFIG.guaranteeDays > 0 && (
                <div className="guarantee">
                  <span className="shield" aria-hidden="true">{CONFIG.guaranteeDays}</span>
                  <p>
                    <strong>Garantia de {CONFIG.guaranteeDays} dias.</strong> Leia, teste os modelos no seu estudo e decida com calma.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="faq" aria-labelledby="t-faq">
          <div className="wrap narrow">
            <h2 id="t-faq">Perguntas frequentes</h2>
            <details>
              <summary>O que vou receber?</summary>
              <p>
                Um e-book em PDF com 70 páginas: o método, as três demonstrações, os 60 modelos de prompt, o índice por
                necessidade, o roteiro de 7 dias e o checklist de conferência.
              </p>
            </details>
            <details>
              <summary>É um curso ou um e-book?</summary>
              <p>É um e-book. Não há aulas em vídeo.</p>
            </details>
            <details>
              <summary>Preciso saber usar IA?</summary>
              <p>
                Não. O capítulo 1 traz uma primeira atividade guiada, passo a passo, com um texto curto de lei para você
                praticar.
              </p>
            </details>
            <details>
              <summary>Serve para qual carreira?</summary>
              <p>
                Foi escrito para candidatos a PM, PC, Polícia Penal e GCM. Os exemplos usam situações e matérias comuns a
                esses concursos, como Direito Penal, Português e Raciocínio Lógico. Confira sempre o conteúdo cobrado no
                edital do seu concurso.
              </p>
            </details>
            <details>
              <summary>Posso usar com ferramentas gratuitas?</summary>
              <p>
                Os modelos são textos para copiar e colar, então podem ser usados em ferramentas que aceitem pedidos por
                escrito, inclusive em versões gratuitas. Alguns usos, como enviar PDFs, dependem de recursos que variam
                entre ferramentas e planos. Confira na ferramenta que você usa o que está disponível.
              </p>
            </details>
            <details>
              <summary>Os prompts funcionam em qualquer ferramenta?</summary>
              <p>
                Eles foram escritos sem depender de botões ou menus de uma ferramenta específica. O livro cita ChatGPT,
                Gemini, Claude e NotebookLM como exemplos. Como as respostas variam entre ferramentas e versões, o
                próprio livro recomenda testar os modelos na ferramenta que você usa.
              </p>
            </details>
            <details>
              <summary>Por que comprar se posso pedir prompts por conta própria?</summary>
              <p>
                Você pode, e as ferramentas gratuitas ajudam. O que o e-book acrescenta é a organização: um método que
                liga os modelos, um índice que leva da dificuldade ao modelo certo, demonstrações completas com exemplos e
                um procedimento para conferir as respostas nas fontes adequadas. Os modelos não são secretos; o valor está
                em encontrar o certo na hora certa e saber o que fazer com a resposta.
              </p>
            </details>
            <details>
              <summary>A IA pode errar mesmo usando esses modelos?</summary>
              <p>
                Sim. Fornecer o material e delimitar o pedido reduz o espaço para erros, mas não os elimina. Por isso a
                conferência é uma etapa do método, com exemplos de como localizar um erro e corrigi-lo pela fonte.
              </p>
            </details>
            {getPurchaseFaq().map(({ question, answer }) => (
              <details key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
            {CONFIG.supportText && (
              <details>
                <summary>O e-book tem garantia?</summary>
                <p>{CONFIG.supportText}</p>
              </details>
            )}
          </div>
        </section>

        <section className="final" aria-labelledby="t-fin">
          <div className="wrap narrow">
            <h2 id="t-fin">Sua próxima sessão de estudo pode render muito mais</h2>
            <p>
              Se você quer transformar o material que já tem em questões, revisões e um plano possível, o e-book reúne os
              modelos, os exemplos e o passo a passo. Sem pressa: veja as amostras desta página e decida com calma. Se fizer sentido para você, estaremos juntos nessa missão.
            </p>
            <p className="price">
              <span className="label">Preço de lançamento · pagamento único</span>
              {CONFIG.listPriceText && (
                <span className="was">
                  De <s>{CONFIG.listPriceText}</s>
                </span>
              )}
              <span className="value">{CONFIG.launchPriceText}</span>
            </p>
            <CheckoutButton cta="final" id="cta-final" linkRef={finalRef}>
              Quero o e-book por {CONFIG.launchPriceText}
            </CheckoutButton>
          </div>
        </section>
        <VisitorForms />
      </main>

      <footer>
        <div className="wrap">
          <p>
            <b className="foot-brand">Operação Aprovação</b> · Estudos para Segurança Pública
          </p>
          <p>
            Divulgação: Silvaa+ no TikTok,{" "}
            <a href="https://www.tiktok.com/@r_silvaa19" rel="noopener">
              @r_silvaa19
            </a>
            .
          </p>
          <p>
            Material educacional independente. Não garante aprovação e não tem vínculo com corporações policiais, bancas
            organizadoras ou empresas de IA. ChatGPT, Gemini, Claude e NotebookLM são marcas de seus titulares.
          </p>
          {CONFIG.termsUrl && (
            <p>
              <a href={CONFIG.termsUrl}>Termos de uso</a>
            </p>
          )}
          {CONFIG.privacyUrl && (
            <p>
              <a href={CONFIG.privacyUrl}>Política de privacidade</a>
            </p>
          )}
          <p>
            <button type="button" className="cookie-link" onClick={() => window.dispatchEvent(new Event("open-cookie-settings"))}>
              Preferências de cookies
            </button>
          </p>
          {CONFIG.contactText && <p>{CONFIG.supportEmail ? <a href={`mailto:${CONFIG.supportEmail}`}>{CONFIG.contactText}</a> : CONFIG.contactText}</p>}
        </div>
      </footer>

      <div className={barOn ? "buybar show" : "buybar"} id="buybar" aria-hidden={barOn ? "false" : "true"}>
        <span className="p">
          {CONFIG.launchPriceText}
          <small>
            {CONFIG.listPriceText && (
              <>
                <s>{CONFIG.listPriceText}</s> ·{" "}
              </>
            )}
            E-book em PDF
          </small>
        </span>
        <CheckoutButton cta="barra" tabIndex={barOn ? 0 : -1} withMessage={false}>
          Quero o e-book
        </CheckoutButton>
      </div>
    </>
  );
}
