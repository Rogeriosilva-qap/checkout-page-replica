import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { commentSchema, newsletterSchema } from "./visitor-forms.schemas";

function isSameOrigin() {
  const request = getRequest();
  const origin = request.headers.get("origin");
  const fetchSite = request.headers.get("sec-fetch-site");
  return origin === new URL(request.url).origin && (!fetchSite || fetchSite === "same-origin");
}

// Public, write-only actions: validated visitors may submit, never list or edit rows.
export const submitComment = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => commentSchema.parse(input))
  .handler(async ({ data }) => {
    if (!isSameOrigin()) return { ok: false };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("comment_submissions").insert({ name: data.name, message: data.message });
    return { ok: !error };
  });

export const subscribeNewsletter = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => newsletterSchema.parse(input))
  .handler(async ({ data }) => {
    if (!isSameOrigin()) return { ok: false };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("newsletter_subscriptions").insert({ email: data.email, consent: data.consent });
    // The same response prevents revealing whether an address was already registered.
    return { ok: !error || error.code === "23505" };
  });