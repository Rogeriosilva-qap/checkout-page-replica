import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, MONO, SAFE, TACTICAL } from "../theme";

/** fundo grafite + grade 72 px + brilho radial vermelho */
export const Background: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundColor: C.bg,
      backgroundImage: [
        `radial-gradient(ellipse 70% 45% at 50% 50%, ${C.glow}, rgba(227,25,43,0) 70%)`,
        `linear-gradient(${C.grid} 2px, transparent 2px)`,
        `linear-gradient(90deg, ${C.grid} 2px, transparent 2px)`,
      ].join(","),
      backgroundSize: "100% 100%, 72px 72px, 72px 72px",
      backgroundPosition: "0 0, -1px -1px, -1px -1px",
    }}
  />
);

/** faixa vermelha no topo + cantoneiras vermelhas */
export const HudFrame: React.FC = () => {
  const L = 70;
  const T = 8;
  const m = 28;
  const corner = (pos: React.CSSProperties, rot: number) => (
    <div style={{ position: "absolute", width: L, height: L, ...pos, transform: `rotate(${rot}deg)` }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: L, height: T, background: C.red }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: T, height: L, background: C.red }} />
    </div>
  );
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 6, background: C.red }} />
      {corner({ left: m, top: m + 6 }, 0)}
      {corner({ right: m, top: m + 6 }, 90)}
      {corner({ right: m, bottom: m }, 180)}
      {corner({ left: m, bottom: m }, 270)}
    </AbsoluteFill>
  );
};

/** rótulo técnico em mono */
export const Mono: React.FC<{ children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties }> = ({
  children,
  size = 30,
  color = C.gray,
  style,
}) => (
  <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: size, color, letterSpacing: 1, ...style }}>{children}</div>
);

/** etiqueta de comando (CMD-01 etc.) com borda vermelha */
export const CmdTag: React.FC<{ label: string; delay?: number }> = ({ label, delay = 4 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - delay, fps, config: TACTICAL });
  return (
    <div
      style={{
        position: "absolute",
        right: SAFE.right,
        top: 196,
        fontFamily: MONO,
        fontWeight: 700,
        fontSize: 28,
        color: C.red,
        border: `3px solid ${C.red}`,
        padding: "6px 14px 5px",
        borderRadius: 4,
        background: "rgba(227,25,43,0.08)",
        opacity: s,
        transform: `translateX(${(1 - s) * 40}px)`,
      }}
    >
      {label}
    </div>
  );
};

/** rótulo superior "FASE 0X · NOME" */
export const PhaseLabel: React.FC<{ n: string; name: string }> = ({ n, name }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - 1, fps, config: TACTICAL });
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left + 20,
        top: 200,
        display: "flex",
        alignItems: "center",
        gap: 14,
        opacity: s,
        transform: `translateX(${(1 - s) * -40}px)`,
      }}
    >
      <div style={{ width: 14, height: 14, background: C.red }} />
      <Mono size={30} color={C.white}>
        FASE {n} <span style={{ color: C.red }}>·</span> {name}
      </Mono>
    </div>
  );
};

/** título forte: palavras normais em branco e a palavra de impacto em vermelho itálico */
export const Title: React.FC<{
  parts: { t: string; hit?: boolean; br?: boolean }[];
  size: number;
  style?: React.CSSProperties;
  delay?: number;
}> = ({ parts, size, style, delay = 0 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 0.95,
        letterSpacing: -size * 0.04,
        textTransform: "uppercase",
        color: C.white,
        ...style,
      }}
    >
      {parts.map((p, i) => {
        const s = spring({ frame: f - delay - i * 3, fps, config: TACTICAL });
        return (
          <React.Fragment key={i}>
            <span
              style={{
                display: "inline-block",
                opacity: s,
                transform: `translateY(${(1 - s) * 30}px)`,
                color: p.hit ? C.red : undefined,
                fontStyle: p.hit ? "italic" : undefined,
                paddingRight: p.hit ? size * 0.06 : 0,
              }}
            >
              {p.t}
            </span>
            {p.br ? <br /> : " "}
          </React.Fragment>
        );
      })}
    </div>
  );
};

/** caixa estilo terminal com borda esquerda vermelha de 8 px */
export const TermBox: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div
    style={{
      background: C.box,
      border: `2px solid ${C.border}`,
      borderLeft: `8px solid ${C.red}`,
      borderRadius: 6,
      ...style,
    }}
  >
    {children}
  </div>
);

export const useSpring = (delay = 0, config = TACTICAL) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - delay, fps, config });
};

export const fade = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/** ícone de check */
export const Check: React.FC<{ size?: number; color?: string }> = ({ size = 34, color = C.white }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M4 12.5l5 5L20 6.5" fill="none" stroke={color} strokeWidth={3.4} strokeLinecap="square" />
  </svg>
);
