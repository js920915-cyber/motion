# 유소년 설명회 홍보 시리즈 (해외 레퍼런스 구성)

`04-references.md`의 해외 설명회·강의 홍보영상 구성을 따라 만든 8편입니다. Remotion Studio의 `YouthSeries` 폴더에 있습니다.
강사 얼굴 영상은 아직 없어서 **'강사 영상 자리'를 비워 둔 상태**입니다.

| 순서 | 컴포지션 | 길이 | 구성 | 참고한 레퍼런스 |
|---|---|---|---|---|
| 1 | `YouthSeriesTrailer` | 20초 | 학부모·지도자님께 → "아이의 부상, 미리 막을 수 있다면?" → 영상 속 팁(착지 무릎) → 다루는 주제 3개 → [강사 자리] → 일정·신청 | MasterClass 트레일러, Skillshare 질문형 훅, CHOP 목차형 |
| 2 | `YouthSeriesAnnounce` | 10초 | 실촬영 3컷 위 "부상예방 설명회가 열립니다" → SAVE THE DATE 12.12 SAT → 일정·신청 | Async/Fluxnote 첫 공지 |
| 3–5 | `YouthSeriesTopic1~3` | 각 10초 | 미리보기 01/02/03 → 실촬영 + 팁 카드 → "12월 12일 설명회에서 자세히" | Safe Kids "주제 하나 = 영상 하나", MasterClass 작은 수업 |
| 6 | `YouthSeriesSpeaker` | 9.5초 | "누가 알려주나요?" → [강사 자리 + 이름·직함 자막] → "직접 만나보세요" | Domestika 강사 소개, Vimeo 연사 카드 |
| 7–8 | `YouthSeriesD7`, `YouthSeriesD1` | 각 6초 | D-7 / D-1 카운트다운 → 일정·신청 | Async 카운트다운 |

주제 미리보기 팁
- 01 부상 원인 이해: 착지할 때 무릎이 안쪽으로 모이는지 확인해 보세요 (랜드마인 영상 + 무릎 표시)
- 02 성장기 관리: 키가 빨리 크는 시기엔 훈련량을 갑자기 늘리지 마세요 (1:1 케어 사진)
- 03 움직임 향상: 한 발로 서서 왼발·오른발 흔들림 차이를 비교해 보세요 (밸런스 영상 + 발목 표시)

## 강사 영상 넣는 법

1. 세로(9:16)로 3~4초, 가슴 위, 카메라를 보며 한 문장 촬영
2. `public/youth/speaker.mp4` 로 저장
3. `src/youth/series/blocks.tsx` 의 `SPEAKER` 를 수정
   ```ts
   export const SPEAKER = {
     src: "youth/speaker.mp4",       // null 이면 '강사 영상 자리' 화면
     name: "홍길동 원장",            // [강사 이름]
     role: "물리치료사 · ○○ 자격",  // [직함 · 자격]
     line: "“…”",                    // 자막으로 넣을 한 문장(말한 내용과 맞추기)
   };
   ```
4. 트레일러와 강사 공개편 두 곳에 같이 반영됩니다.

## 렌더

```
npx remotion render YouthSeriesTrailer out/series/01-trailer.mp4
```
(나머지도 컴포지션 이름만 바꿔서 같은 방식)
