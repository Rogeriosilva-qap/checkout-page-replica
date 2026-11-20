import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, MONO } from "../theme";
import { Mono, Title, useSpring } from "../components/ui";
import { Selo } from "../components/assets";

const FASES = ["EXTRAÇÃO", "FATIAMENTO", "PRIORIZAÇÃO", "CALENDÁRIO"];

export const Cena03Metodo: React.FC = () => {
  const f = useCurrentFrame();
  const selo = useSpring(0);
  const line = interpolate(f, [16, 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, width: 1080, top: 190, display: "flex", justifyContent: "center" }}>
        <div style={{ transform: `scale(${0.7 + selo * 0.3})`, opacity: selo }}>
          <Selo size={230} />
        </div>
      </div>
      <Mono size={32} color={C.red} style={{ position: "absolute", top: 450, left: 0, width: 1080, textAlign: "center", opacity: useSpring(4) }}>
        // OPERAÇÃO 01
      </Mono>
      <Title
        size={150}
        delay={5}
        parts={[{ t: "MÉTODO", br: true }, { t: "BÚSSOLA", hit: true }]}
        style={{ position: "absolute", top: 510, left: 0, width: 1080, textAlign: "center" }}
      />
      {/* linha do tempo com 4 marcadores */}
      <div style={{ position: "absolute", left: 110, top: 900, width: 860, height: 240 }}>
        <div style={{ position: "absolute", left: 54, top: 27, height: 4, width: `${line * 752}px`, background: C.red }} />
        {FASES.map((nome, i) => {
          const on = f >= 18 + i * 5;
          return (
            <div
              key={nome}
              style={{
                position: "absolute",
                left: i * 250,
                top: 0,
                width: 210,
                display: "flex",
                flexDirection: "column",
                alignItems: i === 0 ? "flex-start" : "center",
                opacity: on ? 1 : 0,
                transform: `translateY(${on ? 0 : 14}px)`,
              }}
            >
              <div style={{ width: 58, height: 58, border: `4px solid ${C.red}`, background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontWeight: 700, fontSize: 24, color: C.white, marginLeft: i === 0 ? 26 : 0 }}>
                0{i + 1}
              </div>
              <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 25, color: C.white, marginTop: 18, letterSpacing: 0.5 }}>{nome}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
