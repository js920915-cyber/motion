import { Composition, Folder } from "remotion";
import { BumperV1 } from "./bumper/BumperV1";
import { RSportsPromo } from "./RSportsPromo";
import { BootScene } from "./scenes/BootScene";
import { ExpertsScene } from "./scenes/ExpertsScene";
import { LogoScene } from "./scenes/LogoScene";
import { MissionScene } from "./scenes/MissionScene";
import { OutroScene } from "./scenes/OutroScene";
import { PainScene } from "./scenes/PainScene";
import { ProcessScene } from "./scenes/ProcessScene";
import { ProgramsScene } from "./scenes/ProgramsScene";
import { SessionScene } from "./scenes/SessionScene";
import { FEED, REELS } from "./layout";
import { FPS, SCENES, TOTAL } from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="RSportsPromo"
        component={RSportsPromo}
        durationInFrames={TOTAL}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{ music: true }}
      />
      <Folder name="Instagram">
        {/* 같은 장면을 세로 배치로: 릴스 9:16, 피드 게시물 4:5 */}
        <Composition id="RSportsPromoReels" component={RSportsPromo} durationInFrames={TOTAL} fps={FPS} {...REELS} defaultProps={{ music: true }} />
        <Composition id="RSportsPromoFeed" component={RSportsPromo} durationInFrames={TOTAL} fps={FPS} {...FEED} defaultProps={{ music: true }} />
      </Folder>
      <Folder name="Bumper">
        <Composition id="BumperV1" component={BumperV1} durationInFrames={150} fps={FPS} width={1920} height={1080} />
      </Folder>
      <Folder name="Scenes">
        <Composition id="Boot" component={BootScene} durationInFrames={SCENES.boot} fps={FPS} width={1920} height={1080} />
        <Composition id="Pain" component={PainScene} durationInFrames={SCENES.pain} fps={FPS} width={1920} height={1080} />
        <Composition id="Session" component={SessionScene} durationInFrames={SCENES.session} fps={FPS} width={1920} height={1080} />
        <Composition id="Logo" component={LogoScene} durationInFrames={SCENES.logo} fps={FPS} width={1920} height={1080} />
        <Composition id="Experts" component={ExpertsScene} durationInFrames={SCENES.experts} fps={FPS} width={1920} height={1080} />
        <Composition id="Programs" component={ProgramsScene} durationInFrames={SCENES.programs} fps={FPS} width={1920} height={1080} />
        <Composition id="Process" component={ProcessScene} durationInFrames={SCENES.process} fps={FPS} width={1920} height={1080} />
        <Composition id="Mission" component={MissionScene} durationInFrames={SCENES.mission} fps={FPS} width={1920} height={1080} />
        <Composition id="Outro" component={OutroScene} durationInFrames={SCENES.outro} fps={FPS} width={1920} height={1080} />
      </Folder>
    </>
  );
};
