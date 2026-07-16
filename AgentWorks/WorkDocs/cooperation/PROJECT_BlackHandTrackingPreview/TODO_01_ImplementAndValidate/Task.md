# Task

## Context
- Electron preview에서 카메라 원본을 기본적으로 숨긴다.
- 검은 배경 위에 양손 랜드마크와 성능 지표는 계속 표시한다.

## Implementation
- 초기 `VideoVisible` 값을 `false`로 변경한다.
- 영상 비표시 시 Canvas를 `#000000`으로 채운다.
- `setVideoVisible:true|false` 처리 경로는 유지한다.

## Result
- TypeScript 검사와 ESLint가 통과했다.
- Windows x64 package 생성이 성공했다.
- `E:\\VTuber\\MediaPipeGPUTracker`에 배포하고 build/배포 실행 파일의 SHA-256 일치를 확인했다.

## History Index
- 아직 분리된 이력이 없다.
