import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { brand } from "../brand";

interface AnimatedCaptionProps {
  text: string;
  startFrame?: number;
  fontSize?: number;
  color?: string;
  wordDelay?: number; // frames between words
}

export const AnimatedCaption: React.FC<AnimatedCaptionProps> = ({
  text,
  startFrame = 0,
  fontSize = 52,
  color = brand.text,
  wordDelay = 5,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "0.3em",
        padding: "0 80px",
        textAlign: "center",
      }}
    >
      {words.map((word, i) => {
        const wordFrame = startFrame + i * wordDelay;
        const progress = spring({
          frame: frame - wordFrame,
          fps,
          config: { damping: 15, stiffness: 280, mass: 0.8 },
          durationInFrames: 20,
        });
        const opacity = interpolate(progress, [0, 1], [0, 1]);
        const scale = interpolate(progress, [0, 1], [0.6, 1]);
        const translateY = interpolate(progress, [0, 1], [20, 0]);

        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              fontFamily: brand.fontBody,
              fontSize,
              fontWeight: 800,
              color,
              textShadow: `0 2px 12px rgba(0,0,0,0.9), 0 0 30px rgba(0,0,0,0.7)`,
              opacity,
              transform: `scale(${scale}) translateY(${translateY}px)`,
              transformOrigin: "center bottom",
              letterSpacing: "-0.01em",
              lineHeight: 1.15,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
