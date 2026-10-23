import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Shape } from "../components/Shapes";
import { Sfx } from "../components/Sfx";
import { BEAT, C, CLAMP, EASE_OUT, MONO, SANS } from "../theme";

const PARTS = [
  { ko: "무릎", en: "KNEE" },
  { ko: "허리", en: "LOWER BACK" },
  { ko: "어깨", en: "SHOULDER" },
  { ko: "발목", en: "ANKLE" },
];

// 02. 비트마다 통증 부위가 바뀜
export const PainScene: React.FC = () => {
  const frame = useCurrentFrame();
  const idx = Math.min(PARTS.length - 1, Math.floor(frame / BEAT));
  const local = frame - idx * BEAT;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, justifyContent: "center", alignItems: "center" }}>
      {/* 바깥에서 도는 점선 링 */}
      <div style={{ position: "absolute", rotate: `${frame * 0.6}deg`, opacity: 0.8 }}>
        <Shape kind="circle" size={900} color={C.line} stroke={4} dashed />
      </div>
      {/* 타깃 서클 */}
      <svg width={760} height={760} style={{ position: "absolute" }}>
        <circle
          cx={380}
          cy={380}
          r={330}
          fill="none"
          stroke={C.red}
          strokeWidth={3}
          strokeDasharray={2 * Math.PI * 330}
          strokeDashoffset={interpolate(local, [0, BEAT - 3], [2 * Math.PI * 330, 0], {
            ...CLAMP,
            easing: EASE_OUT,
          })}
          transform="rotate(-90 380 380)"
        />
        {[0, 90, 180, 270].map((a) => (
          <line
            key={a}
            x1={380}
            y1={20}
            x2={380}
            y2={70}
            stroke={C.red}
            strokeWidth={3}
            transform={`rotate(${a} 380 380)`}
          />
        ))}
      </svg>
      {/* 네 방향에서 중심을 가리키는 삼각형 */}
      {[0, 90, 180, 270].map((a) => (
        <div
          key={a}
          style={{
            position: "absolute",
            rotate: `${a + 180}deg`,
            translate: `${Math.sin((a * Math.PI) / 180) * interpolate(local, [0, 8], [500, 440], { ...CLAMP, easing: EASE_OUT })}px ${-Math.cos((a * Math.PI) / 180) * interpolate(local, [0, 8], [500, 440], { ...CLAMP, easing: EASE_OUT })}px`,
          }}
        >
          <Shape kind="triangle" size={26} color={C.accent} filled />
        </div>
      ))}
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 300,
          color: C.white,
          letterSpacing: -10,
          scale: interpolate(local, [0, 6], [1.25, 1], { ...CLAMP, easing: EASE_OUT }),
        }}
      >
        {PARTS[idx].ko}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 128,
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "6px 18px",
          background: C.bg,
          fontFamily: MONO,
          fontSize: 24,
          letterSpacing: 6,
          color: C.red,
        }}
      >
        <Shape kind="circle" size={14} color={C.red} filled style={{ opacity: local < BEAT / 2 ? 1 : 0.25 }} />
        {String(idx + 1).padStart(2, "0")} · {PARTS[idx].en} · PAIN DETECTED
      </div>

      {PARTS.map((_, i) => (
        <Sfx key={i} name="alert" at={i * BEAT} volume={0.75} />
      ))}
    </AbsoluteFill>
  );
};
