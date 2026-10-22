import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { BEAT, C, CLAMP, EASE_OUT, MONO, SANS } from "../theme";

const WORDS = ["기능 향상", "회복", "재발 방지"];

// 07. 그린 픽셀 디더 배경 위로 비트마다 키워드 → 미션 문장
export const MissionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const idx = Math.floor(frame / BEAT);
  const finalStart = WORDS.length * BEAT;
  const cell = 48;
  // 박자마다 블록 배치가 바뀌는 디더 패턴(오른쪽으로 갈수록 밀도↑)
  const tick = Math.floor(frame / (BEAT / 2));
  const blocks: React.ReactNode[] = [];
  for (let y = 0; y < height; y += cell) {
    for (let x = 0; x < width; x += cell) {
      const density = x < width * 0.78 ? 0 : Math.pow((x - width * 0.78) / (width * 0.22), 0.8) * 0.85;
      if (random(`m-${x}-${y}-${tick}`) < density) {
        blocks.push(<div key={`${x}-${y}`} style={{ position: "absolute", left: x, top: y, width: cell, height: cell, background: C.bg }} />);
      }
    }
  }

  return (
    <AbsoluteFill style={{ backgroundColor: C.accent }}>
      {blocks}
      <AbsoluteFill style={{ padding: "0 160px", justifyContent: "center" }}>
        <div style={{ fontFamily: MONO, fontSize: 24, letterSpacing: 5, color: C.bg }}>04 / MISSION</div>
        {frame < finalStart ? (
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: 220,
              letterSpacing: -9,
              color: C.bg,
              marginTop: 10,
              translate: `${interpolate(frame % BEAT, [0, 7], [-60, 0], { ...CLAMP, easing: EASE_OUT })}px 0px`,
            }}
          >
            {WORDS[idx]}
          </div>
        ) : (
          <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 104, letterSpacing: -4, color: C.bg, lineHeight: 1.2, marginTop: 10 }}>
            <div style={{ opacity: interpolate(frame, [finalStart, finalStart + 5], [0, 1], CLAMP) }}>
              기능 향상 · 회복 · 재발 방지로
            </div>
            <div
              style={{
                opacity: interpolate(frame, [finalStart + BEAT, finalStart + BEAT + 5], [0, 1], CLAMP),
                translate: `0px ${interpolate(frame, [finalStart + BEAT, finalStart + BEAT + 10], [40, 0], { ...CLAMP, easing: EASE_OUT })}px`,
              }}
            >
              <span style={{ background: C.bg, color: C.accent, padding: "0 18px" }}>삶의 질</span>을 높입니다.
            </div>
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
