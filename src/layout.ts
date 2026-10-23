import { useVideoConfig } from "remotion";

// 같은 장면을 가로(1920x1080)·릴스(1080x1920)·피드(1080x1350)에서 함께 쓰기 위한 화면 정보.
// portrait: 세로 화면, tall: 릴스처럼 아주 긴 세로 화면
export const useLayout = () => {
  const { width: w, height: h } = useVideoConfig();
  const portrait = h > w;
  return { w, h, portrait, tall: h / w > 1.5 };
};

// 세로 화면 사이즈
export const REELS = { width: 1080, height: 1920 };
export const FEED = { width: 1080, height: 1350 };
