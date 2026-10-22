import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { LogoMark } from "../components/Brand";
import { Halftone } from "../components/Halftone";
import { BEAT, C, CLAMP, EASE_OUT, MONO, SANS } from "../theme";

// 03. 하프톤 동심원 위로 로고 리빌
export const LogoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - BEAT, fps, config: { damping: 12, stiffness: 160 } });
  // 비트마다 링이 살짝 튀는 펄스
  const pulse = 1 + 0.03 * Math.exp(-(frame % BEAT) / 4);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, justifyContent: "center", alignItems: "center" }}>
      <AbsoluteFill style={{ scale: pulse }}>
        <Halftone
          mode="rings"
          reveal={interpolate(frame, [0, 2 * BEAT], [0, 1], { ...CLAMP, easing: EASE_OUT })}
          hole={interpolate(frame, [BEAT, 2 * BEAT], [0, 330], { ...CLAMP, easing: EASE_OUT })}
          speed={1.6}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at center, ${C.bg} 0, ${C.bg} 300px, transparent 420px)`,
          opacity: interpolate(frame, [BEAT, 2 * BEAT], [0, 1], CLAMP),
        }}
      />

      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
        <div style={{ scale: pop }}>
          <LogoMark size={150} />
        </div>
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 104,
            color: C.white,
            letterSpacing: -4,
            opacity: interpolate(frame, [2 * BEAT, 2 * BEAT + 8], [0, 1], CLAMP),
            translate: `0px ${interpolate(frame, [2 * BEAT, 2 * BEAT + 10], [30, 0], { ...CLAMP, easing: EASE_OUT })}px`,
          }}
        >
          R스포츠재활센터
        </div>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 20,
            letterSpacing: 5,
            color: C.accent,
            border: `1px solid ${C.accent}`,
            padding: "8px 20px",
            background: C.bg,
            opacity: interpolate(frame, [3 * BEAT, 3 * BEAT + 6], [0, 1], CLAMP),
          }}
        >
          SPORTS REHABILITATION CENTER · MAGOK
        </div>
      </div>
    </AbsoluteFill>
  );
};
