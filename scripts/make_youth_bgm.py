"""유소년 설명회 릴스용 배경음악

- public/youth/bgm.wav      : 15초 버전(YouthSeminarReel, 박자에 맞춘 버전)
- public/youth/bgm-free.wav : 20초 버전(테마 3종, 박자와 무관 — 영상 끝에서 코드로 페이드아웃)

    python3 scripts/make_youth_bgm.py

원곡: "Dance Electro 120 bpm" by LiteSaturation (Pixabay, Pixabay Content License)
원곡 구성(120 BPM, 2초=1마디): 드롭 81초 → 엔딩 113초.
100초부터 15초를 쓰면 드롭 한가운데에서 바로 시작하고(훅),
113초 엔딩이 영상 13초(로고 등장)에 와서 15초에 자연스럽게 끝납니다.
"""

import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "music" / "litesaturation-dance-electro-120-bpm-full-12086.mp3"
OUT = ROOT / "public" / "youth" / "bgm.wav"

START = 100.0  # 마디 경계(짝수 초)로만 옮기세요
LENGTH = 15.0
FADE_IN = 0.05
FADE_OUT = 0.8

# 테마 3종: 81초 드롭부터 20초(첫 프레임부터 드롭이 터짐). 끝 페이드는 Remotion에서 처리.
FREE_OUT = ROOT / "public" / "youth" / "bgm-free.wav"
FREE_START = 81.0
FREE_LENGTH = 20.0


def cut(start: float, length: float, out: Path, fade_out: bool) -> None:
    af = f"afade=t=in:d={FADE_IN}"
    if fade_out:
        af += f",afade=t=out:st={length - FADE_OUT}:d={FADE_OUT}"
    subprocess.run(
        ["ffmpeg", "-loglevel", "error", "-y", "-ss", str(start), "-t", str(length), "-i", str(SRC),
         "-af", af, "-ac", "2", "-ar", "44100", str(out)],
        check=True,
    )
    print(f"wrote {out}")


OUT.parent.mkdir(parents=True, exist_ok=True)
cut(START, LENGTH, OUT, fade_out=True)
cut(FREE_START, FREE_LENGTH, FREE_OUT, fade_out=False)
