import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ICONS, IconName } from "./icon-data";

export type { IconName };

// 단색 의료·재활 아이콘. color 한 가지로 칠합니다.
export const Icon: React.FC<{ name: IconName; size: number; color: string; style?: React.CSSProperties }> = ({
  name,
  size,
  color,
  style,
}) => {
  const ic = ICONS[name];
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${ic.w} ${ic.h}`}
      style={{ display: "block", color, ...style }}
      dangerouslySetInnerHTML={{ __html: ic.body }}
    />
  );
};

type PopProps = {
  name: IconName;
  size: number;
  color: string;
  // 아이콘 중심 좌표
  x: number;
  y: number;
  // 튀어나오는 프레임
  at: number;
  rotate?: number;
  // 위아래로 떠다니는 정도(px)
  float?: number;
};

// 지정한 프레임에 스프링으로 튀어나와 천천히 떠다니는 장식 아이콘
export const PopIcon: React.FC<PopProps> = ({ name, size, color, x, y, at, rotate = 0, float = 6 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at) return null;
  const p = spring({ frame: frame - at, fps, config: { damping: 11, stiffness: 170 } });

  return (
    <div
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2,
        scale: p,
        rotate: `${rotate - 20 * (1 - p)}deg`,
        translate: `0px ${Math.sin((frame - at) / 14) * float}px`,
      }}
    >
      <Icon name={name} size={size} color={color} />
    </div>
  );
};
