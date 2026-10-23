import { Video } from "@remotion/media";
import { AbsoluteFill, Img, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Sfx } from "../components/Sfx";
import { useLayout } from "../layout";
import { BEAT, C, CLAMP, EASE_OUT, MONO } from "../theme";

// 센터 현장 사진·영상(public/media). 영상은 세로 540x960 H.264로 변환해 둔 파일입니다.
const PANELS = [
  { kind: "image", src: "media/session-photo.jpg", label: "1:1 CARE" },
  { kind: "video", src: "media/balance.mp4", label: "BALANCE" },
  { kind: "video", src: "media/keiser-press.mp4", label: "POWER" },
  { kind: "video", src: "media/bar-oscillation.mp4", label: "STABILITY" },
] as const;

const GAP = 22;
const panelAt = (i: number) => Math.round(2 + (i * BEAT) / 2);

// 사진 칸 전용: 비트마다 '툭' 끊어서 다가가는 줌 + 좌우로 살짝 기울기 + 짧은 플래시
// t 는 칸이 열린 뒤 지난 프레임. 첫 박은 등장 연출에 맡기고 다음 박부터 7%씩 다가갑니다.
const PHOTO_FOCUS = "45% 30%";
const punch = (t: number) => {
  const k = Math.floor(Math.max(0, t) / BEAT);
  const e = interpolate(t - k * BEAT, [0, 6], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const tilt = (n: number) => (n === 0 ? 0 : n % 2 ? -0.8 : 0.8);
  return {
    zoom: k === 0 ? 1 : 1 + 0.07 * (k - 1 + e),
    rotate: k === 0 ? 0 : tilt(k - 1) + (tilt(k) - tilt(k - 1)) * e,
    flash: k === 0 ? 0 : interpolate(t - k * BEAT, [0, 4], [0.22, 0], CLAMP),
  };
};

const Corner: React.FC<{ pos: "tl" | "tr" | "bl" | "br" }> = ({ pos }) => {
  const top = pos[0] === "t";
  const left = pos[1] === "l";
  return (
    <div
      style={{
        position: "absolute",
        width: 22,
        height: 22,
        [top ? "top" : "bottom"]: 14,
        [left ? "left" : "right"]: 14,
        [top ? "borderTop" : "borderBottom"]: `2px solid ${C.white}`,
        [left ? "borderLeft" : "borderRight"]: `2px solid ${C.white}`,
        opacity: 0.85,
      }}
    />
  );
};

// 03. 로고 직전: 센터 현장 사진·영상을 세로 4칸으로(세로 화면에서는 2x2)
export const SessionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { w, h, portrait } = useLayout();
  const cols = portrait ? 2 : 4;
  const rows = 4 / cols;
  const maxW = w - (portrait ? 120 : 214);
  const maxH = h - (portrait ? 170 : 340);
  // 9:16 비율을 유지하면서 화면에 들어가는 가장 큰 칸 크기
  const W = Math.floor(Math.min((maxW - (cols - 1) * GAP) / cols, (((maxH - (rows - 1) * GAP) / rows) * 9) / 16));
  const H = Math.round((W * 16) / 9);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.bg,
        backgroundImage: `radial-gradient(${C.line} 1.5px, transparent 1.5px)`,
        backgroundSize: "36px 36px",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, ${W}px)`,
          gap: GAP,
        }}
      >
        {PANELS.map((p, i) => {
          const s = panelAt(i);
          return (
            <div
              key={p.src}
              style={{
                position: "relative",
                width: W,
                height: H,
                overflow: "hidden",
                background: C.bg2,
                clipPath: `inset(${interpolate(frame, [s, s + 10], [100, 0], { ...CLAMP, easing: EASE_OUT })}% 0% 0% 0%)`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  scale: interpolate(frame, [s, s + 24, s + 120], [1.18, 1.04, 1], { ...CLAMP, easing: EASE_OUT }),
                }}
              >
                {p.kind === "image" ? (
                  <>
                    <Img
                      src={staticFile(p.src)}
                      style={{
                        width: W,
                        height: H,
                        objectFit: "cover",
                        transformOrigin: PHOTO_FOCUS,
                        scale: punch(frame - s).zoom,
                        rotate: `${punch(frame - s).rotate}deg`,
                      }}
                    />
                    <div style={{ position: "absolute", inset: 0, background: C.white, opacity: punch(frame - s).flash }} />
                  </>
                ) : (
                  <Sequence from={s} layout="none">
                    <Video src={staticFile(p.src)} muted objectFit="cover" style={{ width: W, height: H }} />
                  </Sequence>
                )}
              </div>
              {/* 위쪽 그라데이션 + 라벨 */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, rgba(5,11,24,0.65) 0%, rgba(5,11,24,0) 22%, rgba(5,11,24,0) 80%, rgba(5,11,24,0.5) 100%)",
                }}
              />
              <Corner pos="tl" />
              <Corner pos="tr" />
              <Corner pos="bl" />
              <Corner pos="br" />
              <div
                style={{
                  position: "absolute",
                  top: 26,
                  left: 44,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontFamily: MONO,
                  fontSize: 17,
                  letterSpacing: 3,
                  color: C.white,
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    background: C.red,
                    opacity: Math.floor((frame - s) / (BEAT / 2)) % 2 === 0 ? 1 : 0.2,
                  }}
                />
                {String(i + 1).padStart(2, "0")} / {p.label}
              </div>
              {/* 아래쪽 블루 진행 바 */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  bottom: 0,
                  height: 5,
                  width: `${interpolate(frame, [s, s + 6 * BEAT], [0, 100], CLAMP)}%`,
                  background: i % 2 === 0 ? C.accent : C.red,
                }}
              />
            </div>
          );
        })}
      </div>

      {PANELS.map((p, i) => (
        <Sfx key={p.src} name="shutter" at={panelAt(i)} volume={0.6} />
      ))}
    </AbsoluteFill>
  );
};
