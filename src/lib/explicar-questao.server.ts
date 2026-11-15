import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

import { createLovableAiGatewayRunIdFetch, getLovableAiGatewayRunId } from "./ai/run-id.ts";

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1";
const MODEL = "openai/gpt-6-astra";

const INSTRUCTIONS = `Você é um professor de concursos de segurança pública no Brasil (PM, PC, Polícia Penal, GCM e PF). O candidato vai colar uma questão de prova, com ou sem o gabarito.

Sua tarefa, sempre em português do Brasil:
1. Diga qual é a resposta correta e explique o raciocínio passo a passo, em linguagem simples e direta.
2. Se a questão for de certo/errado ou múltipla escolha, explique por que a alternativa correta está certa e por que as principais distratores estão erradas.
3. Ao final, inclua uma seção "Pontos para conferir no seu material" com 2 a 4 itens curtos: o tema, o artigo de lei ou o conceito que o candidato deve revisar na fonte oficial (lei seca, edital ou apostila).
4. Se a questão estiver incompleta, mal formatada ou sem contexto suficiente, diga o que está faltando em vez de inventar a resposta.

Regras:
- Nunca invente número de artigo, prazo ou exceção: se não tiver certeza, escreva "confira o texto atualizado na fonte oficial".
- Não use markdown com títulos grandes; use no máximo negrito e listas simples.
- Seja objetivo: no máximo 350 palavras.`;

export async function explainQuestion(request: Request, question: string) {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("missing_lovable_api_key");

  const runIdFetch = createLovableAiGatewayRunIdFetch(getLovableAiGatewayRunId(request));
  const provider = createOpenAI({
    baseURL: GATEWAY_URL,
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });

  const result = streamText({
    model: provider.responses(MODEL),
    instructions: INSTRUCTIONS,
    messages: [{ role: "user", content: question }],
    abortSignal: request.signal,
    providerOptions: {
      openai: {
        store: false,
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        include: ["reasoning.encrypted_content"],
      },
    },
  });

  const text = (await result.text).trim();
  if (!text) throw new Error("empty_ai_response");
  return text;
}
