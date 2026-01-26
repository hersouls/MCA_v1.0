# 02. Moonwave Standard Design System

> **Moonwave Design Language**를 정의하는 문서입니다.
> Tailwind CSS를 기반으로 한 디자인 토큰과 테마 시스템을 포함합니다.

---

## 1. 디자인 원칙 (Design Principles)

1.  **Immersive (몰입감)**: 사용자가 데이터에 집중할 수 있도록 불필요한 장식을 배제하고, 깊이감 있는 다크 모드를 기본으로 지원합니다.
2.  **Sophisticated (세련됨)**: 금융 서비스에 걸맞은 신뢰감 있는 컬러와 타이포그래피를 사용합니다.
3.  **Adaptive (적응형)**: 사용자의 선호(시스템 테마)와 디바이스 환경에 유연하게 반응합니다.

---

## 2. 황금비율 시스템 (Golden Ratio System)

Moonwave는 자연의 조화로운 비율인 **황금비 (φ = 1.618)**를 디자인의 핵심 수학적 원리로 사용합니다.

### 2.1 Layout Constants
```typescript
const GOLDEN_RATIO = 1.618;

const GOLDEN_LAYOUT = {
  MAIN: 61.8,  // Main Content Area
  SIDE: 38.2,  // Sidebar / Widget Area
} as const;
```

### 2.2 Typography Scale
- **Base**: 16px
- **Scale**: 1.618 (Major Sixth ~ Golden Ratio)

```typescript
const GOLDEN_TYPOGRAPHY = {
  BASE: 16,
  LG: 26,      // 16 * 1.618
  XL: 42,      // 26 * 1.618
  XXL: 68,     // 42 * 1.618
} as const;
```

### 2.3 Spacing System
```typescript
const GOLDEN_SPACING = {
  XS: 6,       // Base / φ²
  SM: 10,      // Base / φ
  MD: 16,      // Base
  LG: 26,      // Base * φ
  XL: 42,      // Base * φ²
} as const;
```

---

## 3. 컬러 시스템 (Color System)

Moonwave는 HSL 기반의 CSS 변수를 사용하여 **Themeable** 시스템을 구축합니다.

### 3.1 시맨틱 컬러 토큰 (Semantic Tokens)

| 토큰명 | 설명 | Tailwind Helper |
|--------|------|-----------------|
| `--background` | 앱 배경색 | `bg-background` |
| `--foreground` | 기본 본문 텍스트 | `text-foreground` |
| `--card` | 카드/패널 배경 | `bg-card` |
| `--primary` | 브랜드/강조 색상 (Action) | `bg-primary` |
| `--muted` | 비활성/보조 텍스트 | `text-muted-foreground` |
| `--border` | 경계선 | `border-border` |
| `--destructive` | 삭제/경고/하락(파랑) | `bg-destructive` |
| `--positive` | 상승/수익(빨강) | `text-positive` |

### 3.2 표준 테마 팔레트 (Standard Palettes)

Moonwave 패키지는 기본적으로 5가지 테마를 내장해야 합니다.

#### [Default] Luxury Beauty (Dark Teal & Gold)
고급스러운 기본 테마입니다.
- **Primary**: Emerald Green (`#50C878`)
- **Accent**: Gold (`#CBA135`)
- **Background**: Near Black (`#121212`)

#### [Option] Sustainability & Healing (Sage & Earth)
편안한 눈을 위한 자연주의 테마입니다.
- **Primary**: Sage Green (`#B2AC88`)
- **Secondary**: Dark Olive (`#556B2F`)

#### [Option] Elegant / Neutral (Sage & Beige)
우아하고 차분한 지적 감성입니다.
- **Primary**: Sage Green (`#A9BA9D`)
- **Accent**: Beige (`#E6D7B9`)
- **Background**: Light Gray (`#ECECEB`)

#### [Option] Trendy & Sophisticated (Neon Mint & Jade)
현대적이고 세련된 하이패션 감성입니다.
- **Primary**: Neon Mint (`#2EFFB4`)
- **Secondary**: Jade Green (`#00A86B`)
- **Background**: Off White (`#EDECE8`) / Black (`#030303`)

#### [Option] Traditional Luxury (British Green & Gold)
클래식하고 전통적인 럭셔리 감성입니다.
- **Primary**: British Racing Green (`#004225`)
- **Secondary**: Hunter Green (`#355E3B`)
- **Accent**: Gold (`#D4AF37`)

*(상세 CSS 변수 값은 `tailwind.config.ts` 및 `index.css` 참조)*

---

## 4. 타이포그래피 (Typography)

**Pretendard** 폰트를 표준으로 사용합니다.

- **Display**: 숫자 데이터, 수익률 등 강조가 필요한 곳 (Font Weight 700)
- **Body**: 가독성을 최우선으로 함 (Font Weight 400/500)
- **Mono**: 코드, ID, 정밀한 숫자 표기 시 사용 (JetBrains Mono 등)

---

## 5. UI 컴포넌트 표준 (Component Standards)

### A. Cards (카드)
- **Shape**: `rounded-[10px]` (Golden SM) 또는 `rounded-[16px]` (Golden MD/Base) 권장.
- **Elevation**: 다크 모드에서는 Shadow 대신 **Border** (`border-white/10`)를 사용하여 깊이감을 줍니다.

### B. Inputs (입력 필드)
- **Height**: 모바일 터치 타겟과 황금비를 고려하여 `h-[42px]` (Golden XL) 사용.
- **State**: Focus 시 `--ring` 컬러로 2px Outline 표시.

### C. Charts (차트)
- **Library**: `Chart.js` 또는 `Recharts`.
- **Palette**: 차트 색상은 반드시 현재 테마의 `--primary`, `--secondary` 변수를 참조하여 동적으로 변경되어야 합니다.

---

## 6. Tailwind Configuration (참조)

표준 `tailwind.config.ts` 설정 예시입니다.

```typescript
export default {
  darkMode: ["class"],
  theme: {
    extend: {
      // Golden Ratio System Implementation
      spacing: {
        'golden-xs': '6px',
        'golden-sm': '10px',
        'golden-md': '16px',
        'golden-lg': '26px',
        'golden-xl': '42px',
        'golden-xxl': '68px',
      },
      fontSize: {
        'golden-base': '16px',
        'golden-lg': '26px',
        'golden-xl': '42px',
        'golden-xxl': '68px',
      },
      borderRadius: {
        'golden-sm': '10px', // Matches Golden Spacing SM
        'golden-md': '16px', // Matches Golden Spacing MD
      },
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        card: {
            DEFAULT: "hsl(var(--card))",
            foreground: "hsl(var(--card-foreground))",
        },
        // ... 기타 토큰
      },
      fontFamily: {
        sans: ["Pretendard", "sans-serif"],
      }
    },
  },
}
```
