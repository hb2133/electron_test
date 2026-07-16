# STEP 1 BRIEF TO PANEL BOOTSTRAP V1

## 1) 문서 역할
- 이 문서는 Step 1의 목적과 종료 기준을 정의한다.
- Step 1은 `brief -> panel 폴더 초안 생성 -> section 정의 -> html 프롬프트 작성 -> html 수급`까지를 담당한다.

## 2) Step 1 목표
- 사용자가 보게 될 화면 구성을 먼저 정리한다.
- top-level `BasePanel`과 필요한 `LayeredPanel` 후보를 정한다.
- 각 panel별 작업 폴더를 만든다.
- 각 panel 안의 핵심 section과 순서를 간략히 적는다.
- panel html 프롬프트를 만든다.
- Gemini / Stitch 등으로 panel html 시안을 받아온다.

## 3) Panel 폴더 시작 구조

```text
planning/PANELS/<panel_name>/
├─ panel_definition.md
├─ panel_html_prompt.md
├─ panel_preview.html
└─ sections/
   ├─ <section_name>.md
   └─ ...
```

## 4) Step 1에서 채우는 파일
### 4-1) `panel_definition.md`
- panel 목적
- panel 종류 (`BasePanel` / `LayeredPanel`)
- 핵심 section 목록
- 주요 CTA
- panel 전환 또는 layered open 지점

### 4-2) `sections/<section_name>.md`
- section 역할
- section 순서
- 핵심 요소
- 클릭 또는 입력

### 4-3) `panel_html_prompt.md`
- 디자인 모델에 바로 넘길 입력
- section 순서, CTA 위치, layered open 조건 포함

### 4-4) `panel_preview.html`
- 디자인 모델이 생성한 panel 시안

## 5) 종료 기준
- 핵심 panel 폴더가 생성되어 있다.
- 각 panel에 section 파일이 있다.
- `panel_html_prompt.md`가 있다.
- `panel_preview.html`이 있다.

## 6) 이 단계에서 하지 않는 일
- controller 책임 상세화
- action 분리
- manager 추출
