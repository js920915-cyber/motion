import { Video } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Sfx } from "../../components/Sfx";
import { FocusBrackets } from "../components/FocusBrackets";
import { BEAT, CLAMP, EASE_OUT, MONO, SANS, Y } from "../theme";

// 3~7초: 센터 실촬영 클립 위에 브래킷이 무릎 → 발목을 조준
// 드리블 영상 등 다른 클립을 쓰려면 SHOTS 의 src·trimBefore·focus 만 바꾸세요.
// focus 좌표는 1080x1920 화면 기준입니다.
const SHOT = 4 * BEAT;

const SHOTS = [
  {
    src: "clips/single-leg-squat.mp4",
    trimBefore: 30,
    lines: ["다치는 데엔", "이유가 있습니다"],
    focus: { cx: 560, cy: 1290, hw: 230, hh: 150, tag: "KNEE", label: "무릎 정렬" },
  },
  {
    src: "media/balance.mp4",
    trimBefore: 0,
    lines: ["움직임을 보면", "원인이 보입니다"],
    focus: { cx: 575, cy: 1215, hw: 170, hh: 110, tag: "ANKLE", label: "발목 안정성" },
  },
] as const;

const Headline: React.FC<{ lines: readonly string[] }> = ({ lines }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", top: 290, left: 80, right: 120 }}>
      {lines.map((l, i) => {
        const p = interpolate(frame, [2 + i * 4, 12 + i * 4], [0, 1], { ...CLAMP, easing: EASE_OUT });
        return (
          <div key={l} style={{ overflow: "hidden" }}>
            <div
              style={{
                fontFamily: SANS,
                fontWeight: 900,
                fontSize: 104,
                lineHeight: 1.12,
                letterSpacing: "-0.04em",
                color: i === 1 ? Y.white : Y.white,
                transform: `translateY(${(1 - p) * 110}%)`,
                textShadow: "0 4px 24px rgba(0,0,0,0.35)",
              }}
            >
              {i === 1 ? <span style={{ background: Y.red, padding: "0 14px" }}>{l}</span> : l}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Shot: React.FC<(typeof SHOTS)[number]> = ({ src, trimBefore, lines, focus }) => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, SHOT], [1.06, 1.14], CLAMP);
  const flash = interpolate(frame, [0, 3], [0.6, 0], CLAMP);
  return (
    <AbsoluteFill style={{ backgroundColor: Y.bg }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: `${focus.cx}px ${focus.cy}px` }}>
        <Video src={staticFile(src)} trimBefore={trimBefore} muted objectFit="cover" style={{ width: 1080, height: 1920 }} />
      </AbsoluteFill>
      {/* 브랜드 네이비 톤 + 위아래 그라데이션(글자 가독성) */}
      <AbsoluteFill style={{ background: Y.navy, mixBlendMode: "multiply", opacity: 0.35 }} />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(5,11,24,0.92) 0%, rgba(5,11,24,0.55) 30%, rgba(5,11,24,0) 48%, rgba(5,11,24,0) 78%, rgba(5,11,24,0.6) 100%)",
        }}
      />
      <FocusBrackets at={6} {...focus} />
      <Headline lines={lines} />
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 560,
          fontFamily: MONO,
          fontSize: 24,
          letterSpacing: 4,
          color: Y.dim,
        }}
      >
        MOVEMENT SCREEN · R SPORTS
      </div>
      <AbsoluteFill style={{ backgroundColor: Y.white, opacity: flash }} />
    </AbsoluteFill>
  );
};

export const CauseScene: React.FC = () => (
  <AbsoluteFill>
    {SHOTS.map((s, i) => (
      <Sequence key={s.src} from={i * SHOT} durationInFrames={SHOT} name={s.focus.tag}>
        <Shot {...s} />
        <Sfx name={i === 0 ? "whoosh" : "shutter"} at={0} volume={0.6} />
        <Sfx name="blip" at={6 + 14} volume={0.7} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
