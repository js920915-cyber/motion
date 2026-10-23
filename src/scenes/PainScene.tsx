import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { PopShape, Shape } from "../components/Shapes";
import { Sfx } from "../components/Sfx";
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
        </>
      ) : (
        <>
          <PopShape kind="plus" x={420} y={330} size={64} color={C.accent} filled at={qStart} spin={0.5} />
          <PopShape kind="circle" x={1520} y={300} size={110} color={C.line} stroke={6} at={qStart + 4} />
          <PopShape kind="square" x={1470} y={800} size={54} color={C.red} at={qStart + BEAT} rotate={20} spin={-0.6} />
          <PopShape kind="triangle" x={480} y={790} size={70} color={C.dim} at={qStart + BEAT + 4} spin={0.3} />
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
        </>
      )}

      {PARTS.map((_, i) => (
        <Sfx key={i} name="alert" at={i * BEAT} volume={0.75} />
      ))}
      <Sfx name="whoosh" at={qStart - 3} volume={0.5} />
      <Sfx name="thump" at={qStart} volume={0.55} />
      <Sfx name="thump" at={qStart + BEAT} volume={0.6} />
    </AbsoluteFill>
  );
};
