/**
 * TEMPOS DO VÍDEO — ajuste aqui.
 *
 * Cada cena tem uma duração em frames (30 fps). O vídeo dura a soma das cenas.
 * A fala de cada cena começa VOICE_DELAY frames depois do corte e as legendas
 * seguem o tempo de cada palavra da narração (src/data/narracao.json).
 *
 * Os valores abaixo foram ajustados à narração gerada no ElevenLabs
 * (fala da cena + ~0,23 s de respiro). Se você trocar a narração, rode
 * `npm run render` — ele avisa se alguma fala ficar maior que a sua cena.
 */
export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

/** atraso da voz em relação ao corte de cena (deixa o glitch acontecer antes) */
export const VOICE_DELAY = 3;
/** duração do glitch de transição */
export const GLITCH_FRAMES = 3;

export type SceneId =
  | "gancho"
  | "dor"
  | "metodo"
  | "extracao"
  | "fatiamento"
  | "priorizacao"
  | "calendario"
  | "conferencia"
  | "cta";

export const SCENES: { id: SceneId; frames: number; voz: string }[] = [
  { id: "gancho", frames: 91, voz: "cena-01" }, //  0,00 –  3,03 s
  { id: "dor", frames: 66, voz: "cena-02" }, //  3,03 –  5,23 s
  { id: "metodo", frames: 62, voz: "cena-03" }, //  5,23 –  7,30 s
  { id: "extracao", frames: 89, voz: "cena-04" }, //  7,30 – 10,27 s
  { id: "fatiamento", frames: 114, voz: "cena-05" }, // 10,27 – 14,07 s
  { id: "priorizacao", frames: 151, voz: "cena-06" }, // 14,07 – 19,10 s
  { id: "calendario", frames: 97, voz: "cena-07" }, // 19,10 – 22,33 s
  { id: "conferencia", frames: 151, voz: "cena-08" }, // 22,33 – 27,37 s
  { id: "cta", frames: 169, voz: "cena-09" }, // 27,37 – 33,00 s
];

export const TOTAL_FRAMES = SCENES.reduce((a, s) => a + s.frames, 0); // 990

export const sceneStart = (id: SceneId): number => {
  let f = 0;
  for (const s of SCENES) {
    if (s.id === id) return f;
    f += s.frames;
  }
  throw new Error(`cena desconhecida: ${id}`);
};

export const sceneFrames = (id: SceneId): number => SCENES.find((s) => s.id === id)!.frames;

/** arquivo de voz da cena, considerando a variação do CTA */
export const vozDaCena = (voz: string, cta: "bio" | "stories") =>
  voz === "cena-09" && cta === "stories" ? "cena-09-stories" : voz;
