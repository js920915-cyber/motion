import { AbsoluteFill, Img, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Sfx } from "../../components/Sfx";
import { FocusBrackets } from "../components/FocusBrackets";
import { CLAMP, EASE_OUT, MONO, SANS } from "../theme";
import { COPY, Media, type Clip } from "../themes/shared";

// 홍보 시리즈 공통 블록.
// 레퍼런스(웨비나·강의 홍보 릴스)처럼 색 박스 위의 굵은 글자 + 실촬영 영상 + 한 가지 행동(신청)으로 구성합니다.

export const S = {
  bg: "#F3F5F9",
  navy: "#0E2A5C",
  blue: "#2F6FE0",
  red: "#E7141B",
  ink: "#0B1220",
  white: "#FFFFFF",
  gray: "#6B7689",
  line: "#D6DCE6",
};

// ── 강사 자리 ──────────────────────────────────────────────
// 강사 영상을 찍으면 public/youth/speaker.mp4 로 넣고 src 를 "youth/speaker.mp4" 로 바꾸세요.
// 이름·직함도 여기만 고치면 모든 편에 반영됩니다. src 가 null 이면 '빈 자리' 화면이 나옵니다.
export const SPEAKER: { src: string | null; name: string; role: string; line: string } = {
  src: null,
  name: "[강사 이름]",
  role: "[직함 · 자격]",
  line: "“12월 12일, 우리 아이 몸을 지키는 방법을 알려드립니다.”",
};

// 설명회 미리보기 팁(영상 속 작은 수업). 집에서도 볼 수 있는 확인 포인트만 담았습니다.
export const TOPICS: {
  no: string;
  title: string;
  en: string;
  tip: string[];
  clip: Clip;
  focus?: { cx: number; cy: number; hw: number; hh: number; tag: string; label: string };
}[] = [
  {
    no: "01",
    title: "부상 원인 이해",
    en: "WHY INJURIES HAPPEN",
    tip: ["착지할 때", "무릎이 안쪽으로 모이는지", "확인해 보세요"],
    clip: { src: "clips/landmine-press.mp4", trimBefore: 39 },
    focus: { cx: 500, cy: 1350, hw: 170, hh: 190, tag: "CHECK", label: "착지 무릎" },
  },
  {
    no: "02",
    title: "성장기 관리",
    en: "GROWTH-STAGE CARE",
    tip: ["키가 빨리 크는 시기엔", "훈련량을 갑자기", "늘리지 마세요"],
    clip: { src: "media/session-photo.jpg" },
  },
  {
    no: "03",
    title: "움직임 향상",
    en: "BETTER MOVEMENT",
    tip: ["한 발로 서서", "왼발·오른발 흔들림 차이를", "비교해 보세요"],
    clip: { src: "media/balance.mp4" },
    focus: { cx: 565, cy: 1240, hw: 150, hh: 120, tag: "CHECK", label: "한 발 균형" },
  },
];

// ── 기본 요소 ─────────────────────────────────────────────
export const Bg: React.FC<{ color?: string; children?: React.ReactNode }> = ({ color = S.bg, children }) => (
  <AbsoluteFill style={{ backgroundColor: color }}>{children}</AbsoluteFill>
);

// 왼쪽에서 색 박스가 쓸려 나오고 글자가 따라 나오는 텍스트 블록
export const Block: React.FC<{
  at: number;
  children: React.ReactNode;
  bg?: string;
  color?: string;
  size?: number;
  weight?: number;
  style?: React.CSSProperties;
}> = ({ at, children, bg = S.navy, color = S.white, size = 96, weight = 900, style }) => {
  const frame = useCurrentFrame();
  const box = interpolate(frame, [at, at + 7], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const txt = interpolate(frame, [at + 3, at + 10], [0, 1], { ...CLAMP, easing: EASE_OUT });
  return (
    <div style={{ display: "inline-block", position: "relative", padding: `${size * 0.06}px ${size * 0.24}px ${size * 0.1}px`, ...style }}>
      <div style={{ position: "absolute", inset: 0, background: bg, transformOrigin: "left", transform: `scaleX(${box})` }} />
      <div
        style={{
          position: "relative",
          fontFamily: SANS,
          fontWeight: weight,
          fontSize: size,
          lineHeight: 1.12,
          letterSpacing: "-0.04em",
          color,
          whiteSpace: "nowrap",
          clipPath: `inset(0 ${(1 - txt) * 100}% 0 0)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const Stack: React.FC<{ top: number; gap?: number; children: React.ReactNode }> = ({ top, gap = 14, children }) => (
  <div style={{ position: "absolute", top, left: 70, right: 110, display: "flex", flexDirection: "column", alignItems: "flex-start", gap }}>
    {children}
  </div>
);

// 첫 2초 안에 대상을 부르는 띠(레퍼런스: 대상·나이대를 맨 앞에)
export const Callout: React.FC<{ at?: number; dark?: boolean }> = ({ at = 0, dark = false }) => {
  const p = interpolate(useCurrentFrame(), [at, at + 8], [0, 1], { ...CLAMP, easing: EASE_OUT });
  return (
    <div style={{ position: "absolute", top: 250, left: 70, display: "flex", gap: 14, alignItems: "center", opacity: p, transform: `translateY(${(1 - p) * -20}px)` }}>
      <span style={{ background: S.red, color: S.white, fontFamily: SANS, fontWeight: 900, fontSize: 40, padding: "6px 18px" }}>학부모 · 지도자님께</span>
      <span style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 3, color: dark ? S.white : S.gray }}>YOUTH FOOTBALL</span>
    </div>
  );
};

// 실촬영(사진/영상) 전체 화면 + 위아래 어둡게
export const Footage: React.FC<{ clip: Clip; dim?: number; zoom?: [number, number] }> = ({ clip, dim = 0.55, zoom = [1.02, 1.1] }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const z = interpolate(frame, [0, durationInFrames], zoom, CLAMP);
  return (
    <AbsoluteFill style={{ backgroundColor: S.ink }}>
      <AbsoluteFill style={{ transform: `scale(${z})` }}>
        <Media clip={clip} />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, rgba(11,18,32,${dim + 0.3}) 0%, rgba(11,18,32,${dim * 0.4}) 34%, rgba(11,18,32,0) 52%, rgba(11,18,32,${dim * 0.6}) 76%, rgba(11,18,32,${dim + 0.25}) 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};

// 관절 표시(기존 FocusBrackets 재사용)
export const Focus: React.FC<{ f: NonNullable<(typeof TOPICS)[number]["focus"]>; at?: number }> = ({ f, at = 6 }) => (
  <FocusBrackets at={at} cx={f.cx} cy={f.cy} hw={f.hw} hh={f.hh} tag={f.tag} label={f.label} color={S.red} />
);

// 'TIP' 카드 — 영상 속 작은 수업
export const TipCard: React.FC<{ at: number; lines: string[]; top?: number }> = ({ at, lines, top = 1080 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 15, stiffness: 200 } });
  if (frame < at) return null;
  return (
    <div style={{ position: "absolute", left: 70, right: 110, top, background: S.white, padding: "26px 34px 30px", borderLeft: `14px solid ${S.red}`, boxShadow: "0 20px 40px rgba(0,0,0,0.35)", transform: `translateY(${(1 - s) * 80}px)`, opacity: s }}>
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: 4, color: S.red }}>TIP · 설명회 미리보기</div>
      {lines.map((l, i) => (
        <div key={l} style={{ fontFamily: SANS, fontWeight: i === 1 ? 900 : 700, fontSize: i === 1 ? 62 : 50, lineHeight: 1.2, letterSpacing: "-0.03em", color: i === 1 ? S.navy : S.ink, marginTop: i === 0 ? 8 : 0 }}>
          {l}
        </div>
      ))}
    </div>
  );
};

// ── 강사 자리(빈 자리 또는 실제 영상) ─────────────────────────
const CameraIcon: React.FC = () => (
  <svg width={150} height={110} viewBox="0 0 150 110">
    <rect x={6} y={22} width={138} height={82} rx={14} fill="none" stroke={S.white} strokeWidth={7} />
    <path d="M 48 22 L 58 6 L 92 6 L 102 22" fill="none" stroke={S.white} strokeWidth={7} strokeLinejoin="round" />
    <circle cx={75} cy={62} r={24} fill="none" stroke={S.white} strokeWidth={7} />
  </svg>
);

export const SpeakerSlot: React.FC<{ showLine?: boolean }> = ({ showLine = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lower = spring({ frame: frame - 10, fps, config: { damping: 16, stiffness: 190 } });
  const blink = Math.floor(frame / 12) % 2 === 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "#1B2333" }}>
      {SPEAKER.src ? (
        <Media clip={{ src: SPEAKER.src }} />
      ) : (
        <>
          {/* 빗금 + 점선 테두리: 촬영 영상이 들어갈 자리 */}
          <AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(135deg, rgba(255,255,255,0.05) 0 24px, transparent 24px 48px)" }} />
          <div style={{ position: "absolute", left: 90, right: 130, top: 300, bottom: 420, border: "6px dashed rgba(255,255,255,0.55)", borderRadius: 24, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26 }}>
            <CameraIcon />
            <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 64, color: S.white }}>강사 영상 자리</div>
            <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 34, color: "rgba(255,255,255,0.75)", textAlign: "center", lineHeight: 1.5 }}>
              세로 촬영 · 3~4초 · 가슴 위
              <br />
              카메라를 보며 한 문장
            </div>
            <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 2, color: "rgba(255,255,255,0.5)" }}>public/youth/speaker.mp4</div>
            <div style={{ fontFamily: MONO, fontSize: 24, color: blink ? S.red : "transparent" }}>● REC</div>
          </div>
        </>
      )}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(11,18,32,0) 55%, rgba(11,18,32,0.85) 85%)" }} />
      {/* 하단 이름 자막 */}
      <div style={{ position: "absolute", left: 70, top: 1250, transform: `translateX(${(1 - lower) * -80}px)`, opacity: lower }}>
        <div style={{ display: "inline-block", background: S.red, color: S.white, fontFamily: SANS, fontWeight: 900, fontSize: 60, padding: "6px 22px" }}>{SPEAKER.name}</div>
        <div style={{ background: S.white, color: S.navy, fontFamily: SANS, fontWeight: 700, fontSize: 38, padding: "8px 22px", marginTop: 6, display: "table" }}>
          {SPEAKER.role} · R스포츠재활센터
        </div>
      </div>
      {showLine ? (
        <div style={{ position: "absolute", left: 70, right: 110, top: 1440, fontFamily: SANS, fontWeight: 700, fontSize: 40, lineHeight: 1.35, color: S.white, opacity: interpolate(frame, [18, 26], [0, 1], CLAMP) }}>
          {SPEAKER.line}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ── 일정·신청(마지막 장면) ────────────────────────────────────
export const Details: React.FC<{ headline?: string; logoAt?: number }> = ({ headline = "SAVE THE DATE", logoAt = 70 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = spring({ frame: frame - logoAt, fps, config: { damping: 16, stiffness: 180 } });
  const cta = spring({ frame: frame - 36, fps, config: { damping: 12, stiffness: 200 } });
  const pulse = frame > 50 ? 0.5 + 0.5 * Math.sin((frame - 50) / 4) : 0;
  const row = (at: number) => interpolate(frame, [at, at + 8], [0, 1], { ...CLAMP, easing: EASE_OUT });
  return (
    <Bg>
      <div style={{ position: "absolute", top: 270, left: 70, right: 110 }}>
        <div style={{ fontFamily: MONO, fontSize: 26, letterSpacing: 6, color: S.red, opacity: row(0) }}>{headline}</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 24, marginTop: 4 }}>
          <Block at={2} size={200} bg={S.navy} style={{ marginLeft: -6 }}>
            12.12
          </Block>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 40, color: S.navy, opacity: row(8) }}>SAT</div>
        </div>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 40, color: S.ink, marginTop: 14, opacity: row(10) }}>{COPY.time}</div>
        <div style={{ height: 4, background: S.ink, width: `${row(12) * 100}%`, margin: "30px 0 26px" }} />
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 36, color: S.gray, opacity: row(14) }}>{COPY.kicker}</div>
        {COPY.title.map((l, i) => (
          <div key={l} style={{ fontFamily: SANS, fontWeight: 900, fontSize: i === 2 ? 104 : 80, lineHeight: 1.12, letterSpacing: "-0.045em", color: i === 2 ? S.red : S.ink, opacity: row(16 + i * 3), transform: `translateY(${(1 - row(16 + i * 3)) * 20}px)` }}>
            {l}
          </div>
        ))}
        <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            ["장소", COPY.place],
            ["대상", COPY.target],
          ].map(([k, v], i) => (
            <div key={k} style={{ display: "flex", gap: 26, fontFamily: SANS, fontSize: 40, fontWeight: 700, color: S.ink, opacity: row(26 + i * 4) }}>
              <span style={{ color: S.gray, width: 90 }}>{k}</span>
              <span>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "inline-block", marginTop: 30, background: S.red, color: S.white, fontFamily: SANS, fontWeight: 900, fontSize: 46, padding: "14px 30px", transform: `scale(${cta})`, transformOrigin: "left center", boxShadow: `0 0 0 ${pulse * 12}px rgba(231,20,27,${0.3 * (1 - pulse)})` }}>
          {COPY.apply} →
        </div>
      </div>
      <div style={{ position: "absolute", left: 70, top: 1430, opacity: logo, transform: `translateY(${(1 - logo) * 24}px)` }}>
        <Img src={staticFile("brand/rsports-logo-4x.png")} style={{ width: 430, height: (430 * 436) / 1944 }} />
      </div>
      <Sfx name="pop" at={36} volume={0.6} />
      <Sfx name="ding" at={logoAt} volume={0.7} />
    </Bg>
  );
};

// 짧은 흰 섬광(컷 전환)
export const Flash: React.FC<{ len?: number }> = ({ len = 4 }) => {
  const o = interpolate(useCurrentFrame(), [0, len], [0.5, 0], CLAMP);
  return <AbsoluteFill style={{ backgroundColor: S.white, opacity: o, pointerEvents: "none" }} />;
};

// 카운트다운 숫자 뒤의 흩어진 점
export const Confetti: React.FC<{ seed: string }> = ({ seed }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: 26 }, (_, i) => {
        const x = random(`${seed}x${i}`) * 1080;
        const y0 = random(`${seed}y${i}`) * 1920;
        const s = 8 + random(`${seed}s${i}`) * 16;
        const y = y0 - frame * (0.6 + random(`${seed}v${i}`) * 1.4);
        return <div key={i} style={{ position: "absolute", left: x, top: ((y % 1920) + 1920) % 1920, width: s, height: s, background: i % 3 === 0 ? S.red : S.navy, opacity: 0.18 }} />;
      })}
    </AbsoluteFill>
  );
};
