import React, { useMemo } from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { buildCaptions, Cta } from "../captions";
import { C, FONT, SAFE } from "../theme";

/** legenda queimada estilo TikTok, centrada em y≈1350, dentro da zona segura */
export const Captions: React.FC<{ cta: Cta }> = ({ cta }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const caps = useMemo(() => buildCaptions(cta), [cta]);
  const t = f / fps;
  const cur = caps.find((c) => t >= c.from - 0.02 && t < c.to);
  if (!cur) return null;
  const s = spring({ frame: f - Math.round(cur.from * fps), fps, config: { damping: 200, stiffness: 500, mass: 0.4 } });
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        width: 1080 - SAFE.left - SAFE.right,
        top: 1350,
        transform: `translateY(-50%) scale(${0.88 + s * 0.12})`,
        display: "flex",
        justifyContent: "center",
        zIndex: 50,
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 64,
          lineHeight: 1.05,
          letterSpacing: -1.5,
          textAlign: "center",
          textTransform: "uppercase",
          color: C.white,
          WebkitTextStroke: "12px #000",
          paintOrder: "stroke fill",
          maxWidth: 880,
        }}
      >
        {cur.words.map((w, i) => (
          <span key={i} style={{ color: w.key ? C.red : C.white }}>
            {w.text.replace(/[,.:]$/, "")}
            {i < cur.words.length - 1 ? " " : ""}
          </span>
        ))}
      </div>
    </div>
  );
};
