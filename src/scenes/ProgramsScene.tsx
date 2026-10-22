import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SectionLabel } from "../components/Brand";
import { Typewriter } from "../components/Typewriter";
import { BEAT, C, CLAMP, EASE_OUT, MONO, SANS } from "../theme";

const PROGRAMS = [
  { ko: "근력 · 기능 향상", en: "STRENGTH" },
  { ko: "자세 · 체형 교정", en: "POSTURE" },
  { ko: "무릎 · 고관절", en: "KNEE / HIP" },
  { ko: "발 · 발목 통증", en: "FOOT / ANKLE" },
  { ko: "어깨 · 팔꿈치", en: "SHOULDER / ELBOW" },
  { ko: "목 · 허리 통증", en: "NECK / BACK" },
  { ko: "스포츠 재활", en: "SPORTS REHAB" },
  { ko: "기능평가 · 3D분석", en: "3D ANALYSIS" },
];

// 05. 프로그램 카드 그리드 — 반 박자마다 한 장씩 등장
export const ProgramsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const firstCard = 2 * BEAT;
  const step = BEAT / 2;
  // 모든 카드가 나온 뒤 하이라이트가 카드 위를 순서대로 훑음
  const sweepStart = firstCard + PROGRAMS.length * step + BEAT;
  const active = Math.floor((frame - sweepStart) / (step / 2));

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, padding: "150px 150px 140px" }}>
      <SectionLabel no="02" text="PROGRAM" />
      <Typewriter
        text="부위별 1:1 맞춤 재활"
        start={4}
        speed={0.6}
        style={{ fontFamily: SANS, fontWeight: 900, fontSize: 96, color: C.white, letterSpacing: -3, marginTop: 18 }}
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 26, marginTop: 56 }}>
        {PROGRAMS.map((p, i) => {
          const s = firstCard + i * step;
          const lit = active === i;
          return (
            <div
              key={p.en}
              style={{
                height: 230,
                padding: "28px 30px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                background: lit ? C.accent : C.bg2,
                border: `1px solid ${lit ? C.accent : C.line}`,
                opacity: interpolate(frame, [s, s + 4], [0, 1], CLAMP),
                translate: `0px ${interpolate(frame, [s, s + 10], [50, 0], { ...CLAMP, easing: EASE_OUT })}px`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 18, letterSpacing: 2 }}>
                <span style={{ color: lit ? C.bg : C.accent }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ color: lit ? C.bg : C.dim }}>{p.en}</span>
              </div>
              <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 46, letterSpacing: -1.5, color: lit ? C.bg : C.white }}>
                {p.ko}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
