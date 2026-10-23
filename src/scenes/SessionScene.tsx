import { Video } from "@remotion/media";
import { AbsoluteFill, Img, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Sfx } from "../components/Sfx";
import { BEAT, C, CLAMP, EASE_OUT, MONO } from "../theme";

// 센터 현장 사진·영상(public/media). 영상은 세로 540x960 H.264로 변환해 둔 파일입니다.
const PANELS = [
  { kind: "image", src: "media/session-photo.jpg", label: "1:1 CARE" },
  { kind: "video", src: "media/balance.mp4", label: "BALANCE" },
  { kind: "video", src: "media/keiser-press.mp4", label: "POWER" },
  { kind: "video", src: "media/bar-oscillation.mp4", label: "STABILITY" },
] as const;

const W = 410;
const H = Math.round((W * 16) / 9);
const GAP = 22;
const panelAt = (i: number) => Math.round(2 + (i * BEAT) / 2);

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

// 03. 로고 직전: 센터 현장 사진·영상을 세로 4칸으로
export const SessionScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.bg,
        backgroundImage: `radial-gradient(${C.line} 1.5px, transparent 1.5px)`,
        backgroundSize: "36px 36px",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
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
                <Img
                  src={staticFile(p.src)}
                  style={{
                    width: W,
                    height: H,
                    objectFit: "cover",
                    scale: interpolate(frame, [s, s + 8 * BEAT], [1, 1.08], CLAMP),
                  }}
                />
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
                background: "linear-gradient(180deg, rgba(5,11,24,0.65) 0%, rgba(5,11,24,0) 22%, rgba(5,11,24,0) 80%, rgba(5,11,24,0.5) 100%)",
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

      {PANELS.map((p, i) => (
        <Sfx key={p.src} name="shutter" at={panelAt(i)} volume={0.6} />
      ))}
    </AbsoluteFill>
  );
};
