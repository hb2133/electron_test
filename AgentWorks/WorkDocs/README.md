# WorkDocs 에이전트 진입 문서

이 문서는 에이전트가 `WorkDocs`에서 새 작업을 시작하거나 기존 작업을 찾을 때의 진입점이다.

먼저 `WORKDOCS_GUIDELINES.md`를 읽고, 실제 작업 루트 생성은 기본적으로
`create_workdoc.py`를 사용한다.

## 1. 기존 작업 찾기

현재 작업이 이미 존재할 수 있으면 먼저 조회한다.

```bash
python3 query_workdocs.py list
```

태그를 알고 있으면 태그로 조회한다.

```bash
python3 query_workdocs.py tag <tag-name>
```

작업 루트 이름을 알고 있고 관련 작업을 찾아야 하면 공유 태그로 조회한다.

```bash
python3 query_workdocs.py related <work-root-name>
```

## 2. 새 작업 생성 전 확인

새 작업 루트를 만들기 전에 `tags/README.md`를 확인한다.

```bash
python3 query_workdocs.py list-tags
```

`tags/README.md`에 표준 태그가 없으면 먼저 프로젝트 태그를 정의한다.
작업 루트의 `Meta.md`에서 사용할 태그는 반드시 이 파일에 정의된 표준 태그와
일치해야 한다.

## 3. 새 작업 생성

새 작업은 `create_workdoc.py`로 만든다. `templates/`를 직접 복사하는 것은
스크립트를 쓸 수 없을 때만 허용한다.

형식:

```bash
python3 create_workdoc.py <cooperation|bugfix> <work-root-name> \
  --title "<work title>" \
  --tags <tag-a,tag-b> \
  --todo <todo-name>
```

예시:

```bash
python3 create_workdoc.py bugfix BUG_5001_LoginSessionRefresh \
  --title "Login Session Refresh Fix" \
  --tags auth,session \
  --todo ReproAndCause
```

위 예시는 아래 구조를 만든다.

```text
bugfix/
  BUG_5001_LoginSessionRefresh/
    Meta.md
    README.md
    TODO.md
    TODO_01_ReproAndCause/
      Checklist.md
      Task.md
      review/
        README.md
```

## 4. 생성 후 작성 순서

생성 직후 아래 파일을 실제 작업에 맞게 채운다.

1. `Meta.md`
2. `README.md`
3. `TODO.md`
4. `TODO_*/Task.md`
5. `TODO_*/Checklist.md`
6. `TODO_*/review/README.md`

작업 중에는 `Task.md`와 `Checklist.md`를 계속 최신화한다.
완료 가능 여부는 `Checklist.md`와 `review/README.md`로 판단한다.

## 5. 금지

- `templates/` 안의 원본 파일을 실제 작업 문서로 직접 수정하지 않는다.
- `tags/README.md`에 없는 태그를 사용하지 않는다.
- `--allow-undefined-tags`는 태그 사전을 아직 정리하지 못한 임시 실험 상황에서만 사용한다.
- 역할 분할만을 위한 `handoff/`, `worker/`, `orchestrator/` 폴더를 만들지 않는다.
- 작업 문서를 WorkDocs 루트에 평면으로 만들지 않는다.
- 완료 판정은 `README.md`나 `Task.md`만 보고 하지 않는다.
