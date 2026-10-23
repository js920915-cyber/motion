import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BrandLogo } from "../components/Brand";
import { Halftone } from "../components/Halftone";
import { PopIcon } from "../components/Icons";
import { Sfx } from "../components/Sfx";
import { Typewriter } from "../components/Typewriter";
import { useLayout } from "../layout";
import { BEAT, C, CLAMP, EASE_OUT, MONO, SANS } from "../theme";

const INFO = [
  { k: "ADDRESS", v: "서울 강서구 공항대로 212 문영퀸즈파크11차 A동 5층" },
  { k: "CALL", v: "02-6737-6667" },
];

// 08. 엔딩: 블루 방사형 하프톤 + 흰 로고 + 연락처 + URL 필
export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 14, stiffness: 140 } });
  const { w, h, portrait, tall } = useLayout();
  const hole = portrait ? 540 : 460;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, justifyContent: "center", alignItems: "center" }}>
      <AbsoluteFill style={{ opacity: 0.55 }}>
        <Halftone
          mode="rays"
          color={C.accent}
          hole={hole}
          speed={0.6}
          reveal={interpolate(frame, [0, 2 * BEAT], [0, 1], { ...CLAMP, easing: EASE_OUT })}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(circle at center, ${C.bg} 0, ${C.bg} ${hole - 40}px, transparent ${hole + 160}px)` }} />

      <PopIcon name="heartbeat" x={0.156 * w} y={0.241 * h} size={90} color={C.red} at={BEAT} />
      <PopIcon name="running" x={0.854 * w} y={0.231 * h} size={96} color={C.white} at={1.5 * BEAT} />
      <PopIcon name="firstAid" x={0.844 * w} y={0.778 * h} size={42} color={C.red} at={2 * BEAT} />
      <PopIcon name="weights" x={0.151 * w} y={0.769 * h} size={86} color={C.dim} at={2.5 * BEAT} />

      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ scale: pop }}>
          <BrandLogo width={portrait ? (tall ? 860 : 780) : 820} variant="white" />
        </div>

        <Typewriter
          text="다시, 건강한 일상으로."
          start={BEAT}
          speed={0.5}
          style={{ fontFamily: SANS, fontWeight: 700, fontSize: 52, color: C.white, marginTop: 40, letterSpacing: -1 }}
        />

        <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: portrait ? 22 : 14, alignItems: "center" }}>
          {INFO.map((r, i) => {
            const s = (3 + i) * BEAT;
            return (
              <div
                key={r.k}
                style={{
                  display: "flex",
                  // 세로 화면: 라벨을 값 위에
                  flexDirection: portrait ? "column" : "row",
                  gap: portrait ? 6 : 24,
                  alignItems: portrait ? "center" : "baseline",
                  opacity: interpolate(frame, [s, s + 6], [0, 1], CLAMP),
                }}
              >
                <span style={{ fontFamily: MONO, fontSize: 20, letterSpacing: 3, color: C.dim }}>{r.k}</span>
                <span style={{ fontFamily: SANS, fontWeight: 500, fontSize: portrait ? (tall ? 34 : 31) : 36, color: C.white }}>{r.v}</span>
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 42,
            padding: "16px 40px",
            borderRadius: 999,
            background: C.red,
            color: C.white,
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 34,
            letterSpacing: 1,
            scale: interpolate(frame, [5 * BEAT, 5 * BEAT + 8], [0.6, 1], { ...CLAMP, easing: EASE_OUT }),
            opacity: interpolate(frame, [5 * BEAT, 5 * BEAT + 4], [0, 1], CLAMP),
          }}
        >
          rsports.co.kr ↗
        </div>
      </div>

      <Sfx name="impact" at={0} volume={0.45} />
      {[1, 1.5, 2, 2.5].map((b) => (
        <Sfx key={b} name="pop" at={b * BEAT} volume={0.3} />
      ))}
      {INFO.map((r, i) => (
        <Sfx key={r.k} name="blip" at={(3 + i) * BEAT} volume={0.45} />
      ))}
      <Sfx name="pop" at={5 * BEAT} volume={0.6} />
      <Sfx name="ding" at={5 * BEAT + 2} volume={0.55} />
    </AbsoluteFill>
  );
};
