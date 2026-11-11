import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Sfx } from "../../components/Sfx";
import { SlamText, useImpactJolt } from "../components/Impact";
import { CLAMP, EASE_OUT, MONO, SANS, Y } from "../theme";

// 0~3초: "우리 아이는 / 왜 맨날 / 다칠까요?" — 세 번째 줄이 비트 2(30프레임)에 쾅 떨어집니다.
const SLAM = 30;

const Line: React.FC<{ at: number; children: React.ReactNode; size: number; color?: string }> = ({
  at,
  children,
  size,
  color = Y.white,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 8], [0, 1], { ...CLAMP, easing: EASE_OUT });
  return (
    <div style={{ overflow: "hidden", paddingBottom: 8 }}>
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: size,
          lineHeight: 1.08,
          letterSpacing: "-0.04em",
          color,
          transform: `translateY(${(1 - p) * 110}%)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

const DotGrid: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `radial-gradient(${Y.line} 2.5px, transparent 2.5px)`,
        backgroundSize: "36px 36px",
        backgroundPosition: `0 ${-frame * 1.2}px`,
        opacity: 0.9,
      }}
    />
  );
};

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const jolt = useImpactJolt(SLAM);
  const after = interpolate(frame, [SLAM + 6, SLAM + 16], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const blink = frame > SLAM + 6 && Math.floor(frame / 5) % 2 === 0;
  const flash = interpolate(frame, [SLAM, SLAM + 4], [0.35, 0], CLAMP);

  return (
    <AbsoluteFill style={{ backgroundColor: Y.bg, overflow: "hidden" }}>
      <DotGrid />
      <AbsoluteFill style={{ transform: jolt, padding: "0 80px", justifyContent: "center", paddingBottom: 120 }}>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 28,
            letterSpacing: 5,
            color: Y.dim,
            marginBottom: 28,
          }}
        >
          FOR PARENTS & COACHES
        </div>
        {/* 첫 프레임(릴스 첫인상)부터 글자가 보이도록 이미 올라오는 중에서 시작 */}
        <Line at={-6} size={132}>
          우리 아이는
        </Line>
        <Line at={6} size={132}>
          왜 맨날
        </Line>
        <div style={{ marginTop: 6 }}>
          <SlamText at={SLAM} seed="hook" color={Y.red}>
            <div
              style={{
                fontFamily: SANS,
                fontWeight: 900,
                fontSize: 210,
                lineHeight: 1.05,
                letterSpacing: "-0.05em",
                whiteSpace: "nowrap",
              }}
            >
              다칠까요?
            </div>
          </SlamText>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 40, opacity: after }}>
          <div style={{ height: 8, width: 300 * after, background: Y.red }} />
          <span
            style={{
              fontFamily: MONO,
              fontWeight: 700,
              fontSize: 28,
              letterSpacing: 4,
              color: blink ? Y.red : Y.white,
            }}
          >
            ▲ INJURY ALERT
          </span>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: Y.white, opacity: frame >= SLAM ? flash : 0 }} />

      <Sfx name="pop" at={6} volume={0.5} />
      <Sfx name="whoosh" at={SLAM - 6} volume={0.35} />
      <Sfx name="impact" at={SLAM} volume={0.4} />
      <Sfx name="alert" at={SLAM + 8} volume={0.35} />
    </AbsoluteFill>
  );
};
