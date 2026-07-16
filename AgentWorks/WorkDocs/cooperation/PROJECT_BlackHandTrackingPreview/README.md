# Black Hand Tracking Preview

## Summary
- Electron tracker의 기본 preview를 검은 배경과 손 랜드마크 표시로 변경한다.

## Background
- 회의 화면 공유 시 카메라 원본을 노출하지 않고 hand tracking 결과만 보여줄 필요가 있다.
- C++ tracker는 변경하지 않고 Electron 구현만 대상으로 한다.

## Scope
- 기본 `VideoVisible`을 끄고 preview 배경을 순수 검은색으로 표시한다.
- 기존 VTuberController `setVideoVisible` 명령 호환은 유지한다.

## References
- `src/panels/base/TrackingPanel/controller/TrackingPanelState.ts`
- `src/core/services/MediaPipeTrackingService.ts`

## Current Status
- 구현, 정적 검사, Windows package 생성 및 배포 완료.
