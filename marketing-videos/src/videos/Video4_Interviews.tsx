import React from "react";
import {
  AbsoluteFill,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { brand, SAFE_TOP, SAFE_BOTTOM, H } from "../brand";
import { KineticText } from "../components/KineticText";
import { PhoneMockup } from "../components/PhoneMockup";
import { CTACard } from "../components/CTACard";
import { copy } from "../copy/captions";

const c = copy.video4;
// 480 frames = 16s @30fps
// 0-45:   HOOK
// 45-120: Before scene (ghosted)
// 120-240: Stat cards reveal
// 240-330: Phone mockup
// 330-390: Price/value prop
// 390-480: CTA

const GhostMessages: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - startFrame);

  const messages = [
    { text: "Thank you for applying, however...", delay: 0 },
    { text: "We've decided to move forward with other candidates.", delay: 15 },
    { text: "Unfortunately at this time...", delay: 30 },
    { text: "[No reply]", delay: 45, isGhost: true },
    { text: "[No reply]", delay: 55, isGhost: true },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 780 }}>
      {messages.map((msg, i) => {
        const opacity = interpolate(Math.max(0, elapsed - msg.delay), [0, 12], [0, 1]);
        return (
          <div
            key={i}
            style={{
              opacity,
              background: (msg as any).isGhost ? "rgba(136,133,128,0.08)" : "rgba(231,76,60,0.08)",
              border: `1px solid ${(msg as any).isGhost ? brand.border : "rgba(231,76,60,0.3)"}`,
              borderRadius: 12,
              padding: "16px 28px",
              fontFamily: brand.fontBody,
              fontSize: 32,
              color: (msg as any).isGhost ? brand.muted2 : brand.muted,
              fontStyle: (msg as any).isGhost ? "italic" : "normal",
            }}
          >
            {msg.text}
          </div>
        );
      })}
    </div>
  );
};

const StatCard: React.FC<{
  icon: string;
  label: string;
  delay: number;
}> = ({ icon, label, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 16, stiffness: 220, mass: 0.9 },
    durationInFrames: 25,
  });

  const scale = interpolate(progress, [0, 1], [0.5, 1]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const translateY = interpolate(progress, [0, 1], [40, 0]);

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale}) translateY(${translateY}px)`,
        background: brand.surface2,
        border: `2px solid ${brand.gold}`,
        borderRadius: 20,
        padding: "32px 48px",
        display: "flex",
        alignItems: "center",
        gap: 24,
        width: 780,
        boxShadow: `0 0 40px rgba(201,168,76,0.12)`,
      }}
    >
      <span style={{ fontSize: 56 }}>{icon}</span>
      <span
        style={{
          fontFamily: brand.fontBody,
          fontSize: 44,
          fontWeight: 700,
          color: brand.text,
        }}
      >
        {label}
      </span>
    </div>
  );
};

export const Video4_Interviews: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: brand.bg, fontFamily: brand.fontBody }}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(rgba(201,168,76,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.03) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      {/* AUDIO SLOT — drop your trending TikTok sound here */}
      {/* <Audio src={staticFile("audio/trending-sound.mp3")} /> */}

      {/* HOOK: 0-45 */}
      <Sequence from={0} durationInFrames={45}>
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: `${SAFE_TOP}px 80px`,
            gap: 28,
          }}
        >
          <KineticText
            text={c.hookText}
            startFrame={3}
            fontSize={96}
            highlightWords={["3", "interviews", "week"]}
            animStyle="scale-pop"
            color={brand.gold}
          />
          <KineticText
            text={c.hookSub}
            startFrame={20}
            fontSize={52}
            color={brand.muted}
            animStyle="fade"
            fontFamily={brand.fontBody}
            fontWeight={400}
          />
        </AbsoluteFill>
      </Sequence>

      {/* BEFORE (ghosted): 45-120 */}
      <Sequence from={45} durationInFrames={75}>
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 36,
            padding: `${SAFE_TOP}px 0`,
          }}
        >
          <KineticText
            text={c.before}
            startFrame={0}
            fontSize={58}
            highlightWords={["ghosted.", "Time."]}
            color="#e74c3c"
            animStyle="slide-up"
            fontFamily={brand.fontBody}
            fontWeight={700}
          />
          <GhostMessages startFrame={15} />
        </AbsoluteFill>
      </Sequence>

      {/* STAT CARDS: 120-300 */}
      <Sequence from={120} durationInFrames={180}>
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 28,
            padding: `${SAFE_TOP}px 0`,
          }}
        >
          {c.stats.map((stat, i) => (
            <StatCard key={i} icon={stat.icon} label={stat.label} delay={i * 20} />
          ))}
        </AbsoluteFill>
      </Sequence>

      {/* PHONE: 240-330 */}
      <Sequence from={240} durationInFrames={90}>
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: SAFE_TOP,
          }}
        >
          <PhoneMockup
            startFrame={0}
            screenshotSrc={staticFile("feature-interview.jpg")}
            scale={0.9}
          />
        </AbsoluteFill>
      </Sequence>

      {/* VALUE PROP: 330-390 */}
      <Sequence from={330} durationInFrames={60}>
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 32,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 40,
              opacity: interpolate(Math.max(0, frame - 330), [0, 20], [0, 1]),
            }}
          >
            {[c.timeValue, c.priceValue].map((val, i) => (
              <div
                key={i}
                style={{
                  textAlign: "center",
                  background: brand.goldDim,
                  border: `1px solid rgba(201,168,76,0.4)`,
                  borderRadius: 16,
                  padding: "24px 40px",
                }}
              >
                <div
                  style={{
                    fontFamily: brand.fontDisplay,
                    fontSize: 52,
                    color: brand.gold,
                    fontWeight: 600,
                  }}
                >
                  {val}
                </div>
              </div>
            ))}
          </div>
          <KineticText
            text={c.proof}
            startFrame={20}
            fontSize={44}
            color={brand.success}
            animStyle="fade"
            fontFamily={brand.fontBody}
            fontWeight={600}
          />
        </AbsoluteFill>
      </Sequence>

      {/* CTA: 390-480 */}
      <Sequence from={390} durationInFrames={90}>
        <CTACard
          startFrame={0}
          line1={c.ctaLine1}
          line2={c.ctaLine2}
          subLine={c.ctaGumroad}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
