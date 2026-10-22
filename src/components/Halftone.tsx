import { useLayoutEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { C } from "../theme";

type Props = {
  mode?: "rings" | "rays";
  color?: string;
  background?: string;
  spacing?: number;
  period?: number;
  speed?: number;
  // 0~1: 중앙에서 퍼져나가는 등장 정도
  reveal?: number;
  // 중앙을 비워 둘 반경(px)
  hole?: number;
};

// 레퍼런스 영상의 '그린 하프톤 동심원' 배경. 매 프레임 캔버스로 점을 다시 그립니다.
export const Halftone: React.FC<Props> = ({
  mode = "rings",
  color = C.accent,
  background = C.bg,
  spacing = 14,
  period = 90,
  speed = 1.2,
  reveal = 1,
  hole = 0,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const ref = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = color;

    const cx = width / 2;
    const cy = height / 2;
    const maxD = Math.hypot(cx, cy);
    const front = reveal * maxD * 1.1;
    const phase = (frame * speed) / period;
    const maxR = spacing * 0.62;

    for (let y = spacing / 2; y < height; y += spacing) {
      for (let x = spacing / 2; x < width; x += spacing) {
        const dx = x - cx;
        const dy = y - cy;
        const d = Math.hypot(dx, dy);
        if (d > front || d < hole) continue;

        let v: number;
        if (mode === "rays") {
          const a = Math.atan2(dy, dx);
          v = 0.5 + 0.5 * Math.cos(a * 24 + phase * Math.PI * 2);
          v *= Math.min(1, (d - hole) / 220);
        } else {
          v = 0.5 + 0.5 * Math.cos((d / period - phase) * Math.PI * 2);
        }
        // 가장자리로 갈수록, 등장 경계 근처일수록 점이 작아짐
        const edge = Math.min(1, (front - d) / 120);
        const fall = 0.35 + 0.65 * (1 - d / maxD);
        const r = maxR * Math.pow(v, 1.4) * edge * fall;
        if (r < 0.4) continue;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, [frame, width, height, mode, color, background, spacing, period, speed, reveal, hole]);

  return (
    <canvas
      ref={ref}
      width={width}
      height={height}
      style={{ position: "absolute", inset: 0, width, height }}
    />
  );
};
