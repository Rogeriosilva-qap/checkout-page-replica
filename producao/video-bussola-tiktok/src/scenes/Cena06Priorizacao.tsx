import React from "react";
import { AbsoluteFill } from "remotion";
import { CmdTag, Mono, PhaseLabel, Title, useSpring } from "../components/ui";
import { TopicCards } from "../components/TopicCards";
import { wordFrame } from "../captions";

export const Cena06Priorizacao: React.FC<{ frames: number }> = ({ frames }) => {
  const stampAt = Math.max(6, wordFrame("cena-06", "alfa", 0.3, frames) - 6);
  const reorderAt = Math.max(stampAt + 38, wordFrame("cena-06", "pelo", 0.55, frames));
  const aviso = useSpring(reorderAt + 6);
  return (
    <AbsoluteFill>
      <PhaseLabel n="03" name="PRIORIZAÇÃO" />
      <CmdTag label="CMD-03" />
      <Title size={92} parts={[{ t: "ATAQUE PRIMEIRO", br: true }, { t: "O ALFA", hit: true }]} style={{ position: "absolute", left: 80, top: 262 }} delay={1} />
      <TopicCards mode="prio" stampAt={stampAt} reorderAt={reorderAt} />
      <Mono size={20} style={{ position: "absolute", left: 80, top: 1244, width: 860, lineHeight: 1.35, opacity: aviso, fontWeight: 400 }}>
        Exemplo ilustrativo: a prioridade depende do peso no seu edital e da sua dificuldade.
      </Mono>
    </AbsoluteFill>
  );
};
