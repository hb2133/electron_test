# Tags

이 문서는 이 프로젝트의 WorkDocs 표준 태그 사전이다.

## mediapipe
DisplayName: MediaPipe 추적
Aliases: tracking, vision
Description: MediaPipe 기반 얼굴, 손, 포즈 추적과 GPU 추론에 관련된 작업

## unreal
DisplayName: Unreal 연동
Aliases: tcp, protocol
Description: Unreal Engine과의 TCP 연결 및 추적 데이터 프로토콜에 관련된 작업

## electron
DisplayName: Electron 데스크톱
Aliases: desktop, renderer
Description: Electron main, preload, renderer 및 데스크톱 패키징에 관련된 작업

규칙:

- 태그는 작업 루트의 `Meta.md`에서만 사용한다.
- `Meta.md`의 `Tags` 값은 이 문서에 정의된 표준 태그 이름과 정확히 일치해야 한다.
- 이 파일에 작업 목록을 수동으로 적지 않는다.
- 작업 간 연결은 각 작업 루트의 `Meta.md`를 기준으로 조회한다.

새 태그는 아래 형식으로 추가한다.

```md
## tag_name
DisplayName: 표시 이름
Aliases: alias-a, alias-b
Description: 이 태그가 담당하는 작업 영역
```
