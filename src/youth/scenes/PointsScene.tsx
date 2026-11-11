import { Video } from "@remotion/media";
import { AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Sfx } from "../../components/Sfx";
import { BEAT, CLAMP, EASE_OUT, MONO, SANS, Y } from "../theme";

// 7~10초: 설명회 핵심 3가지가 2비트마다 하나씩 '중계 스코어 박스'처럼 박힙니다.
// (Remocn "score-bug"·"strobe-words"의 박자감을 참고)
const POINTS = [
  { no: "01", text: "부상 원인 이해", en: "WHY INJURIES HAPPEN" },
  { no: "02", text: "성장기 관리", en: "GROWTH-STAGE CARE" },
  { no: "03", text: "움직임 향상", en: "BETTER MOVEMENT" },
];
const STEP = 2 * BEAT;
const ALL_ON = 5 * BEAT;

const Row: React.FC<{ i: number }> = ({ i }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = i * STEP + 2;
  const local = frame - at;
  if (local < 0) return null;
  const pop = spring({ frame: local, fps, config: { damping: 14, stiffness: 240 } });
  const bar = interpolate(local, [2, 10], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const active = frame < ALL_ON ? Math.floor((frame - 2) / STEP) === i : true;
  const p = POINTS[i];

  return (
    <div
      style={{
        display: "flex",
        height: 210,
        opacity: active ? 1 : 0.45,
        transform: `translateX(${(1 - pop) * -120}px)`,
      }}
    >
      <div
        style={{
          width: 190,
          background: i === 1 ? Y.accent : Y.red,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: 76,
          color: Y.white,
          transform: `scale(${0.6 + pop * 0.4})`,
        }}
      >
        {p.no}
      </div>
      <div style={{ position: "relative", flex: 1, overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: Y.bg2,
            borderTop: `2px solid ${Y.line}`,
            borderBottom: `2px solid ${Y.line}`,
            transformOrigin: "left center",
            transform: `scaleX(${bar})`,
          }}
        />
        <div style={{ position: "relative", padding: "34px 0 0 40px", opacity: bar }}>
          <div style={{ fontFamily: MONO, fontSize: 24, letterSpacing: 4, color: Y.dim }}>{p.en}</div>
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: 88,
              letterSpacing: "-0.04em",
              color: Y.white,
              lineHeight: 1.15,
            }}
          >
            {p.text}
          </div>
        </div>
      </div>
    </div>
  );
};

export const PointsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const head = interpolate(frame, [0, 8], [0, 1], { ...CLAMP, easing: EASE_OUT });
  return (
    <AbsoluteFill style={{ backgroundColor: Y.bg }}>
      {/* 배경: 메디신볼 던지기 클립을 어둡게 */}
      <AbsoluteFill style={{ opacity: 0.32 }}>
        <Video src={staticFile("clips/medicine-ball-throw.mp4")} trimBefore={0} muted objectFit="cover" style={{ width: 1080, height: 1920 }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${Y.bg} 10%, rgba(5,11,24,0.7) 50%, ${Y.bg} 95%)` }} />

      <div style={{ position: "absolute", top: 330, left: 80, right: 120, opacity: head, transform: `translateY(${(1 - head) * 30}px)` }}>
        <div style={{ fontFamily: MONO, fontSize: 26, letterSpacing: 5, color: Y.red }}>3 KEY POINTS</div>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 78, letterSpacing: "-0.04em", color: Y.white, marginTop: 10 }}>
          설명회에서 알려드립니다
        </div>
      </div>

      <div style={{ position: "absolute", top: 600, left: 80, right: 120, display: "flex", flexDirection: "column", gap: 36 }}>
        {POINTS.map((p, i) => (
          <Row key={p.no} i={i} />
        ))}
      </div>

      {POINTS.map((p, i) => (
        <Sfx key={p.no} name="thump" at={i * STEP + 2} volume={0.8} />
      ))}
    </AbsoluteFill>
  );
};
