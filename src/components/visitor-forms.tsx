import { useEffect, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Star, Mail, Camera, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { commentSchema, newsletterSchema } from "@/lib/visitor-forms.schemas";
import { listTestimonials, submitComment, subscribeNewsletter } from "@/lib/visitor-forms.functions";

export function VisitorForms() {
  const saveComment = useServerFn(submitComment);
  const subscribe = useServerFn(subscribeNewsletter);
  const [commentStatus, setCommentStatus] = useState("");
  const [newsStatus, setNewsStatus] = useState("");
  const [commentBusy, setCommentBusy] = useState(false);
  const [newsBusy, setNewsBusy] = useState(false);
  const [rating, setRating] = useState(5);
  const [avatar, setAvatar] = useState("");
  const fetchTestimonials = useServerFn(listTestimonials);
  const [items, setItems] = useState<{ id: string; name: string; message: string; rating: number; avatar: string | null }[]>([]);
  useEffect(() => { fetchTestimonials().then(setItems).catch(() => {}); }, [fetchTestimonials]);

  async function sendComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (commentBusy) return;
    const form = event.currentTarget;
    const values = new FormData(form);
    const parsed = commentSchema.safeParse({ ...Object.fromEntries(values), avatar });
    if (!parsed.success) { setCommentStatus(parsed.error.issues[0]?.message ?? "Confira os campos."); return; }
    setCommentBusy(true);
    setCommentStatus("");
    try {
      const result = await saveComment({ data: parsed.data });
      setCommentStatus(result.ok ? "Obrigado! Seu depoimento foi enviado e aparece aqui após revisão." : "Não foi possível enviar. Tente novamente.");
      if (result.ok) { form.reset(); setRating(5); setAvatar(""); }
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
    <section className="visitor-section" aria-label="Depoimentos e novidades">
      {items.length > 0 && (
        <div className="wrap">
          <h2 id="t-depo">O que dizem os leitores</h2>
          <div className="testimonials">
            {items.map((t) => (
              <figure className="testimonial" key={t.id}>
                <Stars value={t.rating} />
                <blockquote>“{t.message}”</blockquote>
                <figcaption className="who"><span className="avatar">{t.avatar ? <img src={t.avatar} alt="" /> : <span aria-hidden="true">{t.name.trim().charAt(0).toUpperCase()}</span>}</span>{t.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      )}
      <div className="wrap visitor-grid">
        <div>
          <h2 id="t-comments"><Star aria-hidden="true" />Deixe seu depoimento</h2>
          <p className="note">Já usou o e-book? Conte como foi. Os depoimentos são revisados antes de aparecer na página.</p>
          <form className="visitor-form" aria-labelledby="t-comments" onSubmit={sendComment}>
            <span className="star-label" id="rating-label">Sua nota</span>
            <div className="star-input" role="radiogroup" aria-labelledby="rating-label">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" role="radio" aria-checked={rating === n} aria-label={`${n} estrela${n > 1 ? "s" : ""}`} onClick={() => setRating(n)}>
                  <Star className={n <= rating ? "on" : ""} aria-hidden="true" />
                </button>
              ))}
            </div>
            <input type="hidden" name="rating" value={rating} />
            <div className="avatar-pick">
              <span className="avatar">{avatar ? <img src={avatar} alt="Prévia da sua foto" /> : <Camera aria-hidden="true" />}</span>
              <label className="avatar-btn">{avatar ? "Trocar foto" : "Adicionar foto (opcional)"}
                <input type="file" accept="image/*" className="sr-only" onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; try { setAvatar(await shrinkPhoto(f)); } catch { setCommentStatus("Não foi possível usar essa foto."); } }} />
              </label>
              {avatar && <button type="button" className="avatar-remove" onClick={() => setAvatar("")}>Remover</button>}
            </div>
            <label htmlFor="comment-name">Nome</label>
            <input id="comment-name" name="name" autoComplete="name" maxLength={100} required />
            <label htmlFor="comment-message">Depoimento</label>
            <textarea id="comment-message" name="message" rows={5} maxLength={2000} required />
            <div className="form-trap" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
            <Button className="btn" type="submit" disabled={commentBusy}>{commentBusy ? "Enviando…" : "Enviar depoimento"}</Button>
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
function Stars({ value }: { value: number }) {
  return (
    <span className="stars" role="img" aria-label={`${value} de 5 estrelas`}>
      {[1, 2, 3, 4, 5].map((n) => <Star key={n} className={n <= value ? "on" : ""} aria-hidden="true" />)}
    </span>
  );
}

// Crops to a centered square and shrinks to 160px JPEG so the photo stays light.
async function shrinkPhoto(file: File): Promise<string> {
  const bmp = await createImageBitmap(file);
  const side = Math.min(bmp.width, bmp.height);
  const c = document.createElement("canvas"); c.width = c.height = 160;
  c.getContext("2d")!.drawImage(bmp, (bmp.width - side) / 2, (bmp.height - side) / 2, side, side, 0, 0, 160, 160);
  return c.toDataURL("image/jpeg", 0.8);
}

export function SimuladosSignup() {
  const subscribe = useServerFn(subscribeNewsletter);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    const v = new FormData(form);
    const parsed = newsletterSchema.safeParse({ email: v.get("email"), consent: v.get("consent") === "on", website: v.get("website"), topic: "simulados-v1" });
    if (!parsed.success) { setStatus(parsed.error.issues[0]?.message ?? "Confira os campos."); return; }
    setBusy(true); setStatus("");
    try {
      const r = await subscribe({ data: parsed.data });
      setStatus(r.ok ? "Pronto! Você será avisado em primeira mão quando a plataforma abrir." : "Não foi possível cadastrar. Tente novamente.");
      if (r.ok) form.reset();
    } catch { setStatus("Não foi possível cadastrar. Tente novamente."); }
    finally { setBusy(false); }
  }
  return (
    <section className="simulados" aria-labelledby="t-sim">
      <div className="wrap sim-grid">
        <div>
          <span className="sim-tag"><Target aria-hidden="true" />Em breve · Lista de espera</span>
          <h2 id="t-sim">Vem aí a plataforma de simulados da Operação Aprovação</h2>
          <p>Uma plataforma exclusiva de simulados para concursos de segurança pública: PM, PC, Polícia Penal, GCM e outras carreiras. Treine no estilo da banca, veja seus erros na hora e saiba onde focar.</p>
          <p className="sim-note">Deixe seu e-mail e seja avisado antes de todo mundo no lançamento.</p>
        </div>
        <form className="visitor-form sim-form" aria-labelledby="t-sim" onSubmit={send}>
          <label htmlFor="sim-email">Seu melhor e-mail</label>
          <input id="sim-email" name="email" type="email" autoComplete="email" maxLength={255} required />
          <label className="consent-label"><input name="consent" type="checkbox" required />Quero receber por e-mail o aviso de lançamento da plataforma de simulados e novidades da Operação Aprovação.</label>
          <div className="form-trap" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
          <Button className="btn" type="submit" disabled={busy}>{busy ? "Cadastrando…" : "Quero ser avisado"}</Button>
          <p className="form-status" role="status" aria-live="polite">{status}</p>
        </form>
      </div>
    </section>
  );
}
