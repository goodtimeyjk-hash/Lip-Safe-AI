# [Design System] 개인 포트폴리오 웹사이트 & Lip-Safe AI UI/UX 디자인 가이드라인

| 항목 | 내용 |
| :--- | :--- |
| **프로젝트명** | 김영주 개인 포트폴리오 & Lip-Safe AI 엣지AI 기술 쇼케이스 웹사이트 |
| **문서 버전** | v1.0.0 |
| **작성자** | UI/UX 디자인 전문가 & 프론트엔드 리드 (김영주) |
| **프로젝트 폴더** | `portfolio` |
| **연관 문서** | [PRD 문서 (prd.md)](file:///c:/Users/goodt/Desktop/Lip-Safe%20AI/portfolio/prd.md) |
| **디자인 콘셉트** | Sleek Dark & Neon Rose Accent (Glassmorphism & High-Contrast Safety UI) |
| **최종 수정일** | 2026-08-08 |

---

## 1. 디자인 컨셉 및 브랜드 정체성 (Brand Identity)

### 1.1 메인 비주얼 테마: "Sleek Dark & Neon Rose Accent"
* **안전 & 위기 예방 (Safety Shield)**: 딥 네이비(#0F172A) 배경을 통해 밤길 및 클럽 환경에서의 몰입감과 안정성을 부여합니다.
* **Lip-Safe 브랜드 아이덴티티**: 립스틱 스틱을 상징하는 **로즈 마젠타(#E11D48)**와 엣지AI 연동을 상징하는 **세이프티 시안(#06B6D4)** 네온 글로우로 시각적 강렬함과 기술적 고급감을 전달합니다.

### 1.2 디자인 3대 원칙 (Design Pillars)
1. **Glassmorphic Layering (서리 유리 입체 레이어링)**
   * 서리 유리(Frost Glass, `backdrop-filter: blur(12px)`) 효과와 네온 글로우 보더를 적용하여 미니멀하면서도 차세대 스마트 앱의 신뢰감을 표현합니다.
2. **High-Contrast Data Visibility (고대비 직관적 데이터 시각화)**
   * 99.2% 판독 정확도, 0.3초 처리 속도, 5종 마약 감지 비교표(Table)를 고대비 네온 색상 칩과 굵은 서체로 0.1초 내 파악할 수 있게 가공합니다.
3. **Emergency Micro-Interactions (생동감 있는 비상 인터랙션)**
   * 112 원터치 자동 신고 시 펄스 파동(Pulse Animation), 위장 UI 스위칭 토글, 관리자 프로필 라이브 편집(CMS) 3D 반응으로 사용자 및 면접관 경험을 극대화합니다.

---

## 2. 디자인 토큰 및 CSS 변수 스키마 (Design Tokens)

프로젝트의 `css/variables.css` 또는 글로벌 스타일시트에 즉시 적용할 수 있는 CSS 변수 스펙입니다.

```css
:root {
  /* ==========================================================================
     1. Color Palette Tokens (컬러 파렛트)
     ========================================================================== */
  /* Brand Primary & Accents */
  --color-primary: #E11D48;         /* Lip-Safe Rose Magenta (메인 브랜드/스틱) */
  --color-primary-hover: #BE123C;
  --color-primary-glow: rgba(225, 29, 72, 0.4);

  --color-secondary: #06B6D4;       /* Safety Shield Cyan (엣지AI / 안전 기술) */
  --color-secondary-hover: #0891B2;
  --color-secondary-glow: rgba(6, 182, 212, 0.35);

  --color-accent-purple: #8B5CF6;   /* On-Device AI TFLite 연산 */
  --color-accent-gold: #F59E0B;     /* 조명 보정 및 주의 상태 */

  /* Neutral Background & Surface (Sleek Dark Theme) */
  --bg-app: #0F172A;                /* Deep Slate Navy (최상위 배경) */
  --bg-surface-card: #1E293B;       /* Dark Slate Card (카드/패널) */
  --bg-surface-elevated: #334155;   /* 모달/드롭다운 표면 */
  --bg-surface-glass: rgba(30, 41, 59, 0.75); /* Glassmorphism 반투명 */

  /* Status Colors */
  --color-success: #22C55E;         /* 감지 음성 / 완납 / 정상 연산 */
  --color-success-bg: rgba(34, 197, 94, 0.15);
  --color-danger: #EF4444;          /* 마약 반응 감지 / 112 긴급 신고 */
  --color-danger-bg: rgba(239, 68, 68, 0.2);
  --color-warning: #F59E0B;         /* 어두운 조명 보정 알림 */

  /* Text & Border Colors */
  --text-primary: #F8FAFC;          /* 메인 헤드라인/본문 (Off-White) */
  --text-secondary: #94A3B8;        /* 서브 라벨 및 설명 */
  --text-tertiary: #64748B;         /* 비활성 / 주석 텍스트 */
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-strong: rgba(255, 255, 255, 0.18);
  --border-glow-rose: rgba(225, 29, 72, 0.5);
  --border-glow-cyan: rgba(6, 182, 212, 0.5);

  /* ==========================================================================
     2. Typography Tokens (타이포그래피)
     ========================================================================== */
  --font-family-sans: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-family-mono: 'JetBrains Mono', monospace;

  /* ==========================================================================
     3. Elevation & Glass Effect (그림자 & 서리 유리)
     ========================================================================== */
  --backdrop-blur: blur(12px);
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.2);
  --shadow-md: 0 4px 14px rgba(0, 0, 0, 0.35);
  --shadow-lg: 0 12px 32px rgba(0, 0, 0, 0.5);
  --shadow-neon-rose: 0 0 20px rgba(225, 29, 72, 0.45);
  --shadow-neon-cyan: 0 0 20px rgba(6, 182, 212, 0.4);
  --shadow-neon-purple: 0 0 20px rgba(139, 92, 246, 0.4);

  /* ==========================================================================
     4. Geometry & Transitions (모서리 곡률 & 애니메이션)
     ========================================================================== */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-pill: 9999px;

  --transition-fast: 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-normal: 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-bounce: 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

---

## 3. 타이포그래피 스펙 (Typography System)

| 계계/위계 | 폰트 패밀리 | 크기 (Rem / Px) | 두께 (Weight) | 행간 (Line-height) | 자간 (Letter-spacing) | 용도 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Display H1** | Pretendard | `2.25rem (36px)` | 800 (ExtraBold) | 1.25 | -0.03em | 포트폴리오 메인 타이틀 & 립스틱 스틱 헤어로 |
| **Section H2** | Pretendard | `1.5rem (24px)` | 800 (ExtraBold) | 1.3 | -0.02em | 주요 섹션 타이틀 (프로필, 쇼케이스, 비교표) |
| **Card H3** | Pretendard | `1.25rem (20px)` | 700 (Bold) | 1.35 | -0.01em | 엣지AI 판독 카드, 원터치 신고 모달 헤더 |
| **Subtitle / Label**| Pretendard | `0.95rem (15px)` | 600 (SemiBold) | 1.4 | 0em | 기술 태그, 폼 라벨, 상태 뱃지 |
| **Body Regular** | Pretendard | `0.875rem (14px)`| 400 (Regular) | 1.6 | 0em | 프로필 자기소개, 기술 세부 설명글 |
| **Metric Value** | JetBrains Mono | `1.75rem (28px)` | 800 (ExtraBold) | 1.2 | -0.02em | **99.2%**, **0.3초**, **5종** 실증 데이터 수치 |

---

## 4. 버튼 및 인터랙티브 엘리먼트 가이드 (Button & UI Specs)

### 4.1 규격별 버튼 시스템 (Button Sizes)

```text
[ Large (LG) ]    Height: 48px | Padding: 14px 28px | Font: 1rem (16px) Bold   | Radius: 12px
[ Medium (MD) ]   Height: 40px | Padding: 10px 20px | Font: 0.9rem (14.4px) SB | Radius: 10px
[ Small (SM) ]    Height: 32px | Padding: 6px 12px  | Font: 0.8rem (12.8px) Med| Radius: 8px
[ Icon Only ]     Square 40px x 40px or Pill Radius
```

### 4.2 버튼 스타일 배리에이션 (Button Variants)

1. **Primary Button (Lip-Safe Rose)**:
   - `background: linear-gradient(135deg, #E11D48 0%, #BE123C 100%);`
   - `box-shadow: 0 4px 14px var(--color-primary-glow);`
   - **Hover**: `transform: translateY(-2px); box-shadow: var(--shadow-neon-rose);`
   - **사용처**: `🚨 112 원터치 자동 신고`, `⚙️ 관리자 로그인`, `🚀 메인 액션`

2. **Secondary Button (Safety Cyan)**:
   - `background: linear-gradient(135deg, #06B6D4 0%, #0891B2 100%);`
   - `box-shadow: 0 4px 14px var(--color-secondary-glow);`
   - **Hover**: `transform: translateY(-2px); box-shadow: var(--shadow-neon-cyan);`
   - **사용처**: `🧪 엣지AI 판독 시뮬레이션`, `📊 차별점 비교표 필터`

3. **Outline Glass Button**:
   - `background: transparent; border: 1px solid var(--border-strong); color: var(--text-primary);`
   - **Hover**: `background: rgba(255, 255, 255, 0.08); border-color: var(--color-primary);`
   - **사용처**: `✏️ 프로필 편집 (관리자)`, `📄 PDF/CSV 다운로드`

4. **Emergency Danger Button (112 긴급 신고)**:
   - `background: #EF4444; color: #FFFFFF; font-weight: 800;`
   - `animation: pulse-danger 1.5s infinite ease-in-out;`
   - **사용처**: 위기 상황 원터치 신고 트리거

---

## 5. 핵심 UI 컴포넌트 명세 (UI Components Spec)

### 5.1 프로필 & 관리자 라이브 CMS 카드 (Profile & Admin Card)
* **방문자 뷰**:
  * 서리 유리 카드로 구성되어 김영주 님의 성함, 관심 분야(온디바이스 엣지AI, 헬스케어 UI/UX, 반응형 웹), 기술 스택 뱃지 배열.
* **관리자 CMS 뷰**:
  * 로그인 성공 시 각 텍스트/태그에 `[✏️ 라이브 편집]` 아이콘 노출. 클릭 시 모달 또는 Inline 인풋으로 즉시 전환되어 수정 후 Supabase/Firebase DB 동기화.

---

### 5.2 Lip-Safe AI 5종 마약 감지 변색 색상 칩 (Chemical Sensor Swatches)
* 5종 마약 동시 감지 상태를 나타내는 대시보드 색상 칩 가이드:
  - **GHB (물뽕)**: `#8B5CF6` (보라색 변색 칩)
  - **케타민 (Ketamine)**: `#06B6D4` (시안 변색 칩)
  - **메스암페타민 (필로폰)**: `#E11D48` (로즈 마젠타 변색 칩)
  - **코카인 (Cocaine)**: `#F59E0B` (앰버 황색 칩)
  - **MDMA (엑스터시)**: `#10B981` (에메랄드 변색 칩)

---

### 5.3 기존 키트 대비 차별점 고대비 비교표 (Comparison Table Spec)
* **테이블 스타일링**:
  - `background: var(--bg-surface-card); border-radius: var(--radius-md);`
  - Sticky 첫 번째 열 (비교 항목) 고정 및 파란색/로즈 텍스트 강조.
  - **Lip-Safe AI 열**: `background: rgba(225, 29, 72, 0.1); border: 1px solid rgba(225, 29, 72, 0.3); font-weight: 700;`

```html
<!-- Table Markup Reference -->
<div class="table-wrapper">
  <table class="matrix-table">
    <thead>
      <tr>
        <th>비교 항목</th>
        <th>기존 시판 마약 감지 키트</th>
        <th style="color: var(--color-primary);">Lip-Safe AI (스틱 + 엣지AI)</th>
        <th>기술적 차별점</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>동시 감지 종수</strong></td>
        <td>1~2종 (단일 성분 위주)</td>
        <td style="color: var(--color-primary); font-weight: 800;">5종 동시 감지</td>
        <td>커버리지 2.5배 확대 & 변색 오차 최소화</td>
      </tr>
    </tbody>
  </table>
</div>
```

---

### 5.4 112 원터치 GPS 자동 신고 & 위장 UI 스위칭 모달 (Emergency Modal)
* **모달 팝업 가이드**:
  - `background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(16px);`
  - 3초 카운트다운 진행 바 (`#EF4444` 빨간색 타이머)
  - **위장 UI 모드 토글**: 클릭 시 즉시 뷰티 립스틱 쇼핑몰/블로그 UI로 오버레이 전환.

---

## 6. 반응형 그리드 & 스페이싱 시스템 (Responsive Layout)

### 6.1 브레이크포인트 규격 (Breakpoints)
- **Desktop (대형 화면)**: `>= 1024px` (2-Column / 3-Column Grid, 최대 너비 `1200px`)
- **Tablet (태블릿)**: `768px ~ 1023px` (2-Column Grid, 카드 간격 `16px`)
- **Mobile (모바일)**: `< 768px` (1-Column Stack, 하단 고정 Quick Action Bar, 횡스크롤 Table)

### 6.2 모바일 레이아웃 최적화
* 어두운 클럽/음영 공간에서도 한 손 조작이 가능하도록 하단 영역에 `🚨 112 원터치 비상 신고` 및 `📷 엣지AI 카메라 스캔` 대형 버튼 배치.

---

## 7. 애니메이션 & 키프레임 스펙 (Micro-Interactions)

```css
/* Emergency Pulse Glow Animation */
@keyframes pulse-danger {
  0%, 100% {
    box-shadow: 0 0 10px rgba(239, 68, 68, 0.4);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 26px rgba(239, 68, 68, 0.85);
    transform: scale(1.03);
  }
}

/* Glass Card Pop In Animation */
@keyframes pop-in {
  0% {
    opacity: 0;
    transform: scale(0.92) translateY(10px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
```

---

> 본 UI/UX 디자인 가이드라인은 `portfolio/design.md` 경로에 저장되며, `@prd.md` 요구사항을 충실히 반영하여 개발자 김영주 님의 기술력과 기획력을 최고 수준으로 연출하도록 설계되었습니다.
