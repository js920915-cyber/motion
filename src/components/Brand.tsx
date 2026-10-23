import { CanvasImage, staticFile } from "remotion";
import { C, MONO } from "../theme";

// 실제 로고. 원본(public/brand/*.png)의 여백을 잘라내고 4배로 키운 파일입니다.
// color: 흰 배경용 원색 로고 / white: 어두운 배경용 흰 글자 로고(영문 표기 없음)
// 고해상도 원본(AI·SVG)이 생기면 이 파일들만 교체하세요.
const LOGOS = {
  color: { src: "brand/rsports-logo-4x.png", w: 1944, h: 436 },
  white: { src: "brand/rsports-logo-white-4x.png", w: 1916, h: 352 },
};

export const BrandLogo: React.FC<{ width: number; variant?: keyof typeof LOGOS; style?: React.CSSProperties }> = ({
  width,
  variant = "color",
  style,
}) => {
  const logo = LOGOS[variant];
  return (
    <CanvasImage
      src={staticFile(logo.src)}
      width={Math.round(width)}
      height={Math.round((width * logo.h) / logo.w)}
      style={{ display: "block", ...style }}
    />
  );
};

// "01 / EXPERTS" 형태의 섹션 라벨
export const SectionLabel: React.FC<{ no: string; text: string; color?: string }> = ({
  no,
  text,
  color = C.accent,
}) => (
  <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 4, color, display: "flex", gap: 14 }}>
    <span>{no}</span>
    <span style={{ opacity: 0.6 }}>/</span>
    <span>{text}</span>
  </div>
);
