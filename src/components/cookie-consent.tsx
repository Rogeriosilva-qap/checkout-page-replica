import { useEffect, useRef, useState } from "react";
import { onConsentChange, readChoice, saveChoices, type Purpose } from "@/lib/consent";
import { CONFIG } from "@/config";

const PURPOSES: Purpose[] = ["analytics", "advertising"];

function hasGpc() {
  return (navigator as unknown as { globalPrivacyControl?: boolean }).globalPrivacyControl === true;
}

export function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(false);
  const [gpc, setGpc] = useState(false);
  const [prefs, setPrefs] = useState<Record<Purpose, boolean>>({ analytics: false, advertising: false });
  const ref = useRef<HTMLDivElement>(null);

  const load = () =>
    setPrefs({ analytics: readChoice("analytics") === "granted", advertising: readChoice("advertising") === "granted" });

  useEffect(() => {
    const g = hasGpc();
    setGpc(g);
    load();
    if (!g && PURPOSES.some((p) => readChoice(p) === null)) setOpen(true);
    const openSettings = () => {
      load();
      setSettings(true);
      setOpen(true);
    };
    window.addEventListener("open-cookie-settings", openSettings);
    const off = onConsentChange(load);
    return () => {
      window.removeEventListener("open-cookie-settings", openSettings);
      off();
    };
  }, []);

  useEffect(() => {
    if (open) ref.current?.focus();
  }, [open, settings]);

  if (!open) return null;

  const all = (choice: "granted" | "denied") => {
    saveChoices({ analytics: choice, advertising: choice });
    setOpen(false);
    setSettings(false);
  };
  const save = () => {
    saveChoices({
      analytics: prefs.analytics ? "granted" : "denied",
      advertising: prefs.advertising ? "granted" : "denied",
    });
    setOpen(false);
    setSettings(false);
  };

  return (
    <div className="cookie-panel" role="dialog" aria-modal="false" aria-labelledby="cookie-title" tabIndex={-1} ref={ref}>
      <h2 id="cookie-title">Sua privacidade</h2>
      {!settings ? (
        <p>
          Contamos visitas sem cookies. Com sua permissão, também medimos cliques e usamos cookies de anúncios para saber
          quais campanhas trazem leitores. Você escolhe — e pode mudar quando quiser em "Preferências de cookies", no
          rodapé.{" "}
          {CONFIG.privacyUrl && <a href={CONFIG.privacyUrl}>Política de privacidade</a>}
        </p>
      ) : (
        <div className="cookie-options">
          {gpc && <p className="cookie-note">Seu navegador envia um sinal de privacidade (GPC), então os itens opcionais ficam desligados.</p>}
          <div className="cookie-row">
            <div>
              <b>Necessários</b>
              <span>Mantêm a página funcionando e guardam esta escolha. Sempre ativos.</span>
            </div>
            <em>Sempre ativo</em>
          </div>
          {([
            ["analytics", "Análise", "Medir cliques e o uso da página, oferecido pela Lovable."],
            ["advertising", "Anúncios", "Medir resultados de anúncios e compras, oferecido pelo Google."],
          ] as const).map(([key, title, desc]) => (
            <label className="cookie-row" key={key}>
              <div>
                <b>{title}</b>
                <span>{desc}</span>
              </div>
              <input
                type="checkbox"
                role="switch"
                disabled={gpc}
                checked={!gpc && prefs[key]}
                onChange={(e) => setPrefs((p) => ({ ...p, [key]: e.target.checked }))}
              />
            </label>
          ))}
        </div>
      )}
      <div className="cookie-actions">
        <button type="button" className="cookie-btn" onClick={() => all("denied")}>Rejeitar todos</button>
        <button type="button" className="cookie-btn" onClick={() => all("granted")}>Aceitar todos</button>
        {settings ? (
          <button type="button" className="cookie-btn ghost" onClick={save}>Salvar preferências</button>
        ) : (
          <button type="button" className="cookie-btn ghost" onClick={() => setSettings(true)}>Personalizar</button>
        )}
      </div>
    </div>
  );
}
