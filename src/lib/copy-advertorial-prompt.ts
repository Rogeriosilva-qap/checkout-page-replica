/** Copy the rendered pre verbatim; retain a selectable range if both APIs fail. */
export async function copyAdvertorialPrompt(element: HTMLPreElement): Promise<boolean> {
  const text = element.textContent ?? "";
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.className = "advertorial-copy-buffer";
    document.body.appendChild(textarea);
    textarea.select();
    let copied = false;
    try {
      copied = document.execCommand("copy");
    } catch {
      copied = false;
    } finally {
      textarea.remove();
    }
    if (!copied) {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(element);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
    return copied;
  }
}
