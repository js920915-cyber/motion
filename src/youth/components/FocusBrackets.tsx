import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP, EASE_IN_OUT, EASE_OUT, MONO, SANS, Y } from "../theme";

// Remocn "bracket-focus"(MIT, github.com/Remocn/remocn)를 옮긴 것.
// 화면 가장자리에서 네 모서리 브래킷이 날아와 대상(무릎·발목)을 조여 잡고,
// 바깥은 어두워지며, 라벨 태그가 붙습니다. 기존 HUD 브래킷과 같은 시각 언어입니다.

type Props = {
  cx: number;
  cy: number;
  hw: number; // 잡을 영역 반폭
  hh: number; // 잡을 영역 반높이
  at?: number; // 날아오기 시작하는 프레임
  tag: string; // 영문 모노 태그(예: KNEE)
  label: string; // 국문 설명
  color?: string;
};

const CORNERS = [
  { sx: -1, sy: -1, delay: 0 },
  { sx: 1, sy: -1, delay: 2 },
  { sx: 1, sy: 1, delay: 3 },
  { sx: -1, sy: 1, delay: 5 },
] as const;

export const FocusBrackets: React.FC<Props> = ({ cx, cy, hw, hh, at = 0, tag, label, color = Y.red }) => {
  const frame = useCurrentFrame() - at;
  const { width: W, height: H, fps } = useVideoConfig();
  if (frame < 0) return null;

  const far = { hw: W / 2 - 60, hh: H / 2 - 60 };
  const loose = { hw: hw + 60, hh: hh + 50 };
  const arm = 54;
  const stroke = 6;

  const corner = (sx: number, sy: number, delay: number) => {
    const fly = interpolate(frame, [delay, 9 + delay], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
    const snap = spring({ frame: frame - 9 - delay, fps, config: { damping: 13, stiffness: 320, mass: 0.55 } });
    const w = far.hw + (loose.hw - far.hw) * fly + (hw - loose.hw) * snap;
    const h = far.hh + (loose.hh - far.hh) * fly + (hh - loose.hh) * snap;
    // 날아오는 동안은 화면 중앙 기준, 잡은 뒤엔 대상 중심 기준
    const ox = W / 2 + (cx - W / 2) * fly;
    const oy = H / 2 + (cy - H / 2) * fly;
    return { x: ox + sx * w, y: oy + sy * h };
  };

  const dim = interpolate(frame, [12, 24], [0, 0.55], { ...CLAMP, easing: EASE_OUT });
  const tagIn = interpolate(frame, [16, 26], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const pulse = 0.5 + 0.5 * Math.sin(frame / 3);

  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <mask id={`focus-${tag}`}>
          <rect width={W} height={H} fill="white" />
          <rect x={cx - hw} y={cy - hh} width={hw * 2} height={hh * 2} rx={6} fill="black" />
        </mask>
      </defs>
      <rect width={W} height={H} fill={Y.bg} opacity={dim} mask={`url(#focus-${tag})`} />

      {CORNERS.map(({ sx, sy, delay }) => {
        const p = corner(sx, sy, delay);
        return (
          <path
            key={`${sx}${sy}`}
            d={`M ${p.x} ${p.y - sy * arm} L ${p.x} ${p.y} L ${p.x - sx * arm} ${p.y}`}
            stroke={color}
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="square"
          />
        );
      })}

      {/* 중앙 조준점 */}
      <g opacity={tagIn}>
        <line x1={cx - 22} x2={cx + 22} y1={cy} y2={cy} stroke={color} strokeWidth={3} />
        <line x1={cx} x2={cx} y1={cy - 22} y2={cy + 22} stroke={color} strokeWidth={3} />
        <circle cx={cx} cy={cy} r={10 + pulse * 8} stroke={color} strokeWidth={2} fill="none" opacity={1 - pulse * 0.6} />
      </g>

      {/* 태그 */}
      <foreignObject x={cx - hw} y={cy - hh - 128} width={W} height={120} opacity={tagIn}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 10,
            transform: `translateY(${(1 - tagIn) * 16}px)`,
          }}
        >
          <span
            style={{
              fontFamily: MONO,
              fontWeight: 700,
              fontSize: 26,
              letterSpacing: 4,
              color: Y.white,
              background: color,
              padding: "6px 14px",
            }}
          >
            ● {tag}
          </span>
          <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 40, color: Y.white, textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}>
            {label}
          </span>
        </div>
      </foreignObject>
    </svg>
  );
};
