import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, MONO } from "../theme";
import { Mono, Title } from "../components/ui";
import { CapaGuia } from "../components/assets";
import { wordFrame } from "../captions";

const LINHAS = ["22 comandos prontos", "Método Bússola", "Caderno de erros automatizado"];

export const Cena09Cta: React.FC<{ cta: "bio" | "stories"; frames: number }> = ({ cta, frames }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const voz = cta === "stories" ? "cena-09-stories" : "cena-09";
  const capa = spring({ frame: f - 2, fps, config: { damping: 200, stiffness: 120, mass: 0.9 } });
  const rot = interpolate(capa, [0, 1], [-8, -3]);
  const lineAt = [wordFrame(voz, "22", 0.05, frames), wordFrame(voz, "metodo", 0.3, frames), wordFrame(voz, "caderno", 0.5, frames)];
  const btnAt = Math.min(frames - 40, wordFrame(voz, "link", 0.75, frames) - 4);
  const btn = spring({ frame: f - btnAt, fps, config: { damping: 200, stiffness: 300 } });
  const pulse = f > btnAt + 8 ? 1 + Math.sin(((f - btnAt) / fps) * Math.PI * 2 * 1.6) * 0.035 : 1;
  const label = cta === "stories" ? "LINK NOS STORIES" : "LINK NA BIO";
  const foot = interpolate(f, [10, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Title
        size={62}
        parts={[{ t: "O GUIA DEFINITIVO DO" }, { t: "CONCURSEIRO POLICIAL", br: true }, { t: "CIBERNÉTICO", hit: true }]}
        style={{ position: "absolute", left: 80, top: 196, width: 860, lineHeight: 1.02 }}
      />
      {/* capa do guia */}
      <div
        style={{
          position: "absolute",
          left: 92,
          top: 470,
          transform: `rotate(${rot}deg) translateY(${(1 - capa) * 80}px) scale(${0.9 + capa * 0.1})`,
          opacity: capa,
          boxShadow: "0 40px 90px rgba(0,0,0,.7), 0 0 70px rgba(227,25,43,.35)",
          outline: `2px solid rgba(227,25,43,.5)`,
        }}
      >
        <CapaGuia width={400} />
      </div>
      {/* três linhas em mono */}
      <div style={{ position: "absolute", left: 540, top: 520, width: 400 }}>
        {LINHAS.map((l, i) => {
          const s = spring({ frame: f - lineAt[i], fps, config: { damping: 200, stiffness: 320 } });
          return (
            <div key={l} style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 34, opacity: s, transform: `translateX(${(1 - s) * 40}px)` }}>
              <div style={{ width: 14, height: 14, background: C.red, marginTop: 13, flex: "none" }} />
              <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 31, lineHeight: 1.25, color: C.white }}>{l}</div>
            </div>
          );
        })}
      </div>
      {/* botão */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 1110,
          width: 860,
          height: 120,
          background: C.red,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 22,
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 58,
          letterSpacing: -1.5,
          color: C.white,
          opacity: btn,
          transform: `translateY(${(1 - btn) * 30}px) scale(${pulse})`,
          boxShadow: `0 0 ${30 + (pulse - 1) * 800}px rgba(227,25,43,.55)`,
        }}
      >
        {label}
        <svg width="52" height="52" viewBox="0 0 24 24">
          <path d="M5 12h12M12 6l6 6-6 6" fill="none" stroke="#fff" strokeWidth={3.2} strokeLinecap="square" />
        </svg>
      </div>
      <Mono size={22} style={{ position: "absolute", left: 80, top: 1430, width: 860, textAlign: "center", letterSpacing: 2, opacity: foot, color: C.white }}>
        POLÍCIA PENAL · PM · PC · PF · PRF · GCM
      </Mono>
      <div style={{ position: "absolute", left: 80, top: 1466, width: 860, textAlign: "center", fontFamily: MONO, fontSize: 17, color: C.gray, opacity: foot }}>
        Material educacional. Confira sempre na fonte oficial.
      </div>
    </AbsoluteFill>
  );
};
