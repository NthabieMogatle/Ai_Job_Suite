import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Img,
} from "remotion";
import { brand, SAFE_TOP, SAFE_BOTTOM, W, H } from "../brand";
import { AnimatedCaption } from "../components/AnimatedCaption";
import { KineticText } from "../components/KineticText";
import { PhoneMockup } from "../components/PhoneMockup";
import { CTACard } from "../components/CTACard";
import { copy } from "../copy/captions";

const c = copy.video1;
// fps=30, total=540 (18s)
// 0-45:   HOOK headline
// 45-105: sub-hook
// 105-180: "Until I found this tool"
// 180-300: Phone reveal + feature 1
// 300-390: Feature 2
// 390-450: Feature 3
// 450-540: CTA

const GoldDot: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 300 }, durationInFrames: 15 });
  return (
    <span
      style={{
        display: "inline-block",
        width: 12,
        height: 12,
        borderRadius: "50%",
        background: brand.gold,
        margin: "0 8px",
        opacity: interpolate(p, [0, 1], [0, 1]),
        transform: `scale(${interpolate(p, [0, 1], [0, 1])})`,
      }}
    />
  );
};

const StatCounter: React.FC<{ value: number; label: string; startFrame: number }> = ({
  value,
  label,
  startFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame: frame - startFrame, fps, config: { damping: 20, stiffness: 100 }, durationInFrames: 60 });
  const displayed = Math.round(interpolate(progress, [0, 1], [0, value]));
  const opacity = interpolate(Math.max(0, frame - startFrame), [0, 15], [0, 1]);

  return (
    <div style={{ textAlign: "center", opacity }}>
      <div
        style={{
          fontFamily: brand.fontDisplay,
          fontSize: 180,
          fontWeight: 700,
          color: brand.gold,
          lineHeight: 1,
          textShadow: `0 0 60px rgba(201,168,76,0.4)`,
        }}
      >
        {displayed}
      </div>
      <div
        style={{
          fontFamily: brand.fontBody,
          fontSize: 44,
          color: brand.muted,
          marginTop: -16,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const Video1_POV: React.FC = () => {
  const frame = useCurrentFrame();

  const bgPulse = interpolate(Math.sin(frame * 0.02), [-1, 1], [0.03, 0.06]);

  return (
    <AbsoluteFill style={{ background: brand.bg, fontFamily: brand.fontBody }}>
      {/* Subtle grid bg */}
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(rgba(201,168,76,${bgPulse}) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,${bgPulse}) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      {/* AUDIO SLOT — drop your trending TikTok sound here */}
      {/* <Audio src={staticFile("audio/trending-sound.mp3")} /> */}

      {/* HOOK: 0-105 */}
      <Sequence from={0} durationInFrames={105}>
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: `${SAFE_TOP}px 0`,
            gap: 32,
          }}
        >
          {/* POV pill */}
          <Sequence from={0} durationInFrames={105}>
            <div style={{ opacity: interpolate(frame, [0, 10], [0, 1]) }}>
              <div
                style={{
                  background: brand.goldDim,
                  border: `1px solid rgba(201,168,76,0.4)`,
                  borderRadius: 40,
                  padding: "12px 40px",
                  fontFamily: brand.fontBody,
                  fontSize: 32,
                  fontWeight: 600,
                  color: brand.gold,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  marginBottom: 24,
                }}
              >
                POV
              </div>
            </div>
          </Sequence>

          <KineticText
            text={c.hookText}
            startFrame={5}
            fontSize={88}
            highlightWords={["50"]}
            animStyle="slide-up"
          />

          <Sequence from={45} durationInFrames={60}>
            <KineticText
              text={c.hookSub}
              startFrame={0}
              fontSize={62}
              color={brand.muted}
              animStyle="fade"
              fontFamily={brand.fontBody}
              fontWeight={400}
            />
          </Sequence>
        </AbsoluteFill>
      </Sequence>

      {/* STAT COUNTER: 45-105 */}
      <Sequence from={50} durationInFrames={90}>
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 200,
          }}
        >
          <StatCounter value={50} label="Applications sent" startFrame={0} />
        </AbsoluteFill>
      </Sequence>

      {/* REVEAL: 105-180 */}
      <Sequence from={105} durationInFrames={75}>
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
          }}
        >
          <KineticText
            text={c.reveal}
            startFrame={5}
            fontSize={80}
            highlightWords={["found", "this"]}
            animStyle="scale-pop"
          />
          <div
            style={{
              opacity: interpolate(frame - 130, [0, 20], [0, 1]),
              display: "flex",
              gap: 8,
              marginTop: 12,
            }}
          >
            <GoldDot delay={130} />
            <GoldDot delay={140} />
            <GoldDot delay={150} />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* PHONE REVEAL + FEATURES: 180-450 */}
      <Sequence from={180} durationInFrames={270}>
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 48,
            paddingTop: SAFE_TOP,
          }}
        >
          <PhoneMockup
            startFrame={0}
            screenshotSrc={staticFile("feature-resume.jpg")}
            scale={0.9}
          />
        </AbsoluteFill>
      </Sequence>

      {/* Feature cards overlaid on phone scene */}
      <Sequence from={210} durationInFrames={90}>
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            paddingBottom: H - SAFE_BOTTOM + 120,
          }}
        >
          <KineticText
            text={c.feature1}
            startFrame={0}
            fontSize={56}
            highlightWords={["resume", "role"]}
            animStyle="slide-up"
            fontFamily={brand.fontBody}
            fontWeight={700}
          />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={300} durationInFrames={90}>
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            paddingBottom: H - SAFE_BOTTOM + 120,
          }}
        >
          <KineticText
            text={c.feature2}
            startFrame={0}
            fontSize={56}
            highlightWords={["cover", "letter"]}
            animStyle="slide-up"
            fontFamily={brand.fontBody}
            fontWeight={700}
          />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={390} durationInFrames={60}>
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            paddingBottom: H - SAFE_BOTTOM + 120,
          }}
        >
          <KineticText
            text={c.feature3}
            startFrame={0}
            fontSize={72}
            highlightWords={["10", "seconds"]}
            animStyle="scale-pop"
            fontFamily={brand.fontBody}
            fontWeight={800}
            color={brand.gold}
          />
        </AbsoluteFill>
      </Sequence>

      {/* CLOSING + CTA: 450-540 */}
      <Sequence from={450} durationInFrames={90}>
        <CTACard
          startFrame={0}
          line1={c.ctaLine1}
          line2={c.ctaLine2}
          subLine={c.ctaGumroad}
        />
      </Sequence>

      {/* Bottom caption strip — always visible in safe zone */}
      <Sequence from={10} durationInFrames={440}>
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingBottom: H - SAFE_BOTTOM + 20,
          }}
        >
          <AnimatedCaption
            text={frame < 105 ? c.hookText : frame < 180 ? c.hookSub : c.reveal}
            startFrame={0}
            fontSize={44}
            color="rgba(240,237,230,0.85)"
          />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
