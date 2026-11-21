import { createFileRoute, Link } from "@tanstack/react-router";
import { getBioLinks, type BioLink } from "@/lib/bio-links";
import logo from "@/assets/logo-operacao-aprovacao.png.asset.json";

const TITLE = "Links | Operação Aprovação";
const DESC = "Materiais de estudo, plataforma de simulados e contato da Operação Aprovação.";

export const Route = createFileRoute("/links")({
  // Página de links da bio: fora do sitemap e sem indexação.
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Operação Aprovação" },
      { property: "og:description", content: DESC },
    ],
  }),
  component: LinksPage,
});

function Item({ l }: { l: BioLink }) {
  const body = (
    <>
      <span className="lk-txt">
        <span className="lk-label">{l.label}</span>
        <span className="lk-desc">{l.desc}</span>
      </span>
      {l.tag ? <span className="lk-tag">{l.tag}</span> : null}
      <span className="lk-arrow" aria-hidden="true">→</span>
    </>
  );
  const cls = `lk-item${l.highlight ? " lk-hi" : ""}`;
  return l.external ? (
    <a className={cls} href={l.href} target="_blank" rel="noopener noreferrer">{body}</a>
  ) : (
    <Link className={cls} to={l.href}>{body}</Link>
  );
}

function LinksPage() {
  const links = getBioLinks();
  return (
    <main className="links">
      <div className="lk-wrap">
        <img className="lk-logo" src={logo.url} alt="Operação Aprovação" width={112} height={112} />
        <h1>Operação Aprovação</h1>
        <p className="lk-sub">Estudos para segurança pública · PM · PC · PF · PRF · Polícia Penal · GCM</p>
        <nav className="lk-list" aria-label="Links da Operação Aprovação">
          {links.map((l) => <Item key={l.id} l={l} />)}
        </nav>
        <p className="lk-foot">
          Material educacional independente. Não garantimos aprovação.
          <br />
          <Link to="/politica-de-privacidade">Privacidade</Link> · <Link to="/termos-de-uso">Termos</Link>
        </p>
      </div>
    </main>
  );
}
