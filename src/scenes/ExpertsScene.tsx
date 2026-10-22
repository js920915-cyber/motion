import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SectionLabel } from "../components/Brand";
import { Typewriter } from "../components/Typewriter";
import { BEAT, C, CLAMP, EASE_OUT, MONO, SANS } from "../theme";

const CREDENTIALS = [
  { tag: "IOC", text: "국제올림픽위원회 스포츠 물리치료사" },
  { tag: "NSCA", text: "근력·컨디셔닝 전문가 (CSCS)" },
  { tag: "前", text: "SNU서울병원 스포츠재활센터 팀장" },
  { tag: "TEAM", text: "청소년 수구 국가대표팀 피지오 파견" },
];

// 04. 전문가 소개: 100% 카운터 + 자격 리스트
export const ExpertsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const count = Math.round(interpolate(frame, [BEAT, 3 * BEAT], [0, 100], { ...CLAMP, easing: EASE_OUT }));

  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.bg,
        backgroundImage: `linear-gradient(${C.line} 1px, transparent 1px), linear-gradient(90deg, ${C.line} 1px, transparent 1px)`,
        backgroundSize: "120px 120px",
        padding: "190px 160px",
        flexDirection: "row",
        alignItems: "center",
        gap: 120,
      }}
    >
      <div style={{ flex: 1 }}>
        <SectionLabel no="01" text="EXPERTS" />
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 280, color: C.accent, letterSpacing: -12, lineHeight: 1, marginTop: 30 }}>
          {count}
          <span style={{ fontSize: 140 }}>%</span>
        </div>
        <Typewriter
          text="전 직원 물리치료사"
          start={BEAT}
          speed={0.5}
          style={{ fontFamily: SANS, fontWeight: 900, fontSize: 92, color: C.white, letterSpacing: -3, marginTop: 20 }}
        />
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 22 }}>
        {CREDENTIALS.map((c, i) => {
          const s = (3 + i) * BEAT;
          return (
            <div
              key={c.tag}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 28,
                padding: "26px 32px",
                background: C.bg2,
                border: `1px solid ${C.line}`,
                borderLeft: `4px solid ${C.accent}`,
                opacity: interpolate(frame, [s, s + 5], [0, 1], CLAMP),
                translate: `${interpolate(frame, [s, s + 10], [80, 0], { ...CLAMP, easing: EASE_OUT })}px 0px`,
              }}
            >
              <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, color: C.accent, width: 80, letterSpacing: 2 }}>
                {c.tag}
              </span>
              <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 40, color: C.white, letterSpacing: -1 }}>
                {c.text}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
