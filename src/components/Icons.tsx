import { Img, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

// 컬러 3D 아이콘(public/icons/*.svg).
// 출처: Microsoft Fluent Emoji(MIT) — THIRD_PARTY_NOTICES.md 참고. 사람 아이콘은 밝은 피부톤 버전.
export type IconName =
  | "lifting" // 역기 드는 사람: 근력
  | "lotus" // 명상 자세: 자세·체형
  | "leg" // 다리: 무릎·고관절
  | "foot" // 발: 발·발목
  | "biceps" // 굽힌 팔: 어깨·팔꿈치
  | "massage" // 목·어깨 마사지: 목·허리
  | "running" // 달리는 사람: 스포츠 재활
  | "xray" // 엑스레이: 기능평가·분석
  | "shield" // 방패: 부상 예방
  | "chart" // 상승 그래프: 기능 향상
  | "mending" // 붕대 감은 하트: 회복
  | "medal" // 메달: 자격·수상
  | "stethoscope" // 청진기: 의무
  | "stopwatch" // 스톱워치: 트레이닝
  | "heart" // 뛰는 하트
  | "bandage" // 반창고
  | "sparkles" // 반짝임
  | "shoe"; // 러닝화

export const Icon: React.FC<{ name: IconName; size: number; style?: React.CSSProperties }> = ({ name, size, style }) => (
  <Img src={staticFile(`icons/${name}.svg`)} style={{ width: size, height: size, display: "block", ...style }} />
);

type PopProps = {
  name: IconName;
  size: number;
  // 아이콘 중심 좌표
  x: number;
  y: number;
  // 튀어나오는 프레임
  at: number;
  rotate?: number;
  // 위아래로 떠다니는 정도(px)
  float?: number;
};

// 지정한 프레임에 스프링으로 튀어나와 천천히 떠다니는 장식 아이콘
export const PopIcon: React.FC<PopProps> = ({ name, size, x, y, at, rotate = 0, float = 8 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at) return null;
  const p = spring({ frame: frame - at, fps, config: { damping: 11, stiffness: 170 } });

  return (
    <div
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2,
        scale: p,
        rotate: `${rotate - 20 * (1 - p)}deg`,
        translate: `0px ${Math.sin((frame - at) / 14) * float}px`,
      }}
    >
      <Icon name={name} size={size} />
    </div>
  );
};
