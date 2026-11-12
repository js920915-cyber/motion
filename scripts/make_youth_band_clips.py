"""드라이브 '유소년 설명회' 폴더 영상 → R4 형식 가운데 띠(1080x608)용 4초 클립

    python3 scripts/make_youth_band_clips.py <드라이브 영상 폴더>

원본 파일명은 드라이브 기준(영문으로 바꿔 저장한 이름). center 는 세로 영상에서 띠를 잘라낼 세로 위치(0~1).
"""
import subprocess
import sys
from pathlib import Path

SRC = Path(sys.argv[1])
OUT = Path(__file__).resolve().parent.parent / "public" / "youth" / "band"
OUT.mkdir(parents=True, exist_ok=True)

# 이름, 원본(드라이브 원래 이름), 시작(초), 길이, 띠 중심(세로 비율)
CLIPS = [
    ("dribble-a", "dribble.mp4", 1.0, 4, 0.55),  # 유소년 드리블 살짝 노란옷.mp4
    ("dribble-b", "dribble.mp4", 5.0, 4, 0.56),
    ("blazepod-side", "blazepod.mp4", 0.5, 4, 0.60),  # blazepod.mp4
    ("blazepod-front", "blazepod.mp4", 7.0, 4, 0.58),
    ("hexbar-youth", "hexbar-eccentric.mp4", 3.5, 4, 0.62),  # hexbar eccentric.mp4
    ("keiser-youth", "keiser-push.mp4", 1.5, 4, 0.62),  # keiser push.mp4
    ("hurdle-drag", "hurdle-side-drag.mov", 0.2, 4, 0.46),  # 허들사이드 드래그.MOV
    ("nonmotor-coach", "nonmotor-speed.mov", 0.0, 4, 0.47),  # 무동력 스피드.MOV
    ("plate-jump", "switch-plate.mov", 1.0, 4, 0.66),  # 짧게스위치 플레이트.MOV
    ("plate-coach", "switch-plate.mov", 13.0, 4, 0.44),
    ("ladder-coach", "switch-short.mov", 9.0, 4, 0.45),  # 짧게 스위치.MOV
]

for name, src, ss, dur, c in CLIPS:
    top = max(0, min(1920 - 608, round(c * 1920 - 304)))
    vf = f"scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,crop=1080:608:0:{top},fps=30,format=yuv420p"
    subprocess.run(
        ["ffmpeg", "-nostdin", "-v", "error", "-y", "-ss", str(ss), "-t", str(dur), "-i", str(SRC / src), "-an",
         "-vf", vf, "-c:v", "libx264", "-crf", "22", "-preset", "medium", "-movflags", "+faststart", str(OUT / f"{name}.mp4")],
        check=True,
    )
    print(name, (OUT / f"{name}.mp4").stat().st_size // 1024, "KB")
