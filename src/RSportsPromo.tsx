import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, Series, staticFile, useCurrentFrame } from "remotion";
import { Hud } from "./components/Hud";
import { PixelWipe } from "./components/PixelWipe";
import { Sfx } from "./components/Sfx";
import { BootScene } from "./scenes/BootScene";
import { ExpertsScene } from "./scenes/ExpertsScene";
import { LOGO_IRIS, LogoScene } from "./scenes/LogoScene";
import { MissionScene } from "./scenes/MissionScene";
import { OutroScene } from "./scenes/OutroScene";
import { PainScene } from "./scenes/PainScene";
import { ProcessScene } from "./scenes/ProcessScene";
import { ProgramsScene } from "./scenes/ProgramsScene";
import { SessionScene } from "./scenes/SessionScene";
import { C, SCENES } from "./theme";

type Props = { music: boolean };

// lightFrom: 장면 시작 기준으로 HUD가 밝은 배경용(네이비 글자)으로 바뀌는 프레임. null 이면 어두운 배경용.
const ORDER = [
  { key: "boot", label: "BOOT", Comp: BootScene, lightFrom: null },
  { key: "pain", label: "PAIN POINT", Comp: PainScene, lightFrom: null },
  { key: "session", label: "IN SESSION", Comp: SessionScene, lightFrom: null },
  { key: "logo", label: "IDENTITY", Comp: LogoScene, lightFrom: LOGO_IRIS + 6 },
  { key: "experts", label: "EXPERTS", Comp: ExpertsScene, lightFrom: null },
  { key: "programs", label: "PROGRAM", Comp: ProgramsScene, lightFrom: null },
  { key: "process", label: "SYSTEM", Comp: ProcessScene, lightFrom: 0 },
  { key: "mission", label: "MISSION", Comp: MissionScene, lightFrom: null },
  { key: "outro", label: "CONTACT", Comp: OutroScene, lightFrom: null },
] as const;

// 장면 경계(해당 장면이 시작되는 지점)의 픽셀 와이프 색. 없는 경계는 휙 소리만 넣습니다.
const WIPE_INTO: Partial<Record<(typeof ORDER)[number]["key"], string>> = {
  logo: C.accent,
  process: C.light,
  mission: C.navy,
  outro: C.accent,
};

const starts = ORDER.reduce<number[]>((acc, s, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + SCENES[ORDER[i - 1].key]);
  return acc;
}, []);

const HudLayer: React.FC = () => {
  const frame = useCurrentFrame();
  let i = 0;
  while (i < ORDER.length - 1 && frame >= starts[i + 1]) i++;
  const { lightFrom } = ORDER[i];
  const light = lightFrom !== null && frame - starts[i] >= lightFrom;
  return <Hud scene={ORDER[i].label} index={i + 1} light={light} />;
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

      {ORDER.map(({ key }, i) => {
        if (i === 0) return null;
        const color = WIPE_INTO[key];
        return color ? (
          <Sequence key={`wipe-${key}`} name={`Wipe → ${key}`} from={starts[i] - 7} durationInFrames={15}>
            <PixelWipe seed={key} color={color} />
            <Sfx name="wipe" volume={0.6} />
          </Sequence>
        ) : (
          <Sfx key={`whoosh-${key}`} name="whoosh" at={starts[i] - 6} volume={0.4} />
        );
      })}

      {music ? <Audio src={staticFile("bgm.wav")} volume={0.7} /> : null}
    </AbsoluteFill>
  );
};
