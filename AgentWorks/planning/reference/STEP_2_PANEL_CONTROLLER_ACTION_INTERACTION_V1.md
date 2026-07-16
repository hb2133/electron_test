# STEP 2 PANEL CONTROLLER ACTION INTERACTION V1

## 1) 문서 역할
- 이 문서는 Step 2의 목적과 종료 기준을 정의한다.
- Step 2는 `받아온 html 검토 -> controller / action / interaction 정리` 단계다.
- Step 2 결과도 계속 각 panel 폴더 안에 쌓는다.

## 2) Step 2 목표
- panel html이 section 구조를 잘 반영했는지 확인한다.
- 누락된 section, CTA, layered open 지점을 보정한다.
- panel별 controller 책임을 정리한다.
- action 후보를 정리한다.
- panel 전환과 interaction 흐름을 정리한다.

## 3) Panel 폴더 확장 구조

```text
planning/PANELS/<panel_name>/
├─ panel_definition.md
├─ panel_html_prompt.md
├─ panel_preview.html
├─ controller_plan.md
├─ actions_plan.md
├─ interaction_plan.md
└─ sections/
   ├─ <section_name>.md
   └─ ...
```

## 4) Step 2에서 채우는 파일
### 4-1) `controller_plan.md`
- panel controller 책임
- panel 전환 호출 지점
- layered open / close 처리
- 상태 변화 소유 범위

### 4-2) `actions_plan.md`
- controller가 위임할 action 후보
- action별 입력 / 결과
- 외부 호출이나 비시각 처리 후보

### 4-3) `interaction_plan.md`
- section 클릭 흐름
- CTA 결과
- panel 전환
- layered open / close
- completion 이후 후속 처리

## 5) 종료 기준
- html 검토 결과가 반영되어 있다.
- controller 책임이 적혀 있다.
- action 후보가 적혀 있다.
- interaction 흐름이 적혀 있다.

## 6) 이 단계에서 하지 않는 일
- 공용 manager 최종 확정
- 구현 코드 작성
