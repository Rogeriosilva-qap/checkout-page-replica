import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, FONT, MONO } from "../theme";
import { Mono, useSpring } from "../components/ui";

const ITENS = [
  "Língua Portuguesa",
  "Direito Penal",
  "Processo Penal",
  "Direitos Humanos",
  "Legislação Especial",
  "Direito Constitucional",
  "Direito Administrativo",
  "Raciocínio Lógico",
  "Lei de Execução Penal",
  "Informática",
  "Estatuto do Desarmamento",
  "Lei de Drogas",
];
const ROW = 78;

export const Cena02Dor: React.FC<{ frames: number }> = ({ frames }) => {
  const f = useCurrentFrame();
  const scroll = (f * 34) % (ITENS.length * ROW); // rola muito rápido, em loop
  const t = useSpring(2);
  const startShake = frames - 26;
  const hit = f >= startShake;
  const shake = hit ? Math.sin(f * 2.6) * 9 * interpolate(f - startShake, [0, 18], [1, 0.3], { extrapolateRight: "clamp" }) : 0;
  const list = [...ITENS, ...ITENS, ...ITENS];
  return (
    <AbsoluteFill>
      {/* lista do edital rolando */}
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 196,
          width: 850,
          height: 720,
          overflow: "hidden",
          maskImage: "linear-gradient(transparent, #000 18%, #000 82%, transparent)",
          WebkitMaskImage: "linear-gradient(transparent, #000 18%, #000 82%, transparent)",
        }}
      >
        <div style={{ transform: `translateY(${-scroll}px)`, filter: "blur(1.2px)" }}>
          {list.map((it, i) => (
            <div
              key={i}
              style={{
                height: ROW - 10,
                marginBottom: 10,
                background: C.box,
                border: `2px solid ${C.border}`,
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                padding: "0 26px",
                gap: 20,
                fontFamily: FONT,
                fontWeight: 800,
                fontSize: 32,
                color: "#d8d8de",
              }}
            >
              <span style={{ fontFamily: MONO, fontSize: 24, color: C.red }}>{String((i % ITENS.length) + 1).padStart(2, "0")}</span>
              {it}
              <span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: 20, color: C.gray }}>
                {(i * 7) % 23 + 4} itens
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* frase */}
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 960,
          width: 860,
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 76,
          lineHeight: 1.02,
          letterSpacing: -2.5,
          color: C.gray,
          opacity: t,
          transform: `translateY(${(1 - t) * 30}px)`,
        }}
      >
        E VOCÊ NÃO SABE POR ONDE{" "}
        <span
          style={{
            display: "inline-block",
            color: hit ? C.red : C.gray,
            fontStyle: hit ? "italic" : "normal",
            transform: `translateX(${shake}px) rotate(${shake * 0.15}deg)`,
          }}
        >
          COMEÇAR.
        </span>
      </div>
      <Mono size={24} style={{ position: "absolute", left: 90, top: 1215, letterSpacing: 2 }}>
        PM · PC · PF · PRF · POLÍCIA PENAL · GCM
      </Mono>
    </AbsoluteFill>
  );
};
