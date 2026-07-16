# STEP 3 MANAGER EXTRACTION V1

## 1) 문서 역할
- 이 문서는 Step 3의 목적과 종료 기준을 정의한다.
- Step 3는 각 panel 폴더에서 정리된 책임을 모아 공용 manager 후보를 추리는 단계다.

## 2) Step 3 목표
- 여러 panel에서 반복되는 비시각 책임을 찾는다.
- panel 내부에 남길 책임과 공용으로 뺄 책임을 구분한다.
- manager 후보를 `MANAGERS/manager_plan.md`에 정리한다.

## 3) 입력
- `PANELS/<panel_name>/controller_plan.md`
- `PANELS/<panel_name>/actions_plan.md`
- `PANELS/<panel_name>/interaction_plan.md`
- `PANELS/<panel_name>/manager_needs.md`가 있으면 함께 사용

## 4) 산출물 구조

```text
planning/
├─ PANELS/
│  └─ <panel_name>/
│     └─ manager_needs.md
└─ MANAGERS/
   └─ manager_plan.md
```

## 5) Step 3에서 채우는 파일
### 5-1) `PANELS/<panel_name>/manager_needs.md`
- 이 panel이 필요로 하는 공용 기능 후보
- 왜 panel 내부가 아니라 공용 후보인지

### 5-2) `MANAGERS/manager_plan.md`
- manager 후보 이름
- 책임 한 줄 요약
- 어느 panel들이 쓰는지
- 아직 공용화하면 안 되는 책임

## 6) 종료 기준
- panel별 공용 후보가 정리되어 있다.
- 전역 manager 계획이 있다.
- panel 책임과 manager 책임이 분리되어 있다.
