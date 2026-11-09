# 샌달조식 BI — Claude Code 작업 지침

이 문서는 샌달조식(운영: ㈜더기빙트리)의 BI(디자인 시스템) 요약입니다. 웹페이지, 랜딩, 상세페이지, 컴포넌트, 문서 템플릿 등 샌달조식 이름으로 나가는 결과물을 만들 때 아래 값과 규칙을 그대로 따르세요. 값을 임의로 바꾸거나 근사하지 마세요.

- 원본 디자인 시스템(최신 기준): https://claude.ai/artifact/LfZdNshwwL1HxmLTicw93z
- 출처: 로고 원본(.ai 3종), 샌달조식_PPT템플릿 4.pptx, 크리에이지 기업조식 상세페이지

---

## 1. 브랜드 핵심

- 정체성: 기업 조식 정기 운영 브랜드. 단순 납품이 아니라 "운영파트너".
- 대표 문장: "단순한 조식 납품업체가 아닌, '운영파트너'가 되어드립니다."
- 대표 헤드라인: "기업 조식, 단순 배달이 아니라 운영입니다"
- 독자: 기업·기관의 조식 담당자.

## 2. 말투 규칙

- 합니다체로 씁니다. 해요체는 고객 후기를 인용할 때만 씁니다.
- "A가 아니라 B입니다" 같은 대비 구조를 우선합니다.
- 문장은 담당자의 부담을 덜어 주는 쪽으로 맺습니다.
- 숫자는 근거가 있는 값만 씁니다: 10년+, 950명+, 4주 식단, 새벽 3~6시, 1회 100,000원 이상, 300만 개+, 98.7%. 꾸밈용 숫자를 새로 만들지 마세요.
- 운영 조건은 "~협의합니다"로 맺습니다. "무조건", "100%" 같은 단정은 쓰지 않습니다.
- 이모지는 쓰지 않습니다. 감탄형은 로고 슬로건 "맛있다! 신선하다!"에만 씁니다.
- 핵심 키워드: 기업 조식, 정기조식, 4주 식단, 새벽배송, 사내진열, 주요 메뉴 직접 제조, 운영파트너, 무료 시식
- 문의 표기는 항상 이 형식입니다: 상담 전화 1522-4633 · admin@thegivingtree.co.kr · ㈜더기빙트리 운영 샌달조식
- 상호·사업자번호 등 법적 정보는 서류 양식과 같은 값으로 씁니다.

## 3. 로고

- 원본 파일만 씁니다. 다시 그리기, 늘이기, 색 변경은 금지입니다.
  - `sandal-logo-green.svg`: 흰 바탕·밝은 사진 위에 씁니다. 초록 #0a6d44, 노랑 #f5d500.
  - `sandal-logo-reverse.svg`: 초록 면 위에 쓰는 흰 로고입니다.
  - `sandal-profile.png`: 512×512 정사각 프로필, 파비콘 영역용입니다.
- 로고 주변에는 로고 바퀴 지름 이상 여백을 둡니다. 가로 폭은 최소 96px(인쇄 25mm)입니다.
- 로고를 forest 바탕에 올릴 때는 반드시 흰 로고를 씁니다.
- 로고 파일은 원본 디자인 시스템의 Assets > Logos에서 내려받습니다. 받지 못했다면 로고 자리를 비워 두고 사용자에게 요청하세요.

## 4. 컬러 토큰 (CSS 변수명 = 토큰명)

```css
:root {
  /* 브랜드 마크 층: 로고·포장·PPT·차트 */
  --logo-green: #0a6d44;   /* 로고 초록. 흰 글자 6.4:1 */
  --logo-yellow: #f5d500;  /* 로고 치즈 노랑. 로고·형광펜 강조 전용, 흰 바탕 글자색 금지 */
  --chart-2: #5fae8e;
  --chart-3: #a9d3c0;
  --chart-4: #6f8177;

  /* 세일즈·웹 층: 상세페이지·랜딩·제안서 */
  --forest: #1f5a43;       /* 주색: CTA, 히어로 띠, 사례 박스. 위 글자는 흰색 */
  --forest-deep: #1d4b39;  /* 헤드라인 강조어, FAQ 질문, 조건표 값 */
  --gold: #b6913e;         /* 24px 이상 굵은 숫자·RECOMMENDED 칩 전용 (흰 바탕 2.95:1) */
  --gold-text: #8a6d2c;    /* 작은 골드 글자(아이브로우·번호). 흰 바탕 4.9:1 */
  --cream: #f5f0e5;        /* 따뜻한 섹션 배경 */
  --mint: #eef5f1;         /* PPT·문서 카드, 표 짝수행 */

  /* 공통 */
  --surface: #ffffff;
  --surface-subtle: #fafafa;  /* 흰 섹션 안 카드 */
  --surface-muted: #f4f4f5;   /* 브랜드 스토리 섹션, 비교표 '일반 서비스' 칸 */
  --line: #e4e4e7;            /* 카드 테두리 1px */
  --line-strong: #ccd6d2;     /* 샌달 쪽 비교 카드 테두리 */
  --ink: #26332d;             /* 헤드라인 */
  --ink-body: #52525b;        /* 본문 */
  --ink-muted: #71717a;       /* 캡션 (cream 위에서는 18px 이상) */
}
```

컬러 사용 규칙:
- 차트 계열은 logo-green → chart-2 → chart-3 → logo-yellow → chart-4 순서로 씁니다.
- logo-yellow와 gold는 한 화면에 함께 쓰지 않습니다.
- 헤드라인은 ink로 쓰고, 강조어 한 구절만 forest-deep으로 씁니다.
- 섹션 배경은 surface → cream → surface → surface-muted처럼 번갈아 씁니다.
- PPT 테마의 초록(#007344)은 구버전 값입니다. 새 자료는 #0a6d44로 통일합니다.

## 5. 타이포그래피

- 웹·디자인: Pretendard (SIL OFL)
  - `font-family: Pretendard, "Apple SD Gothic Neo", "Malgun Gothic", system-ui, sans-serif;`
  - 사용 굵기: 400, 500, 700, 800
  - 웹폰트가 필요하면 npm 패키지 `pretendard@1.3.9`를 씁니다.
- PPT·워드·엑셀: 맑은 고딕. 제목 36pt, 본문 20pt, 최소 14pt.

| 스타일 | 크기/행간 | 굵기 | 자간 | 용도 |
|---|---|---|---|---|
| display | 44/56px | 800 | -0.02em | 섹션 대표 헤드라인, 두 줄 이내 |
| h1 | 34/44px | 800 | -0.02em | 보조 섹션 헤드라인 |
| h2 | 26/36px | 700 | -0.01em | 카드 묶음·사례 제목 |
| h3 | 20/28px | 700 | — | 카드 제목, FAQ 질문 |
| stat | 48/56px | 800 | -0.02em | 핵심 숫자 (gold 또는 forest-deep) |
| body-lg | 19/32px | 400 | — | 리드 문장 (ink-body) |
| body | 16/26px | 400 | — | 카드 본문, FAQ 답변 |
| body-strong | 16/26px | 700 | — | 조건표 값 |
| caption | 14/20px | 400 | — | 주석·라벨 (ink-muted) |
| eyebrow | 15/20px | 700 | 0.14em, 대문자 | 헤드라인 위 영문 라벨 (gold-text) |
| button | 20/28px | 700 | — | CTA 글자 |

## 6. 간격 · 모서리 · 그림자

```css
:root {
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px; --space-4: 16px;
  --space-6: 24px; --space-8: 32px; --space-12: 48px; --space-20: 80px;
  --radius-sm: 6px;    /* PLAN 라벨 */
  --radius-md: 12px;   /* 목록 칸, 비교표 칸 */
  --radius-lg: 20px;   /* CTA 버튼, 사진 */
  --radius-xl: 28px;   /* 큰 카드 */
  --radius-pill: 999px;/* 칩 */
  --shadow-card: 0 8px 24px rgba(31, 90, 67, 0.08); /* 사진 카드에만 */
}
```

## 7. 레이아웃 규칙

- 상세페이지 기준 폭은 860px입니다. 좌우 여백은 40px(모바일 16px), 섹션 위아래 여백은 80px입니다.
- 섹션 구성 순서는 아래와 같습니다.
  1. 아이브로우
  2. 헤드라인
  3. 리드 문장
  4. 근거(사진·카드·표)
  5. 마무리 한 줄(forest-deep, 굵게)
  6. CTA 버튼(위에 안내 문구 한 줄)
- 카드는 surface-subtle 바탕에 line 테두리가 기본입니다. 그림자는 사진 카드에만 씁니다.
- 조건표는 왼쪽에 "번호 + 항목"(ink-body), 오른쪽에 값(body-strong, forest-deep)과 보조 설명(caption)을 둡니다.
- 비교표에서 '일반 서비스' 칸은 surface-muted 바탕에 ink-muted 글자를 씁니다. '샌달조식' 칸은 surface-subtle 바탕, line-strong 테두리, forest-deep 글자입니다.
- 포커스 링은 `outline: 3px solid var(--forest-deep); outline-offset: 3px`로 통일합니다.

## 8. 컴포넌트 명세

**Button (CTA)**
- variant: `primary`(forest 채움, 흰 글자; 기본), `secondary`(흰 바탕, forest 2px 테두리, forest-deep 글자)
- size: `lg`는 높이 72px, 글자 22px, radius-lg입니다. `md`는 높이 52px, 글자 17px, radius-md입니다.
- caption이 있으면 버튼 위에 19px ink-body 안내 문구 한 줄을 둡니다.
- 문구는 행동형으로 씁니다: 도입 상담하기 / 예산별 맞춤 견적 상담하기 / 전화 상담 문의 · 1522-4633
- primary 버튼은 한 화면에 하나만 둡니다. 노랑 버튼은 만들지 않습니다.

**Chip**
- `solid`: forest-deep 바탕, 흰 글자, pill 모양입니다. 협의 항목에 씁니다(추천 식단안 제안, 예산별 구성 협의).
- `outline`: 흰 바탕, line 테두리, forest-deep 글자, pill 모양입니다. cream 바탕 위에서 강점을 요약할 때 씁니다.
- `plan`: forest-deep 바탕, radius-sm입니다. PLAN A/B/C 라벨에 씁니다.
- `gold`: gold 바탕, 흰 글자, 13px 대문자입니다. RECOMMENDED에만 씁니다. 대비가 부족하므로 장식용으로만 씁니다.

**SectionHeading**
- 구성: eyebrow(선택) + title(필수, 줄바꿈 가능) + description(선택)
- 강조어 한 구절은 `<em>`으로 감싸고 forest-deep, font-style normal로 표시합니다.
- 기본은 가운데 정렬입니다. 읽는 섹션은 왼쪽 정렬합니다.

**InfoCard**
- props: `title`, 본문, `label`(선택, "DIRECT 01" 등), `tone`
- tone: `neutral`(기본) / `cream`(강조 질문 1~2개) / `mint`(문서식) / `forest`(대표 사례, label은 logo-yellow)
- padding 32px, radius-xl, 제목 20px 700 forest-deep, 본문 16px ink-body
- FAQ 제목은 "Q. "로 시작합니다.

**StatGroup**
- 2~3개 항목을 `{value, label}`로 받습니다. 값은 44px 800 gold, 라벨은 17px ink-muted입니다.
- 항목 사이에 line 세로 구분선을 둡니다. 컨테이너는 surface-subtle 바탕, line 테두리, radius-xl입니다.

## 9. 사진 · 아이콘

- 사진은 실제 운영 현장을 씁니다: 크라프트 포장, 사내 진열대, 새벽 배송 가방, 위생복 제조. 밝은 자연광, 모서리는 radius-lg 이상.
- 실제 식단표·인증서·보험 증서는 고치지 않습니다. 고객사 로고는 사용 동의된 것만 씁니다.
- 아이콘 세트는 아직 정하지 않았습니다. 지금은 번호(01, 02…)와 칩으로 구분합니다. 꼭 필요하면 단색 선 아이콘을 forest-deep으로 씁니다.

## 10. 금지 사항

- 위 목록에 없는 색, 그라데이션, 보라·파랑 계열을 쓰지 않습니다.
- 로고를 재현하거나 변형하지 않습니다.
- 이모지 장식, 왼쪽 컬러 테두리 카드, 근거 없는 수치를 쓰지 않습니다.
- 작은 글자(24px 미만)에 gold나 logo-yellow를 쓰지 않습니다.

## 11. 아직 확정되지 않은 부분 (작업 전 사용자에게 확인)

- 상세페이지 글꼴은 Pretendard로 추정한 것입니다.
- 로고 최소 크기와 여백 기준은 제안값입니다.
- 아이콘 세트, 다크 모드, 로고 금지 예시는 아직 없습니다.
