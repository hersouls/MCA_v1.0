# Moonwave MCA v3.0

**Modified Cost Averaging** - 체계적인 분할매수 전략 관리 도구

[![Production](https://img.shields.io/badge/Production-mca.moonwave.kr-00A86B)](https://mca.moonwave.kr)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?logo=vercel)](https://vercel.com)

---

## 개요

**MCA(Modified Cost Averaging)**는 전통적인 분할매수(DCA) 전략을 개선한 투자 방법론입니다. 고점 대비 하락률을 기준으로 매수 구간을 설정하고, 각 구간별로 다른 수량을 매수하여 평균 단가를 효과적으로 낮출 수 있습니다.

### 핵심 기능

- 고점 대비 하락률 기반 매수 가격 자동 계산
- 투자 강도(Strength) 조절로 구간별 매수 수량 최적화
- 한국 주식 호가 단위 자동 적용
- 목표 예산에 맞춘 파라미터 자동 조정 (Auto-Fit)
- 100점 만점 펀더멘탈 등급 시스템
- 오프라인 지원 (IndexedDB)

---

## 기술 스택

### Core

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| Framework | React | 19.2.0 | UI 라이브러리 |
| Language | TypeScript | 5.9.3 | 타입 안전성 |
| Build | Vite | 7.2.4 | 빌드 도구 |

### UI & Styling

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| Styling | Tailwind CSS | 4.1.18 | 유틸리티 CSS |
| Animation | Framer Motion | 12.29.0 | UI 애니메이션 |
| Icons | Lucide React | 0.562.0 | 아이콘 라이브러리 |
| UI Components | Headless UI | 2.2.9 | 접근성 컴포넌트 |
| UI Components | React Aria | 1.14.0 | WAI-ARIA 컴포넌트 |

### State & Data

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| State | Zustand | 5.0.10 | 전역 상태 관리 |
| Database | Dexie (IndexedDB) | 4.2.1 | 클라이언트 로컬 DB |
| Router | React Router | 7.12.0 | SPA 라우팅 |

### Visualization & Export

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| Chart | Chart.js | 4.5.1 | 데이터 시각화 |
| Chart Binding | react-chartjs-2 | 5.3.1 | React Chart.js 바인딩 |
| Chart Plugin | chartjs-plugin-datalabels | 2.2.0 | 데이터 라벨 표시 |
| PDF | jsPDF | 4.0.0 | PDF 생성 |
| PDF Table | jspdf-autotable | 5.0.7 | PDF 테이블 |
| Excel | SheetJS (xlsx) | 0.18.5 | Excel 내보내기 |

### Development

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| Lint/Format | Biome | 1.9.4 | 코드 품질 |
| Test | Vitest | 4.0.18 | 단위 테스트 |
| Test Utils | Testing Library | 6.9.1 | DOM 테스트 유틸 |
| Deployment | Vercel | - | 서버리스 배포 |

---

## 프로젝트 구조

```
moonwave-mca-v3/
│
├── api/                              # Vercel Serverless Functions
│   └── stock/
│       ├── [ticker].ts               # 종목 기본 정보 API
│       └── search.ts                 # 종목 검색 API
│
├── src/
│   │
│   ├── components/
│   │   │
│   │   ├── dashboard/
│   │   │   └── Dashboard.tsx         # 메인 대시보드 (포트폴리오 목록)
│   │   │
│   │   ├── handbook/                 # 투자 핸드북 (MCA 전략 가이드)
│   │   │   ├── HandbookPanel.tsx     # 핸드북 패널
│   │   │   ├── HandbookModal.tsx     # 핸드북 모달
│   │   │   ├── HandbookAudio.tsx     # 오디오 가이드
│   │   │   ├── HandbookTypography.tsx # 타이포그래피
│   │   │   ├── DefinitionCard.tsx    # 정의 카드
│   │   │   ├── FormulaBox.tsx        # 수식 박스
│   │   │   ├── InfoBox.tsx           # 정보 박스
│   │   │   ├── StepCard.tsx          # 단계 카드
│   │   │   ├── SummaryCard.tsx       # 요약 카드
│   │   │   ├── EffortSection.tsx     # 노력 섹션
│   │   │   ├── EffortToggle.tsx      # 토글
│   │   │   ├── IconLabel.tsx         # 아이콘 라벨
│   │   │   ├── iconMap.ts            # 아이콘 매핑
│   │   │   ├── content/              # 핸드북 콘텐츠
│   │   │   │   ├── MCAProtocol.tsx   # MCA 프로토콜
│   │   │   │   ├── DCAProtocol.tsx   # DCA 프로토콜
│   │   │   │   ├── ZigZagProtocol.tsx # 지그재그 프로토콜
│   │   │   │   ├── MCAUserGuide.tsx  # 사용자 가이드
│   │   │   │   ├── MIP.tsx           # MIP
│   │   │   │   ├── MoonwaveDefinition.tsx  # Moonwave 정의
│   │   │   │   └── MoonyouDefinition.tsx   # Moonyou 정의
│   │   │   ├── constants/
│   │   │   │   └── handbookContent.ts # 핸드북 콘텐츠 상수
│   │   │   └── components/
│   │   │       └── index.tsx         # 공통 컴포넌트
│   │   │
│   │   ├── layout/                   # 레이아웃 컴포넌트
│   │   │   ├── Header.tsx            # 상단 헤더 (검색, 알림)
│   │   │   ├── Sidebar.tsx           # 좌측 사이드바 (데스크톱)
│   │   │   ├── MobileNav.tsx         # 모바일 네비게이션 드로어
│   │   │   ├── Footer.tsx            # 하단 푸터
│   │   │   ├── PageContainer.tsx     # 페이지 컨테이너
│   │   │   ├── SettingsModal.tsx     # 설정 모달
│   │   │   ├── TermsModal.tsx        # 이용약관 모달
│   │   │   ├── TermsData.ts          # 이용약관 데이터
│   │   │   ├── FAQModal.tsx          # FAQ 모달
│   │   │   ├── MusicPlayer.tsx       # 배경 음악 플레이어
│   │   │   └── index.ts              # 레이아웃 내보내기
│   │   │
│   │   ├── portfolio/                # 포트폴리오 상세
│   │   │   ├── PortfolioDetail.tsx   # 포트폴리오 상세 페이지
│   │   │   ├── ParameterEditor.tsx   # MCA 파라미터 편집기
│   │   │   ├── TradeTable.tsx        # 매매 리스트 테이블 (데스크톱)
│   │   │   ├── TradeCard.tsx         # 매매 카드 (모바일)
│   │   │   ├── MCAChart.tsx          # MCA 차트 (Chart.js)
│   │   │   ├── ExitSimulator.tsx     # 목표가 시뮬레이터
│   │   │   ├── FundamentalGradeInput.tsx   # 펀더멘탈 등급 입력
│   │   │   ├── FundamentalGradeDisplay.tsx # 펀더멘탈 등급 표시
│   │   │   ├── StockQuickBar.tsx     # 종목 검색 결과 바
│   │   │   └── index.ts              # 포트폴리오 내보내기
│   │   │
│   │   ├── settings/
│   │   │   └── Settings.tsx          # 설정 페이지
│   │   │
│   │   ├── ui/                       # 공통 UI 컴포넌트
│   │   │   ├── Badge.tsx             # 배지
│   │   │   ├── Button.tsx            # 버튼
│   │   │   ├── Card.tsx              # 카드
│   │   │   ├── Dialog.tsx            # 다이얼로그
│   │   │   ├── Input.tsx             # 입력 필드
│   │   │   ├── Select.tsx            # 셀렉트박스
│   │   │   ├── Skeleton.tsx          # 스켈레톤 로딩
│   │   │   ├── StockLogo.tsx         # 종목 로고
│   │   │   ├── StockSearchInput.tsx  # 종목 검색 입력
│   │   │   ├── Toast.tsx             # 토스트 알림
│   │   │   ├── Tooltip.tsx           # 툴팁
│   │   │   ├── NotificationDropdown.tsx # 알림 드롭다운
│   │   │   └── index.ts              # UI 내보내기
│   │   │
│   │   └── ErrorBoundary.tsx         # 에러 경계
│   │
│   ├── services/                     # 비즈니스 로직 레이어
│   │   ├── calculation.ts            # MCA 계산 엔진 (핵심)
│   │   ├── database.ts               # IndexedDB (Dexie) 연동
│   │   ├── fundamentalGrade.ts       # 펀더멘탈 등급 계산 (100점)
│   │   ├── stockApi.ts               # 주식 API 클라이언트
│   │   ├── export.ts                 # PDF/Excel/CSV 내보내기
│   │   ├── backup.ts                 # 백업/복원 서비스
│   │   ├── migration.ts              # v2 → v3 데이터 마이그레이션
│   │   ├── broadcast.ts              # 크로스탭 동기화
│   │   ├── clipboard.ts              # 클립보드 파싱
│   │   ├── share.ts                  # 공유 기능 (Web Share API)
│   │   ├── analytics.ts              # 사용 통계 분석
│   │   └── index.ts                  # 서비스 내보내기
│   │
│   ├── stores/                       # Zustand 상태 관리
│   │   ├── portfolioStore.ts         # 포트폴리오 CRUD 및 거래 상태
│   │   ├── settingsStore.ts          # 설정 상태
│   │   ├── notificationStore.ts      # 알림 상태
│   │   ├── uiStore.ts                # UI 상태 (모달, 로딩 등)
│   │   └── audioStore.ts             # 오디오 상태
│   │
│   ├── hooks/                        # 커스텀 훅
│   │   ├── useBroadcast.ts           # 크로스탭 동기화
│   │   ├── useClipboard.ts           # 클립보드 조작
│   │   ├── useExport.ts              # 내보내기 기능
│   │   ├── useMediaQuery.ts          # 반응형 미디어 쿼리
│   │   ├── useShare.ts               # 공유 기능
│   │   ├── useStockFundamental.ts    # 종목 기본 정보 조회
│   │   ├── useTermsController.ts     # 이용약관 컨트롤
│   │   └── index.ts                  # 훅 내보내기
│   │
│   ├── types/                        # TypeScript 타입 정의
│   │   ├── index.ts                  # 메인 타입 정의
│   │   │                             # - Portfolio, PortfolioParams
│   │   │                             # - Trade, TradeStatus, CalculatedTrade
│   │   │                             # - Settings, ThemeMode, ColorPalette
│   │   │                             # - FundamentalInput, FundamentalResult
│   │   │                             # - BackupFile, ShareData, Notification
│   │   ├── ui.ts                     # UI 관련 타입
│   │   ├── jspdf.d.ts                # jsPDF 타입 확장
│   │   └── xlsx.d.ts                 # xlsx 타입 확장
│   │
│   ├── utils/                        # 유틸리티 함수
│   │   ├── constants.ts              # 앱 상수 정의
│   │   │                             # - DEFAULT_PORTFOLIO_PARAMS
│   │   │                             # - COLOR_PALETTES
│   │   │                             # - CHART_CONFIG
│   │   │                             # - FUNDAMENTAL_GRADE_CONFIG
│   │   ├── format.ts                 # 숫자/통화 포맷팅
│   │   ├── format.test.ts            # 포맷 테스트
│   │   ├── tick.ts                   # 호가 단위 계산
│   │   ├── texts.ts                  # UI 텍스트 상수
│   │   └── cn.ts                     # 클래스명 병합 (clsx)
│   │
│   ├── data/
│   │   └── stockBlogUrls.ts          # 종목별 블로그 URL
│   │
│   ├── assets/                       # 정적 자산 (폰트, 이미지)
│   ├── test/
│   │   └── setup.ts                  # 테스트 설정
│   │
│   ├── App.tsx                       # 메인 앱 컴포넌트
│   ├── router.tsx                    # 라우터 설정 (React Router)
│   ├── main.tsx                      # 앱 진입점
│   └── index.css                     # 글로벌 스타일 (Tailwind)
│
├── public/                           # 정적 파일
│   ├── audios/                       # 핸드북 오디오
│   ├── music/                        # 배경 음악
│   └── videos/                       # 비디오 자산
│
├── dist/                             # 빌드 출력
│
├── biome.json                        # Biome 설정
├── vite.config.ts                    # Vite 설정 (청크 분리)
├── vitest.config.ts                  # Vitest 설정
├── vercel.json                       # Vercel 배포 설정
├── tsconfig.json                     # TypeScript 설정
├── tsconfig.app.json                 # 앱 TypeScript 설정
├── tsconfig.node.json                # Node TypeScript 설정
├── knip.json                         # 미사용 코드 분석
├── index.html                        # HTML 템플릿
└── package.json                      # 의존성 및 스크립트
```

---

## 주요 기능

### 1. MCA 계산 엔진

분할매수 전략의 핵심 계산을 담당합니다.

```typescript
// 주요 함수
calculateTrades(params, orderedSteps, executedSteps)  // 전체 매매 리스트 계산
calculatePortfolioStats(params, orderedSteps, executedSteps)  // 포트폴리오 통계
calculateSimulation(amount, qty, targetPrice)  // 수익률 시뮬레이션
autoFitParams(peakPrice, startDrop, steps, targetBudget)  // 파라미터 자동 조정
```

**계산 로직:**
- 구간별 매수가 = 고점가격 × (1 - 하락률/100)
- 구간별 수량 = strength × 2^(step-1) (기하급수적 증가)
- 호가 단위 자동 적용 (한국 주식 규칙)

### 2. 포트폴리오 관리

| 기능 | 설명 |
|------|------|
| 생성 | 종목 검색 후 자동 생성 또는 수동 생성 |
| 편집 | 이름, 파라미터, 메모 수정 |
| 삭제 | 포트폴리오 및 관련 거래 데이터 삭제 |
| 즐겨찾기 | 우선 표시 설정 |
| 기보유 관리 | 최대 3개 항목의 기존 보유 주식 등록 |

### 3. 매매 추적

| 상태 | 설명 |
|------|------|
| 대기 (Pending) | 아직 주문하지 않은 구간 |
| 주문 (Ordered) | 주문 완료, 체결 대기 중 |
| 체결 (Executed) | 체결 완료 |

- 구간별 주문/체결 토글
- 체결일 기록
- 구간별 메모
- 괴리율 경고 (주문-체결 간 3구간 초과 시)

### 4. Fundamental Grade 시스템

100점 만점의 펀더멘탈 평가 시스템입니다.

#### 평가 카테고리

| 카테고리 | 배점 | 항목 |
|----------|------|------|
| 가치평가 | 35점 | PER(15), PBR(15), 이중상장(5) |
| 성장성/Moat | 40점 | 글로벌 확장성(20), 시장 지배력(10), 미래 투자(10) |
| 주주환원 | 25점 | TSR(15), 거버넌스 리스크(10) |

#### 등급 체계

| 등급 | 점수 | 의미 |
|------|------|------|
| S | 85+ | Global Top Pick |
| A | 70+ | 매수 (Buy) |
| B | 50+ | 관망/보유 (Hold) |
| C | 0+ | 매수 금지 (Avoid) |

### 5. Exit 시뮬레이터

목표가 기반 수익률을 미리 계산합니다.

- MA120 가격 × 배수로 자동 목표가 설정
- 수동 목표가 입력 지원
- 예상 수익률 및 수익금 계산

### 6. 차트 시각화

Chart.js 기반 MCA 차트를 제공합니다.

- 구간별 매수가 라인 차트
- 체결 구간 하이라이트 (원형 마커)
- 평단가 수평선
- 데이터 라벨 표시

### 7. 내보내기

| 형식 | 설명 |
|------|------|
| JSON | 전체 백업 (포트폴리오, 거래, 설정) |
| CSV | 매매 리스트 (BOM 포함, 한글 Excel 호환) |
| Excel | 다중 시트 (요약, 매매리스트, 분석) |
| PDF | 리포트 (파라미터, 차트, 매매리스트) |
| Print | HTML 인쇄용 페이지 |

### 8. 백업/복원

- JSON 형식 백업 파일 생성
- 버전 호환성 검증
- v2 데이터 자동 마이그레이션
- 백업 알림 (30일 경과 시)

### 9. 알림 시스템

| 유형 | 설명 |
|------|------|
| 괴리율 경고 | 주문-체결 간 3구간 초과 |
| 백업 알림 | 마지막 백업 후 30일 경과 |
| 등급 변경 | 펀더멘탈 등급 변경 감지 |

### 10. 크로스탭 동기화

BroadcastChannel API를 활용하여 다중 탭 간 실시간 데이터 동기화를 지원합니다.

### 11. 테마 & 컬러 팔레트

- 테마: Light / Dark / System
- 컬러 팔레트: Mint, Ocean, Rose, Purple, Forest

---

## API 엔드포인트

Vercel Serverless Functions로 구현된 API입니다.

### 종목 기본 정보 조회

```
GET /api/stock/:ticker
```

**Parameters:**
- `ticker` (path): 6자리 종목코드

**Response:**
```typescript
interface StockFundamentalData {
  ticker: string;
  name: string;
  market: 'KOSPI' | 'KOSDAQ';
  per: number | null;
  pbr: number | null;
  dividendYield: number | null;
  eps: number | null;
  bps: number | null;
  dps: number | null;
  currentPrice: number | null;
  marketCap: number | null;
  fetchedAt: string;
}
```

### 종목 검색

```
GET /api/stock/search?q=:query&limit=:limit
```

**Parameters:**
- `q` (query): 검색어 (종목명 또는 종목코드)
- `limit` (query, optional): 최대 결과 수 (기본값: 10)

**Response:**
```typescript
interface StockSearchResponse {
  query: string;
  count: number;
  results: {
    ticker: string;
    name: string;
    market: 'KOSPI' | 'KOSDAQ';
  }[];
}
```

---

## 시작하기

### 요구사항

- Node.js 18+
- npm 9+

### 설치

```bash
# 저장소 클론
git clone https://github.com/your-org/moonwave-mca.git
cd moonwave-mca/moonwave-mca-v3

# 의존성 설치
npm install
```

### 개발 서버

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

### 빌드

```bash
npm run build
```

### 미리보기

```bash
npm run preview
```

---

## 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 실행 (localhost:3000) |
| `npm run build` | 프로덕션 빌드 (tsc + vite build) |
| `npm run preview` | 빌드 결과물 미리보기 |
| `npm run lint` | Biome 코드 검사 |
| `npm run lint:fix` | Biome 자동 수정 |
| `npm run format` | 코드 포맷팅 |
| `npm run check` | lint + format 통합 |
| `npm run typecheck` | TypeScript 타입 검사 |
| `npm run test` | Vitest watch 모드 |
| `npm run test:run` | 테스트 단일 실행 |
| `npm run test:coverage` | 커버리지 리포트 |

---

## 환경 변수

```env
# API 베이스 URL (개발용, 선택)
VITE_API_BASE_URL=
```

---

## 배포

### Vercel (권장)

1. Vercel에 프로젝트 연결
2. Framework Preset: Vite
3. Build Command: `npm run build`
4. Output Directory: `dist`

### 수동 배포

```bash
npm run build
# dist/ 폴더를 정적 호스팅 서비스에 배포
```

---

## 아키텍처

### 상태 관리 (Zustand)

```
┌─────────────────┐
│   portfolioStore │  ← 포트폴리오, 거래 CRUD
├─────────────────┤
│   settingsStore  │  ← 테마, 컬러, 알림 설정
├─────────────────┤
│ notificationStore│  ← 알림 상태
├─────────────────┤
│     uiStore      │  ← 모달, 로딩, 검색 쿼리
├─────────────────┤
│    audioStore    │  ← 오디오 재생 상태
└─────────────────┘
```

### 데이터 흐름

```
User Action
    ↓
Component → Hook → Store → Service → Database (IndexedDB)
    ↓                                    ↓
   UI Update  ←──────────────────────── Persist
```

### 빌드 최적화 (Chunk Splitting)

```javascript
// vite.config.ts
manualChunks: {
  'react-vendor': ['react', 'react-dom'],
  'router': ['react-router-dom'],
  'chart': ['chart.js', 'react-chartjs-2', 'chartjs-plugin-datalabels'],
  'motion': ['framer-motion'],
  'headless': ['@headlessui/react'],
  'icons': ['lucide-react'],
  'aria': ['react-aria-components'],
  'db': ['dexie'],
  'state': ['zustand'],
}
```

---

## 브라우저 지원

| Browser | Version |
|---------|---------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

**필수 API:**
- IndexedDB
- BroadcastChannel
- Web Share API (선택)

---

## 라이선스

Private - Moonwave

---

## 링크

- **Production**: https://mca.moonwave.kr
- **Issues**: [GitHub Issues](https://github.com/your-org/moonwave-mca/issues)

---

© 2026 Moonwave. All rights reserved.
