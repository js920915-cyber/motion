import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { BEAT, C, MONO } from "../theme";

const pad = (n: number) => String(n).padStart(2, "0");

const Bracket: React.FC<{ pos: "tl" | "tr" | "bl" | "br"; color: string }> = ({ pos, color }) => {
  const s = 26;
  const top = pos[0] === "t";
  const left = pos[1] === "l";
  return (
    <div
      style={{
        position: "absolute",
        width: s,
        height: s,
        [top ? "top" : "bottom"]: 36,
        [left ? "left" : "right"]: 36,
        [top ? "borderTop" : "borderBottom"]: `2px solid ${color}`,
        [left ? "borderLeft" : "borderRight"]: `2px solid ${color}`,
      }}
    />
  );
};

type Props = {
  scene: string;
  index: number;
  light?: boolean;
};

// 레퍼런스의 모서리 HUD: 브라켓, 도메인 라벨, 타임코드, 비트 카운터
export const Hud: React.FC<Props> = ({ scene, index, light = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fg = light ? C.ink : C.white;
  const dim = light ? C.muted : C.dim;
  const on = light ? C.navy : C.accent;
  const sec = Math.floor(frame / fps);
  const tc = `00:${pad(Math.floor(sec / 60))}:${pad(sec % 60)}:${pad(frame % fps)}`;
  const beat = (Math.floor(frame / BEAT) % 4) + 1;

  const label: React.CSSProperties = {
    position: "absolute",
    fontFamily: MONO,
    fontSize: 16,
    letterSpacing: 2,
    color: dim,
    textTransform: "uppercase",
  };

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <Bracket pos="tl" color={dim} />
      <Bracket pos="tr" color={dim} />
      <Bracket pos="bl" color={dim} />
      <Bracket pos="br" color={dim} />
      <div style={{ ...label, top: 46, left: 80 }}>
        <span style={{ border: `1px solid ${dim}`, padding: "3px 10px", color: fg }}>
          RSPORTS.CO.KR — 2026
        </span>
        <span style={{ marginLeft: 18 }}>Sports Rehab Film</span>
      </div>
      <div style={{ ...label, top: 46, right: 80, color: fg }}>{tc}</div>
      <div style={{ ...label, bottom: 46, left: 80 }}>
        FIG. {pad(index)} — {scene}
      </div>
      <div style={{ ...label, bottom: 46, right: 80, display: "flex", gap: 8, alignItems: "center" }}>
        BEAT
        {[1, 2, 3, 4].map((b) => (
          <span
            key={b}
            style={{
              width: 10,
              height: 10,
              background: b === beat ? on : "transparent",
              border: `1px solid ${b === beat ? on : dim}`,
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
