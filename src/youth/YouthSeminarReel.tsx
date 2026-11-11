import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, Series, staticFile, useCurrentFrame } from "remotion";
import { PixelWipe } from "../components/PixelWipe";
import { Sfx } from "../components/Sfx";
import { ReelHud } from "./components/ReelHud";
import { CauseScene } from "./scenes/CauseScene";
import { HookScene } from "./scenes/HookScene";
import { InfoScene } from "./scenes/InfoScene";
import { PointsScene } from "./scenes/PointsScene";
import { Y, YS } from "./theme";

// 유소년 축구선수 부상예방 및 관리 설명회 — 인스타그램 릴스 15초(1080x1920)
// 0s 훅 → 3s 원인(실촬영) → 7s 핵심 3가지 → 10s 일시·장소·신청 + 로고
const ORDER = [
  { key: "hook", label: "HOOK", Comp: HookScene, light: false },
  { key: "cause", label: "CAUSE", Comp: CauseScene, light: false },
  { key: "points", label: "KEY POINTS", Comp: PointsScene, light: false },
  { key: "info", label: "JOIN US", Comp: InfoScene, light: true },
] as const;

const starts = ORDER.reduce<number[]>((acc, s, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + YS[ORDER[i - 1].key]);
  return acc;
}, []);

// 장면 경계로 들어가는 픽셀 와이프 색
const WIPES: Partial<Record<(typeof ORDER)[number]["key"], string>> = {
  cause: Y.red,
  points: Y.accent,
  info: Y.paper,
};

const HudLayer: React.FC = () => {
  const frame = useCurrentFrame();
  let i = 0;
  while (i < ORDER.length - 1 && frame >= starts[i + 1]) i++;
  return <ReelHud scene={ORDER[i].label} index={i + 1} light={ORDER[i].light} />;
};

export const YouthSeminarReel: React.FC<{ music: boolean }> = ({ music }) => (
  <AbsoluteFill style={{ backgroundColor: Y.bg }}>
    <Series>
      {ORDER.map(({ key, label, Comp }) => (
        <Series.Sequence key={key} name={label} durationInFrames={YS[key]}>
          <Comp />
        </Series.Sequence>
      ))}
    </Series>

    <HudLayer />

    {ORDER.map(({ key }, i) =>
      WIPES[key] ? (
        <Sequence key={`wipe-${key}`} name={`Wipe → ${key}`} from={starts[i] - 6} durationInFrames={13}>
          <PixelWipe seed={key} color={WIPES[key]} duration={12} cell={72} />
          <Sfx name="wipe" volume={0.5} />
        </Sequence>
      ) : null,
    )}

    {music ? <Audio src={staticFile("youth/bgm.wav")} volume={0.55} /> : null}
  </AbsoluteFill>
);
