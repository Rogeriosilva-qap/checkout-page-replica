import { describe, expect, it } from "vitest";
import { CONFIG, getCyberCheckoutHref, getCyberWaitlistHref, getSimuladosHref } from "@/config";

describe("Cyber guide checkout", () => {
  it("has no purchase destination while the link is empty", () => {
    expect(getCyberCheckoutHref("")).toBeNull();
    expect(getCyberCheckoutHref("   ")).toBeNull();
  });
  it("opens the configured link once filled", () => {
    expect(getCyberCheckoutHref("https://pay.example.com/x")).toBe("https://pay.example.com/x");
  });
  it("sends guide buyers to the kit checkout, which delivers both e-books", () => {
    expect(getCyberCheckoutHref()).toBe(CONFIG.kitCheckoutUrl);
    expect(getCyberCheckoutHref()).toBe("https://pay.kirvano.com/28b35434-3fbf-4f7e-914d-ae6212e77484");
  });
});

describe("Retained legacy waitlist configuration", () => {
  it("hides the group button while the link is empty", () => {
    expect(getCyberWaitlistHref("")).toBeNull();
  });
  it("opens the WhatsApp waitlist group configured for the simulados platform", () => {
    expect(getCyberWaitlistHref()).toBe("https://chat.whatsapp.com/JjnVbBHGjnT2OlG8TznUPo");
    expect(CONFIG.cyberWaitlistUrl).toBe("https://chat.whatsapp.com/JjnVbBHGjnT2OlG8TznUPo");
  });
});

describe("Live simulados platform", () => {
  it("uses the published platform destination for site calls to action", () => {
    expect(getSimuladosHref()).toBe("https://xn--simuladosoperaoaprovao-q4bh5gi.com.br");
    expect(getSimuladosHref()).toBe(CONFIG.simuladosUrl);
  });
  it("hides the platform link when unconfigured", () => {
    expect(getSimuladosHref(" ")).toBeNull();
    expect(getSimuladosHref(" https://xn--simuladosoperaoaprovao-q4bh5gi.com.br ")).toBe("https://xn--simuladosoperaoaprovao-q4bh5gi.com.br");
  });
});
