import { afterEach, describe, expect, it, vi } from "vitest";
import { copyAdvertorialPrompt } from "@/lib/copy-advertorial-prompt";

afterEach(() => { vi.restoreAllMocks(); document.body.replaceChildren(); window.getSelection()?.removeAllRanges(); });
function prompt() {
  const pre = document.createElement("pre");
  pre.textContent = 'Primeira linha.\n\nRegra: use "somente" o texto.\n[cole aqui]';
  document.body.appendChild(pre);
  return pre;
}
describe("Advertorial prompt copy", () => {
  it("preserves newlines and characters through the clipboard API", async () => {
    const pre = prompt();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
    expect(await copyAdvertorialPrompt(pre)).toBe(true);
    expect(writeText).toHaveBeenCalledWith(pre.textContent);
  });
  it("uses a temporary textarea when clipboard access fails", async () => {
    const pre = prompt();
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: vi.fn().mockRejectedValue(new Error("Denied")) } });
    Object.defineProperty(document, "execCommand", { configurable: true, value: vi.fn(() => {
      expect(document.querySelector("textarea")?.value).toBe(pre.textContent);
      return true;
    }) });
    expect(await copyAdvertorialPrompt(pre)).toBe(true);
    expect(document.execCommand).toHaveBeenCalledWith("copy");
    expect(document.querySelector("textarea")).toBeNull();
  });
  it("selects the full prompt if both copy methods fail", async () => {
    const pre = prompt();
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: undefined });
    Object.defineProperty(document, "execCommand", { configurable: true, value: vi.fn(() => false) });
    expect(await copyAdvertorialPrompt(pre)).toBe(false);
    expect(window.getSelection()?.toString()).toBe(pre.textContent);
  });
});
