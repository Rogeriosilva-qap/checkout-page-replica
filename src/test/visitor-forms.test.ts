import { describe, expect, it } from "vitest";
import { commentSchema, newsletterSchema } from "@/lib/visitor-forms.schemas";

describe("Visitor submission validation", () => {
  it("requires explicit consent for material announcements", () => {
    expect(newsletterSchema.safeParse({ email: "visitor@example.com", consent: false }).success).toBe(false);
    expect(newsletterSchema.safeParse({ email: "visitor@example.com", consent: true }).success).toBe(true);
  });
  it("requires a valid email and normalizes it", () => {
    expect(newsletterSchema.safeParse({ email: "invalid", consent: true }).success).toBe(false);
    expect(newsletterSchema.parse({ email: " Visitor@Example.com ", consent: true }).email).toBe("visitor@example.com");
  });
  it("rejects empty comments and oversized comments", () => {
    expect(commentSchema.safeParse({ name: "Visitante", message: " " }).success).toBe(false);
    expect(commentSchema.safeParse({ name: "Visitante", message: "x".repeat(2001) }).success).toBe(false);
    expect(commentSchema.safeParse({ name: "Visitante", message: "Meu comentário", rating: 5 }).success).toBe(true);
  });
  it("rejects filled bot traps", () => {
    expect(commentSchema.safeParse({ name: "Visitante", message: "Oi", rating: 5, website: "spam" }).success).toBe(false);
    expect(newsletterSchema.safeParse({ email: "visitor@example.com", consent: true, website: "spam" }).success).toBe(false);
  });
  it("aceita somente notas de 1 a 5 estrelas", () => {
    expect(commentSchema.safeParse({ name: "V", message: "Bom", rating: 0 }).success).toBe(false);
    expect(commentSchema.safeParse({ name: "V", message: "Bom", rating: 6 }).success).toBe(false);
    expect(commentSchema.safeParse({ name: "V", message: "Bom", rating: 4 }).success).toBe(true);
  });
});
