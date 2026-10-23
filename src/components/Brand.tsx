import { CanvasImage, staticFile } from "remotion";
import { C, MONO } from "../theme";

// 실제 로고. 원본(public/brand/rsports-logo.png)의 여백을 잘라내고 4배로 키운 파일입니다.
// 고해상도 원본(AI·SVG)이 생기면 이 파일만 교체하세요.
const LOGO_W = 1944;
const LOGO_H = 436;

export const BrandLogo: React.FC<{ width: number; style?: React.CSSProperties }> = ({ width, style }) => (
  <CanvasImage
    src={staticFile("brand/rsports-logo-4x.png")}
    width={Math.round(width)}
    height={Math.round((width * LOGO_H) / LOGO_W)}
    style={{ display: "block", ...style }}
  />
);

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
