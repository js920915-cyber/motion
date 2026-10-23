import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SectionLabel } from "../components/Brand";
import { PopShape, Shape, ShapeKind } from "../components/Shapes";
import { Sfx } from "../components/Sfx";
import { Typewriter } from "../components/Typewriter";
import { useLayout } from "../layout";
import { BEAT, C, CLAMP, EASE_OUT, MONO, SANS } from "../theme";

const CREDENTIALS: { tag: string; text: string; shape: ShapeKind }[] = [
  { tag: "IOC", text: "올림픽 위원회 인증 스포츠 물리치료사", shape: "circle" },
  { tag: "NSCA", text: "근력·컨디셔닝 전문가 (CSCS)", shape: "triangle" },
  { tag: "TEAM", text: "국가대표 의무트레이너", shape: "square" },
  { tag: "TEAM", text: "국가대표 피지컬트레이너", shape: "diamond" },
];

const COUNT_FROM = BEAT;
const COUNT_TO = 3 * BEAT;

const countAt = (f: number) =>
  Math.round(interpolate(f, [COUNT_FROM, COUNT_TO], [0, 100], { ...CLAMP, easing: EASE_OUT }));

// 숫자가 바뀌는 프레임에만(최소 2프레임 간격) 틱 소리
const TICKS: number[] = [];
for (let f = COUNT_FROM + 1; f <= COUNT_TO; f++) {
  if (countAt(f) !== countAt(f - 1) && (TICKS.length === 0 || f - TICKS[TICKS.length - 1] >= 2)) TICKS.push(f);
}

// 원형 게이지 + 100% 카운터. size 는 게이지 지름(px)
const Gauge: React.FC<{ size: number; count: number; on: boolean }> = ({ size, count, on }) => {
  const r = size * 0.45;
  const sw = size * 0.045;
  const circ = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ position: "absolute", inset: 0 }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.line} strokeWidth={sw} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={C.accent}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - count / 100)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        {/* 게이지 끝을 따라 도는 레드 점 */}
        <circle
          cx={size / 2 + r * Math.sin((count / 100) * 2 * Math.PI)}
          cy={size / 2 - r * Math.cos((count / 100) * 2 * Math.PI)}
          r={size * 0.035}
          fill={C.red}
          opacity={on ? 1 : 0}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: size * 0.335,
          color: C.white,
          letterSpacing: -6,
        }}
      >
        {count}
        <span style={{ fontSize: size * 0.175, color: C.accent }}>%</span>
      </div>
    </div>
  );
};

// 05. 전문가 소개: 원형 게이지 100% 카운터 + 자격 리스트
export const ExpertsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const count = countAt(frame);
  const { w, h, portrait, tall } = useLayout();
  const title = (
    <Typewriter
      text={portrait ? "전 직원\n물리치료사" : "전 직원 물리치료사"}
      start={BEAT}
      speed={0.5}
      style={{ fontFamily: SANS, fontWeight: 900, fontSize: 84, lineHeight: 1.15, color: C.white, letterSpacing: -3, marginTop: portrait ? 20 : 30 }}
    />
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.bg,
        backgroundImage: `linear-gradient(${C.line} 1px, transparent 1px), linear-gradient(90deg, ${C.line} 1px, transparent 1px)`,
        backgroundSize: "120px 120px",
        padding: portrait ? "0 60px" : "150px 150px",
        flexDirection: portrait ? "column" : "row",
        alignItems: portrait ? "stretch" : "center",
        justifyContent: "center",
        gap: portrait ? (tall ? 70 : 44) : 90,
      }}
    >
      <PopShape kind="plus" x={0.932 * w} y={0.157 * h} size={40} color={C.red} filled at={BEAT} spin={0.5} />
      <PopShape kind="circle" x={0.068 * w} y={0.861 * h} size={70} color={C.accentDim} stroke={5} at={2 * BEAT} />

      {portrait ? (
        // 세로: 게이지 옆에 라벨과 제목
        <div style={{ display: "flex", alignItems: "center", gap: 44 }}>
          <Gauge size={tall ? 340 : 300} count={count} on={frame >= COUNT_FROM} />
          <div>
            <SectionLabel no="01" text="EXPERTS" />
            {title}
          </div>
        </div>
      ) : (
        <div style={{ width: 640 }}>
          <SectionLabel no="01" text="EXPERTS" />
          <div style={{ marginTop: 34 }}>
            <Gauge size={400} count={count} on={frame >= COUNT_FROM} />
          </div>
          {title}
        </div>
      )}

      <div style={{ flex: portrait ? undefined : 1, display: "flex", flexDirection: "column", gap: portrait ? 18 : 22 }}>
        {CREDENTIALS.map((c, i) => {
          const s = (3 + i) * BEAT;
          return (
            <div
              key={c.text}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 26,
                padding: "26px 32px",
                background: C.bg2,
                border: `1px solid ${C.line}`,
                borderLeft: `4px solid ${C.accent}`,
                opacity: interpolate(frame, [s, s + 5], [0, 1], CLAMP),
                translate: `${interpolate(frame, [s, s + 10], [80, 0], { ...CLAMP, easing: EASE_OUT })}px 0px`,
              }}
            >
              <div style={{ rotate: `${interpolate(frame, [s, s + 12], [-90, 0], { ...CLAMP, easing: EASE_OUT })}deg` }}>
                <Shape kind={c.shape} size={30} color={i === 0 ? C.red : C.accent} filled />
              </div>
              <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, color: C.accent, width: 74, letterSpacing: 2 }}>
                {c.tag}
              </span>
              <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 38, color: C.white, letterSpacing: -1 }}>
                {c.text}
              </span>
            </div>
          );
        })}
      </div>

      {TICKS.map((f) => (
        <Sfx key={f} name="tick" at={f} volume={0.5} />
      ))}
      <Sfx name="ding" at={COUNT_TO} volume={0.45} />
      {CREDENTIALS.map((c, i) => (
        <Sfx key={c.text} name="blip" at={(3 + i) * BEAT} volume={0.45} />
      ))}
    </AbsoluteFill>
  );
};
