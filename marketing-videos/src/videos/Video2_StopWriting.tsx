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

const c = copy.video2;
// 480 frames = 16s @30fps
// 0-45:   HOOK
// 45-195: Manual typing scene
// 195-240: VS card
// 240-360: AI instant scene
// 360-420: Comparison stat
// 420-480: CTA

const TypingCursor: React.FC<{ active: boolean }> = ({ active }) => {
  const frame = useCurrentFrame();
  const blink = Math.floor(frame / 8) % 2 === 0;
  return (
    <span
      style={{
        display: "inline-block",
        width: 3,
        height: "1.1em",
        background: active && blink ? brand.text : "transparent",
        marginLeft: 2,
        verticalAlign: "middle",
      }}
    />
  );
};

const COVER_LETTER_LINES = [
  "Dear Hiring Manager,",
  "",
  "I am writing to express my strong",
  "interest in the Software Engineer",
  "position at your company. With over",
  "5 years of experience in...",
];

const ManualTypingScene: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - startFrame);
  const charsPerFrame = 0.6;
  const totalChars = Math.floor(elapsed * charsPerFrame);

  let chars = 0;
  const opacity = interpolate(Math.max(0, frame - startFrame), [0, 10], [0, 1]);

  return (
    <div
      style={{
        background: brand.surface2,
        border: `1px solid ${brand.border}`,
        borderRadius: 16,
        padding: "36px 40px",
        width: 780,
        opacity,
        fontFamily: "'Courier New', monospace",
        fontSize: 34,
        color: brand.text,
        lineHeight: 1.7,
        minHeight: 340,
        position: "relative",
      }}
    >
      <div
        style={{
          fontSize: 24,
          color: brand.muted,
          marginBottom: 20,
          fontFamily: brand.fontBody,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        Cover Letter Draft.docx
      </div>
      {COVER_LETTER_LINES.map((line, lineIdx) => {
        const lineStart = chars;
        chars += line.length + 1;
        const lineChars = Math.max(0, Math.min(line.length, totalChars - lineStart));
        const isCurrentLine = totalChars >= lineStart && totalChars < lineStart + line.length + 1;

        return (
          <div key={lineIdx} style={{ minHeight: "1.7em" }}>
            {line.slice(0, lineChars)}
            {isCurrentLine && <TypingCursor active={true} />}
          </div>
        );
      })}
      {/* Time indicator */}
      <div
        style={{
          position: "absolute",
          top: 16,
          right: 20,
          fontFamily: brand.fontBody,
          fontSize: 28,
          color: "#e74c3c",
          fontWeight: 700,
        }}
      >
        ⏱ {Math.floor(elapsed / 30)}:{String(Math.floor((elapsed % 30) * 2)).padStart(2, "0")}
      </div>
    </div>
  );
};

const AIGenerationScene: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const elapsed = Math.max(0, frame - startFrame);

  const barProgress = spring({
    frame: elapsed,
    fps,
    config: { damping: 30, stiffness: 60, mass: 1 },
    durationInFrames: 35,
  });

  const textOpacity = interpolate(elapsed, [30, 45], [0, 1]);
  const opacity = interpolate(elapsed, [0, 10], [0, 1]);

  const AI_LINES = [
    "Dear Sarah Chen,",
    "",
    "Your team's work on distributed",
    "systems caught my attention — your",
    "2024 paper on fault tolerance aligns",
    "perfectly with my background in...",
  ];

  return (
    <div
      style={{
        background: brand.surface2,
        border: `1px solid rgba(201,168,76,0.3)`,
        borderRadius: 16,
        padding: "36px 40px",
        width: 780,
        opacity,
        fontFamily: brand.fontBody,
        fontSize: 34,
        color: brand.text,
        lineHeight: 1.7,
        minHeight: 340,
        position: "relative",
        boxShadow: `0 0 60px rgba(201,168,76,0.15)`,
      }}
    >
      <div
        style={{
          fontSize: 24,
          color: brand.gold,
          marginBottom: 20,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          fontWeight: 700,
        }}
      >
        ✦ Élève — AI Generated
      </div>

      {/* Progress bar */}
      {elapsed < 35 && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: brand.surface,
            borderRadius: "16px 16px 0 0",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${barProgress * 100}%`,
              background: `linear-gradient(90deg, ${brand.gold}, ${brand.goldLight})`,
              transition: "width 0.1s",
            }}
          />
        </div>
      )}

      <div style={{ opacity: textOpacity }}>
        {AI_LINES.map((line, i) => (
          <div key={i} style={{ minHeight: "1.7em" }}>
            {line}
          </div>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          top: 16,
          right: 20,
          fontFamily: brand.fontBody,
          fontSize: 28,
          color: brand.success,
          fontWeight: 700,
        }}
      >
        ✓ 10 seconds
      </div>
    </div>
  );
};

export const Video2_StopWriting: React.FC = () => {
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
            alignItems: "center",
            justifyContent: "center",
            padding: `${SAFE_TOP}px 80px`,
          }}
        >
          <KineticText
            text={c.hookText}
            startFrame={3}
            fontSize={96}
            highlightWords={["Stop", "hand."]}
            animStyle="scale-pop"
          />
        </AbsoluteFill>
      </Sequence>

      {/* MANUAL TYPING: 45-195 */}
      <Sequence from={45} durationInFrames={150}>
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
            text={c.manualLabel}
            startFrame={0}
            fontSize={52}
            color="#e74c3c"
            animStyle="fade"
            fontFamily={brand.fontBody}
            fontWeight={700}
          />
          <ManualTypingScene startFrame={0} />
          <div
            style={{
              opacity: interpolate(Math.max(0, frame - 60), [0, 20], [0, 1]),
              fontFamily: brand.fontBody,
              fontSize: 44,
              color: "#e74c3c",
              fontWeight: 800,
            }}
          >
            {c.manualTime} of your life
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* VS CARD: 195-240 */}
      <Sequence from={195} durationInFrames={45}>
        <AbsoluteFill
          style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <div
            style={{
              opacity: interpolate(Math.max(0, frame - 195), [0, 12], [0, 1]),
              fontFamily: brand.fontDisplay,
              fontSize: 160,
              fontWeight: 700,
              color: brand.gold,
              textShadow: `0 0 80px rgba(201,168,76,0.5)`,
            }}
          >
            VS
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* AI SCENE: 240-360 */}
      <Sequence from={240} durationInFrames={120}>
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
            text={c.aiLabel}
            startFrame={0}
            fontSize={52}
            color={brand.gold}
            animStyle="fade"
            fontFamily={brand.fontBody}
            fontWeight={700}
          />
          <AIGenerationScene startFrame={0} />
          <div
            style={{
              opacity: interpolate(Math.max(0, frame - 285), [0, 20], [0, 1]),
              fontFamily: brand.fontBody,
              fontSize: 56,
              color: brand.success,
              fontWeight: 800,
            }}
          >
            ✓ {c.aiTime}
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* COMPARISON: 360-420 */}
      <Sequence from={360} durationInFrames={60}>
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
            text={c.comparison}
            startFrame={0}
            fontSize={76}
            highlightWords={["Zero", "Same"]}
            animStyle="slide-up"
          />
          <KineticText
            text={c.result}
            startFrame={15}
            fontSize={46}
            color={brand.muted}
            animStyle="fade"
            fontFamily={brand.fontBody}
            fontWeight={400}
          />
        </AbsoluteFill>
      </Sequence>

      {/* CTA: 420-480 */}
      <Sequence from={420} durationInFrames={60}>
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
