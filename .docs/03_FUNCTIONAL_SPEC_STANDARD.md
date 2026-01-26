# 03. Moonwave Standard Functional Spec

> **Moonwave Web Service**의 핵심 비즈니스 로직과 기능 명세서입니다.
> MCA v3의 계산 로직을 포함하여 범용적인 웹 서비스 기능을 정의합니다.

---

## 1. 기능 모듈 (Functional Modules)

### Module 01: Portfolio Management (포트폴리오 관리)
- **생성 (Create)**: 기본값(Default Preset)으로 초기화된 새 포트폴리오 생성.
- **조회 (Read)**: 전체 리스트(Dashboard) 및 단일 상세(Detail) 조회.
- **수정 (Update)**: 파라미터(고점, 강도 등) 실시간 수정 및 자동 재계산.
- **삭제 (Delete)**: 영구 삭제 (복구 불가 경고 포함).
- **복제 (Duplicate)**: 기존 포트폴리오의 설정을 복사하여 신규 생성.

### Module 02: Data Persistence (데이터 영속성)
- **Auto-Save**: 사용자 입력(Input Blur) 즉시 IndexedDB에 비동기 저장.
- **Versioning**: 데이터 스키마 버전 관리 및 마이그레이션 로직 포함.

---

## 2. 핵심 로직 (Core Logic: MCA v3)

### 2.1 분할 매수 계산 (Legacy Logic Migration)

사용자가 설정한 파라미터를 기반으로 매수 스케줄을 생성합니다.

**Input Parameters:**
- `P_peak` (기준 고점, KRW/USD)
- `R_drop_start` (하락 시작률, %)
- `N_steps` (분할 횟수, int)
- `F_strength` (투자 강도, float 1.0~2.0)
- `M_total` (총 예산)

**Algorithm (Pseudocode):**

```typescript
function calculateSchedule(params) {
  const schedule = [];
  
  // 1. 차수별 하락률 간격 계산 (선형/지수 선택 가능)
  // v3 Standard: 균등 분할 혹은 강도에 따른 가중 분할
  const dropInterval = (MAX_DROP - params.startDrop) / params.steps;

  for (let i = 1; i <= params.steps; i++) {
    // 2. 목표 가격 계산
    const targetDrop = params.startDrop + (dropInterval * i);
    const targetPrice = params.peakPrice * (1 - targetDrop);
    
    // 3. 투자 비중 계산 (강도 적용)
    // Strength가 높을수록 초반 비중이 낮고 후반 비중이 높음 (보수적) or 반대 설정
    const weight = Math.pow(i, params.strength); 
    
    schedule.push({ step: i, price: targetPrice, weight: weight });
  }

  // 4. 수량 및 금액 배분 (Normalizing)
  const totalWeight = schedule.reduce((sum, item) => sum + item.weight, 0);
  
  return schedule.map(item => ({
    ...item,
    amount: (item.weight / totalWeight) * params.totalBudget
    quantity: Math.floor(item.amount / item.price) // 주식 단위 절사
  }));
}
```

### 2.2 괴리율 계산 (Disparity)
현재가와 다음 매수 목표가와의 거리비율을 계산합니다.

`Gap(%) = (CurrentPrice - NextTargetPrice) / NextTargetPrice * 100`

---

## 3. 데이터 동기화 표준 (Sync Standard)

### 3.1 Import / Export Logic
- **Export**: 전체 DB를 `JSON` 문자열로 변환 -> `Blob` 생성 -> 다운로드 트리거.
- **Import**:
    1. 파일 선택 및 `FileReader`로 JSON 파싱.
    2. 유효성 검사 (Schema Validation).
    3. 충돌 처리 전략 (Merge or Overwrite) 사용자 선택.

### 3.2 백업 알림
- 마지막 백업(Export) 이후 30일 경과 시 "데이터 백업 권장" 알림 표시.

---

## 4. 예외 처리 (Error Handling)

- **유효하지 않은 숫자**: `NaN` 또는 음수 입력 시 `0` 또는 `이전 값`으로 Fallback.
- **스토리지 할당량 초과**: `QuotaExceededError` 발생 시 오래된 로그 데이터 자동 정리 제안.
