import { AbsoluteFill, useCurrentFrame } from "remotion";
import { BEAT, MONO, Y } from "../theme";

// 릴스용 HUD: 기존 Hud(가로 영상)와 같은 브래킷·모노 라벨·비트 표시를 세로 화면에 맞춰 배치
const Bracket: React.FC<{ top: boolean; left: boolean; color: string }> = ({ top, left, color }) => (
  <div
    style={{
      position: "absolute",
      width: 34,
      height: 34,
      [top ? "top" : "bottom"]: 44,
      [left ? "left" : "right"]: 44,
      [top ? "borderTop" : "borderBottom"]: `3px solid ${color}`,
      [left ? "borderLeft" : "borderRight"]: `3px solid ${color}`,
    }}
  />
);

export const ReelHud: React.FC<{ light?: boolean; scene: string; index: number }> = ({ light = false, scene, index }) => {
  const frame = useCurrentFrame();
  const fg = light ? Y.ink : Y.white;
  const dim = light ? Y.muted : Y.dim;
  const beat = Math.floor(frame / BEAT) % 4;
  const label: React.CSSProperties = {
    position: "absolute",
    fontFamily: MONO,
    fontSize: 22,
    letterSpacing: 3,
    color: dim,
    textTransform: "uppercase",
    display: "flex",
    alignItems: "center",
    gap: 12,
  };

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {[true, false].map((t) => [true, false].map((l) => <Bracket key={`${t}${l}`} top={t} left={l} color={dim} />))}
      <div style={{ ...label, top: 168, left: 80 }}>
        <span style={{ border: `1.5px solid ${dim}`, padding: "4px 12px", color: fg }}>R SPORTS REHAB</span>
        <span>Youth Football Care</span>
      </div>
      <div style={{ ...label, top: 208, left: 80 }}>
        FIG. {String(index).padStart(2, "0")} — {scene}
        <span style={{ display: "flex", gap: 6, marginLeft: 8 }}>
          {[0, 1, 2, 3].map((b) => (
            <span
              key={b}
              style={{
                width: 10,
                height: 10,
                background: b === beat ? Y.red : "transparent",
                border: `1.5px solid ${b === beat ? Y.red : dim}`,
              }}
            />
          ))}
        </span>
      </div>
    </AbsoluteFill>
  );
};
