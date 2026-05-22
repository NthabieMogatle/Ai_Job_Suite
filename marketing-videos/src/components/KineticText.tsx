import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { brand } from "../brand";

type AnimStyle = "slide-up" | "scale-pop" | "slide-left" | "fade";

interface KineticTextProps {
  text: string;
  startFrame?: number;
  fontSize?: number;
  color?: string;
  highlightWords?: string[]; // words to render in gold
  animStyle?: AnimStyle;
  fontFamily?: string;
  fontWeight?: number;
  textAlign?: "center" | "left";
  maxWidth?: number;
}

export const KineticText: React.FC<KineticTextProps> = ({
  text,
  startFrame = 0,
  fontSize = 96,
  color = brand.text,
  highlightWords = [],
  animStyle = "slide-up",
  fontFamily = brand.fontDisplay,
  fontWeight = 700,
  textAlign = "center",
  maxWidth = 920,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 18, stiffness: 200, mass: 1 },
    durationInFrames: 30,
  });

  let transform = "none";
  let opacity = 1;

  switch (animStyle) {
    case "slide-up":
      transform = `translateY(${interpolate(progress, [0, 1], [80, 0])}px)`;
      opacity = interpolate(progress, [0, 1], [0, 1]);
      break;
    case "scale-pop":
      transform = `scale(${interpolate(progress, [0, 1], [0.4, 1])})`;
      opacity = interpolate(progress, [0, 1], [0, 1]);
      break;
    case "slide-left":
      transform = `translateX(${interpolate(progress, [0, 1], [-120, 0])}px)`;
      opacity = interpolate(progress, [0, 1], [0, 1]);
      break;
    case "fade":
      opacity = interpolate(progress, [0, 1], [0, 1]);
      break;
  }

  const words = text.split(" ");

  return (
    <div
      style={{
        maxWidth,
        textAlign,
        opacity,
        transform,
        fontFamily,
        fontSize,
        fontWeight,
        color,
        lineHeight: 1.1,
        letterSpacing: "-0.02em",
        textShadow: "0 4px 24px rgba(0,0,0,0.8)",
        padding: "0 80px",
        wordBreak: "break-word",
      }}
    >
      {words.map((word, i) => {
        const isHighlighted =
          highlightWords.some((hw) => hw.toLowerCase() === word.toLowerCase().replace(/[.,!?]/, ""));
        return (
          <React.Fragment key={i}>
            <span style={{ color: isHighlighted ? brand.gold : color }}>
              {word}
            </span>
            {i < words.length - 1 ? " " : ""}
          </React.Fragment>
        );
      })}
    </div>
  );
};
