import { Video } from "@remotion/media";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { AbsoluteFill, Img, interpolate, random, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Sfx } from "../../components/Sfx";
import { useImpactJolt } from "../components/Impact";
import { CLAMP, EASE_OUT, MONO, SANS } from "../theme";
import { COPY, Rise, type Shot, T, ThemeReel, useIn } from "./shared";

// 테마 A — 매거진(EDITORIAL)
// 종이 질감 배경, 흑백 사진 프린트, 빨간 펜 손그림 동그라미, 큰 숫자 타이포.
const P = {
  paper: "#EEE8DC",
  ink: "#141414",
  red: "#E7141B",
  blue: "#0E418B",
  gray: "#7D776B",
  white: "#FFFFFF",
};

const SHOTS: Shot[] = [
  {
    src: "clips/landmine-press.mp4",
    trimBefore: 39,
    lines: ["착지할 때", "무릎이 무너지면"],
    focus: { cx: 500, cy: 1350, hw: 170, hh: 190, tag: "FIG.A — KNEE", label: "착지 무릎" },
  },
  {
    src: "media/balance.mp4",
    trimBefore: 0,
    lines: ["한 발로 설 때", "발목이 흔들리면"],
    focus: { cx: 565, cy: 1240, hw: 150, hh: 120, tag: "FIG.B — ANKLE", label: "발목 안정성" },
  },
];

// 종이 그레인(2프레임마다 무늬가 바뀌어 필름 느낌)
const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.22 }) => {
  const frame = useCurrentFrame();
  const id = "paper-grain";
  return (
    <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity, mixBlendMode: "multiply", pointerEvents: "none" }}>
      <filter id={id}>
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={Math.floor(frame / 2) % 7} stitchTiles="stitch" />
        <feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.4  0 0 0 0 0.33  0 0 0 0.9 0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#${id})`} />
    </svg>
  );
};

const Paper: React.FC<{ children: React.ReactNode; bg?: string }> = ({ children, bg = P.paper }) => (
  <AbsoluteFill style={{ backgroundColor: bg }}>
    {children}
    <Grain />
  </AbsoluteFill>
);

const big = (size: number, color = P.ink): React.CSSProperties => ({
  fontFamily: SANS,
  fontWeight: 900,
  fontSize: size,
  lineHeight: 1.08,
  letterSpacing: "-0.05em",
  color,
});

// 빨간 펜으로 그린 듯한 동그라미(살짝 삐뚤고, 시작과 끝이 겹침)
const MarkerCircle: React.FC<{ cx: number; cy: number; rx: number; ry: number; at: number; seed: string }> = ({
  cx,
  cy,
  rx,
  ry,
  at,
  seed,
}) => {
  const frame = useCurrentFrame();
  const pts: string[] = [];
  const N = 48;
  for (let i = 0; i <= N; i++) {
    const a = -0.6 + (i / N) * (Math.PI * 2 + 0.55);
    const wob = 1 + (random(`${seed}-${Math.floor(i / 6)}`) - 0.5) * 0.08 + (i / N) * 0.06;
    pts.push(`${(cx + Math.cos(a) * rx * wob).toFixed(1)},${(cy + Math.sin(a) * ry * wob).toFixed(1)}`);
  }
  const len = Math.PI * (rx + ry) * 1.15;
  const draw = interpolate(frame, [at, at + 12], [0, 1], { ...CLAMP, easing: EASE_OUT });
  return (
    <polyline
      points={pts.join(" ")}
      fill="none"
      stroke={P.red}
      strokeWidth={10}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={len}
      strokeDashoffset={len * (1 - draw)}
    />
  );
};

// ── 장면 1: 훅 ───────────────────────────────────────────
const SLAM = 30;
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const jolt = useImpactJolt(SLAM, 0.45);
  const tape = interpolate(frame, [SLAM - 5, SLAM + 1], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const sub = useIn(SLAM + 14, 10);
  return (
    <Paper>
      {/* 배경의 커다란 물음표(외곽선) */}
      <div
        style={{
          position: "absolute",
          right: -160,
          bottom: 60,
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 1500,
          lineHeight: 1,
          color: "transparent",
          WebkitTextStroke: `4px ${P.ink}`,
          opacity: 0.1,
          transform: `rotate(${interpolate(frame, [0, 90], [10, 2])}deg)`,
        }}
      >
        ?
      </div>
      <AbsoluteFill style={{ transform: jolt }}>
        <div style={{ position: "absolute", top: 470, left: 80, right: 80 }}>
          <Rise at={-6}>
            <div style={big(150)}>{COPY.hook[0]}</div>
          </Rise>
          <Rise at={6}>
            <div style={big(150)}>{COPY.hook[1]}</div>
          </Rise>
          {/* 빨간 테이프가 쓸고 지나가며 '다칠까요?'가 드러남 */}
          <div style={{ position: "relative", marginTop: 26, marginLeft: -100, transform: "rotate(-4deg)", transformOrigin: "left center" }}>
            <div
              style={{
                width: 1280 * tape,
                height: 250,
                background: P.red,
                overflow: "hidden",
                boxShadow: "0 10px 0 rgba(0,0,0,0.12)",
              }}
            >
              <div style={{ ...big(196, P.white), padding: "18px 0 0 100px", whiteSpace: "nowrap" }}>{COPY.hookPunch}</div>
            </div>
          </div>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 44, color: P.ink, marginTop: 70, opacity: sub, transform: `translateY(${(1 - sub) * 20}px)` }}>
            반복되는 부상, 이유가 있습니다.
          </div>
        </div>
      </AbsoluteFill>
      <Sfx name="pop" at={6} volume={0.5} />
      <Sfx name="whoosh" at={SLAM - 6} volume={0.4} />
      <Sfx name="impact" at={SLAM} volume={0.35} />
    </Paper>
  );
};

// ── 장면 2: 사진 프린트 + 손그림 동그라미 ─────────────────────
const FRAME = { left: 130, top: 610, w: 820, h: 880, border: 16 };

const PhotoShot: React.FC<{ shot: Shot; tilt: number }> = ({ shot, tilt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = FRAME.w / 1080; // 영상 축소 비율
  const vh = 1920 * s;
  const offY = Math.min(Math.max(shot.focus.cy * s - FRAME.h * 0.58, 0), vh - FRAME.h);
  const fx = shot.focus.cx * s;
  const fy = shot.focus.cy * s - offY;
  const rx = shot.focus.hw * s * 1.25;
  const ry = shot.focus.hh * s * 1.2;
  const drop = spring({ frame, fps, config: { damping: 15, stiffness: 160 } });
  const note = spring({ frame: frame - 22, fps, config: { damping: 12, stiffness: 220 } });
  const arrow = interpolate(frame, [18, 28], [0, 1], { ...CLAMP, easing: EASE_OUT });

  return (
    <Paper>
      <div style={{ position: "absolute", top: 270, left: 80, right: 120 }}>
        <Rise at={0}>
          <div style={big(96)}>{shot.lines[0]}</div>
        </Rise>
        <Rise at={4}>
          <div style={{ ...big(96), display: "inline-block", backgroundImage: `linear-gradient(transparent 62%, ${P.red}55 62%)` }}>
            {shot.lines[1]}
          </div>
        </Rise>
      </div>

      <div
        style={{
          position: "absolute",
          left: FRAME.left,
          top: FRAME.top,
          width: FRAME.w,
          height: FRAME.h,
          padding: FRAME.border,
          boxSizing: "content-box",
          background: P.white,
          boxShadow: "0 30px 50px rgba(20,20,20,0.25), 0 4px 10px rgba(20,20,20,0.15)",
          transform: `translateY(${(1 - drop) * 120}px) rotate(${tilt * (0.4 + drop * 0.6)}deg)`,
        }}
      >
        <div style={{ position: "relative", width: FRAME.w, height: FRAME.h, overflow: "hidden", background: "#222" }}>
          <div style={{ position: "absolute", top: -offY, left: 0, filter: "grayscale(1) contrast(1.25) brightness(1.05)" }}>
            <Video src={staticFile(shot.src)} trimBefore={shot.trimBefore} muted objectFit="cover" style={{ width: FRAME.w, height: vh }} />
          </div>
          <AbsoluteFill style={{ background: P.blue, mixBlendMode: "screen", opacity: 0.22 }} />
          <svg width={FRAME.w} height={FRAME.h} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <MarkerCircle cx={fx} cy={fy} rx={rx} ry={ry} at={8} seed={shot.focus.tag} />
            <path
              d={`M ${fx + rx + 150} ${fy - ry - 150} Q ${fx + rx + 40} ${fy - ry - 110} ${fx + rx * 0.75} ${fy - ry * 0.75}`}
              fill="none"
              stroke={P.red}
              strokeWidth={6}
              strokeLinecap="round"
              strokeDasharray={400}
              strokeDashoffset={400 * (1 - arrow)}
            />
          </svg>
        </div>
        <div style={{ position: "absolute", left: FRAME.border, bottom: -4, transform: "translateY(100%)", fontFamily: MONO, fontSize: 22, letterSpacing: 3, color: P.gray, paddingTop: 10 }}>
          {shot.focus.tag} · R SPORTS REHAB
        </div>
      </div>

      {/* 메모 스티커 */}
      <div
        style={{
          position: "absolute",
          left: Math.min(FRAME.left + FRAME.border + fx + rx + 40, 640),
          top: FRAME.top + FRAME.border + fy - ry - 250,
          background: P.white,
          padding: "14px 22px 16px",
          boxShadow: "0 8px 18px rgba(0,0,0,0.18)",
          transform: `rotate(4deg) scale(${note})`,
          transformOrigin: "left bottom",
        }}
      >
        <div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: 2, color: P.gray }}>CHECK</div>
        <div style={{ ...big(54, P.red), lineHeight: 1.1 }}>{shot.focus.label}</div>
      </div>
    </Paper>
  );
};

const Cause: React.FC = () => (
  <AbsoluteFill>
    {SHOTS.map((shot, i) => (
      <Sequence key={shot.src} from={i * T.shot} durationInFrames={i === 0 ? T.shot : T.shot + 8} name={shot.focus.tag}>
        <PhotoShot shot={shot} tilt={i === 0 ? -2.5 : 2} />
        <Sfx name="shutter" at={0} volume={0.6} />
        <Sfx name="pop" at={9} volume={0.5} />
      </Sequence>
    ))}
  </AbsoluteFill>
);

// ── 장면 3: 핵심 3가지(큰 외곽선 숫자 + 형광펜) ────────────────
const Points: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Paper>
      <div style={{ position: "absolute", top: 290, left: 80, right: 120 }}>
        <Rise at={0}>
          <div style={{ fontFamily: MONO, fontSize: 26, letterSpacing: 5, color: P.red }}>IN THIS SESSION</div>
        </Rise>
        <Rise at={2}>
          <div style={big(84)}>설명회에서 알려드립니다</div>
        </Rise>
      </div>
      <div style={{ position: "absolute", top: 560, left: 80, right: 100 }}>
        {COPY.points.map((p, i) => {
          const at = i * T.step + 2;
          const inP = interpolate(frame, [at, at + 8], [0, 1], { ...CLAMP, easing: EASE_OUT });
          const mark = interpolate(frame, [at + 5, at + 13], [0, 1], { ...CLAMP, easing: EASE_OUT });
          return (
            <div key={p.no} style={{ position: "relative", height: 280, opacity: inP }}>
              <div style={{ height: 4, background: P.ink, width: `${inP * 100}%` }} />
              <div style={{ display: "flex", alignItems: "center", gap: 30, transform: `translateY(${(1 - inP) * 40}px)` }}>
                <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 220, lineHeight: 1.1, color: "transparent", WebkitTextStroke: `4px ${P.ink}`, letterSpacing: "-0.06em", width: 270 }}>
                  {p.no}
                </div>
                <div>
                  <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 4, color: P.gray }}>{p.en}</div>
                  <div style={{ position: "relative", display: "inline-block" }}>
                    <div style={{ position: "absolute", left: -8, right: -8, bottom: 10, height: 34, background: P.red, opacity: 0.35, transformOrigin: "left", transform: `scaleX(${mark})` }} />
                    <div style={{ ...big(88), position: "relative" }}>{p.text}</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {COPY.points.map((p, i) => (
        <Sfx key={p.no} name="thump" at={i * T.step + 2} volume={0.7} />
      ))}
    </Paper>
  );
};

// ── 장면 4: 빨간 표지(SAVE THE DATE) ────────────────────────
const LOGO_AT = 90;
const Info: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = spring({ frame: frame - LOGO_AT, fps, config: { damping: 16, stiffness: 180 } });
  const rule = useIn(12, 12);
  const cta = spring({ frame: frame - 40, fps, config: { damping: 12, stiffness: 200 } });
  const pulse = frame > 55 ? 0.5 + 0.5 * Math.sin((frame - 55) / 4) : 0;
  return (
    <Paper bg={P.red}>
      <div style={{ position: "absolute", top: 270, left: 80, right: 100, color: P.white }}>
        <Rise at={0}>
          <div style={{ fontFamily: MONO, fontSize: 26, letterSpacing: 6 }}>SAVE THE DATE</div>
        </Rise>
        <Rise at={2} len={10}>
          <div style={{ ...big(250, P.white), lineHeight: 1 }}>12.12</div>
        </Rise>
        <Rise at={6}>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 40, letterSpacing: 3 }}>SAT · {COPY.time}</div>
        </Rise>
        <div style={{ height: 4, background: P.white, width: `${rule * 100}%`, margin: "34px 0 30px" }} />
        <Rise at={12}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 36, opacity: 0.85 }}>{COPY.kicker}</div>
        </Rise>
        {COPY.title.map((l, i) => (
          <Rise key={l} at={15 + i * 3}>
            <div style={big(i === 2 ? 110 : 84, P.white)}>{l}</div>
          </Rise>
        ))}
        <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            ["장소", COPY.place],
            ["대상", COPY.target],
          ].map(([k, v], i) => (
            <Rise key={k} at={28 + i * 5}>
              <div style={{ display: "flex", gap: 26, fontFamily: SANS, fontSize: 40, fontWeight: 700 }}>
                <span style={{ opacity: 0.7, width: 90 }}>{k}</span>
                <span>{v}</span>
              </div>
            </Rise>
          ))}
        </div>
        <div
          style={{
            display: "inline-block",
            marginTop: 30,
            background: P.white,
            color: P.red,
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 46,
            padding: "14px 30px",
            transform: `scale(${cta})`,
            transformOrigin: "left center",
            boxShadow: `0 0 0 ${pulse * 12}px rgba(255,255,255,${0.3 * (1 - pulse)})`,
          }}
        >
          {COPY.apply} →
        </div>
      </div>
      <div style={{ position: "absolute", left: 80, top: 1440, opacity: logo, transform: `translateY(${(1 - logo) * 24}px)` }}>
        {/* 흰 로고의 빨간 R이 빨간 배경에 묻히지 않도록 전체를 흰색으로 */}
        <Img src={staticFile("brand/rsports-logo-white-4x.png")} style={{ width: 400, height: (400 * 352) / 1916, filter: "brightness(0) invert(1)" }} />
      </div>
      <Sfx name="whoosh" at={0} volume={0.4} />
      <Sfx name="pop" at={40} volume={0.6} />
      <Sfx name="ding" at={LOGO_AT} volume={0.7} />
    </Paper>
  );
};

// 잡지 머리글(모든 장면 공통)
const Masthead: React.FC = () => {
  const frame = useCurrentFrame();
  const page = frame < 90 ? 1 : frame < 210 ? 2 : frame < 300 ? 3 : 4;
  const onRed = frame >= 300;
  const color = onRed ? P.white : P.ink;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: 160, left: 80, right: 120, display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 22, letterSpacing: 4, color }}>
        <span style={{ fontWeight: 700 }}>R SPORTS JOURNAL</span>
        <span>YOUTH FOOTBALL — P.0{page}</span>
      </div>
      <div style={{ position: "absolute", top: 200, left: 80, right: 120, height: 2, background: color, opacity: 0.6 }} />
    </AbsoluteFill>
  );
};

export const YouthReelEditorial: React.FC<{ music: boolean }> = ({ music }) => (
  <ThemeReel
    bg={P.paper}
    music={music}
    scenes={[Hook, Cause, Points, Info]}
    transitions={[slide({ direction: "from-bottom" }), slide({ direction: "from-right" }), wipe({ direction: "from-bottom-left" })]}
    overlay={<Masthead />}
  />
);
