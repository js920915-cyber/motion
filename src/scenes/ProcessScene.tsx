import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SectionLabel } from "../components/Brand";
import { BEAT, C, CLAMP, EASE_IN_OUT, EASE_OUT, MONO, SANS } from "../theme";

const STEPS = ["정밀 평가 · 3D 분석", "1:1 맞춤 프로그램", "기능 회복", "재발 방지"];

// 회복 곡선(차트 좌표 600x360)
const CURVE = "M 0 330 C 90 330, 120 300, 170 250 S 280 120, 360 95 S 500 40, 600 30";
const CURVE_LEN = 720;

// 06. 크림 톤 전환: 1:1 재활 시스템 단계 + 회복 곡선 차트
export const ProcessScene: React.FC = () => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [BEAT, 7 * BEAT], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  const level = Math.round(draw * 100);

  return (
    <AbsoluteFill
      style={{ backgroundColor: C.cream, padding: "170px 160px", flexDirection: "row", alignItems: "center", gap: 110 }}
    >
      <div style={{ flex: 1 }}>
        <SectionLabel no="03" text="SYSTEM" color="#1E8A5A" />
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 104, color: C.ink, letterSpacing: -4, lineHeight: 1.1, marginTop: 22 }}>
          1:1 재활 시스템
        </div>
        <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 36, color: "#5C625E", marginTop: 14 }}>
          안전하고 확실한 성과를 보여드립니다.
        </div>
        <div style={{ marginTop: 50, display: "flex", flexDirection: "column", gap: 20 }}>
          {STEPS.map((s, i) => {
            const st = (1.5 * i + 1.5) * BEAT;
            return (
              <div
                key={s}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 24,
                  opacity: interpolate(frame, [st, st + 5], [0, 1], CLAMP),
                  translate: `${interpolate(frame, [st, st + 10], [-40, 0], { ...CLAMP, easing: EASE_OUT })}px 0px`,
                }}
              >
                <span style={{ fontFamily: MONO, fontSize: 24, color: "#1E8A5A", fontWeight: 700 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 46, color: C.ink, letterSpacing: -1 }}>{s}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div
        style={{
          width: 760,
          padding: 40,
          background: "#F7F5EF",
          border: "1px solid #D8D3C6",
          boxShadow: "0 30px 60px rgba(0,0,0,0.08)",
          opacity: interpolate(frame, [0, 8], [0, 1], CLAMP),
          translate: `0px ${interpolate(frame, [0, 14], [40, 0], { ...CLAMP, easing: EASE_OUT })}px`,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 18, color: "#8A8A80", letterSpacing: 2 }}>
          <span>FIG. 03 — RECOVERY CURVE</span>
          <span style={{ color: "#1E8A5A", fontWeight: 700 }}>{String(level).padStart(3, "0")}%</span>
        </div>
        <svg width={680} height={440} viewBox="-40 -20 680 440" style={{ marginTop: 26 }}>
          {[0, 1, 2, 3].map((g) => (
            <line key={g} x1={0} x2={600} y1={30 + g * 100} y2={30 + g * 100} stroke="#E2DDD0" strokeWidth={1} />
          ))}
          <line x1={0} x2={600} y1={360} y2={360} stroke={C.ink} strokeWidth={2} />
          <path
            d={CURVE}
            fill="none"
            stroke={C.ink}
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray={CURVE_LEN}
            strokeDashoffset={CURVE_LEN * (1 - draw)}
          />
          {["평가", "회복", "복귀"].map((t, i) => (
            <text key={t} x={i * 280 + 10} y={392} fontFamily={SANS} fontSize={22} fontWeight={700} fill="#5C625E">
              {t}
            </text>
          ))}
          <circle cx={600} cy={30} r={12} fill="#1E8A5A" opacity={draw >= 0.99 ? 1 : 0} />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
