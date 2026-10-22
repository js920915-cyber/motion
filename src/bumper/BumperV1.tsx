import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CLAMP, EASE_IN_OUT, EASE_OUT, MONO, SANS } from "../theme";

// 1단계(기준선): 레퍼런스 없이 "R스포츠재활센터 5초 범퍼 영상을 만들어 줘"라는 글만으로 만든 버전.
// 2단계에서 레퍼런스 영상을 분석해 만든 버전과 비교하기 위한 용도입니다.
const NAVY = "#0B1B2E";
const BLUE = "#2F7BFF";
const WHITE = "#F4F7FB";

export const BumperV1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({
    frame: frame - 18,
    fps,
    config: { damping: 13, stiffness: 150 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: NAVY,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* 트랙 라인이 화면을 가로지름 */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: 470 + i * 70,
            left: 0,
            height: 6,
            width: 1920,
            background: BLUE,
            opacity: 0.25 + i * 0.2,
            transformOrigin: "left center",
            scale: `${interpolate(frame, [i * 4, 22 + i * 4], [0, 1], { ...CLAMP, easing: EASE_IN_OUT })} 1`,
          }}
        />
      ))}
      <AbsoluteFill
        style={{
          backgroundColor: NAVY,
          opacity: interpolate(frame, [26, 36], [0, 0.85], CLAMP),
        }}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: 40,
        }}
      >
        <div
          style={{
            width: 170,
            height: 170,
            borderRadius: 40,
            background: BLUE,
            color: WHITE,
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 120,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            scale: pop,
            rotate: `${interpolate(pop, [0, 1], [-20, 0])}deg`,
          }}
        >
          R
        </div>
        <div>
          <div style={{ overflow: "hidden" }}>
            <div
              style={{
                fontFamily: SANS,
                fontWeight: 900,
                fontSize: 110,
                color: WHITE,
                letterSpacing: -3,
                translate: `0px ${interpolate(frame, [32, 48], [140, 0], { ...CLAMP, easing: EASE_OUT })}px`,
              }}
            >
              R스포츠재활센터
            </div>
          </div>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 24,
              letterSpacing: 6,
              color: BLUE,
              marginTop: 6,
              opacity: interpolate(frame, [52, 64], [0, 1], CLAMP),
            }}
          >
            SPORTS REHABILITATION CENTER
          </div>
        </div>
      </div>
      <AbsoluteFill
        style={{
          backgroundColor: NAVY,
          opacity: interpolate(frame, [135, 150], [0, 1], CLAMP),
        }}
      />
    </AbsoluteFill>
  );
};
