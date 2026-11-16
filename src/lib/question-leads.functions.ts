import { createServerFn } from "@tanstack/react-start";
import { getRequest, setCookie } from "@tanstack/react-start/server";
import { questionLeadSchema } from "./question-leads.schemas";

export const registerQuestionLead = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => questionLeadSchema.parse(input))
  .handler(async ({ data }) => {
    const request = getRequest();
    const origin = new URL(request.url).origin;
    const fetchSite = request.headers.get("sec-fetch-site");
    if (request.headers.get("origin") !== origin || (fetchSite && fetchSite !== "same-origin")) return { ok: false };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: lead, error } = await supabaseAdmin.from("question_leads")
      .insert({ email: data.email, marketing_consent: data.marketingConsent })
      .select("id").single();
    if (error || !lead) return { ok: false };
    // An opaque, HttpOnly receipt proves capture succeeded; no address goes to the AI.
    setCookie("question-lead", lead.id, { httpOnly: true, secure: new URL(request.url).protocol === "https:", sameSite: "strict", path: "/", maxAge: 86400 });
    return { ok: true };
  });