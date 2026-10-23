import { AbsoluteFill, Interactive, interpolate, useCurrentFrame } from "remotion";
import { PopIcon } from "../components/Icons";
import { Shape } from "../components/Shapes";
import { Sfx } from "../components/Sfx";
import { Typewriter } from "../components/Typewriter";
import { useLayout } from "../layout";
import { BEAT, C, CLAMP, EASE_OUT, MONO, SANS } from "../theme";

// 헤드라인 주변에서 비트마다 하나씩 튀어나오는 의료·재활 아이콘(위치는 화면 비율)
const ICONS = [
  { name: "firstAid", fx: 0.172, fy: 0.25, size: 40, color: C.red, at: BEAT },
  { name: "running", fx: 0.828, fy: 0.278, size: 96, color: C.accent, at: 1.5 * BEAT },
  { name: "heartbeat", fx: 0.156, fy: 0.731, size: 80, color: C.red, at: 2 * BEAT },
  { name: "weights", fx: 0.839, fy: 0.731, size: 90, color: C.accent, at: 2.5 * BEAT },
  { name: "spine", fx: 0.271, fy: 0.167, size: 56, color: C.dim, at: 3 * BEAT },
  { name: "firstAid", fx: 0.74, fy: 0.815, size: 30, color: C.red, at: 3.5 * BEAT },
] as const;

// 01. 터미널 부팅 + 타이핑 헤드라인
export const BootScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { w, h, portrait } = useLayout();
  const pct = Math.round(interpolate(frame, [4, 70], [0, 100], { ...CLAMP, easing: EASE_OUT }));

  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.bg,
        backgroundImage: `radial-gradient(${C.line} 1.5px, transparent 1.5px)`,
        backgroundSize: "36px 36px",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* 헤드라인 뒤를 천천히 도는 점선 링 */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            opacity: interpolate(frame, [0, 12], [0, 0.55], CLAMP),
            scale: interpolate(frame, [0, 20], [0.85, 1], { ...CLAMP, easing: EASE_OUT }),
            rotate: `${frame * 0.25}deg`,
          }}
        >
          <Shape kind="circle" size={900} color={C.line} stroke={3} dashed />
        </div>
      </AbsoluteFill>
      {ICONS.map(({ fx, fy, ...s }, i) => (
        <PopIcon key={i} x={fx * w} y={fy * h} {...s} />
      ))}

      <Interactive.Div
        name="Boot label"
        style={{
          position: "relative",
          fontFamily: MONO,
          fontSize: 22,
          letterSpacing: 6,
          color: C.dim,
          marginBottom: 40,
          opacity: interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        R-SPORTS / REHAB SYSTEM ONLINE
      </Interactive.Div>

      <Typewriter
        text={portrait ? "다시,\n건강한 일상으로" : "다시, 건강한 일상으로"}
        start={10}
        speed={0.45}
        style={{
          position: "relative",
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: portrait ? 128 : 140,
          lineHeight: 1.15,
          textAlign: "center",
          color: C.white,
          letterSpacing: -4,
        }}
      />

      <div style={{ position: "relative", width: portrait ? 560 : 640, marginTop: 70 }}>
        <div style={{ height: 3, background: C.line }}>
          <div style={{ height: 3, width: `${pct}%`, background: C.accent }} />
        </div>
        <div
          style={{
            marginTop: 16,
            display: "flex",
            justifyContent: "space-between",
            fontFamily: MONO,
            fontSize: 20,
            color: C.dim,
            letterSpacing: 3,
          }}
        >
          <span>RECOVERY</span>
          <span style={{ color: C.accent }}>{String(pct).padStart(3, "0")}%</span>
        </div>
      </div>

      <Sfx name="blip-low" at={1} volume={0.7} />
      {ICONS.map((s, i) => (
        <Sfx key={i} name="pop" at={s.at} volume={0.35} />
      ))}
    </AbsoluteFill>
  );
};
