# Planning

## 1) 목적
- 이 폴더는 bootstrap이 새 프로젝트의 `AgentWorks/planning/`으로 복사하는 planning 시작 세트다.
- 이 세트는 추상 기획 문서 묶음이 아니라, 실제로 나중에 만들어질 panel 구조를 미리 작업 폴더 형태로 잡아가는 워크플로 세트다.
- 시작점은 항상 `PROJECT_REQUEST_BRIEF`다.

## 2) 핵심 흐름
1. Brief로 첫 화면 구조와 panel 후보를 잡는다.
2. Brief 결과를 바탕으로 `PANELS/<panel_name>/` 폴더를 만든다.
3. 각 panel 폴더 안에 section 정의와 html 프롬프트를 넣는다.
4. Gemini / Stitch 등으로 panel html을 받아온다.
5. 같은 panel 폴더 안에서 controller, action, interaction 정의를 이어간다.
6. 마지막에 공용 기능 후보를 모아 `MANAGERS/`로 올린다.

## 3) 읽기 순서
1. `reference/PROJECT_REQUEST_BRIEF_V1.md`
2. `reference/STEP_1_BRIEF_TO_PANEL_BOOTSTRAP_V1.md`
3. `reference/STEP_2_PANEL_CONTROLLER_ACTION_INTERACTION_V1.md`
4. `reference/STEP_3_MANAGER_EXTRACTION_V1.md`
5. `reference/IMPLEMENTATION_STEP_WORKFLOW_V1.md`
6. 필요 시 `reference/GEMINI_PANEL_SECTION_SCAFFOLD_PERSONA_V1.md`

## 4) 권장 작업 구조

```text
planning/
├─ PROJECT_REQUEST_BRIEF.md
├─ README.md
├─ reference/
│  ├─ PROJECT_REQUEST_BRIEF_V1.md
│  ├─ STEP_1_BRIEF_TO_PANEL_BOOTSTRAP_V1.md
│  ├─ STEP_2_PANEL_CONTROLLER_ACTION_INTERACTION_V1.md
│  ├─ STEP_3_MANAGER_EXTRACTION_V1.md
│  └─ IMPLEMENTATION_STEP_WORKFLOW_V1.md
├─ PANELS/
│  ├─ <panel_name>/
│  │  ├─ panel_definition.md
│  │  ├─ panel_html_prompt.md
│  │  ├─ panel_preview.html
│  │  ├─ controller_plan.md
│  │  ├─ actions_plan.md
│  │  ├─ interaction_plan.md
│  │  ├─ manager_needs.md
│  │  └─ sections/
│  │     ├─ <section_name>.md
│  │     └─ ...
│  └─ ...
└─ MANAGERS/
   └─ manager_plan.md
```

## 5) 폴더 역할
- `PROJECT_REQUEST_BRIEF.md`
  - 최초 입력 문서
- `PANELS/<panel_name>/`
  - 해당 panel 전용 planning 작업 공간
  - html, controller, action, interaction, manager 후보까지 같은 폴더에서 계속 이어간다.
- `MANAGERS/`
  - 여러 panel에서 올라온 공용 후보를 모으는 공간
- `reference/`
  - 단계 운영 규칙, 공용 구현 step 문서, 디자인 모델 참고 persona를 둔다.

## 6) 원칙
- Brief 이후 산출물은 공용 문서 하나에 몰아넣지 않는다.
- panel 단위 산출물은 항상 해당 panel 폴더에 남긴다.
- 설계 단계가 진행될수록 같은 panel 폴더 안의 파일이 채워지는 구조로 간다.
- 나중에 실제 프로젝트의 `panels/base`, `panels/layered`, `sections`, `controller`, `actions` 구조와 연결될 수 있게 이름을 직접 붙인다.
