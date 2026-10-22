# R스포츠재활센터 홍보 모션그래픽

레퍼런스 영상(다크 배경 + 그린 하프톤 동심원, 모서리 HUD, 타이핑 커서 헤드라인, 비트 싱크 컷)의 스타일로 만든 35초 / 1920×1080 / 30fps 홍보 영상입니다. [Remotion](https://remotion.dev)으로 제작했습니다.

## 구성 (120 BPM, 1비트 = 15프레임)

| # | 장면 | 내용 |
|---|------|------|
| 1 | Boot | "다시, 뛸 수 있도록" 타이핑 + 회복 로딩 바 |
| 2 | Pain | 무릎 → 허리 → 어깨 → 발목 (비트마다 교체) → "그 통증, 참고 계신가요?" |
| 3 | Logo | 하프톤 동심원 + 로고 리빌 |
| 4 | Experts | 100% 카운터 · 전 직원 물리치료사 · 자격/경력 |
| 5 | Programs | 8개 프로그램 카드 그리드 |
| 6 | Process | 1:1 재활 시스템 4단계 + 회복 곡선 차트 (크림 톤) |
| 7 | Mission | 기능 향상 · 회복 · 재발 방지 → 삶의 질 |
| 8 | Outro | 로고 · 주소 · 전화 · rsports.co.kr |

## 사용법

```bash
npm i
npm run dev                                   # Remotion Studio 미리보기
npx remotion render RSportsPromo out/rsports-promo.mp4
```

## 수정 포인트

- **브랜드 컬러 / BPM / 장면 길이**: `src/theme.ts`
- **문구**: `src/scenes/*.tsx` (각 장면 파일 상단 상수)
- **로고**: `src/components/Brand.tsx`의 `LogoMark`는 임시 "R" 마크입니다. 실제 로고를 `public/`에 넣고 교체하세요.
- **배경음악**: `public/bgm.wav`는 120 BPM 임시 비트입니다. 라이선스가 있는 음원으로 교체하고, 템포가 다르면 `BPM`을 맞추세요. 음악 없이 렌더하려면 `--props='{"music":false}'`.
- **폰트**: Pretendard, JetBrains Mono (둘 다 OFL) — `public/fonts`에 포함.
