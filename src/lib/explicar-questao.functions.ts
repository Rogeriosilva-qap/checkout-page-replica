import { createServerFn } from "@tanstack/react-start";
import { getCookie, getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { questionSchema } from "./question-leads.schemas";
import { runLimitedExplanation } from "./question-quota";

function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const fetchSite = request.headers.get("sec-fetch-site");
  return origin === new URL(request.url).origin && (!fetchSite || fetchSite === "same-origin");
}

export type ExplainResult = { ok: true; explanation: string } | { ok: false; message: string; limited?: boolean };

export const explainQuestion = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => questionSchema.parse(input))
  .handler(async ({ data }): Promise<ExplainResult> => {
    const request = getRequest();
    if (!isSameOrigin(request)) return { ok: false, message: "Não foi possível enviar. Recarregue a página e tente de novo." };
    try {
      const leadId = z.string().uuid().safeParse(getCookie("question-lead"));
      if (!leadId.success) return { ok: false, message: "Informe seu e-mail primeiro para liberar a explicação." };
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: lead, error } = await supabaseAdmin.from("question_leads").select("id").eq("id", leadId.data).maybeSingle();
      if (error || !lead) return { ok: false, message: "Cadastre seu e-mail novamente para continuar." };
      return await runLimitedExplanation(async () => {
        const { data: claimed, error: claimError } = await supabaseAdmin.rpc("claim_question_explanation", { p_lead_id: leadId.data });
        if (claimError) throw new Error("quota_unavailable");
        return claimed === true;
      }, async () => {
        const { explainQuestion: run } = await import("./explicar-questao.server");
        return run(request, data.question);
      });
    } catch {
      return { ok: false, message: "A explicação não saiu desta vez. Aguarde alguns segundos e tente novamente." };
    }
  });
