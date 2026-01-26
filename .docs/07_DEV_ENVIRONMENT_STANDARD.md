# 07. Moonwave Dev Environment Standard

> **Development Standard & Convention**
> Moonwave 웹 서비스 개발을 위한 표준 환경 설정 및 컨벤션 가이드입니다.

---

## 1. 기술 스택 (Tech Stack)

| 구분 | 기술 | 버전 | 비고 |
|------|------|------|------|
| **Runtime** | Node.js | v20+ | LTS 버전 권장 |
| **Framework** | React | v18.3+ | Functional Component + Hooks |
| **Language** | TypeScript | v5.0+ | Strict Mode 필수 |
| **Build** | Vite | v5.0+ | SWC 컴파일러 활용 |
| **Style** | Tailwind CSS | v3.4+ | CSS Modules 지양 |

---

## 2. 프로젝트 구조 (Project Structure)

Moonwave 표준 디렉토리 구조입니다.

```
/
├── .docs/                  # 표준 문서 패키지
├── public/                 # 정적 에셋 (favicon, manifest.json)
├── src/
│   ├── api/                # 외부 API 연동 (Zero-Server 원칙상 최소화)
│   ├── assets/             # 이미지, 폰트
│   ├── components/         # 리액트 컴포넌트
│   │   ├── common/         # 재사용 가능한 공통 컴포넌트 (Button, Modal)
│   │   ├── layout/         # 레이아웃 컴포넌트 (Header, Footer)
│   │   └── features/       # 기능별 컴포넌트 (PortfolioCard, TradeTable)
│   ├── hooks/              # 커스텀 훅 (비즈니스 로직 분리)
│   ├── services/           # 순수 로직 및 DB 서비스 (storage.ts, calc.ts)
│   ├── stores/             # 전역 상태 관리 (Zustand)
│   ├── types/              # TypeScript 타입 정의
│   ├── utils/              # 유틸리티 함수
│   ├── App.tsx             # 루트 컴포넌트
│   └── main.tsx            # 엔트리 포인트
├── .gitignore
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

---

## 3. 코딩 컨벤션 (Coding Conventions)

### 3.1 네이밍 (Naming)
- **컴포넌트**: `PascalCase` (예: `PortfolioCard.tsx`)
- **훅**: `useCamelCase` (예: `usePortfolio.ts`)
- **함수/변수**: `camelCase`
- **상수**: `UPPER_SNAKE_CASE`
- **타입/인터페이스**: `PascalCase` (Interface 접두사 `I` 사용 금지)

### 3.2 컴포넌트 작성 규칙
- **Functional Component**: 화살표 함수 대신 `function` 키워드 사용 권장 (디버깅 용이).
- **Props**: 인터페이스로 분리하여 정의.
- **Export**: `export default` 지양하고 `Named Export` 권장 (리팩토링 용이).

```typescript
// Good
export function MyComponent({ title }: MyComponentProps) {
  return <div>{title}</div>;
}
```

---

## 4. Git 워크플로우 (Git Strategy)

- **Branch**: `main` (Production), `develop` (Dev), `feature/*` (New Feature)
- **Commit Message**: [Conventional Commits](https://www.conventionalcommits.org/) 준수.
    - `feat`: 새로운 기능 추가
    - `fix`: 버그 수정
    - `docs`: 문서 수정
    - `style`: 코드 포맷팅 (로직 변경 없음)
    - `refactor`: 코드 리팩토링
