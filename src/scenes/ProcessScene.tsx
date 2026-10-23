import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SectionLabel } from "../components/Brand";
import { CaseCard } from "../components/CaseCard";
import { Shape } from "../components/Shapes";
import { Sfx } from "../components/Sfx";
import { CASES } from "../data/cases";
import { BEAT, C, CLAMP, EASE_OUT, MONO, SANS } from "../theme";

const STEPS = ["정밀 평가 · 3D 분석", "1:1 맞춤 프로그램", "기능 회복", "재발 방지"];
const stepAt = (i: number) => Math.round((0.75 + 0.5 * i) * BEAT);
const cardAt = (i: number) => (3 + i) * BEAT;
const DRAW = 3 * BEAT;
const drawAt = (i: number) => cardAt(i) + 4;

// 06. 밝은 톤 전환: 1:1 재활 시스템 4단계 + 실제 사례 4건의 회복 곡선
export const ProcessScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.light,
        backgroundImage: `radial-gradient(${C.rule} 1.5px, transparent 1.5px)`,
        backgroundSize: "36px 36px",
        padding: "108px 150px 0",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div
          style={{
            opacity: interpolate(frame, [0, 8], [0, 1], CLAMP),
            translate: `0px ${interpolate(frame, [0, 14], [30, 0], { ...CLAMP, easing: EASE_OUT })}px`,
          }}
        >
          <SectionLabel no="03" text="SYSTEM" color={C.navy} />
          <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 68, color: C.ink, letterSpacing: -3, marginTop: 8 }}>
            1:1 재활 시스템
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 12,
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 32,
            color: C.navy,
            letterSpacing: -1,
            opacity: interpolate(frame, [cardAt(0), cardAt(0) + 6], [0, 1], CLAMP),
            translate: `${interpolate(frame, [cardAt(0), cardAt(0) + 12], [40, 0], { ...CLAMP, easing: EASE_OUT })}px 0px`,
          }}
        >
          <div style={{ rotate: `${90 + frame * 0.5}deg` }}>
            <Shape kind="triangle" size={26} color={C.red} filled />
          </div>
          실제 사례로 보는 회복 곡선
        </div>
      </div>

      {/* 4단계: 번호 원 + 연결선 */}
      <div style={{ display: "flex", alignItems: "center", marginTop: 28 }}>
        {STEPS.map((s, i) => {
          const st = stepAt(i);
          return (
            <div key={s} style={{ display: "contents" }}>
              {i > 0 ? (
                <div
                  style={{
                    flex: 1,
                    height: 2,
                    margin: "0 22px",
                    background: C.navy,
                    transformOrigin: "left center",
                    scale: `${interpolate(frame, [st - 6, st], [0, 1], { ...CLAMP, easing: EASE_OUT })} 1`,
                  }}
                />
              ) : null}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  opacity: interpolate(frame, [st, st + 4], [0, 1], CLAMP),
                }}
              >
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    background: i === STEPS.length - 1 ? C.red : C.navy,
                    color: C.paper,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontFamily: MONO,
                    fontWeight: 700,
                    fontSize: 19,
                    scale: interpolate(frame, [st, st + 8], [0.3, 1], { ...CLAMP, easing: EASE_OUT }),
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 28, color: C.ink, letterSpacing: -0.5 }}>{s}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 28, marginTop: 34 }}>
        {CASES.map((c, i) => (
          <CaseCard key={c.who} data={c} index={i} start={cardAt(i)} drawFrom={drawAt(i)} drawFrames={DRAW} />
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          left: 150,
          bottom: 92,
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: 16,
          color: C.muted,
          opacity: interpolate(frame, [cardAt(0), cardAt(0) + 8], [0, 1], CLAMP),
        }}
      >
        * 실제 센터 측정 데이터 기반 · 개인정보 보호를 위해 익명 처리
      </div>

      {STEPS.map((s, i) => (
        <Sfx key={s} name="blip-low" at={stepAt(i)} volume={0.5} />
      ))}
      {CASES.map((c, i) => (
        <Sfx key={`in-${c.who}`} name="pop" at={cardAt(i)} volume={0.5} />
      ))}
      {CASES.map((c, i) => (
        <Sfx key={`done-${c.who}`} name="blip" at={drawAt(i) + DRAW} volume={0.45} />
      ))}
      <Sfx name="ding" at={drawAt(CASES.length - 1) + DRAW} volume={0.5} />
    </AbsoluteFill>
  );
};
