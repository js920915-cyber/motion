"""드라이브 '유소년 설명회' 영상 + 센터 촬영본 → R4 형식 가운데 띠(1080x608)용 구간 클립(약 3~4초)

    python3 scripts/make_youth_band_clips.py <드라이브 영상 폴더>

원본 파일명은 드라이브 기준(영문으로 바꿔 저장한 이름). center 는 세로 영상에서 띠를 잘라낼 세로 위치(0~1).
"""
import subprocess
import sys
from pathlib import Path

SRC = Path(sys.argv[1])
OUT = Path(__file__).resolve().parent.parent / "public" / "youth" / "band"
OUT.mkdir(parents=True, exist_ok=True)

# 이름, 원본, 시작(초), 길이(초), 띠 중심(세로 비율)
# 원본: 드라이브 '유소년 설명회' 영상(영문 이름으로 받은 파일) 또는 "repo:" = 저장소 public/ 안의 센터 촬영본
# 같은 원본이라도 구간·띠 위치를 달리해 서로 다른 장면이 되게 했습니다.
CLIPS = [
    # 유소년 드리블 살짝 노란옷.mp4 (12초, 60fps)
    ("dribble-a", "dribble.mp4", 0.8, 3.8, 0.55),
    ("dribble-b", "dribble.mp4", 4.6, 3.8, 0.56),
    ("dribble-c", "dribble.mp4", 8.2, 3.8, 0.55),
    # blazepod.mp4 (12.9초: 0~6.5 옆모습, 7~12.9 정면)
    ("blazepod-side-a", "blazepod.mp4", 0.3, 3.2, 0.60),
    ("blazepod-side-b", "blazepod.mp4", 3.3, 3.2, 0.58),
    ("blazepod-front-a", "blazepod.mp4", 7.0, 3.0, 0.58),
    ("blazepod-front-b", "blazepod.mp4", 9.9, 3.0, 0.54),
    # hexbar eccentric.mp4 (10.2초, 4K)
    ("hexbar-a", "hexbar-eccentric.mp4", 0.3, 3.8, 0.62),
    ("hexbar-b", "hexbar-eccentric.mp4", 3.6, 3.4, 0.46),
    ("hexbar-c", "hexbar-eccentric.mp4", 6.6, 3.6, 0.70),
    # keiser push.mp4 (7.6초, 4K)
    ("keiser-a", "keiser-push.mp4", 0.2, 3.7, 0.62),
    ("keiser-b", "keiser-push.mp4", 3.8, 3.7, 0.50),
    # 허들사이드 드래그.MOV (5.4초)
    ("hurdle-a", "hurdle-side-drag.mov", 0.0, 2.8, 0.46),
    ("hurdle-b", "hurdle-side-drag.mov", 2.6, 2.8, 0.60),
    # 무동력 스피드.MOV (28초)
    ("nonmotor-a", "nonmotor-speed.mov", 0.0, 3.8, 0.47),
    ("nonmotor-b", "nonmotor-speed.mov", 9.0, 3.8, 0.64),
    ("nonmotor-c", "nonmotor-speed.mov", 20.0, 3.8, 0.42),
    # 짧게스위치 플레이트.MOV (21.9초)
    ("plate-jump-a", "switch-plate.mov", 1.0, 3.8, 0.66),
    ("plate-jump-b", "switch-plate.mov", 6.0, 3.8, 0.58),
    ("plate-coach-a", "switch-plate.mov", 13.0, 3.8, 0.44),
    ("plate-coach-b", "switch-plate.mov", 17.0, 3.8, 0.46),
    # 짧게 스위치.MOV (14.8초)
    ("ladder-a", "switch-short.mov", 0.5, 3.8, 0.62),
    ("ladder-b", "switch-short.mov", 4.8, 3.8, 0.52),
    ("ladder-coach", "switch-short.mov", 9.0, 3.8, 0.45),
    # 센터 촬영본(저장소)
    ("single-leg-squat", "repo:clips/single-leg-squat.mp4", 0.6, 3.8, 0.66),
    ("landmine", "repo:clips/landmine-press.mp4", 1.2, 3.8, 0.62),
    ("rot-press-a", "repo:clips/keiser-rotational-press-a.mp4", 0.8, 3.8, 0.56),
    ("rot-press-b", "repo:clips/keiser-rotational-press-b.mp4", 4.2, 3.8, 0.56),
    ("medball", "repo:clips/medicine-ball-throw.mp4", 0.0, 3.0, 0.55),
    ("balance", "repo:media/balance.mp4", 0.0, 4.2, 0.64),
    ("band-oscillation", "repo:media/bar-oscillation.mp4", 0.0, 3.36, 0.42),
    ("keiser-press", "repo:media/keiser-press.mp4", 0.0, 4.2, 0.56),
]

REPO_PUBLIC = Path(__file__).resolve().parent.parent / "public"

for name, src, ss, dur, c in CLIPS:
    path = REPO_PUBLIC / src[5:] if src.startswith("repo:") else SRC / src
    top = max(0, min(1920 - 608, round(c * 1920 - 304)))
    vf = f"scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,crop=1080:608:0:{top},fps=30,format=yuv420p"
    subprocess.run(
        ["ffmpeg", "-nostdin", "-v", "error", "-y", "-ss", str(ss), "-t", str(dur), "-i", str(path), "-an",
         "-vf", vf, "-c:v", "libx264", "-crf", "22", "-preset", "medium", "-movflags", "+faststart", str(OUT / f"{name}.mp4")],
        check=True,
    )
    print(name, (OUT / f"{name}.mp4").stat().st_size // 1024, "KB")
