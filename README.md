# Moonwave MCA v3.0

분할매수 전략 관리 도구 (Modified Cost Averaging)

## Features

- **대시보드**: 통합 자금 현황 및 포트폴리오 리스트
- **개별 종목 관리**: 파라미터 설정, MCA 계산, 주문/체결 추적
- **시각화**: 평단가 방어선 차트, 괴리율 곡선
- **시뮬레이션**: 목표 매도 수익률 계산
- **다크 모드**: 시스템 설정 연동 및 수동 토글

## Tech Stack

- HTML5 / CSS3 / JavaScript
- Tailwind CSS (CDN)
- Chart.js
- LocalStorage (데이터 저장)

## Deployment

GitHub Pages에서 자동 배포됩니다.

- **URL**: https://mca.moonwave.kr
- **Branch**: main

## DNS Setup

도메인 관리자에서 다음 설정이 필요합니다:

```
Type: CNAME
Host: mca
Value: hersouls.github.io
```

또는 A 레코드:

```
Type: A
Host: mca
Value: 185.199.108.153
       185.199.109.153
       185.199.110.153
       185.199.111.153
```

## License

Private - Moonwave
