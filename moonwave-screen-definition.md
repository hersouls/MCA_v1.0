# 범용 아이템 관리 UI 시스템 가이드

이 문서는 **어떤 도메인에도 적용 가능한 범용 UI 컴포넌트 시스템**을 정의합니다.
여행 관리, 할일 관리, 투자 관리, 레시피 관리, 영화 관리 등 다양한 분야에 동일한 UI 패턴을 적용할 수 있습니다.

---

## 목차

1. [문서 개요](#1-문서-개요)
2. [디자인 시스템](#2-디자인-시스템)
3. [레이아웃 정의](#3-레이아웃-정의)
4. [컴포넌트 명세](#4-컴포넌트-명세)
5. [인터랙션 명세](#5-인터랙션-명세)
6. [상태 관리](#6-상태-관리)
7. [데이터 구조 및 커스터마이징](#7-데이터-구조-및-커스터마이징)
8. [접근성 명세](#8-접근성-명세)
9. [애니메이션 명세](#9-애니메이션-명세)
10. [부록: 도메인별 구현 가이드](#10-부록-도메인별-구현-가이드)

---

## 1. 문서 개요

### 1.1 목적

이 UI 시스템은 **아이템 목록 기반 관리 애플리케이션**을 위한 범용 컴포넌트 가이드입니다.

**핵심 패턴:**
- 아이템 카드 그리드/리스트 뷰
- 카테고리 및 상태 기반 필터링
- 검색 및 정렬
- 상세 모달 (평가, 메모, 외부 링크)
- 데이터 내보내기/가져오기
- 반응형 디자인

### 1.2 적용 가능 도메인

| 도메인 | 아이템 | 카테고리 예시 | 상태 예시 |
|--------|--------|--------------|----------|
| **여행 관리** | 여행지 | 아시아/유럽/아메리카 | 가고싶음/예약완료/다녀옴 |
| **할일 관리** | 할일 | 업무/개인/학습 | 미시작/진행중/완료 |
| **투자 관리** | 종목 | 주식/ETF/암호화폐 | 관심/보유중/매도완료 |
| **레시피 관리** | 레시피 | 한식/양식/일식 | 해보고싶음/시도함/마스터 |
| **영화 관리** | 영화 | 액션/드라마/코미디 | 보고싶음/시청중/봤음 |
| **도서 관리** | 도서 | 과학/문학/일반 | 읽을예정/읽는중/읽음 |
| **운동 관리** | 운동 | 유산소/근력/유연성 | 계획/진행중/달성 |

### 1.3 기술 스택

| 구분 | 기술 | 버전/CDN |
|------|------|----------|
| CSS Framework | Tailwind CSS | CDN (latest) |
| Icons | Lucide | unpkg (latest) |
| Font | Pretendard | v1.3.9 |
| 언어 | HTML5, CSS3, ES6+ | - |

### 1.4 용어 정의

| 범용 용어 | 설명 | 도메인 예시 |
|----------|------|-----------|
| **Item** | 관리 대상 단위 | 여행지, 할일, 종목 |
| **Primary Text** | 아이템의 주요 제목 | 여행지명, 할일 제목, 종목명 |
| **Secondary Text** | 부가 정보 | 국가, 마감일, 섹터 |
| **Description** | 상세 설명/메모 | 여행 메모, 할일 상세, 투자 메모 |
| **Category** | 분류 카테고리 | 대륙, 업무유형, 자산유형 |
| **Status** | 진행 상태 | 방문여부, 완료상태, 보유상태 |
| **Rating** | 평가/우선순위 | 만족도, 중요도, 투자등급 |
| **External Links** | 관련 외부 서비스 | Booking, Todoist, 네이버금융 |

---

## 2. 디자인 시스템

### 2.1 컬러 시스템

> 상세 내용은 `moonwave-color-guide.md` 참조

#### 시맨틱 컬러 변수

| 변수 | 용도 | 커스터마이징 |
|------|------|-------------|
| `--primary` | 주요 강조색, 활성 상태 | 브랜드 컬러 적용 |
| `--secondary` | 보조 색상 | 카테고리 2 |
| `--accent` | 악센트, 호버 | 카테고리 3 |
| `--muted` | 비활성 배경 | 공통 |
| `--destructive` | 삭제/위험 | 공통 |

#### 카테고리별 컬러 매핑

```javascript
// 3개 카테고리 시스템 (기본)
const categoryColors = {
    category1: { bg: '#556B2F', text: 'white' },   // Primary
    category2: { bg: '#5E4B3C', text: 'white' },   // Secondary
    category3: { bg: '#B2AC88', text: '#5E4B3C' }  // Accent
};

// 상태별 컬러 매핑
const statusColors = {
    planned: { bg: '#B2AC88', text: '#5E4B3C' },   // 계획됨
    in_progress: { bg: '#556B2F', text: 'white' }, // 진행중
    completed: { bg: '#5E4B3C', text: 'white' }    // 완료
};
```

### 2.2 타이포그래피

| 요소 | 클래스 | 용도 |
|------|--------|------|
| 앱 타이틀 | `text-lg font-bold` | 헤더 로고 옆 |
| 카드 제목 | `text-lg font-bold` | Primary Text |
| 카드 부제목 | `text-sm text-muted` | Secondary Text |
| 본문 | `text-sm` | Description |
| 배지/라벨 | `text-xs font-medium` | Category, Status |

### 2.3 아이콘 시스템

**라이브러리**: Lucide Icons

**커스터마이징 가능 아이콘:**

| 용도 | 기본 아이콘 | 커스터마이징 예시 |
|------|-----------|-----------------|
| 앱 로고 | `waves` | `plane`, `check-square`, `trending-up` |
| 즐겨찾기 | `heart` | `star`, `bookmark` |
| 평가 | `star` | `flag`, `thermometer`, `signal` |
| 카테고리 | - | `globe`, `briefcase`, `dollar-sign` |

### 2.4 간격 및 그리드

| 단위 | 값 | 용도 |
|------|-----|------|
| `gap-4` | 16px | 카드 간격 (모바일) |
| `gap-6` | 24px | 카드 간격 (데스크탑) |
| `p-5` | 20px | 카드/모달 패딩 |
| `max-w-7xl` | 1280px | 최대 너비 |

---

## 3. 레이아웃 정의

### 3.1 전체 레이아웃 구조

```
┌─────────────────────────────────────────────────────────────────────────┐
│ HEADER (sticky, blur backdrop)                                           │
│ ┌────────────────────────────────────────────────────────────────────┐  │
│ │ [Logo+AppName]  [Search]  [ViewToggle]  [Stats][Data][Theme][Help] │  │
│ └────────────────────────────────────────────────────────────────────┘  │
│ ┌────────────────────────────────────────────────────────────────────┐  │
│ │ [Mobile Search - md 미만에서만]                                     │  │
│ └────────────────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────────────┤
│ MAIN (flex-1, max-w-7xl, mx-auto)                                        │
│ ┌────────────────────────────────────────────────────────────────────┐  │
│ │ FILTER BAR                                                          │  │
│ │ [All][Favorites][Category1][Category2][Category3] | [상태필터] [Sort] │  │
│ └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│ ┌────────────────────────────────────────────────────────────────────┐  │
│ │ ITEM GRID (responsive columns: 1 → 2 → 3 → 4)                       │  │
│ │ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐                    │  │
│ │ │ItemCard │ │ItemCard │ │ItemCard │ │ItemCard │                    │  │
│ │ └─────────┘ └─────────┘ └─────────┘ └─────────┘                    │  │
│ └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│ ┌────────────────────────────────────────────────────────────────────┐  │
│ │ EMPTY STATE (결과 없을 때)                                          │  │
│ └────────────────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────────────┤
│ FOOTER                                                                   │
└─────────────────────────────────────────────────────────────────────────┘

OVERLAYS:
┌─────────────────────────────────────────────────────────────────────────┐
│ ITEM DETAIL MODAL | STATISTICS MODAL | IMPORT MODAL | TOAST             │
└─────────────────────────────────────────────────────────────────────────┘
```

### 3.2 반응형 브레이크포인트

| 브레이크포인트 | 최소 너비 | 그리드 컬럼 | 주요 변화 |
|---------------|-----------|------------|----------|
| Mobile | 0px | 1 | 모바일 검색창 |
| sm | 640px | 2 | 뷰 모드 토글 표시 |
| md | 768px | 2 | 데스크탑 검색창 전환 |
| lg | 1024px | 3 | - |
| xl | 1280px | 4 | 최대 컬럼 |

### 3.3 뷰 모드

| 모드 | 설명 | 특징 |
|------|------|------|
| **Grid** | 카드 그리드 | 기본, 반응형 컬럼 |
| **List** | 가로형 리스트 | md+ 에서 한 줄 전체 너비 |
| **Compact** | 컴팩트 그리드 | 설명 숨김, 200px 최소 너비 |

---

## 4. 컴포넌트 명세

### 4.1 Header

**목적**: 앱 브랜딩 및 주요 컨트롤 제공

**커스터마이징 포인트:**
| 요소 | 커스터마이징 |
|------|-------------|
| 로고 아이콘 | 도메인에 맞는 Lucide 아이콘 |
| 앱 이름 | 프로젝트명 |
| 검색 플레이스홀더 | "Search {itemName}..." |

### 4.2 Search Input

**목적**: 아이템 검색

**검색 대상 (커스터마이징 가능):**
```javascript
const searchConfig = {
    fields: ['primaryText', 'secondaryText', 'description'],
    placeholder: 'Search items...',
    debounceMs: 300
};
```

### 4.3 View Mode Toggle

**목적**: Grid / List / Compact 뷰 전환

**구조**: 3개 버튼 그룹 (숨김 가능)

### 4.4 Filter Button Group (커스텀 필터 시스템)

**목적**: 카테고리 및 상태별 필터링

**커스터마이징 구조:**
```javascript
const filterConfig = {
    // 기본 필터
    defaultFilters: [
        { id: 'all', label: 'All' },
        { id: 'favorites', label: 'Favorites' }
    ],

    // 카테고리 필터 (커스텀)
    categoryFilters: [
        { id: 'category1', label: 'Category 1' },
        { id: 'category2', label: 'Category 2' },
        { id: 'category3', label: 'Category 3' }
    ],

    // 상태 필터 (커스텀)
    statusFilters: [
        { id: 'status1', label: 'Status 1' },
        { id: 'status2', label: 'Status 2' },
        { id: 'status3', label: 'Status 3' }
    ]
};
```

**필터 버튼 상태:**
| 상태 | 스타일 |
|------|--------|
| Active | bg: --primary, text: --primary-foreground |
| Inactive | bg: transparent, text: --muted-foreground |
| Hover | bg: --accent |

### 4.5 Sort Dropdown (커스텀 정렬 시스템)

**목적**: 아이템 정렬

**커스터마이징 구조:**
```javascript
const sortConfig = {
    options: [
        { value: 'id-asc', label: '번호순 ↑', field: 'id', direction: 'asc' },
        { value: 'id-desc', label: '번호순 ↓', field: 'id', direction: 'desc' },
        { value: 'primary-asc', label: '제목순 ↑', field: 'primaryText', direction: 'asc' },
        { value: 'primary-desc', label: '제목순 ↓', field: 'primaryText', direction: 'desc' },
        { value: 'secondary-asc', label: '부제목순 ↑', field: 'secondaryText', direction: 'asc' },
        { value: 'secondary-desc', label: '부제목순 ↓', field: 'secondaryText', direction: 'desc' }
    ],
    default: 'id-asc'
};
```

### 4.6 Item Card (범용 카드 컴포넌트)

**목적**: 개별 아이템 정보 표시

**구조:**
```
┌─────────────────────────────────────┐
│ [Category Badge] [Status Badge] [♥] │  ← Header
│                                     │
│ Primary Text (제목)                 │  ← 클릭 시 모달
│ Secondary Text ★★★★☆               │  ← 부제목 + 평가
│ Description text...                 │  ← 설명 (Compact 시 숨김)
│                                     │
├─────────────────────────────────────┤
│ [Link1] │ [Link2] │ [Link3]        │  ← External Links (선택적)
└─────────────────────────────────────┘
```

**커스터마이징 포인트:**
```javascript
const cardConfig = {
    showSecondaryText: true,    // 부제목 표시 여부
    showDescription: true,       // 설명 표시 여부
    showRating: true,            // 평가 표시 여부
    showExternalLinks: true,     // 외부 링크 표시 여부
    linkCount: 3                 // 외부 링크 개수 (0-3)
};
```

### 4.7 Item Detail Modal (범용 상세 모달)

**목적**: 아이템 상세 정보 및 사용자 데이터 입력

**구조:**
```
┌─────────────────────────────────────────────────────────────┐
│ HEADER                                                       │
│ [Category Badge] [Status Badge]                       [X]   │
├─────────────────────────────────────────────────────────────┤
│ CONTENT                                                      │
│ Primary Text (h2)                                            │
│ Secondary Text                                               │
│ Description                                                  │
│                                                              │
│ ─────────────────────────────────────────────────────────   │
│                                                              │
│ 상태 (커스텀 라벨)                                           │
│ [Select: 옵션1 / 옵션2 / 옵션3]                             │
│                                                              │
│ 평가 (커스텀 라벨)                                           │
│ [★] [★] [★] [★] [★]  (또는 커스텀 아이콘)                   │
│                                                              │
│ 메모                                                         │
│ [Textarea]                                                   │
│                                                              │
│ ─────────────────────────────────────────────────────────   │
│                                                              │
│ [External Link 1] [External Link 2] [External Link 3]       │
└─────────────────────────────────────────────────────────────┘
```

**커스터마이징 구조:**
```javascript
const modalConfig = {
    statusLabel: '상태',           // 상태 필드 라벨
    ratingLabel: '평가',           // 평가 필드 라벨
    ratingMax: 5,                  // 최대 평가 점수
    ratingIcon: 'star',            // 평가 아이콘
    noteLabel: '메모',             // 메모 필드 라벨
    notePlaceholder: '메모를 입력하세요...'
};
```

### 4.8 Statistics Modal (범용 통계 모달)

**목적**: 전체 통계 표시

**구조:**
```
┌─────────────────────────────────────────┐
│ {appName} 통계                     [X] │
├─────────────────────────────────────────┤
│ ┌─────────┐  ┌─────────┐               │
│ │  전체   │  │  완료   │               │
│ │  94개   │  │  10개   │               │
│ └─────────┘  └─────────┘               │
│ ┌─────────┐  ┌─────────┐               │
│ │ 진행중  │  │ 평균평가 │               │
│ │   5개   │  │   4.2   │               │
│ └─────────┘  └─────────┘               │
│                                         │
│ 카테고리별 현황                          │
│ Category1   ████████░░░░░░░  5개        │
│ Category2   ████████████░░░  8개        │
│ Category3   ██░░░░░░░░░░░░░  2개        │
│                                         │
│ 전체 진행률                             │
│ █████████████████░░░░░░░░░  15/94 (16%) │
└─────────────────────────────────────────┘
```

### 4.9 Import/Export Modal

**목적**: 데이터 가져오기/내보내기

**구조 (Import):**
```
┌─────────────────────────────────────────┐
│ 데이터 가져오기                          │
│                                         │
│ 기존 데이터와 어떻게 처리할까요?         │
│                                         │
│ [병합]  [덮어쓰기]  [취소]               │
└─────────────────────────────────────────┘
```

### 4.10 Toast Notification

**목적**: 사용자 액션 피드백

**커스터마이징 메시지:**
```javascript
const toastMessages = {
    favoriteAdd: 'Added to favorites',
    favoriteRemove: 'Removed from favorites',
    statusUpdate: '{statusLabel} updated',
    exportComplete: 'Data exported',
    importComplete: 'Data imported'
};
```

### 4.11 Empty State

**목적**: 검색/필터 결과 없음 안내

**커스터마이징:**
```javascript
const emptyStateConfig = {
    icon: 'inbox',              // 또는 도메인별 아이콘
    title: 'No items found',
    description: 'Try adjusting your search or filters.'
};
```

---

## 5. 인터랙션 명세

### 5.1 검색 기능

| 항목 | 내용 |
|------|------|
| 트리거 | 검색창 입력 |
| 디바운스 | 300ms |
| 검색 대상 | primaryText, secondaryText, description |
| 결과 | 하이라이트 표시, URL 업데이트 |

### 5.2 필터링 기능

| 항목 | 내용 |
|------|------|
| 트리거 | 필터 버튼 클릭 |
| 필터 타입 | all, favorites, categories, statuses |
| 결과 | 목록 갱신, URL 업데이트 |

### 5.3 정렬 기능

| 항목 | 내용 |
|------|------|
| 트리거 | 드롭다운 변경 |
| 정렬 기준 | id, primaryText, secondaryText |
| 방향 | asc, desc |

### 5.4 즐겨찾기 토글

| 항목 | 내용 |
|------|------|
| 트리거 | 하트 아이콘 클릭 |
| 저장 | localStorage |
| 피드백 | Toast |

### 5.5 모달 열기/닫기

| 항목 | 내용 |
|------|------|
| 열기 트리거 | 카드 클릭, Enter 키 |
| 닫기 트리거 | X 버튼, backdrop, Escape |
| 애니메이션 | slideUp (열기), slideDown (닫기) |

### 5.6 상태 변경

| 항목 | 내용 |
|------|------|
| 트리거 | 모달 내 select 변경 |
| 저장 | localStorage |
| 갱신 | 카드 배지, 통계 |

### 5.7 평가 입력

| 항목 | 내용 |
|------|------|
| 트리거 | 평가 아이콘 클릭 |
| 토글 | 같은 점수 클릭 시 0으로 리셋 |
| 저장 | localStorage |

### 5.8 메모 저장

| 항목 | 내용 |
|------|------|
| 트리거 | textarea change |
| 저장 | localStorage |

### 5.9 데이터 내보내기/가져오기

| 항목 | 내용 |
|------|------|
| 형식 | JSON |
| 포함 데이터 | favorites, itemData, settings |
| 가져오기 옵션 | 병합, 덮어쓰기 |

### 5.10 키보드 네비게이션

| 키 | 동작 |
|----|------|
| `/` 또는 `Ctrl+K` | 검색창 포커스 |
| `Escape` | 모달 닫기 / 검색 초기화 |
| `← → ↑ ↓` | 카드 간 이동 |
| `Enter` | 상세 모달 열기 |
| `F` | 즐겨찾기 토글 |

---

## 6. 상태 관리

### 6.1 애플리케이션 상태 (범용)

| 변수 | 타입 | 설명 | 영속성 |
|------|------|------|--------|
| `currentFilter` | string | 현재 필터 | URL |
| `currentSort` | string | 현재 정렬 | URL |
| `searchQuery` | string | 검색어 | URL |
| `favorites` | Set | 즐겨찾기 ID 목록 | localStorage |
| `itemData` | Object | 아이템별 사용자 데이터 | localStorage |
| `currentViewMode` | string | 뷰 모드 | localStorage |
| `currentModalItem` | Object | 현재 모달 아이템 | 메모리 |

### 6.2 로컬 스토리지 키

| 키 | 형식 | 설명 |
|----|------|------|
| `{appPrefix}_favs` | JSON Array | 즐겨찾기 ID 배열 |
| `{appPrefix}_data` | JSON Object | 아이템별 상태/평가/메모 |
| `{appPrefix}_view` | string | 뷰 모드 |
| `theme` | string | 테마 |

### 6.3 URL 상태 파라미터

| 파라미터 | 값 예시 | 설명 |
|----------|---------|------|
| `filter` | `category1`, `status2` | 필터 타입 |
| `q` | `검색어` | 검색 쿼리 |
| `sort` | `primary-asc` | 정렬 옵션 |

---

## 7. 데이터 구조 및 커스터마이징

### 7.1 범용 아이템 스키마

```typescript
interface Item {
    // 필수 필드
    id: number | string;
    primaryText: string;

    // 선택 필드
    secondaryText?: string;
    description?: string;
    category?: string;
    tags?: string[];

    // 도메인별 확장 필드
    metadata?: {
        [key: string]: any;
    };
}
```

### 7.2 사용자 데이터 스키마

```typescript
interface ItemUserData {
    [itemId: string]: {
        status: string;      // 상태 ID
        rating: number;      // 0 ~ ratingMax
        note: string;        // 메모
    }
}
```

### 7.3 내보내기 데이터 형식

```typescript
interface ExportData {
    version: string;
    exportDate: string;          // ISO 8601
    appName: string;
    favorites: (number | string)[];
    itemData: ItemUserData;
    settings: {
        theme: string;
        viewMode: string;
    };
}
```

### 7.4 앱 설정 스키마

```typescript
interface AppConfig {
    // 기본 정보
    appName: string;
    appPrefix: string;           // localStorage 키 접두사
    itemName: string;            // 단수형: "여행지", "할일"
    itemNamePlural: string;      // 복수형: "여행지들", "할일들"
    logoIcon: string;            // Lucide 아이콘명

    // 스키마 매핑
    schema: {
        primaryTextField: string;
        secondaryTextField?: string;
        descriptionField?: string;
    };

    // 카테고리 설정
    categories: Array<{
        id: string;
        label: string;
        color: string;
        textColor?: string;
    }>;

    // 카테고리 추론 함수 (선택)
    inferCategory?: (item: Item) => string;

    // 상태 설정
    statuses: Array<{
        id: string;
        label: string;
        color: string;
        textColor?: string;
    }>;

    // 평가 설정
    rating: {
        enabled: boolean;
        label: string;
        max: number;
        icon: string;
    };

    // 외부 링크 설정
    externalLinks: Array<{
        name: string;
        urlTemplate: string;     // {primaryText}, {id} 등 변수 사용
        icon?: string;
    }> | null;

    // 정렬 설정
    sortOptions: Array<{
        value: string;
        label: string;
        field: string;
        direction: 'asc' | 'desc';
    }>;

    // 검색 설정
    searchFields: string[];
    searchPlaceholder: string;
}
```

---

## 8. 접근성 명세

### 8.1 ARIA 속성 매핑

| 요소 | role | aria-* 속성 |
|------|------|-------------|
| 필터 버튼 그룹 | group | aria-label="Filter {itemNamePlural}" |
| 필터 버튼 | - | aria-pressed |
| 아이템 카드 | article | aria-label="{primaryText}" |
| 상세 모달 | dialog | aria-modal, aria-labelledby |
| 평가 버튼 | button | aria-label="{n}점" |

### 8.2 키보드 네비게이션

| 키 | 컨텍스트 | 동작 |
|----|----------|------|
| `/` | 전역 | 검색창 포커스 |
| `Ctrl+K` | 전역 | 검색창 포커스 |
| `Escape` | 모달 | 모달 닫기 |
| `← → ↑ ↓` | 카드 포커스 | 카드 간 이동 |
| `Enter` | 카드 포커스 | 모달 열기 |
| `F` | 카드 포커스 | 즐겨찾기 토글 |

### 8.3 스크린 리더 지원

- ARIA Live Region으로 검색 결과 개수 안내
- sr-only 클래스로 숨김 텍스트 제공

---

## 9. 애니메이션 명세

### 9.1 CSS 애니메이션

| 애니메이션 | 대상 | duration |
|-----------|------|----------|
| slideUpFade | Toast | 0.3s |
| modalSlideUp | Modal 열기 | 0.3s |
| modalSlideDown | Modal 닫기 | 0.2s |

### 9.2 트랜지션

| 요소 | 속성 | duration |
|------|------|----------|
| body | background-color, color | 0.3s |
| 카드 | transform, box-shadow | 0.2s |
| 버튼 | colors | transition-colors |

---

## 10. 부록: 도메인별 구현 가이드

### 10.1 여행 관리 앱 적용 예시

```javascript
const travelConfig = {
    appName: 'Travel Planner',
    appPrefix: 'travel',
    itemName: '여행지',
    itemNamePlural: '여행지',
    logoIcon: 'plane',

    schema: {
        primaryTextField: 'destinationName',
        secondaryTextField: 'country',
        descriptionField: 'notes'
    },

    categories: [
        { id: 'asia', label: '아시아', color: '#556B2F', textColor: 'white' },
        { id: 'europe', label: '유럽', color: '#5E4B3C', textColor: 'white' },
        { id: 'america', label: '아메리카', color: '#B2AC88', textColor: '#5E4B3C' },
        { id: 'oceania', label: '오세아니아', color: '#4A7C59', textColor: 'white' }
    ],

    inferCategory: (item) => {
        const asiaCountries = ['일본', '한국', '태국', '베트남'];
        const europeCountries = ['프랑스', '이탈리아', '스페인', '영국'];
        if (asiaCountries.some(c => item.country?.includes(c))) return 'asia';
        if (europeCountries.some(c => item.country?.includes(c))) return 'europe';
        return 'america';
    },

    statuses: [
        { id: 'none', label: '선택 안함' },
        { id: 'wishlist', label: '가고싶음', color: '#B2AC88', textColor: '#5E4B3C' },
        { id: 'booked', label: '예약완료', color: '#556B2F', textColor: 'white' },
        { id: 'visited', label: '다녀옴', color: '#5E4B3C', textColor: 'white' }
    ],

    rating: {
        enabled: true,
        label: '만족도',
        max: 5,
        icon: 'star'
    },

    externalLinks: [
        { name: 'Booking', urlTemplate: 'https://booking.com/searchresults.html?ss={primaryText}' },
        { name: 'TripAdvisor', urlTemplate: 'https://tripadvisor.com/Search?q={primaryText}' },
        { name: 'Google Maps', urlTemplate: 'https://maps.google.com/maps?q={primaryText}' }
    ],

    sortOptions: [
        { value: 'id-asc', label: '번호순 ↑', field: 'id', direction: 'asc' },
        { value: 'name-asc', label: '이름순 ↑', field: 'destinationName', direction: 'asc' },
        { value: 'country-asc', label: '국가순 ↑', field: 'country', direction: 'asc' }
    ],

    searchFields: ['destinationName', 'country', 'notes'],
    searchPlaceholder: 'Search destinations...'
};

// 데이터 예시
const travelData = [
    { id: 1, destinationName: '도쿄', country: '일본', notes: '벚꽃 시즌에 방문 예정' },
    { id: 2, destinationName: '파리', country: '프랑스', notes: '에펠탑, 루브르 필수' },
    { id: 3, destinationName: '뉴욕', country: '미국', notes: '브로드웨이 뮤지컬' }
];
```

---

### 10.2 할일 관리 앱 적용 예시

```javascript
const todoConfig = {
    appName: 'Task Manager',
    appPrefix: 'todo',
    itemName: '할일',
    itemNamePlural: '할일',
    logoIcon: 'check-square',

    schema: {
        primaryTextField: 'taskTitle',
        secondaryTextField: 'dueDate',
        descriptionField: 'details'
    },

    categories: [
        { id: 'work', label: '업무', color: '#556B2F', textColor: 'white' },
        { id: 'personal', label: '개인', color: '#5E4B3C', textColor: 'white' },
        { id: 'study', label: '학습', color: '#B2AC88', textColor: '#5E4B3C' }
    ],

    statuses: [
        { id: 'none', label: '선택 안함' },
        { id: 'todo', label: '미시작', color: '#B2AC88', textColor: '#5E4B3C' },
        { id: 'doing', label: '진행중', color: '#556B2F', textColor: 'white' },
        { id: 'done', label: '완료', color: '#5E4B3C', textColor: 'white' }
    ],

    rating: {
        enabled: true,
        label: '우선순위',
        max: 3,
        icon: 'flag'   // 깃발 아이콘으로 우선순위 표시
    },

    externalLinks: null,  // 외부 링크 불필요

    sortOptions: [
        { value: 'id-asc', label: '생성순 ↑', field: 'id', direction: 'asc' },
        { value: 'title-asc', label: '제목순 ↑', field: 'taskTitle', direction: 'asc' },
        { value: 'due-asc', label: '마감일순 ↑', field: 'dueDate', direction: 'asc' }
    ],

    searchFields: ['taskTitle', 'details'],
    searchPlaceholder: 'Search tasks...'
};

// 데이터 예시
const todoData = [
    { id: 1, taskTitle: '프로젝트 제안서 작성', dueDate: '2026-01-25', details: '클라이언트 미팅 전 완료', category: 'work' },
    { id: 2, taskTitle: '운동하기', dueDate: '2026-01-23', details: '헬스장 30분', category: 'personal' },
    { id: 3, taskTitle: 'React 강의 수강', dueDate: '2026-01-30', details: 'Udemy 강의 Section 5', category: 'study' }
];
```

---

### 10.3 투자 관리 앱 적용 예시

```javascript
const investmentConfig = {
    appName: 'Portfolio Tracker',
    appPrefix: 'invest',
    itemName: '종목',
    itemNamePlural: '종목',
    logoIcon: 'trending-up',

    schema: {
        primaryTextField: 'stockName',
        secondaryTextField: 'sector',
        descriptionField: 'investmentThesis'
    },

    categories: [
        { id: 'stock', label: '주식', color: '#556B2F', textColor: 'white' },
        { id: 'etf', label: 'ETF', color: '#5E4B3C', textColor: 'white' },
        { id: 'crypto', label: '암호화폐', color: '#B2AC88', textColor: '#5E4B3C' },
        { id: 'bond', label: '채권', color: '#4A7C59', textColor: 'white' }
    ],

    statuses: [
        { id: 'none', label: '선택 안함' },
        { id: 'watching', label: '관심', color: '#B2AC88', textColor: '#5E4B3C' },
        { id: 'holding', label: '보유중', color: '#556B2F', textColor: 'white' },
        { id: 'sold', label: '매도완료', color: '#5E4B3C', textColor: 'white' }
    ],

    rating: {
        enabled: true,
        label: '투자등급',
        max: 5,
        icon: 'star'
    },

    externalLinks: [
        { name: '네이버금융', urlTemplate: 'https://finance.naver.com/search/searchList.naver?query={primaryText}' },
        { name: 'Yahoo Finance', urlTemplate: 'https://finance.yahoo.com/quote/{ticker}' },
        { name: 'Investing.com', urlTemplate: 'https://www.investing.com/search/?q={primaryText}' }
    ],

    sortOptions: [
        { value: 'id-asc', label: '번호순 ↑', field: 'id', direction: 'asc' },
        { value: 'name-asc', label: '종목순 ↑', field: 'stockName', direction: 'asc' },
        { value: 'sector-asc', label: '섹터순 ↑', field: 'sector', direction: 'asc' }
    ],

    searchFields: ['stockName', 'sector', 'investmentThesis', 'ticker'],
    searchPlaceholder: 'Search stocks...'
};

// 데이터 예시
const investmentData = [
    { id: 1, stockName: '삼성전자', ticker: '005930', sector: '반도체', investmentThesis: '메모리 사이클 회복 기대' },
    { id: 2, stockName: 'TIGER 미국S&P500', ticker: '360750', sector: 'ETF', investmentThesis: '미국 시장 장기 투자' },
    { id: 3, stockName: '비트코인', ticker: 'BTC', sector: '암호화폐', investmentThesis: '디지털 골드' }
];
```

---

### 10.4 커스터마이징 체크리스트

#### 기본 설정
- [ ] appName 설정
- [ ] appPrefix 설정 (localStorage 키)
- [ ] itemName / itemNamePlural 설정
- [ ] logoIcon 설정

#### 스키마 매핑
- [ ] primaryTextField 매핑
- [ ] secondaryTextField 매핑 (선택)
- [ ] descriptionField 매핑 (선택)

#### 카테고리 설정
- [ ] 카테고리 목록 정의 (2-5개 권장)
- [ ] 카테고리별 색상 지정
- [ ] inferCategory 함수 구현 (선택)

#### 상태 설정
- [ ] 상태 목록 정의 (2-4개 권장)
- [ ] 상태별 색상 지정

#### 평가 설정
- [ ] enabled 설정
- [ ] label 설정
- [ ] max 설정 (3 또는 5 권장)
- [ ] icon 설정

#### 외부 링크 설정
- [ ] 링크 필요 여부 결정
- [ ] urlTemplate 정의 (변수: {primaryText}, {id}, {metadata.field})
- [ ] 링크 개수 결정 (0-3개)

#### 정렬 설정
- [ ] sortOptions 정의
- [ ] default 정렬 설정

#### 검색 설정
- [ ] searchFields 정의
- [ ] searchPlaceholder 설정

#### UI 설정
- [ ] 컬러 팔레트 선택 (moonwave-color-guide.md 참조)
- [ ] 뷰 모드 활성화 여부

#### 테스트
- [ ] 모든 필터 동작 확인
- [ ] 정렬 동작 확인
- [ ] 검색 동작 확인
- [ ] 모달 동작 확인
- [ ] 데이터 저장/복원 확인
- [ ] 반응형 레이아웃 확인
- [ ] 접근성 확인

---

## 문서 정보

- **버전**: 2.0
- **작성일**: 2026-01-23
- **유형**: 범용 UI 컴포넌트 시스템 가이드
- **관련 문서**: moonwave-color-guide.md
- **참조 구현**: Book_v1.html (도서 관리 앱)
