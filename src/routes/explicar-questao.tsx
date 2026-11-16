import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { ArrowLeft, BookOpenCheck, LoaderCircle, ShieldAlert, Sparkles, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { explainQuestion } from "@/lib/explicar-questao.functions";
import { registerQuestionLead } from "@/lib/question-leads.functions";
import { questionLeadSchema, questionSchema } from "@/lib/question-leads.schemas";

export const Route = createFileRoute("/explicar-questao")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "Explique questões de concurso com IA | Operação Aprovação" },
      { name: "description", content: "Cole uma questão de prova de concurso de segurança pública e receba a explicação do raciocínio da resposta, com os pontos para conferir no seu material de estudo." },
      { property: "og:title", content: "Explique questões de concurso com IA" },
      { property: "og:description", content: "Cole uma questão de prova e veja o raciocínio da resposta explicado, com os pontos para conferir na fonte." },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:url", content: "https://operacaoaprovacaoebooks.com.br/explicar-questao" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://operacaoaprovacaoebooks.com.br/explicar-questao" }],
  }),
  component: ExplicarQuestao,
});

function renderExplanation(text: string) {
  const escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return { __html: escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") };
}

function ExplicarQuestao() {
  const runExplain = useServerFn(explainQuestion);
  const registerLead = useServerFn(registerQuestionLead);
  const [unlocked, setUnlocked] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [question, setQuestion] = useState("");
  const [explanation, setExplanation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function captureEmail(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (registering) return;
    const values = new FormData(event.currentTarget);
    const parsed = questionLeadSchema.safeParse({ email: values.get("email"), marketingConsent: values.get("marketingConsent") === "on", website: values.get("website") });
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? "Confira seu e-mail."); return; }
    setRegistering(true); setError("");
    try {
      const result = await registerLead({ data: parsed.data });
      if (result.ok) setUnlocked(true);
      else setError("Não foi possível cadastrar seu e-mail. Tente novamente.");
    } catch { setError("Não foi possível cadastrar seu e-mail. Tente novamente."); }
    finally { setRegistering(false); }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading || !unlocked) return;
    const parsed = questionSchema.safeParse({ question });
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? "Confira a questão."); return; }
    setError("");
    setExplanation("");
    setLoading(true);
    try {
      const result = await runExplain({ data: parsed.data });
      if (result.ok) setExplanation(result.explanation);
      else setError(result.message);
    } catch {
      setError("Cole a questão completa, com enunciado e alternativas, e tente de novo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="explainer">
      <header className="explainer-top">
        <Link to="/" className="explainer-back"><ArrowLeft size={18} aria-hidden="true" /> Voltar</Link>
        <Link to="/" className="explainer-brand">Operação Aprovação <small>· Estudos para Segurança Pública</small></Link>
      </header>
      <main className="explainer-main">
        <p className="explainer-eyebrow"><Sparkles size={16} aria-hidden="true" /> Ferramenta gratuita com IA</p>
        <h1>Entenda o raciocínio de qualquer questão de prova</h1>
        <p className="explainer-sub">Cole abaixo uma questão de concurso de segurança pública — com enunciado e alternativas — e receba a explicação da resposta passo a passo, com os pontos para conferir no seu material de estudo.</p>

        {!unlocked ? <form className="explainer-form explainer-lead" onSubmit={captureEmail}>
          <h2><Mail size={22} aria-hidden="true" /> Libere sua explicação gratuita</h2>
          <label htmlFor="lead-email">Seu e-mail</label>
          <input id="lead-email" name="email" type="email" autoComplete="email" maxLength={255} required placeholder="voce@exemplo.com" />
          <label className="explainer-lead-consent"><input type="checkbox" name="marketingConsent" /> Quero receber dicas de estudo e novidades de materiais da Operação Aprovação por e-mail (opcional).</label>
          <p className="explainer-lead-privacy">Usamos seu e-mail para registrar seu acesso à ferramenta. Novidades somente se você autorizar. <Link to="/politica-de-privacidade">Política de Privacidade</Link></p>
          <div className="form-trap" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
          <Button type="submit" className="explainer-submit" disabled={registering}>{registering ? <><LoaderCircle className="explainer-spin" size={18} aria-hidden="true" /> Cadastrando…</> : "Continuar para a questão"}</Button>
        </form> : <>
        <p className="explainer-unlocked" role="status"><CheckCircle2 size={20} aria-hidden="true" /> Acesso liberado! Envie sua questão.</p>
        <form className="explainer-form" onSubmit={submit}>
          <label htmlFor="questao">Questão da prova</label>
          <textarea
            id="questao"
            autoFocus
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder={"Exemplo:\n\n(CESPE — PM/DF) A respeito da legítima defesa, julgue o item a seguir.\n\nConfigura legítima defesa a ação de quem repele agressão injusta, atual ou iminente, a direito seu ou de outrem, usando moderadamente dos meios necessários.\n\n( ) Certo  ( ) Errado"}
            rows={10}
            maxLength={4000}
            required
          />
          <div className="explainer-form-footer">
            <span className="explainer-count">{question.length}/4000</span>
            <Button type="submit" className="explainer-submit" disabled={loading || question.trim().length < 20}>
              {loading ? <><LoaderCircle className="explainer-spin" size={18} aria-hidden="true" /> Explicando…</> : "Explicar a questão"}
            </Button>
          </div>
        </form>
        </>}

        {error && <p className="explainer-error" role="alert">{error}</p>}

        {explanation && (
          <section className="explainer-result" aria-live="polite">
            <h2><BookOpenCheck size={20} aria-hidden="true" /> Explicação</h2>
            <div className="explainer-answer" dangerouslySetInnerHTML={renderExplanation(explanation)} />
            <p className="explainer-disclaimer"><ShieldAlert size={15} aria-hidden="true" /> A IA pode errar. Confira sempre o tema, o artigo e o prazo na lei seca, no edital ou na sua apostila antes de memorizar.</p>
          </section>
        )}
      </main>
      <footer className="explainer-footer">
        <p>Operação Aprovação · <Link to="/">Conhecer o e-book IA para Concursos Policiais</Link></p>
      </footer>
    </div>
  );
}
