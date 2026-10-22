import { C, MONO, SANS } from "../theme";

// 임시 로고 마크. 실제 로고가 있으면 public/logo.png 로 넣고 <Img>로 교체하세요.
export const LogoMark: React.FC<{ size?: number; color?: string; ink?: string }> = ({
  size = 140,
  color = C.accent,
  ink = C.bg,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.28,
      background: color,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: SANS,
      fontWeight: 900,
      fontSize: size * 0.68,
      color: ink,
      letterSpacing: -2,
      lineHeight: 1,
      boxShadow: `0 0 ${size * 0.5}px ${color}55`,
    }}
  >
    R
  </div>
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
