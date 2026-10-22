import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, Series, staticFile, useCurrentFrame } from "remotion";
import { Hud } from "./components/Hud";
import { PixelWipe } from "./components/PixelWipe";
import { BootScene } from "./scenes/BootScene";
import { ExpertsScene } from "./scenes/ExpertsScene";
import { LogoScene } from "./scenes/LogoScene";
import { MissionScene } from "./scenes/MissionScene";
import { OutroScene } from "./scenes/OutroScene";
import { PainScene } from "./scenes/PainScene";
import { ProcessScene } from "./scenes/ProcessScene";
import { ProgramsScene } from "./scenes/ProgramsScene";
import { C, SCENES } from "./theme";

type Props = { music: boolean };

const ORDER = [
  { key: "boot", label: "BOOT", Comp: BootScene, light: false },
  { key: "pain", label: "PAIN POINT", Comp: PainScene, light: false },
  { key: "logo", label: "IDENTITY", Comp: LogoScene, light: false },
  { key: "experts", label: "EXPERTS", Comp: ExpertsScene, light: false },
  { key: "programs", label: "PROGRAM", Comp: ProgramsScene, light: false },
  { key: "process", label: "SYSTEM", Comp: ProcessScene, light: true },
  { key: "mission", label: "MISSION", Comp: MissionScene, light: true },
  { key: "outro", label: "CONTACT", Comp: OutroScene, light: false },
] as const;

// 픽셀 와이프를 넣을 장면 경계(해당 장면이 시작되는 지점)
const WIPE_INTO = new Set(["logo", "process", "mission", "outro"]);

const starts = ORDER.reduce<number[]>((acc, s, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + SCENES[ORDER[i - 1].key]);
  return acc;
}, []);

const HudLayer: React.FC = () => {
  const frame = useCurrentFrame();
  let i = 0;
  while (i < ORDER.length - 1 && frame >= starts[i + 1]) i++;
  return <Hud scene={ORDER[i].label} index={i + 1} light={ORDER[i].light} />;
};

export const RSportsPromo: React.FC<Props> = ({ music }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Series>
        {ORDER.map(({ key, label, Comp }) => (
          <Series.Sequence key={key} name={label} durationInFrames={SCENES[key]}>
            <Comp />
          </Series.Sequence>
        ))}
      </Series>

      <HudLayer />

      {ORDER.map(({ key }, i) =>
        WIPE_INTO.has(key) ? (
          <Sequence key={`wipe-${key}`} name={`Wipe → ${key}`} from={starts[i] - 7} durationInFrames={15}>
            <PixelWipe seed={key} color={key === "process" ? C.cream : C.accent} />
          </Sequence>
        ) : null,
      )}

      {music ? <Audio src={staticFile("bgm.wav")} /> : null}
    </AbsoluteFill>
  );
};
