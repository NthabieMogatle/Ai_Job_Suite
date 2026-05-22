import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { brand } from "../brand";

interface PhoneMockupProps {
  startFrame?: number;
  screenshotSrc?: string; // path to static asset in /public
  children?: React.ReactNode;
  scale?: number;
}

export const PhoneMockup: React.FC<PhoneMockupProps> = ({
  startFrame = 0,
  screenshotSrc,
  children,
  scale = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 20, stiffness: 160, mass: 1.2 },
    durationInFrames: 40,
  });

  const translateY = interpolate(progress, [0, 1], [200, 0]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const scaleVal = interpolate(progress, [0, 1], [0.85, 1]);

  // Phone dimensions (ratio 9:19.5 approx)
  const phoneW = 380 * scale;
  const phoneH = 820 * scale;
  const borderR = 44 * scale;
  const borderW = 14 * scale;
  const notchW = 120 * scale;
  const notchH = 30 * scale;

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px) scale(${scaleVal})`,
        position: "relative",
        width: phoneW,
        height: phoneH,
      }}
    >
      {/* Phone outer shell */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: borderR,
          background: `linear-gradient(160deg, #2a2a2e 0%, #1a1a1d 60%, #111113 100%)`,
          boxShadow: `0 40px 120px rgba(0,0,0,0.8), 0 0 0 ${borderW}px #2c2c30, inset 0 0 0 1px rgba(255,255,255,0.05)`,
        }}
      />
      {/* Screen area */}
      <div
        style={{
          position: "absolute",
          top: borderW,
          left: borderW,
          right: borderW,
          bottom: borderW,
          borderRadius: borderR - borderW * 0.8,
          overflow: "hidden",
          background: brand.bg,
        }}
      >
        {screenshotSrc ? (
          <img
            src={screenshotSrc}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top",
            }}
            alt="App screenshot"
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: brand.surface,
            }}
          >
            {children ?? (
              <span
                style={{
                  fontFamily: brand.fontDisplay,
                  fontSize: 28 * scale,
                  color: brand.gold,
                  opacity: 0.7,
                }}
              >
                Élève
              </span>
            )}
          </div>
        )}
        {/* Notch overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: notchW,
            height: notchH,
            background: "#0e0e0f",
            borderBottomLeftRadius: 14 * scale,
            borderBottomRightRadius: 14 * scale,
          }}
        />
      </div>
      {/* Side buttons (decorative) */}
      <div
        style={{
          position: "absolute",
          right: -borderW - 4,
          top: "28%",
          width: 5 * scale,
          height: 60 * scale,
          background: "#333",
          borderRadius: 3,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -borderW - 4,
          top: "22%",
          width: 5 * scale,
          height: 40 * scale,
          background: "#333",
          borderRadius: 3,
        }}
      />
    </div>
  );
};
