import { interpolate, useCurrentFrame } from "remotion";
import type { RehabCase } from "../data/cases";
import { C, CLAMP, EASE_IN_OUT, EASE_OUT, MONO, SANS } from "../theme";

const W = 328;
const H = 222;
const X0 = 46;
const X1 = 270;
const Y0 = 14;
const Y1 = 186;
const FADED = "#9AA6BA";

type Props = {
  data: RehabCase;
  index: number;
  // 카드가 나타나는 프레임과 그래프가 그려지는 구간(장면 기준)
  start: number;
  drawFrom: number;
  drawFrames: number;
};

// 실제 사례 카드: 좌우 근력 그래프가 그려지며 좌우 차이가 줄어드는 회복 곡선
export const CaseCard: React.FC<Props> = ({ data, index, start, drawFrom, drawFrames }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [drawFrom, drawFrom + drawFrames], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  const done = frame >= drawFrom + drawFrames;

  const all = [...data.right, ...data.left];
  const vmin = Math.min(...all);
  const vmax = Math.max(...all);
  const pad = (vmax - vmin) * 0.15;
  const n = data.right.length;
  const xs = data.right.map((_, i) => X0 + (i / (n - 1)) * (X1 - X0));
  const y = (v: number) => Y1 - ((v - (vmin - pad)) / (vmax - vmin + 2 * pad)) * (Y1 - Y0);
  const pts = (vals: number[]) => vals.map((v, i) => `${xs[i]},${y(v)}`).join(" ");
  const clipX = X0 + p * (X1 - X0) + 8;

  const gap0 = data.gap[0];
  const gapEnd = data.gap[n - 1];
  const shown = done ? data.gapLabel : `${Math.round(interpolate(p, [0, 1], [gap0, gapEnd]))}%`;

  // 첫 값은 점 왼쪽, 마지막 값은 점 오른쪽에 표시. 두 값이 가까우면 위아래로 벌림
  const label = (i: number, side: "right" | "left") => {
    const v = data[side][i];
    const other = side === "right" ? data.left[i] : data.right[i];
    const close = Math.abs(y(v) - y(other)) < 20;
    const dy = close ? (v >= other ? -4 : 17) : 6;
    const first = i === 0;
    return (
      <text
        x={xs[i] + (first ? -11 : 11)}
        y={y(v) + dy}
        textAnchor={first ? "end" : "start"}
        fontFamily={SANS}
        fontWeight={700}
        fontSize={16}
        fill={side === "right" ? C.navy : C.red}
      >
        {v}
      </text>
    );
  };

  return (
    <div
      style={{
        flex: 1,
        padding: "24px 28px 26px",
        background: C.paper,
        border: `1px solid ${C.rule}`,
        borderTop: `5px solid ${C.navy}`,
        boxShadow: "0 24px 50px rgba(14,65,139,0.10)",
        opacity: interpolate(frame, [start, start + 6], [0, 1], CLAMP),
        translate: `0px ${interpolate(frame, [start, start + 12], [50, 0], { ...CLAMP, easing: EASE_OUT })}px`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 16, letterSpacing: 2 }}>
        <span style={{ color: C.navy, fontWeight: 700 }}>CASE {String(index + 1).padStart(2, "0")}</span>
        <span style={{ color: C.muted, fontFamily: SANS, fontWeight: 500, letterSpacing: 0 }}>{data.who}</span>
      </div>
      <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 31, letterSpacing: -1, lineHeight: 1.2, marginTop: 14 }}>
        <div style={{ color: C.navy }}>{data.title[0]}</div>
        <div style={{ color: C.ink }}>{data.title[1]}</div>
      </div>

      <svg width={W} height={H} style={{ display: "block", marginTop: 14, overflow: "visible" }}>
        <defs>
          <clipPath id={`case-clip-${index}`}>
            <rect x={0} y={0} width={clipX} height={H} />
          </clipPath>
        </defs>
        {[0, 1, 2, 3].map((g) => (
          <line key={g} x1={X0} x2={X1} y1={Y0 + (g * (Y1 - Y0)) / 3} y2={Y0 + (g * (Y1 - Y0)) / 3} stroke={C.rule} strokeWidth={1} />
        ))}
        <line x1={X0} x2={X1} y1={Y1} y2={Y1} stroke={C.ink} strokeWidth={1.5} />
        <g clipPath={`url(#case-clip-${index})`}>
          {/* 좌우 차이 영역 */}
          <polygon
            points={`${pts(data.right)} ${pts(data.left).split(" ").reverse().join(" ")}`}
            fill={C.red}
            opacity={0.1}
          />
          <polyline points={pts(data.right)} fill="none" stroke={C.navy} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" />
          <polyline points={pts(data.left)} fill="none" stroke={C.red} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" />
          {xs.map((x, i) => (
            <g key={i}>
              <circle cx={x} cy={y(data.right[i])} r={5.5} fill={C.paper} stroke={C.navy} strokeWidth={3} />
              <circle cx={x} cy={y(data.left[i])} r={5.5} fill={C.paper} stroke={C.red} strokeWidth={3} />
            </g>
          ))}
        </g>
        <g opacity={interpolate(frame, [drawFrom, drawFrom + 6], [0, 1], CLAMP)}>
          {label(0, "right")}
          {label(0, "left")}
        </g>
        <g opacity={done ? 1 : 0}>
          {label(n - 1, "right")}
          {label(n - 1, "left")}
        </g>
        <text x={X0} y={H - 2} fontFamily={MONO} fontSize={13} fill={C.muted}>
          {data.dates[0]}
        </text>
        <text x={X1} y={H - 2} textAnchor="end" fontFamily={MONO} fontSize={13} fill={C.muted}>
          {data.dates[n - 1]}
        </text>
      </svg>

      <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 8, fontFamily: SANS, fontWeight: 700, fontSize: 15, color: C.muted }}>
        <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ width: 18, height: 4, background: C.navy, borderRadius: 2 }} />
          오른쪽
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ width: 18, height: 4, background: C.red, borderRadius: 2 }} />
          왼쪽
        </span>
        <span style={{ marginLeft: "auto", fontFamily: MONO, fontWeight: 400, fontSize: 13 }}>단위 {data.unit}</span>
      </div>

      <div style={{ height: 1, background: C.rule, marginTop: 16 }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
        <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 17, color: C.muted }}>좌우 근력차이</span>
        <span
          style={{
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 15,
            color: C.paper,
            background: C.navy,
            borderRadius: 999,
            padding: "3px 12px",
          }}
        >
          {data.period}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, fontFamily: SANS, fontWeight: 900, marginTop: 2 }}>
        <span style={{ fontSize: 34, color: FADED, letterSpacing: -1 }}>{gap0}%</span>
        <span style={{ fontSize: 28, color: FADED }}>→</span>
        <span style={{ fontSize: 62, color: C.navy, letterSpacing: -2 }}>{shown}</span>
      </div>
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 18, color: C.ink, marginTop: 2 }}>{data.result}</div>
    </div>
  );
};
