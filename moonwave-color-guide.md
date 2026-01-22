# Moonwave Library 컬러 테마 커스터마이징 가이드

이 가이드는 Moonwave Library 도서 관리 웹 애플리케이션의 컬러 시스템을 다른 프로젝트에 적용하거나 테마를 변경하는 방법을 설명합니다.

---

## 목차

1. [개요](#1-개요)
2. [CSS 변수 시스템](#2-css-변수-시스템)
3. [5가지 컬러 팔레트](#3-5가지-컬러-팔레트)
4. [컴포넌트별 색상 매핑](#4-컴포넌트별-색상-매핑)
5. [적용 가이드](#5-적용-가이드)
6. [컬러 매핑 레퍼런스 테이블](#6-컬러-매핑-레퍼런스-테이블)

---

## 1. 개요

### 1.1 프레임워크 및 의존성

```html
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- Lucide Icons -->
<script src="https://unpkg.com/lucide@latest"></script>

<!-- Pretendard Font -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
```

### 1.2 컬러 시스템 아키텍처

이 시스템은 두 가지 레이어로 구성됩니다:

1. **CSS 변수 레이어** - HSL 값을 사용하는 19개의 CSS 커스텀 프로퍼티
2. **하드코딩 색상 레이어** - 특정 컴포넌트에 직접 적용된 HEX 색상

### 1.3 가이드 사용 방법

1. 원하는 팔레트를 선택합니다
2. CSS 변수 블록을 복사하여 `:root`와 `.dark` 섹션을 교체합니다
3. 하드코딩 색상을 해당 팔레트의 색상으로 교체합니다
4. 테스트 체크리스트를 확인합니다

---

## 2. CSS 변수 시스템

### 2.1 변수 목록 및 용도

| 변수명 | 용도 | 사용처 |
|--------|------|--------|
| `--background` | 페이지 배경색 | body, 메인 컨테이너 |
| `--foreground` | 기본 텍스트 색상 | body 텍스트 |
| `--card` | 카드 배경색 | 북 카드, 모달 |
| `--card-foreground` | 카드 텍스트 색상 | 카드 내 텍스트 |
| `--popover` | 팝오버 배경색 | 드롭다운 메뉴 |
| `--popover-foreground` | 팝오버 텍스트 색상 | 메뉴 텍스트 |
| `--primary` | 주요 강조 색상 | 버튼, 활성 필터, 로고 |
| `--primary-foreground` | 주요 색상 위 텍스트 | 버튼 텍스트 |
| `--secondary` | 보조 색상 | 보조 버튼, 배경 |
| `--secondary-foreground` | 보조 색상 위 텍스트 | 보조 버튼 텍스트 |
| `--muted` | 음소거된 배경색 | 비활성 영역, 카드 푸터 |
| `--muted-foreground` | 음소거된 텍스트 색상 | 설명 텍스트, 아이콘 |
| `--accent` | 악센트 색상 | 호버 상태, 하이라이트 |
| `--accent-foreground` | 악센트 위 텍스트 | 강조 텍스트 |
| `--destructive` | 삭제/위험 색상 | 에러 상태 |
| `--destructive-foreground` | 위험 색상 위 텍스트 | 에러 텍스트 |
| `--border` | 테두리 색상 | 카드 테두리, 구분선 |
| `--input` | 입력 필드 테두리 | 검색창, select |
| `--ring` | 포커스 링 색상 | 포커스 상태 |

### 2.2 HSL 포맷 설명

CSS 변수는 HSL 값을 **공백으로 구분된 형식**으로 저장합니다:

```css
--primary: 82 39% 30%;  /* Hue: 82, Saturation: 39%, Lightness: 30% */
```

사용 시 `hsl()` 함수로 감싸서 사용합니다:

```css
background-color: hsl(var(--primary));
```

### 2.3 라이트/다크 모드 구조

```css
:root {
    /* 라이트 모드 변수 */
}

.dark {
    /* 다크 모드 변수 - html 태그에 'dark' 클래스 추가 시 적용 */
}
```

---

## 3. 5가지 컬러 팔레트

### 3.1 럭셔리 뷰티 (Luxury Beauty)

**컨셉**: Chanel No.19, 고급 향수/뷰티 브랜드
**분위기**: 어둡고 고급스러운 감성

| 역할 | HEX | 색상 |
|------|-----|------|
| Primary | `#50C878` | Emerald Green |
| Dark | `#121212` | Near Black |
| Light | `#FDFDFD` | White |
| Secondary | `#004B49` | Dark Teal |
| Accent | `#CBA135` | Gold |

#### 라이트 모드 CSS 변수
```css
:root {
    /* Luxury Beauty - Light Mode */
    --background: 0 0% 99%;
    --foreground: 0 0% 7%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 7%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 7%;
    --primary: 145 51% 55%;
    --primary-foreground: 0 0% 99%;
    --secondary: 175 100% 15%;
    --secondary-foreground: 0 0% 99%;
    --muted: 0 0% 96%;
    --muted-foreground: 0 0% 40%;
    --accent: 44 50% 48%;
    --accent-foreground: 0 0% 7%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 90%;
    --input: 0 0% 90%;
    --ring: 145 51% 55%;
}
```

#### 다크 모드 CSS 변수
```css
.dark {
    /* Luxury Beauty - Dark Mode */
    --background: 0 0% 7%;
    --foreground: 0 0% 95%;
    --card: 0 0% 10%;
    --card-foreground: 0 0% 95%;
    --popover: 0 0% 10%;
    --popover-foreground: 0 0% 95%;
    --primary: 145 51% 55%;
    --primary-foreground: 0 0% 7%;
    --secondary: 44 50% 48%;
    --secondary-foreground: 0 0% 7%;
    --muted: 0 0% 15%;
    --muted-foreground: 0 0% 60%;
    --accent: 175 100% 15%;
    --accent-foreground: 0 0% 95%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 20%;
    --input: 0 0% 20%;
    --ring: 145 51% 55%;
}
```

#### 하드코딩 색상
```css
/* Status Badges */
.status-reading { background-color: #50C878; color: white; }
.status-completed { background-color: #004B49; color: white; }
.status-planned { background-color: #CBA135; color: #121212; }

/* Search Highlight */
mark { background-color: #CBA135; color: #121212; padding: 0 2px; border-radius: 2px; }
.dark mark { background-color: #50C878; color: white; }

/* Focus Outline */
.book-card:focus-visible { outline: 2px solid #50C878; outline-offset: 2px; }
```

---

### 3.2 우아함/중성적/지성 (Elegant/Neutral)

**컨셉**: Perrier, L'Occitane, TWG Tea
**분위기**: 우아하고 차분한 지적 감성

| 역할 | HEX | 색상 |
|------|-----|------|
| Primary | `#A9BA9D` | Sage Green |
| Light | `#ECECEB` | Light Gray |
| Accent | `#E6D7B9` | Beige |
| Secondary | `#8A9A5B` | Olive Green |
| Dark | `#665D1E` | Dark Olive Brown |

#### 라이트 모드 CSS 변수
```css
:root {
    /* Elegant/Neutral - Light Mode */
    --background: 60 6% 92%;
    --foreground: 50 56% 26%;
    --card: 60 6% 96%;
    --card-foreground: 50 56% 26%;
    --popover: 60 6% 96%;
    --popover-foreground: 50 56% 26%;
    --primary: 78 32% 48%;
    --primary-foreground: 60 6% 96%;
    --secondary: 39 30% 81%;
    --secondary-foreground: 50 56% 26%;
    --muted: 39 30% 88%;
    --muted-foreground: 50 56% 40%;
    --accent: 88 17% 67%;
    --accent-foreground: 50 56% 20%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 39 30% 82%;
    --input: 39 30% 84%;
    --ring: 78 32% 48%;
}
```

#### 다크 모드 CSS 변수
```css
.dark {
    /* Elegant/Neutral - Dark Mode */
    --background: 50 56% 12%;
    --foreground: 88 17% 85%;
    --card: 50 56% 16%;
    --card-foreground: 88 17% 85%;
    --popover: 50 56% 16%;
    --popover-foreground: 88 17% 85%;
    --primary: 88 17% 67%;
    --primary-foreground: 50 56% 12%;
    --secondary: 50 56% 22%;
    --secondary-foreground: 88 17% 85%;
    --muted: 50 56% 20%;
    --muted-foreground: 88 17% 55%;
    --accent: 78 32% 48%;
    --accent-foreground: 88 17% 90%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 50 56% 25%;
    --input: 50 56% 25%;
    --ring: 88 17% 67%;
}
```

#### 하드코딩 색상
```css
/* Status Badges */
.status-reading { background-color: #8A9A5B; color: white; }
.status-completed { background-color: #665D1E; color: white; }
.status-planned { background-color: #A9BA9D; color: #665D1E; }

/* Search Highlight */
mark { background-color: #E6D7B9; color: #665D1E; padding: 0 2px; border-radius: 2px; }
.dark mark { background-color: #8A9A5B; color: white; }

/* Focus Outline */
.book-card:focus-visible { outline: 2px solid #8A9A5B; outline-offset: 2px; }
```

---

### 3.3 지속가능성 & 힐링 (Sustainability & Healing) - 현재 적용됨

**컨셉**: Jo Malone, Diptyque, 프리미엄 스파 브랜드
**분위기**: 자연친화적, 편안한 힐링 감성

| 역할 | HEX | 색상 |
|------|-----|------|
| Sage | `#B2AC88` | Sage Green |
| Dark Olive | `#556B2F` | Dark Olive |
| Beige | `#D6C6A9` | Beige |
| Mint | `#CDE4C6` | Light Mint |
| Brown | `#5E4B3C` | Dark Brown |

#### 라이트 모드 CSS 변수
```css
:root {
    /* Sustainability & Healing - Light Mode (Current) */
    --background: 106 36% 96%;
    --foreground: 26 22% 30%;
    --card: 106 36% 99%;
    --card-foreground: 26 22% 30%;
    --popover: 106 36% 99%;
    --popover-foreground: 26 22% 30%;
    --primary: 82 39% 30%;
    --primary-foreground: 106 36% 96%;
    --secondary: 39 38% 85%;
    --secondary-foreground: 26 22% 30%;
    --muted: 39 38% 90%;
    --muted-foreground: 26 22% 45%;
    --accent: 51 24% 72%;
    --accent-foreground: 26 22% 25%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 51 24% 80%;
    --input: 51 24% 82%;
    --ring: 82 39% 30%;
}
```

#### 다크 모드 CSS 변수
```css
.dark {
    /* Sustainability & Healing - Dark Mode (Current) */
    --background: 26 22% 12%;
    --foreground: 106 36% 90%;
    --card: 26 22% 16%;
    --card-foreground: 106 36% 90%;
    --popover: 26 22% 16%;
    --popover-foreground: 106 36% 90%;
    --primary: 51 24% 62%;
    --primary-foreground: 26 22% 12%;
    --secondary: 26 22% 22%;
    --secondary-foreground: 106 36% 90%;
    --muted: 26 22% 20%;
    --muted-foreground: 51 24% 62%;
    --accent: 82 39% 30%;
    --accent-foreground: 106 36% 90%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 26 22% 25%;
    --input: 26 22% 25%;
    --ring: 51 24% 62%;
}
```

#### 하드코딩 색상
```css
/* Status Badges */
.status-reading { background-color: #556B2F; color: white; }
.status-completed { background-color: #5E4B3C; color: white; }
.status-planned { background-color: #B2AC88; color: #5E4B3C; }

/* Search Highlight */
mark { background-color: #D6C6A9; color: #5E4B3C; padding: 0 2px; border-radius: 2px; }
.dark mark { background-color: #556B2F; color: white; }

/* Focus Outline */
.book-card:focus-visible { outline: 2px solid #556B2F; outline-offset: 2px; }
```

---

### 3.4 트렌디 & 세련됨 (Trendy & Sophisticated)

**컨셉**: Bottega Veneta, Jacquemus
**분위기**: 현대적이고 세련된 하이패션 감성

| 역할 | HEX | 색상 |
|------|-----|------|
| Primary | `#2EFFB4` | Neon Mint |
| Dark | `#030303` | Black |
| Light | `#EDECE8` | Off White |
| Secondary | `#00A86B` | Jade Green |
| Accent | `#D1F7E3` | Light Mint |

#### 라이트 모드 CSS 변수
```css
:root {
    /* Trendy & Sophisticated - Light Mode */
    --background: 40 8% 92%;
    --foreground: 0 0% 2%;
    --card: 40 8% 97%;
    --card-foreground: 0 0% 2%;
    --popover: 40 8% 97%;
    --popover-foreground: 0 0% 2%;
    --primary: 156 100% 59%;
    --primary-foreground: 0 0% 2%;
    --secondary: 156 100% 33%;
    --secondary-foreground: 0 0% 98%;
    --muted: 140 47% 90%;
    --muted-foreground: 0 0% 30%;
    --accent: 156 100% 33%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 40 8% 85%;
    --input: 40 8% 85%;
    --ring: 156 100% 59%;
}
```

#### 다크 모드 CSS 변수
```css
.dark {
    /* Trendy & Sophisticated - Dark Mode */
    --background: 0 0% 2%;
    --foreground: 40 8% 92%;
    --card: 0 0% 6%;
    --card-foreground: 40 8% 92%;
    --popover: 0 0% 6%;
    --popover-foreground: 40 8% 92%;
    --primary: 156 100% 59%;
    --primary-foreground: 0 0% 2%;
    --secondary: 156 100% 33%;
    --secondary-foreground: 40 8% 92%;
    --muted: 0 0% 12%;
    --muted-foreground: 156 100% 59%;
    --accent: 140 47% 90%;
    --accent-foreground: 0 0% 2%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 15%;
    --input: 0 0% 15%;
    --ring: 156 100% 59%;
}
```

#### 하드코딩 색상
```css
/* Status Badges */
.status-reading { background-color: #2EFFB4; color: #030303; }
.status-completed { background-color: #030303; color: white; }
.status-planned { background-color: #00A86B; color: white; }

/* Search Highlight */
mark { background-color: #D1F7E3; color: #030303; padding: 0 2px; border-radius: 2px; }
.dark mark { background-color: #2EFFB4; color: #030303; }

/* Focus Outline */
.book-card:focus-visible { outline: 2px solid #2EFFB4; outline-offset: 2px; }
```

---

### 3.5 전통 명품 & 프리미엄 (Traditional Luxury)

**컨셉**: Harrods, Bentley, Ralph Lauren Home
**분위기**: 클래식하고 전통적인 럭셔리 감성

| 역할 | HEX | 색상 |
|------|-----|------|
| Primary | `#004225` | British Racing Green |
| Secondary | `#355E3B` | Hunter Green |
| Light | `#F6F1EB` | Ivory |
| Gold | `#D4AF37` | Gold |
| Dark | `#333333` | Charcoal |

#### 라이트 모드 CSS 변수
```css
:root {
    /* Traditional Luxury - Light Mode */
    --background: 36 33% 95%;
    --foreground: 0 0% 20%;
    --card: 36 33% 98%;
    --card-foreground: 0 0% 20%;
    --popover: 36 33% 98%;
    --popover-foreground: 0 0% 20%;
    --primary: 148 100% 13%;
    --primary-foreground: 36 33% 95%;
    --secondary: 136 28% 29%;
    --secondary-foreground: 36 33% 95%;
    --muted: 36 33% 90%;
    --muted-foreground: 0 0% 40%;
    --accent: 46 65% 52%;
    --accent-foreground: 0 0% 20%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 36 33% 85%;
    --input: 36 33% 87%;
    --ring: 148 100% 13%;
}
```

#### 다크 모드 CSS 변수
```css
.dark {
    /* Traditional Luxury - Dark Mode */
    --background: 0 0% 10%;
    --foreground: 36 33% 90%;
    --card: 0 0% 14%;
    --card-foreground: 36 33% 90%;
    --popover: 0 0% 14%;
    --popover-foreground: 36 33% 90%;
    --primary: 46 65% 52%;
    --primary-foreground: 0 0% 10%;
    --secondary: 136 28% 29%;
    --secondary-foreground: 36 33% 90%;
    --muted: 0 0% 18%;
    --muted-foreground: 46 65% 52%;
    --accent: 148 100% 13%;
    --accent-foreground: 36 33% 90%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 22%;
    --input: 0 0% 22%;
    --ring: 46 65% 52%;
}
```

#### 하드코딩 색상
```css
/* Status Badges */
.status-reading { background-color: #004225; color: white; }
.status-completed { background-color: #333333; color: white; }
.status-planned { background-color: #355E3B; color: white; }

/* Search Highlight */
mark { background-color: #D4AF37; color: #333333; padding: 0 2px; border-radius: 2px; }
.dark mark { background-color: #004225; color: white; }

/* Focus Outline */
.book-card:focus-visible { outline: 2px solid #004225; outline-offset: 2px; }
```

---

## 4. 컴포넌트별 색상 매핑

### 4.1 상태 배지 (Status Badges)

책의 읽기 상태를 나타내는 배지입니다.

| 상태 | CSS 클래스 | 위치 |
|------|-----------|------|
| 읽는 중 | `.status-reading` | CSS Line 192-195 |
| 읽음 | `.status-completed` | CSS Line 197-200 |
| 읽을 예정 | `.status-planned` | CSS Line 202-205 |

**교체 방법:**
```css
/* 기존 코드 (Lines 192-205) */
.status-reading {
    background-color: #YOUR_PRIMARY_COLOR;
    color: white;  /* 또는 대비되는 색상 */
}

.status-completed {
    background-color: #YOUR_DARK_COLOR;
    color: white;
}

.status-planned {
    background-color: #YOUR_ACCENT_COLOR;
    color: #YOUR_DARK_COLOR;  /* 대비를 위해 */
}
```

### 4.2 카테고리 배지 (Category Badges)

책의 분류를 나타내는 배지입니다. JavaScript에서 동적으로 생성됩니다.

**위치:** JavaScript Lines 851-853, 1586-1593

```javascript
// Modal 배지 (Lines 851-853)
if (category === 'science') badge.className += 'bg-[#YOUR_PRIMARY] text-white';
else if (category === 'lit') badge.className += 'bg-[#YOUR_DARK] text-white';
else badge.className += 'bg-[#YOUR_ACCENT] text-[#YOUR_DARK]';

// Card 배지 (Lines 1586-1593)
if (category === 'science') {
    badgeColor = 'bg-[#YOUR_PRIMARY] text-white border-[#YOUR_PRIMARY]';
} else if (category === 'lit') {
    badgeColor = 'bg-[#YOUR_DARK] text-white border-[#YOUR_DARK]';
} else {
    badgeColor = 'bg-[#YOUR_ACCENT] text-[#YOUR_DARK] border-[#YOUR_ACCENT]';
}
```

### 4.3 검색 하이라이트 (Search Highlight)

검색어가 일치하는 부분을 강조하는 스타일입니다.

**위치:** CSS Lines 207-218

```css
/* 라이트 모드 */
mark {
    background-color: #YOUR_HIGHLIGHT_BG;  /* 밝은 악센트 색상 */
    color: #YOUR_HIGHLIGHT_TEXT;           /* 어두운 텍스트 색상 */
    padding: 0 2px;
    border-radius: 2px;
}

/* 다크 모드 */
.dark mark {
    background-color: #YOUR_PRIMARY;       /* 주요 색상 */
    color: white;
}
```

### 4.4 포커스 아웃라인 (Focus Outline)

키보드 네비게이션 시 포커스 상태를 나타냅니다.

**위치:** CSS Lines 260-263

```css
.book-card:focus-visible {
    outline: 2px solid #YOUR_PRIMARY;
    outline-offset: 2px;
}
```

### 4.5 통계 바 (Statistics Bars)

독서 통계 모달에서 사용되는 프로그레스 바입니다.

**위치:** JavaScript Lines 1024, 1033, 1042, 1051

```javascript
// Science 바 - Line 1024
<div class="stat-bar-fill bg-[#YOUR_PRIMARY]" style="width: ..."></div>

// Literature 바 - Line 1033
<div class="stat-bar-fill bg-[#YOUR_DARK]" style="width: ..."></div>

// General 바 - Line 1042
<div class="stat-bar-fill bg-[#YOUR_ACCENT]" style="width: ..."></div>

// 전체 진행률 바 - Line 1051
<div class="stat-bar-fill bg-[#YOUR_PRIMARY]" style="width: ..."></div>
```

### 4.6 타이틀 호버 색상

카드의 제목에 마우스를 올렸을 때의 색상입니다.

**위치:** JavaScript Line 1622

```javascript
title.className = 'font-bold text-lg leading-tight mb-1 hover:text-[#YOUR_PRIMARY] transition-colors';
```

---

## 5. 적용 가이드

### Step 1: CSS 변수 교체

Book_v1.html 파일의 `<style>` 섹션에서 다음 블록을 찾아 교체합니다.

**위치:** Lines 40-82

1. `:root { ... }` 블록을 원하는 팔레트의 라이트 모드 CSS 변수로 교체
2. `.dark { ... }` 블록을 원하는 팔레트의 다크 모드 CSS 변수로 교체

### Step 2: CSS 하드코딩 색상 교체

다음 위치의 HEX 색상 코드를 교체합니다:

| 구분 | 라인 | 교체할 색상 |
|------|------|------------|
| status-reading | 193 | background-color 값 |
| status-completed | 198 | background-color 값 |
| status-planned (bg) | 203 | background-color 값 |
| status-planned (text) | 204 | color 값 |
| mark (bg) | 209 | background-color 값 |
| mark (text) | 210 | color 값 |
| .dark mark (bg) | 216 | background-color 값 |
| focus-visible | 261 | outline 색상 값 |

### Step 3: JavaScript 색상 교체

다음 JavaScript 코드의 HEX 색상을 교체합니다:

| 구분 | 라인 | 설명 |
|------|------|------|
| Modal 배지 | 851-853 | Science, Literature, General 배지 색상 |
| 통계 바 | 1024, 1033, 1042, 1051 | 각 카테고리 통계 바 색상 |
| Card 배지 | 1588-1592 | 카드의 카테고리 배지 색상 |
| 타이틀 호버 | 1622 | 제목 호버 색상 |

### Step 4: 테스트 체크리스트

- [ ] 라이트/다크 모드 토글이 정상 작동하는가?
- [ ] 모든 상태 배지(읽는 중, 읽음, 예정)가 구분 가능한가?
- [ ] 카테고리 배지(Science, Literature, General)가 구분 가능한가?
- [ ] 검색 하이라이트가 가독성이 좋은가?
- [ ] 통계 바에서 각 카테고리가 구분 가능한가?
- [ ] 키보드 포커스 링이 잘 보이는가?
- [ ] 타이틀 호버 색상이 눈에 띄는가?
- [ ] WCAG 2.1 대비 비율 기준을 충족하는가? (최소 4.5:1)

---

## 6. 컬러 매핑 레퍼런스 테이블

### 6.1 전체 팔레트 비교

| 용도 | Jo Malone (현재) | Luxury Beauty | Elegant | Trendy | Traditional |
|------|------------------|---------------|---------|--------|-------------|
| **Primary** | `#556B2F` | `#50C878` | `#8A9A5B` | `#2EFFB4` | `#004225` |
| **Dark** | `#5E4B3C` | `#121212` | `#665D1E` | `#030303` | `#333333` |
| **Accent** | `#B2AC88` | `#CBA135` | `#A9BA9D` | `#00A86B` | `#355E3B` |
| **Light BG** | `#D6C6A9` | `#FDFDFD` | `#ECECEB` | `#EDECE8` | `#F6F1EB` |
| **Highlight** | `#D6C6A9` | `#CBA135` | `#E6D7B9` | `#D1F7E3` | `#D4AF37` |

### 6.2 상태 배지 색상 매핑

| 상태 | Jo Malone | Luxury | Elegant | Trendy | Traditional |
|------|-----------|--------|---------|--------|-------------|
| **읽는 중** | `#556B2F` white | `#50C878` white | `#8A9A5B` white | `#2EFFB4` black | `#004225` white |
| **읽음** | `#5E4B3C` white | `#004B49` white | `#665D1E` white | `#030303` white | `#333333` white |
| **예정** | `#B2AC88` `#5E4B3C` | `#CBA135` `#121212` | `#A9BA9D` `#665D1E` | `#00A86B` white | `#355E3B` white |

### 6.3 카테고리 배지 색상 매핑

| 카테고리 | Jo Malone | Luxury | Elegant | Trendy | Traditional |
|----------|-----------|--------|---------|--------|-------------|
| **Science** | `#556B2F` | `#50C878` | `#8A9A5B` | `#2EFFB4` | `#004225` |
| **Literature** | `#5E4B3C` | `#004B49` | `#665D1E` | `#030303` | `#333333` |
| **General** | `#B2AC88` | `#CBA135` | `#A9BA9D` | `#00A86B` | `#355E3B` |

---

## 부록: HEX to HSL 변환 가이드

CSS 변수는 HSL 값을 사용합니다. HEX를 HSL로 변환하려면:

### 온라인 도구
- https://www.rapidtables.com/convert/color/hex-to-hsl.html
- https://colordesigner.io/convert/hextohsl

### JavaScript 변환 함수
```javascript
function hexToHsl(hex) {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;

    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

// 사용 예: hexToHsl('#556B2F') → "82 39% 30%"
```

---

## 문서 정보

- **버전**: 1.0
- **작성일**: 2026-01-23
- **대상 파일**: Book_v1.html
- **호환성**: 모든 최신 브라우저 (Chrome, Firefox, Safari, Edge)
