# ELECTRON PLATFORM PROFILE (DESKTOP) V1

## 1) 문서 역할
- 이 문서는 Electron 데스크톱(Windows/macOS/Linux) UI/UX 및 shell 운영 규칙이다.
- 구조와 계층의 기본 규칙은 `ARCHITECTURE_RULES_PANEL_SECTION_ELECTRON_V1.md`, `ARCHITECTURE_RULES_PANEL_LAYER_ELECTRON_V1.md`를 따른다.
- 본 문서는 데스크톱 shell 운영과 frontend 품질 기준만 추가로 고정한다.

## 2) 기본 입장
- Electron 앱은 웹서비스가 아니라 로컬 도구형 워크벤치로 다룬다.
- 데스크톱 기본 레이아웃은 `split-pane` 또는 `multi-pane`다.
- 대상 플랫폼은 Windows 우선, 필요 시 macOS/Linux 확장이다.
- frontend는 작업 UI를 담당하고, desktop shell은 OS 연동과 보안 경계를 담당한다.

## 3) 크기 클래스
- `compact`: 0 ~ 1279px
- `expanded`: 1280 ~ 1439px
- `wide`: 1440px 이상
- 권장 최소 창 크기: 1180x720

## 4) 레이아웃 규칙
- `expanded` 이상에서는 `navigation + workspace` 분할을 기본으로 한다.
- 좌측 탐색, 중앙 작업, 우측 상태/속성의 책임을 분리한다.
- 패널 접기/펼치기 상태는 `BasePanel Controller`에서 관리한다.
- 리사이즈 시 즉시 재배치되어야 하며 고정 픽셀 폭 남용을 금지한다.
- `compact`에서는 일부 패널을 drawer 또는 overlay로 대체할 수 있다.

## 5) Shell / Bridge 규칙
- `src/main.ts`와 `src/app/desktop/`은 BrowserWindow, lifecycle, menu, dialog, shortcut, preload 연결만 담당한다.
- `src/preload.ts`는 최소 권한 bridge만 노출한다.
- frontend는 shell 세부사항을 직접 알지 않고 `application` 또는 `core`를 통해 동작하게 유지한다.
- 파일 시스템, 장기 작업, 외부 프로세스 접근은 shell/bridge 뒤에서만 허용한다.

## 6) 입력 / 상호작용 규칙
- 마우스, 키보드, 우클릭, 단축키를 1급 입력으로 다룬다.
- 핵심 액션은 키보드만으로도 수행 가능해야 한다.
- 장기 작업은 진행 상태와 취소 또는 재시도 경로를 제공한다.
- destructive action은 확인 단계를 둔다.

## 7) 스타일 / 정보 밀도 규칙
- 색상, 간격, 타이포, 반경, 그림자는 `src/design/GlobalDesign.global.tsx` 토큰만 사용한다.
- 높은 정보 밀도를 허용하되 가독성과 포커스 이동을 해치지 않는다.
- 데이터 테이블과 리스트는 정렬, 선택, 빈 상태를 명확히 보여준다.
- 다중 패널에서도 Primary/Secondary 시각 우선순위를 유지한다.

## 8) 성능 / 안정성 규칙
- 대량 목록과 트리는 지연 렌더링 또는 가상화를 우선 검토한다.
- 파일 I/O, 검색, 파싱, 외부 도구 실행 등은 `src/main.ts`, `src/preload.ts`, `src/app/desktop/`, `src/core/infra/`, `src/core/services/` 뒤로 분리해 UI를 장시간 점유하지 않게 처리한다.
- 장기 작업은 진행 상태와 취소 또는 재시도 경로를 제공한다.
- 실패 상태는 가능한 shell 전체가 아니라 패널 또는 작업 단위로 격리한다.

## 9) 접근성 / 보안 규칙
- 텍스트 대비와 폰트 가독성을 유지한다.
- 아이콘 단독 버튼에는 레이블 또는 툴팁을 제공한다.
- 키보드 포커스 순서는 읽기 흐름과 일치해야 한다.
- `contextIsolation`을 유지한다.
- `nodeIntegration`은 frontend에서 비활성 상태를 유지한다.
- frontend에서 Node API를 직접 호출하지 않는다.

## 10) 데스크톱 스모크 체크
- 앱이 정상 기동하고 메인 창이 열린다.
- 1280x720에서 핵심 흐름이 유지된다.
- 1440x900에서 split-pane 또는 multi-pane 배치가 안정적이다.
- 리사이즈, 단축키, 우클릭, 포커스 이동이 충돌 없이 동작한다.
- 파일 열기/저장, 장기 작업, 실패/재시도 흐름이 동작한다.

## 11) 완료 기준
- `npm run lint`
- `npx tsc --noEmit`
- `npm start`
- 데스크톱 스모크 체크 통과
