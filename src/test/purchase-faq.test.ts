import { describe, expect, it } from "vitest";
import { CONFIG, getPurchaseFaq } from "@/config";

const empty = { deliveryText: "", accessSupportText: "", refundText: "" };

describe("Confirmed purchase information", () => {
  it("includes the complete 70-page PDF and the separate quick-reference prompt library", () => {
    expect(CONFIG.includedPdfs.complete.pages).toBe(70);
    expect(CONFIG.includedPdfs.quick.included).toBe(true);
  });
  it("uses the confirmed seven-day guarantee", () => {
    expect(CONFIG.guaranteeDays).toBe(7);
  });

  it("uses the official support email", () => {
    expect(CONFIG.supportEmail).toBe("operacaoaprovacao.edu@gmail.com");
  });
  it("uses the provided WhatsApp number with Brazil country code", () => {
    expect(CONFIG.whatsappNumber).toBe("5562992810711");
  });
  it("preserves the configured Kirvano purchase destination", () => {
    expect(CONFIG.checkoutUrl).toBe("https://pay.kirvano.com/28b35434-3fbf-4f7e-914d-ae6212e77484");
  });

  it("shows the confirmed full price of R$ 97,00 anchored against the R$ 47,00 launch price", () => {
    expect(CONFIG.listPriceText).toBe("R$ 97,00");
    expect(CONFIG.launchPriceText).toBe("R$ 47,00");
  });

  it("omits unconfirmed delivery instructions", () => {
    expect(getPurchaseFaq({ ...empty, deliveryText: "  " })).toEqual([]);
    expect(getPurchaseFaq({ ...empty, deliveryText: "Confirmed delivery" }).map(item => item.answer)).toEqual(["Confirmed delivery"]);
  });

  it("omits unconfirmed access support channels", () => {
    expect(getPurchaseFaq({ ...empty, accessSupportText: "  " })).toEqual([]);
    expect(getPurchaseFaq({ ...empty, accessSupportText: "Confirmed support" }).map(item => item.answer)).toEqual(["Confirmed support"]);
  });

  it("omits unconfirmed refund procedures and conditions", () => {
    expect(getPurchaseFaq({ ...empty, refundText: "  " })).toEqual([]);
    expect(getPurchaseFaq({ ...empty, refundText: "Confirmed refund" }).map(item => item.answer)).toEqual(["Confirmed refund"]);
  });
});