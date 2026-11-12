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

// 음악: assets/music 의 곡을 scripts 로 잘라 public/youth/r4/bgm.* 로 둡니다. 없으면 무음.
export const R4_MUSIC: string | null = null;

export type Beat = { clip: string; text: string; len: number };

const Band: React.FC<{ beats: Beat[] }> = ({ beats }) => {
  let from = 0;
  return (
    <div style={{ position: "absolute", left: 0, top: L.bandTop, width: 1080, height: L.bandH, overflow: "hidden", background: "#111" }}>
      {beats.map((b, i) => {
        const el = (
          <Sequence key={i} from={from} durationInFrames={b.len} layout="none">
            <Video src={staticFile(`youth/band/${b.clip}.mp4`)} muted objectFit="cover" style={{ width: 1080, height: L.bandH }} />
          </Sequence>
        );
        from += b.len;
        return el;
      })}
    </div>
  );
};

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

export const R4Reel: React.FC<{ title: [string, string]; beats: Beat[]; badgeAt?: number; music: boolean; narration?: string }> = ({
  title,
  beats,
  badgeAt,
  music,
  narration,
}) => {
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
      {narration ? <Audio src={staticFile(narration)} volume={1} /> : null}
      {music && R4_MUSIC ? (
        <Audio
          src={staticFile(R4_MUSIC)}
          // 나레이션 중에는 낮게(0.18), 엔딩 로고에서 올렸다가(0.55) 끝에서 페이드아웃
          volume={(f) => interpolate(f, [0, 6, body - 10, body + 10, durationInFrames - 40, durationInFrames - 2], [0, 0.18, 0.18, 0.55, 0.55, 0], CLAMP)}
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
  { clip: "dribble-a", text: "학부모님, 지도자님.\n이런 고민 있으신가요?", len: 96 },
  { clip: "dribble-b", text: "“우리 아이는 왜 맨날 다칠까요?”", len: 72 },
  { clip: "blazepod-front", text: "12월 12일, R스포츠재활센터가\n그 답을 함께 찾습니다", len: 144 },
  { clip: "blazepod-side", text: "1. 유소년 선수는 왜 성인과\n다르게 접근해야 하는지", len: 108 },
  { clip: "plate-jump", text: "2. 부상은 왜 반복되는지", len: 59 },
  { clip: "hexbar-youth", text: "3. 어린 나이에 근력운동,\n해도 괜찮은지", len: 84 },
  { clip: "ladder-coach", text: "4. 개인별 부상 예방과\n퍼포먼스 프로그램", len: 84 },
  { clip: "plate-coach", text: "5. 그리고 R스포츠재활센터의\n선수 관리 시스템까지", len: 108 },
  { clip: "nonmotor-coach", text: "12.12(토) 오후 3시, 강서구 마곡\nR스포츠재활센터에서 만나요", len: 180 },
  { clip: "keiser-youth", text: "신청은 인스타그램 프로필 링크에서", len: 102 },
];

// ── 커리큘럼 5편(각 약 17~19초) ──────────────────────────────
const CTA = "12.12(토) 오후 3시\n신청은 프로필 링크에서";
export const CURRICULUM: { title: [string, string]; beats: Beat[] }[] = [
  {
    title: ["유소년 선수는 왜", "'다르게' 접근할까?"],
    beats: [
      { clip: "dribble-a", text: "같은 축구, 같은 훈련이라도", len: 67 },
      { clip: "blazepod-side", text: "유소년 선수는 성인과\n다르게 접근해야 합니다", len: 110 },
      { clip: "dribble-b", text: "그 이유를 설명회에서 알려드립니다", len: 86 },
      { clip: "blazepod-front", text: CTA, len: 147 },
    ],
  },
  {
    title: ["부상은 왜", "'반복'될까?"],
    beats: [
      { clip: "plate-jump", text: "쉬고 나면 괜찮아지는데", len: 55 },
      { clip: "hurdle-drag", text: "왜 또 같은 곳을 다칠까요?", len: 76 },
      { clip: "ladder-coach", text: "반복되는 부상의 이유를\n설명회에서 짚어드립니다", len: 114 },
      { clip: "plate-coach", text: CTA, len: 158 },
    ],
  },
  {
    title: ["어린 나이에", "'근력운동' 괜찮을까?"],
    beats: [
      { clip: "hexbar-youth", text: "많이들 궁금해하시는 질문", len: 51 },
      { clip: "keiser-youth", text: "어린 나이에 근력운동,\n해도 괜찮을까요?", len: 87 },
      { clip: "blazepod-front", text: "설명회에서 답해드립니다", len: 58 },
      { clip: "dribble-a", text: CTA, len: 151 },
    ],
  },
  {
    title: ["우리 아이에게", "'맞는' 프로그램"],
    beats: [
      { clip: "blazepod-front", text: "아이마다 몸도, 목표도 다릅니다", len: 75 },
      { clip: "ladder-coach", text: "개인별 부상 예방과\n퍼포먼스 프로그램", len: 82 },
      { clip: "nonmotor-coach", text: "설명회에서 소개해드립니다", len: 60 },
      { clip: "blazepod-side", text: CTA, len: 150 },
    ],
  },
  {
    title: ["R스포츠재활센터의", "'선수 관리' 시스템"],
    beats: [
      { clip: "plate-coach", text: "평가부터 재활, 복귀,\n퍼포먼스까지", len: 86 },
      { clip: "nonmotor-coach", text: "선수를 어떻게 관리하는지", len: 55 },
      { clip: "plate-jump", text: "설명회에서 소개해드립니다", len: 59 },
      { clip: "keiser-youth", text: CTA, len: 135 },
    ],
  },
];

export const YouthR4Main: React.FC<{ music: boolean }> = ({ music }) => (
  <R4Reel title={MAIN_TITLE} beats={MAIN_BEATS} badgeAt={420} music={music} narration="youth/narration/main.mp3" />
);
export const YouthR4Curriculum: React.FC<{ music: boolean; n: number }> = ({ music, n }) => (
  <R4Reel title={CURRICULUM[n].title} beats={CURRICULUM[n].beats} badgeAt={150} music={music} narration={`youth/narration/curriculum${n + 1}.mp3`} />
);
