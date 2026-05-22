import React from "react";
import { Composition } from "remotion";
import { Video1_POV } from "./videos/Video1_POV";
import { Video2_StopWriting } from "./videos/Video2_StopWriting";
import { Video3_Recruiters } from "./videos/Video3_Recruiters";
import { Video4_Interviews } from "./videos/Video4_Interviews";

const W = 1080;
const H = 1920;
const FPS = 30;

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="video1-pov"
        component={Video1_POV}
        durationInFrames={540}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="video2-stop-writing"
        component={Video2_StopWriting}
        durationInFrames={480}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="video3-recruiters"
        component={Video3_Recruiters}
        durationInFrames={540}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="video4-interviews"
        component={Video4_Interviews}
        durationInFrames={480}
        fps={FPS}
        width={W}
        height={H}
      />
    </>
  );
};
