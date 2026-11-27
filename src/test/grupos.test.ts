import { describe, expect, it } from "vitest";
import { getGrupos, linkDeGrupo } from "@/lib/grupos";

const vazio = { missaoGoiasUrl: "", grupoPcmgUrl: "", grupoPmspUrl: "", grupoPctoUrl: "", grupoGcmGoianiaUrl: "" };
const todos = {
  missaoGoiasUrl: "https://chat.whatsapp.com/AAA111",
  grupoPcmgUrl: "https://chat.whatsapp.com/BBB222",
  grupoPmspUrl: "https://chat.whatsapp.com/CCC333",
  grupoPctoUrl: "https://chat.whatsapp.com/DDD444",
  grupoGcmGoianiaUrl: "https://chat.whatsapp.com/EEE555",
};

describe("getGrupos", () => {
  it("lists every configured group in the default order", () => {
    expect(getGrupos(undefined, todos).map((g) => g.id)).toEqual(["pmgo", "pmsp", "pcmg", "pcto", "gcm-goiania"]);
  });

  it("hides groups without an invite link", () => {
    expect(getGrupos(undefined, { ...vazio, missaoGoiasUrl: todos.missaoGoiasUrl }).map((g) => g.id)).toEqual(["pmgo"]);
    expect(getGrupos(undefined, vazio)).toEqual([]);
  });

  it("moves the group named in ?g= to the top, ignoring unknown or hidden ones", () => {
    expect(getGrupos("pcto", todos).map((g) => g.id)).toEqual(["pcto", "pmgo", "pmsp", "pcmg", "gcm-goiania"]);
    expect(getGrupos("xyz", todos)[0].id).toBe("pmgo");
    expect(getGrupos("pcto", { ...todos, grupoPctoUrl: "" })[0].id).toBe("pmgo");
  });

  it("accepts only WhatsApp group invites", () => {
    expect(linkDeGrupo(" https://chat.whatsapp.com/AbC123 ")).toBe("https://chat.whatsapp.com/AbC123");
    expect(linkDeGrupo("https://wa.me/5562999999999")).toBe("");
    expect(linkDeGrupo("javascript:alert(1)")).toBe("");
    expect(linkDeGrupo("https://chat.whatsapp.com.evil.com/x")).toBe("");
    expect(linkDeGrupo("https://chat.whatsapp.com/AbC123?mode=ems_copy_t")).toBe("https://chat.whatsapp.com/AbC123?mode=ems_copy_t");
  });
});

describe("configured groups", () => {
  it("shows all five study groups with clean WhatsApp invites", async () => {
    const { CONFIG } = await import("@/config");
    const ids = getGrupos(undefined, CONFIG).map((g) => g.id);
    expect(ids).toEqual(["pmgo", "pmsp", "pcmg", "pcto", "gcm-goiania"]);
    for (const g of getGrupos(undefined, CONFIG)) expect(g.href).toMatch(/^https:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]+$/);
  });
});
