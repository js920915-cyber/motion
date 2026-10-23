import { Audio } from "@remotion/media";
import { Sequence, staticFile } from "remotion";

// public/sfx 의 효과음. 소리 자체는 scripts/make_sfx.py 로 다시 만들 수 있습니다.
export type SfxName =
  | "type-1"
  | "type-2"
  | "type-3"
  | "tick"
  | "blip"
  | "blip-low"
  | "pop"
  | "whoosh"
  | "wipe"
  | "impact"
  | "thump"
  | "alert"
  | "riser"
  | "ding";

// 효과음 전체 볼륨(배경음악 대비). 너무 크거나 작으면 여기만 조절하세요.
export const SFX_VOLUME = 0.8;

// at 프레임(장면 기준)에 효과음 1회 재생
export const Sfx: React.FC<{ name: SfxName; at?: number; volume?: number }> = ({ name, at = 0, volume = 1 }) => (
  <Sequence from={Math.round(at)} layout="none" name={`SFX ${name}`}>
    <Audio src={staticFile(`sfx/${name}.wav`)} volume={volume * SFX_VOLUME} />
  </Sequence>
);
