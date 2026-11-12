import { Audio, Video } from "@remotion/media";
import { AbsoluteFill, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP, SANS } from "../theme";

// R4 형식(드라이브 '릴스_R4_측정으로 찾는 운동'을 그대로 따른 레이아웃)
//  검정 배경 / 위: 센터 로고 + 제목 2줄(흰 줄 + 빨간 줄, 핵심어 따옴표)
//  가운데: 가로 영상 띠(1080x608) / 아래: 흰 자막 한 줄 / 그 아래 Return to Sports 로고
//  중간에 유튜브·인스타 채널 배지 / 끝: R4 원본 엔딩(Rehab → Running → Return to Sports → 로고)
// 위치 값은 R4 원본(1080x1920)에서 측정했습니다.

const RED = "#E8202A";
const L = {
  logoTop: 258,
  titleTop: 360,
  bandTop: 657,
  bandH: 608,
  subTop: 1290,
  rtsTop: 1488,
};
const OUTRO = 182; // R4 원본 엔딩 길이(6.07초)

// 배경음악: 드라이브 '음원' 폴더에서 받은 곡(public/youth/music/). from = 곡의 몇 초부터 쓸지
export type Music = { src: string; from: number };
export const MAIN_MUSIC: Music = { src: "youth/music/main-track.m4a", from: 0 }; // videoplayback (1).m4a — 0~11초 잔잔한 도입, 11.5초부터 메인 구간
export const CURRICULUM_MUSIC: Music = { src: "youth/music/before-and-after.m4a", from: 8 }; // Before And After — 8초부터 고조, 16초부터 본 구간

// 한 문장(자막) = 한 beat. clips 가 2~3개면 문장 길이를 나눠 컷을 바꿉니다(긴 문장도 화면이 지루하지 않게).
export type Beat = { clips: string[]; text: string; len: number };

// 컷 사이 디졸브 길이(프레임)와 컷마다 천천히 확대되는 정도
const DISSOLVE = 6;
const ZOOM = 0.07;
// 확대 기준점을 컷마다 살짝 바꿔 단조롭지 않게(모두 화면 가운데 근처)
const ORIGINS = ["50% 50%", "42% 55%", "58% 45%", "50% 60%"];

type Shot = { clip: string; start: number; len: number };
export const toShots = (beats: Beat[]): Shot[] => {
  const shots: Shot[] = [];
  let t = 0;
  for (const b of beats) {
    const n = b.clips.length;
    b.clips.forEach((clip, i) => {
      const a = Math.round((b.len * i) / n);
      const z = Math.round((b.len * (i + 1)) / n);
      shots.push({ clip, start: t + a, len: z - a });
    });
    t += b.len;
  }
  return shots;
};

const ShotView: React.FC<{ clip: string; len: number; fadeIn: boolean; origin: string }> = ({ clip, len, fadeIn, origin }) => {
  const frame = useCurrentFrame();
  const o = fadeIn ? interpolate(frame, [0, DISSOLVE], [0, 1], CLAMP) : 1;
  const z = 1 + interpolate(frame, [0, len], [0, ZOOM], CLAMP);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, transform: `scale(${z})`, transformOrigin: origin }}>
      <Video src={staticFile(`youth/band/${clip}.mp4`)} muted objectFit="cover" style={{ width: 1080, height: L.bandH }} />
    </div>
  );
};

// 나레이션 중 배경음악 크기(0~1). 목소리가 묻히면 낮추고, 음악이 너무 작으면 올리세요.
const MUSIC_UNDER_VOICE = 0.2;

// 가운데 영상 띠: 컷마다 천천히 줌인, 컷 사이 짧은 디졸브(앞 컷 위로 다음 컷이 6프레임 동안 겹쳐 나타남)
const Band: React.FC<{ beats: Beat[] }> = ({ beats }) => (
  <div style={{ position: "absolute", left: 0, top: L.bandTop, width: 1080, height: L.bandH, overflow: "hidden", background: "#111" }}>
    {toShots(beats).map((s, i) => {
      const lead = i === 0 ? 0 : DISSOLVE;
      return (
        <Sequence key={i} from={s.start - lead} durationInFrames={s.len + lead} layout="none">
          <ShotView clip={s.clip} len={s.len + lead} fadeIn={lead > 0} origin={ORIGINS[i % ORIGINS.length]} />
        </Sequence>
      );
    })}
  </div>
);

const Subtitles: React.FC<{ beats: Beat[] }> = ({ beats }) => {
  let from = 0;
  return (
    <>
      {beats.map((b, i) => {
        const el = (
          <Sequence key={i} from={from} durationInFrames={b.len} layout="none">
            <Sub text={b.text} />
          </Sequence>
        );
        from += b.len;
        return el;
      })}
    </>
  );
};

const Sub: React.FC<{ text: string }> = ({ text }) => {
  const o = interpolate(useCurrentFrame(), [0, 3], [0, 1], CLAMP);
  return (
    <div
      style={{
        position: "absolute",
        top: L.subTop,
        left: 60,
        right: 60,
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 700,
        fontSize: 50,
        lineHeight: 1.3,
        letterSpacing: "-0.02em",
        color: "#FFFFFF",
        opacity: o,
        whiteSpace: "pre-line",
      }}
    >
      {text}
    </div>
  );
};

// 유튜브·인스타 채널 배지(R4 중간에 나오는 것)
const ChannelBadge: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 14, stiffness: 200 } });
  const row = (icon: React.ReactNode, label: string) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.92)", borderRadius: 999, padding: "4px 14px 4px 6px", fontFamily: SANS, fontWeight: 700, fontSize: 22, color: "#111" }}>
      {icon}
      {label}
    </div>
  );
  return (
    <div style={{ position: "absolute", top: L.bandTop + 18, right: 18, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, transform: `scale(${s})`, transformOrigin: "right top" }}>
      <div style={{ background: "rgba(20,20,20,0.85)", borderRadius: 8, padding: "6px 14px" }}>
        <Img src={staticFile("brand/rsports-logo-white-4x.png")} style={{ width: 210, height: (210 * 352) / 1916, display: "block" }} />
      </div>
      {row(
        <svg width={30} height={22} viewBox="0 0 30 22">
          <rect width={30} height={22} rx={6} fill="#FF0000" />
          <path d="M12 6 L20 11 L12 16 Z" fill="#fff" />
        </svg>,
        "R스포츠재활센터",
      )}
      {row(
        <svg width={24} height={24} viewBox="0 0 24 24">
          <defs>
            <linearGradient id="ig" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor="#FEDA75" />
              <stop offset="0.5" stopColor="#D62976" />
              <stop offset="1" stopColor="#4F5BD5" />
            </linearGradient>
          </defs>
          <rect width={24} height={24} rx={7} fill="url(#ig)" />
          <rect x={6} y={6} width={12} height={12} rx={4} fill="none" stroke="#fff" strokeWidth={2} />
          <circle cx={17.5} cy={6.5} r={1.2} fill="#fff" />
        </svg>,
        "@rsports_center",
      )}
    </div>
  );
};

// 제목: 1줄 흰색, 2줄 빨간색. 2줄 안의 '따옴표' 부분이 핵심어.
const Title: React.FC<{ lines: [string, string] }> = ({ lines }) => (
  <div style={{ position: "absolute", top: L.titleTop, left: 40, right: 40, textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 96, lineHeight: 1.42, letterSpacing: "-0.03em" }}>
    <div style={{ color: "#FFFFFF" }}>{lines[0]}</div>
    <div style={{ color: RED }}>{lines[1]}</div>
  </div>
);

export const R4Reel: React.FC<{
  title: [string, string];
  beats: Beat[];
  badgeAt?: number;
  music: boolean;
  narration?: string;
  track?: Music;
}> = ({ title, beats, badgeAt, music, narration, track }) => {
  const { durationInFrames } = useVideoConfig();
  const body = beats.reduce((a, b) => a + b.len, 0);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Sequence durationInFrames={body} layout="none">
        <Img src={staticFile("brand/rsports-logo-white-4x.png")} style={{ position: "absolute", top: L.logoTop, left: (1080 - 330) / 2, width: 330, height: (330 * 352) / 1916 }} />
        <Title lines={title} />
        <Band beats={beats} />
        <Subtitles beats={beats} />
        <Img src={staticFile("youth/r4/return-to-sports.png")} style={{ position: "absolute", top: L.rtsTop, left: (1080 - 330) / 2, width: 330, height: 180 }} />
        {badgeAt !== undefined ? (
          <Sequence from={badgeAt} durationInFrames={120} layout="none">
            <ChannelBadge />
          </Sequence>
        ) : null}
      </Sequence>
      <Sequence from={body} durationInFrames={OUTRO}>
        <Video src={staticFile("youth/r4/outro.mp4")} muted style={{ width: 1080, height: 1920 }} />
      </Sequence>
      {/* 나레이션(Higgsfield · ElevenLabs 엔진 · 'Dylan' 프리셋 목소리). 자막 길이(beats.len)는 문장 사이 쉼에 맞춰 잘랐습니다. */}
      {narration ? <Audio src={staticFile(narration)} volume={0.85} /> : null}
      {music && track ? (
        <Audio
          src={staticFile(track.src)}
          trimBefore={Math.round(track.from * 30)}
          // 나레이션 중에는 낮게, 엔딩 로고에서 올렸다가(0.4) 끝에서 페이드아웃
          volume={(f) => interpolate(f, [0, 6, body - 10, body + 10, durationInFrames - 40, durationInFrames - 2], [0, MUSIC_UNDER_VOICE, MUSIC_UNDER_VOICE, 0.4, 0.4, 0], CLAMP)}
        />
      ) : null}
    </AbsoluteFill>
  );
};

export const r4Length = (beats: Beat[]) => beats.reduce((a, b) => a + b.len, 0) + OUTRO;

// ── 메인 홍보영상(약 40초 = 나레이션 34.6초 + 엔딩 6초) ──────────────
// len = 나레이션(public/youth/narration/main.mp3)에서 문장 사이 쉼의 가운데까지(프레임, 30fps)
export const MAIN_TITLE: [string, string] = ["유소년 축구선수", "'부상예방' 설명회"];
export const MAIN_BEATS: Beat[] = [
  { clips: ["dribble-a"], text: "학부모님, 지도자님.\n이런 고민 있으신가요?", len: 96 },
  { clips: ["dribble-b"], text: "“우리 아이는 왜 맨날 다칠까요?”", len: 72 },
  { clips: ["talk-r1-a", "blazepod-front-a"], text: "12월 12일, R스포츠재활센터가\n그 답을 함께 찾습니다", len: 144 },
  { clips: ["dribble-c", "slj-a"], text: "1. 유소년 선수는 왜 성인과\n다르게 접근해야 하는지", len: 108 },
  { clips: ["plate-jump-a"], text: "2. 부상은 왜 반복되는지", len: 59 },
  { clips: ["hexbar-a"], text: "3. 어린 나이에 근력운동,\n해도 괜찮은지", len: 84 },
  { clips: ["ladder-coach"], text: "4. 개인별 부상 예방과\n퍼포먼스 프로그램", len: 84 },
  { clips: ["plate-coach-a", "nonmotor-a"], text: "5. 그리고 R스포츠재활센터의\n선수 관리 시스템까지", len: 108 },
  { clips: ["keiser-a", "blazepod-side-a", "bosu-a"], text: "12.12(토) 오후 3시, 강서구 마곡\nR스포츠재활센터에서 만나요", len: 180 },
  { clips: ["talk-r5-a", "slj-b"], text: "신청은 인스타그램 프로필 링크에서", len: 102 },
];

// ── 커리큘럼 5편(각 약 17~19초) ──────────────────────────────
// 드라이브 '유소년 설명회' 폴더 영상만 사용. 한 편 안에서는 같은 구간을 다시 쓰지 않고,
// 전체에서도 같은 구간은 최대 2번. 'talk-*', 'xray-*' = 기존 릴스의 설명하는 장면(편마다 1~2초씩)
const CTA = "12.12(토) 오후 3시\n신청은 프로필 링크에서";
export const CURRICULUM: { title: [string, string]; beats: Beat[] }[] = [
  {
    title: ["유소년 선수는 왜", "'다르게' 접근할까?"],
    beats: [
      { clips: ["blazepod-side-b"], text: "같은 축구, 같은 훈련이라도", len: 67 },
      { clips: ["hexbar-c", "slj-c"], text: "유소년 선수는 성인과\n다르게 접근해야 합니다", len: 110 },
      { clips: ["talk-r2"], text: "그 이유를 설명회에서 알려드립니다", len: 86 },
      { clips: ["dribble-b", "ankle-shr-a"], text: CTA, len: 147 },
    ],
  },
  {
    title: ["부상은 왜", "'반복'될까?"],
    beats: [
      { clips: ["plate-jump-b"], text: "쉬고 나면 괜찮아지는데", len: 55 },
      { clips: ["hurdle-a"], text: "왜 또 같은 곳을 다칠까요?", len: 76 },
      { clips: ["xray-knee", "hurdle-b"], text: "반복되는 부상의 이유를\n설명회에서 짚어드립니다", len: 114 },
      { clips: ["plate-coach-b", "ankle-shr-b"], text: CTA, len: 158 },
    ],
  },
  {
    title: ["어린 나이에", "'근력운동' 괜찮을까?"],
    beats: [
      { clips: ["hexbar-b"], text: "많이들 궁금해하시는 질문", len: 51 },
      { clips: ["keiser-b"], text: "어린 나이에 근력운동,\n해도 괜찮을까요?", len: 87 },
      { clips: ["talk-r1-b"], text: "설명회에서 답해드립니다", len: 58 },
      { clips: ["keiser-a", "dribble-c"], text: CTA, len: 151 },
    ],
  },
  {
    title: ["우리 아이에게", "'맞는' 프로그램"],
    beats: [
      { clips: ["ladder-b"], text: "아이마다 몸도, 목표도 다릅니다", len: 75 },
      { clips: ["nonmotor-b"], text: "개인별 부상 예방과\n퍼포먼스 프로그램", len: 82 },
      { clips: ["talk-r5-b"], text: "설명회에서 소개해드립니다", len: 60 },
      { clips: ["blazepod-front-b", "slj-a"], text: CTA, len: 150 },
    ],
  },
  {
    title: ["R스포츠재활센터의", "'선수 관리' 시스템"],
    beats: [
      { clips: ["plate-coach-a"], text: "평가부터 재활, 복귀,\n퍼포먼스까지", len: 86 },
      { clips: ["nonmotor-c"], text: "선수를 어떻게 관리하는지", len: 55 },
      { clips: ["xray-heel"], text: "설명회에서 소개해드립니다", len: 59 },
      { clips: ["ladder-a", "slj-c"], text: CTA, len: 135 },
    ],
  },
];

export const YouthR4Main: React.FC<{ music: boolean }> = ({ music }) => (
  <R4Reel title={MAIN_TITLE} beats={MAIN_BEATS} badgeAt={420} music={music} narration="youth/narration/main.mp3" track={MAIN_MUSIC} />
);
export const YouthR4Curriculum: React.FC<{ music: boolean; n: number }> = ({ music, n }) => (
  <R4Reel title={CURRICULUM[n].title} beats={CURRICULUM[n].beats} badgeAt={150} music={music} narration={`youth/narration/curriculum${n + 1}.mp3`} track={CURRICULUM_MUSIC} />
);
