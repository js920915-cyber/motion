export type ShapeKind = "circle" | "triangle" | "square" | "diamond" | "plus" | "arc";

type ShapeProps = {
  kind: ShapeKind;
  size: number;
  color: string;
  filled?: boolean;
  // 화면 기준 선 두께(px)
  stroke?: number;
  dashed?: boolean;
  style?: React.CSSProperties;
};

// 기본 도형. 100x100 viewBox 안에 그려서 size 로 확대합니다.
export const Shape: React.FC<ShapeProps> = ({ kind, size, color, filled = false, stroke = 4, dashed = false, style }) => {
  const sw = (stroke * 100) / size;
  const h = filled ? 0 : sw / 2;
  const paint = filled
    ? { fill: color }
    : {
        fill: "none",
        stroke: color,
        strokeWidth: sw,
        strokeLinejoin: "round" as const,
        strokeLinecap: "round" as const,
        strokeDasharray: dashed ? `${sw * 1.6} ${sw * 2.2}` : undefined,
      };

  let el: React.ReactNode;
  switch (kind) {
    case "circle":
      el = <circle cx={50} cy={50} r={50 - h} {...paint} />;
      break;
    case "triangle":
      el = <polygon points={`50,${6 + h} ${97 - h},${88 - h} ${3 + h},${88 - h}`} {...paint} />;
      break;
    case "square":
      el = <rect x={h} y={h} width={100 - 2 * h} height={100 - 2 * h} {...paint} />;
      break;
    case "diamond":
      el = <polygon points={`50,${h} ${100 - h},50 50,${100 - h} ${h},50`} {...paint} />;
      break;
    case "plus":
      el = <path d="M37 0h26v37h37v26H63v37H37V63H0V37h37z" {...paint} />;
      break;
    case "arc":
      el = <path d={`M ${h} 50 A ${50 - h} ${50 - h} 0 0 1 ${100 - h} 50`} {...paint} fill="none" />;
      break;
  }

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible", display: "block", ...style }}>
      {el}
    </svg>
  );
};
