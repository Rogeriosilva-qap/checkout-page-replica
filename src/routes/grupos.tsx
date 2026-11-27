import { createFileRoute, Link } from "@tanstack/react-router";
import { getGrupos, type Grupo } from "@/lib/grupos";
import { CONFIG, getSimuladosHref } from "@/config";
import logo from "@/assets/logo-operacao-aprovacao.png.asset.json";

const TITLE = "Grupos de estudo gratuitos | Operação Aprovação";
const DESC = "Grupos de WhatsApp gratuitos para quem estuda para PMGO, PCGO, PM SP, PCMG, PC TO e GCM Goiânia.";

export const Route = createFileRoute("/grupos")({
  // Página de destino de anúncios e da bio: fora do sitemap e sem indexação.
  staticData: { sitemap: false },
  validateSearch: (s: Record<string, unknown>): { g?: string } => (typeof s.g === "string" && s.g.length <= 20 ? { g: s.g } : {}),
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Grupos de estudo gratuitos · Operação Aprovação" },
      { property: "og:description", content: DESC },
    ],
  }),
  component: GruposPage,
});

function Card({ g, destaque }: { g: Grupo; destaque: boolean }) {
  return (
    <a className={`gr-card${destaque ? " gr-hi" : ""}`} href={g.href} target="_blank" rel="noopener noreferrer">
      <img className="gr-ico" src={g.icone} alt="" width={64} height={64} loading="lazy" />
      <span className="gr-txt">
        <span className="gr-nome">{g.nome}</span>
        <span className="gr-desc">{g.desc}</span>
        <span className="gr-tags">{g.tags.map((t) => <span key={t}>{t}</span>)}</span>
      </span>
      <span className="gr-btn">Entrar<span aria-hidden="true"> →</span></span>
    </a>
  );
}

function GruposPage() {
  const { g } = Route.useSearch();
  const grupos = getGrupos(g);
  const simulados = getSimuladosHref(CONFIG.simuladosUrl);
  return (
    <main className="grupos">
      <div className="gr-wrap">
        <img className="gr-logo" src={logo.url} alt="Operação Aprovação" width={96} height={96} />
        <p className="gr-kicker">GRUPOS DE ESTUDO · WHATSAPP</p>
        <h1>Estude junto, <em>de graça</em></h1>
        <p className="gr-sub">Escolha o seu concurso e entre no grupo: Questão do Dia, gabarito comentado e notícias só com fonte oficial.</p>
        {grupos.length ? (
          <nav className="gr-list" aria-label="Grupos de estudo">
            {grupos.map((x, i) => <Card key={x.id} g={x} destaque={i === 0 && x.id === g} />)}
          </nav>
        ) : (
          <p className="gr-vazio">Os grupos abrem em breve.</p>
        )}
        <ul className="gr-regras">
          <li>Gratuitos e abertos</li>
          <li>Sem PDF pirata e sem spam</li>
          <li>Notícia só com fonte oficial</li>
        </ul>
        {simulados ? (
          <a className="gr-sim" href={simulados} target="_blank" rel="noopener noreferrer">
            <span>Quer treinar no padrão da banca?</span>
            <strong>Faça o 1º simulado grátis →</strong>
          </a>
        ) : null}
        <p className="gr-foot">
          Conteúdo educativo, sem vínculo com as corporações, governos ou bancas. Não garantimos aprovação.
          <br />
          <Link to="/politica-de-privacidade">Privacidade</Link> · <Link to="/termos-de-uso">Termos</Link>
        </p>
      </div>
    </main>
  );
}
