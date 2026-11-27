import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { C, FONT, MONO } from "../theme";
import { useSpring } from "../components/ui";

// linhas borradas do "PDF" do edital
const LINES = [0.92, 0.78, 0.88, 0.6, 0.95, 0.84, 0, 0.9, 0.72, 0.86, 0.66, 0.93, 0.8];
const HL = 6; // índice da linha destacada

export const Cena01Gancho: React.FC = () => {
  const f = useCurrentFrame();
  const doc = useSpring(0);
  const mark = interpolate(f, [6, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const words = ["ESSA", "LINHA", "DO", "EDITAL", "ESCONDE"];
  const count = Math.round(
    interpolate(f, [40, 64], [0, 204], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (x) => 1 - Math.pow(1 - x, 3) }),
  );
  const cnt = useSpring(38);
  const zoom = interpolate(f, [0, 90], [1.0, 1.05]);
  return (
    <AbsoluteFill>
      {/* trecho do edital (PDF) */}
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 196,
          width: 850,
          height: 600,
          background: "#D9D9DE",
          borderRadius: 6,
          boxShadow: "0 30px 80px rgba(0,0,0,.55)",
          padding: "36px 44px",
          transform: `translateY(${(1 - doc) * 40}px) scale(${zoom})`,
          opacity: doc,
          overflow: "hidden",
        }}
      >
        <div style={{ fontFamily: MONO, fontSize: 18, color: "#6b6b75", marginBottom: 18, letterSpacing: 1 }}>
          ANEXO II · CONTEÚDO PROGRAMÁTICO · LEGISLAÇÃO ESPECIAL
        </div>
        {LINES.map((w, i) =>
          i === HL ? (
            <div key={i} style={{ position: "relative", height: 52, margin: "4px 0 14px" }}>
              <div
                style={{
                  position: "absolute",
                  left: -10,
                  top: 2,
                  height: 48,
                  width: `${mark * 103}%`,
                  background: "rgba(227,25,43,0.88)",
                  transform: "skewX(-8deg)",
                }}
              />
              <div
                style={{
                  position: "relative",
                  fontFamily: FONT,
                  fontWeight: 800,
                  fontSize: 33,
                  lineHeight: "52px",
                  color: mark > 0.5 ? "#fff" : "#1a1a1f",
                  letterSpacing: -0.5,
                  whiteSpace: "nowrap",
                }}
              >
                Lei de Execução Penal (Lei nº 7.210/1984)
              </div>
            </div>
          ) : (
            <div
              key={i}
              style={{
                height: 16,
                width: `${w * 100}%`,
                background: "#8d8d97",
                borderRadius: 8,
                margin: "0 0 18px",
                filter: "blur(3.5px)",
                opacity: 0.55 + random(i) * 0.3,
              }}
            />
          ),
        )}
      </div>

      {/* texto principal */}
      <div style={{ position: "absolute", left: 90, top: 850, width: 860 }}>
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 92,
            lineHeight: 0.98,
            letterSpacing: -3.5,
            color: C.white,
          }}
        >
          {words.map((w, i) => {
            const show = f >= 4 + i * 6;
            return (
              <span key={w} style={{ display: "inline-block", marginRight: 22, opacity: show ? 1 : 0, transform: `translateY(${show ? 0 : 20}px)` }}>
                {w}
                {i === 2 ? <br /> : null}
              </span>
            );
          })}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 24,
            marginTop: 10,
            opacity: cnt,
            transform: `scale(${0.85 + cnt * 0.15})`,
            transformOrigin: "0 50%",
          }}
        >
          <span
            style={{
              fontFamily: FONT,
              fontWeight: 900,
              fontStyle: "italic",
              fontSize: 210,
              lineHeight: 1,
              letterSpacing: -10,
              color: C.red,
              fontVariantNumeric: "tabular-nums",
              minWidth: 400,
            }}
          >
            {count}
          </span>
          <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 92, letterSpacing: -3.5, color: C.white }}>ARTIGOS</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
