# 04. Moonwave Standard UI/UX Guide

> **Moonwave Screen Definitions**
> 모든 Moonwave 웹 서비스에 적용되는 공통 UI 패턴 및 화면 정의서입니다.

---

## 1. UI 구조 표준 (Standard Layout)

### 1.1 Global Layout
앱은 크게 세 가지 영역으로 구성됩니다.

```
┌──────────────────────────────────────────────┐
│  HEADER (Sticky)                             │
│  [Logo] [Page Title]         [Theme] [Menu]  │
├──────────────────────────────────────────────┤
│  MAIN CONTENT (Scrollable)                   │
│                                              │
│  [Filter/Search Bar]                         │
│                                              │
│  [Item Grid / List Cards]                    │
│                                              │
├──────────────────────────────────────────────┤
│  FOOTER (Optional)                           │
│  [Copyright] [version]                       │
└──────────────────────────────────────────────┘
```

### 1.2 반응형 동작 (Responsive Behavior)
- **Mobile (< 768px)**: 1 Column Card View. 필터 바는 가로 스크롤.
- **Tablet (768px ~ 1024px)**: 2 Column Grid.
- **Desktop (> 1024px)**: 3~4 Column Grid. 사이드바(선택) 노출.

---

## 2. 화면 상세 정의 (Screen Detail)

### SC-01: Dashboard (메인 대시보드)

**목적**: 관리 중인 모든 아이템(포트폴리오)의 요약 정보를 한눈에 파악.

**UI 구성요소**:
1.  **Summary Widget**: 전체 총 자산, 총 수익률 표시 상단 패널.
2.  **Filter Bar**: `전체`, `즐겨찾기`, `상태별` 필터링 탭.
3.  **Search Input**: 실시간 검색 (종목명, 티커).
4.  **Portfolio List**: 카드 형태의 리스트.
    - 주요 정보: 종목명(Primary), 현재 수익률(Badge), 진행률(Progres Bar).

**인터랙션**:
- 카드 클릭 시 `SC-02 Detail Modal` 오픈.
- 빈 공간 클릭 시 검색 초기화.

### SC-02: Item Detail Modal (상세 팝업)

**목적**: 개별 아이템의 상세 파라미터 설정 및 시뮬레이션.

**UI 구성요소**:
1.  **Header**: 종목명(Title), 닫기 버튼(Close).
2.  **Chart Area**: 평단가 방어선 차트 (Line Chart).
3.  **Core Params**: 고점, 강도, 시작 하락률 입력 폼 (Float Label Input).
4.  **Trade Table**: 차수별 매수 계획표.
    - 컬럼: `단계`, `가격`, `수량`, `금액`, `상태(체결/미체결)`.
    - 액션: 체크박스로 체결 상태 토글.

**인터랙션**:
- 파라미터 변경 시 즉시 차트/테이블 재계산 (Debounce 300ms).
- 테이블 행 클릭 시 `메모` 입력창 확장.

### SC-03: Settings / Data (설정 및 데이터)

**목적**: 앱 설정 및 데이터 관리.

**UI 구성요소**:
1.  **Theme Toggle**: Light/Dark 모드 전환.
2.  **Data Management**:
    - [Export JSON]: 전체 데이터 백업.
    - [Import JSON]: 백업 파일 복원.
    - [Reset All]: 공장 초기화 (위험).

---

## 3. 공통 UI 패턴 (Common Patterns)

### P-01: Toast Notification
- 위치: 우측 하단 (모바일은 하단 중앙).
- 용도: 저장 완료, 에러 발생, 클립보드 복사 알림.
- 지속 시간: 3000ms.

### P-02: Empty State
- 데이터가 없거나 검색 결과가 없을 때 표시.
- 구성: 아이콘(Illus.) + 안내 문구 + "새로 만들기" 버튼.

### P-03: Modal with Backdrop
- 배경: `bg-black/50` (Blur 효과 포함).
- 동작: `Esc` 키 누름 또는 배경 클릭 시 닫힘.
- 애니메이션: `Fade In` + `Scale Up`.
