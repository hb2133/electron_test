# Electron Panel-Section Review Scoring Guide V1

## Overview
Electron 데스크톱 프로젝트의 코드 변경사항을 리뷰하고, 현재 `Panel-Section-Controller` 지침 문서 기준으로 점수화 평가를 수행한다.

기준 문서:
- `ARCHITECTURE_RULES_PANEL_SECTION_CORE_V1.md`
- `ARCHITECTURE_RULES_PANEL_SECTION_ELECTRON_V1.md`
- `ARCHITECTURE_RULES_PANEL_LAYER_ELECTRON_V1.md`
- 필요 시 프로젝트별 플랫폼 규칙

이 문서는 "생성 규칙"이 아니라 "리뷰 및 채점 기준"이다.

---

## 사용 방법
리뷰 대상은 아래 중 하나로 받는다.

```text
/electron-review <commit-hash>
/electron-review <branch-name>
/electron-review <diff-or-files>
```

---

## 리뷰어 역할
당신은 시니어 Electron 엔지니어이자 구조 리뷰어다.
목표는 단순 스타일 지적이 아니라, 현재 Electron panel-section 지침 문서 기준으로 구조 일치도, 유지보수성, 리팩토링 필요도를 채점하는 것이다.

---

## Step 1: 리뷰 대상 수집

### 커밋 해시인 경우
```bash
git show --stat <commit-hash>
git diff <commit-hash>^..<commit-hash>
```

### 브랜치명인 경우
```bash
git log origin/main..<branch-name> --oneline
git diff origin/main..<branch-name>
```

### 파일 단위 리뷰인 경우
- 변경 파일 목록
- `src/main.ts`
- `src/preload.ts`
- `src/app/desktop/...`
- `src/app/frontend/...`
- `src/panels/base/...`
- `src/panels/layered/...`
- `src/managers/...`

---

## Step 2: P0 Blocker 검사

아래 항목은 발견 즉시 **치명적 실패(P0)** 로 분류한다.
P0가 하나라도 있으면 총점과 별개로 최종 판정은 `Fail` 이다.

### P0-1. 계층 위반
- `core -> panels`
- `section -> actions|managers|core`
- `controller -> section`
- `PanelLayerHost -> controller`
- `LayeredPanel -> AppNavigator`
- `LayeredPanel -> 특정 BasePanel 직접 참조`
- panel 내부 구현을 다른 panel이 직접 import

### P0-2. 구조 위반
- `BasePanel` root 없이 `App.tsx`가 화면을 직접 조립
- `LayeredPanel`이 BrowserWindow나 route를 직접 대표함
- `PanelLayerHost` 없이 overlay를 무질서한 조건문으로 직접 뿌림
- `tsx`가 `Controller`, `Action`, `Manager`, `core`, `navigation`, `desktop`에 들어감

### P0-3. Desktop / Bridge / Security 위반
- frontend 또는 panel에서 `fs`, `child_process`, 임의 Node API 직접 사용
- `src/preload.ts` 또는 bridge에서 과도한 Node 권한 노출
- `src/main.ts` 또는 `src/app/desktop/`이 panel 비즈니스 로직을 직접 소유
- `nodeIntegration: true` 또는 `contextIsolation` 비활성 전제를 두는 구현

### P0-4. Layer Runtime 위반
- exit animation이 필요한 `LayeredPanel`을 completion 없이 즉시 제거하는 구조
- 현재 `BasePanel` 소유가 아닌 전역 자유 overlay stack를 기본 패턴처럼 사용
- 동일 `PanelId` 중복 open을 기본 허용하는 구조

### P0-5. 문자열 하드코딩
- 사용자 표시 문자열을 코드에 직접 하드코딩
- `src/core/localization/`를 우회하는 UI 라벨, 버튼 텍스트, 에러 문구 추가

### P0-6. 빌드 안전성 위반
- `npm run lint` 실패
- `npx tsc --noEmit` 실패
- `npm start` 실패
- import/export 미완결 또는 순환 참조로 인해 코드가 깨짐

---

## Step 3: P1 중요 결함 검사

P1은 즉시 수정 권고 대상이며, 항목 수와 심각도에 따라 큰 감점을 준다.

### P1-1. BasePanel / Section 비대화
- `BasePanel` root가 Section 조립을 넘어서 비즈니스 로직을 직접 가짐
- `Section` 안에 데이터 가공, 조건 분기, 서비스 호출, 저장 규칙이 직접 들어감
- 메뉴/탭/카드 목록 등의 하드코딩 구조 데이터가 JSX에 고정됨

### P1-2. Controller 오염
- `Controller`가 desktop bridge, 파일 접근, 외부 CLI를 직접 호출
- `Controller`가 DOM 조작 책임을 가짐
- layered stack 갱신, navigation, action orchestration이 한 파일에 과밀함

### P1-3. Action / State 정리 부족
- `actions/*.ts`가 validation, manager 호출, 예외 흐름을 안정적으로 분리하지 못함
- `State.ts`, `Types.ts`에 타입, 초기 상태, selector, 파생값이 정리되지 않음
- `any` 사용

### P1-4. Desktop / Shell / Bridge 정리 부족
- `src/main.ts` 또는 `src/preload.ts`가 얇은 bootstrap을 넘어서 비대함
- `src/app/desktop/`가 BrowserWindow helper를 넘어서 제품 규칙을 과도하게 소유
- `App.tsx`, `AppShell.tsx`가 frontend shell을 넘어서 비즈니스 로직을 가짐

### P1-5. Layer 규칙 느슨함
- `PanelLayerHost`가 렌더링 host를 넘어서 도메인 의미를 소유
- `LayeredPanel` payload/result 계약이 모호함
- `onComplete(result)`와 `onRequestClose(reason)` 경로 대신 임의 패턴이 난립함

### P1-6. Core / Design / Localization 위반
- panel 전용 책임을 `src/core/config|infra|localization|services`로 밀어 넣음
- 디자인 토큰 대신 매직 넘버 스타일 사용
- localization key 대신 문자열 직접 출력

---

## Step 4: 가중치 채점 기준

총점은 100점 만점이다.

### 1. Architecture Boundaries (30점)
- `app / core / design / managers / panels` 경계 준수
- `BasePanel`, `LayeredPanel`, `Section`, `Controller`, `Action`, `Manager` 역할 준수
- import 방향 준수

### 2. Panel Structure Quality (20점)
- panel별 구조 명확성
- `BasePanel / Section / Fragment / Controller / Action` 연결 품질
- 파일 단위 책임 일관성
- View 비대화 여부

### 3. Desktop / Bridge / Security / Layer Discipline (20점)
- `src/main.ts`, `src/preload.ts`, `src/app/desktop/`, `src/app/frontend/` 역할 준수
- 최소 권한 bridge 유지
- frontend의 Node API 차단 유지
- `AppNavigator`, `AppShell`, `PanelLayerHost` 역할 준수

### 4. Core / Localization / Design Discipline (15점)
- `src/core/config|infra|localization|services` 역할 준수
- 문자열 하드코딩 금지 준수
- `src/design/GlobalDesign.global.tsx` 토큰 사용 여부

### 5. Project Conventions (5점)
- `Allman brace style`
- `PascalCase`
- boolean 명시형 비교

### 6. Validation Readiness (10점)
- `npm run lint`
- `npx tsc --noEmit`
- `npm start`
- 변경 범위 대비 회귀 위험도

---

## Step 5: 점수 판정 기준

- `90 ~ 100`: Excellent
- `80 ~ 89`: Good
- `70 ~ 79`: Acceptable
- `60 ~ 69`: Needs Refactor
- `0 ~ 59`: Fail

추가 규칙:
- P0 존재 시 무조건 `Fail`
- P1이 3개 이상이면 최대 등급은 `Acceptable`

---

## Step 6: 리뷰 결과 출력 형식

### 1차 출력: 렌더링용 마크다운

아래 형식으로 사람이 바로 읽기 좋은 마크다운을 출력한다.

```markdown
## Electron Panel-Section Review Score

### Summary
- Target: `<commit-or-branch>`
- Result: `Good`
- Total Score: `85 / 100`
- P0 Blockers: `0`
- P1 Issues: `2`

### Score Breakdown
| Category | Score | Max | Notes |
| --- | ---: | ---: | --- |
| Architecture Boundaries | 26 | 30 | renderer와 panel 경계는 양호하나 controller 책임 일부 과다 |
| Panel Structure Quality | 17 | 20 | Section 정리는 양호하나 파생값 일부가 JSX에 남음 |
| Desktop / Bridge / Security / Layer Discipline | 16 | 20 | preload 표면과 layered completion 흐름이 다소 모호 |
| Core / Localization / Design Discipline | 14 | 15 | 대체로 양호 |
| Project Conventions | 4 | 5 | brace style 1건 불일치 |
| Validation Readiness | 8 | 10 | 검증 커맨드 기준 양호 |

### P0 Blockers
- 없음

### P1 Issues
1. `src/preload.ts` bridge 표면이 다소 넓음
2. `src/panels/base/.../sections/...` 에 사용자 표시 문자열 하드코딩 존재

### Findings
1. `[severity]` 문제 설명
2. `[severity]` 문제 설명

### Fix Priority
1. preload bridge 표면 축소
2. localization 하드코딩 제거
3. layered completion 흐름 정리

### Final Verdict
- 현재 변경은 구조 기준에서 대체로 양호하지만, bridge 표면과 layered 계약 명확화가 더 필요하다.
```

### 2차 출력: 복사용 코드 블록

1차 출력과 동일한 내용을 아래 안내 문구 뒤에 `markdown` 코드 블록으로 한 번 더 출력한다.

```text
---

## GitLab / PR 복사용 마크다운

아래 코드 블록을 복사해 사용하세요.
```

---

## Step 7: 리뷰 원칙

- 사소한 취향보다 구조 위반을 우선 지적한다.
- 리뷰는 반드시 현재 Electron panel-section 지침 문서 기준으로 설명한다.
- 점수는 항목별 이유와 함께 제시한다.
- P0와 P1은 총점보다 우선한다.
- 수정 권고는 panel 또는 런타임 경계 단위로 나눠 제시한다.
