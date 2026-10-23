import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SectionLabel } from "../components/Brand";
import { Icon, IconName } from "../components/Icons";
import { Sfx } from "../components/Sfx";
import { Typewriter } from "../components/Typewriter";
import { useLayout } from "../layout";
import { BEAT, C, CLAMP, EASE_OUT, MONO, SANS } from "../theme";

const PROGRAMS: { ko: string; en: string; icon: IconName }[] = [
  { ko: "근력 · 기능 향상", en: "STRENGTH", icon: "lifting" },
  { ko: "자세 · 체형 교정", en: "POSTURE", icon: "lotus" },
  { ko: "무릎 · 고관절", en: "KNEE / HIP", icon: "leg" },
  { ko: "발 · 발목 통증", en: "FOOT / ANKLE", icon: "foot" },
  { ko: "어깨 · 팔꿈치", en: "SHOULDER / ELBOW", icon: "biceps" },
  { ko: "목 · 허리 통증", en: "NECK / BACK", icon: "massage" },
  { ko: "스포츠 재활", en: "SPORTS REHAB", icon: "running" },
  { ko: "기능평가 · 3D분석", en: "3D ANALYSIS", icon: "xray" },
];

// 06. 프로그램 카드 그리드 — 반 박자마다 한 장씩 등장
export const ProgramsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const firstCard = 2 * BEAT;
  const step = BEAT / 2;
  // 모든 카드가 나온 뒤 하이라이트가 카드 위를 순서대로 훑음
  const sweepStart = firstCard + PROGRAMS.length * step + BEAT;
  const sweepStep = step / 2;
  const active = Math.floor((frame - sweepStart) / sweepStep);
  const { portrait, tall } = useLayout();
  // 세로 화면: 2열 x 4줄
  const cardH = portrait ? (tall ? 210 : 160) : 230;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.bg,
        padding: portrait ? "0 60px" : "150px 150px 140px",
        justifyContent: portrait ? "center" : "flex-start",
      }}
    >
      <SectionLabel no="02" text="PROGRAM" />
      <Typewriter
        text="부위별 1:1 맞춤 재활"
        start={4}
        speed={0.6}
        style={{ fontFamily: SANS, fontWeight: 900, fontSize: portrait ? 82 : 96, color: C.white, letterSpacing: -3, marginTop: 18 }}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${portrait ? 2 : 4}, 1fr)`,
          gap: portrait ? 20 : 26,
          marginTop: portrait ? (tall ? 48 : 34) : 56,
        }}
      >
        {PROGRAMS.map((p, i) => {
          const s = firstCard + i * step;
          const lit = active === i;
          return (
            <div
              key={p.en}
              style={{
                position: "relative",
                height: cardH,
                padding: portrait && !tall ? "22px 26px" : "28px 30px",
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
                <span style={{ color: lit ? C.white : C.accent }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ color: lit ? C.white : C.dim }}>{p.en}</span>
              </div>
              {/* 카드 내용을 나타내는 컬러 아이콘 */}
              <div
                style={{
                  position: "absolute",
                  right: portrait && !tall ? 22 : 26,
                  top: portrait && !tall ? 44 : 58,
                  scale: interpolate(frame, [s, s + 12], [0.4, 1], { ...CLAMP, easing: EASE_OUT }),
                }}
              >
                <Icon name={p.icon} size={portrait ? (tall ? 76 : 60) : 88} />
              </div>
              <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: portrait ? (tall ? 42 : 38) : 46, letterSpacing: -1.5, color: C.white }}>
                {p.ko}
              </div>
            </div>
          );
        })}
      </div>

      {PROGRAMS.map((p, i) => (
        <Sfx key={p.en} name="pop" at={firstCard + i * step} volume={0.35} />
      ))}
      {PROGRAMS.map((p, i) => (
        <Sfx key={`sweep-${p.en}`} name="tick" at={sweepStart + i * sweepStep} volume={0.45} />
      ))}
    </AbsoluteFill>
  );
};
