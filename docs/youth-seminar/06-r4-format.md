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
