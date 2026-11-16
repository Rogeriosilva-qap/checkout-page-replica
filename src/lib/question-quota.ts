export const QUESTION_LIMIT_MESSAGE = "Você já utilizou sua explicação gratuita. Conheça o e-book para continuar seus estudos com seus próprios comandos de IA.";

// Claim before generating: even parallel requests or a failed AI call cannot spend twice.
export async function runLimitedExplanation(claim: () => Promise<boolean>, generate: () => Promise<string>) {
  if (!await claim()) return { ok: false as const, limited: true as const, message: QUESTION_LIMIT_MESSAGE };
  try {
    return { ok: true as const, explanation: await generate() };
  } catch {
    return { ok: false as const, limited: true as const, message: "Não foi possível concluir a explicação. Sua tentativa gratuita foi utilizada; conheça o e-book para continuar seus estudos." };
  }
}