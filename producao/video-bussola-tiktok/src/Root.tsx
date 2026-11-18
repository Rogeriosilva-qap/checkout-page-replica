import React from "react";
import { Composition } from "remotion";
import { BussolaVideo, VideoProps } from "./Video";
import { FPS, HEIGHT, TOTAL_FRAMES, WIDTH } from "./timing";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="BussolaTikTok"
    component={BussolaVideo}
    durationInFrames={TOTAL_FRAMES}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
    defaultProps={{ cta: "bio" } satisfies VideoProps}
  />
);
