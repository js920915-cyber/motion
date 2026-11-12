# R4 형식 유소년 설명회 릴스 (드라이브 실제 영상 + 실제 커리큘럼)

## 왜 다시 만들었나

이전 버전들의 문제
1. 드라이브 '유소년 설명회' 폴더 목록을 첫 페이지만 봐서 **영상 9개 중 하나도 못 썼음**
2. 폴더의 **실제 커리큘럼(5개)** 대신 임의로 만든 3개 주제를 씀
3. 레퍼런스 영상을 실제로 보지 못하고(유튜브·비메오 차단) 요약 글만 읽어 기존 틀을 반복

이번 버전
- 기준: 드라이브의 직접 만든 릴스 **'릴스_R4_측정으로 찾는 운동'**을 프레임 단위로 분석해 레이아웃을 그대로 따름
- 영상: 드라이브 영상 8개에서 11컷(유소년 드리블, 블레이즈팟, 헥스바, 카이저, 포스플레이트 측정, 무동력 트레드밀, 사다리·허들)
- 문구: 드라이브 '학부모 설명회 커리큘럼' 5개 그대로

## R4 분석 결과 (1080×1920 기준)

| 요소 | 위치·형식 |
|---|---|
| 배경 | 검정 |
| 센터 로고 | 위 y≈285, 흰 글씨 + 빨간 R |
| 제목 | 2줄 가운데 정렬, 1줄 흰색 / 2줄 빨간색, 핵심어에 '따옴표' (y≈420, 567) |
| 영상 | 가로 16:9 띠, y 658–1264 |
| 자막 | 흰색 한 줄, 가운데, y≈1322 (말 단위로 1.5–2.5초마다 바뀜) |
| 하단 로고 | Return to Sports 필기체, y≈1578 |
| 중간 배지 | 영상 띠 오른쪽 위: 센터 로고 + 유튜브 'R스포츠재활센터' + 인스타 '@rsports_center' |
| 엔딩 | 흰 배경, Rehab → Running → Return to Sports → R스포츠재활센터 로고 (약 6초) |

엔딩과 하단 로고는 R4 원본에서 그대로 잘라 썼습니다(`public/youth/r4/`).

## 영상 목록 (Remotion Studio › YouthR4)

| 컴포지션 | 길이 | 제목 | 내용 |
|---|---|---|---|
| `YouthR4Main` | 31.7초 | 유소년 축구선수 / '부상예방' 설명회 | 고민 제기 → "우리 아이는 왜 맨날 다칠까요?" → 커리큘럼 1–5 → 일시·장소 → 신청 → 엔딩 |
| `YouthR4Curriculum1` | 16초 | 유소년 선수는 왜 / '다르게' 접근할까? | 커리큘럼 1 |
| `YouthR4Curriculum2` | 16초 | 부상은 왜 / '반복'될까? | 커리큘럼 2 |
| `YouthR4Curriculum3` | 16초 | 어린 나이에 / '근력운동' 괜찮을까? | 커리큘럼 3 |
| `YouthR4Curriculum4` | 16초 | 우리 아이에게 / '맞는' 프로그램 | 커리큘럼 4 |
| `YouthR4Curriculum5` | 16초 | R스포츠재활센터의 / '선수 관리' 시스템 | 커리큘럼 5 |

## 고치기

- 문구·컷 순서: `src/youth/r4/index.tsx` 의 `MAIN_BEATS`, `CURRICULUM` (clip = `public/youth/band/` 파일 이름)
- 새 영상 컷 추가: `scripts/make_youth_band_clips.py` 의 `CLIPS` 에 (이름, 원본, 시작초, 길이, 세로 위치) 추가 후 실행
- 음악: `R4_MUSIC` 에 `public/` 기준 경로를 넣으면 들어갑니다(현재 비어 있음 = 무음)
- 강사 영상이 생기면: R4 원본처럼 가운데 띠에 강사 말하는 영상을 넣고 자막을 말에 맞추면 됩니다

## 음악 후보 (CC BY — 인스타 캡션에 출처 표기 필요)

| 곡 | 분위기 | 출처 표기 |
|---|---|---|
| [Rafael Krux – Inspiring Advertising (Upbeat Summer Corporate)](https://commons.wikimedia.org/wiki/File:Rafael_Krux_-_Inspiring_Advertising_-_Upbeat_Summer_Corporate_(cc-by)_(filmmusic).mp3) | 밝은 광고풍 | Music: Rafael Krux (filmmusic.io), CC BY 4.0 |
| [Rafael Krux – Inspiring Teaser](https://commons.wikimedia.org/wiki/File:Rafael_Krux_-_Inspiring_Teaser_(cc-by)_(filmmusic).mp3) | 티저·점점 고조 | Music: Rafael Krux (filmmusic.io), CC BY 4.0 |
| [Rafael Krux – Uplifting Blockbuster](https://commons.wikimedia.org/wiki/File:Rafael_Krux_-_Uplifting_Blockbuster_(cc-by)_(filmmusic).mp3) | 웅장한 업리프팅 | Music: Rafael Krux (filmmusic.io), CC BY 4.0 |
| [Infraction, Emerel Gray – Inferno (Brazilian Funk Sport)](https://commons.wikimedia.org/wiki/File:Infraction,_Emerel_Gray_-_Inferno_(Brazilian_Funk_Sport).ogg) | 스포츠·에너지 | Music: Infraction & Emerel Gray, CC BY 3.0 |

작업 환경에서 위키미디어가 요청 과다(429)로 막혀 있어 직접 받지 못했습니다. 브라우저에서 받은 파일을 드라이브 '유소년 설명회' 폴더에 넣어 주시면 넣어 드립니다.

## 나레이션 (2026-11-12 추가)

- 목소리: Higgsfield `text2speech_v2` · ElevenLabs 엔진 · 프리셋 'Dylan'(voice_id `b847bc29-f184-583a-8ad9-d1f1e16d1a60`)
- 파일: `public/youth/narration/main.mp3`, `curriculum1~5.mp3` (6개 생성에 약 1 크레딧)
- 발음 때문에 원고는 "알스포츠재활센터", "십이월 십이일", "오후 세 시"처럼 읽는 대로 적었고, 자막은 원래 표기(R스포츠재활센터, 12.12)로 둡니다.
- 자막 길이(`beats[].len`)는 나레이션의 문장 사이 쉼(ffmpeg silencedetect) 가운데를 경계로 잡았습니다. 원고를 바꿔 다시 만들면 이 숫자도 다시 맞춰야 합니다.
- 길이: 메인 40.6초(나레이션 34.6 + 엔딩 6), 커리큘럼 17.2~19.7초
- 음량: 약 -14 LUFS(인스타 권장 수준)
- 음악이 들어가면 나레이션 중에는 0.18로 낮추고 엔딩에서 0.55로 올리도록 되어 있습니다(`R4_MUSIC`).

## 배경음악 (2026-11-12 추가)

드라이브 '음원' 폴더의 곡을 사용했습니다(`public/youth/music/`).

| 사용처 | 파일 | 쓰는 구간 | 분석 |
|---|---|---|---|
| 메인 | `main-track.m4a` ← 드라이브 `videoplayback (1).m4a` | 0초부터 | 약 100BPM. 0~11초 잔잔한 도입(훅 문장), 11.5~41초 메인 구간(커리큘럼~엔딩) |
| 커리큘럼 5편 | `before-and-after.m4a` ← 드라이브 `Before And After.mp4`의 소리 | 8초부터 | 약 146BPM. 16초부터 본 구간 |

- 크기: 나레이션 중 0.2(목소리보다 약 6~18dB 작게), 엔딩 로고에서 0.4로 올렸다가 마지막 1.3초 페이드아웃. 나레이션은 0.85(최대 음량 여유).
- 결과: -15 LUFS, 최대 -0.2 dBFS 이하.
- 바꾸는 곳: `src/youth/r4/index.tsx` 의 `MAIN_MUSIC`, `CURRICULUM_MUSIC`(src, from), `MUSIC_UNDER_VOICE`
- **라이선스 확인 필요**: 두 곡 모두 파일 안에 곡명·작곡가·라이선스 정보가 없습니다. 'Before And After'는 유튜브 오디오 라이브러리 형식의 화면이라 무료 음원으로 보이지만, 출처 표기 조건이 있는지 확인하세요.
- 드라이브 '음원' 폴더의 'City Of Night(메이엘로)', '블핑 챔피온'은 공유 권한을 켜지 못해 받지 못했습니다. '블핑 챔피온'이 상업 음원이라면 센터 홍보 영상에는 쓰지 않는 것이 안전합니다.

## 컷 다양화·줌·전환 (2026-11-12 추가)

- 영상 구간: 11개 → **32개**(드라이브 영상 8개에서 24구간 + 센터 촬영본 8개). `scripts/make_youth_band_clips.py`
- 배치 규칙: 한 편 안에서는 같은 구간을 다시 쓰지 않음, 전체에서도 같은 구간은 최대 2번. 긴 문장은 2~3컷으로 나눔
  - 메인 15컷(전부 다름), 커리큘럼 편당 5~6컷
- 움직임(어지럽지 않게 두 가지만)
  - 컷마다 천천히 줌인: 컷 길이 동안 1.00 → 1.07배, 기준점은 화면 가운데 근처에서 컷마다 조금씩 바꿈
  - 컷 사이 디졸브: 6프레임(0.2초)
  - 제목·자막·로고·엔딩은 R4처럼 고정
- 조절: `src/youth/r4/index.tsx` 의 `ZOOM`(확대 정도), `DISSOLVE`(전환 길이), 각 문장의 `clips`
