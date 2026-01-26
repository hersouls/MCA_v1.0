# 06. Moonwave Data Architecture Standard

> **Offline-First Data Strategy**
> Moonwave 웹 서비스는 서버 없이 동작하며, 모든 데이터는 사용자 브라우저에 저장됩니다.

---

## 1. 데이터 원칙 (Data Principles)

1.  **Zero-Server**: 백엔드 API 의존성을 완전히 제거합니다.
2.  **Browser Native**: `IndexedDB`를 주 저장소로 사용하고, `LocalStorage`는 설정 저장용으로 보조합니다.
3.  **User Ownership**: 데이터는 JSON/Excel 파일 형태로 사용자가 원할 때 언제든 소유(Export)할 수 있습니다.

---

## 2. 데이터베이스 스키마 (Database Schema)

**Dexie.js**를 사용한 IndexedDB 스키마 정의입니다.

### 2.1 MCA v3 Models

```typescript
// Dexie Store Definition
db.version(1).stores({
  portfolios: '++id, name, isFavorite, updatedAt',
  trades: '++id, portfolioId, step, status, executedAt',
  settings: 'key'
});

// Interfaces
interface Portfolio {
  id?: number;
  name: string;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // MCA Parameters (JSON Field)
  params: {
    peakPrice: number;    // 기준 고점
    strength: number;     // 투자 강도 (1.0 ~ 2.0)
    startDrop: number;    // 하락 시작률 (0.1 ~ 0.5)
    steps: number;        // 분할 차수
    targetBudget: number; // 총 예산
  };
}

interface Trade {
  id?: number;
  portfolioId: number;    // Foreign Key -> Portfolio.id
  step: number;           // 차수 (1, 2, 3...)
  status: 'pending' | 'ordered' | 'executed';
  price: number;
  quantity: number;
  amount: number;
  executedAt?: Date;
  note?: string;
}
```

---

## 3. 데이터 동기화 및 백업 (Sync & Backup)

### 3.1 로컬 우선 저장 (Local-First Save)
사용자가 데이터를 수정하는 즉시 비동기로 DB에 반영합니다.

```typescript
// Auto-save hook example
const updatePortfolio = async (id, data) => {
  await db.portfolios.update(id, {
    ...data,
    updatedAt: new Date()
  });
};
```

### 3.2 파일 기반 백업 (File-Based Backup)
서버가 없으므로 파일 시스템을 이용한 백업이 필수적입니다.

- **Export Format**:
```json
{
  "version": "3.0.0",
  "data": {
    "portfolios": [...],
    "trades": [...]
  },
  "exportedAt": "2026-01-25T12:00:00Z"
}
```

---

## 4. 데이터 마이그레이션 (Migration Strategy)

### v2 (LocalStorage) -> v3 (IndexedDB)
앱 최초 실행 시 구 버전 데이터가 있는지 검사하여 자동 마이그레이션합니다.

1.  `localStorage.getItem('Moonwave_MCA_v2')` 체크.
2.  데이터 존재 시 파싱하여 v3 스키마로 변환 (`params` 구조 변경 등).
3.  `db.portfolios.bulkAdd()`로 일괄 저장.
4.  `localStorage.setItem('MIGRATION_COMPLETE', 'true')`로 플래그 설정.
