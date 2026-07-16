# MediaPipe GPU Unreal Tracker

## Summary
- Electron renderer에서 MediaPipe Tasks Vision을 GPU delegate로 실행하고, 기존 C++ 추적기의 Unreal TCP 패킷 계약을 유지하는 Windows 우선 데스크톱 앱을 구현한다.

## Background
- Warudo의 `warudo-mediapipe-electron.exe`는 Electron 19 기반 배포물이다.
- 참고 구현은 `E:/VTuber/holistic_tracking_Source_gpu_v2/main.cpp`이며 얼굴 blendshape, 얼굴 변환 행렬, 양손 normalized/world landmark, pose landmark를 전송한다.

## Scope
- 카메라 선택 및 미리보기
- 얼굴/손/포즈 MediaPipe GPU 추적
- 422 float Unreal payload 생성 및 `127.0.0.1:33685` TCP 전송
- Unreal 명령 수신과 UI 상태 동기화
- Electron 보안 경계와 추적 상태 UI

## References
- `/mnt/e/VTuber/holistic_tracking_Source_gpu_v2/main.cpp`
- `AgentWorks/docs/project-rules/architecture/`
- `AgentWorks/docs/project-rules/platform/ELECTRON_PLATFORM_PROFILE_DESKTOP_V1.md`

## Current Status
- Electron GPU 추적기와 Windows x64 패키지 구현 완료. 실제 카메라별 성능 확인은 대상 Windows 장비에서 추가 확인한다.
