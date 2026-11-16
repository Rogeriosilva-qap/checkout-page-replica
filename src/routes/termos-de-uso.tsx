import { createFileRoute } from "@tanstack/react-router";
import { CONFIG } from "@/config";
import logo from "@/assets/logo-operacao-aprovacao.png.asset.json";

export const Route = createFileRoute("/termos-de-uso")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "Termos de Uso | Operação Aprovação" },
      { name: "description", content: "Termos de uso do site e das condições de compra do e-book IA para Concursos Policiais, da Operação Aprovação." },
      { property: "og:title", content: "Termos de Uso | Operação Aprovação" },
      { property: "og:description", content: "Condições de uso do site e de compra do e-book IA para Concursos Policiais." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:url", content: "https://operacaoaprovacaoebooks.com.br/termos-de-uso" },
    ],
    links: [
      { rel: "canonical", href: "https://operacaoaprovacaoebooks.com.br/termos-de-uso" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Literata:ital,wght@0,400;0,700;1,400&display=swap" },
    ],
  }),
  component: TermosDeUso,
});

function TermosDeUso() {
  return <div className="legal">
    <div className="marca">
      <a href="https://operacaoaprovacaoebooks.com.br/"><img src={logo.url} alt="Logo Operação Aprovação" height={40} />Operação Aprovação <small>· Estudos para Segurança Pública</small></a>
    </div>
    <main><article>
      <h1>Termos de Uso</h1>
      <p className="atualizacao">Última atualização: 16 de novembro de 2026</p>

      <h2>1. Quem somos</h2>
      <p>Estes Termos de Uso regem o site <strong>operacaoaprovacaoebooks.com.br</strong> e a compra do e-book <strong>IA para Concursos Policiais</strong>, operados pela <strong>Operação Aprovação</strong>, CNPJ 70.147.280/0001-40, contato <a href={`mailto:${CONFIG.supportEmail}`}>{CONFIG.supportEmail}</a>.</p>

      <h2>2. O produto</h2>
      <p>O e-book IA para Concursos Policiais é um material digital de apoio ao estudo, com 70 páginas e 60 modelos de prompts para uso em ferramentas de inteligência artificial, acompanhado de um PDF resumido da biblioteca de prompts para consulta rápida. O conteúdo é voltado a candidatos de concursos de segurança pública (PM, Polícia Civil, Polícia Penal, Guarda Municipal e afins).</p>

      <h2>3. Compra e acesso</h2>
      <p>O pagamento é processado pela plataforma de pagamento indicada no botão de compra (atualmente a Kirvano). Após a confirmação do pagamento, o material é entregue pela plataforma, com acesso por login e senha, e também por um link enviado por mensagem. Em caso de dificuldade de acesso, fale com o suporte pelo e-mail {CONFIG.supportEmail} ou pelo WhatsApp {CONFIG.whatsappText}.</p>

      <h2>4. Licença de uso</h2>
      <p>A compra concede uma licença <strong>pessoal e intransferível</strong> de uso do material. É proibido copiar, revender, distribuir, publicar ou compartilhar o conteúdo do e-book, no todo ou em parte, por qualquer meio, sem autorização expressa da Operação Aprovação.</p>

      <h2>5. Garantia e reembolso</h2>
      <p>O e-book tem <strong>garantia de {CONFIG.guaranteeDays} dias</strong>, contados da compra, nos termos do art. 49 do Código de Defesa do Consumidor. Para solicitar o reembolso dentro desse prazo, escreva para <a href={`mailto:${CONFIG.supportEmail}`}>{CONFIG.supportEmail}</a> informando o e-mail usado na compra.</p>

      <h2>6. Natureza do conteúdo</h2>
      <p>O e-book é um material de apoio ao estudo e <strong>não garante aprovação</strong> em nenhum concurso. Ferramentas de inteligência artificial podem cometer erros; confira sempre as informações na lei publicada no site oficial e no edital do seu concurso. A Operação Aprovação não tem vínculo com bancas organizadoras, corporações policiais ou empresas de IA. ChatGPT, Gemini, Claude e NotebookLM são marcas de seus respectivos titulares.</p>

      <h2>7. Propriedade intelectual</h2>
      <p>Todo o conteúdo do site e do e-book — textos, modelos de prompts, imagens e identidade visual — é protegido por direitos autorais e pertence à Operação Aprovação ou a seus licenciadores.</p>

      <h2>8. Alterações destes termos</h2>
      <p>Podemos atualizar estes Termos de Uso a qualquer momento. A versão vigente é sempre a publicada nesta página, com a data de atualização indicada no topo.</p>

      <h2>9. Legislação aplicável</h2>
      <p>Estes termos são regidos pela legislação brasileira. Dúvidas: <a href={`mailto:${CONFIG.supportEmail}`}>{CONFIG.supportEmail}</a>.</p>
    </article></main>
    <footer><div>
      <p>Operação Aprovação · CNPJ 70.147.280/0001-40</p>
      <p><a href="https://operacaoaprovacaoebooks.com.br/">Página inicial</a> · <a href="/politica-de-privacidade">Política de privacidade</a></p>
    </div></footer>
  </div>;
}
