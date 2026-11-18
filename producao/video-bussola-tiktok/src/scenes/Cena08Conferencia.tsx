import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, MONO } from "../theme";
import { Check, TermBox, Title, useSpring } from "../components/ui";
import { wordFrame } from "../captions";

const ITENS = ["Contagem bate com o edital", "Nada criado fora do edital", "Pesos do edital", "Retificações conferidas"];

export const Cena08Conferencia: React.FC<{ frames: number }> = ({ frames }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const first = Math.max(12, wordFrame("cena-08", "confere", 0.2, frames));
  const iaAt = wordFrame("cena-08", "ia", 0.5, frames);
  const ia = useSpring(iaAt);
  return (
    <AbsoluteFill>
      <Title size={96} parts={[{ t: "E ENTRE CADA", br: true }, { t: "FASE:", br: true }, { t: "CONFERIR.", hit: true }]} style={{ position: "absolute", left: 80, top: 210 }} delay={1} />
      {ITENS.map((it, i) => {
        const at = first + i * 9;
        const s = spring({ frame: f - 6 - i * 3, fps, config: { damping: 200, stiffness: 300 } });
        const ck = spring({ frame: f - at, fps, config: { damping: 14, stiffness: 400, mass: 0.5 } });
        const done = f >= at;
        return (
          <TermBox
            key={it}
            style={{
              position: "absolute",
              left: 80,
              top: 560 + i * 128,
              width: 860,
              height: 108,
              display: "flex",
              alignItems: "center",
              gap: 26,
              padding: "0 28px",
              opacity: s,
              transform: `translateX(${(1 - s) * 50}px)`,
              borderColor: done ? C.red : C.border,
              borderLeftColor: C.red,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                border: `4px solid ${done ? C.red : C.border}`,
                background: done ? C.red : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flex: "none",
              }}
            >
              {done ? (
                <div style={{ transform: `scale(${ck})` }}>
                  <Check size={38} />
                </div>
              ) : null}
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 38, color: done ? C.white : C.gray, letterSpacing: -0.6 }}>{it}</div>
          </TermBox>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 1086,
          width: 860,
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: 28,
          lineHeight: 1.45,
          color: C.gray,
          opacity: ia,
          transform: `translateY(${(1 - ia) * 14}px)`,
        }}
      >
        <span style={{ color: C.red }}>&gt;</span> A IA acelera.
        <br />
        <span style={{ color: C.red }}>&gt;</span> <span style={{ color: C.white }}>A conferência garante a direção.</span>
      </div>
    </AbsoluteFill>
  );
};
