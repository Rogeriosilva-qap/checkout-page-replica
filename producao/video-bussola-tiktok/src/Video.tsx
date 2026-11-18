import React from "react";
import { AbsoluteFill, Audio, interpolate, random, Sequence, staticFile, useCurrentFrame } from "remotion";
import assets from "./data/assets.json";
import narracao from "./data/narracao.json";
import { FPS, GLITCH_FRAMES, SCENES, SceneId, VOICE_DELAY, vozDaCena } from "./timing";
import { speechSpans } from "./captions";
import { Background, HudFrame } from "./components/ui";
import { Captions } from "./components/Captions";
import { Cena01Gancho } from "./scenes/Cena01Gancho";
import { Cena02Dor } from "./scenes/Cena02Dor";
import { Cena03Metodo } from "./scenes/Cena03Metodo";
import { Cena04Extracao } from "./scenes/Cena04Extracao";
import { Cena05Fatiamento } from "./scenes/Cena05Fatiamento";
import { Cena06Priorizacao } from "./scenes/Cena06Priorizacao";
import { Cena07Calendario } from "./scenes/Cena07Calendario";
import { Cena08Conferencia } from "./scenes/Cena08Conferencia";
import { Cena09Cta } from "./scenes/Cena09Cta";

export type VideoProps = { cta: "bio" | "stories" };

const renderScene = (id: SceneId, frames: number, cta: VideoProps["cta"]) => {
  switch (id) {
    case "gancho": return <Cena01Gancho />;
    case "dor": return <Cena02Dor frames={frames} />;
    case "metodo": return <Cena03Metodo />;
    case "extracao": return <Cena04Extracao frames={frames} />;
    case "fatiamento": return <Cena05Fatiamento />;
    case "priorizacao": return <Cena06Priorizacao frames={frames} />;
    case "calendario": return <Cena07Calendario />;
    case "conferencia": return <Cena08Conferencia frames={frames} />;
    case "cta": return <Cena09Cta cta={cta} frames={frames} />;
  }
};

const starts = SCENES.reduce<number[]>((a, s, i) => [...a, i ? a[i - 1] + SCENES[i - 1].frames : 0], []);
const CENAS = (narracao as { cenas: Record<string, { arquivo: string; duracao: number }> }).cenas;

/** glitch curto (deslocamento RGB) só nas trocas de cena */
const useGlitch = () => {
  const f = useCurrentFrame();
  const k = starts.findIndex((s, i) => i > 0 && f >= s && f < s + GLITCH_FRAMES);
  if (k < 0) return { filter: undefined as string | undefined, transform: undefined as string | undefined, k };
  const seed = f * 13.1;
  const dx = (random(seed) - 0.5) * 40;
  const off = 10 + random(seed + 1) * 14;
  return {
    k,
    filter: `drop-shadow(${off}px 0 0 rgba(255,0,40,.75)) drop-shadow(${-off}px 0 0 rgba(0,230,255,.6))`,
    transform: `translateX(${dx}px) skewX(${(random(seed + 2) - 0.5) * 6}deg)`,
  };
};

export const BussolaVideo: React.FC<VideoProps> = ({ cta }) => {
  const f = useCurrentFrame();
  const g = useGlitch();
  const spans = speechSpans(cta);
  // trilha ~13 dB abaixo da voz enquanto ela fala; sobe nas pausas (rampa de ~0,2 s)
  const musicVol = (frame: number) => {
    const tt = frame / FPS;
    let d = Infinity;
    for (const [a, b] of spans) d = Math.min(d, tt < a ? a - tt : tt > b ? tt - b : 0);
    const duck = interpolate(d, [0, 0.2], [0.33, 0.6], { extrapolateRight: "clamp" });
    const fadeOut = interpolate(frame, [SCENES.reduce((a, s) => a + s.frames, 0) - 25, SCENES.reduce((a, s) => a + s.frames, 0)], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const fadeIn = interpolate(frame, [0, 6], [0.4, 1], { extrapolateRight: "clamp" });
    return duck * fadeOut * fadeIn;
  };
  return (
    <AbsoluteFill style={{ backgroundColor: "#0E0E11" }}>
      <Background />
      <AbsoluteFill style={{ filter: g.filter, transform: g.transform }}>
        {SCENES.map((s, i) => (
          <Sequence key={s.id} from={starts[i]} durationInFrames={s.frames} name={s.id}>
            {renderScene(s.id, s.frames, cta)}
          </Sequence>
        ))}
      </AbsoluteFill>
      {g.k > 0 ? (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: random(f * 3 + i) * 1800,
                height: 6 + random(f * 7 + i) * 40,
                background: i === 1 ? "rgba(227,25,43,.55)" : "rgba(255,255,255,.12)",
                transform: `translateX(${(random(f + i * 9) - 0.5) * 120}px)`,
              }}
            />
          ))}
        </AbsoluteFill>
      ) : null}
      <HudFrame />
      <Captions cta={cta} />

      {/* voz */}
      {assets.narracaoUsuario ? (
        <Audio src={staticFile("narracao.mp3")} />
      ) : (
        SCENES.map((s, i) => {
          const c = CENAS[vozDaCena(s.voz, cta)];
          return c ? (
            <Sequence key={`v-${s.id}`} from={starts[i] + VOICE_DELAY} durationInFrames={Math.ceil(c.duracao * FPS) + 2} name={`voz ${s.voz}`}>
              <Audio src={staticFile(c.arquivo)} volume={1} />
            </Sequence>
          ) : null;
        })
      )}
      {/* trilha */}
      {assets.musica ? <Audio src={staticFile(assets.musica)} volume={musicVol} loop /> : null}
      {/* efeitos */}
      {assets.sfx
        ? starts.slice(1).map((s, i) => (
            <Sequence key={`g-${i}`} from={s - 1} durationInFrames={20} name="sfx glitch">
              <Audio src={staticFile("sfx/glitch.wav")} volume={0.35} />
            </Sequence>
          ))
        : null}
    </AbsoluteFill>
  );
};
