import { Video } from "@remotion/media";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { useId } from "react";
import { AbsoluteFill, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Sfx } from "../../components/Sfx";
import { SlamText, useImpactJolt } from "../components/Impact";
import { CLAMP, EASE_OUT, MONO, SANS } from "../theme";
import { COPY, Rise, type Shot, T, ThemeReel, useIn } from "./shared";

// 테마 B — 전술판(TACTICS)
// 잔디 줄무늬 + 분필 라인 배경, 전술 화살표, 중계 화면 분석(텔레스트레이터) 표시.
const P = {
  grass: "#1D5A33",
  grass2: "#19502D",
  chalk: "#F4F4EC",
  red: "#E7141B",
  yellow: "#FFD43B",
  navy: "#0A2F66",
  ink: "#0E1A12",
};

// 클립을 위로 올려(발이 릴스 하단 캡션에 가리지 않게) 쓰고, 아래는 중계 자막 바로 채웁니다.
const LIFT = 260;

const SHOTS: Shot[] = [
  {
    src: "clips/medicine-ball-throw.mp4",
    trimBefore: 20,
    lines: ["던지고 차는 힘은", "골반에서 나옵니다"],
    focus: { cx: 480, cy: 1150, hw: 190, hh: 160, tag: "HIP", label: "골반 회전" },
  },
  {
    src: "clips/keiser-rotational-press-b.mp4",
    trimBefore: 174,
    lines: ["버티는 디딤발이", "부상을 막습니다"],
    focus: { cx: 445, cy: 1665, hw: 170, hh: 60, tag: "PLANT FOOT", label: "디딤발 안정성" },
  },
];

// 잔디 + 분필 경기장 라인(처음에 그려지고 이후엔 그대로)
const Pitch: React.FC<{ drawAt?: number; dim?: number }> = ({ drawAt = -100, dim = 0 }) => {
  const frame = useCurrentFrame();
  const d = interpolate(frame, [drawAt, drawAt + 18], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const L = 6000;
  const line = { fill: "none", stroke: P.chalk, strokeWidth: 6, strokeDasharray: L, strokeDashoffset: L * (1 - d), opacity: 0.55 };
  return (
    <AbsoluteFill style={{ background: `repeating-linear-gradient(180deg, ${P.grass} 0 160px, ${P.grass2} 160px 320px)` }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <rect x={60} y={60} width={960} height={1800} {...line} />
        <line x1={60} y1={960} x2={1020} y2={960} {...line} />
        <circle cx={540} cy={960} r={180} {...line} />
        <rect x={250} y={60} width={580} height={300} {...line} />
        <rect x={380} y={60} width={320} height={110} {...line} />
        <rect x={250} y={1560} width={580} height={300} {...line} />
        <rect x={380} y={1750} width={320} height={110} {...line} />
        <path d="M 400 1560 A 150 150 0 0 1 680 1560" {...line} />
        <path d="M 400 360 A 150 150 0 0 0 680 360" {...line} />
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 40%, rgba(0,0,0,0.35) 100%)" }} />
      <AbsoluteFill style={{ background: P.ink, opacity: dim }} />
    </AbsoluteFill>
  );
};

const chalk = (size: number, color = P.chalk): React.CSSProperties => ({
  fontFamily: SANS,
  fontWeight: 900,
  fontSize: size,
  lineHeight: 1.08,
  letterSpacing: "-0.04em",
  color,
  textShadow: "0 3px 0 rgba(0,0,0,0.25)",
});

// 점선 전술 화살표
const PassArrow: React.FC<{ d: string; at: number; color?: string; len?: number }> = ({ d, at, color = P.chalk, len = 700 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 12], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const id = `m${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <g>
      <defs>
        <mask id={id}>
          <path d={d} fill="none" stroke="white" strokeWidth={20} strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
        </mask>
      </defs>
      <path d={d} fill="none" stroke={color} strokeWidth={7} strokeDasharray="18 16" strokeLinecap="round" mask={`url(#${id})`} markerEnd={p > 0.95 ? `url(#head-${color.slice(1)})` : undefined} />
    </g>
  );
};

const ArrowHeads: React.FC = () => (
  <defs>
    {[P.chalk, P.red, P.yellow].map((c) => (
      <marker key={c} id={`head-${c.slice(1)}`} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto">
        <path d="M0,0 L10,5 L0,10 z" fill={c} />
      </marker>
    ))}
  </defs>
);

const Token: React.FC<{ x: number; y: number; at: number; kind: "o" | "x"; label?: string }> = ({ x, y, at, kind, label }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 11, stiffness: 260 } });
  if (frame < at) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {kind === "o" ? (
        <circle r={36} fill="none" stroke={P.chalk} strokeWidth={8} />
      ) : (
        <g stroke={P.red} strokeWidth={12} strokeLinecap="round">
          <line x1={-30} y1={-30} x2={30} y2={30} />
          <line x1={30} y1={-30} x2={-30} y2={30} />
        </g>
      )}
      {label ? (
        <text y={78} textAnchor="middle" fontFamily={MONO} fontSize={24} fill={P.chalk} letterSpacing={3}>
          {label}
        </text>
      ) : null}
    </g>
  );
};

// ── 장면 1: 전술판 훅 ─────────────────────────────────────
const SLAM = 30;
const Hook: React.FC = () => {
  const jolt = useImpactJolt(SLAM, 0.6);
  return (
    <AbsoluteFill style={{ transform: jolt }}>
      <Pitch drawAt={-10} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <ArrowHeads />
        <Token x={220} y={1300} at={2} kind="o" label="PASS" />
        <Token x={560} y={1140} at={8} kind="o" label="RUN" />
        <PassArrow d="M 262 1280 Q 400 1180 520 1150" at={6} />
        <PassArrow d="M 600 1160 Q 760 1220 810 1330" at={14} color={P.red} />
        <Token x={840} y={1380} at={SLAM} kind="x" label="INJURY" />
      </svg>
      <div style={{ position: "absolute", top: 420, left: 80, right: 100 }}>
        <Rise at={-6}>
          <div style={chalk(140)}>{COPY.hook[0]}</div>
        </Rise>
        <Rise at={6}>
          <div style={chalk(140)}>{COPY.hook[1]}</div>
        </Rise>
        <div style={{ marginTop: 10 }}>
          <SlamText at={SLAM} seed="tactics" color={P.chalk} splitA={P.red} splitB={P.yellow} dust={P.chalk}>
            <div style={{ ...chalk(200, "inherit"), whiteSpace: "nowrap", background: P.red, display: "inline-block", padding: "0 24px" }}>
              {COPY.hookPunch}
            </div>
          </SlamText>
        </div>
      </div>
      <Sfx name="pop" at={2} volume={0.5} />
      <Sfx name="pop" at={8} volume={0.5} />
      <Sfx name="whoosh" at={SLAM - 6} volume={0.35} />
      <Sfx name="impact" at={SLAM} volume={0.4} />
      <Sfx name="alert" at={SLAM + 6} volume={0.3} />
    </AbsoluteFill>
  );
};

// ── 장면 2: 중계 리플레이 + 텔레스트레이터 ───────────────────
const Telestrator: React.FC<{ f: Shot["focus"]; at: number }> = ({ f, at }) => {
  const frame = useCurrentFrame() - at;
  const cy = f.cy - LIFT;
  const draw = interpolate(frame, [0, 12], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const spot = interpolate(frame, [4, 14], [0, 0.55], CLAMP);
  const ring = (frame % 20) / 20;
  const L = Math.PI * (f.hw + f.hh) * 1.1;
  const tagIn = interpolate(frame, [12, 20], [0, 1], { ...CLAMP, easing: EASE_OUT });
  // 태그는 헤드라인(위쪽 ~520px) 아래에 둡니다
  const tagTop = Math.max(cy - f.hh - 300, 560);
  if (frame < 0) return null;
  return (
    <AbsoluteFill>
      {/* 스포트라이트: 대상 밖을 어둡게 */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse ${f.hw * 1.6}px ${Math.max(f.hh, 90) * 1.8}px at ${f.cx}px ${cy}px, transparent 60%, rgba(5,15,8,${spot}) 100%)`,
        }}
      />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <ArrowHeads />
        <ellipse cx={f.cx} cy={cy} rx={f.hw} ry={f.hh} fill="none" stroke={P.yellow} strokeWidth={9} strokeDasharray={L} strokeDashoffset={L * (1 - draw)} style={{ filter: "drop-shadow(0 0 10px rgba(255,212,59,0.8))" }} />
        <ellipse cx={f.cx} cy={cy} rx={f.hw * (1 + ring * 0.25)} ry={f.hh * (1 + ring * 0.25)} fill="none" stroke={P.yellow} strokeWidth={3} opacity={draw * (1 - ring)} />
        <PassArrow d={`M ${Math.min(f.cx + f.hw + 230, 900)} ${tagTop + 100} Q ${f.cx + f.hw + 120} ${cy - f.hh - 40} ${f.cx + f.hw * 0.8} ${cy - f.hh * 0.6}`} at={at + 8} color={P.yellow} len={500} />
      </svg>
      {/* 중계 자막형 태그 */}
      <div
        style={{
          position: "absolute",
          right: 120,
          top: tagTop,
          display: "flex",
          opacity: tagIn,
          transform: `translateX(${(1 - tagIn) * 60}px)`,
          boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
        }}
      >
        <div style={{ background: P.red, color: P.chalk, fontFamily: MONO, fontWeight: 700, fontSize: 26, letterSpacing: 3, padding: "14px 16px" }}>{f.tag}</div>
        <div style={{ background: P.chalk, color: P.ink, fontFamily: SANS, fontWeight: 900, fontSize: 40, padding: "6px 20px" }}>{f.label}</div>
      </div>
    </AbsoluteFill>
  );
};

const ReplayShot: React.FC<{ shot: Shot }> = ({ shot }) => {
  const frame = useCurrentFrame();
  const blink = Math.floor(frame / 8) % 2 === 0;
  return (
    <AbsoluteFill style={{ backgroundColor: P.ink }}>
      <div style={{ position: "absolute", left: 0, top: -LIFT, width: 1080, height: 1920, filter: "saturate(1.15) contrast(1.05)" }}>
        <Video src={staticFile(shot.src)} trimBefore={shot.trimBefore} muted objectFit="cover" style={{ width: 1080, height: 1920 }} />
      </div>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(14,26,18,0.85) 0%, rgba(14,26,18,0) 32%)" }} />
      <Telestrator f={shot.focus} at={6} />
      {/* 헤드라인: 중계 그래픽 박스 */}
      <div style={{ position: "absolute", top: 300, left: 80 }}>
        <Rise at={0}>
          <div style={{ display: "inline-block", background: P.chalk, padding: "4px 20px", ...chalk(76, P.ink), textShadow: "none" }}>{shot.lines[0]}</div>
        </Rise>
        <Rise at={4}>
          <div style={{ display: "inline-block", background: P.grass, padding: "4px 20px", ...chalk(76) }}>{shot.lines[1]}</div>
        </Rise>
      </div>
      {/* 하단 중계 바(캡션 영역) */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1920 - LIFT, bottom: 0, background: P.grass, borderTop: `6px solid ${P.yellow}`, display: "flex", alignItems: "flex-start", padding: "26px 80px", gap: 20, fontFamily: MONO, fontSize: 26, letterSpacing: 3, color: P.chalk }}>
        <span style={{ color: blink ? P.red : P.chalk }}>●</span> REPLAY ANALYSIS · R SPORTS REHAB
      </div>
    </AbsoluteFill>
  );
};

const Cause: React.FC = () => (
  <AbsoluteFill>
    {SHOTS.map((shot, i) => (
      <Sequence key={shot.src} from={i * T.shot} durationInFrames={i === 0 ? T.shot : T.shot + 8} name={shot.focus.tag}>
        <ReplayShot shot={shot} />
        <Sfx name={i === 0 ? "whoosh" : "wipe"} at={0} volume={0.5} />
        <Sfx name="blip" at={10} volume={0.7} />
      </Sequence>
    ))}
  </AbsoluteFill>
);

// ── 장면 3: 라인업 보드 ───────────────────────────────────
const Points: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ys = [700, 960, 1220];
  return (
    <AbsoluteFill>
      <Pitch dim={0.35} />
      <div style={{ position: "absolute", top: 300, left: 80, right: 100 }}>
        <Rise at={0}>
          <div style={{ fontFamily: MONO, fontSize: 26, letterSpacing: 5, color: P.yellow }}>GAME PLAN</div>
        </Rise>
        <Rise at={2}>
          <div style={chalk(80)}>설명회에서 알려드립니다</div>
        </Rise>
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <ArrowHeads />
        <PassArrow d={`M 200 ${ys[0] + 90} L 200 ${ys[1] - 90}`} at={T.step - 4} len={200} />
        <PassArrow d={`M 200 ${ys[1] + 90} L 200 ${ys[2] - 90}`} at={2 * T.step - 4} len={200} />
      </svg>
      {COPY.points.map((p, i) => {
        const at = i * T.step + 2;
        const s = spring({ frame: frame - at, fps, config: { damping: 11, stiffness: 240 } });
        const lab = interpolate(frame, [at + 3, at + 11], [0, 1], { ...CLAMP, easing: EASE_OUT });
        if (frame < at) return null;
        return (
          <div key={p.no} style={{ position: "absolute", left: 120, top: ys[i] - 80, display: "flex", alignItems: "center", gap: 44 }}>
            <div
              style={{
                width: 160,
                height: 160,
                borderRadius: "50%",
                background: i === 1 ? P.chalk : P.red,
                color: i === 1 ? P.ink : P.chalk,
                border: `8px solid ${P.chalk}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: MONO,
                fontWeight: 700,
                fontSize: 64,
                transform: `scale(${s})`,
                boxShadow: "0 10px 24px rgba(0,0,0,0.35)",
              }}
            >
              {p.no}
            </div>
            <div style={{ opacity: lab, transform: `translateX(${(1 - lab) * -30}px)` }}>
              <div style={{ fontFamily: MONO, fontSize: 24, letterSpacing: 4, color: P.yellow }}>{p.en}</div>
              <div style={chalk(84)}>{p.text}</div>
            </div>
          </div>
        );
      })}
      {COPY.points.map((p, i) => (
        <Sfx key={p.no} name="thump" at={i * T.step + 2} volume={0.7} />
      ))}
    </AbsoluteFill>
  );
};

// ── 장면 4: 매치데이 카드 ─────────────────────────────────
const LOGO_AT = 90;
const Info: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const card = spring({ frame, fps, config: { damping: 16, stiffness: 170 } });
  const logo = spring({ frame: frame - LOGO_AT, fps, config: { damping: 16, stiffness: 180 } });
  const cta = useIn(40, 10);
  const pulse = frame > 55 ? 0.5 + 0.5 * Math.sin((frame - 55) / 4) : 0;
  return (
    <AbsoluteFill>
      <Pitch dim={0.45} />
      <div
        style={{
          position: "absolute",
          left: 70,
          right: 110,
          top: 270,
          padding: "44px 46px 50px",
          background: P.navy,
          borderRadius: 28,
          border: `4px solid ${P.chalk}`,
          boxShadow: "0 30px 60px rgba(0,0,0,0.45)",
          transform: `translateY(${(1 - card) * 200}px)`,
          color: P.chalk,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: MONO, fontSize: 26, letterSpacing: 4 }}>
          <span style={{ background: P.red, padding: "6px 14px", fontWeight: 700 }}>MATCH DAY</span>
          <span>12.12 SAT</span>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 24, marginTop: 30 }}>
          <span style={{ fontFamily: MONO, fontSize: 30, letterSpacing: 3, color: P.yellow }}>KICK-OFF</span>
          <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 130, letterSpacing: -4, lineHeight: 1 }}>15:00</span>
        </div>
        <div style={{ fontFamily: MONO, fontSize: 28, letterSpacing: 3, opacity: 0.75, marginTop: 6 }}>FULL TIME 17:00 · {COPY.date}</div>
        <div style={{ height: 3, background: P.chalk, opacity: 0.4, margin: "30px 0" }} />
        <Rise at={10}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 34, opacity: 0.8 }}>{COPY.kicker}</div>
        </Rise>
        {COPY.title.map((l, i) => (
          <Rise key={l} at={13 + i * 3}>
            <div style={chalk(i === 2 ? 104 : 78, i === 2 ? P.yellow : P.chalk)}>{l}</div>
          </Rise>
        ))}
        <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            ["STADIUM", COPY.place],
            ["SQUAD", COPY.target],
          ].map(([k, v], i) => (
            <Rise key={k} at={26 + i * 5}>
              <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
                <span style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 3, width: 150, opacity: 0.7 }}>{k}</span>
                <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 38 }}>{v}</span>
              </div>
            </Rise>
          ))}
        </div>
        <div
          style={{
            marginTop: 30,
            display: "inline-block",
            background: P.red,
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 44,
            padding: "14px 28px",
            borderRadius: 999,
            opacity: cta,
            transform: `scale(${0.8 + cta * 0.2})`,
            transformOrigin: "left center",
            boxShadow: `0 0 0 ${pulse * 12}px rgba(231,20,27,${0.35 * (1 - pulse)})`,
          }}
        >
          {COPY.apply}
        </div>
      </div>
      <div style={{ position: "absolute", left: 80, top: 1445, opacity: logo, transform: `translateY(${(1 - logo) * 24}px)` }}>
        <Img src={staticFile("brand/rsports-logo-white-4x.png")} style={{ width: 380, height: (380 * 352) / 1916 }} />
      </div>
      <Sfx name="whoosh" at={0} volume={0.4} />
      <Sfx name="pop" at={40} volume={0.6} />
      <Sfx name="ding" at={LOGO_AT} volume={0.7} />
    </AbsoluteFill>
  );
};

// 중계 방송 로고·경기 시간(모든 장면 공통)
const Bug: React.FC = () => {
  const frame = useCurrentFrame();
  const sec = Math.floor(frame / 30);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: 160, left: 80, display: "flex", fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: 3, boxShadow: "0 6px 14px rgba(0,0,0,0.3)" }}>
        <span style={{ background: P.chalk, color: P.ink, padding: "8px 14px" }}>R SPORTS</span>
        <span style={{ background: P.red, color: P.chalk, padding: "8px 14px" }}>YOUTH</span>
        <span style={{ background: P.ink, color: P.chalk, padding: "8px 14px" }}>00:{String(sec).padStart(2, "0")}</span>
      </div>
    </AbsoluteFill>
  );
};

export const YouthReelTactics: React.FC<{ music: boolean }> = ({ music }) => (
  <ThemeReel
    bg={P.grass}
    music={music}
    scenes={[Hook, Cause, Points, Info]}
    transitions={[wipe({ direction: "from-left" }), slide({ direction: "from-right" }), wipe({ direction: "from-bottom" })]}
    overlay={<Bug />}
  />
);
