import { Easing, staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";

// 폰트는 public/fonts 에 로컬로 포함(렌더 시 네트워크 불필요)
// Pretendard (OFL) · JetBrains Mono (OFL)
export const SANS = "Pretendard";
export const MONO = "JetBrains Mono";

for (const [weight, file] of [
  ["500", "Pretendard-Medium.woff2"],
  ["700", "Pretendard-Bold.woff2"],
  ["900", "Pretendard-Black.woff2"],
] as const) {
  loadFont({ family: SANS, url: staticFile(`fonts/${file}`), weight });
}
for (const weight of ["400", "700"] as const) {
  loadFont({ family: MONO, url: staticFile(`fonts/jetbrains-mono-latin-${weight}-normal.woff2`), weight });
}

// 브랜드 컬러: R스포츠재활센터 로고(public/brand/rsports-logo.png)에서 추출한 네이비·레드 기반.
export const C = {
  bg: "#050B18",
  bg2: "#0B1630",
  line: "#18284D",
  // 로고 블루를 어두운 배경에서 잘 보이도록 밝힌 색
  accent: "#3B7FEA",
  accentDim: "#1F4FB0",
  // 로고 원색
  navy: "#0E418B",
  navyDeep: "#0A2F66",
  red: "#E7141B",
  gray: "#595757",
  white: "#F3F6FB",
  dim: "#7387AD",
  // 밝은 장면(시스템·로고) 배경과 글자
  light: "#EEF2F8",
  paper: "#FFFFFF",
  rule: "#D5DDEA",
  muted: "#5E6B82",
  ink: "#0B1220",
};

export const FPS = 30;
// 120 BPM → 1비트 = 15프레임. 음악을 바꾸면 BPM만 수정하세요.
export const BPM = 120;
export const BEAT = Math.round((60 / BPM) * FPS);

export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
export const CLAMP = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

// 장면 길이(프레임). 메인 타임라인과 개별 컴포지션이 함께 사용합니다.
export const SCENES = {
  boot: 6 * BEAT,
  pain: 8 * BEAT,
  logo: 8 * BEAT,
  experts: 10 * BEAT,
  programs: 12 * BEAT,
  process: 14 * BEAT,
  mission: 6 * BEAT,
  outro: 10 * BEAT,
} as const;

export const TOTAL = Object.values(SCENES).reduce((a, b) => a + b, 0);
