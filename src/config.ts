/* =========================================================
   CONFIGURAÇÃO DA PÁGINA — preencha antes de publicar.
   Deixe "" o que ainda não estiver confirmado: o item fica oculto.
   ========================================================= */
export const CONFIG = {
  cyberCheckoutUrl: "https://pay.kirvano.com/6a88a8dd-e999-440e-8f94-5d922f3615a4", // Checkout do Guia do Concurseiro Policial Cibernético. Vazio = botões mostram "Link de compra em breve."
  kitCheckoutUrl: "", // Checkout do Kit (os 2 e-books). Vazio = página do kit mostra "Link de compra em breve" e o kit fica fora da página /links.
  kitPriceText: "R$ 47,00", // Preço do kit cobrado no checkout.
  kitSeparatePriceText: "R$ 94,00", // Soma dos dois e-books comprados separadamente (âncora real).
  cyberWaitlistUrl: "https://chat.whatsapp.com/JjnVbBHGjnT2OlG8TznUPo", // Grupo de espera da plataforma de simulados. Vazio = botão do grupo fica oculto.
  checkoutUrl: "https://pay.kirvano.com/28b35434-3fbf-4f7e-914d-ae6212e77484", // URL do checkout (ex.: link da plataforma de pagamento). OBRIGATÓRIO para vender.
  listPriceText: "R$ 97,00", // Preço cheio confirmado do e-book, exibido riscado ao lado do preço de lançamento. Deixe "" para ocultar.
  launchPriceText: "R$ 47,00", // Preço de lançamento cobrado agora.
  includedPdfs: {
    complete: { title: "E-book completo", pages: 70 },
    quick: { title: "Biblioteca resumida de prompts", included: true },
  },
  deliveryText: "O material será entregue pela plataforma, com acesso por login e senha. Você também receberá um link via mensagem para acessar o material.",
  accessSupportText: "Se tiver dificuldade para acessar o material, fale com nosso suporte pelo e-mail operacaoaprovacao.edu@gmail.com.",
  refundText: "", // Canal, passos, prazo e condições de reembolso confirmados para esta compra.
  supportText: "O e-book tem garantia de 7 dias.",
  guaranteeDays: 7,
  supportEmail: "operacaoaprovacao.edu@gmail.com",
  guaranteeText: "Garantia de 7 dias.",
  termsUrl: "/termos-de-uso", // Link dos termos de uso
  privacyUrl: "/politica-de-privacidade", // Link da política de privacidade
  contactText: "Suporte: operacaoaprovacao.edu@gmail.com",
  whatsappNumber: "5562992810711", // País + DDD + número, apenas dígitos. Deixe "" para ocultar.
  whatsappText: "(62) 9 9281-0711",
};

// Respostas comerciais sem confirmação nunca entram na FAQ pública.
export function getPurchaseFaq(settings: Pick<typeof CONFIG, "deliveryText" | "accessSupportText" | "refundText"> = CONFIG) {
  return [
    { question: "Como recebo meu e-book depois da compra?", answer: settings.deliveryText },
    { question: "Com quem falo se tiver dificuldade para acessar o material?", answer: settings.accessSupportText },
    { question: "Como solicito reembolso?", answer: settings.refundText },
  ].filter(({ answer }) => answer.trim().length > 0);
}

// Link de compra do guia cibernético; null enquanto o checkout não existir.
export function getCyberCheckoutHref(url: string = CONFIG.cyberCheckoutUrl): string | null {
  const v = url.trim();
  return v.length > 0 ? v : null;
}

// Link do grupo de espera dos simulados; null enquanto o grupo não existir.
export function getCyberWaitlistHref(url: string = CONFIG.cyberWaitlistUrl): string | null {
  const v = url.trim();
  return v.length > 0 ? v : null;
}

// Link de compra do Kit (os dois e-books); null enquanto o checkout não existir.
export function getKitCheckoutHref(url: string = CONFIG.kitCheckoutUrl): string | null {
  const v = url.trim();
  return v.length > 0 ? v : null;
}
