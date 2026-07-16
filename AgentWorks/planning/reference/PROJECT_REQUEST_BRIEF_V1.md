# PROJECT REQUEST BRIEF V1

## 1) 문서 역할
- 이 문서는 planning 시작 전에 먼저 작성하는 최초 입력 문서다.
- 목적은 기능 목록보다 먼저 `화면 구성`, `panel 경계`, `section 경계`를 확인하는 것이다.
- 이 문서는 최종 기획서가 아니다.
- 이 문서를 바탕으로 `PANELS/<panel_name>/` 초안 폴더와 panel별 html 프롬프트를 만든다.

## 2) 핵심 원칙
- 이 문서는 기능 목록부터 세세하게 적는 문서가 아니다.
- 먼저 사용자가 보게 될 화면 구조를 적는다.
- 먼저 `어떤 panel이 필요한가`, `각 panel 안에 어떤 section이 필요한가`를 적는다.
- 클릭 결과가 `panel 전환`, `layered panel open`, `section 내부 변화` 중 무엇인지 먼저 적는다.
- html 시안이 먼저 필요한 panel 또는 section을 명시한다.
- 최종적으로는 각 panel별 작업 폴더와 html 생성 프롬프트까지 산출하는 것을 전제로 한다.

## 3) 기본 정보
- Project Name:
- 한 줄 설명:
- 이번에 만들고 싶은 것의 핵심 목적:
- 참고 중인 서비스 / 앱 / 사이트:

## 4) 사용자와 첫 화면
- 주요 사용자:
- 이 사용자가 가장 먼저 해야 하는 일:
- 첫 진입 시 가장 먼저 보여야 하는 화면:
- 첫 화면에서 가장 먼저 강조해야 하는 정보:
- 첫 화면에서 가장 먼저 눌러야 하는 버튼 또는 영역:

## 5) top-level 화면 구성
- 이 프로젝트의 top-level 화면 수:
- route 또는 top-level surface 후보:
- 가장 먼저 구현해야 하는 대표 `BasePanel`:
- 각 `BasePanel` 이름 초안:
- panel 간 전환이 필요한가:
- 필요하다면 어떤 panel에서 어떤 panel로 이동하는가:

## 6) panel별 section 초안
- 대표 `BasePanel` 이름:
- 그 panel 안의 핵심 section 목록:
- section 순서:
- 각 section의 역할 한 줄 설명:
- section 중 별도 html 시안이 먼저 필요한 것:

## 7) layered panel 초안
- modal / dialog / drawer / popup / side sheet가 필요한가:
- 필요하다면 어떤 panel 위에서 열리는가:
- 어떤 클릭 또는 이벤트로 열리는가:
- 닫힘 방식은 무엇인가:
- 재사용 가능한 공용 layered panel 후보가 있는가:

## 8) 주요 상호작용
- 사용자가 가장 자주 누를 section / CTA:
- 클릭 후 결과:
  - section 내부 변화
  - layered panel open
  - 다른 panel로 전환
  - 외부 작업 실행
- 입력이 많은 section이 있는가:
- 상태 변화가 많은 panel 또는 section이 있는가:

## 9) 화면 구조 메모
- 먼저 그려보고 싶은 panel ASCII:
- 먼저 html로 확인하고 싶은 panel:
- 먼저 html로 확인하고 싶은 section:
- 먼저 프롬프트를 뽑아야 하는 panel:
- anchor popup, overlay stack, split layout 등 특별히 조심할 구조:

## 10) 플랫폼 힌트
- 1차 대상 플랫폼:
  - Node / Next.js
  - Flutter Mobile
  - Flutter Desktop
  - WXT
  - Electron
  - 아직 미정
- 입력 방식:
  - 마우스 중심
  - 터치 중심
  - 키보드 / 단축키 중요
- 플랫폼 특성상 먼저 고려해야 하는 점:

## 11) 이번 범위
- 이번 planning에서 먼저 닫고 싶은 panel:
- 이번 planning에서 먼저 폴더를 잡아야 하는 panel:
- 이번 planning에서 제외할 panel:
- 이번 planning에서 반드시 닫아야 하는 section:
- 이번 planning에서는 아직 미뤄도 되는 section:

## 12) 산출물 기대
- 이번에 원하는 산출물:
  - brief 정리
  - panel 구조 정리
  - section 구조 정리
  - panel 생성용 html 프롬프트
  - panel / section html 시안 방향
  - 전부
- Codex가 먼저 정리해줬으면 하는 것:
- 디자인 모델이 먼저 시도해줬으면 하는 것:

## 13) 기타 메모
- 아직 불명확한 점:
- 꼭 강조하고 싶은 점:
- 구조상 가장 걱정되는 부분:

## 14) 작성 기준
- 기능 이름만 길게 나열하지 않는다.
- 화면에 실제로 어떻게 보일지를 먼저 적는다.
- panel 이름과 section 이름을 가능하면 직접 붙인다.
- layered panel이 필요하면 열림 조건과 닫힘 조건을 함께 적는다.
- 막연한 공용화보다 실제 첫 화면 구조를 먼저 닫는다.
- Brief 결과는 이후 `PANELS/<panel_name>/` 작업 폴더를 만드는 기준이 되어야 한다.
