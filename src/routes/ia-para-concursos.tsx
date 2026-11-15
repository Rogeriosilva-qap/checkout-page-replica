import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { copyAdvertorialPrompt } from "@/lib/copy-advertorial-prompt";
import { CONFIG } from "@/config";
import capa from "@/assets/capa-ebook.jpg.asset.json";
import logo from "@/assets/logo-operacao-aprovacao.png.asset.json";

const capaImageUrl = capa.url.startsWith("http") ? capa.url : `https://operacaoaprovacaoebooks.com.br${capa.url}`;

export const Route = createFileRoute("/ia-para-concursos")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "Como usar IA para resumir leis e criar questões de concursos policiais | Operação Aprovação" },
      { name: "description", content: "Conteúdo publicitário da Operação Aprovação. Veja como montar um pedido à IA com base no seu próprio material, treinar uma questão por vez e conferir a resposta na fonte." },
      { property: "og:title", content: "Como usar IA para criar questões de concursos policiais com o seu próprio material" },
      { property: "og:description", content: "Conteúdo publicitário. Um modelo de pedido para copiar, um exemplo comentado e um quadro para conferir a resposta da IA na fonte." },
      { property: "og:type", content: "article" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:url", content: "https://operacaoaprovacaoebooks.com.br/ia-para-concursos" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: capaImageUrl },
      { name: "twitter:image", content: capaImageUrl },
    ],
    links: [
      { rel: "canonical", href: "https://operacaoaprovacaoebooks.com.br/ia-para-concursos" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Literata:ital,wght@0,400;0,700;1,400&display=swap" },
    ],
  }),
  component: Advertorial,
});

const questionsPrompt = `Você vai me ajudar a treinar para o concurso de [cargo, ex.: Soldado da PM do meu estado], usando SOMENTE o texto que eu colar no fim desta mensagem.

Regras:
1. Use apenas o texto colado. Se algo não estiver nele, responda "não consta no texto".
2. Crie UMA questão por vez, no formato [múltipla escolha com 5 alternativas / certo ou errado].
3. Depois de apresentar a questão, pare e espere a minha resposta. Não mostre o gabarito antes disso.
4. Quando eu responder, diga se acertei, informe o gabarito e copie, entre aspas, o trecho exato do texto que sustenta a resposta.
5. Só crie a próxima questão quando eu escrever "próxima".

Texto para estudo:
[cole aqui o artigo de lei, o trecho do edital ou a página da sua apostila]`;
const studyPrompt = `Abaixo está o conteúdo programático do edital de [concurso]. Hoje tenho [ex.: 40 minutos] para estudar. Já estudei: [liste os tópicos].

Com base SOMENTE nessa lista, sugira UMA tarefa para hoje que caiba nesse tempo, dizendo qual tópico, o que fazer (ler, revisar ou resolver questões) e por quê. Não invente tópicos que não estejam no edital.

Conteúdo programático:
[cole aqui o trecho do edital]`;

function CopyPrompt({ id, text }: { id: string; text: string }) {
  const pre = useRef<HTMLPreElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [copied, setCopied] = useState(false);
  useEffect(() => () => clearTimeout(timer.current), []);
  async function copy() {
    if (!pre.current) return;
    const ok = await copyAdvertorialPrompt(pre.current);
    clearTimeout(timer.current);
    setCopied(ok);
    if (ok) timer.current = setTimeout(() => setCopied(false), 2000);
  }
  return <>
    <pre className="prompt" id={id} ref={pre}>{text}</pre>
    <Button type="button" className={`copiar${copied ? " ok" : ""}`} data-alvo={id} onClick={copy} aria-live="polite">{copied ? "Prompt copiado ✓" : "Copiar o prompt"}</Button>
  </>;
}

function OfferLink() {
  return <Button asChild className="cta"><a href="https://operacaoaprovacaoebooks.com.br/">Conhecer o e-book e ver o que vem no guia</a></Button>;
}

function Advertorial() {
  return <div className="advertorial">
    <div className="selo"><strong>CONTEÚDO PUBLICITÁRIO</strong><span>Anunciante: Operação Aprovação</span></div>
    <div className="marca"><img src={logo.url} alt="Logo Operação Aprovação" height={40} />Operação Aprovação <small>· Estudos para Segurança Pública</small></div>
    <main><article>
      <h1>Como usar IA para resumir leis e criar questões de concursos policiais</h1>
      <p className="sub">Veja como montar um pedido com base no seu próprio material, treinar uma questão por vez e saber onde procurar a informação para conferir a resposta da IA.</p>
      <div className="autoria">Publicado por <b>Operação Aprovação</b>, anunciante deste conteúdo · Leitura de cerca de 6 minutos</div>
      <div className="foto" role="img" aria-label="Espaço reservado para fotografia">Espaço para fotografia editorial:<br />pessoa estudando à noite, com notebook e caderno aberto</div>
      <p className="legenda">Imagem ilustrativa.</p>
      <p>Você chega do trabalho, já passa das nove da noite e ainda faltam dois artigos do edital para revisar. Abre a lei, cola tudo na IA e escreve: “resume isso pra mim”.</p>
      <p>A resposta vem rápida, mas não ajuda tanto. São parágrafos longos, que repetem o texto com outras palavras. Às vezes aparece uma informação que não estava no trecho que você colou, porque a ferramenta completou com o que “sabe” de outras fontes. E, se você pede questões, o gabarito vem logo embaixo, antes que você tenha tentado responder.</p>
      <p>O problema quase nunca está na ferramenta, e sim no pedido. A seguir, você vê a diferença na prática e leva um modelo pronto para copiar.</p>

      <h2 id="exemplo">O pedido genérico e o pedido estruturado</h2>
      <span className="rotulo ruim">Pedido genérico</span>
      <div className="caixa"><pre className="prompt generic-prompt">Resume essa lei e faz umas questões pra eu estudar.</pre></div>
      <p>Esse pedido não diz qual material usar, quantas questões criar, em que formato nem quando mostrar a resposta. A IA preenche essas lacunas por conta própria.</p>
      <span className="rotulo bom">Pedido estruturado</span>
      <p>Este modelo prende a IA ao texto que você colar, pede <strong>uma questão por vez</strong>, espera a sua resposta e só depois mostra o gabarito com o trecho que o sustenta. Troque o que está entre colchetes.</p>
      <CopyPrompt id="prompt-questoes" text={questionsPrompt} />
      <p className="legenda">Funciona em ferramentas de IA de conversa, inclusive nas versões gratuitas. Os resultados variam conforme a ferramenta.</p>
      <p>No e-book, essa mesma lógica aparece no modelo P35, “Certo ou errado, um item por vez”, um dos 60 modelos do guia.</p>

      <h3>Como fica na prática</h3>
      <p>Para não reproduzir um texto legal sem conferência, o exemplo abaixo usa um <strong>trecho fictício</strong>, criado só para esta demonstração. A conversa também é <strong>ilustrativa</strong>.</p>
      <span className="rotulo ilus">Trecho de estudo fictício: não é texto de lei</span>
      <p className="trecho">“Regimento da Escola de Formação Exemplo, art. 12. Será desligado do curso o aluno que faltar a mais de 25% das aulas práticas, salvo se apresentar justificativa médica em até 48 horas após a falta.”</p>
      <span className="rotulo ilus">Conversa ilustrativa</span>
      <div className="caixa chat">
        <div className="msg ia"><span className="quem">IA</span>Questão 1 (certo ou errado): Segundo o texto, o aluno que faltar a mais de 25% das aulas práticas será desligado em qualquer situação.<br /><em>Aguardo sua resposta.</em></div>
        <div className="msg aluno"><span className="quem">Você</span>Certo.</div>
        <div className="msg ia"><span className="quem">IA</span>Você errou. Gabarito: <strong>errado</strong>. O texto prevê uma exceção: “salvo se apresentar justificativa médica em até 48 horas após a falta”.<br />Escreva “próxima” para continuar.</div>
      </div>
      <p>Repare em duas coisas: você precisou pensar antes de ver a resposta, e a IA apontou de onde tirou o gabarito. É esse trecho que você vai conferir.</p>

      <h2 id="conferir">Como conferir a resposta da IA</h2>
      <p>A IA pode errar um número, trocar uma palavra ou esquecer uma exceção, mesmo quando o pedido está bem feito. Por isso, a última etapa é sempre sua: abrir a fonte e comparar.</p>
      <ol>
        <li><strong>Abra o texto original.</strong> Para leis, use o site oficial do governo (no caso de leis federais, o Portal da Legislação do Planalto). Para regras do concurso, use o edital publicado pela banca.</li>
        <li><strong>Procure a expressão-chave.</strong> Use a busca do navegador (Ctrl+F ou “Localizar na página” no celular) com a palavra mais específica da resposta.</li>
        <li><strong>Compare número, prazo e exceção.</strong> São os pontos em que mais aparecem diferenças.</li>
      </ol>
      <span className="rotulo ilus">Quadro ilustrativo, com base no trecho fictício</span>
      <table>
        <thead><tr><th>O que a IA afirmou</th><th>O que diz o texto original</th><th>Correção</th></tr></thead>
        <tbody>
          <tr><td data-col="O que a IA afirmou">“Faltar a mais de 20% das aulas práticas leva ao desligamento.”</td><td data-col="O que diz o texto original">“faltar a <mark>mais de 25%</mark> das aulas práticas”</td><td data-col="Correção">O limite é de 25%, não 20%.</td></tr>
          <tr><td data-col="O que a IA afirmou">“O aluno pode justificar a falta a qualquer momento.”</td><td data-col="O que diz o texto original">“justificativa médica <mark>em até 48 horas</mark> após a falta”</td><td data-col="Correção">Existe prazo: até 48 horas.</td></tr>
          <tr><td data-col="O que a IA afirmou">“Qualquer justificativa evita o desligamento.”</td><td data-col="O que diz o texto original">“<mark>justificativa médica</mark>”</td><td data-col="Correção">Só a justificativa médica é aceita.</td></tr>
        </tbody>
      </table>
      <p>Se a resposta da IA e o texto original não baterem, vale o texto original. Corrija sua anotação e siga para a próxima questão.</p>

      <h2 id="pouco-tempo">Pouco tempo? Use o edital para definir a próxima tarefa</h2>
      <p>Nos dias mais corridos, a dúvida costuma ser outra: por onde começar. O mesmo princípio vale aqui. Em vez de pedir “um cronograma”, entregue o conteúdo programático e o tempo que você tem.</p>
      <CopyPrompt id="prompt-edital" text={studyPrompt} />
      <p className="legenda">Confira sempre a lista de tópicos no edital oficial publicado pela banca.</p>

      <h2 id="ebook">Para repetir o processo em outras tarefas</h2>
      <p>Os dois modelos acima resolvem duas situações. No dia a dia de estudo aparecem muitas outras, e montar um pedido bem estruturado do zero toda noite toma tempo. Foi para isso que a Operação Aprovação reuniu esses modelos em um guia.</p>
      <div className="produto">
        <img className="capa" src={capa.url} alt="Capa do e-book IA para Concursos Policiais, da Operação Aprovação" loading="lazy" width={220} height={330} />
        <div>
          <h3>E-book IA para Concursos Policiais</h3>
          <p>Feito para quem se prepara para <strong>PM, Polícia Civil, Polícia Penal e Guarda Municipal</strong> e quer transformar os materiais que já tem em treino. São 70 páginas com <strong>60 modelos de prompts</strong> e orientações para conferir as respostas na fonte.</p>
          <ul className="usos">
            <li><strong>Criar questões</strong> a partir de leis, apostilas e trechos do edital.</li>
            <li><strong>Estruturar revisões</strong> do conteúdo que você já estudou.</li>
            <li><strong>Reorganizar o plano de estudo</strong> conforme o edital e o seu tempo.</li>
          </ul>
          <p>A ferramenta de IA gratuita responde ao que você pede; o guia entrega os pedidos já montados para cada tarefa, com a etapa de conferência incluída.</p>
        </div>
      </div>
      {CONFIG.launchPriceText.trim() && <p className="preco-lancamento">Preço de lançamento: {CONFIG.launchPriceText}.</p>}
      <OfferLink />
      <p className="cta-nota">Você será levado à página de vendas da Operação Aprovação.</p>
      <p className="aviso"><strong>Importante:</strong> o e-book é um material de apoio ao estudo e não garante aprovação. Ferramentas de IA podem cometer erros; confira sempre as informações na lei publicada no site oficial e no edital do seu concurso. A Operação Aprovação não tem vínculo com bancas organizadoras nem com as corporações citadas.</p>
      <h2>Para começar hoje</h2>
      <p>Escolha um artigo do seu edital, cole no modelo de questões e resolva três, uma de cada vez. Para cada gabarito, abra a fonte e confira o trecho. Se quiser os outros modelos prontos, eles estão no guia.</p>
      <OfferLink />
    </article></main>
    <footer><div>
      <p><strong>Conteúdo publicitário.</strong> Este artigo foi produzido e pago pela Operação Aprovação para divulgar o e-book IA para Concursos Policiais.</p>
      <p>Anunciante: Operação Aprovação · <a href="https://operacaoaprovacaoebooks.com.br/">operacaoaprovacaoebooks.com.br</a></p>
      <p>CNPJ 70.147.280/0001-40</p>
      <p>Contato: <a href={`mailto:${CONFIG.supportEmail}`}>{CONFIG.supportEmail}</a> · WhatsApp <a href={`https://wa.me/${CONFIG.whatsappNumber}`}>{CONFIG.whatsappText}</a></p>
    </div></footer>
  </div>;
}
