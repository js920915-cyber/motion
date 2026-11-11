import { Video } from "@remotion/media";
import { wipe } from "@remotion/transitions/wipe";
import { AbsoluteFill, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Sfx } from "../../components/Sfx";
import { useImpactJolt } from "../components/Impact";
import { CLAMP, EASE_OUT, MONO, SANS } from "../theme";
import { COPY, Rise, type Shot, T, ThemeReel, useIn } from "./shared";

// 테마 C — 열화상 스캔(THERMAL SCAN)
// 검은 배경, 영상을 열화상 색(보라→빨강→주황→노랑)으로 바꾸고, 스캔 라인과 관절 열점으로 분석하는 연출.
const P = {
  black: "#06060A",
  white: "#F5F2EE",
  dim: "#8A8494",
  red: "#E7141B",
  orange: "#FF7A1A",
  yellow: "#FFD84A",
  purple: "#2A0B4F",
};
const HEAT = `linear-gradient(90deg, #D02BC9 0%, ${P.red} 38%, ${P.orange} 68%, ${P.yellow} 100%)`;

const SHOTS: Shot[] = [
  {
    src: "clips/single-leg-squat.mp4",
    trimBefore: 30,
    lines: ["무릎이 버티는 힘,", "눈으로 확인합니다"],
    focus: { cx: 560, cy: 1290, hw: 210, hh: 150, tag: "ZONE 01 · KNEE", label: "무릎 정렬" },
  },
  {
    src: "clips/keiser-rotational-press-a.mp4",
    trimBefore: 28,
    lines: ["몸통이 흔들리면", "다리에 부담이 갑니다"],
    focus: { cx: 595, cy: 1020, hw: 180, hh: 170, tag: "ZONE 02 · CORE", label: "몸통 회전" },
  },
];

// 열화상 필터: 밝기만 남긴 뒤 색 지도(보라→빨강→주황→노랑→흰색)로 바꿉니다.
const ThermalDefs: React.FC = () => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <filter id="thermal" colorInterpolationFilters="sRGB">
      <feColorMatrix type="matrix" values="0.3 0.59 0.11 0 0  0.3 0.59 0.11 0 0  0.3 0.59 0.11 0 0  0 0 0 1 0" />
      <feComponentTransfer>
        <feFuncR type="linear" slope="1.35" intercept="-0.12" />
        <feFuncG type="linear" slope="1.35" intercept="-0.12" />
        <feFuncB type="linear" slope="1.35" intercept="-0.12" />
      </feComponentTransfer>
      <feComponentTransfer>
        <feFuncR type="table" tableValues="0.03 0.22 0.55 0.91 1 1 1" />
        <feFuncG type="table" tableValues="0.02 0.03 0.05 0.08 0.48 0.85 1" />
        <feFuncB type="table" tableValues="0.08 0.3 0.62 0.11 0.1 0.29 0.95" />
      </feComponentTransfer>
    </filter>
  </svg>
);

const ThermalVideo: React.FC<{ src: string; trimBefore: number; blur?: number; opacity?: number }> = ({ src, trimBefore, blur = 0, opacity = 1 }) => (
  <AbsoluteFill style={{ filter: `url(#thermal)${blur ? ` blur(${blur}px)` : ""}`, opacity }}>
    <Video src={staticFile(src)} trimBefore={trimBefore} muted objectFit="cover" style={{ width: 1080, height: 1920 }} />
  </AbsoluteFill>
);

const Grid: React.FC<{ opacity?: number }> = ({ opacity = 0.07 }) => (
  <AbsoluteFill
    style={{
      backgroundImage: `linear-gradient(${P.white} 1px, transparent 1px), linear-gradient(90deg, ${P.white} 1px, transparent 1px)`,
      backgroundSize: "90px 90px",
      opacity,
    }}
  />
);

// 위에서 아래로 훑는 스캔 라인
const ScanLine: React.FC<{ period?: number; from?: number; to?: number; offset?: number }> = ({ period = 40, from = 0, to = 1920, offset = 0 }) => {
  const frame = useCurrentFrame();
  const t = (((frame + offset) % period) + period) % period / period;
  const y = from + (to - from) * t;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y - 160, height: 166, pointerEvents: "none" }}>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, transparent, rgba(255,216,74,0.18))` }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 4, background: P.yellow, boxShadow: `0 0 18px ${P.yellow}` }} />
    </div>
  );
};

const heatText = (size: number): React.CSSProperties => ({
  fontFamily: SANS,
  fontWeight: 900,
  fontSize: size,
  lineHeight: 1.1,
  letterSpacing: "-0.045em",
  backgroundImage: HEAT,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
});
const solid = (size: number, color = P.white): React.CSSProperties => ({
  fontFamily: SANS,
  fontWeight: 900,
  fontSize: size,
  lineHeight: 1.1,
  letterSpacing: "-0.045em",
  color,
});

// ── 장면 1: 훅(외곽선 글자 → 열화상 글자 스캔) ─────────────────
const SLAM = 30;
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const jolt = useImpactJolt(SLAM, 0.5);
  const reveal = interpolate(frame, [SLAM - 8, SLAM], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const fill = (at: number) => interpolate(frame, [at + 4, at + 12], [0, 1], CLAMP);
  const flash = interpolate(frame, [SLAM, SLAM + 5], [0.5, 0], CLAMP);
  return (
    <AbsoluteFill style={{ backgroundColor: P.black }}>
      <ThermalVideo src="clips/keiser-rotational-press-b.mp4" trimBefore={0} blur={26} opacity={0.45} />
      <Grid />
      <AbsoluteFill style={{ transform: jolt }}>
        <div style={{ position: "absolute", top: 470, left: 80, right: 100 }}>
          {COPY.hook.map((l, i) => (
            <Rise key={l} at={i === 0 ? -6 : 6}>
              <div style={{ ...solid(140), WebkitTextStroke: `3px ${P.white}`, color: `rgba(245,242,238,${fill(i === 0 ? -6 : 6)})` }}>{l}</div>
            </Rise>
          ))}
          <div style={{ position: "relative", marginTop: 10, clipPath: `inset(0 0 ${(1 - reveal) * 100}% 0)` }}>
            <div style={{ ...heatText(210), whiteSpace: "nowrap" }}>{COPY.hookPunch}</div>
            {reveal < 1 && reveal > 0 ? (
              <div style={{ position: "absolute", left: -80, right: -100, top: `${reveal * 100}%`, height: 4, background: P.yellow, boxShadow: `0 0 20px ${P.yellow}` }} />
            ) : null}
          </div>
          <div style={{ fontFamily: MONO, fontSize: 28, letterSpacing: 4, color: P.orange, marginTop: 30, opacity: useIn(SLAM + 8) }}>
            ▲ HIGH RISK ZONE DETECTED
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: P.yellow, opacity: frame >= SLAM ? flash : 0, mixBlendMode: "screen" }} />
      <Sfx name="type-1" at={0} volume={0.5} />
      <Sfx name="type-2" at={8} volume={0.5} />
      <Sfx name="riser" at={SLAM - 10} volume={0.35} />
      <Sfx name="impact" at={SLAM} volume={0.4} />
    </AbsoluteFill>
  );
};

// ── 장면 2: 열화상 영상 + 관절 열점 ─────────────────────────
const HotSpot: React.FC<{ f: Shot["focus"]; at: number }> = ({ f, at }) => {
  const frame = useCurrentFrame() - at;
  if (frame < 0) return null;
  const grow = interpolate(frame, [0, 10], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const pulse = 0.5 + 0.5 * Math.sin(frame / 3);
  const rings = [0, 1, 2].map((k) => ((frame + k * 10) % 30) / 30);
  const lead = interpolate(frame, [8, 16], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const lx = 1080 - 110;
  const tick = 30;
  const corners = [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1],
  ];
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: f.cx - f.hw,
          top: f.cy - f.hh,
          width: f.hw * 2,
          height: f.hh * 2,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(255,255,255,${0.75 * grow}) 0%, rgba(255,216,74,${0.55 * grow}) 22%, rgba(255,122,26,${0.35 * grow}) 45%, transparent 70%)`,
          mixBlendMode: "screen",
          transform: `scale(${0.85 + pulse * 0.15})`,
        }}
      />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {rings.map((r, k) => (
          <ellipse key={k} cx={f.cx} cy={f.cy} rx={f.hw * (0.4 + r * 0.9)} ry={f.hh * (0.4 + r * 0.9)} fill="none" stroke={P.yellow} strokeWidth={2.5} opacity={grow * (1 - r)} />
        ))}
        {corners.map(([sx, sy]) => {
          const x = f.cx + sx * f.hw * (1.6 - grow * 0.5);
          const y = f.cy + sy * f.hh * (1.6 - grow * 0.5);
          return <path key={`${sx}${sy}`} d={`M ${x} ${y - sy * tick} L ${x} ${y} L ${x - sx * tick} ${y}`} stroke={P.white} strokeWidth={4} fill="none" opacity={grow} />;
        })}
        <line x1={f.cx + f.hw * 1.1} y1={f.cy} x2={f.cx + f.hw * 1.1 + (lx - f.cx - f.hw * 1.1) * lead} y2={f.cy} stroke={P.white} strokeWidth={3} />
        <circle cx={f.cx} cy={f.cy} r={8} fill={P.white} opacity={grow} />
      </svg>
      <div style={{ position: "absolute", right: 110, top: f.cy - 130, textAlign: "right", opacity: lead, background: "rgba(6,6,10,0.72)", padding: "12px 18px", borderRight: `5px solid ${P.yellow}` }}>
        <div style={{ fontFamily: MONO, fontSize: 24, letterSpacing: 3, color: P.yellow }}>{f.tag}</div>
        <div style={{ ...solid(56), textShadow: "0 2px 14px rgba(0,0,0,0.7)" }}>{f.label}</div>
        <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 3, color: P.white, opacity: 0.8, marginTop: 6 }}>
          TRACKING {"▮".repeat(1 + (Math.floor(frame / 3) % 5))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const ScanShot: React.FC<{ shot: Shot }> = ({ shot }) => {
  const frame = useCurrentFrame();
  const flash = interpolate(frame, [0, 4], [0.5, 0], CLAMP);
  return (
    <AbsoluteFill style={{ backgroundColor: P.black }}>
      <ThermalVideo src={shot.src} trimBefore={shot.trimBefore} />
      <Grid opacity={0.06} />
      <ScanLine period={45} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(6,6,10,0.95) 0%, rgba(6,6,10,0.8) 24%, rgba(6,6,10,0) 42%)" }} />
      <HotSpot f={shot.focus} at={6} />
      <div style={{ position: "absolute", top: 290, left: 80, right: 110 }}>
        <Rise at={0}>
          <div style={solid(88)}>{shot.lines[0]}</div>
        </Rise>
        <Rise at={4}>
          {/* 열화상 영상 위에서는 그라데이션 글자가 묻혀서 노란 단색 */}
          <div style={{ ...solid(88, P.yellow), textShadow: "0 3px 18px rgba(0,0,0,0.8)" }}>{shot.lines[1]}</div>
        </Rise>
      </div>
      <AbsoluteFill style={{ backgroundColor: P.white, opacity: flash, mixBlendMode: "screen" }} />
    </AbsoluteFill>
  );
};

const Cause: React.FC = () => (
  <AbsoluteFill>
    {SHOTS.map((shot, i) => (
      <Sequence key={shot.src} from={i * T.shot} durationInFrames={i === 0 ? T.shot : T.shot + 8} name={shot.focus.tag}>
        <ScanShot shot={shot} />
        <Sfx name={i === 0 ? "whoosh" : "shutter"} at={0} volume={0.5} />
        <Sfx name="blip" at={8} volume={0.6} />
        <Sfx name="blip-low" at={16} volume={0.6} />
      </Sequence>
    ))}
  </AbsoluteFill>
);

// ── 장면 3: 스캔 결과 3가지 ───────────────────────────────
const Points: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: P.black }}>
      <ThermalVideo src="clips/landmine-press.mp4" trimBefore={39} blur={22} opacity={0.4} />
      <Grid />
      <div style={{ position: "absolute", top: 290, left: 80, right: 110 }}>
        <Rise at={0}>
          <div style={{ fontFamily: MONO, fontSize: 26, letterSpacing: 5, color: P.orange }}>SCAN RESULT · 3 ITEMS</div>
        </Rise>
        <Rise at={2}>
          <div style={solid(80)}>설명회에서 알려드립니다</div>
        </Rise>
      </div>
      <div style={{ position: "absolute", top: 600, left: 80, right: 110, display: "flex", flexDirection: "column", gap: 54 }}>
        {COPY.points.map((p, i) => {
          const at = i * T.step + 2;
          const local = frame - at;
          const r = interpolate(local, [0, 8], [0, 1], { ...CLAMP, easing: EASE_OUT });
          const bar = interpolate(local, [4, 14], [0, 1], { ...CLAMP, easing: EASE_OUT });
          return (
            <div key={p.no} style={{ position: "relative", clipPath: `inset(0 0 ${(1 - r) * 100}% 0)` }}>
              <div style={{ display: "flex", gap: 18, alignItems: "center", fontFamily: MONO, fontSize: 24, letterSpacing: 3 }}>
                <span style={{ background: P.orange, color: P.black, padding: "4px 10px", fontWeight: 700 }}>[{p.no}]</span>
                <span style={{ color: P.dim }}>DETECTED — {p.en}</span>
              </div>
              <div style={{ ...solid(92), marginTop: 8 }}>{p.text}</div>
              <div style={{ height: 10, marginTop: 10, width: `${bar * 100}%`, backgroundImage: HEAT }} />
              {r > 0 && r < 1 ? <div style={{ position: "absolute", left: 0, right: 0, top: `${r * 100}%`, height: 4, background: P.yellow, boxShadow: `0 0 16px ${P.yellow}` }} /> : null}
            </div>
          );
        })}
      </div>
      {COPY.points.map((p, i) => (
        <Sfx key={p.no} name="blip" at={i * T.step + 2} volume={0.8} />
      ))}
    </AbsoluteFill>
  );
};

// ── 장면 4: 정보 ─────────────────────────────────────────
const LOGO_AT = 90;
const Info: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = spring({ frame: frame - LOGO_AT, fps, config: { damping: 16, stiffness: 180 } });
  const cta = useIn(40, 10);
  const pulse = frame > 55 ? 0.5 + 0.5 * Math.sin((frame - 55) / 4) : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: P.black }}>
      <Grid />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 80% 20%, rgba(231,20,27,0.35), transparent 55%), radial-gradient(ellipse at 10% 90%, rgba(123,44,191,0.35), transparent 55%)` }} />
      <div style={{ position: "absolute", top: 270, left: 80, right: 110, color: P.white }}>
        <Rise at={0}>
          <div style={{ fontFamily: MONO, fontSize: 26, letterSpacing: 6, color: P.orange }}>SCHEDULE</div>
        </Rise>
        <Rise at={2} len={10}>
          <div style={{ ...heatText(250), lineHeight: 1 }}>12.12</div>
        </Rise>
        <Rise at={6}>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 40, letterSpacing: 3 }}>SAT · {COPY.time}</div>
        </Rise>
        <div style={{ height: 2, background: P.white, opacity: 0.3, margin: "34px 0 30px" }} />
        <Rise at={12}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 36, color: P.dim }}>{COPY.kicker}</div>
        </Rise>
        {COPY.title.map((l, i) => (
          <Rise key={l} at={15 + i * 3}>
            <div style={i === 2 ? heatText(112) : solid(84)}>{l}</div>
          </Rise>
        ))}
        <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            ["LOCATION", COPY.place],
            ["FOR", COPY.target],
          ].map(([k, v], i) => (
            <Rise key={k} at={28 + i * 5}>
              <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
                <span style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 3, width: 160, color: P.dim }}>{k}</span>
                <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 40 }}>{v}</span>
              </div>
            </Rise>
          ))}
        </div>
        <div
          style={{
            marginTop: 30,
            display: "inline-block",
            backgroundImage: `linear-gradient(90deg, ${P.red}, ${P.orange})`,
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 44,
            padding: "14px 28px",
            opacity: cta,
            transform: `translateY(${(1 - cta) * 20}px)`,
            boxShadow: `0 0 ${20 + pulse * 30}px rgba(255,122,26,${0.35 + pulse * 0.3})`,
          }}
        >
          {COPY.apply}
        </div>
      </div>
      <div style={{ position: "absolute", left: 80, top: 1440, opacity: logo, transform: `translateY(${(1 - logo) * 24}px)` }}>
        <Img src={staticFile("brand/rsports-logo-white-4x.png")} style={{ width: 400, height: (400 * 352) / 1916 }} />
      </div>
      <ScanLine period={150} from={0} to={2200} />
      <Sfx name="riser" at={0} volume={0.3} />
      <Sfx name="pop" at={40} volume={0.6} />
      <Sfx name="ding" at={LOGO_AT} volume={0.7} />
    </AbsoluteFill>
  );
};

// 카메라 뷰파인더(모든 장면 공통)
const Viewfinder: React.FC = () => {
  const frame = useCurrentFrame();
  const rec = Math.floor(frame / 10) % 2 === 0;
  const zone = frame < 90 ? "STANDBY" : frame < 210 ? "SCANNING" : frame < 300 ? "RESULT" : "BOOKING";
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <ThermalDefs />
      {[
        [44, 44, 1, 1],
        [1036, 44, -1, 1],
        [44, 1876, 1, -1],
        [1036, 1876, -1, -1],
      ].map(([x, y, sx, sy]) => (
        <div key={`${x}${y}`} style={{ position: "absolute", left: sx > 0 ? x : x - 40, top: sy > 0 ? y : y - 40, width: 40, height: 40, [sy > 0 ? "borderTop" : "borderBottom"]: `3px solid ${P.white}`, [sx > 0 ? "borderLeft" : "borderRight"]: `3px solid ${P.white}`, opacity: 0.7 }} />
      ))}
      <div style={{ position: "absolute", top: 165, left: 80, right: 110, display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 22, letterSpacing: 3, color: P.white }}>
        <span>
          <span style={{ color: rec ? P.red : "transparent" }}>●</span> REC · THERMAL MOTION SCAN
        </span>
        <span style={{ color: P.yellow }}>{zone}</span>
      </div>
    </AbsoluteFill>
  );
};

export const YouthReelScan: React.FC<{ music: boolean }> = ({ music }) => (
  <ThemeReel
    bg={P.black}
    music={music}
    scenes={[Hook, Cause, Points, Info]}
    transitions={[wipe({ direction: "from-top" }), wipe({ direction: "from-left" }), wipe({ direction: "from-top" })]}
    overlay={<Viewfinder />}
  />
);
