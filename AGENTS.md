# AGENTS.md

## Entry

에이전트 운영 문서는 `AgentWorks/` 아래에 있다.
먼저 `AgentWorks/INDEX.md`를 읽는다.

## Folder Index

- `AgentWorks/docs/`
  - 프로젝트 고정 규칙, 아키텍처 기준, 외부 공유용 보고서
- `AgentWorks/WorkDocs/`
  - 실제 작업 단위 문서, TODO, 체크리스트, 리뷰 상태, 커밋 가능 여부
- `AgentWorks/planning/`
  - 구현 전 기획, panel / section / controller / manager 계획

## Read Order

1. `AgentWorks/INDEX.md`
2. `AgentWorks/docs/INDEX.md`
3. `AgentWorks/docs/project-rules/architecture/`
4. 필요 시 `AgentWorks/docs/project-rules/platform/`
5. 현재 작업이 있으면 `AgentWorks/WorkDocs/README.md`
6. 필요 시 `AgentWorks/planning/`

## Rules

- 구현은 항상 현재 프로젝트 루트를 기준으로 수행한다.
- 실제 작업 진행 문서는 `AgentWorks/WorkDocs/` 아래 작업 루트에 둔다.
- 새 작업은 `AgentWorks/WorkDocs/create_workdoc.py`로 만든다.
- 작업 진행 상태를 `AgentWorks/docs/`에 두지 않는다.
- `AgentWorks/docs/project-rules/`와 `AgentWorks/docs/architecture/`의 역할을 혼동하지 않는다.
- panel / section / controller / manager 경계를 먼저 지키고, 세부 구현은 그 다음에 진행한다.
