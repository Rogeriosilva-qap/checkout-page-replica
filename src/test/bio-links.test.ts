import { describe, expect, it } from "vitest";
import { getBioLinks } from "@/lib/bio-links";
import { getKitCheckoutHref } from "@/config";

const base = { cyberWaitlistUrl: "https://chat.whatsapp.com/x", whatsappNumber: "5562999999999", kitCheckoutUrl: "", kitPriceText: "R$ 47,00" };

describe("getBioLinks", () => {
  it("lists the waitlist first and highlighted, plus both e-books while the kit has no checkout", () => {
    const links = getBioLinks(base);
    expect(links[0]).toMatchObject({ id: "simulados", highlight: true, external: true });
    expect(links.map((l) => l.id)).toEqual(["simulados", "cibernetico", "prompts", "explicar", "whatsapp"]);
    expect(links.find((l) => l.id === "whatsapp")?.href).toBe("https://wa.me/5562999999999");
  });

  it("shows the kit instead of the separate e-books once the kit checkout exists", () => {
    const links = getBioLinks({ ...base, kitCheckoutUrl: "https://pay.example/kit" });
    expect(links.map((l) => l.id)).toEqual(["simulados", "kit", "explicar", "whatsapp"]);
    expect(links.find((l) => l.id === "kit")).toMatchObject({ href: "/kit-concurseiro-policial", tag: "R$ 47" });
  });

  it("hides items whose link is not configured", () => {
    const links = getBioLinks({ ...base, cyberWaitlistUrl: " ", whatsappNumber: "" });
    expect(links.map((l) => l.id)).toEqual(["cibernetico", "prompts", "explicar"]);
  });
});

describe("getKitCheckoutHref", () => {
  it("returns null for an empty link so the kit button never navigates", () => {
    expect(getKitCheckoutHref("  ")).toBeNull();
    expect(getKitCheckoutHref("https://pay.example/kit")).toBe("https://pay.example/kit");
  });
});

import { getPriceAnchor } from "@/config";

describe("getPriceAnchor", () => {
  it("anchors the kit against the real sum of both e-books when the kit checkout exists", () => {
    expect(getPriceAnchor({ kitCheckoutUrl: "https://pay.example/kit", kitSeparatePriceText: "R$ 94,00", listPriceText: "R$ 97,00" })).toMatchObject({
      prefix: "Separados:",
      price: "R$ 94,00",
      label: "Kit com 2 e-books · pagamento único",
    });
  });
  it("keeps the single e-book anchor while the kit is off", () => {
    expect(getPriceAnchor({ kitCheckoutUrl: "", kitSeparatePriceText: "R$ 94,00", listPriceText: "R$ 97,00" })).toMatchObject({ prefix: "De", price: "R$ 97,00" });
  });
});
