import { AbsoluteFill, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Typewriter } from "../components/Typewriter";
import { C, CLAMP, EASE_OUT, MONO, SANS } from "../theme";

// 01. 터미널 부팅 + 타이핑 헤드라인
export const BootScene: React.FC = () => {
  const frame = useCurrentFrame();
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
      <Interactive.Div
        name="Boot label"
        style={{
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
        text="다시, 뛸 수 있도록"
        start={10}
        speed={0.45}
        style={{ fontFamily: SANS, fontWeight: 900, fontSize: 150, color: C.white, letterSpacing: -4 }}
      />

      <div style={{ width: 640, marginTop: 70 }}>
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
    </AbsoluteFill>
  );
};
