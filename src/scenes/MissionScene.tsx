import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Shape, ShapeKind } from "../components/Shapes";
import { Sfx } from "../components/Sfx";
import { useLayout } from "../layout";
import { BEAT, C, CLAMP, EASE_OUT, MONO, SANS } from "../theme";

// 키워드마다 짝이 되는 도형
const WORDS: { text: string; shape: ShapeKind; color: string }[] = [
  { text: "부상 예방", shape: "square", color: C.white },
  { text: "기능 향상", shape: "triangle", color: C.white },
  { text: "회복", shape: "circle", color: C.red },
];

// 08. 네이비 픽셀 디더 배경 위로 비트마다 키워드+도형 → 미션 문장
export const MissionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { w: width, h: height, portrait, tall } = useLayout();
  const shapeSize = portrait ? (tall ? 340 : 260) : 380;
  const idx = Math.floor(frame / BEAT);
  const finalStart = WORDS.length * BEAT;
  const cell = 48;
  // 박자마다 블록 배치가 바뀌는 디더 패턴(가로: 오른쪽, 세로: 아래쪽으로 갈수록 밀도↑)
  const tick = Math.floor(frame / (BEAT / 2));
  const blocks: React.ReactNode[] = [];
  for (let y = 0; y < height; y += cell) {
    for (let x = 0; x < width; x += cell) {
      const t = portrait ? y / height : x / width;
      const density = t < 0.78 ? 0 : Math.pow((t - 0.78) / 0.22, 0.8) * 0.85;
      if (random(`m-${x}-${y}-${tick}`) < density) {
        blocks.push(<div key={`${x}-${y}`} style={{ position: "absolute", left: x, top: y, width: cell, height: cell, background: C.navyDeep }} />);
      }
    }
  }
  const hit = spring({ frame: frame % BEAT, fps, config: { damping: 10, stiffness: 180 } });

  return (
    <AbsoluteFill style={{ backgroundColor: C.navy }}>
      {blocks}
      {frame < finalStart ? (
        // 키워드와 함께 큰 도형(가로: 오른쪽, 세로: 아래쪽)
        <div
          style={{
            position: "absolute",
            left: portrait ? width / 2 - shapeSize / 2 : 1180,
            top: portrait ? height * (tall ? 0.62 : 0.66) - shapeSize / 2 : 540 - 190,
            scale: hit,
            rotate: `${-60 * (1 - hit) + (frame % BEAT) * 0.8}deg`,
          }}
        >
          <Shape kind={WORDS[idx].shape} size={shapeSize} color={WORDS[idx].color} stroke={portrait ? 18 : 22} />
        </div>
      ) : null}
      <AbsoluteFill
        style={
          portrait
            ? { padding: `${Math.round(height * 0.26)}px 60px 0`, justifyContent: "flex-start", alignItems: "center", textAlign: "center" }
            : { padding: "0 160px", justifyContent: "center" }
        }
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: MONO, fontSize: 24, letterSpacing: 5, color: C.white }}>
          04 / MISSION
          {frame >= finalStart
            ? WORDS.map((w, i) => {
                const s = finalStart + i * 3;
                return (
                  <div
                    key={w.text}
                    style={{
                      marginLeft: i === 0 ? 14 : 0,
                      scale: interpolate(frame, [s, s + 8], [0, 1], { ...CLAMP, easing: EASE_OUT }),
                    }}
                  >
                    <Shape kind={w.shape} size={30} color={w.color} stroke={4} />
                  </div>
                );
              })
            : null}
        </div>
        {frame < finalStart ? (
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: portrait ? (tall ? 180 : 160) : 220,
              letterSpacing: -9,
              color: C.white,
              marginTop: 10,
              translate: `${interpolate(frame % BEAT, [0, 7], [-60, 0], { ...CLAMP, easing: EASE_OUT })}px 0px`,
            }}
          >
            {WORDS[idx].text}
          </div>
        ) : (
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: portrait ? (tall ? 104 : 96) : 104,
              letterSpacing: -4,
              color: C.white,
              lineHeight: 1.2,
              marginTop: 10,
            }}
          >
            <div style={{ whiteSpace: "pre-line", opacity: interpolate(frame, [finalStart, finalStart + 5], [0, 1], CLAMP) }}>
              {portrait ? "부상 예방 · 기능 향상 ·\n회복으로" : "부상 예방 · 기능 향상 · 회복으로"}
            </div>
            <div
              style={{
                opacity: interpolate(frame, [finalStart + BEAT, finalStart + BEAT + 5], [0, 1], CLAMP),
                translate: `0px ${interpolate(frame, [finalStart + BEAT, finalStart + BEAT + 10], [40, 0], { ...CLAMP, easing: EASE_OUT })}px`,
              }}
            >
              <span style={{ background: C.red, color: C.white, padding: "0 18px" }}>삶의 질</span>을 높입니다.
            </div>
          </div>
        )}
      </AbsoluteFill>

      {WORDS.map((w, i) => (
        <Sfx key={w.text} name="thump" at={i * BEAT} volume={0.55} />
      ))}
      <Sfx name="whoosh" at={finalStart - 4} volume={0.45} />
      <Sfx name="impact" at={finalStart + BEAT} volume={0.45} />
    </AbsoluteFill>
  );
};
