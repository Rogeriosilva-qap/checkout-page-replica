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
    const { error } = await supabaseAdmin.from("comment_submissions").insert({ name: data.name, message: data.message, rating: data.rating, avatar: data.avatar ?? null });
    return { ok: !error };
  });

export const subscribeNewsletter = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => newsletterSchema.parse(input))
  .handler(async ({ data }) => {
    if (!isSameOrigin()) return { ok: false };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("newsletter_subscriptions").insert({ email: data.email, consent: data.consent, consent_version: data.topic });
    // The same response prevents revealing whether an address was already registered.
    return { ok: !error || error.code === "23505" };
  });
// Only testimonials manually approved by the owner are shown publicly.
export const listTestimonials = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.from("comment_submissions")
    .select("id, name, message, rating, avatar")
    .eq("approved", true)
    .order("created_at", { ascending: false })
    .limit(12);
  return (data ?? []) as { id: string; name: string; message: string; rating: number; avatar: string | null }[];
});
