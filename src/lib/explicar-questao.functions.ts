import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";

const questionSchema = z.object({
  question: z
    .string()
    .trim()
    .min(20, "Cole a questão completa, com enunciado e alternativas.")
    .max(4000, "A questão ficou longa demais; envie apenas o enunciado e as alternativas."),
});

function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const fetchSite = request.headers.get("sec-fetch-site");
  return origin === new URL(request.url).origin && (!fetchSite || fetchSite === "same-origin");
}

export type ExplainResult = { ok: true; explanation: string } | { ok: false; message: string };

export const explainQuestion = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => questionSchema.parse(input))
  .handler(async ({ data }): Promise<ExplainResult> => {
    const request = getRequest();
    if (!isSameOrigin(request)) return { ok: false, message: "Não foi possível enviar. Recarregue a página e tente de novo." };
    try {
      const { explainQuestion: run } = await import("./explicar-questao.server");
      const explanation = await run(request, data.question);
      return { ok: true, explanation };
    } catch {
      return { ok: false, message: "A explicação não saiu desta vez. Aguarde alguns segundos e tente novamente." };
    }
  });
