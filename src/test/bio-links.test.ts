import { describe, expect, it } from "vitest";
import { getBioLinks } from "@/lib/bio-links";
import { CONFIG, getKitCheckoutHref } from "@/config";

const base = { simuladosUrl: "https://xn--simuladosoperaoaprovao-q4bh5gi.com.br", missaoGoiasUrl: "https://chat.whatsapp.com/Cho0lxWH2BGLVDJr1qsLYY", whatsappNumber: "5562999999999", kitCheckoutUrl: "", kitPriceText: "R$ 47,00" };

describe("getBioLinks", () => {
  it("lists the live platform and study group first, plus both e-books while the kit has no checkout", () => {
    const links = getBioLinks(base);
    expect(links[0]).toMatchObject({ id: "simulados", highlight: true, external: true });
    expect(links.map((l) => l.id)).toEqual(["simulados", "missao-goias", "cibernetico", "prompts", "explicar", "whatsapp"]);
    expect(links.find((l) => l.id === "whatsapp")?.href).toBe("https://wa.me/5562999999999");
  });

  it("shows the kit instead of the separate e-books once the kit checkout exists", () => {
    const links = getBioLinks({ ...base, kitCheckoutUrl: "https://pay.example/kit" });
    expect(links.map((l) => l.id)).toEqual(["simulados", "missao-goias", "kit", "explicar", "whatsapp"]);
    expect(links.find((l) => l.id === "kit")).toMatchObject({ href: "/kit-concurseiro-policial", tag: "R$ 47" });
  });

  it("hides items whose link is not configured", () => {
    const links = getBioLinks({ ...base, simuladosUrl: " ", missaoGoiasUrl: " ", whatsappNumber: "" });
    expect(links.map((l) => l.id)).toEqual(["cibernetico", "prompts", "explicar"]);
  });
  it("points simulados to the live platform rather than the retained waitlist", () => {
    expect(CONFIG.simuladosUrl).toBe("https://xn--simuladosoperaoaprovao-q4bh5gi.com.br");
    expect(getBioLinks().find((l) => l.id === "simulados")).toMatchObject({ href: CONFIG.simuladosUrl, external: true, highlight: true });
    expect(getBioLinks().some((l) => l.href === CONFIG.cyberWaitlistUrl)).toBe(false);
  });
  it("points Missão Goiás to its free PMGO and PCGO group", () => {
    expect(CONFIG.missaoGoiasUrl).toBe("https://chat.whatsapp.com/Cho0lxWH2BGLVDJr1qsLYY");
    expect(getBioLinks().find((l) => l.id === "missao-goias")).toMatchObject({ href: CONFIG.missaoGoiasUrl, external: true, highlight: true });
  });
  it("hides each unconfigured destination independently", () => {
    expect(getBioLinks({ ...base, simuladosUrl: " " }).map((l) => l.id)).toEqual(["missao-goias", "cibernetico", "prompts", "explicar", "whatsapp"]);
    expect(getBioLinks({ ...base, missaoGoiasUrl: " " }).map((l) => l.id)).toEqual(["simulados", "cibernetico", "prompts", "explicar", "whatsapp"]);
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
