import React from "react";
import { Composition } from "remotion";
import { BussolaVideo, VideoProps } from "./Video";
import { FPS, HEIGHT, TOTAL_FRAMES, WIDTH } from "./timing";
import { PatentesVideo, TOTAL_PATENTES } from "./patentes/Patentes";
import { TeaserVideo, TOTAL_TEASER } from "./patentes/Teaser";
import { PorDentroVideo, TOTAL_POR_DENTRO } from "./patentes/PorDentro";
import { CorrecaoVideo, TOTAL_CORRECAO } from "./patentes/Correcao";
import { GabaritoVideo, QuestaoVideo, TOTAL_GABARITO, TOTAL_QUESTAO } from "./patentes/Questao";
import { GabaritoGtaVideo, QuestaoGtaVideo, TOTAL_GABARITO_GTA, TOTAL_QUESTAO_GTA } from "./patentes/QuestaoGta";
import { PlataformaVideo, TOTAL_PLATAFORMA } from "./patentes/Plataforma";
import { SiteVideo, TOTAL_SITE } from "./site/Site";
import { GabaritoPortVideo, QuestaoPortVideo, TOTAL_GABARITO_PORT, TOTAL_QUESTAO_PORT } from "./patentes/QuestaoPort";

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
  <Composition id="QuestaoGta" component={QuestaoGtaVideo} durationInFrames={TOTAL_QUESTAO_GTA} fps={FPS} width={WIDTH} height={HEIGHT} />
  <Composition id="GabaritoGta" component={GabaritoGtaVideo} durationInFrames={TOTAL_GABARITO_GTA} fps={FPS} width={WIDTH} height={HEIGHT} />
  <Composition id="QuestaoPort" component={QuestaoPortVideo} durationInFrames={TOTAL_QUESTAO_PORT} fps={FPS} width={WIDTH} height={HEIGHT} />
  <Composition id="GabaritoPort" component={GabaritoPortVideo} durationInFrames={TOTAL_GABARITO_PORT} fps={FPS} width={WIDTH} height={HEIGHT} />
  <Composition id="PlataformaBussola" component={PlataformaVideo} durationInFrames={TOTAL_PLATAFORMA} fps={FPS} width={WIDTH} height={HEIGHT} />
  <Composition id="SiteHorizontal" component={SiteVideo} durationInFrames={TOTAL_SITE} fps={FPS} width={1920} height={1080} />
  <Composition id="SiteVertical" component={SiteVideo} durationInFrames={TOTAL_SITE} fps={FPS} width={1080} height={1350} />
  <Composition id="TeaserSimulados" component={TeaserVideo} durationInFrames={TOTAL_TEASER} fps={FPS} width={WIDTH} height={HEIGHT} />
  </>
);
