import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { LogoMark } from "../components/Brand";
import { Halftone } from "../components/Halftone";
import { Typewriter } from "../components/Typewriter";
import { BEAT, C, CLAMP, EASE_OUT, MONO, SANS } from "../theme";

const INFO = [
  { k: "ADDRESS", v: "서울 강서구 공항대로 212 문영퀸즈파크11차 A동 5층" },
  { k: "CALL", v: "02-6737-6667" },
];

// 08. 엔딩: 방사형 하프톤 + 로고 + 연락처 + URL 필
export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 14, stiffness: 140 } });

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, justifyContent: "center", alignItems: "center" }}>
      <AbsoluteFill style={{ opacity: 0.55 }}>
        <Halftone
          mode="rays"
          hole={460}
          speed={0.6}
          reveal={interpolate(frame, [0, 2 * BEAT], [0, 1], { ...CLAMP, easing: EASE_OUT })}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(circle at center, ${C.bg} 0, ${C.bg} 420px, transparent 620px)` }} />

      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 36, scale: pop }}>
          <LogoMark size={120} />
          <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 96, color: C.white, letterSpacing: -4 }}>
            R스포츠재활센터
          </div>
        </div>

        <Typewriter
          text="다시, 뛸 수 있도록."
          start={BEAT}
          speed={0.5}
          style={{ fontFamily: SANS, fontWeight: 700, fontSize: 52, color: C.accent, marginTop: 30, letterSpacing: -1 }}
        />

        <div style={{ marginTop: 50, display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
          {INFO.map((r, i) => {
            const s = (3 + i) * BEAT;
            return (
              <div
                key={r.k}
                style={{
                  display: "flex",
                  gap: 24,
                  alignItems: "baseline",
                  opacity: interpolate(frame, [s, s + 6], [0, 1], CLAMP),
                }}
              >
                <span style={{ fontFamily: MONO, fontSize: 20, letterSpacing: 3, color: C.dim }}>{r.k}</span>
                <span style={{ fontFamily: SANS, fontWeight: 500, fontSize: 36, color: C.white }}>{r.v}</span>
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 46,
            padding: "16px 40px",
            borderRadius: 999,
            background: C.accent,
            color: C.bg,
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
    </AbsoluteFill>
  );
};
