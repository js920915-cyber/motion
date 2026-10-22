import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";
import { C } from "../theme";

type Props = {
  // 블록이 덮였다가 사라지기까지의 총 길이(프레임)
  duration?: number;
  color?: string;
  cell?: number;
  seed?: string;
};

// 장면 전환용 픽셀 디더 블록. 절반 지점에서 화면을 완전히 덮습니다.
export const PixelWipe: React.FC<Props> = ({
  duration = 14,
  color = C.accent,
  cell = 60,
  seed = "wipe",
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  if (frame < 0 || frame > duration) return null;

  const cols = Math.ceil(width / cell);
  const rows = Math.ceil(height / cell);
  const half = duration / 2;
  const blocks: React.ReactNode[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const t = random(`${seed}-${r}-${c}`) * half;
      const on = frame < half ? frame >= t : frame - half < t;
      if (!on) continue;
      blocks.push(
        <div
          key={`${r}-${c}`}
          style={{ position: "absolute", left: c * cell, top: r * cell, width: cell + 1, height: cell + 1, background: color }}
        />,
      );
    }
  }
  return <AbsoluteFill style={{ pointerEvents: "none" }}>{blocks}</AbsoluteFill>;
};
