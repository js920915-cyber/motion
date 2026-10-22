import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BEAT, C, CLAMP, EASE_OUT, MONO, SANS } from "../theme";

const PARTS = [
  { ko: "무릎", en: "KNEE" },
  { ko: "허리", en: "LOWER BACK" },
  { ko: "어깨", en: "SHOULDER" },
  { ko: "발목", en: "ANKLE" },
];

// 02. 비트마다 통증 부위가 바뀌고, 질문으로 마무리
export const PainScene: React.FC = () => {
  const frame = useCurrentFrame();
  const idx = Math.floor(frame / BEAT);
  const local = frame % BEAT;
  const inWords = idx < PARTS.length;
  const qStart = PARTS.length * BEAT;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, justifyContent: "center", alignItems: "center" }}>
      {inWords ? (
        <>
          {/* 타깃 서클 */}
          <svg width={760} height={760} style={{ position: "absolute" }}>
            <circle
              cx={380}
              cy={380}
              r={330}
              fill="none"
              stroke={C.accent}
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
                stroke={C.accent}
                strokeWidth={3}
                transform={`rotate(${a} 380 380)`}
              />
            ))}
          </svg>
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
              bottom: 170,
              fontFamily: MONO,
              fontSize: 24,
              letterSpacing: 6,
              color: C.accent,
            }}
          >
            {String(idx + 1).padStart(2, "0")} · {PARTS[idx].en} · PAIN DETECTED
          </div>
        </>
      ) : (
        <div style={{ textAlign: "center", fontFamily: SANS, fontWeight: 900, letterSpacing: -5, lineHeight: 1.15 }}>
          <div
            style={{
              fontSize: 150,
              color: C.white,
              translate: `0px ${interpolate(frame, [qStart, qStart + 8], [60, 0], { ...CLAMP, easing: EASE_OUT })}px`,
              opacity: interpolate(frame, [qStart, qStart + 6], [0, 1], CLAMP),
            }}
          >
            그 통증,
          </div>
          <div
            style={{
              fontSize: 150,
              color: C.accent,
              translate: `0px ${interpolate(frame, [qStart + BEAT, qStart + BEAT + 8], [60, 0], { ...CLAMP, easing: EASE_OUT })}px`,
              opacity: interpolate(frame, [qStart + BEAT, qStart + BEAT + 6], [0, 1], CLAMP),
            }}
          >
            참고 계신가요?
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
