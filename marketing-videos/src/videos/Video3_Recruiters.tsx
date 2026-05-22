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

const c = copy.video3;
// 540 frames = 18s @30fps
// 0-45:   HOOK
// 45-90:  hookSub "...unless you do this"
// 90-165: Problem (generic AI = rejection)
// 165-270: Tone options demo
// 270-360: Result reveal
// 360-450: Phone mockup with screenshot
// 450-540: CTA

const BadResumeCard: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - startFrame);
  const opacity = interpolate(elapsed, [0, 12], [0, 1]);
  const shake = elapsed > 20 && elapsed < 50
    ? Math.sin(elapsed * 1.2) * interpolate(elapsed, [20, 50], [8, 0])
    : 0;

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${shake}px)`,
        background: "rgba(231,76,60,0.08)",
        border: "2px solid rgba(231,76,60,0.4)",
        borderRadius: 16,
        padding: "32px 40px",
        width: 780,
        fontFamily: brand.fontBody,
        fontSize: 32,
        color: brand.text,
        lineHeight: 1.6,
      }}
    >
      <div style={{ color: "#e74c3c", fontWeight: 800, fontSize: 28, marginBottom: 16, letterSpacing: "0.1em" }}>
        ✗ GENERIC AI OUTPUT
      </div>
      <div style={{ color: brand.muted, fontStyle: "italic" }}>
        "I am a highly motivated and results-driven professional with a proven track record of success. I am passionate about leveraging my diverse skill set..."
      </div>
      <div style={{ marginTop: 20, color: "#e74c3c", fontSize: 30, fontWeight: 700 }}>
        ⚠ Recruiter spotted immediately
      </div>
    </div>
  );
};

const ToneSelector: React.FC<{ startFrame: number; tones: string[] }> = ({
  startFrame,
  tones,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const elapsed = Math.max(0, frame - startFrame);

  const activeIndex = elapsed < 40 ? 0 : elapsed < 80 ? 1 : 2;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        width: 780,
        opacity: interpolate(elapsed, [0, 12], [0, 1]),
      }}
    >
      <div
        style={{
          fontFamily: brand.fontBody,
          fontSize: 34,
          color: brand.muted,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: 8,
        }}
      >
        Choose your tone:
      </div>
      {tones.map((tone, i) => {
        const isActive = i === activeIndex;
        const progress = spring({
          frame: elapsed - i * 12,
          fps,
          config: { damping: 18, stiffness: 250 },
          durationInFrames: 20,
        });
        const itemOpacity = interpolate(progress, [0, 1], [0, 1]);
        const scale = isActive ? 1.04 : 1;

        return (
          <div
            key={i}
            style={{
              opacity: itemOpacity,
              transform: `scale(${scale})`,
              background: isActive ? brand.goldDim : brand.surface2,
              border: `2px solid ${isActive ? brand.gold : brand.border}`,
              borderRadius: 14,
              padding: "24px 36px",
              display: "flex",
              alignItems: "center",
              gap: 20,
              transition: "all 0.2s",
              boxShadow: isActive ? `0 0 40px rgba(201,168,76,0.2)` : "none",
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                border: `3px solid ${isActive ? brand.gold : brand.muted2}`,
                background: isActive ? brand.gold : "transparent",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: brand.fontBody,
                fontSize: 40,
                fontWeight: isActive ? 700 : 400,
                color: isActive ? brand.text : brand.muted,
              }}
            >
              {tone}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export const Video3_Recruiters: React.FC = () => {
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

      {/* HOOK: 0-90 */}
      <Sequence from={0} durationInFrames={90}>
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: `${SAFE_TOP}px 80px`,
            gap: 36,
          }}
        >
          <KineticText
            text={c.hookText}
            startFrame={3}
            fontSize={80}
            highlightWords={["KNOW"]}
            animStyle="slide-up"
          />
          <Sequence from={45} durationInFrames={45}>
            <KineticText
              text={c.hookSub}
              startFrame={0}
              fontSize={64}
              color={brand.gold}
              animStyle="scale-pop"
              fontFamily={brand.fontBody}
              fontWeight={800}
            />
          </Sequence>
        </AbsoluteFill>
      </Sequence>

      {/* PROBLEM: 90-165 */}
      <Sequence from={90} durationInFrames={75}>
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 40,
            padding: `${SAFE_TOP}px 0`,
          }}
        >
          <KineticText
            text={c.problem}
            startFrame={0}
            fontSize={68}
            highlightWords={["rejection"]}
            color="#e74c3c"
            animStyle="slide-left"
            fontFamily={brand.fontBody}
            fontWeight={800}
          />
          <BadResumeCard startFrame={20} />
        </AbsoluteFill>
      </Sequence>

      {/* TONE SELECTOR DEMO: 165-360 */}
      <Sequence from={165} durationInFrames={195}>
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
            text={c.solutionIntro}
            startFrame={0}
            fontSize={60}
            highlightWords={["tone:"]}
            animStyle="slide-up"
            fontFamily={brand.fontBody}
            fontWeight={700}
          />
          <ToneSelector startFrame={20} tones={c.toneOptions} />
        </AbsoluteFill>
      </Sequence>

      {/* RESULT: 270-360 */}
      <Sequence from={270} durationInFrames={90}>
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 32,
          }}
        >
          <KineticText
            text={c.result}
            startFrame={0}
            fontSize={80}
            highlightWords={["YOU", "not"]}
            animStyle="scale-pop"
          />
          <KineticText
            text={c.proof}
            startFrame={20}
            fontSize={48}
            color={brand.muted}
            animStyle="fade"
            fontFamily={brand.fontBody}
            fontWeight={400}
          />
        </AbsoluteFill>
      </Sequence>

      {/* PHONE: 360-450 */}
      <Sequence from={360} durationInFrames={90}>
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
            screenshotSrc={staticFile("feature-ats.jpg")}
            scale={0.95}
          />
        </AbsoluteFill>
      </Sequence>

      {/* CTA: 450-540 */}
      <Sequence from={450} durationInFrames={90}>
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
