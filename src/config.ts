/* =========================================================
   CONFIGURAÇÃO DA PÁGINA — preencha antes de publicar.
   Deixe "" o que ainda não estiver confirmado: o item fica oculto.
   ========================================================= */
export const CONFIG = {
  checkoutUrl: "https://pay.kirvano.com/28b35434-3fbf-4f7e-914d-ae6212e77484", // URL do checkout (ex.: link da plataforma de pagamento). OBRIGATÓRIO para vender.
  deliveryText: "", // Fluxo confirmado de entrega e prazo após a aprovação do pagamento.
  accessSupportText: "", // Canal oficial e instruções para dificuldades de acesso ao PDF.
  refundText: "", // Canal, passos, prazo e condições de reembolso confirmados para esta compra.
  supportText: "", // Resposta para "Existe suporte, atualização ou garantia?"
  guaranteeText: "", // Linha sob o botão da oferta, só se houver política comercial real
  termsUrl: "", // Link dos termos de uso
  privacyUrl: "", // Link da política de privacidade
  contactText: "", // Contato oficial (e-mail ou canal)
};

// Respostas comerciais sem confirmação nunca entram na FAQ pública.
export function getPurchaseFaq(settings: Pick<typeof CONFIG, "deliveryText" | "accessSupportText" | "refundText"> = CONFIG) {
  return [
    { question: "Como recebo meu e-book depois da compra?", answer: settings.deliveryText },
    { question: "Com quem falo se tiver dificuldade para acessar o material?", answer: settings.accessSupportText },
    { question: "Como solicito reembolso?", answer: settings.refundText },
  ].filter(({ answer }) => answer.trim().length > 0);
}
