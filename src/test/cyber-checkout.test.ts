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
  it("sends buyers to the Kirvano checkout of the cyber guide", () => {
    expect(getCyberCheckoutHref()).toBe("https://pay.kirvano.com/6a88a8dd-e999-440e-8f94-5d922f3615a4");
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
