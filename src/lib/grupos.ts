import { CONFIG } from "@/config";

export type Grupo = {
  id: "pmgo" | "pcmg" | "pmsp" | "pcto" | "gcm-goiania";
  nome: string;
  /** linha curta com o foco do grupo */
  desc: string;
  /** etiquetas pequenas (banca, estado) */
  tags: string[];
  /** ícone em public/grupos/ */
  icone: string;
  href: string;
};

type Settings = Pick<typeof CONFIG, "missaoGoiasUrl" | "grupoPcmgUrl" | "grupoPmspUrl" | "grupoPctoUrl" | "grupoGcmGoianiaUrl">;

const WHATSAPP_INVITE = /^https:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]+(\?[\w=&.-]*)?$/;

/** Aceita só convites do WhatsApp; qualquer outro valor deixa o grupo oculto. */
export function linkDeGrupo(url: string): string {
  const u = url.trim();
  return WHATSAPP_INVITE.test(u) ? u : "";
}

/**
 * Grupos de estudo da página /grupos, na ordem de exibição.
 * Grupos sem convite válido ficam ocultos. `destaque` (ex.: ?g=pmsp vindo de um anúncio) sobe o grupo para o topo.
 */
export function getGrupos(destaque?: string, settings: Settings = CONFIG): Grupo[] {
  const grupos: Grupo[] = [
    { id: "pmgo", nome: "Missão Goiás 2027 · PMGO e PCGO", desc: "Para quem mira a PM e a Polícia Civil de Goiás.", tags: ["GOIÁS", "AOCP"], icone: "/grupos/pmgo.webp", href: linkDeGrupo(settings.missaoGoiasUrl) },
    { id: "pmsp", nome: "Missão PM São Paulo", desc: "Aluno-Soldado PM SP, padrão Vunesp.", tags: ["SÃO PAULO", "VUNESP"], icone: "/grupos/pmsp.webp", href: linkDeGrupo(settings.grupoPmspUrl) },
    { id: "pcmg", nome: "Missão Polícia Civil Minas", desc: "Para quem mira a PCMG, com foco em Investigador.", tags: ["MINAS GERAIS"], icone: "/grupos/pcmg.webp", href: linkDeGrupo(settings.grupoPcmgUrl) },
    { id: "pcto", nome: "Missão Polícia Civil Tocantins", desc: "Delegado, Oficial Investigador e Perito, estilo Cebraspe.", tags: ["TOCANTINS", "CEBRASPE"], icone: "/grupos/pcto.webp", href: linkDeGrupo(settings.grupoPctoUrl) },
    { id: "gcm-goiania", nome: "Missão GCM Goiânia", desc: "Para quem mira a Guarda Civil Metropolitana de Goiânia.", tags: ["GOIÂNIA", "GUARDA"], icone: "/grupos/gcm-goiania.webp", href: linkDeGrupo(settings.grupoGcmGoianiaUrl) },
  ];
  const ativos = grupos.filter((g) => g.href.length > 0);
  const i = ativos.findIndex((g) => g.id === destaque);
  return i > 0 ? [ativos[i], ...ativos.slice(0, i), ...ativos.slice(i + 1)] : ativos;
}
