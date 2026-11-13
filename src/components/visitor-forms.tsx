import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { MessageSquare, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { commentSchema, newsletterSchema } from "@/lib/visitor-forms.schemas";
import { submitComment, subscribeNewsletter } from "@/lib/visitor-forms.functions";

export function VisitorForms() {
  const saveComment = useServerFn(submitComment);
  const subscribe = useServerFn(subscribeNewsletter);
  const [commentStatus, setCommentStatus] = useState("");
  const [newsStatus, setNewsStatus] = useState("");
  const [commentBusy, setCommentBusy] = useState(false);
  const [newsBusy, setNewsBusy] = useState(false);

  async function sendComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (commentBusy) return;
    const form = event.currentTarget;
    const values = new FormData(form);
    const parsed = commentSchema.safeParse(Object.fromEntries(values));
    if (!parsed.success) { setCommentStatus(parsed.error.issues[0]?.message ?? "Confira os campos."); return; }
    setCommentBusy(true);
    setCommentStatus("");
    try {
      const result = await saveComment({ data: parsed.data });
      setCommentStatus(result.ok ? "Comentário enviado à Operação Aprovação." : "Não foi possível enviar. Tente novamente.");
      if (result.ok) form.reset();
    } catch { setCommentStatus("Não foi possível enviar. Tente novamente."); }
    finally { setCommentBusy(false); }
  }

  async function sendNews(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (newsBusy) return;
    const form = event.currentTarget;
    const values = new FormData(form);
    const parsed = newsletterSchema.safeParse({ email: values.get("email"), consent: values.get("consent") === "on", website: values.get("website") });
    if (!parsed.success) { setNewsStatus(parsed.error.issues[0]?.message ?? "Confira os campos."); return; }
    setNewsBusy(true);
    setNewsStatus("");
    try {
      const result = await subscribe({ data: parsed.data });
      setNewsStatus(result.ok ? "Cadastro para novidades registrado." : "Não foi possível cadastrar. Tente novamente.");
      if (result.ok) form.reset();
    } catch { setNewsStatus("Não foi possível cadastrar. Tente novamente."); }
    finally { setNewsBusy(false); }
  }

  return (
    <section className="visitor-section" aria-label="Comentários e novidades">
      <div className="wrap visitor-grid">
        <div>
          <h2 id="t-comments"><MessageSquare aria-hidden="true" />Deixe seu comentário</h2>
          <p className="note">Seu comentário é privado e destinado à Operação Aprovação.</p>
          <form className="visitor-form" aria-labelledby="t-comments" onSubmit={sendComment}>
            <label htmlFor="comment-name">Nome</label>
            <input id="comment-name" name="name" autoComplete="name" maxLength={100} required />
            <label htmlFor="comment-message">Comentário</label>
            <textarea id="comment-message" name="message" rows={5} maxLength={2000} required />
            <div className="form-trap" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
            <Button className="btn" type="submit" disabled={commentBusy}>{commentBusy ? "Enviando…" : "Enviar comentário"}</Button>
            <p className="form-status" role="status" aria-live="polite">{commentStatus}</p>
          </form>
        </div>
        <div>
          <h2 id="t-news"><Mail aria-hidden="true" />Novos materiais</h2>
          <form className="visitor-form" aria-labelledby="t-news" onSubmit={sendNews}>
            <label htmlFor="news-email">E-mail</label>
            <input id="news-email" name="email" type="email" autoComplete="email" maxLength={255} required />
            <label className="consent-label"><input name="consent" type="checkbox" required />Quero receber por e-mail notícias de novos materiais da Operação Aprovação.</label>
            <div className="form-trap" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
            <Button className="btn" type="submit" disabled={newsBusy}>{newsBusy ? "Cadastrando…" : "Quero receber novidades"}</Button>
            <p className="form-status" role="status" aria-live="polite">{newsStatus}</p>
          </form>
        </div>
      </div>
    </section>
  );
}