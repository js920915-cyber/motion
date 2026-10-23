import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BrandLogo } from "../components/Brand";
import { Halftone } from "../components/Halftone";
import { PopIcon } from "../components/Icons";
import { Sfx } from "../components/Sfx";
import { useLayout } from "../layout";
import { BEAT, C, CLAMP, EASE_IN_OUT, EASE_OUT, MONO } from "../theme";

// 흰 원이 열리는 프레임. 이후 HUD도 밝은 톤으로 바뀝니다(RSportsPromo 의 lightFrom).
export const LOGO_IRIS = Math.round(1.5 * BEAT);

// 04. 블루 하프톤 동심원 → 흰 원이 열리며 실제 로고 리빌
export const LogoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - 2 * BEAT, fps, config: { damping: 13, stiffness: 150 } });
  // 비트마다 링이 살짝 튀는 펄스
  const pulse = 1 + 0.03 * Math.exp(-(frame % BEAT) / 4);
  const { w, h, portrait } = useLayout();
  const logoW = portrait ? Math.round(w * 0.86) : 940;
  const iris = interpolate(frame, [LOGO_IRIS, LOGO_IRIS + 12], [0, Math.hypot(w, h) / 2 + 50], { ...CLAMP, easing: EASE_IN_OUT });

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ scale: pulse }}>
        <Halftone
          mode="rings"
          color={C.accent}
          reveal={interpolate(frame, [0, 2 * BEAT], [0, 1], { ...CLAMP, easing: EASE_OUT })}
          speed={1.6}
        />
      </AbsoluteFill>

      {/* 흰 원(아이리스)이 열리며 로고 무대가 됨 */}
      <AbsoluteFill style={{ clipPath: `circle(${iris}px at 50% 50%)` }}>
        <AbsoluteFill style={{ backgroundColor: C.paper }} />
        <AbsoluteFill style={{ scale: pulse, opacity: 0.9 }}>
          <Halftone mode="rings" color="#DCE5F4" background={C.paper} hole={portrait ? logoW / 2 + 60 : 560} speed={1.2} />
        </AbsoluteFill>

        {/* 센터 프로그램을 나타내는 의료·재활 아이콘 */}
        <PopIcon name="running" x={0.245 * w} y={0.306 * h} size={110} color={C.navy} at={3 * BEAT} />
        <PopIcon name="heartbeat" x={0.771 * w} y={0.278 * h} size={100} color={C.red} at={3 * BEAT + 3} />
        <PopIcon name="weights" x={0.781 * w} y={0.731 * h} size={104} color={C.navy} at={3.5 * BEAT} />
        <PopIcon name="leg" x={0.224 * w} y={0.713 * h} size={96} color={C.navy} at={3.5 * BEAT + 3} />
        <PopIcon name="firstAid" x={0.3125 * w} y={0.796 * h} size={40} color={C.red} at={4 * BEAT} />
        <PopIcon name="medal" x={0.693 * w} y={0.176 * h} size={78} color={C.navy} at={4 * BEAT + 3} />

        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 46 }}>
          <div style={{ scale: pop, opacity: frame >= 2 * BEAT ? 1 : 0 }}>
            <BrandLogo width={logoW} />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontFamily: MONO,
              fontSize: 20,
              letterSpacing: 5,
              color: C.navy,
              border: `1.5px solid ${C.navy}`,
              padding: "8px 20px",
              background: C.paper,
              opacity: interpolate(frame, [3 * BEAT, 3 * BEAT + 6], [0, 1], CLAMP),
              translate: `0px ${interpolate(frame, [3 * BEAT, 3 * BEAT + 10], [20, 0], { ...CLAMP, easing: EASE_OUT })}px`,
            }}
          >
            <span style={{ width: 10, height: 10, borderRadius: 5, background: C.red }} />
            SPORTS REHABILITATION · MAGOK SEOUL
          </div>
        </AbsoluteFill>
      </AbsoluteFill>

      <Sfx name="riser" at={LOGO_IRIS - 22} volume={0.7} />
      <Sfx name="impact" at={LOGO_IRIS} volume={0.55} />
      <Sfx name="pop" at={2 * BEAT} volume={0.6} />
      <Sfx name="ding" at={3 * BEAT} volume={0.45} />
      {[3, 3.5, 4].map((b) => (
        <Sfx key={b} name="pop" at={b * BEAT} volume={0.3} />
      ))}
    </AbsoluteFill>
  );
};
