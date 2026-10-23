import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SectionLabel } from "../components/Brand";
import { CaseCard } from "../components/CaseCard";
import { Shape } from "../components/Shapes";
import { Sfx } from "../components/Sfx";
import { CASES } from "../data/cases";
import { useLayout } from "../layout";
import { BEAT, C, CLAMP, EASE_OUT, MONO, SANS } from "../theme";

const STEPS = ["정밀 평가 · 3D 분석", "1:1 맞춤 프로그램", "기능 회복", "부상 예방"];
const stepAt = (i: number) => Math.round((0.75 + 0.5 * i) * BEAT);
const cardAt = (i: number) => (3 + i) * BEAT;
const DRAW = 3 * BEAT;
const drawAt = (i: number) => cardAt(i) + 4;

// 세로 화면에서 사례 카드 2x2 묶음의 원래 크기(카드 1장 약 386x585)
const GRID_W = 2 * 386 + 24;
const GRID_H = 2 * 585 + 24;

const StepDot: React.FC<{ i: number; st: number; size: number }> = ({ i, st, size }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        flexShrink: 0,
        background: i === STEPS.length - 1 ? C.red : C.navy,
        color: C.paper,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: MONO,
        fontWeight: 700,
        fontSize: size * 0.38,
        scale: interpolate(frame, [st, st + 8], [0.3, 1], { ...CLAMP, easing: EASE_OUT }),
      }}
    >
      {String(i + 1).padStart(2, "0")}
    </div>
  );
};

// 07. 밝은 톤 전환: 1:1 재활 시스템 4단계 + 실제 사례 4건의 회복 곡선
export const ProcessScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { w, h, portrait, tall } = useLayout();
  // 세로 화면: 카드 2x2 묶음을 남는 공간에 맞게 축소/확대
  const gridScale = Math.min((w - 120) / GRID_W, (h - (tall ? 880 : 520)) / GRID_H);

  const subtitle = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        marginBottom: portrait ? 0 : 12,
        marginTop: portrait ? 12 : 0,
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: portrait ? 30 : 32,
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
  );

  const footnote = (
    <div
      style={{
        fontFamily: SANS,
        fontWeight: 500,
        fontSize: 16,
        color: C.muted,
        opacity: interpolate(frame, [cardAt(0), cardAt(0) + 8], [0, 1], CLAMP),
        ...(portrait ? { marginTop: 18, textAlign: "center" as const } : { position: "absolute" as const, left: 150, bottom: 92 }),
      }}
    >
      * 실제 센터 측정 데이터 기반 · 개인정보 보호를 위해 익명 처리
    </div>
  );

  const cards = CASES.map((c, i) => (
    <CaseCard key={c.who} data={c} index={i} start={cardAt(i)} drawFrom={drawAt(i)} drawFrames={DRAW} />
  ));

  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.light,
        backgroundImage: `radial-gradient(${C.rule} 1.5px, transparent 1.5px)`,
        backgroundSize: "36px 36px",
        // 릴스는 아래쪽 자막·버튼 영역을 피해 조금 위로 올림
        padding: portrait ? (tall ? "0 60px 200px" : "0 60px") : "108px 150px 0",
        justifyContent: portrait ? "center" : "flex-start",
      }}
    >
      <div style={{ display: "flex", flexDirection: portrait ? "column" : "row", justifyContent: "space-between", alignItems: portrait ? "flex-start" : "flex-end" }}>
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
        {subtitle}
      </div>

      {portrait ? (
        // 세로: 4단계를 2x2 알약 모양으로, 아래 사례 카드 열과 같은 폭·같은 가운데에 맞춤
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: `12px ${24 * gridScale}px`,
            width: Math.max(GRID_W * gridScale, tall ? 0 : 640),
            alignSelf: "center",
            marginTop: 26,
          }}
        >
          {STEPS.map((s, i) => {
            const st = stepAt(i);
            return (
              <div
                key={s}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  padding: "7px 16px 7px 8px",
                  background: C.paper,
                  border: `1px solid ${C.rule}`,
                  borderRadius: 999,
                  opacity: interpolate(frame, [st, st + 4], [0, 1], CLAMP),
                }}
              >
                <StepDot i={i} st={st} size={tall ? 40 : 34} />
                <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: tall ? 24 : 21, color: C.ink, letterSpacing: -0.5 }}>{s}</span>
              </div>
            );
          })}
        </div>
      ) : (
        // 가로: 번호 원 + 연결선
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
                <div style={{ display: "flex", alignItems: "center", gap: 14, opacity: interpolate(frame, [st, st + 4], [0, 1], CLAMP) }}>
                  <StepDot i={i} st={st} size={50} />
                  <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 28, color: C.ink, letterSpacing: -0.5 }}>{s}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {portrait ? (
        <div style={{ width: GRID_W * gridScale, height: GRID_H * gridScale, marginTop: 30, alignSelf: "center" }}>
          <div
            style={{
              width: GRID_W,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 24,
              scale: gridScale,
              transformOrigin: "top left",
            }}
          >
            {cards}
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 28, marginTop: 34 }}>{cards}</div>
      )}

      {footnote}

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
