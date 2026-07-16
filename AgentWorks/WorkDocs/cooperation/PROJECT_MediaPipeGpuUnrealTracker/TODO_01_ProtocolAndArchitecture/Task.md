# Task

## Context
- Warudo의 Electron 기반 MediaPipe GPU 실행 방식을 참고하되, 기존 C++ 프로그램과 동일한 Unreal 연동 계약을 제공한다.

## Current Understanding
- Electron renderer의 Chromium/WebGL에서 MediaPipe Tasks Vision GPU delegate를 실행한다.
- raw TCP는 renderer가 아닌 main process의 제한된 서비스가 소유한다.
- renderer는 preload bridge를 통해 고정된 tracking payload와 연결 상태만 교환한다.
- 패킷은 little-endian `int32 protocol=1001`, `uint32 count=422`, `float32[422]`이다.

## Observed Issues
- 참고 C++ 구현은 TCP 연결이 끊기면 전체 추적기를 종료한다.
- C++의 face/pose 런타임 토글은 결과 전송만 끄며 landmarker 추론 자체는 계속 실행한다.
- 모델 파일은 참고 소스 폴더에 포함되어 있지 않다.

## Decision Notes
- Warudo 바이너리를 재사용하거나 수정하지 않고 공식 MediaPipe Web API로 독립 구현한다.
- 모델과 WASM은 패키지에 포함해 런타임 CDN 의존성을 제거한다.
- WebGL GPU delegate 초기화 실패 시 오류를 명확히 표시하고 자동으로 CPU인 척 동작하지 않는다.

## Implementation Notes
- MediaPipe Tasks Vision 0.10.35의 Face/Hand/Pose landmarker를 GPU delegate로 구성했다.
- 참고 C++와 동일한 422 float payload builder를 구현했다.
- Electron main process에 10ms 송신, 자동 재연결, 명령 수신 TCP client를 구현했다.
- renderer는 최소 권한 preload bridge만 사용하며 nodeIntegration을 비활성화했다.
- Windows x64 패키지 안에 모델과 WASM을 포함했다.

## Result
- `npx tsc --noEmit`: 통과
- `npm run lint`: 통과
- payload index mapping smoke: 12개 검사 통과
- TCP packet smoke: 1696 bytes, protocol 1001, count 422 통과
- TCP command smoke: 통과
- `npm audit --omit=dev`: production 취약점 0개
- Windows x64 package: 생성 및 프로세스 bootstrap 확인
- Linux GUI smoke는 호스트의 `libasound.so.2` 부재로 실행 전 중단되었으며 대상 플랫폼 검증과 무관하다.
- 실제 카메라/GPU 성능 및 Unreal 수신 결과는 대상 Windows 장비에서 수동 확인이 필요하다.

## History Index
- 아직 분리된 이력이 없다.
