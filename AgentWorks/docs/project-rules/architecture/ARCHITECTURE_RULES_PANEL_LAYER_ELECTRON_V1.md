# ARCHITECTURE RULES (Panel Layer Runtime, Electron Desktop Profile) V1

## 1) 문서 역할
- 이 문서는 Electron + TypeScript 데스크톱 프로젝트에서 `LayeredPanel` runtime 규칙을 정의하는 문서다.
- 이 문서는 `ARCHITECTURE_RULES_PANEL_SECTION_ELECTRON_V1.md`의 `LayeredPanel` 개념을 실제 runtime 계약으로 확장한다.
- 이 문서는 `PanelLayerHost`, layered stack, open/close lifecycle, focus/dismiss 정책을 고정한다.

## 2) 적용 범위
- 대상은 modal, drawer, popup, confirm, side sheet처럼 `BasePanel` 위에 더 높은 레이어로 렌더링되는 `LayeredPanel`이다.
- tooltip, toast, hover hint, dropdown 같은 초경량 부유 UI는 반드시 이 시스템을 사용할 필요는 없다.
- `BasePanel` 자체 전환은 이 문서의 직접 대상이 아니다.
- 이 문서는 renderer window 내부 UI 레이어에 공통 적용한다.

## 3) 핵심 원칙
- `BasePanel`과 `LayeredPanel`은 공용 `Panel` 개념을 Electron에서 역할별로 나눈 플랫폼 프로파일 용어다.
- renderer 내부 화면 전환은 `BasePanel`만 관장한다.
- `LayeredPanel`은 BrowserWindow나 route를 직접 소유하지 않는다.
- 현재 활성 `BasePanel`이 자기 layered stack을 소유한다.
- `LayeredPanel`의 생성, 표시, 해제는 현재 `BasePanel`이 자기 layered stack 상태를 갱신하는 방식으로 처리한다.
- `LayeredPanel` 구현은 여러 `BasePanel`에서 재사용할 수 있다.
- `LayeredPanel` stack 내부에는 여러 패널이 쌓일 수 있다.
- z-order는 layered stack 내부 순서를 뜻하며, 서로 다른 BrowserWindow를 가로지르는 전역 z-order 체계로 두지 않는다.

## 4) 표준 디렉터리 구조
```text
src/
├─ app/
│  └─ frontend/
│     └─ panel_layer/
│        └─ PanelLayerHost.tsx
└─ panels/
   ├─ base/
   │  └─ <BasePanelName>/
   │     ├─ <BasePanelName>.tsx
   │     └─ controller/
   │        ├─ <BasePanelName>Controller.ts
   │        ├─ <BasePanelName>State.ts
   │        └─ <BasePanelName>Types.ts
   └─ layered/
      └─ <LayeredPanelName>/
         ├─ <LayeredPanelName>.tsx
         ├─ controller/
         └─ sections/
```

## 5) 소유 규칙
- layered stack 상태는 현재 활성 `BasePanel Controller`가 소유한다.
- `PanelLayerHost`는 현재 `BasePanel`이 가진 layered stack를 읽어 렌더링한다.
- `main`, `preload`, desktop shell helper는 layered stack 상태를 직접 소유하지 않는다.
- default 구조에서는 전역 Layer Manager를 두지 않는다.

## 6) PanelLayerHost 규칙
- 경로: `src/app/frontend/panel_layer/PanelLayerHost.tsx`
- 역할:
- 현재 `BasePanel`의 layered stack 렌더링
- backdrop 렌더링
- top `LayeredPanel` 기준 z-order 표현
- enter/exit animation 연결
- completion 연결
- anchor 기반 위치 보정

- 금지:
- BrowserWindow 제어
- IPC 의미 해석
- Panel 비즈니스 로직 소유
- Section 이벤트 의미 해석
- layered stack 원본 상태 소유

- host는 현재 renderer window 안에서만 layered panel을 렌더링한다.
- OS 레벨 window, native tooltip, 다른 BrowserWindow를 띄우는 동작을 `LayeredPanel` 기본 패턴으로 취급하지 않는다.

## 7) Layered Stack 원본 데이터
- 현재 `BasePanel Controller`는 최소한 아래 성격의 원본 상태를 가질 수 있다.
- `panelId`
- `stack order`
- `phase`
- `payload` optional
- `dismiss policy` optional
- `animation policy` optional
- `anchor metadata` optional

- layered stack 내부에서는 가장 마지막 entry를 top panel로 본다.
- dismiss, ESC, backdrop 입력은 기본적으로 top panel 기준으로 처리한다.
- 별도 `PanelLayerState.ts`, `PanelLayerTypes.ts`, `PanelLayerRegistry.ts` 파일은 필수가 아니다.
- 기본 문서에서는 현재 `BasePanel Controller` 내부 구조체로 시작해도 된다.

### 7-1) Layered Stack 예시 스니펫
```ts
export type LayeredPanelPhase =
  | "entering"
  | "visible"
  | "closing";

export type LayeredCloseReason =
  | "confirm"
  | "cancel"
  | "backdrop"
  | "escape"
  | "external"
  | "replace";

export interface LayeredPanelEntry<TPayload = unknown, TResult = unknown>
{
  PanelId: string;
  Phase: LayeredPanelPhase;
  Payload?: TPayload;
  Dismissible?: boolean;
  AnchorMetadata?: unknown;
  OnComplete?: (Result: TResult) => void;
  OnRequestClose?: (Reason: LayeredCloseReason) => void;
}
```

## 8) Layered Stack 로컬 조작 규칙
### 8-1) `OpenLayeredPanel`
- 현재 `BasePanel`은 자기 layered stack에 특정 `LayeredPanel` entry를 추가할 수 있다.
- 동일 `PanelId` 중복 추가는 기본적으로 금지한다.
- 필요 시 새 entry는 `entering` phase로 시작할 수 있다.
- enter animation이 없으면 즉시 `visible` 상태로 간주할 수 있다.

### 8-2) `CloseLayeredPanel`
- 현재 `BasePanel`은 자기 layered stack의 특정 `LayeredPanel` entry를 닫는 상태로 전환할 수 있다.
- exit animation이 있는 panel은 `closing` phase를 거칠 수 있다.
- exit animation이 없으면 즉시 제거할 수 있다.

### 8-3) `CloseTopLayeredPanel`
- 현재 `BasePanel`은 자기 layered stack 최상단 panel 하나를 닫을 수 있다.

### 8-4) `ClearLayeredPanels`
- 현재 `BasePanel`은 자기 layered stack 전체를 정리할 수 있다.

## 9) Phase 규칙
- 권장 phase는 아래와 같다.
- `entering`
- `visible`
- `closing`

- 전환 애니메이션이 없으면 `entering`, `closing`은 생략될 수 있다.
- 기본 흐름은 아래와 같다.

```text
OpenLayeredPanel
-> entering
-> visible

CloseLayeredPanel
-> closing
-> removed
```

## 10) Animation 책임 분리
- `PanelLayerHost`는 `LayeredPanel`의 공통 enter/exit animation을 연결한다.
- 각 `LayeredPanel`은 자기 내부 콘텐츠 애니메이션을 추가로 가질 수 있다.
- open/close animation preset이 panel마다 다를 수 있다.
- panel은 필요 시 자기 open/close lifecycle에 반응해 내부 초기화 또는 정리를 수행할 수 있다.
- enter animation이 없는 panel은 즉시 `visible`로 간주할 수 있다.
- exit animation이 없는 panel은 즉시 제거 경로를 사용할 수 있다.
- BrowserWindow close는 `LayeredPanel` exit animation completion 대체 수단이 아니다.

## 11) Open / Close Completion 규칙
### 11-1) Open Completion
- enter animation이 있는 `LayeredPanel`은 생성 직후 즉시 `visible` 고정이 아닐 수 있다.
- `PanelLayerHost` 또는 panel은 enter animation 완료 후 visible 확정을 반영할 수 있다.
- enter animation이 없으면 생성 직후 `visible`로 간주할 수 있다.

### 11-2) Close Completion
- exit animation이 있는 `LayeredPanel`은 `CloseLayeredPanel` 직후 즉시 제거되지 않을 수 있다.
- `PanelLayerHost` 또는 panel은 exit animation 완료 시 completion을 통지한다.
- 그 후 현재 `BasePanel Controller`가 layered stack에서 최종 제거를 확정한다.

## 12) Focus / Keyboard 정책
- 최상단 `LayeredPanel`이 키보드 입력 우선권을 가진다.
- `Escape`는 기본적으로 최상단 dismissible `LayeredPanel`만 대상으로 처리한다.
- modal 계열 `LayeredPanel`은 필요 시 배경 포커스를 차단한다.
- panel이 닫히면 포커스는 가능하면 이전 trigger 또는 합리적인 다음 대상에 복귀한다.
- Electron renderer도 DOM 기반이므로 focus trap, restore, keyboard priority는 웹 기준 DOM 포커스 정책으로 다룬다.

## 13) Backdrop / Dismiss 정책
- `LayeredPanel`은 dismiss 가능 여부를 가질 수 있다.
- dismiss trigger는 최소 `backdrop click`, `Escape`, `explicit close action`을 포함할 수 있다.
- top panel만 dismiss 대상이 된다.
- dismiss 불가 panel은 backdrop/ESC에 반응하지 않는다.

## 14) Anchor Popup 대응 기준
- anchor 기반 popup panel은 open 시점에 `anchor metadata`를 받을 수 있다.
- Electron 기준 anchor metadata는 `anchorRect` 같은 renderer viewport 좌표 정보로 해석하는 편을 권장한다.
- 실제 위치 계산, clipping 보정, viewport 내 재배치는 `PanelLayerHost`가 담당한다.
- anchor가 무효가 되면 popup panel은 닫거나 fallback 위치 정책을 따른다.
- OS native menu, native tray popup 같은 시스템 UI는 이 기준의 직접 대상이 아니다.

## 15) 재사용 규칙
- 하나의 `LayeredPanel` 구현은 여러 `BasePanel`이 공통으로 사용할 수 있다.
- 부모 `BasePanel`은 payload, close reason 해석, 후속 동작을 소유한다.
- `LayeredPanel`은 상위 `BasePanel`이 제공한 공개 함수 계약을 호출하거나, 상위가 구독하는 결과 이벤트를 내보낼 수 있다.
- `LayeredPanel` 내부에서 특정 `BasePanel`을 import하거나 내부 상태를 직접 조작하지 않는다.
- 특정 `BasePanel` 문맥이 필요하면 props, payload, callback, 결과 이벤트 계약으로 주입한다.
- 특정 `BasePanel`과 짝지어진 전용 `LayeredPanel`은 공개 함수 직접 호출을 기본으로 한다.
- 여러 `BasePanel`에서 재사용하는 공용 `LayeredPanel`도 가능하면 표준 `payload/result` 계약으로 유지한다.

## 16) 통신 기본 패턴
- 기본 통신 패턴은 아래 3개로 충분해야 한다.
- `payload`
- `onComplete(result)`
- `onRequestClose(reason)`

- `payload`는 `BasePanel`이 `LayeredPanel`을 열 때 주입하는 입력 문맥이다.
- `onComplete(result)`는 `LayeredPanel`이 의미 있는 결과를 현재 stack owner인 `BasePanel`로 반환하는 기본 경로다.
- `onRequestClose(reason)`는 `LayeredPanel`이 닫힘 의도와 닫힘 사유를 `BasePanel`로 전달하는 기본 경로다.
- 연속적인 상태 보고나 다단계 상호작용이 필요한 경우에만 추가 결과 이벤트를 사용할 수 있다.
- 이벤트 버스는 `LayeredPanel -> BasePanel` 기본 패턴으로 두지 않는다.
- `LayeredPanel Controller`는 상위 `BasePanel Controller`를 직접 참조하지 않고, stack entry에 주입된 공개 함수 계약만 호출한다.

## 17) CloseReason 기본값
- 기본 `CloseReason`은 아래 값을 권장한다.
- `confirm`
- `cancel`
- `backdrop`
- `escape`
- `external`
- `replace`

- 각 `LayeredPanel`은 필요 시 자기 문맥에 맞는 추가 reason을 확장할 수 있다.
- 비즈니스 결과는 가능하면 `result`로 반환하고, 닫힘 원인은 `CloseReason`으로 분리한다.

## 18) 다중 stack 정책
- `LayeredPanel` stack 내부에는 여러 패널이 쌓일 수 있다.
- 기술적으로는 다중 계층을 허용한다.
- 다만 일반 UX에서는 1~2단 중첩을 권장한다.
- 3단 이상은 명확한 사유가 있을 때만 사용한다.
- 최상단 `LayeredPanel`이 닫히면, 그 아래 stack는 그대로 유지된다.
- 중첩 layered 구조에서도 각 `LayeredPanel` 결과는 현재 stack owner인 `BasePanel`로 직접 반환할 수 있다.
- 따라서 중간 layered panel이 결과를 반드시 중계해야 하는 구조를 기본으로 두지 않는다.

## 19) 전환 규칙
- `LayeredPanel`의 기본 동작은 layered stack에 추가되거나 제거되는 것이다.
- overlay 내부 전환은 BrowserWindow 전환이 아니다.
- 다른 `LayeredPanel`로 이어지는 경우에만 chained transition을 사용할 수 있다.
- exit animation이 있는 경우 `CloseLayeredPanel(A)` 완료 후 `OpenLayeredPanel(B)` 순서로 이어질 수 있다.
- 단순 close는 다음 panel open 없이 끝날 수 있다.
- 전환 판단은 항상 현재 `BasePanel Controller`가 담당한다.

## 20) BasePanel 전환과의 관계
- `BasePanel` 전환은 `AppNavigator`가 담당한다.
- 현재 `BasePanel`의 close animation이나 layered stack 정리가 필요한 경우, completion 이후 `AppNavigator`를 호출한다.
- `BasePanel`이 교체되면 기존 `BasePanel`의 layered stack도 함께 정리된다.
- layered stack는 다음 `BasePanel`로 carry-over 하지 않는다.
- 같은 renderer window 안에서 overlay를 많이 사용하더라도 app-level `BasePanel` 교체 규칙 자체는 바뀌지 않는다.
- BrowserWindow 자체 교체는 layered 전환이 아니라 desktop shell의 다른 책임으로 본다.

## 21) 초경량 부유 UI 예외
- tooltip, dropdown, hover hint, 간단한 context menu 같은 초경량 UI는 반드시 `LayeredPanel`로 승격하지 않아도 된다.
- 이러한 UI는 `BasePanel` 또는 Section 내부 조각으로 처리할 수 있다.
- 다만 backdrop, focus trap, completion, 재사용성, 독립 payload가 커지는 순간 `LayeredPanel`로 승격한다.

## 22) 생성 시 금지 패턴
- 전역 자유 overlay stack을 기본 패턴처럼 사용하는 구조
- `PanelLayerHost` 없이 `BasePanel` JSX에 `LayeredPanel`을 무질서한 조건문으로 흩뿌리는 구조
- 동일 `PanelId`를 중복 open하는 구조
- `CloseLayeredPanel` 즉시 제거만 지원해서 exit animation이 깨지는 구조
- Section이 `LayeredPanel` open/close를 직접 결정하는 구조
- `LayeredPanel`이 BrowserWindow나 native dialog를 직접 대표하려는 구조
- `LayeredPanel`이 특정 `BasePanel`을 직접 import해 강결합되는 구조
- `BasePanel` 전환 시 기존 layered stack가 계속 살아남는 구조
