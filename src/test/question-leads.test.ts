import { describe, expect, it } from "vitest";
import { questionLeadSchema, questionSchema } from "@/lib/question-leads.schemas";

describe("Question lead capture", () => {
  it("requires a valid email before accessing the explanation", () => {
    expect(questionLeadSchema.safeParse({}).success).toBe(false);
    expect(questionLeadSchema.safeParse({ email: "invalid" }).success).toBe(false);
    expect(questionLeadSchema.parse({ email: " Learner@Example.com " }).email).toBe("learner@example.com");
  });
  it("does not force or assume marketing consent", () => {
    expect(questionLeadSchema.parse({ email: "learner@example.com" }).marketingConsent).toBe(false);
    expect(questionLeadSchema.parse({ email: "learner@example.com", marketingConsent: true }).marketingConsent).toBe(true);
  });
  it("rejects bots filling the hidden field", () => {
    expect(questionLeadSchema.safeParse({ email: "learner@example.com", website: "spam" }).success).toBe(false);
  });
  it("preserves the question length limits", () => {
    expect(questionSchema.safeParse({ question: "x".repeat(19) }).success).toBe(false);
    expect(questionSchema.safeParse({ question: "x".repeat(20) }).success).toBe(true);
    expect(questionSchema.safeParse({ question: "x".repeat(4001) }).success).toBe(false);
  });
});