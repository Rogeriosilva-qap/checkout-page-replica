/* =========================================================
   CONFIGURAÇÃO DA PÁGINA — preencha antes de publicar.
   Deixe "" o que ainda não estiver confirmado: o item fica oculto.
   ========================================================= */
export const CONFIG = {
  checkoutUrl: "https://pay.kirvano.com/28b35434-3fbf-4f7e-914d-ae6212e77484", // URL do checkout (ex.: link da plataforma de pagamento). OBRIGATÓRIO para vender.
  listPriceText: "R$ 97,00", // Preço cheio confirmado do e-book, exibido riscado ao lado do preço de lançamento. Deixe "" para ocultar.
  launchPriceText: "R$ 47,00", // Preço de lançamento cobrado agora.
  deliveryText: "O material será entregue pela plataforma, com acesso por login e senha. Você também receberá um link via mensagem para acessar o material.",
  accessSupportText: "Se tiver dificuldade para acessar o material, fale com nosso suporte pelo e-mail operacaoaprovacao.edu@gmail.com.",
  refundText: "", // Canal, passos, prazo e condições de reembolso confirmados para esta compra.
  supportText: "O e-book tem garantia de 7 dias.",
  guaranteeDays: 7,
  supportEmail: "operacaoaprovacao.edu@gmail.com",
  guaranteeText: "Garantia de 7 dias.",
  termsUrl: "", // Link dos termos de uso
  privacyUrl: "", // Link da política de privacidade
  contactText: "Suporte: operacaoaprovacao.edu@gmail.com",
};

// Respostas comerciais sem confirmação nunca entram na FAQ pública.
export function getPurchaseFaq(settings: Pick<typeof CONFIG, "deliveryText" | "accessSupportText" | "refundText"> = CONFIG) {
  return [
    { question: "Como recebo meu e-book depois da compra?", answer: settings.deliveryText },
    { question: "Com quem falo se tiver dificuldade para acessar o material?", answer: settings.accessSupportText },
    { question: "Como solicito reembolso?", answer: settings.refundText },
  ].filter(({ answer }) => answer.trim().length > 0);
}
