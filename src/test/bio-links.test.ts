import { describe, expect, it } from "vitest";
import { getBioLinks } from "@/lib/bio-links";

describe("getBioLinks", () => {
  it("lists the waitlist first and highlighted, plus both e-books", () => {
    const links = getBioLinks({ cyberWaitlistUrl: "https://chat.whatsapp.com/x", whatsappNumber: "5562999999999" });
    expect(links[0]).toMatchObject({ id: "simulados", highlight: true, external: true });
    expect(links.map((l) => l.id)).toEqual(["simulados", "cibernetico", "prompts", "explicar", "whatsapp"]);
    expect(links.find((l) => l.id === "whatsapp")?.href).toBe("https://wa.me/5562999999999");
  });

  it("hides items whose link is not configured", () => {
    const links = getBioLinks({ cyberWaitlistUrl: " ", whatsappNumber: "" });
    expect(links.map((l) => l.id)).toEqual(["cibernetico", "prompts", "explicar"]);
  });
});
