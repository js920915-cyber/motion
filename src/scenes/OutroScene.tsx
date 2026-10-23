import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BrandLogo } from "../components/Brand";
import { Halftone } from "../components/Halftone";
import { PopShape } from "../components/Shapes";
import { Sfx } from "../components/Sfx";
import { Typewriter } from "../components/Typewriter";
import { BEAT, C, CLAMP, EASE_OUT, MONO, SANS } from "../theme";

const INFO = [
  { k: "ADDRESS", v: "서울 강서구 공항대로 212 문영퀸즈파크11차 A동 5층" },
  { k: "CALL", v: "02-6737-6667" },
];

// 08. 엔딩: 블루 방사형 하프톤 + 로고 카드 + 연락처 + URL 필
export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 14, stiffness: 140 } });

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, justifyContent: "center", alignItems: "center" }}>
      <AbsoluteFill style={{ opacity: 0.55 }}>
        <Halftone
          mode="rays"
          color={C.accent}
          hole={460}
          speed={0.6}
          reveal={interpolate(frame, [0, 2 * BEAT], [0, 1], { ...CLAMP, easing: EASE_OUT })}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(circle at center, ${C.bg} 0, ${C.bg} 420px, transparent 620px)` }} />

      <PopShape kind="circle" x={300} y={260} size={90} color={C.accent} stroke={6} at={BEAT} />
      <PopShape kind="triangle" x={1640} y={250} size={70} color={C.red} filled at={1.5 * BEAT} spin={0.3} />
      <PopShape kind="plus" x={1620} y={840} size={48} color={C.white} filled at={2 * BEAT} spin={-0.4} />
      <PopShape kind="square" x={290} y={830} size={56} color={C.dim} at={2.5 * BEAT} rotate={15} spin={0.25} />

      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div
          style={{
            scale: pop,
            background: C.paper,
            borderRadius: 28,
            padding: "34px 54px",
            boxShadow: `0 0 80px ${C.accent}40`,
          }}
        >
          <BrandLogo width={700} />
        </div>

        <Typewriter
          text="다시, 건강한 일상으로."
          start={BEAT}
          speed={0.5}
          style={{ fontFamily: SANS, fontWeight: 700, fontSize: 52, color: C.white, marginTop: 40, letterSpacing: -1 }}
        />

        <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
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
