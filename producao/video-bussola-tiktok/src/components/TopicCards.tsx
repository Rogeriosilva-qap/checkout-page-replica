import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, MONO, TACTICAL } from "../theme";
import { NIVEL_STYLE, ORDEM_PRIORIZADA, TOPICOS } from "../data/topicos";

export const CARD_TOP = 470;
export const CARD_H = 100;
export const CARD_GAP = 10;
export const CARD_X = 80;
export const CARD_W = 860;

/**
 * Os 7 cartões de micro-tópicos (fatiamento e priorização usam o mesmo componente).
 * mode="split": nascem da linha "Lei de Execução Penal" (um a cada 4 frames).
 * mode="prio": recebem carimbos ALFA/BRAVO/CHARLIE e se reordenam.
 */
export const TopicCards: React.FC<{ mode: "split" | "prio"; stampAt?: number; reorderAt?: number }> = ({
  mode,
  stampAt = 8,
  reorderAt = 60,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const yOf = (i: number) => CARD_TOP + i * (CARD_H + CARD_GAP);
  const center = CARD_TOP + 3 * (CARD_H + CARD_GAP);
  const reo = mode === "prio" ? spring({ frame: f - reorderAt, fps, config: { damping: 200, stiffness: 140, mass: 0.8 } }) : 0;
  return (
    <>
      {TOPICOS.map((t, i) => {
        const born = mode === "split" ? spring({ frame: f - 10 - i * 4, fps, config: TACTICAL }) : 1;
        const finalIdx = ORDEM_PRIORIZADA.indexOf(t.id);
        const y = interpolate(born, [0, 1], [center, yOf(i)]) * (1 - reo) + yOf(finalIdx) * reo;
        const stampF = stampAt + i * 5;
        const st = mode === "prio" ? spring({ frame: f - stampF, fps, config: { damping: 18, stiffness: 420, mass: 0.5 } }) : 0;
        const jitter = mode === "prio" && f >= stampF && f < stampF + 5 ? Math.sin(f * 7 + i) * 4 : 0;
        const ns = NIVEL_STYLE[t.nivel];
        const glowAlfa = mode === "prio" && t.nivel === "ALFA" ? reo : 0;
        return (
          <div
            key={t.id}
            style={{
              position: "absolute",
              left: CARD_X + jitter,
              top: y,
              width: CARD_W,
              height: CARD_H,
              background: C.box,
              border: `2px solid ${glowAlfa > 0.5 ? C.red : C.border}`,
              borderLeft: `8px solid ${mode === "prio" && f >= stampF ? ns.bg : C.red}`,
              borderRadius: 6,
              opacity: born,
              transform: `scale(${0.92 + born * 0.08})`,
              display: "flex",
              alignItems: "center",
              padding: "0 22px 0 24px",
              zIndex: t.nivel === "ALFA" ? 3 : 1,
              boxShadow: glowAlfa > 0.5 ? "0 0 30px rgba(227,25,43,.35)" : "none",
            }}
          >
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 29, lineHeight: 1.12, color: C.white, width: 560, letterSpacing: -0.4 }}>
              {t.titulo}
            </div>
            <div style={{ marginLeft: "auto", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
              <div style={{ fontFamily: MONO, fontSize: 22, color: C.gray, whiteSpace: "nowrap" }}>{t.tempo}</div>
              {mode === "prio" ? (
                <div
                  style={{
                    fontFamily: MONO,
                    fontWeight: 700,
                    fontSize: 21,
                    letterSpacing: 2,
                    background: ns.bg,
                    color: ns.fg,
                    padding: "5px 12px 4px",
                    borderRadius: 3,
                    opacity: st > 0.05 ? 1 : 0,
                    transform: `scale(${interpolate(st, [0, 1], [1.9, 1])}) rotate(${(1 - st) * -8}deg)`,
                  }}
                >
                  {t.nivel}
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </>
  );
};
