import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

const inter = loadInter("normal", { weights: ["800", "900"], subsets: ["latin"] });
loadInter("italic", { weights: ["900"], subsets: ["latin"] });
const mono = loadMono("normal", { weights: ["400", "700"], subsets: ["latin"] });

export const FONT = inter.fontFamily;
export const MONO = mono.fontFamily;

export const C = {
  bg: "#0E0E11",
  grid: "#1C1C22",
  red: "#E3192B",
  redDark: "#9E0F1C",
  white: "#FFFFFF",
  gray: "#A7A7AD",
  box: "#16161B",
  border: "#2A2A32",
  glow: "rgba(227,25,43,0.15)",
};

/** zonas seguras do TikTok */
export const SAFE = { top: 160, bottom: 420, right: 140, left: 60 };
export const SAFE_W = 1080 - SAFE.left - SAFE.right; // 880 de largura útil
export const SAFE_BOTTOM_Y = 1920 - SAFE.bottom; // 1500

/** spring "tático": rápido e sem quicar */
export const TACTICAL = { damping: 200, stiffness: 260, mass: 0.6 };
