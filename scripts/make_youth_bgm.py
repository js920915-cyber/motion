"""유소년 설명회 릴스(15초)용 배경음악: public/youth/bgm.wav

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

OUT.parent.mkdir(parents=True, exist_ok=True)
subprocess.run(
    [
        "ffmpeg", "-loglevel", "error", "-y",
        "-ss", str(START), "-t", str(LENGTH), "-i", str(SRC),
        "-af", f"afade=t=in:d={FADE_IN},afade=t=out:st={LENGTH - FADE_OUT}:d={FADE_OUT}",
        "-ac", "2", "-ar", "44100", str(OUT),
    ],
    check=True,
)
print(f"wrote {OUT}")
