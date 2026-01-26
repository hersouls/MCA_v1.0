# Moonwave MCA v3.0

분할매수 전략(Modified Cost Averaging)을 체계적으로 관리하는 투자 도구

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 19, TypeScript 5.9 |
| Styling | Tailwind CSS 4, Framer Motion |
| State | Zustand 5 |
| Database | Dexie (IndexedDB) |
| Build | Vite 7 |
| Lint/Format | Biome |
| Test | Vitest |

## Project Structure

```
moonwave-mca-v3/
├── src/
│   ├── components/
│   │   ├── dashboard/     # 대시보드
│   │   ├── handbook/      # 투자 핸드북
│   │   ├── layout/        # Header, Sidebar, Footer
│   │   ├── portfolio/     # 포트폴리오 상세
│   │   ├── settings/      # 설정
│   │   └── ui/            # 공통 UI 컴포넌트
│   ├── services/          # 비즈니스 로직
│   │   ├── calculation.ts # MCA 계산 엔진
│   │   ├── database.ts    # IndexedDB 연동
│   │   ├── fundamentalGrade.ts # 펀더멘탈 등급
│   │   └── stockApi.ts    # 주식 API
│   ├── stores/            # Zustand 상태관리
│   ├── hooks/             # Custom Hooks
│   ├── utils/             # 유틸리티
│   └── types/             # TypeScript 타입
├── api/                   # Vercel Serverless API
└── public/                # 정적 자산
```

## Features

- **포트폴리오 관리**: 다중 포트폴리오 생성/편집/삭제
- **MCA 계산**: 분할매수 구간별 가격/수량/금액 자동 계산
- **매매 추적**: 주문/체결 상태 관리
- **펀더멘탈 등급**: 밸류에이션/주주환원/성장성 기반 A~D 등급
- **시뮬레이션**: 목표가 기반 수익률 시뮬레이션
- **차트 시각화**: Chart.js 기반 MCA 차트
- **PDF/Excel 내보내기**: 포트폴리오 리포트 생성
- **오프라인 지원**: IndexedDB 기반 로컬 저장

## Scripts

```bash
npm run dev        # 개발 서버 (localhost:3000)
npm run build      # 프로덕션 빌드
npm run lint       # Biome 검사
npm run lint:fix   # Biome 자동 수정
npm run format     # 코드 포맷팅
npm run test       # 테스트 실행
npm run typecheck  # 타입 검사
```

## Deployment

- **Production**: https://mca.moonwave.kr
- **Platform**: Vercel

---

© 2026 Moonwave
