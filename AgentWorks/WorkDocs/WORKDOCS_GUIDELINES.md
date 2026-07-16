# WorkDocs 운영 가이드라인

## 1. 목적

`WorkDocs`는 작업 문서의 저장 위치가 아니라, 작업 단위와 리뷰 단위를 명확하게 유지하기 위한 운영 공간이다.

이 문서는 아래 목표를 만족하도록 작성한다.

- 다른 작업자나 다른 에이전트가 빈 폴더 상태에서도 바로 구조를 만들 수 있어야 한다.
- 작업 종류와 컨텐츠 연관성을 분리해서 관리할 수 있어야 한다.
- `TODO` 1개 완료 = 리뷰 완료 후 커밋 가능 상태라는 흐름이 유지되어야 한다.
- 자유 메모와 판정 기준 파일이 서로 섞이지 않아야 한다.

---

## 2. 핵심 원칙

### 2.1 상위 분류는 작업 타입 기준으로만 나눈다

- 상위 폴더는 `cooperation/`, `bugfix/` 두 종류만 둔다.
- `cooperation/`은 개선, 기능 작업, 조사, 협업성 작업을 둔다.
- `bugfix/`는 버그 수정 작업을 둔다.
- 상위 분류는 공용 운영 규칙이다.
- 실제 컨텐츠 연관성은 태그와 메타 정보로 관리한다.

### 2.2 작업 루트가 실제 관리 단위다

- 하나의 작업은 하나의 작업 루트 폴더로 관리한다.
- 작업 루트 아래에 여러 `TODO_*` 폴더를 둔다.
- 하나의 작업이 여러 시스템 층위를 건드려도 작업 루트는 하나로 유지할 수 있다.

### 2.3 커밋 단위는 TODO 단위다

- 기본 운영 단위는 `TODO` 1개 완료 후 커밋이다.
- `TODO`는 한 번의 리뷰와 한 번의 커밋으로 닫을 수 있는 크기로 유지한다.
- 리뷰 결과로 수정이 생겨도 대부분은 같은 `TODO` 안에서 처리한다.
- 리뷰 결과가 독립 작업 범위로 커지면 그때 새 `TODO`를 만든다.

### 2.4 자유 문서와 판정 문서를 분리한다

- `README.md`, `Task.md`는 자유 기재용 문서다.
- `Meta.md`, `TODO.md`, `Checklist.md`, `review/README.md`는 현재 상태와 판정에 쓰는 문서다.
- 완료 여부는 자유 메모로 판단하지 않는다.

### 2.5 역할 분할은 작업 단위 내부에서 처리한다

- 역할 분할 때문에 작업 루트 바깥에 별도 폴더를 만들지 않는다.
- `handoff/`, `worker/`, `orchestrator/` 같은 역할 전용 폴더는 기본 구조로 만들지 않는다.
- 역할별 메모가 필요하면 먼저 `Task.md`의 섹션, `Checklist.md`의 항목, `review/`의 라운드 문서로 처리한다.

---

## 3. WorkDocs 루트 구조

예시:

```text
WorkDocs/
  WORKDOCS_GUIDELINES.md
  README.md
  create_workdoc.py
  query_workdocs.py
  tags/
    README.md
  cooperation/
  bugfix/
  templates/
    work-root/
    todo/
```

규칙:

- `WORKDOCS_GUIDELINES.md`는 현재 운영 기준 문서다.
- `README.md`는 에이전트용 빠른 시작 안내 문서다.
- `create_workdoc.py`는 작업 루트와 첫 TODO를 생성하는 보조 스크립트다.
- `tags/`는 태그 사전이다.
- `query_workdocs.py`는 선택이지만 권장한다.
- 조회 스크립트는 작업 루트의 `Meta.md`와 `tags/README.md`를 기준으로 태그별 작업 조회를 할 수 있어야 한다.
- 조회 도구는 문서를 수정하지 않고 읽기 전용으로 동작해야 한다.
- `templates/`는 부트스트랩용 시작 템플릿이다.
- 기존 가이드나 레거시 문서는 남겨둘 수 있지만, 새 작업은 이 문서를 기준으로 한다.

---

## 4. 작업 루트 구조

예시:

```text
cooperation/
  PROJECT_Editor_Improve/
    Meta.md
    README.md
    TODO.md
    TODO_01_State_Model/
    TODO_02_Rendering_Update/
    TODO_03_Command_Routing/
```

또는:

```text
bugfix/
  BUG_5001_LoginSessionRefresh/
    Meta.md
    README.md
    TODO.md
    TODO_01_ReproAndCause/
    TODO_02_FixStateTransition/
```

규칙:

- 작업 루트에는 최소한 `Meta.md`, `README.md`, `TODO.md`를 둔다.
- 작업 개요와 설명은 `README.md`에 자유롭게 적는다.
- 전체 TODO 현황은 `TODO.md`에서 관리한다.
- 작업 루트 태그는 `Meta.md`에만 둔다.
- 태그는 복수 허용이다.

---

## 5. 작업 루트 파일 규칙

### 5.1 Meta.md

`Meta.md`는 고정 포맷 문서다.

권장 예시:

```md
# Meta

Title: Login Session Refresh Fix
Type: bugfix
Tags: auth, session
Origin: PROJECT_Account_Improve
Status: in_progress
```

규칙:

- `Title`, `Type`, `Tags`, `Status`는 기본 필수로 본다.
- `Origin`은 관련 원작업이 있을 때만 적는다.
- 한 작업은 여러 태그를 가질 수 있다.
- `Tags`에 적는 태그 이름은 반드시 `tags/README.md`에 정의된 표준 태그와 동일해야 한다.
- 메타 정보는 도구가 파싱할 수 있도록 `Key: Value` 형식을 유지한다.

### 5.2 README.md

`README.md`는 자유 문서다.

담을 수 있는 내용:

- 작업 개요
- 배경
- 범위
- 참고 문서
- 특이사항
- 작업 중간 요약

주의:

- 완료 판정 기준은 `README.md`에 두지 않는다.
- 자유 기재가 많아져도 괜찮지만, 최신 판정 정보는 다른 파일로 분리한다.

### 5.3 TODO.md

`TODO.md`는 작업 루트 전체의 상위 현황판이다.

권장 예시:

```md
# TODO

- [x] TODO_01_State_Model
- [ ] TODO_02_Rendering_Update
- [ ] TODO_03_Command_Routing

Current Focus:
- TODO_02_Rendering_Update
```

규칙:

- 각 `TODO_*` 폴더와 1:1로 대응하는 상위 목록을 유지한다.
- 루트 `TODO.md`는 큰 작업의 진행도만 보여준다.
- 세부 실행 항목은 각 TODO 폴더의 `Checklist.md`에서 관리한다.

---

## 6. TODO 폴더 구조

예시:

```text
TODO_02_Rendering_Update/
  Checklist.md
  Task.md
  review/
    README.md
    R01_2026-04-15_AI.md
    R02_2026-04-15_Human.md
  history/
    RenderingState_PreviousAttempts.md
```

규칙:

- 기본 파일은 `Checklist.md`, `Task.md`, `review/README.md`다.
- `review/` 폴더는 리뷰가 여러 번 반복될 수 있으므로 기본 구조로 둔다.
- `history/`와 세부 문서는 `Task.md`가 과도하게 길어져 읽기 어려울 때만 추가한다.
- `Implementation.md`, `Validation.md`, 날짜형 `WORKLOG`는 기본 필수로 두지 않는다.
- 역할 분할만을 위한 `handoff/`, `worker/`, `orchestrator/` 폴더는 기본으로 만들지 않는다.

---

## 7. TODO 폴더 파일 규칙

### 7.1 Checklist.md

`Checklist.md`는 해당 TODO의 최신 상태만 유지하는 문서다.

규칙:

- 항상 최신 상태로 유지한다.
- 끝난 항목은 완료 표시하거나 필요 없으면 제거한다.
- 오래된 체크리스트를 누적 보관하는 용도로 쓰지 않는다.
- 리뷰가 시작된 뒤 리뷰로 인해 추가된 작업은 별도 섹션으로 관리한다.

권장 예시:

```md
# Checklist

## Main
- [x] 재현 조건 확인
- [x] 원인 지점 확인
- [ ] 수정 반영
- [ ] 기본 검증

## Review Follow-ups
- [ ] AI 리뷰 지적사항 반영
- [ ] 범위 외 로그 제거 확인
```

### 7.2 Task.md

`Task.md`는 자유 메모를 포함하되, 최신 이해와 작업 중 확인된 현상을 누적하는 문서다.

담을 수 있는 내용:

- 작업 중 생각 정리
- 조사 메모
- 현재 기준 원인 정리
- 작업 중 새로 확인된 현상
- 방향 변경 이유
- 하위 문서 링크
- 다음 시도 방향

규칙:

- 체크리스트 단위로 작업을 진행하되, 기록 방식은 자유롭게 둔다.
- 파일을 불필요하게 늘리기보다 `Task.md` 안에 이어서 누적 정리하는 방식을 우선한다.
- 작업 중 확인된 중요한 현상, 수정 후 새로 발생한 현상, 폐기한 가설, 방향 전환 이유는 `Task.md`에 남긴다.
- 오래된 내용을 전부 지우기보다, 최신 상태로 정리하면서도 중요한 현상 변화는 유실되지 않게 유지한다.
- `Task.md`가 과도하게 길어져 읽기 어려워지면, 그때만 `history/` 폴더를 추가해 세부 이력을 분할 정리할 수 있다.
- `history/`를 사용할 경우에도 `Task.md`에는 어떤 이력이 분리되었는지 간단한 인덱스 또는 링크를 남긴다.
- 작업 파악은 기본적으로 `Task.md`를 먼저 보고, `Task.md`에 연결된 `history/`가 있으면 그 파일까지 함께 확인하는 것을 원칙으로 한다.
- 필요하면 자유롭게 하위 문서를 추가해도 된다.
- `Task.md`만 보고 완료 판정을 내리지는 않는다.

권장 섹션 예시:

```md
# Task

## Bug Context
- 현재 문제 요약

## Current Understanding
- 지금 기준 원인 또는 핵심 추정

## Observed Issues
- 런타임에서 실제 확인된 현상
- 수정 후 새로 생긴 현상

## Decision Notes
- 왜 수정 방향을 바꿨는지
- 왜 특정 가설을 폐기했는지

## Fix Notes
- 현재 적용한 수정

## History Index
- 아직 분리된 이력이 없다.
```

버그 수정이 아닌 기능 작업이면 `Bug Context` 대신 `Context`, `Fix Notes` 대신 `Implementation Notes`처럼 바꿔도 된다.

### 7.3 review/README.md

`review/README.md`는 현재 리뷰 상태의 판정판이다.

권장 예시:

```md
# Review Status

Todo: TODO_02_Rendering_Update
CurrentRound: R02
Status: in_review
ReadyToCommit: no
OpenReviewActions: 2

LatestSummary:
- 종료 조건 누락
- 검증 메모 보강 필요

LastCommit:
- Branch: -
- Hash: -
- Subject: -
```

규칙:

- 최신 리뷰 상태만 적는다.
- 커밋 가능 여부는 `ReadyToCommit`으로 명시한다.
- 남은 리뷰 후속 작업 수는 `OpenReviewActions`에 적는다.
- 커밋이 생성된 뒤에는 마지막 커밋 정보를 `LastCommit` 블록에 기록한다.
- 커밋 기록은 `Branch`, `Hash`, `Subject`를 함께 남기는 것을 기본으로 한다.
- 이 파일이 최종 판정 기준이다.

### 7.4 review/Rxx_YYYY-MM-DD_*.md

리뷰 라운드별 이력 문서다.

예시:

- `R01_2026-04-15_AI.md`
- `R02_2026-04-15_Human.md`

규칙:

- 리뷰할 때마다 새 파일을 만든다.
- 파일명은 라운드 번호와 날짜를 포함한다.
- AI 리뷰와 사람 리뷰는 파일명이나 본문에서 구분한다.
- 이력 문서와 `Checklist.md`를 반드시 1:1로 매칭시킬 필요는 없다.
- 최종 완료 판단은 `Checklist.md`의 남은 항목과 `review/README.md`로 한다.

---

## 8. 태그 운영 규칙

### 8.1 태그는 작업 루트 단위로만 둔다

- 태그는 `TODO` 단위가 아니라 작업 루트 단위로 둔다.
- 이유는 `TODO`마다 태그를 달면 지나치게 세분화되기 쉽기 때문이다.
- 하나의 작업은 여러 컨텐츠와 시스템 층위를 동시에 건드릴 수 있으므로 복수 태그를 허용한다.

### 8.2 tags/ 폴더는 태그 사전이다

예시:

```text
tags/
  README.md
```

부트스트랩 직후에는 실제 프로젝트 태그가 없을 수 있다.
실제 작업 루트를 만들기 전에 `tags/README.md`에 프로젝트 태그를 하나 이상 정의한다.

태그 문서 예시:

```md
# Tags

## auth
DisplayName: 인증
Aliases: login, session
Description: 로그인, 세션 갱신, 토큰, 권한 확인과 관련된 작업

## editor
DisplayName: 에디터
Aliases: workspace-editor
Description: 편집 화면, 선택 상태, 편집 명령, 미리보기 동작과 관련된 작업
```

규칙:

- `tags/README.md`는 태그 표준명과 설명을 모아둔 단일 문서다.
- 태그가 많지 않은 동안은 단일 문서로 유지한다.
- 태그가 과도하게 많아지거나 설명이 길어질 때만 개별 파일로 승격을 검토한다.
- 실제 작업 루트의 `Meta.md`에서 사용하는 태그는 이 문서의 표준 태그와 동일해야 한다.
- 추후 `query_workdocs.py` 같은 루트 조회 스크립트는 이 표준 태그를 기준으로 작업 목록을 조회할 수 있다.
- 태그 문서에 작업 목록을 수동으로 관리하지 않는다.
- 실제 연결 관계는 각 작업 루트의 `Meta.md`가 담당한다.

---

## 9. 리뷰와 커밋 흐름

### 9.1 기본 흐름

1. 작업 루트를 만든다.
2. `Meta.md`, `README.md`, `TODO.md`를 만든다.
3. 작업 루트 아래에 필요한 `TODO_*` 폴더를 만든다.
4. TODO 작업 중에는 `Checklist.md`와 `Task.md`를 최신화한다.
5. TODO가 끝났다고 판단되면 `review/`를 시작한다.
6. 리뷰 결과 수정이 생기면 같은 TODO의 `Checklist.md`에 `Review Follow-ups`로 반영한다.
7. `review/README.md`가 `ReadyToCommit: yes`가 되고 `OpenReviewActions: 0`이 되면 커밋 가능 상태로 본다.
8. 커밋 후에는 `review/README.md`의 `LastCommit`에 `Branch`, `Hash`, `Subject`를 기록한다.
9. 커밋 후에는 작업 루트의 `TODO.md`를 최신화한다.

### 9.2 리뷰가 여러 번 반복될 때

- 리뷰는 여러 라운드 반복될 수 있다.
- 리뷰 실패는 새 TODO를 만드는 신호가 아니라, 보통 같은 TODO 안에서 추가 수정하는 신호다.
- 다만 리뷰 결과가 본래 범위를 넘어서는 독립 작업이 되면 새 TODO를 만든다.

---

## 10. 빈 폴더에서 시작할 때의 최소 생성 규칙

다른 에이전트나 작업자가 빈 폴더 상태에서 시작할 때는 아래 순서로 구조를 만든다.

1. 태그 사전을 확인한다.
   - `tags/README.md`에 실제 프로젝트 태그가 없으면 먼저 태그를 정의한다.
2. 상위 분류를 고른다.
   - 개선/협업성 작업이면 `cooperation/`
   - 버그 수정 작업이면 `bugfix/`
3. 기본적으로 `create_workdoc.py`로 작업 루트와 첫 TODO를 생성한다.

예시:

```bash
python3 create_workdoc.py bugfix BUG_5001_LoginSessionRefresh \
  --title "Login Session Refresh Fix" \
  --tags auth,session \
  --todo ReproAndCause
```

4. 스크립트를 쓸 수 없을 때만 작업 루트를 직접 만든다.
   - 부트스트랩 템플릿이 있으면 `templates/work-root/`를 복사해서 시작할 수 있다.
5. 작업 루트에 `Meta.md`, `README.md`, `TODO.md`를 만든다.
6. 첫 번째 `TODO_01_*` 폴더를 만든다.
   - 부트스트랩 템플릿이 있으면 `templates/todo/`를 복사해서 시작할 수 있다.
7. TODO 안에 `Checklist.md`, `Task.md`, `review/README.md`를 만든다.

최소 예시:

```text
bugfix/
  BUG_5001_Sample/
    Meta.md
    README.md
    TODO.md
    TODO_01_Repro/
      Checklist.md
      Task.md
      review/
        README.md
```

이 구조만 있으면 다른 에이전트도 바로 문서 작성과 작업 진행을 시작할 수 있어야 한다.

---

## 11. 금지 및 비권장 사항

- 루트에 작업 문서를 평면으로 늘어놓지 않는다.
- 역할 분할만을 위한 `handoff/`, `worker/`, `orchestrator/` 폴더를 기본으로 만들지 않는다.
- 날짜형 `WORKLOG-YYYY-MM-DD.md`를 기본 운영 방식으로 쓰지 않는다.
- `Implementation.md`, `Validation.md`를 기본 필수 문서로 만들지 않는다.
- `Task.md`가 읽기 어려워지기 전에는 이력 파일을 미리 쪼개지 않는다.
- `README.md`나 `Task.md`만으로 완료 판정을 하지 않는다.
- 태그를 TODO 단위로 난발하지 않는다.
- 태그 사전 파일에 실제 작업 목록을 수동으로 적지 않는다.
- 조회 도구가 문서를 수정하게 만들지 않는다.

---

## 12. 요약

앞으로의 기본 운영 기준은 아래와 같다.

1. 상위 분류는 `cooperation/`, `bugfix/` 두 개만 둔다.
2. 실제 관리 단위는 작업 루트다.
3. 작업 루트에는 `Meta.md`, `README.md`, `TODO.md`를 둔다.
4. 태그는 작업 루트 `Meta.md`에만 두고 복수 허용한다.
5. 각 TODO는 `Checklist.md`, `Task.md`, `review/README.md`를 기본으로 가진다.
6. `Checklist.md`는 최신 상태만 유지한다.
7. 리뷰는 `review/` 폴더에 라운드별로 남긴다.
8. TODO 1개 완료 후 리뷰 통과를 커밋 단위로 본다.
9. 빈 폴더 상태에서도 이 문서만 읽으면 구조를 재현할 수 있어야 한다.
10. 역할 분할은 작업 단위 내부에서 처리하고, 역할 전용 폴더를 기본 구조로 만들지 않는다.
