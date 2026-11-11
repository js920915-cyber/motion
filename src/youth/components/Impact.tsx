import { Easing, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP, Y } from "../theme";

// Remocn "impact-shake"(MIT, github.com/Remocn/remocn)를 우리 장면에 맞게 옮긴 것.
// - 위에서 떨어져 바닥에 부딪히며 찌그러졌다 돌아오는 글자(SlamText)
// - 부딪히는 순간 화면 전체가 흔들리는 카메라 반동(useImpactJolt)
// - 부딪힌 직후 2~3프레임 동안 빨강/파랑으로 갈라지는 RGB 분리, 양옆으로 튀는 먼지

// 장면 전체를 감싸는 요소에 transform 으로 넣으세요.
export const useImpactJolt = (at: number, strength = 1) => {
  const frame = useCurrentFrame();
  const since = frame - at;
  if (since < 0) return "none";
  const decay = Math.exp(-since / 3.2) * strength;
  const x = decay * Math.sin(since * 2.9 + 1.3) * 34;
  const y = decay * Math.cos(since * 3.7 + 1.3) * 44;
  const r = decay * Math.sin(since * 2.3 + 2.6) * 1.4;
  return `translate(${x}px, ${y}px) rotate(${r}deg) scale(${1 + decay * 0.03})`;
};

type SlamProps = {
  at: number; // 바닥에 닿는 프레임
  fallFrames?: number;
  children: React.ReactNode;
  splitA?: string;
  splitB?: string;
  dust?: string;
  seed?: string;
  color?: string; // 글자색(자식은 color: inherit 로 두세요)
};

export const SlamText: React.FC<SlamProps> = ({
  at,
  fallFrames = 6,
  children,
  splitA = Y.red,
  splitB = Y.accent,
  dust = Y.dim,
  seed = "slam",
  color = Y.white,
}) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();
  const since = frame - at;
  const falling = since < 0;

  // 떨어지기 전에도 자리는 차지해 둡니다(위 줄들이 튀지 않도록)
  if (frame < at - fallFrames) return <div style={{ visibility: "hidden" }}>{children}</div>;

  const fall = interpolate(frame, [at - fallFrames, at], [-height * 0.5, 0], {
    ...CLAMP,
    easing: Easing.in(Easing.quad),
  });
  const stretch = falling ? interpolate(frame, [at - fallFrames, at], [1, 1.2], CLAMP) : 1;
  const squash = falling ? 0 : 1 - spring({ frame: since, fps, config: { damping: 9, stiffness: 260 } });
  const sx = falling ? 1 / Math.sqrt(stretch) : 1 + 0.14 * squash;
  const sy = falling ? stretch : 1 - 0.18 * squash;
  const split = since >= 0 && since < 3 ? (1 - since / 3) * 22 + 6 : 0;

  const layer = (dx: number, tint: string | null, key: string) => (
    <div
      key={key}
      style={{
        position: key === "main" ? "relative" : "absolute",
        inset: 0,
        transform: `translate(${dx}px, ${fall}px) scale(${sx}, ${sy})`,
        transformOrigin: "50% 100%",
        color: tint ?? color,
        mixBlendMode: tint ? "screen" : undefined,
        opacity: tint ? 0.9 : 1,
      }}
    >
      {children}
    </div>
  );

  return (
    <div style={{ position: "relative" }}>
      {split > 0 ? layer(-split, splitA, "a") : null}
      {split > 0 ? layer(split, splitB, "b") : null}
      {layer(0, null, "main")}
      <Dust since={since} color={dust} seed={seed} />
    </div>
  );
};

// 바닥(요소 아래쪽 가장자리)에서 양옆으로 튀는 먼지 조각
const Dust: React.FC<{ since: number; color: string; seed: string }> = ({ since, color, seed }) => {
  if (since < 0 || since > 22) return null;
  return (
    <div style={{ position: "absolute", left: "50%", bottom: 0, width: 0, height: 0 }}>
      {Array.from({ length: 22 }, (_, i) => {
        const k = `${seed}-${i}`;
        const side = i % 2 === 0 ? -1 : 1;
        const life = 12 + random(`${k}-l`) * 10;
        if (since > life) return null;
        const t = since / life;
        const x = side * (120 + random(`${k}-x`) * 300 + since * (8 + random(`${k}-v`) * 16));
        const y = -since * (6 + random(`${k}-u`) * 10) + since * since * 0.6;
        const s = 8 + random(`${k}-s`) * 14;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: s,
              height: s,
              background: color,
              opacity: (1 - t) * 0.8,
              transform: `rotate(${since * 30 * side}deg)`,
            }}
          />
        );
      })}
    </div>
  );
};
