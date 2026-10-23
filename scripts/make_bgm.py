"""배경음악 생성: 원곡에서 영상 길이만큼 잘라 public/bgm.wav 로 저장합니다.

    python3 scripts/make_bgm.py

원곡: "Dance Electro 120 bpm" by LiteSaturation (Pixabay)
https://pixabay.com/music/dance-dance-electro-120-bpm-full-12086/
Pixabay Content License — 상업적 이용 가능, 출처 표기 불필요.

원곡 구성(120 BPM, 박자는 정확히 0.5초 간격): 도입 → 드롭 17초 → 브레이크 → 드롭 81초 → 엔딩 113초.
76초부터 자르면 81초 드롭이 영상 5초(현장 장면 시작)에, 113초 엔딩이 영상 37초에 맞습니다.
"""

import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "music" / "litesaturation-dance-electro-120-bpm-full-12086.mp3"
OUT = ROOT / "public" / "bgm.wav"

START = 76.0  # 원곡에서 자르기 시작하는 지점(초). 박자 단위(0.5초)로만 옮기세요.
DURATION = 39.0  # 영상 길이(초)
FADE_IN = 0.15
FADE_OUT = 1.0

subprocess.run(
    [
        "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
        "-ss", str(START), "-t", str(DURATION), "-i", str(SRC),
        "-af", f"afade=t=in:d={FADE_IN},afade=t=out:st={DURATION - FADE_OUT}:d={FADE_OUT}",
        "-ar", "44100", "-ac", "2", "-c:a", "pcm_s16le", str(OUT),
    ],
    check=True,
)
print(f"{OUT.relative_to(ROOT)}: 원곡 {START}~{START + DURATION}초")
