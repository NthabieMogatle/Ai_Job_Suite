import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Img, staticFile } from "remotion";
import { brand } from "../brand";

interface CTACardProps {
  startFrame?: number;
  line1?: string;
  line2?: string;
  subLine?: string;
}

export const CTACard: React.FC<CTACardProps> = ({
  startFrame = 0,
  line1 = "AI Job Suite",
  line2 = "Link in bio →",
  subLine = "one-time purchase on Gumroad",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 22, stiffness: 180, mass: 1 },
    durationInFrames: 35,
  });

  const logoProgress = spring({
    frame: frame - startFrame - 8,
    fps,
    config: { damping: 20, stiffness: 240, mass: 0.9 },
    durationInFrames: 25,
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const scaleVal = interpolate(progress, [0, 1], [0.9, 1]);
  const logoScale = interpolate(logoProgress, [0, 1], [0.5, 1]);
  const logoOpacity = interpolate(logoProgress, [0, 1], [0, 1]);

  // Pulsing gold glow on CTA button
  const pulse = interpolate(
    Math.sin((frame - startFrame) * 0.08),
    [-1, 1],
    [0.6, 1]
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
        background: `radial-gradient(ellipse 80% 60% at 50% 50%, rgba(201,168,76,0.08) 0%, transparent 70%)`,
        opacity,
        transform: `scale(${scaleVal})`,
      }}
    >
      {/* Logo */}
      <div
        style={{
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          borderRadius: 20,
          overflow: "hidden",
          border: `2px solid ${brand.gold}`,
          boxShadow: `0 0 40px rgba(201,168,76,0.3)`,
        }}
      >
        <Img
          src={staticFile("logo.jpg")}
          style={{ width: 200, height: "auto", display: "block" }}
        />
      </div>

      {/* Brand line */}
      <div
        style={{
          fontFamily: brand.fontDisplay,
          fontSize: 64,
          fontWeight: 600,
          color: brand.text,
          textAlign: "center",
          letterSpacing: "-0.02em",
          textShadow: "0 2px 20px rgba(0,0,0,0.8)",
        }}
      >
        {line1}
      </div>

      {/* Divider */}
      <div
        style={{
          width: 80,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${brand.gold}, transparent)`,
        }}
      />

      {/* CTA Button */}
      <div
        style={{
          background: brand.gold,
          color: brand.bg,
          fontFamily: brand.fontBody,
          fontSize: 52,
          fontWeight: 800,
          padding: "24px 72px",
          borderRadius: 60,
          letterSpacing: "-0.01em",
          boxShadow: `0 0 ${60 * pulse}px rgba(201,168,76,0.5), 0 8px 32px rgba(0,0,0,0.4)`,
          textAlign: "center",
        }}
      >
        {line2}
      </div>

      {/* Sub line */}
      <div
        style={{
          fontFamily: brand.fontBody,
          fontSize: 34,
          color: brand.muted,
          textAlign: "center",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        {subLine}
      </div>
    </div>
  );
};
