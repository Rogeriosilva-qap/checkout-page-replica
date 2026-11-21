import { describe, expect, it } from "vitest";
import { CONFIG, getCyberCheckoutHref, getCyberWaitlistHref } from "@/config";

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

describe("Cyber guide waitlist group", () => {
  it("hides the group button while the link is empty", () => {
    expect(getCyberWaitlistHref("")).toBeNull();
  });
  it("opens the WhatsApp waitlist group configured for the simulados platform", () => {
    expect(getCyberWaitlistHref()).toBe("https://chat.whatsapp.com/JjnVbBHGjnT2OlG8TznUPo");
    expect(CONFIG.cyberWaitlistUrl).toBe("https://chat.whatsapp.com/JjnVbBHGjnT2OlG8TznUPo");
  });
});
