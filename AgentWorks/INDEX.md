# AgentWorks 색인

## 1) 문서 역할

`AgentWorks/`는 에이전트가 프로젝트를 이해하고 작업을 이어가기 위한 운영 문서 묶음이다.

## 2) 기본 구조

```text
AgentWorks/
├─ INDEX.md
├─ docs/
├─ WorkDocs/
└─ planning/
```

## 3) 폴더 색인

- `docs/`
  - 프로젝트 고정 규칙, 아키텍처 기준, 외부 공유용 보고서
- `docs/project-rules/`
  - 구현과 리뷰가 따라야 하는 고정 규칙
- `docs/architecture/`
  - 프로젝트 특화 구조 설명, 설계 초안, 장기 방향 메모
- `docs/reports/`
  - 여러 작업을 묶어 외부 공유가 필요한 결과 보고서
- `WorkDocs/`
  - 실제 작업 단위 문서, TODO, 체크리스트, 리뷰 상태, 커밋 가능 여부
- `planning/`
  - 구현 전 기획, panel / section / controller / manager 계획

## 4) 읽기 순서

1. `docs/INDEX.md`
2. `docs/project-rules/architecture/`
3. 플랫폼 특화 제약이 있으면 `docs/project-rules/platform/`
4. 현재 작업이 있으면 `WorkDocs/README.md`
5. 기존 작업 조회가 필요하면 `WorkDocs/query_workdocs.py`
6. 새 작업 생성이 필요하면 `WorkDocs/create_workdoc.py`
7. 필요 시 `planning/`

## 5) 기본 원칙

- 실제 작업 진행 문서는 `WorkDocs/` 아래 작업 루트에 둔다.
- 새 작업은 `WorkDocs/create_workdoc.py`로 만든다.
- 작업 완료 판정은 `WorkDocs/<type>/<work-root>/TODO_*/Checklist.md`와 `review/README.md`를 기준으로 한다.
- `docs/`에는 작업 진행 상태를 두지 않는다.
- `planning/`은 구현 전 설계와 panel 생산라인 계획에 사용한다.
