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
import { FPS, SCENES, TOTAL } from "./theme";
import { YouthSeminarReel } from "./youth/YouthSeminarReel";
import { REEL, YOUTH_TOTAL } from "./youth/theme";
import { YouthReelEditorial } from "./youth/themes/Editorial";
import { YouthReelTactics } from "./youth/themes/Tactics";
import { YouthReelScan } from "./youth/themes/Scan";
import {
  ANNOUNCE_LEN,
  COUNT_LEN,
  SPEAKER_LEN,
  TOPIC_LEN,
  TRAILER_LEN,
  YouthSeriesAnnounce,
  YouthSeriesCountdown,
  YouthSeriesSpeaker,
  YouthSeriesTopic,
  YouthSeriesTrailer,
} from "./youth/series";
import { TOTAL_FRAMES } from "./youth/themes/shared";

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
      <Folder name="Youth">
        {/* 유소년 축구선수 부상예방 및 관리 설명회(2026.12.12) 릴스 15초 */}
        <Composition
          id="YouthSeminarReel"
          component={YouthSeminarReel}
          durationInFrames={YOUTH_TOTAL}
          fps={FPS}
          {...REEL}
          defaultProps={{ music: true }}
        />
        {/* 테마 3종(같은 문구, 다른 배경·연출·영상) */}
        <Composition id="YouthReelEditorial" component={YouthReelEditorial} durationInFrames={TOTAL_FRAMES} fps={FPS} {...REEL} defaultProps={{ music: true }} />
        <Composition id="YouthReelTactics" component={YouthReelTactics} durationInFrames={TOTAL_FRAMES} fps={FPS} {...REEL} defaultProps={{ music: true }} />
        <Composition id="YouthReelScan" component={YouthReelScan} durationInFrames={TOTAL_FRAMES} fps={FPS} {...REEL} defaultProps={{ music: true }} />
      </Folder>
      <Folder name="YouthSeries">
        {/* 해외 설명회·강의 홍보 레퍼런스 구성의 홍보 시리즈. 강사 영상은 src/youth/series/blocks.tsx 의 SPEAKER */}
        <Composition id="YouthSeriesTrailer" component={YouthSeriesTrailer} durationInFrames={TRAILER_LEN} fps={FPS} {...REEL} defaultProps={{ music: true }} />
        <Composition id="YouthSeriesAnnounce" component={YouthSeriesAnnounce} durationInFrames={ANNOUNCE_LEN} fps={FPS} {...REEL} defaultProps={{ music: true }} />
        {[0, 1, 2].map((t) => (
          <Composition key={t} id={`YouthSeriesTopic${t + 1}`} component={YouthSeriesTopic} durationInFrames={TOPIC_LEN} fps={FPS} {...REEL} defaultProps={{ music: true, topic: t }} />
        ))}
        <Composition id="YouthSeriesSpeaker" component={YouthSeriesSpeaker} durationInFrames={SPEAKER_LEN} fps={FPS} {...REEL} defaultProps={{ music: true }} />
        <Composition id="YouthSeriesD7" component={YouthSeriesCountdown} durationInFrames={COUNT_LEN} fps={FPS} {...REEL} defaultProps={{ music: true, days: 7 }} />
        <Composition id="YouthSeriesD1" component={YouthSeriesCountdown} durationInFrames={COUNT_LEN} fps={FPS} {...REEL} defaultProps={{ music: true, days: 1 }} />
      </Folder>
      <Folder name="Bumper">
        <Composition id="BumperV1" component={BumperV1} durationInFrames={150} fps={FPS} width={1920} height={1080} />
      </Folder>
      <Folder name="Scenes">
        <Composition id="Boot" component={BootScene} durationInFrames={SCENES.boot} fps={FPS} width={1920} height={1080} />
        <Composition id="Pain" component={PainScene} durationInFrames={SCENES.pain} fps={FPS} width={1920} height={1080} />
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
