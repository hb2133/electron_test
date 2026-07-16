# Docs 색인

## 1) 문서 역할

이 문서는 `AgentWorks/docs/` 내부 색인이다.

`docs/`는 프로젝트의 고정 규칙, 프로젝트 특화 아키텍처, 외부 공유용 보고서를 둔다.
작업 진행 상태, TODO, 체크리스트, 리뷰 상태, 커밋 가능 여부는 이 폴더에 두지 않는다.

## 2) 기본 구조

```text
docs/
├─ INDEX.md
├─ project-rules/
│  ├─ architecture/
│  ├─ review/
│  └─ platform/
├─ reports/
└─ architecture/
```

## 3) 폴더 역할

- `project-rules/`
  - 현재 프로젝트에서 따라야 하는 고정 규칙 문서
- `project-rules/architecture/`
  - 구현 전 반드시 확인해야 하는 아키텍처 규칙
  - `ARCHITECTURE_RULES_PANEL_SECTION_*`와 `ARCHITECTURE_RULES_PANEL_LAYER_*` 두 세트를 모두 읽는다.
  - `PANEL_SECTION` 문서는 panel / section / controller / action / interaction 경계를 정의한다.
  - `PANEL_LAYER` 문서는 base panel과 layered panel, overlay / modal / stack 같은 layer 운영 경계를 정의한다.
- `project-rules/review/`
  - 리뷰와 평가가 따라야 하는 기준 문서
- `project-rules/platform/`
  - Flutter / Electron 같은 플랫폼 특화 제약 문서
- `architecture/`
  - 현재 프로젝트 특화 구조 정리, 설계 초안, 장기 방향 메모
- `reports/`
  - 여러 작업을 묶어 외부 공유가 필요한 구현 / 평가 / 브레인스토밍 결과 보고서

## 4) 읽기 순서

1. `project-rules/architecture/`
   - `ARCHITECTURE_RULES_PANEL_SECTION_*` 문서를 읽는다.
   - `ARCHITECTURE_RULES_PANEL_LAYER_*` 문서를 읽는다.
2. 플랫폼 특화 제약이 있으면 `project-rules/platform/`
3. 현재 프로젝트 구조나 장기 방향이 필요하면 `architecture/`
4. 이전 결과나 외부 공유 요약이 필요하면 `reports/`

## 5) 기본 원칙

- 구현 세션은 먼저 `project-rules/architecture/`를 확인한다.
- 플랫폼 특화 제약이 있으면 `project-rules/platform/`을 추가로 확인한다.
- `project-rules/`와 `architecture/`의 역할을 혼동하지 않는다.
- 개별 작업의 최신 진행 상태나 완료 판정은 `docs/`에 두지 않는다.
- `reports/`는 프로젝트 밖으로 공유해야 하는 요약이 있을 때만 사용한다.
