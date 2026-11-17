import { describe, expect, it } from "vitest";
import { getCyberCheckoutHref } from "@/config";

describe("Cyber guide checkout", () => {
  it("has no purchase destination while the link is empty", () => {
    expect(getCyberCheckoutHref("")).toBeNull();
    expect(getCyberCheckoutHref("   ")).toBeNull();
  });
  it("opens the configured link once filled", () => {
    expect(getCyberCheckoutHref("https://pay.example.com/x")).toBe("https://pay.example.com/x");
  });
});
