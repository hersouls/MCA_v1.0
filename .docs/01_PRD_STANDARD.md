# 01. Moonwave Standard PRD (Product Requirement Document)

> **Moonwave Web Service Standard**에 기반한 제품 요구사항 정의서입니다.
> 이 템플릿은 모든 Moonwave 웹 서비스 프로젝트의 기획 표준으로 사용됩니다.

---

## 1. 제품 비전 (Product Vision)

### 1.1 표준 비전 (Standard Vision)
Moonwave의 모든 웹 서비스는 **"사용자 주권(User Sovereignty)"**과 **"언제 어디서나(Anywhere Access)"**를 지향합니다.
- **Privacy-First**: 내 데이터는 내 기기에만 저장됩니다. (Serverless)
- **Offline-First**: 인터넷이 끊겨도 서비스는 멈추지 않습니다.
- **Ownership**: 데이터의 생성, 조회, 백업, 삭제의 권한은 전적으로 사용자에게 있습니다.

### 1.2 MCA v3.0 비전 (Project Vision)
불확실한 시장에서 투자자의 심리를 배제하고, 수학적/기계적 분할 매수 전략을 통해 **"잃지 않는 투자"**를 실현하는 개인화된 자산 배분 도구를 제공합니다.

---

## 2. 사용자 페르소나 (User Personas)

### Primary Persona: "The Strategic Investor"
- **특징**: 감에 의한 뇌동매매를 피하고 싶어함. 엑셀로 매매 일지를 기록하지만 모바일 접근성이 불편해함.
- **나즈(Needs)**: 스마트폰으로 언제든 포트폴리오 상태를 확인하고, 미리 계산된 가격에 주문을 넣고 싶음.

---

## 3. 핵심 요구사항 (Key Requirements)

### 3.1 시스템 품질 요구사항 (Moonwave Standard)

| ID | 구분 | 요구사항 상세 | 구현 기술 |
|----|------|---------------|-----------|
| **NFR-01** | **PWA 지원** | 홈 화면 설치 가능, 스플래시 스크린, 전체 화면 모드 지원 | `manifest.json`, Service Worker |
| **NFR-02** | **오프라인 동작** | 인터넷 연결 없이 앱 로딩 및 데이터 CRUD 가능 | Service Worker Cache, IndexedDB |
| **NFR-03** | **로컬 저장소** | 서버 없이 브라우저 내 대용량 데이터(50MB+) 저장 | Dexie.js (IndexedDB) |
| **NFR-04** | **데이터 소유권** | JSON/Excel 포맷으로 전체 데이터 내보내기/가져오기 지원 | `file-saver`, `xlsx` |
| **NFR-05** | **반응형 UI** | 모바일, 태블릿, 데스크탑 등 모든 뷰포트 최적화 | Tailwind CSS Breakpoints |

### 3.2 기능 요구사항 (MCA v3.0 Specific)

#### A. 포트폴리오 관리 (Portfolio Management)
- **REQ-A01**: 사용자는 다수의 포트폴리오를 생성할 수 있어야 한다.
- **REQ-A02**: 각 포트폴리오는 고점, 투자 강도, 하락 시작률 등 고유 파라미터를 갖는다.
- **REQ-A03**: 대시보드에서 모든 포트폴리오의 요약 정보(진행률, 투자금, 평가손익)를 볼 수 있어야 한다.

#### B. MCA 계산 및 시뮬레이션 (Calculation Engine)
- **REQ-B01**: 입력된 파라미터에 따라 N차 분할 매수 가격과 수량을 자동 계산해야 한다.
- **REQ-B02**: '평단가 방어선' 차트를 통해 각 차수별 체결 시 예상 평단가를 시각화해야 한다.
- **REQ-B03**: 실시간 주가 입력 시 '괴리율'을 계산하여 추가 매수 신호를 제공해야 한다.
- **REQ-B04**: 목표 수익률 도달 시 매도 가이드(수익 실현, 0.5매도 등)를 제공해야 한다.

#### C. 매매 추적 (Trade Tracking)
- **REQ-C01**: 각 차수별 주문 상태(대기 -> 주문중 -> 체결)를 관리할 수 있어야 한다.
- **REQ-C02**: 부분 체결 및 수동 수량 조정을 지원해야 한다.
- **REQ-C03**: 매매별 메모 기능을 제공해야 한다.

---

## 4. 데이터 전략 (Data Strategy)

Moonwave Standard는 **Local-First** 아키텍처를 따릅니다.

- **Storage**: `IndexedDB`를 메인 스토리지로 사용 (Dexie.js 래퍼 사용 권장).
- **Migration**: 구 버전(v2 LocalStorage) 데이터 감지 시 v3(IndexedDB)로 자동 마이그레이션.
- **Backup**: 사용자가 수동으로 수행하는 JSON 백업 파일이 유일한 원격 복구 수단임.

---

## 5. 성공 지표 (Success Metrics)

- **Lighthouse Performance Score**: 95점 이상 (모바일 기준).
- **Offline Capability**: 비행기 모드에서 앱 재실행 및 쓰기 작업 성공 100%.
- **Install Rate**: 웹 방문 대비 홈 화면 설치 비율 추적 (GA4).
