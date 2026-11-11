import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import { BEAT, CLAMP, EASE_OUT } from "../theme";

// 테마 3종이 함께 쓰는 문구·타이밍·뼈대.
// 문구를 바꾸면 모든 테마에 반영됩니다.

export const COPY = {
  hook: ["우리 아이는", "왜 맨날"],
  hookPunch: "다칠까요?",
  kicker: "재활/퍼포먼스 향상을 위한",
  title: ["유소년 축구선수", "부상예방 및 관리", "설명회"],
  points: [
    { no: "01", text: "부상 원인 이해", en: "WHY INJURIES HAPPEN" },
    { no: "02", text: "성장기 관리", en: "GROWTH-STAGE CARE" },
    { no: "03", text: "움직임 향상", en: "BETTER MOVEMENT" },
  ],
  date: "2026.12.12 (토)",
  time: "15:00–17:00",
  place: "R스포츠재활센터 (강서구 마곡)",
  target: "학부모 · 지도자",
  apply: "인스타 프로필 링크에서 신청",
};

// 실촬영 클립에서 조준할 관절. 좌표는 1080x1920 화면 기준(클립을 화면 가득 채웠을 때).
export type Shot = {
  src: string;
  trimBefore: number;
  lines: readonly [string, string];
  focus: { cx: number; cy: number; hw: number; hh: number; tag: string; label: string };
};

// 타이밍: 0 훅 / 3s 원인 / 7s 핵심 3가지 / 10s 정보 (120BPM 30비트 = 15초)
export const T = {
  hook: 6 * BEAT,
  cause: 8 * BEAT,
  shot: 4 * BEAT,
  points: 6 * BEAT,
  info: 10 * BEAT,
  step: 2 * BEAT, // 핵심 3가지 간격
};
export const TOTAL_FRAMES = T.hook + T.cause + T.points + T.info;

// 장면 4개를 전환으로 잇는 뼈대. 전환 길이(X)만큼 앞 장면을 늘려
// 다음 장면이 정확히 비트 경계(3s·7s·10s)에서 시작하고 전체가 15초가 되게 합니다.
// TransitionSeries.Transition 이 받는 presentation 타입 그대로
type Presentation = React.ComponentProps<typeof TransitionSeries.Transition>["presentation"];

export const ThemeReel: React.FC<{
  scenes: [React.FC, React.FC, React.FC, React.FC];
  transitions: [Presentation, Presentation, Presentation];
  overlay?: React.ReactNode;
  music: boolean;
  bg: string;
}> = ({ scenes, transitions, overlay, music, bg }) => {
  const X = 8;
  const lens = [T.hook + X, T.cause + X, T.points + X, T.info];
  const [Hook, Cause, Points, Info] = scenes;
  const comps = [Hook, Cause, Points, Info];
  return (
    <AbsoluteFill style={{ backgroundColor: bg }}>
      <TransitionSeries>
        {comps.map((C, i) => (
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
      {music ? <Audio src={staticFile("youth/bgm.wav")} volume={0.55} /> : null}
    </AbsoluteFill>
  );
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
