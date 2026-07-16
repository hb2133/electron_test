# IMPLEMENTATION STEP WORKFLOW V1

## 1) 문서 역할
- 이 문서는 panel-section 구조를 실제 코드로 구현할 때 따르는 공용 step 문서다.
- 이 문서는 플랫폼별 파일 경로를 다시 길게 설명하지 않는다.
- 실제 경로와 파일 위치는 각 플랫폼의 architecture rules 문서를 따른다.
- 목적은 구현 순서를 통제해서, 화면 구조가 덜 닫힌 상태에서 controller나 manager를 먼저 만드는 일을 막는 것이다.

## 2) 기본 원칙
- 구현은 항상 작은 step으로 나눈다.
- 아직 닫히지 않은 책임을 앞 단계에서 억지로 구현하지 않는다.
- panel 구조, section 구조, interaction 구조, manager 추출은 한 번에 섞지 않는다.
- 플랫폼별 엔트리와 진입 연결은 가장 먼저 닫는다.

## 3) Step 개요
### Step 0. Platform Entry Bootstrap
- 각 플랫폼의 실제 진입점과 shell 연결을 먼저 만든다.
- 현재 프로젝트가 어떤 `BasePanel`을 첫 화면으로 마운트할지 정한다.
- 이 단계는 platform-specific이지만, 원칙은 공통이다.

핵심 작업:
- 앱 진입 파일과 shell 연결
- 첫 `BasePanel` 연결
- navigation / panel_layer host 진입 연결
- 전역 design / config / localization 진입 확인

예시 메모:
- Node / Next.js: `page.tsx`, `layout.tsx`, `AppShell`
- Flutter: `main.dart`, `app_router.dart`, `AppShell`
- WXT: `entrypoints/*`, `AppShell`
- Electron: `main.ts`, `preload.ts`, `frontend main`, `AppShell`

이 Step에서 하지 않는 일:
- 세부 section 상호작용 구현
- manager 추출

완료 기준:
- 앱이 첫 panel까지 진입한다.
- shell, navigation, panel_layer host가 최소 연결된다.

### Step 1. Panel / Section Skeleton
- planning Step 1에서 만든 panel 폴더와 html 결과를 바탕으로 panel / section 뼈대를 만든다.
- 이 단계의 목적은 화면 구조를 실제 프로젝트 폴더와 UI root에 옮기는 것이다.

핵심 작업:
- `BasePanel` / `LayeredPanel` root 파일 생성
- `sections/` 뼈대 생성
- html 구조 반영
- section 순서와 배치 반영

이 Step에서 하지 않는 일:
- 복잡한 controller 로직 구현
- manager 분리
- 공용화

완료 기준:
- panel root가 보인다.
- 핵심 section이 모두 파일로 존재한다.
- html 구조가 대체로 반영된다.

### Step 2. Controller / Action / Interaction
- planning Step 2 결과를 바탕으로 panel 제어 흐름을 구현한다.
- 이 단계에서 controller, action, interaction, panel 전환, layered open/close를 연결한다.

핵심 작업:
- controller 구현
- action 분리
- section 이벤트 연결
- panel 전환 처리
- layered panel open / close / completion 처리

이 Step에서 하지 않는 일:
- 반복 책임을 성급하게 manager로 올리기
- 구조가 안 닫힌 section을 다시 뜯기

완료 기준:
- 주요 CTA가 동작한다.
- panel 전환과 layered 흐름이 연결된다.
- controller 책임 범위가 드러난다.

### Step 3. Manager Extraction
- planning Step 3 결과를 바탕으로 반복되는 비시각 책임만 manager로 올린다.
- 이 단계는 구현 마무리 단계이지, 시작 단계가 아니다.

핵심 작업:
- 반복 책임 확인
- manager 생성
- panel/controller에서 manager 호출로 정리

이 Step에서 하지 않는 일:
- panel 문맥에 강하게 묶인 로직까지 억지로 공용화
- 단일 panel 전용 책임의 조기 추상화

완료 기준:
- 공용으로 올라갈 책임만 manager가 된다.
- panel과 manager 책임이 분리된다.

## 4) 플랫폼 문서와의 관계
- 이 문서는 `무슨 순서로 구현할지`를 설명한다.
- 각 플랫폼 architecture 문서는 `어디에 구현할지`를 설명한다.
- 따라서 구현자는 항상:
1. 이 문서로 현재 step을 확인하고
2. 해당 플랫폼 architecture 문서로 실제 경로를 확인한다.

## 5) 구현 순서 원칙
- Step 0이 닫히기 전에는 Step 1을 깊게 진행하지 않는다.
- Step 1이 닫히기 전에는 Step 2를 깊게 진행하지 않는다.
- Step 2가 닫히기 전에는 Step 3를 시작하지 않는다.
- 예외가 필요하면 그 이유를 문서에 남긴다.

## 6) 리뷰 연결 원칙
- 리뷰도 현재 구현 step에 맞춰 집중한다.
- Step 1 구현 리뷰는 화면 구조와 section 반영에 집중한다.
- Step 2 구현 리뷰는 controller, action, interaction 흐름에 집중한다.
- Step 3 구현 리뷰는 manager 책임과 공용화 범위에 집중한다.
