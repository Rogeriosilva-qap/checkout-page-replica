import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, MONO } from "../theme";
import { CmdTag, PhaseLabel, Title } from "../components/ui";
import { NIVEL_STYLE, Nivel, TOPICOS } from "../data/topicos";

const DIAS = ["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"];
const PLANTAO = [1, 4]; // TER e SEX bloqueados pela escala
const TOP = 470;
const ROW = 98;
const GAP = 10;
const X0 = 210; // início da área de blocos
const W = 940 - X0; // 730

// ALFA primeiro, depois BRAVO, nos dias livres
const AGENDA: { id: string; dia: number; slot: 0 | 1; at: number }[] = [
  { id: "regimes", dia: 0, slot: 0, at: 10 },
  { id: "trabalho", dia: 2, slot: 0, at: 16 },
  { id: "orgaos", dia: 3, slot: 0, at: 28 },
  { id: "livramento", dia: 5, slot: 0, at: 34 },
  { id: "classif", dia: 5, slot: 1, at: 40 },
];

export const Cena07Calendario: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rowY = (i: number) => TOP + i * (ROW + GAP);
  return (
    <AbsoluteFill>
      <PhaseLabel n="04" name="CALENDÁRIO" />
      <CmdTag label="CMD-05" />
      <Title size={92} parts={[{ t: "TUDO VIRA", br: true }, { t: "SEMANA", hit: true }, { t: "DE ESTUDO" }]} style={{ position: "absolute", left: 80, top: 262 }} delay={1} />
      {DIAS.map((d, i) => {
        const s = spring({ frame: f - 2 - i * 2, fps, config: { damping: 200, stiffness: 300 } });
        const plantao = PLANTAO.includes(i);
        return (
          <div
            key={d}
            style={{
              position: "absolute",
              left: 80,
              top: rowY(i),
              width: 860,
              height: ROW,
              background: C.box,
              border: `2px solid ${C.border}`,
              borderRadius: 6,
              opacity: s,
              transform: `translateX(${(1 - s) * -40}px)`,
            }}
          >
            <div style={{ position: "absolute", left: 22, top: 0, height: ROW - 4, display: "flex", alignItems: "center", fontFamily: MONO, fontWeight: 700, fontSize: 30, color: C.white }}>
              {d}
            </div>
            {plantao ? (
              <div
                style={{
                  position: "absolute",
                  left: X0 - 80,
                  top: 12,
                  width: W - 22,
                  height: ROW - 28,
                  borderRadius: 4,
                  background: "repeating-linear-gradient(135deg, #2A2A32 0 14px, #24242b 14px 28px)",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: 22,
                  fontFamily: MONO,
                  fontWeight: 700,
                  fontSize: 26,
                  letterSpacing: 3,
                  color: C.gray,
                }}
              >
                PLANTÃO
              </div>
            ) : null}
            {i === 6 ? (
              <div
                style={{
                  position: "absolute",
                  left: X0 - 80,
                  top: 12,
                  width: W - 22,
                  height: ROW - 28,
                  borderRadius: 4,
                  border: `3px dashed ${C.gray}`,
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: 22,
                  fontFamily: MONO,
                  fontWeight: 700,
                  fontSize: 26,
                  letterSpacing: 3,
                  color: C.gray,
                  opacity: interpolate(f, [48, 54], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                }}
              >
                MARGEM
              </div>
            ) : null}
          </div>
        );
      })}
      {AGENDA.map((a) => {
        const t = TOPICOS.find((x) => x.id === a.id)!;
        const s = spring({ frame: f - a.at, fps, config: { damping: 200, stiffness: 220, mass: 0.7 } });
        const ns = NIVEL_STYLE[t.nivel as Nivel];
        const half = (W - 22 - 12) / 2;
        const doubled = AGENDA.filter((x) => x.dia === a.dia).length > 1;
        const w = doubled ? half : W - 22;
        const x = X0 + a.slot * (half + 12);
        const y = rowY(a.dia) + 12;
        return (
          <div
            key={a.id}
            style={{
              position: "absolute",
              left: interpolate(s, [0, 1], [80, x]),
              top: interpolate(s, [0, 1], [1260, y]),
              width: w,
              height: ROW - 28,
              background: ns.bg,
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "0 16px",
              opacity: s > 0.02 ? 1 : 0,
              transform: `scale(${0.85 + s * 0.15})`,
              boxShadow: "0 10px 30px rgba(0,0,0,.45)",
              zIndex: 5,
            }}
          >
            <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 17, letterSpacing: 1.5, color: "rgba(255,255,255,.8)" }}>{t.nivel}</span>
            <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: doubled ? 22 : 27, color: C.white, lineHeight: 1.05, letterSpacing: -0.3 }}>
              {t.curto}
            </span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
