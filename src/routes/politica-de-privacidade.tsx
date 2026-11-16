import { createFileRoute } from "@tanstack/react-router";
import { CONFIG } from "@/config";
import logo from "@/assets/logo-operacao-aprovacao.png.asset.json";

export const Route = createFileRoute("/politica-de-privacidade")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "Política de Privacidade | Operação Aprovação" },
      { name: "description", content: "Como a Operação Aprovação coleta, usa e protege os dados dos visitantes e clientes do site operacaoaprovacaoebooks.com.br." },
      { property: "og:title", content: "Política de Privacidade | Operação Aprovação" },
      { property: "og:description", content: "Como coletamos, usamos e protegemos os dados dos visitantes e clientes." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://operacaoaprovacaoebooks.com.br/politica-de-privacidade" },
    ],
    links: [
      { rel: "canonical", href: "https://operacaoaprovacaoebooks.com.br/politica-de-privacidade" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Literata:ital,wght@0,400;0,700;1,400&display=swap" },
    ],
  }),
  component: PoliticaDePrivacidade,
});

function PoliticaDePrivacidade() {
  return <div className="legal">
    <div className="marca">
      <a href="https://operacaoaprovacaoebooks.com.br/"><img src={logo.url} alt="Logo Operação Aprovação" height={40} />Operação Aprovação <small>· Estudos para Segurança Pública</small></a>
    </div>
    <main><article>
      <h1>Política de Privacidade</h1>
      <p className="atualizacao">Última atualização: 16 de novembro de 2026</p>

      <h2>1. Quem é responsável pelos seus dados</h2>
      <p>O responsável pelo tratamento dos dados pessoais coletados neste site é a <strong>Operação Aprovação</strong>, CNPJ 70.147.280/0001-40. Contato para qualquer assunto de privacidade: <a href={`mailto:${CONFIG.supportEmail}`}>{CONFIG.supportEmail}</a>.</p>

      <h2>2. Dados que você nos envia</h2>
      <ul>
        <li><strong>Comentários e depoimentos:</strong> nome, mensagem, nota (de 1 a 5 estrelas) e, se você quiser, uma foto de perfil. Os depoimentos só aparecem no site depois de aprovados por nós.</li>
        <li><strong>Cadastro para novidades e lista de espera:</strong> seu e-mail, com consentimento registrado no momento do envio.</li>
        <li><strong>Contato por e-mail ou WhatsApp:</strong> o conteúdo da conversa e os dados que você escolher informar.</li>
      </ul>
      <p>Esses dados são usados para responder você, exibir depoimentos autorizados e enviar as novidades que você pediu para receber. Você pode pedir a exclusão a qualquer momento pelo e-mail {CONFIG.supportEmail}.</p>

      <h2>3. Dados da compra</h2>
      <p>O pagamento é processado pela plataforma de pagamento indicada no botão de compra (atualmente a Kirvano). <strong>Não temos acesso nem armazenamos dados do seu cartão ou chave Pix.</strong> A plataforma de pagamento trata esses dados conforme a própria política de privacidade dela.</p>

      <h2>4. Medição de audiência (sem cookies)</h2>
      <p>Este site é hospedado na plataforma Lovable, que registra estatísticas de visitação para nós: as páginas visitadas, de onde os visitantes vieram, o país, o navegador, o sistema operacional e o tipo de dispositivo, além do tempo de permanência, da velocidade de carregamento das páginas e de erros. Essa medição <strong>não usa cookies, não armazena nada no seu dispositivo, não guarda endereços IP e não identifica quem você é</strong>. Os dados detalhados ficam guardados por 90 dias e os resumos diários por um ano. A Lovable coleta esses dados para nós; a <a href="https://lovable.dev/privacy" target="_blank" rel="noopener noreferrer">política de privacidade da Lovable</a> explica como ela os trata.</p>

      <h2>5. Publicidade e cookies (Google Ads)</h2>
      <p>Usamos a tag do Google Ads para medir o resultado dos nossos anúncios. Essa tag pode usar cookies de publicidade e enviar dados ao Google, conforme a <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">política de privacidade do Google</a>.</p>
      <p>Ao entrar no site, você vê um aviso de cookies com as opções <strong>aceitar, rejeitar ou personalizar</strong>. Para visitantes do Brasil, as tags de publicidade e análise do Google ficam bloqueadas até você aceitar; se você rejeitar, elas permanecem desativadas. A sua escolha fica salva no seu navegador por até 12 meses e pode ser alterada a qualquer momento em “Preferências de cookies”, no rodapé da página inicial. Se o seu navegador enviar o sinal Global Privacy Control, tratamos isso como rejeição automática. As estatísticas de visitação descritas no item 4 são registradas para todos os visitantes, sem cookies e sem identificar ninguém.</p>

      <h2>6. Com quem compartilhamos</h2>
      <ul>
        <li><strong>Plataforma de pagamento (Kirvano):</strong> para processar a compra e entregar o material.</li>
        <li><strong>Lovable:</strong> hospedagem do site e estatísticas de visitação descritas no item 4.</li>
        <li><strong>Google:</strong> medição de publicidade descrita no item 5, somente após o seu consentimento.</li>
      </ul>
      <p>Não vendemos nem alugamos dados pessoais.</p>

      <h2>7. Seus direitos (LGPD)</h2>
      <p>Pela Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você pode solicitar a confirmação, o acesso, a correção, a anonimização, a portabilidade ou a exclusão dos seus dados, além de revogar consentimentos. Basta escrever para <a href={`mailto:${CONFIG.supportEmail}`}>{CONFIG.supportEmail}</a>. Você também pode reclamar à Autoridade Nacional de Proteção de Dados (ANPD).</p>

      <h2>8. Segurança e retenção</h2>
      <p>Adotamos medidas técnicas para proteger os dados, como acesso restrito aos registros. Guardamos os dados apenas pelo tempo necessário para as finalidades descritas nesta política ou para cumprir obrigações legais.</p>

      <h2>9. Alterações desta política</h2>
      <p>Podemos atualizar esta Política de Privacidade a qualquer momento. A versão vigente é sempre a publicada nesta página, com a data de atualização indicada no topo.</p>
    </article></main>
    <footer><div>
      <p>Operação Aprovação · CNPJ 70.147.280/0001-40</p>
      <p><a href="https://operacaoaprovacaoebooks.com.br/">Página inicial</a> · <a href="/termos-de-uso">Termos de uso</a></p>
    </div></footer>
  </div>;
}
