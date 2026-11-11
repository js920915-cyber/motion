# 유소년 설명회 릴스 — 테마 3종

테마마다 **배경·연출·메시지·영상이 모두 다른** 버전입니다(약 16초, 1080×1920).
음악 박자에 맞추지 않고 읽는 속도에 맞춰 컷 길이를 잡았고, 음악은 끝에서 페이드아웃합니다.
기존 네이비 HUD 버전(`YouthSeminarReel`, "우리 아이는 왜 맨날 다칠까요?")은 그대로 있습니다.

| 컴포지션 | 테마 | 메시지(훅) | 관절 조준 컷 3개 | 핵심 3가지 설명 컷 |
|---|---|---|---|---|
| `YouthReelEditorial` | A 매거진 — 종이 질감, 흑백 사진 프린트, 빨간 펜 동그라미 | 성장기 아이의 몸은 어른과 **다릅니다.** / 그래서 관리도 달라야 합니다. | 랜드마인(착지 무릎) · 밸런스(발목) · 메디신볼(골반) | 싱글레그 스쿼트 · 1:1 케어 사진 · 카이저 B |
| `YouthReelTactics` | B 전술판 — 잔디·분필 라인, 중계 리플레이 분석 | 잘 뛰는 아이보다 **오래 뛰는 아이** / 부상 없이 뛰는 것도 실력입니다. | 메디신볼(골반) · 카이저 B(디딤발) · 랜드마인(착지) | 밸런스 · 1:1 케어 사진 · 카이저 프레스 |
| `YouthReelScan` | C 열화상 스캔 — 검정, 히트맵 영상, 스캔 라인·열점 | 통증이 없다고 **괜찮을까요?** / 눈에 보이지 않는 차이까지 확인합니다 | 싱글레그 스쿼트(무릎) · 카이저 A(몸통) · 밸런스(발목) | 랜드마인 · 밴드 오실레이션 · 메디신볼 |

흐름(공통): 훅 2.8s → 관절 조준 3컷 4.8s → 핵심 3가지(영상 + 한 줄 설명) 4.2s → 일시·장소·대상·신청 + 로고 4.5s

핵심 3가지 한 줄 설명
- 01 부상 원인 이해 — 왜 다치는지, 움직임에서 찾습니다
- 02 성장기 관리 — 자라는 시기에 맞는 관리법
- 03 움직임 향상 — 더 안전하게, 더 잘 움직이도록

## 파일

- `src/youth/themes/shared.tsx` — 설명회 정보(`COPY`), 핵심 3가지(`POINTS`), 타이밍(`T`), 뼈대(`ThemeReel`), 사진/영상 공용 `Media`
- `src/youth/themes/Editorial.tsx`, `Tactics.tsx`, `Scan.tsx` — 각 테마의 `HOOK`(메시지), `SHOTS`(조준 컷), `ELEMENTS`(설명 컷), 색 `P`
- 음악: `public/youth/bgm-free.wav` (원곡 81초 드롭부터 20초, `scripts/make_youth_bgm.py`)

## 고치기

- **설명회 정보·핵심 3가지 문구**: `shared.tsx` 한 곳 → 세 테마 모두 반영
- **훅 메시지**: 각 테마 파일의 `HOOK`
- **영상 교체**: `SHOTS`/`ELEMENTS`의 `src`, `trimBefore`(시작 프레임), 조준 위치 `focus`(1080×1920 기준). 사진(.jpg)도 넣을 수 있습니다.
- **컷 길이**: `shared.tsx`의 `T`

## 렌더

```
npx remotion render YouthReelEditorial out/youth-reel-editorial.mp4
npx remotion render YouthReelTactics out/youth-reel-tactics.mp4
npx remotion render YouthReelScan out/youth-reel-scan.mp4
```
