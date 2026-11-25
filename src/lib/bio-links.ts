import { CONFIG } from "@/config";

export type BioLink = {
  id: string;
  label: string;
  /** frase curta abaixo do título */
  desc: string;
  href: string;
  /** etiqueta pequena (preço, "grátis", "em breve") */
  tag?: string;
  /** destino fora do site (abre em nova aba) */
  external: boolean;
  highlight?: boolean;
};

type Settings = Pick<typeof CONFIG, "simuladosUrl" | "missaoGoiasUrl" | "whatsappNumber" | "kitCheckoutUrl" | "kitPriceText">;

/**
 * Links da página /links (bio do Instagram), na ordem de exibição.
 * Itens com destino vazio em CONFIG ficam ocultos. Com o checkout do kit configurado,
 * o kit substitui os dois e-books avulsos.
 */
export function getBioLinks(settings: Settings = CONFIG): BioLink[] {
  const wa = settings.whatsappNumber.trim();
  const kit = settings.kitCheckoutUrl.trim().length > 0;
  const links: BioLink[] = [
    {
      id: "simulados",
      label: "Simulados Operação Aprovação",
      desc: "Simulados no padrão da sua banca. Crie sua conta e faça o 1º simulado grátis.",
      href: settings.simuladosUrl.trim(),
      tag: "1º GRÁTIS",
      external: true,
      highlight: true,
    },
    {
      id: "missao-goias",
      label: "Grupo Missão Goiás 2027 · PMGO e PCGO",
      desc: "Grupo gratuito e aberto de estudos para quem vai prestar PMGO e PCGO.",
      href: settings.missaoGoiasUrl.trim(),
      tag: "GRÁTIS",
      external: true,
      highlight: true,
    },
    {
      id: "kit",
      label: "Kit: 2 e-books pelo preço de 1",
      desc: "Guia Cibernético + 60 prompts, com bônus e desconto exclusivo na plataforma.",
      href: kit ? "/kit-concurseiro-policial" : "",
      tag: settings.kitPriceText.replace(",00", ""),
      external: false,
    },
    {
      id: "cibernetico",
      label: "Guia do Concurseiro Policial Cibernético",
      desc: "Método Bússola, 22 comandos prontos e caderno de erros automatizado.",
      href: kit ? "" : "/concurseiro-cibernetico",
      tag: "E-BOOK",
      external: false,
    },
    {
      id: "prompts",
      label: "IA para Concursos Policiais · 60 prompts",
      desc: "Transforme seu material em questões, revisões e plano de estudo.",
      href: kit ? "" : "/",
      tag: "E-BOOK",
      external: false,
    },
    {
      id: "explicar",
      label: "Explique uma questão com IA",
      desc: "Cole uma questão de prova e veja o raciocínio da resposta.",
      href: "/explicar-questao",
      tag: "GRÁTIS",
      external: false,
    },
    {
      id: "whatsapp",
      label: "Fale com a gente no WhatsApp",
      desc: "Dúvidas sobre os materiais e a plataforma.",
      href: wa ? `https://wa.me/${wa}` : "",
      external: true,
    },
  ];
  return links.filter((l) => l.href.length > 0);
}
