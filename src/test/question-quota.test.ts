import { describe, expect, it, vi } from "vitest";
import { runLimitedExplanation } from "@/lib/question-quota";

describe("One free explanation", () => {
  it("runs AI at most once for the same email, including parallel submissions", async () => {
    let claimed = false;
    const claim = async () => { if (claimed) return false; claimed = true; return true; };
    const generate = vi.fn(async () => "Certo, artigo 25.");
    const results = await Promise.all([runLimitedExplanation(claim, generate), runLimitedExplanation(claim, generate)]);
    expect(generate).toHaveBeenCalledTimes(1);
    expect(results.filter(result => result.ok)).toHaveLength(1);
    expect(results.filter(result => !result.ok && result.limited)).toHaveLength(1);
  });
  it("does not spend a second AI call after a failed generation", async () => {
    let claimed = false;
    const claim = async () => { if (claimed) return false; claimed = true; return true; };
    const generate = vi.fn(async (): Promise<string> => { throw new Error("gateway unavailable"); });
    expect(await runLimitedExplanation(claim, generate)).toMatchObject({ ok: false, limited: true });
    expect(await runLimitedExplanation(claim, generate)).toMatchObject({ ok: false, limited: true });
    expect(generate).toHaveBeenCalledTimes(1);
  });
});