# 유소년 설명회 릴스 — 테마 3종

같은 문구와 같은 타이밍(15초, 120BPM 30비트)에 **배경·연출·영상만 다르게** 만든 버전입니다.
기존 네이비 HUD 버전(`YouthSeminarReel`)과는 별도로, Remotion Studio의 `Youth` 폴더에 있습니다.

| 컴포지션 | 테마 | 배경 / 연출 | 사용한 영상(조준 부위) | 장면 전환 |
|---|---|---|---|---|
| `YouthReelEditorial` | A 매거진 | 종이 질감 + 흑백 사진 프린트, 빨간 펜 손그림 동그라미, 외곽선 큰 숫자, 빨간 표지 "SAVE THE DATE" | 랜드마인 프레스(착지 무릎), 밸런스(발목) | 아래에서 밀어 올림 → 오른쪽 슬라이드 → 대각선 와이프 |
| `YouthReelTactics` | B 전술판 | 잔디 줄무늬 + 분필 경기장 라인, 전술 화살표, 중계 리플레이 분석(노란 텔레스트레이터), 매치데이 카드 | 메디신볼(골반 회전), 카이저 로테이션 B(디딤발) | 왼쪽 와이프 → 오른쪽 슬라이드 → 아래 와이프 |
| `YouthReelScan` | C 열화상 스캔 | 검정 + 열화상 색 영상, 스캔 라인, 관절 열점·레이더 링, 뷰파인더 | 싱글레그 스쿼트(무릎), 카이저 로테이션 A(몸통) | 위에서 덮는 와이프(스캔) → 왼쪽 → 위 |

공통: 0s 훅 "우리 아이는 왜 맨날 다칠까요?" → 3s 원인(실촬영 2컷 + 관절 조준) → 7s 핵심 3가지 → 10s 일시·장소·대상·신청(인스타 프로필 링크에서 신청) + 로고(13s, 음악 엔딩)

## 파일

- `src/youth/themes/shared.tsx` — 문구(`COPY`), 타이밍(`T`), 장면 4개를 전환으로 잇는 뼈대(`ThemeReel`)
- `src/youth/themes/Editorial.tsx`, `Tactics.tsx`, `Scan.tsx` — 테마별 장면
- 전환: Remotion 공식 `@remotion/transitions`(slide·wipe). 전환 길이만큼 앞 장면을 늘려 장면 시작이 비트 경계에 그대로 맞습니다.

## 고치기

- **문구**: `shared.tsx`의 `COPY` 한 곳만 고치면 세 테마 모두 바뀝니다.
- **영상·조준 위치**: 각 테마 파일 위쪽 `SHOTS`의 `src`, `trimBefore`(시작 프레임), `focus`(1080×1920 기준 좌표)
  - 드리블 영상이 생기면 원하는 테마의 `SHOTS` 한 칸을 바꾸면 됩니다.
- **색**: 각 테마 파일 위쪽 `P`

## 렌더

```
npx remotion render YouthReelEditorial out/youth-reel-editorial-15s.mp4
npx remotion render YouthReelTactics out/youth-reel-tactics-15s.mp4
npx remotion render YouthReelScan out/youth-reel-scan-15s.mp4
```
