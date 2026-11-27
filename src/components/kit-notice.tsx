import { Link } from "@tanstack/react-router";
import { CONFIG, getKitCheckoutHref } from "@/config";

/** Aviso nas páginas dos e-books: a compra entrega o kit (os dois e-books). Só aparece com o checkout do kit configurado. */
export function KitNotice() {
  if (!getKitCheckoutHref()) return null;
  return (
    <p className="kit-notice">
      <span aria-hidden="true">🎁</span>
      <span>
        <strong>Nesta compra você leva os 2 e-books:</strong> o Guia do Concurseiro Policial Cibernético e o IA para Concursos Policiais
        (60 prompts), com todos os bônus, por {CONFIG.kitPriceText}. <Link to="/kit-concurseiro-policial">Ver o kit →</Link>
      </span>
    </p>
  );
}
