# 유소년 설명회 릴스 15초 — 제작 메모

- 컴포지션: `Youth / YouthSeminarReel` (1080×1920, 30fps, 450프레임 = 120BPM 30비트)
- 코드: `src/youth/`
- 미리보기: `npm run dev` → 왼쪽 목록에서 Youth › YouthSeminarReel
- 렌더: `npx remotion render YouthSeminarReel out/youth-seminar-reel-15s.mp4`

## 구성

| 시간 | 장면 | 내용 | 효과(출처) |
|---|---|---|---|
| 0–3s | HOOK | 우리 아이는 / 왜 맨날 / **다칠까요?** | 글자 낙하·카메라 반동·RGB 분리·먼지 (Remocn `impact-shake` 이식) |
| 3–7s | CAUSE | 싱글레그 스쿼트 → 무릎 조준, 밸런스 → 발목 조준 | 뷰파인더 브래킷 (Remocn `bracket-focus` 이식) |
| 7–10s | KEY POINTS | 01 부상 원인 이해 · 02 성장기 관리 · 03 움직임 향상 | 2비트마다 스코어박스형 행 (Remocn `score-bug` 박자 참고) |
| 10–15s | JOIN US | 제목 + 일시·장소·대상·신청(인스타 프로필 링크에서 신청) 표 + 로고 | What/When/Where 표 (Remocn `rsvp` 구성 참고) |

장면 사이 전환은 기존 `PixelWipe`, 모서리 HUD는 기존 `Hud`를 세로용으로 옮긴 `ReelHud`입니다.
컬러는 최신 브랜드 톤(로고 네이비·블루·레드, `src/youth/theme.ts`)입니다.

## 바꾸기 쉬운 곳

- **드리블 영상으로 교체**: 영상을 `public/youth/` 에 넣고 `src/youth/scenes/CauseScene.tsx` 의 `SHOTS` 에서
  `src`, `trimBefore`(시작 프레임), `focus`(조준 위치, 1080×1920 기준 좌표)만 바꾸세요.
- **문구**: 각 장면 파일 상단의 상수(`POINTS`, `ROWS`, `lines`)
- **장면 길이**: `src/youth/theme.ts` 의 `YS`(비트 단위)
- **음악 구간**: `scripts/make_youth_bgm.py` 의 `START` 수정 후 `python3 scripts/make_youth_bgm.py`

## 사용한 소스

| 파일 | 출처 | 라이선스 |
|---|---|---|
| `src/youth/components/Impact.tsx`, `FocusBrackets.tsx` | [Remocn](https://github.com/Remocn/remocn) `impact-shake`, `bracket-focus` 를 옮겨 수정 | MIT (Copyright (c) 2026 Remocn) |
| `assets/music/litesaturation-dance-electro-120-bpm-full-12086.mp3` → `public/youth/bgm.wav` | [Pixabay – LiteSaturation](https://pixabay.com/music/dance-dance-electro-120-bpm-full-12086/) | Pixabay Content License |
| `public/clips/*.mp4`, `public/media/balance.mp4` | R스포츠재활센터 자체 촬영 | — |
| `public/sfx/*.wav`, `public/brand/*-4x.png` | gracious-archimedes 브랜치에서 가져옴(자체 제작) | — |
