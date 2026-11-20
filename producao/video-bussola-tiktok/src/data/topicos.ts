// Exemplo ilustrativo do próprio guia (Figura 2): fatiamento da Lei de Execução Penal.
export type Nivel = "ALFA" | "BRAVO" | "CHARLIE";

export const TOPICOS: { id: string; titulo: string; tempo: string; nivel: Nivel; curto: string }[] = [
  { id: "objeto", titulo: "Objeto e aplicação da lei", tempo: "1 sessão", nivel: "CHARLIE", curto: "Objeto e aplicação" },
  { id: "classif", titulo: "Classificação e assistência ao condenado", tempo: "1 a 2 sessões", nivel: "BRAVO", curto: "Classificação e assistência" },
  { id: "trabalho", titulo: "Trabalho, deveres, direitos e disciplina", tempo: "2 a 3 sessões", nivel: "ALFA", curto: "Trabalho e disciplina" },
  { id: "orgaos", titulo: "Órgãos da execução penal", tempo: "1 a 2 sessões", nivel: "BRAVO", curto: "Órgãos da execução" },
  { id: "estab", titulo: "Estabelecimentos penais", tempo: "1 sessão", nivel: "CHARLIE", curto: "Estabelecimentos" },
  { id: "regimes", titulo: "Regimes, progressão, saídas e remição", tempo: "2 a 3 sessões", nivel: "ALFA", curto: "Regimes e progressão" },
  { id: "livramento", titulo: "Livramento condicional e incidentes de execução", tempo: "1 a 2 sessões", nivel: "BRAVO", curto: "Livramento condicional" },
];

/** ordem final após a priorização (ALFA no topo) */
export const ORDEM_PRIORIZADA = ["regimes", "trabalho", "orgaos", "livramento", "classif", "objeto", "estab"];

export const NIVEL_STYLE: Record<Nivel, { bg: string; fg: string }> = {
  ALFA: { bg: "#E3192B", fg: "#FFFFFF" },
  BRAVO: { bg: "#9E0F1C", fg: "#FFFFFF" },
  CHARLIE: { bg: "#2A2A32", fg: "#A7A7AD" },
};
