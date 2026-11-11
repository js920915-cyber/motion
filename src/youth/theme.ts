import { BEAT } from "../theme";

export { BEAT, CLAMP, EASE_IN_OUT, EASE_OUT, FPS, MONO, SANS } from "../theme";

// 유소년 설명회 릴스 전용 컬러: 최신 브랜드 톤(로고의 네이비·블루·레드)
// gracious-archimedes 브랜치의 src/theme.ts 와 같은 값입니다.
export const Y = {
  bg: "#050B18",
  bg2: "#0B1630",
  line: "#18284D",
  accent: "#3B7FEA",
  navy: "#0E418B",
  red: "#E7141B",
  white: "#F3F6FB",
  dim: "#7387AD",
  paper: "#FFFFFF",
  light: "#EEF2F8",
  rule: "#D5DDEA",
  muted: "#5E6B82",
  ink: "#0B1220",
};

// 릴스 1080x1920, 15초(30비트 @120BPM)
export const REEL = { width: 1080, height: 1920 };

// 인스타 릴스 UI(상단 탭, 하단 캡션·버튼)에 가리지 않는 영역
export const SAFE = { top: 250, bottom: 1500, left: 80, right: 960 };

// 장면 길이(비트 단위로만 조정하세요)
export const YS = {
  hook: 6 * BEAT,
  cause: 8 * BEAT,
  points: 6 * BEAT,
  info: 10 * BEAT,
} as const;

export const YOUTH_TOTAL = Object.values(YS).reduce((a, b) => a + b, 0);
