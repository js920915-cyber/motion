"""배경음악 생성: 원곡에서 필요한 구간을 잘라 이어 붙여 public/bgm.wav 로 저장합니다.

    python3 scripts/make_bgm.py

원곡: "Dance Electro 120 bpm" by LiteSaturation (Pixabay)
https://pixabay.com/music/dance-dance-electro-120-bpm-full-12086/
Pixabay Content License — 상업적 이용 가능, 출처 표기 불필요.

원곡 구성(120 BPM, 박자는 정확히 0.5초 간격, 2초=1마디): 도입 → 드롭 17초 → 브레이크 → 드롭 81초 → 엔딩 113초.
76초부터 쓰면 81초 드롭이 영상 5초(현장 장면 시작)에 맞습니다.
영상이 35초라 드롭 안에서 89~93초 두 마디(앞뒤 소리가 가장 비슷한 곳)를 빼서
113초 엔딩이 영상 33초에 오고 35초에 자연스럽게 끝나도록 했습니다.
"""

import subprocess
import wave
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "music" / "litesaturation-dance-electro-120-bpm-full-12086.mp3"
OUT = ROOT / "public" / "bgm.wav"

SR = 44100
# 원곡에서 이어 붙일 구간(초). 경계는 마디 단위(2초)로만 옮기세요.
SEGMENTS = [(76.0, 89.0), (93.0, 115.0)]
SEAM = 0.02  # 이음새 크로스페이드(초)
FADE_IN = 0.15
FADE_OUT = 1.0


def read(start: float, end: float) -> np.ndarray:
    raw = subprocess.run(
        ["ffmpeg", "-loglevel", "error", "-ss", str(start), "-t", str(end - start + SEAM), "-i", str(SRC),
         "-ac", "2", "-ar", str(SR), "-f", "s16le", "-"],
        capture_output=True,
        check=True,
    ).stdout
    return np.frombuffer(raw, dtype=np.int16).reshape(-1, 2).astype(np.float64)


xf = int(SR * SEAM)
out = np.zeros((0, 2))
for start, end in SEGMENTS:
    seg = read(start, end)
    n = int(round((end - start) * SR))
    if len(out) == 0:
        out = seg[:n]
        tail = seg[n : n + xf]
        continue
    # 앞 구간에서 이어질 뻔한 소리(tail)와 새 구간 머리를 짧게 겹쳐 클릭 방지
    r = np.linspace(0, 1, xf)[:, None]
    head = seg[:xf] * r + tail[: len(seg[:xf])] * (1 - r)
    out = np.concatenate([out, head, seg[xf:n]])
    tail = seg[n : n + xf]

total = len(out)
env = np.ones(total)
fi, fo = int(SR * FADE_IN), int(SR * FADE_OUT)
env[:fi] = np.linspace(0, 1, fi)
env[-fo:] = np.linspace(1, 0, fo)
out = np.clip(out * env[:, None], -32768, 32767).astype(np.int16)

with wave.open(str(OUT), "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(out.tobytes())
print(f"{OUT.relative_to(ROOT)}: {total / SR:.2f}초, 구간 {SEGMENTS}")
