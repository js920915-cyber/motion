import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Video } from "@remotion/media";
import { CLAMP, EASE_OUT } from "../theme";

// 테마 3종이 함께 쓰는 정보·타이밍·뼈대.
// 훅·영상 문구는 테마마다 다르게(각 테마 파일의 HOOK, SHOTS), 설명회 정보는 여기 한 곳에서.

export const COPY = {
  kicker: "재활/퍼포먼스 향상을 위한",
  title: ["유소년 축구선수", "부상예방 및 관리", "설명회"],
  date: "2026.12.12 (토)",
  time: "15:00–17:00",
  place: "R스포츠재활센터 (강서구 마곡)",
  target: "학부모 · 지도자",
  apply: "인스타 프로필 링크에서 신청",
};

// 설명회에서 다루는 3가지 — 각각 짧은 영상 한 컷과 한 줄 설명으로 보여줍니다.
export const POINTS = [
  { no: "01", text: "부상 원인 이해", en: "WHY INJURIES HAPPEN", desc: "왜 다치는지, 움직임에서 찾습니다" },
  { no: "02", text: "성장기 관리", en: "GROWTH-STAGE CARE", desc: "자라는 시기에 맞는 관리법" },
  { no: "03", text: "움직임 향상", en: "BETTER MOVEMENT", desc: "더 안전하게, 더 잘 움직이도록" },
] as const;

// 훅 문구(테마마다 다른 메시지)
export type Hook = { lines: readonly string[]; punch: string; sub: string };

// 영상/사진 한 컷. 좌표는 1080x1920 화면을 가득 채웠을 때 기준.
export type Clip = { src: string; trimBefore?: number };
export type Shot = Clip & {
  lines: readonly [string, string];
  focus: { cx: number; cy: number; hw: number; hh: number; tag: string; label: string };
};

// 타이밍(프레임, 30fps). 음악 박자와 무관하게 읽는 속도 기준으로 잡았습니다.
export const T = {
  hook: 84, // 2.8초
  shot: 48, // 관절 조준 컷 1개 1.6초 × 3
  kw: 42, // 핵심 3가지 컷 1개 1.4초 × 3
  info: 135, // 4.5초
};
export const PART = {
  hook: T.hook,
  focus: T.shot * 3,
  points: T.kw * 3,
  info: T.info,
};
export const TOTAL_FRAMES = PART.hook + PART.focus + PART.points + PART.info;
// 각 파트가 시작하는 프레임(오버레이에서 현재 파트 표시용)
export const STARTS = {
  focus: PART.hook,
  points: PART.hook + PART.focus,
  info: PART.hook + PART.focus + PART.points,
};

// TransitionSeries.Transition 이 받는 presentation 타입 그대로
type Presentation = React.ComponentProps<typeof TransitionSeries.Transition>["presentation"];

// 파트 4개를 전환으로 잇는 뼈대. 전환 길이(X)만큼 앞 파트를 늘려 전체 길이가 TOTAL_FRAMES가 되게 합니다.
export const ThemeReel: React.FC<{
  scenes: [React.FC, React.FC, React.FC, React.FC];
  transitions: [Presentation, Presentation, Presentation];
  overlay?: React.ReactNode;
  music: boolean;
  bg: string;
}> = ({ scenes, transitions, overlay, music, bg }) => {
  const X = 8;
  const lens = [PART.hook + X, PART.focus + X, PART.points + X, PART.info];
  return (
    <AbsoluteFill style={{ backgroundColor: bg }}>
      <TransitionSeries>
        {scenes.map((C, i) => (
          <React.Fragment key={i}>
            <TransitionSeries.Sequence durationInFrames={lens[i]}>
              <C />
            </TransitionSeries.Sequence>
            {i < 3 ? (
              <TransitionSeries.Transition presentation={transitions[i]} timing={linearTiming({ durationInFrames: X })} />
            ) : null}
          </React.Fragment>
        ))}
      </TransitionSeries>
      {overlay}
      {music ? (
        <Audio
          src={staticFile("youth/bgm-free.wav")}
          volume={(f) => interpolate(f, [TOTAL_FRAMES - 36, TOTAL_FRAMES - 2], [0.55, 0], CLAMP)}
        />
      ) : null}
    </AbsoluteFill>
  );
};

// 사진이면 천천히 확대(켄 번즈), 영상이면 그대로 재생
export const Media: React.FC<{ clip: Clip; width?: number; height?: number; style?: React.CSSProperties }> = ({
  clip,
  width = 1080,
  height = 1920,
  style,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  if (/\.(jpe?g|png)$/i.test(clip.src)) {
    const z = interpolate(frame, [0, Math.min(durationInFrames, 90)], [1.04, 1.14], CLAMP);
    return (
      <div style={{ width, height, overflow: "hidden", ...style }}>
        <Img src={staticFile(clip.src)} style={{ width, height, objectFit: "cover", transform: `scale(${z})` }} />
      </div>
    );
  }
  return <Video src={staticFile(clip.src)} trimBefore={clip.trimBefore ?? 0} muted objectFit="cover" style={{ width, height, ...style }} />;
};

// 0→1 진행값(EASE_OUT)
export const useIn = (at: number, len = 8) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [at, at + len], [0, 1], { ...CLAMP, easing: EASE_OUT });
};

// 줄 단위로 아래에서 올라오는 글자(마스크)
export const Rise: React.FC<{ at: number; len?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  at,
  len = 8,
  children,
  style,
}) => {
  const p = useIn(at, len);
  return (
    <div style={{ overflow: "hidden", paddingBottom: 6, ...style }}>
      <div style={{ transform: `translateY(${(1 - p) * 110}%)` }}>{children}</div>
    </div>
  );
};
