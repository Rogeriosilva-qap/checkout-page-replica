<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules
- The sales page lives in `src/routes/index.tsx`; its CSS is the original page CSS kept unlayered in `src/styles.css` (overrides Tailwind preflight) — keep page styles there, not as utility classes.
- Page visual overrides ("Tático & Premium") are appended at the end of `src/styles.css` after the original CSS so they win the cascade.
- Editable business settings (checkout link, optional FAQ/footer texts) live only in `src/config.ts`; empty values hide the related item.
- Purchase FAQ entries are filtered through `getPurchaseFaq` in the business configuration; this keeps unconfirmed delivery, access support and refund information out of the public page.
- Visitor comments and newsletter opt-ins use public write-only server functions with shared Zod validation, same-origin checks and honeypots; private tables have no visitor read grants to protect submitted data.
- Newsletter forms store explicit consent only; marketing delivery requires a dedicated marketing email service rather than Lovable app emails.

- Sitemap is router-derived (src/lib/sitemap.ts + src/routes/sitemap[.]xml.ts); every route must set staticData.sitemap so new pages make an explicit indexing decision.
- Cookie consent goes through src/lib/consent.ts (skill module, BR added to consent regions) and the banner in src/components/cookie-consent.tsx; never read consent storage keys directly.
- Paid-library previews must use permanently redacted raster assets, never CSS-only blur or an overlay over readable source media, so removing the lock cannot reveal paid content.
