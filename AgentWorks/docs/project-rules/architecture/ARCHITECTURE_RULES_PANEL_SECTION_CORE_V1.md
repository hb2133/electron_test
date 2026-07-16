# ARCHITECTURE RULES (Panel-Section-Controller Core) V1

## 1) 문서 역할
- 이 문서는 Panel-Section-Controller 기반 프로젝트 구조의 공통 아키텍처 규칙이다.
- 목적은 기획, 디자인, 구현, QA, 리뷰가 같은 화면 좌표계를 기준으로 움직이게 만드는 것이다.
- 이 문서는 플랫폼별 실제 경로를 고정하는 문서가 아니다.
- 실제 디렉터리 배치와 파일 경로는 각 플랫폼 프로파일 문서에서 확정한다.

## 2) 적용 범위
- 이 문서는 웹, 데스크톱 앱, 모바일 앱, 내부 툴, 워크스페이스형 제품에 공통 적용한다.
- 화면이 여러 route, panel, tab, 상위 z-order panel로 조합되는 제품에 특히 적합하다.
- 이 문서는 특정 프레임워크 전용 문서가 아니다.

## 3) 우선순위
- 1순위: 본 공통 아키텍처 문서
- 2순위: 플랫폼별 프로파일 문서
- 3순위: 프로젝트별 구조 문서 및 개별 작업 요구사항
- 플랫폼 문서는 본 문서의 개념을 실제 프로젝트 경로로 매핑하는 문서이며, 본 문서의 핵심 개념을 변경할 수 없다.

## 4) 공통 코딩 컨벤션
- 중괄호는 `Allman brace style`을 사용한다.
- 즉 `{` 는 선언문 또는 조건문의 다음 줄에 둔다.
- 식별자 이름은 기본적으로 `PascalCase`를 사용한다.
- boolean 조건은 축약형 부정보다 명시형 비교를 우선한다.
- 예: `if(IsReady == false)`
- 파일명, 경로명, 폴더명은 프로젝트와 플랫폼 규칙을 따르되 같은 프로젝트 내부에서는 일관되게 유지한다.

## 5) 핵심 원칙
- 최상위 시각 단위는 `Panel`이다.
- Panel 내부 시각 분해 단위는 `Section`이다.
- 상태 전이와 이벤트 지휘의 중심은 `Panel Controller`다.
- `Section`은 기본적으로 시각 조각이며 독립 로직 단위가 아니다.
- `Panel`은 완결형 화면 단위이고, `Section`은 그 내부를 나누는 표현 단위다.
- 반복이 검증되지 않은 뷰는 성급히 공용화하지 않는다.
- 공용화는 view보다 logic, state orchestration, data handling 쪽에서 먼저 검토한다.
- 외부 API, DB, 파일시스템, 저장소, 네트워크 접근은 시각 계층 밖에서 수행한다.
- 전역 디자인 SSOT는 플랫폼 문서가 지정하는 글로벌 디자인 파일 1개를 기준으로 한다.

## 6) 공통 개념 구조도
```text
Project
├─ core
├─ design
├─ managers
├─ panels
│  └─ <Panel>
│     ├─ controller
│     │  ├─ <Panel>Controller
│     │  ├─ <Panel>State
│     │  └─ <Panel>Actions
│     └─ sections
```

- 위 구조도는 개념 구조도다.
- 실제 경로명과 파일명은 플랫폼 프로파일 문서에서 정한다.
- 본 문서의 목적은 `무엇이 어떤 책임을 가지는가`를 고정하는 것이다.

## 7) 용어 정의
### 7-1) Panel
- 사용자가 하나의 독립된 화면 또는 독립된 화면 셸로 인식하는 최상위 시각 단위다.
- page, route, screen, top-level workspace, top-level editor surface 같은 단위가 Panel이 될 수 있다.
- 화면이 완전히 전환되거나, 독립 진입점으로 다뤄져야 할 때 새로운 Panel을 만든다.

### 7-2) Section
- Panel 내부의 시각 조각 단위다.
- header, sidebar, tab selector, list area, detail area, footer action area, preview area 같은 조각이 Section이 될 수 있다.
- Section은 재사용성보다 해당 Panel 안에서의 명확한 시각 책임을 우선한다.

### 7-3) Fragment
- 하나의 Section 안에서 상태에 따라 조건부로 배치되거나 교체되는 더 작은 시각 조각이다.
- Fragment는 독립 최상위 단위가 아니라 Section 구성 요소다.

### 7-4) Controller
- 하나의 Panel과 1:1로 대응하는 유일한 상태 전이 및 이벤트 지휘자다.
- Panel 내부의 상호작용 흐름, Section 간 연결, Manager 호출, 다른 Panel 표시 흐름을 조정한다.
- 기본 원칙은 `Panel당 Controller 1개`다.

### 7-5) Action
- Action은 사용자 액션별 처리 흐름을 담는 Panel 내부 실행 단위다.
- click, select, close, submit, save 같은 사용자 이벤트에서 시작되는 처리 흐름을 Action으로 분리할 수 있다.
- Action은 필요 시 Manager 또는 프로젝트의 비시각 연동 계층을 호출할 수 있다.
- Action은 View와 직접 연결되지 않으며, Controller를 통해서만 호출된다.

### 7-6) Manager
- 여러 Panel에서 반복이 검증된 비시각 로직과 공용 상태를 관리하는 상위 계층이다.
- 인증, 세션, 워크스페이스 상태, 공통 데이터 orchestration, 공통 정책이 여기에 속할 수 있다.

### 7-7) Panel Layering
- 어떤 Panel이든 필요에 따라 다른 Panel 위에 더 높은 z-order로 렌더링될 수 있다.
- modal, drawer, popup, confirm, side sheet처럼 보이는 UI도 아키텍처 기준에서는 모두 Panel이다.

## 8) Panel 규칙
- 모든 사용자 화면은 `Panel` 단위로 조직한다.
- 모든 Panel은 최소한 `Panel Root`, `Controller`, `sections` 골격을 가진다.
- `Panel`은 화면 전체 조립 지점이다.
- `Panel`은 최종적으로 사용자에게 보이는 Section 조합을 결정한다.
- 새 route 또는 새 screen이 필요한 독립 진입점은 별도 Panel로 분리한다.
- 단일 화면이라도 내부 시각 구조가 있다면 Section으로 분해한다.
- Panel 없는 시각 구현을 직접 흩뿌리는 패턴을 금지한다.
- 어떤 Panel이든 필요에 따라 다른 Panel 위에 겹쳐서 배치될 수 있다.

## 9) Section 규칙
- 모든 Section은 Panel 내부에 속한다.
- Section은 기본적으로 시각 표현과 바인딩을 담당한다.
- Section은 Panel Controller가 내려주는 상태와 이벤트 연결 결과를 받아 렌더링한다.
- Section은 사용자 이벤트를 감지할 수 있지만, 이벤트의 의미 판단과 상태 전이는 Controller가 담당한다.
- Section의 `onClick`, `onChange`, `onSelect`, `onClose` 같은 이벤트는 Controller가 정의한 처리 흐름에 연결한다.
- Section은 독립적인 전역 정책, 외부 연동, 공용 비즈니스 규칙을 소유하지 않는다.
- Section 내부에서 직접 상태 전이, 외부 호출, 다른 Panel 표시 판단을 수행하지 않는다.
- Section은 해당 Panel 전용 구현을 기본값으로 한다.
- 다른 Panel에서도 반복 사용이 검증되기 전까지 Section을 공용 뷰로 승격하지 않는다.
- Section 이름은 화면 책임이 드러나게 작성한다.
- 예: `HeaderSection`, `SidebarSection`, `InspectorSection`, `FooterActionSection`

## 10) Fragment 규칙
- Fragment는 Section 내부에서만 사용되는 하위 시각 조각이다.
- 상태 전환에 따라 보이거나 사라지는 조각, 탭별 조각, 조건부 경고 영역, 부분 요약 뷰가 Fragment가 될 수 있다.
- Fragment는 Panel 기준 맥락을 잃지 않도록 관련 Section 주변에 둔다.
- Fragment를 별도 공용 시스템처럼 다루지 않는다.

## 11) Controller 규칙
- Panel당 메인 Controller는 하나만 둔다.
- Controller는 Panel 상태 전이, Section 배치 판단, 사용자 이벤트 처리, Manager 호출, 다른 Panel 표시 요청을 담당한다.
- Controller는 화면 단위 흐름의 유일한 지휘자다.
- Controller는 Section 이벤트에 연결될 처리 흐름을 소유하고, 사용자 액션의 의미를 해석한다.
- View가 직접 연결하는 대상은 Controller다.
- Controller는 사용자 액션별 처리 함수를 소유하며, 필요 시 해당 처리 흐름을 Action으로 위임한다.
- Action 실행 결과를 받아 상태 전이와 최종 반영을 결정하는 주체는 Controller다.
- Section마다 별도 Controller를 기본 생성하지 않는다.
- Controller가 커질 경우, Panel 내부에서 책임 이름 기준의 보조 파일 또는 하위 디렉터리로 분리할 수 있다.
- 이 보조 구조는 프로젝트와 Panel 복잡도에 따라 자율 확장한다.
- 다만 분리 후에도 최종 상태 전이와 이벤트 진입의 소유권은 메인 Controller에 남는다.

## 11-1) Action 규칙
- Action은 View에서 직접 호출하지 않는다.
- Action은 Controller가 호출하는 Panel 내부 실행 단위로 사용한다.
- Action은 사용자 액션 처리, validation 흐름, Manager 호출, 비시각 처리 순서를 담당할 수 있다.
- Action은 필요 시 결과값 또는 상태 반영에 필요한 정보를 Controller에 반환한다.
- Action이 View를 직접 갱신하지 않는다.
- View 갱신은 Controller의 상태 반영을 통해서만 일어난다.

## 11-2) 기본 이벤트 흐름
```text
User Action
-> Section event
-> Controller
-> Action
-> Manager or non-visual integration
-> Controller state update
-> Section re-render
```

## 12) Tab 규칙
- Tab은 새로운 Panel이 아니라 기본적으로 Panel 내부 상태 전환이다.
- 탭 전환 상태는 Panel Controller가 가진다.
- 탭 구조는 일반적으로 아래 3개 묶음으로 해석한다.

```text
<tab group>/
├─ TabSelectorSection/
├─ TabViewportSection/
└─ tab_fragments/
   ├─ <TabA>Section
   ├─ <TabB>Section
   └─ ...
```

- `TabSelectorSection`은 탭 버튼과 선택 UI를 담당한다.
- `TabViewportSection`은 현재 활성 탭의 내용을 배치하는 표시 영역이다.
- `tab_fragments/`는 탭 상태에 따라 `TabViewportSection` 안에 배치되는 Section 조각 묶음이다.
- 탭 관련 구조는 필요한 경우 그룹 폴더로 묶어 locality를 유지한다.
- 탭 안에 탭이 있을 수 있으며, 이 경우 같은 패턴을 중첩 적용할 수 있다.
- 중첩 탭이 있더라도 상위 Panel Controller가 최종 오케스트레이션 책임을 가진다.

## 13) Panel Z-Order 규칙
- 어떤 Panel이든 필요에 따라 다른 Panel 위에 더 높은 z-order로 렌더링될 수 있다.
- 화면 위에 덧씌워 보이는 UI라도 Panel 규칙을 그대로 따른다.
- 구체적인 조립과 표시 방식은 플랫폼 문서에서 정한다.
- 일반적인 웹/모바일 앱에서는 동시에 활성화되는 Panel 중첩을 최소화하는 편을 권장한다.
- 많은 경우 메인 Panel 위에 보조 Panel 1개 정도로도 충분하다.
- 더 복잡한 중첩이 필요할 경우에는 플랫폼 문서와 프로젝트 문서에서 별도 기준을 정한다.

## 14) Manager 규칙
- Manager는 처음부터 과잉 설계로 만들지 않는다.
- 특정 Panel 내부에서 시작한 로직이 여러 Panel에서 반복 검증될 때만 승격한다.
- 승격 대상은 비시각 로직, 공용 상태, 외부 연동 orchestration, 정책, validation 흐름이다.
- 공용 뷰보다 공용 로직을 먼저 승격한다.
- Manager는 전역 쓰레기통이 되어서는 안 된다.
- 아래 조건 중 여러 개를 만족할 때 승격을 검토한다.
- 2개 이상의 Panel에서 반복 사용된다.
- 시각 구조와 무관하다.
- 외부 상태 또는 외부 연동을 포함한다.
- 독립 테스트 가치가 있다.

## 15) core / design / panels 경계
### 15-1) `core`
- 전역 설정, 외부 연동 구현, 공용 유틸리티, 공용 서비스 기반 계층을 둔다.
- 특정 Panel 전용 시각 로직을 `core`에 넣지 않는다.

### 15-2) `design`
- 전역 색상, 간격, 반경, 타이포, 그림자, 모션, 공통 스타일 기준의 SSOT를 둔다.
- 실제 Panel 조립 코드와 Panel 전용 시각 조합은 `design`에 두지 않는다.
- Panel 전용 시각 구현은 각 Panel 내부 Section에 둔다.

### 15-3) `panels`
- 사용자와 만나는 화면 구현의 주 경계다.
- 실질적인 Panel 구현은 여기에서 이루어진다.

## 16) 기획 및 디자인 운영 기준
- 기획의 시작점은 `어떤 Panel이 필요한가`를 정의하는 것이다.
- 화면을 설계할 때는 먼저 Panel을 확정하고, 그 다음 Section으로 분해한다.
- 디자인 시안은 Panel 단위로 만들고, Section 단위로 잘라 구현에 연결한다.
- 공용 시안을 먼저 만들고 억지로 끼워 맞추기보다, Panel 전용 시안을 우선 수용한다.
- 기획, 디자인, 구현 문서에서 같은 화면을 같은 Panel 이름으로 부른다.
- 탭, 모달, 사이드 패널, sticky action area 같은 시각 위치도 Panel 기준 좌표로 설명한다.

## 17) 기본 작업 순서
1. Panel을 정의한다.
2. Panel 내부 Section을 분해한다.
3. 필요한 Fragment를 식별한다.
4. 상태 전이와 표시 조건을 정리한다.
5. Controller를 작성해 Section 연결과 이벤트 흐름을 고정한다.
6. 필요 시 Manager 또는 프로젝트의 비시각 연동 계층과 연결한다.
7. 필요 시 추가 Panel 흐름을 연결한다.
8. Panel 단위로 QA와 리뷰를 수행한다.

## 18) QA 및 리뷰 기준
- 리뷰와 QA의 기본 단위는 Panel이다.
- 검수 기준은 `폴더가 맞는가`보다 `화면이 의도한 상태 전이를 정확히 표현하는가`에 둔다.
- 탭 전환, 추가 Panel open/close, section 조건부 노출, disabled 상태, 예외 상태를 Panel 기준으로 점검한다.
- 사용자가 실제로 보는 화면 변화와 Controller 상태 전이가 서로 일치해야 한다.
- 디버깅도 Panel 기준 진입점을 우선 찾는다.

## 19) 금지 규칙
- Section마다 별도 Controller를 기본 생성하는 패턴
- 시각 조각을 너무 이르게 공용화하는 패턴
- 외부 API 또는 저장소 접근을 Section 내부에 두는 패턴
- 화면 구조와 무관한 전역 로직을 Panel 내부 시각 코드에 섞는 패턴
- 독립 진입점이 필요한 화면을 임시 상위 Panel 상태로만 방치하는 패턴
- 반대로 Panel 내부 상태 전환으로 충분한 것을 성급히 새 Panel로 승격하는 패턴

## 20) 플랫폼 문서와의 관계
- 플랫폼 문서는 본 문서의 `Panel`, `Section`, `Controller`, `Manager`, `Panel Layering` 개념을 실제 경로와 파일 규칙으로 매핑한다.
- 플랫폼 문서는 본 문서의 개념을 다시 정의하지 않는다.
- 플랫폼 문서는 Panel을 실제로 어디서 조립하고, 어떤 방식으로 더 높은 z-order로 렌더링하는지 설명한다.
- 프로젝트 문서는 플랫폼 문서를 바탕으로 실제 프로젝트 구조를 최종 확정한다.
