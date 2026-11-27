import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, FONT, MONO } from "../theme";
import { Check, CmdTag, Mono, PhaseLabel, Title, useSpring } from "../components/ui";

const PROMPT =
  "Organize o conteúdo programático em uma lista por matéria, mantendo cada item exatamente como está escrito.";
// resposta ilustrativa: matérias de um edital de Polícia Penal
const RESPOSTA = [
  "Língua Portuguesa",
  "Raciocínio Lógico",
  "Direito Constitucional",
  "Direito Penal",
  "Direito Processual Penal",
  "Direitos Humanos",
  "Lei de Execução Penal (Lei nº 7.210/1984)",
];

export const Cena04Extracao: React.FC<{ frames: number }> = ({ frames }) => {
  const f = useCurrentFrame();
  const win = useSpring(2);
  const typed = Math.round(interpolate(f, [6, 34], [0, PROMPT.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const respStart = 38;
  const done = f >= respStart + RESPOSTA.length * 4 + 2;
  const cursor = Math.floor(f / 8) % 2 === 0;
  return (
    <AbsoluteFill>
      <PhaseLabel n="01" name="EXTRAÇÃO" />
      <CmdTag label="CMD-01" />
      <Title size={96} parts={[{ t: "EXTRAIA O", br: true }, { t: "CONTEÚDO", hit: true }]} style={{ position: "absolute", left: 80, top: 262 }} delay={1} />

      {/* janela genérica de IA */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 470,
          width: 860,
          height: 790,
          background: "#101014",
          border: `2px solid ${C.border}`,
          borderRadius: 14,
          overflow: "hidden",
          opacity: win,
          transform: `translateY(${(1 - win) * 50}px)`,
          boxShadow: "0 30px 80px rgba(0,0,0,.5)",
        }}
      >
        <div style={{ height: 58, background: C.box, borderBottom: `2px solid ${C.border}`, display: "flex", alignItems: "center", padding: "0 22px", gap: 10 }}>
          {[C.red, "#3a3a44", "#3a3a44"].map((c, i) => (
            <div key={i} style={{ width: 16, height: 16, borderRadius: 8, background: c }} />
          ))}
          <Mono size={22} color={C.gray} style={{ marginLeft: 14 }}>
            Assistente de IA
          </Mono>
        </div>
        {/* comando digitado */}
        <div style={{ margin: "24px 24px 0", borderLeft: `8px solid ${C.red}`, background: C.box, padding: "18px 22px", borderRadius: 4 }}>
          <div style={{ fontFamily: MONO, fontSize: 19, color: C.red, marginBottom: 8, fontWeight: 700 }}>VOCÊ ›</div>
          <div style={{ fontFamily: MONO, fontSize: 27, lineHeight: 1.4, color: C.white, minHeight: 114 }}>
            {PROMPT.slice(0, typed)}
            {typed < PROMPT.length || f < respStart ? <span style={{ opacity: cursor ? 1 : 0, color: C.red }}>▌</span> : null}
          </div>
        </div>
        {/* resposta */}
        <div style={{ margin: "20px 24px 0", padding: "0 6px" }}>
          <div style={{ fontFamily: MONO, fontSize: 19, color: C.gray, fontWeight: 700, opacity: f >= respStart ? 1 : 0 }}>ASSISTENTE ›</div>
          {RESPOSTA.map((it, i) => {
            const on = f >= respStart + i * 4;
            const last = i === RESPOSTA.length - 1;
            return (
              <div
                key={it}
                style={{
                  display: "flex",
                  gap: 16,
                  alignItems: "center",
                  height: 44,
                  fontFamily: FONT,
                  fontWeight: 800,
                  fontSize: last ? 27 : 28,
                  color: last ? C.white : "#d6d6dc",
                  opacity: on ? 1 : 0,
                  transform: `translateX(${on ? 0 : -16}px)`,
                }}
              >
                <span style={{ fontFamily: MONO, fontSize: 22, color: C.red, width: 34 }}>{i + 1}.</span>
                <span style={last ? { background: "rgba(227,25,43,.18)", padding: "2px 8px", borderRadius: 4 } : undefined}>{it}</span>
              </div>
            );
          })}
        </div>
        <div
          style={{
            position: "absolute",
            left: 24,
            right: 24,
            bottom: 22,
            height: 62,
            borderRadius: 6,
            background: done ? "rgba(227,25,43,.14)" : "transparent",
            border: `2px solid ${done ? C.red : "transparent"}`,
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "0 20px",
            opacity: done ? 1 : 0,
          }}
        >
          <Mono size={26} color={C.white}>
            Itens listados: 7/7
          </Mono>
          <Check size={30} color={C.red} />
          <Mono size={18} color={C.gray} style={{ marginLeft: "auto" }}>
            exemplo ilustrativo
          </Mono>
        </div>
      </div>
      {frames ? null : null}
    </AbsoluteFill>
  );
};
