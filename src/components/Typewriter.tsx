import { useCurrentFrame } from "remotion";
import { BEAT, C } from "../theme";

type Props = {
  text: string;
  start?: number;
  // 프레임당 글자 수
  speed?: number;
  cursorColor?: string;
  hideCursorAfter?: number;
  style?: React.CSSProperties;
};

// 한 글자씩 입력되는 헤드라인 + 깜빡이는 블록 커서
export const Typewriter: React.FC<Props> = ({
  text,
  start = 0,
  speed = 0.6,
  cursorColor = C.accent,
  hideCursorAfter = Infinity,
  style,
}) => {
  const frame = useCurrentFrame();
  const chars = Array.from(text);
  const count = Math.max(0, Math.min(chars.length, Math.floor((frame - start) * speed)));
  const typing = count < chars.length;
  const blinkOn = typing || Math.floor(frame / (BEAT / 2)) % 2 === 0;
  const showCursor = frame >= start && frame < hideCursorAfter && blinkOn;

  return (
    <div style={{ whiteSpace: "pre-wrap", ...style }}>
      {chars.slice(0, count).join("")}
      <span
        style={{
          display: "inline-block",
          width: "0.5em",
          height: "0.95em",
          marginLeft: "0.08em",
          verticalAlign: "-0.1em",
          background: cursorColor,
          opacity: showCursor ? 1 : 0,
        }}
      />
    </div>
  );
};
