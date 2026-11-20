import React from "react";
import { Composition } from "remotion";
import { BussolaVideo, VideoProps } from "./Video";
import { FPS, HEIGHT, TOTAL_FRAMES, WIDTH } from "./timing";
import { PatentesVideo, TOTAL_PATENTES } from "./patentes/Patentes";
import { TeaserVideo, TOTAL_TEASER } from "./patentes/Teaser";
import { PorDentroVideo, TOTAL_POR_DENTRO } from "./patentes/PorDentro";
import { CorrecaoVideo, TOTAL_CORRECAO } from "./patentes/Correcao";
import { GabaritoVideo, QuestaoVideo, TOTAL_GABARITO, TOTAL_QUESTAO } from "./patentes/Questao";

export const RemotionRoot: React.FC = () => (
  <>
  <Composition
    id="BussolaTikTok"
    component={BussolaVideo}
    durationInFrames={TOTAL_FRAMES}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
    defaultProps={{ cta: "bio" } satisfies VideoProps}
  />
  <Composition id="PatentesSimulados" component={PatentesVideo} durationInFrames={TOTAL_PATENTES} fps={FPS} width={WIDTH} height={HEIGHT} />
  <Composition id="PorDentroSimulados" component={PorDentroVideo} durationInFrames={TOTAL_POR_DENTRO} fps={FPS} width={WIDTH} height={HEIGHT} />
  <Composition id="CorrecaoSimulados" component={CorrecaoVideo} durationInFrames={TOTAL_CORRECAO} fps={FPS} width={WIDTH} height={HEIGHT} />
  <Composition id="QuestaoDia" component={QuestaoVideo} durationInFrames={TOTAL_QUESTAO} fps={FPS} width={WIDTH} height={HEIGHT} />
  <Composition id="GabaritoDia" component={GabaritoVideo} durationInFrames={TOTAL_GABARITO} fps={FPS} width={WIDTH} height={HEIGHT} />
  <Composition id="TeaserSimulados" component={TeaserVideo} durationInFrames={TOTAL_TEASER} fps={FPS} width={WIDTH} height={HEIGHT} />
  </>
);
