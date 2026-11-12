import { Audio } from "@remotion/media";
import { Img, interpolate, Sequence, Series, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Sfx } from "../../components/Sfx";
import { CLAMP, MONO, SANS } from "../theme";
import { COPY } from "../themes/shared";
import { Bg, Block, Callout, Confetti, Details, Flash, Focus, Footage, S, SpeakerSlot, Stack, TipCard, TOPICS } from "./blocks";

// 유소년 설명회 홍보 시리즈 — 해외 설명회·강의 홍보 레퍼런스 구성(docs/youth-seminar/04-references.md)
//  · 트레일러: 대상 호명 → 질문 훅 → 영상 속 팁 → 다루는 주제 3개 → 강사 → 일정·신청 (MasterClass·웨비나 릴스)
//  · 공지 / 주제 미리보기 3편 / 강사 공개 / D-7·D-1 카운트다운 (Async·Fluxnote식 시리즈 운영)

const Music: React.FC<{ music: boolean }> = ({ music }) => {
  const { durationInFrames } = useVideoConfig();
  if (!music) return null;
  return <Audio src={staticFile("youth/bgm-free.wav")} volume={(f) => interpolate(f, [durationInFrames - 30, durationInFrames - 2], [0.5, 0], CLAMP)} />;
};

type Part = { len: number; el: React.ReactNode; name: string };
const Parts: React.FC<{ parts: Part[]; music: boolean }> = ({ parts, music }) => (
  <>
    <Series>
      {parts.map((p) => (
        <Series.Sequence key={p.name} name={p.name} durationInFrames={p.len}>
          {p.el}
        </Series.Sequence>
      ))}
    </Series>
    <Music music={music} />
  </>
);
export const partsLength = (parts: { len: number }[]) => parts.reduce((a, b) => a + b.len, 0);

// 짧은 마무리: 헤드라인 + 날짜 + 신청 + 로고
const MiniCta: React.FC<{ lines: [string, string] }> = ({ lines }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cta = spring({ frame: frame - 20, fps, config: { damping: 12, stiffness: 200 } });
  const logo = spring({ frame: frame - 34, fps, config: { damping: 16, stiffness: 180 } });
  const info = interpolate(frame, [14, 22], [0, 1], CLAMP);
  return (
    <Bg>
      <Stack top={420}>
        <Block at={0} size={90}>
          {lines[0]}
        </Block>
        <Block at={6} size={90} bg={S.red}>
          {lines[1]}
        </Block>
      </Stack>
      <div style={{ position: "absolute", top: 760, left: 70, right: 110, opacity: info }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 42, color: S.navy }}>12.12 SAT · {COPY.time}</div>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 40, color: S.ink, marginTop: 10 }}>{COPY.place}</div>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 52, color: S.ink, marginTop: 18, letterSpacing: "-0.03em" }}>유소년 축구선수 부상예방 및 관리 설명회</div>
      </div>
      <div style={{ position: "absolute", top: 1060, left: 70, display: "inline-block", background: S.red, color: S.white, fontFamily: SANS, fontWeight: 900, fontSize: 46, padding: "14px 30px", transform: `scale(${cta})`, transformOrigin: "left center" }}>
        {COPY.apply} →
      </div>
      <div style={{ position: "absolute", left: 70, top: 1430, opacity: logo }}>
        <Img src={staticFile("brand/rsports-logo-4x.png")} style={{ width: 430, height: (430 * 436) / 1944 }} />
      </div>
      <Sfx name="pop" at={20} volume={0.6} />
      <Sfx name="ding" at={34} volume={0.6} />
    </Bg>
  );
};

// 다루는 주제 3개(목차)
const Agenda: React.FC = () => (
  <>
    <Footage clip={{ src: "clips/keiser-rotational-press-a.mp4", trimBefore: 28 }} dim={0.75} />
    <Stack top={300} gap={12}>
      <Block at={0} size={80} bg={S.white} color={S.navy}>
        12월 12일,
      </Block>
      <Block at={5} size={80} bg={S.red}>
        이렇게 알려드립니다
      </Block>
    </Stack>
    <Stack top={700} gap={22}>
      {TOPICS.map((t, i) => (
        <div key={t.no} style={{ display: "flex", alignItems: "center", gap: 0 }}>
          <Block at={20 + i * 14} size={64} bg={i === 1 ? S.blue : S.red} weight={700}>
            {t.no}
          </Block>
          <Block at={23 + i * 14} size={72} bg={S.white} color={S.ink}>
            {t.title}
          </Block>
        </div>
      ))}
    </Stack>
    {TOPICS.map((t, i) => (
      <Sfx key={t.no} name="thump" at={20 + i * 14} volume={0.6} />
    ))}
  </>
);

// ── 1) 메인 트레일러(약 20초) ─────────────────────────────────
const TRAILER: Part[] = [
  {
    name: "Hook",
    len: 90,
    el: (
      <Bg>
        <Callout />
        <Stack top={440}>
          <Block at={6} size={104}>
            아이의 부상,
          </Block>
          <Block at={16} size={104} bg={S.red}>
            미리 막을 수 있다면?
          </Block>
        </Stack>
        <div style={{ position: "absolute", top: 760, left: 76, fontFamily: SANS, fontWeight: 700, fontSize: 42, color: S.gray }}>12월 12일, R스포츠재활센터 설명회</div>
        <Sfx name="pop" at={6} volume={0.5} />
        <Sfx name="pop" at={16} volume={0.5} />
      </Bg>
    ),
  },
  {
    name: "Tip",
    len: 120,
    el: (
      <>
        <Footage clip={TOPICS[0].clip} />
        <Focus f={TOPICS[0].focus!} at={6} />
        <TipCard at={22} lines={TOPICS[0].tip} top={290} />
        <Flash />
        <Sfx name="whoosh" volume={0.5} />
        <Sfx name="blip" at={20} volume={0.6} />
      </>
    ),
  },
  { name: "Agenda", len: 120, el: <><Agenda /><Flash /></> },
  { name: "Speaker", len: 105, el: <><SpeakerSlot /><Flash /><Sfx name="shutter" volume={0.5} /></> },
  { name: "Details", len: 165, el: <Details /> },
];
export const TRAILER_LEN = partsLength(TRAILER);
export const YouthSeriesTrailer: React.FC<{ music: boolean }> = ({ music }) => <Parts parts={TRAILER} music={music} />;

// ── 2) 첫 공지(Save the date) ────────────────────────────────
const MONTAGE = [
  { src: "clips/medicine-ball-throw.mp4", trimBefore: 20 },
  { src: "media/balance.mp4" },
  { src: "clips/single-leg-squat.mp4", trimBefore: 30 },
];
const ANNOUNCE: Part[] = [
  {
    name: "Announce",
    len: 90,
    el: (
      <>
        {MONTAGE.map((c, i) => (
          <Sequence key={c.src} from={i * 30} durationInFrames={30} layout="none">
            <Footage clip={c} dim={0.7} />
            <Flash len={3} />
          </Sequence>
        ))}
        <Callout dark />
        <Stack top={440}>
          <Block at={4} size={80} bg={S.white} color={S.navy}>
            유소년 축구선수를 위한
          </Block>
          <Block at={14} size={104}>
            부상예방 설명회가
          </Block>
          <Block at={24} size={104} bg={S.red}>
            열립니다
          </Block>
        </Stack>
        <Sfx name="whoosh" at={4} volume={0.4} />
        <Sfx name="impact" at={24} volume={0.35} />
      </>
    ),
  },
  {
    name: "Date",
    len: 75,
    el: (
      <Bg color={S.navy}>
        <Confetti seed="announce" />
        <Stack top={470} gap={18}>
          <div style={{ fontFamily: MONO, fontSize: 28, letterSpacing: 6, color: "rgba(255,255,255,0.8)" }}>SAVE THE DATE</div>
          <Block at={2} size={210} bg={S.red}>
            12.12 SAT
          </Block>
          <Block at={10} size={70} bg={S.white} color={S.navy}>
            {COPY.time}
          </Block>
          <Block at={16} size={54} bg="transparent" weight={700}>
            {COPY.place}
          </Block>
        </Stack>
        <Sfx name="thump" at={2} volume={0.7} />
      </Bg>
    ),
  },
  { name: "Details", len: 135, el: <Details headline="SAVE THE DATE" logoAt={60} /> },
];
export const ANNOUNCE_LEN = partsLength(ANNOUNCE);
export const YouthSeriesAnnounce: React.FC<{ music: boolean }> = ({ music }) => <Parts parts={ANNOUNCE} music={music} />;

// ── 3) 주제 미리보기 3편 ────────────────────────────────────
const topicParts = (i: number): Part[] => {
  const t = TOPICS[i];
  return [
    {
      name: "Title",
      len: 60,
      el: (
        <Bg>
          <Callout />
          <Stack top={440} gap={10}>
            <div style={{ fontFamily: MONO, fontSize: 28, letterSpacing: 5, color: S.red }}>설명회 미리보기 {t.no} / 03</div>
            <Block at={2} size={200} bg={i === 1 ? S.blue : S.red} weight={700}>
              {t.no}
            </Block>
            <Block at={8} size={110}>
              {t.title}
            </Block>
            <div style={{ fontFamily: MONO, fontSize: 26, letterSpacing: 4, color: S.gray, marginTop: 6 }}>{t.en}</div>
          </Stack>
          <Sfx name="thump" at={2} volume={0.7} />
        </Bg>
      ),
    },
    {
      name: "Tip",
      len: 150,
      el: (
        <>
          <Footage clip={t.clip} dim={t.focus ? 0.55 : 0.4} />
          {t.focus ? <Focus f={t.focus} at={6} /> : null}
          <TipCard at={t.focus ? 24 : 10} lines={t.tip} top={t.focus ? 290 : 1060} />
          <Flash />
          <Sfx name="whoosh" volume={0.45} />
          <Sfx name="blip" at={t.focus ? 22 : 10} volume={0.6} />
        </>
      ),
    },
    { name: "CTA", len: 90, el: <MiniCta lines={["12월 12일 설명회에서", "자세히 알려드립니다"]} /> },
  ];
};
export const TOPIC_LEN = partsLength(topicParts(0));
export const YouthSeriesTopic: React.FC<{ music: boolean; topic: number }> = ({ music, topic }) => <Parts parts={topicParts(topic)} music={music} />;

// ── 4) 강사 공개 ───────────────────────────────────────────
const SPEAKER_PARTS: Part[] = [
  {
    name: "Question",
    len: 60,
    el: (
      <Bg>
        <Callout />
        <Stack top={440}>
          <Block at={4} size={120}>
            누가
          </Block>
          <Block at={12} size={120} bg={S.red}>
            알려주나요?
          </Block>
        </Stack>
        <Sfx name="pop" at={4} volume={0.5} />
        <Sfx name="pop" at={12} volume={0.5} />
      </Bg>
    ),
  },
  { name: "Speaker", len: 135, el: <><SpeakerSlot /><Flash /><Sfx name="shutter" volume={0.5} /></> },
  { name: "CTA", len: 90, el: <MiniCta lines={["12월 12일,", "직접 만나보세요"]} /> },
];
export const SPEAKER_LEN = partsLength(SPEAKER_PARTS);
export const YouthSeriesSpeaker: React.FC<{ music: boolean }> = ({ music }) => <Parts parts={SPEAKER_PARTS} music={music} />;

// ── 5) 카운트다운 D-7 / D-1 ─────────────────────────────────
const CountNumber: React.FC<{ days: number }> = ({ days }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - 4, fps, config: { damping: 9, stiffness: 220 } });
  return (
    <Bg>
      <Confetti seed={`d${days}`} />
      <Callout />
      <div style={{ position: "absolute", top: 470, left: 70, fontFamily: MONO, fontSize: 32, letterSpacing: 5, color: S.gray }}>설명회까지</div>
      <div style={{ position: "absolute", top: 520, left: 50, fontFamily: SANS, fontWeight: 900, fontSize: 400, lineHeight: 1, letterSpacing: "-0.06em", transform: `scale(${0.6 + pop * 0.4})`, transformOrigin: "left center", opacity: Math.min(1, pop * 1.5) }}>
        <span style={{ color: S.red }}>D-</span>
        <span style={{ color: S.navy }}>{days}</span>
      </div>
      <Stack top={1000} gap={12}>
        <Block at={20} size={64}>
          12.12 SAT · 15:00
        </Block>
        <Block at={28} size={56} bg={S.white} color={S.ink} weight={700}>
          {days === 1 ? "바로 내일입니다" : `${days}일 남았습니다`}
        </Block>
      </Stack>
      <Sfx name="impact" at={4} volume={0.35} />
      <Sfx name="tick" at={20} volume={0.6} />
    </Bg>
  );
};
const countParts = (days: number): Part[] => [
  { name: `D-${days}`, len: 90, el: <CountNumber days={days} /> },
  { name: "CTA", len: 90, el: <MiniCta lines={days === 1 ? ["내일 오후 3시,", "센터에서 만나요"] : ["학부모·지도자님,", "일정 비워두세요"]} /> },
];
export const COUNT_LEN = partsLength(countParts(7));
export const YouthSeriesCountdown: React.FC<{ music: boolean; days: number }> = ({ music, days }) => <Parts parts={countParts(days)} music={music} />;
