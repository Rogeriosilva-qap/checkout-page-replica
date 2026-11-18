import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, FONT } from "../theme";
import { CmdTag, PhaseLabel, Title } from "../components/ui";
import { CARD_GAP, CARD_H, CARD_TOP, TopicCards } from "../components/TopicCards";

export const Cena05Fatiamento: React.FC = () => {
  const f = useCurrentFrame();
  // a linha do edital aparece no centro e "racha" quando os cartões nascem
  const lineIn = interpolate(f, [0, 5], [0, 1], { extrapolateRight: "clamp" });
  const crack = interpolate(f, [8, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cy = CARD_TOP + 3 * (CARD_H + CARD_GAP);
  return (
    <AbsoluteFill>
      <PhaseLabel n="02" name="FATIAMENTO" />
      <CmdTag label="CMD-02" />
      <Title size={92} parts={[{ t: "FATIE EM", br: true }, { t: "MICRO-TÓPICOS", hit: true }]} style={{ position: "absolute", left: 80, top: 262 }} delay={1} />
      {[0, 1].map((half) => (
        <div
          key={half}
          style={{
            position: "absolute",
            left: 80,
            top: cy - 6,
            width: 860,
            height: CARD_H + 12,
            background: C.red,
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 40,
            letterSpacing: -1,
            color: C.white,
            opacity: lineIn * (1 - crack),
            clipPath: half === 0 ? "inset(0 50% 0 0)" : "inset(0 0 0 50%)",
            transform: `translateX(${(half === 0 ? -1 : 1) * crack * 60}px) rotate(${(half === 0 ? -1 : 1) * crack * 3}deg)`,
            zIndex: 5,
          }}
        >
          Lei de Execução Penal (Lei nº 7.210/1984)
        </div>
      ))}
      <TopicCards mode="split" />
    </AbsoluteFill>
  );
};
