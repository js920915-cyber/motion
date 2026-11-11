import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Sfx } from "../../components/Sfx";
import { CLAMP, EASE_OUT, MONO, SANS, Y } from "../theme";

// 10~15초: 설명회 제목 + 일시·장소·대상·신청 표(Remocn "rsvp" 구성) + 로고
// 문구는 드라이브의 포스터(26.12.12 유소년 설명회 홍보 포스터)와 같습니다.
const ROWS = [
  { label: "일시", value: "2026.12.12 (토) 15:00–17:00" },
  { label: "장소", value: "R스포츠재활센터 (강서구 마곡)" },
  { label: "대상", value: "학부모 · 지도자" },
  // 영상 속 QR은 찍을 수 없으므로 릴스에서는 프로필 링크로 안내(포스터는 QR 접수)
  { label: "신청", value: "인스타 프로필 링크에서 신청", highlight: true },
];
const ROW_AT = 22;
const ROW_STEP = 7;
const LOGO_AT = 90; // 음악 엔딩(영상 13초)에 맞춤

const Rise: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 9], [0, 1], { ...CLAMP, easing: EASE_OUT });
  return (
    <div style={{ overflow: "hidden" }}>
      <div style={{ transform: `translateY(${(1 - p) * 110}%)` }}>{children}</div>
    </div>
  );
};

const title = (size: number, color: string): React.CSSProperties => ({
  fontFamily: SANS,
  fontWeight: 900,
  fontSize: size,
  lineHeight: 1.12,
  letterSpacing: "-0.045em",
  color,
});

export const InfoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rule = interpolate(frame, [14, 26], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const logo = spring({ frame: frame - LOGO_AT, fps, config: { damping: 16, stiffness: 180 } });
  const lastAt = ROW_AT + (ROWS.length - 1) * ROW_STEP;
  const pulse = frame > lastAt + 10 ? 0.5 + 0.5 * Math.sin((frame - lastAt) / 4) : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: Y.paper }}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${Y.light} 2px, transparent 2px), linear-gradient(90deg, ${Y.light} 2px, transparent 2px)`,
          backgroundSize: "60px 60px",
        }}
      />
      <div style={{ position: "absolute", top: 300, left: 80, right: 120 }}>
        <Rise at={0}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 40, color: Y.muted, marginBottom: 12 }}>
            재활/퍼포먼스 향상을 위한
          </div>
        </Rise>
        <Rise at={3}>
          <div style={title(104, Y.ink)}>유소년 축구선수</div>
        </Rise>
        <Rise at={6}>
          <div style={title(104, Y.navy)}>부상예방 및 관리</div>
        </Rise>
        <Rise at={9}>
          <div style={title(150, Y.red)}>설명회</div>
        </Rise>

        <div style={{ height: 6, background: Y.ink, marginTop: 34, width: `${rule * 100}%` }} />

        <div style={{ marginTop: 10 }}>
          {ROWS.map((r, i) => {
            const at = ROW_AT + i * ROW_STEP;
            const p = interpolate(frame, [at, at + 8], [0, 1], { ...CLAMP, easing: EASE_OUT });
            return (
              <div
                key={r.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: 104,
                  borderBottom: `2px solid ${Y.rule}`,
                  opacity: p,
                  transform: `translateX(${(1 - p) * 40}px)`,
                }}
              >
                <div style={{ width: 150, fontFamily: SANS, fontWeight: 700, fontSize: 38, color: Y.muted }}>{r.label}</div>
                {r.highlight ? (
                  <div
                    style={{
                      fontFamily: SANS,
                      fontWeight: 900,
                      fontSize: 50,
                      color: Y.white,
                      background: Y.red,
                      padding: "4px 22px",
                      boxShadow: `0 0 0 ${pulse * 10}px rgba(231,20,27,${0.25 * (1 - pulse)})`,
                    }}
                  >
                    {r.value}
                  </div>
                ) : (
                  <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 48, color: Y.ink, letterSpacing: "-0.02em" }}>
                    {r.value}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 80,
          top: 1395,
          display: "flex",
          alignItems: "center",
          gap: 28,
          opacity: logo,
          transform: `translateY(${(1 - logo) * 30}px)`,
        }}
      >
        <Img src={staticFile("brand/rsports-logo-4x.png")} style={{ width: 470, height: (470 * 436) / 1944 }} />
        <span style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 3, color: Y.muted }}>2026.12.12 SAT</span>
      </div>

      {ROWS.map((r, i) => (
        <Sfx key={r.label} name="tick" at={ROW_AT + i * ROW_STEP} volume={0.7} />
      ))}
      <Sfx name="ding" at={LOGO_AT} volume={0.8} />
    </AbsoluteFill>
  );
};
