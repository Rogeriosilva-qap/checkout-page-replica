import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { copyAdvertorialPrompt } from "@/lib/copy-advertorial-prompt";
import { CONFIG } from "@/config";
import capa from "@/assets/capa-ebook.jpg.asset.json";
import logo from "@/assets/logo-operacao-aprovacao.png.asset.json";
import foto from "@/assets/foto-editorial-estudo.jpg.asset.json";

const capaImageUrl = capa.url.startsWith("http") ? capa.url : `https://operacaoaprovacaoebooks.com.br${capa.url}`;

export const Route = createFileRoute("/ia-para-concursos")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "Concurseiros policiais estão usando o ChatGPT do jeito errado | Operação Aprovação" },
      { name: "description", content: "Conteúdo publicitário da Operação Aprovação. O problema não é a ferramenta, é o pedido: veja o erro que a maioria dos candidatos comete ao usar IA e o ajuste que transforma a IA em tutor de estudos." },
      { property: "og:title", content: "O erro que a maioria comete ao usar ChatGPT para estudar para concursos policiais" },
      { property: "og:description", content: "Conteúdo publicitário. Três sintomas do pedido genérico, um modelo de pedido estruturado para copiar e o ritual de conferência na fonte oficial." },
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
    <nav className="topnav" aria-label="Escolha onde continuar">
      <a className="topnav-item" href="https://operacaoaprovacaoebooks.com.br/">Acessar o e-book</a>
      <span className="topnav-item ativo" aria-current="page">Ficar no blog</span>
    </nav>
    <div className="marca"><img src={logo.url} alt="Logo Operação Aprovação" height={40} />Operação Aprovação <small>· Estudos para Segurança Pública</small></div>
    <main><article>
      <h1>Concurseiros de carreiras policiais estão usando o ChatGPT do jeito errado — e isso pode estar custando pontos na prova</h1>
      <p className="sub">Especialistas em preparação alertam: o problema não é a ferramenta, é o pedido. Veja o erro que 9 em cada 10 candidatos cometem — e o ajuste simples que transforma a IA em um tutor de estudos.</p>
      <div className="autoria">Publicado por <b>Operação Aprovação</b>, anunciante deste conteúdo · Leitura de cerca de 5 minutos</div>
      <img className="foto" src={foto.url} alt="Jovem estudando à noite com notebook, caderno e marca-texto" />
      <p className="legenda">Imagem ilustrativa.</p>
      <p>Você chega do trabalho, já passa das nove da noite e ainda faltam dois artigos do edital para revisar. Abre o ChatGPT, cola a lei inteira e escreve: “resume isso pra mim e faz umas questões”.</p>
      <p>A resposta vem rápida. E é aí que mora o perigo.</p>

      <h2 id="erro">O erro que quase todo candidato comete</h2>
      <p>Quando o pedido é genérico, a IA preenche as lacunas por conta própria. Ela não sabe qual é a sua banca, não sabe qual trecho da lei você colou — e, pior: <strong>completa a resposta com informações de outras fontes, que podem estar desatualizadas ou simplesmente erradas.</strong></p>
      <p>Os três sintomas mais comuns:</p>
      <ol>
        <li><strong>O gabarito aparece antes de você pensar.</strong> Você pede questões e a resposta vem logo embaixo. Resultado: você “reconhece” a resposta em vez de lembrar dela — e na prova, sem a tela, o conteúdo não vem.</li>
        <li><strong>Números e prazos trocados.</strong> A IA afirma “20%” onde a lei diz “25%”. Diz “48 horas” onde o prazo é outro. Em banca de certo/errado, um número trocado é um item perdido — e um item errado anula um certo.</li>
        <li><strong>Falsa sensação de progresso.</strong> Parágrafos bonitos que repetem a lei com outras palavras. Você lê, concorda com a cabeça… e não fixa nada.</li>
      </ol>
      <p>Se você já estudou assim, não é culpa sua. A ferramenta foi feita para responder qualquer coisa — cabe a você prendê-la ao que realmente importa.</p>

      <h2 id="ajuste">O ajuste: prender a IA ao seu material</h2>
      <p>Candidatos organizados fazem diferente. Em vez de um pedido genérico, eles entregam <strong>regras claras</strong>: use somente o texto colado, crie uma questão por vez, espere a minha resposta antes de mostrar o gabarito e indique o trecho exato que sustenta a resposta.</p>
      <span className="rotulo ruim">Pedido genérico</span>
      <div className="caixa"><pre className="prompt generic-prompt">Resume essa lei e faz umas questões pra eu estudar.</pre></div>
      <span className="rotulo bom">Pedido estruturado</span>
      <p>Este modelo prende a IA ao texto que você colar, pede <strong>uma questão por vez</strong>, espera a sua resposta e só depois mostra o gabarito com o trecho que o sustenta. Troque o que está entre colchetes.</p>
      <CopyPrompt id="prompt-questoes" text={questionsPrompt} />
      <p className="legenda">Funciona em ferramentas de IA de conversa, inclusive nas versões gratuitas. Os resultados variam conforme a ferramenta.</p>
      <p>Veja a diferença na prática. Com um pedido estruturado, a conversa fica assim:</p>
      <span className="rotulo ilus">Conversa ilustrativa, com trecho fictício criado para demonstração</span>
      <div className="caixa chat">
        <div className="msg ia"><span className="quem">IA</span>Questão 1 (certo ou errado): Segundo o texto, o aluno que faltar a mais de 25% das aulas práticas será desligado em qualquer situação.<br /><em>Aguardo sua resposta.</em></div>
        <div className="msg aluno"><span className="quem">Você</span>Certo.</div>
        <div className="msg ia"><span className="quem">IA</span>Você errou. Gabarito: <strong>errado</strong>. O texto prevê uma exceção: “salvo se apresentar justificativa médica em até 48 horas após a falta”.<br />Escreva “próxima” para continuar.</div>
      </div>
      <p>Repare em duas coisas: você precisou <strong>pensar antes de ver a resposta</strong>, e a IA <strong>apontou de onde tirou o gabarito</strong>. É esse trecho que você vai conferir na fonte oficial.</p>
      <div className="ferramenta-gratis">
        <p><strong>Quer testar agora?</strong> Cole uma questão da sua prova na ferramenta gratuita da Operação Aprovação e veja a explicação do raciocínio, com os pontos para conferir na fonte.</p>
        <Link to="/explicar-questao" className="ferramenta-link">Explicar uma questão gratuitamente →</Link>
      </div>

      <h2 id="fonte">A regra de ouro: a última palavra é da fonte</h2>
      <p>Mesmo com um bom pedido, a IA pode errar. Por isso, candidatos que usam a ferramenta a favor — e não contra si — seguem um ritual de três passos:</p>
      <ol>
        <li><strong>Abrir o texto original.</strong> Para leis federais, o Portal da Legislação do Planalto; para regras do concurso, o edital publicado pela banca.</li>
        <li><strong>Buscar a palavra mais específica da resposta.</strong> Use a busca do navegador (Ctrl+F ou “Localizar na página” no celular).</li>
        <li><strong>Comparar número, prazo e exceção.</strong> Os três pontos onde as bancas mais armam pegadinhas.</li>
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
      <p>Se a IA e a fonte divergirem, vale a fonte. Sempre.</p>

      <h2 id="ebook">“Mas montar esse pedido toda noite dá trabalho…”</h2>
      <p>Dá mesmo. Criar um comando bem estruturado do zero, para cada tipo de tarefa — criar questões, resumir lei seca, montar revisão, planejar a semana — toma um tempo que quem trabalha e estuda não tem.</p>
      <p>Foi para resolver isso que a equipe da Operação Aprovação compilou os comandos prontos em um guia.</p>
      <div className="produto">
        <img className="capa" src={capa.url} alt="Capa do e-book IA para Concursos Policiais, da Operação Aprovação" loading="lazy" width={220} height={330} />
        <div>
          <h3>E-book IA para Concursos Policiais</h3>
          <p>Feito para quem se prepara para <strong>PM, Polícia Civil, Polícia Penal e Guarda Municipal</strong>. São 70 páginas com <strong>60 modelos de prompts</strong> — cada um já com a etapa de conferência na fonte incluída.</p>
          <ul className="usos">
            <li><strong>Criar questões</strong> a partir de leis, apostilas e trechos do edital.</li>
            <li><strong>Estruturar revisões</strong> do conteúdo que você já estudou.</li>
            <li><strong>Reorganizar o plano de estudo</strong> conforme o edital e o seu tempo.</li>
          </ul>
          <p>E para quem não quer ler as 70 páginas, a compra inclui também o <strong>PDF resumido da biblioteca de prompts</strong>, para consulta rápida.</p>
        </div>
      </div>
      {CONFIG.launchPriceText.trim() && <p className="preco-lancamento">Preço de lançamento: {CONFIG.listPriceText.trim() && <>de <s>{CONFIG.listPriceText}</s> por</>} <strong>{CONFIG.launchPriceText}</strong> (pagamento único, com garantia de {CONFIG.guaranteeDays} dias).</p>}
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
      {(CONFIG.termsUrl.trim() || CONFIG.privacyUrl.trim()) && <p>
        {CONFIG.termsUrl.trim() && <a href={CONFIG.termsUrl}>Termos de uso</a>}
        {CONFIG.termsUrl.trim() && CONFIG.privacyUrl.trim() && " · "}
        {CONFIG.privacyUrl.trim() && <a href={CONFIG.privacyUrl}>Política de privacidade</a>}
      </p>}
    </div></footer>
  </div>;
}
