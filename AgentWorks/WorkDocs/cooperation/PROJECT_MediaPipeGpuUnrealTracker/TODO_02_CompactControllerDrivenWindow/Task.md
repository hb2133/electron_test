# Task

## Context
- 기존 C++ `MediaPipe Tracker[GPU]`와 같은 소형 상태창으로 Electron UI를 단순화한다.
- 프로그램 제어는 VTuberController가 담당한다.

## Current Understanding
- 기준 창 외곽 크기는 336×279, 콘텐츠는 320×240이다.
- 표시 요소는 카메라 영상, 손 랜드마크, FPS, inference time뿐이다.
- 기존 C++ 호환 실행 인자는 `[camera_index] [use_16_9]`다.

## Implementation Notes
- `BrowserWindow` 콘텐츠 크기를 320×240으로 고정하고 메뉴, 최대화, 전체화면을 비활성화했다.
- renderer는 카메라/랜드마크/FPS/inference time만 표시하는 단일 preview section으로 축소했다.
- renderer 초기화가 끝나면 추적을 자동 시작한다.
- Electron 디버그 옵션을 제외한 위치 인자 `[camera_index] [use_16_9]`를 main에서 해석해 renderer에 전달한다.
- 카메라 권한이 아직 없을 때 임시 stream으로 권한을 확보한 뒤 장치를 열거한다.
- TCP 명령 처리와 422-float payload 전송 경로는 그대로 유지했다.

## Result
- 기준 C++ 창과 동일하게 외곽 336×279, 콘텐츠 320×240으로 동작하는 것을 Windows에서 확인했다.
- 자동 카메라 시작, GPU 모델 초기화, 랜드마크 및 FPS/inference overlay 표시를 확인했다.
- `npx tsc --noEmit`, `npm run lint`, Windows x64 package가 모두 성공했다.
- 최종 package를 `E:\\VTuber\\MediaPipeGPUTracker`에 배포하고 실행 파일 SHA-256 일치를 확인했다.
