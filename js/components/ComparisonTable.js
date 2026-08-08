/**
 * UI 컴포넌트: ComparisonTable (기존 시판 키트 vs Lip-Safe AI 고대비 비교표)
 * 5개 핵심 축(감지 종수, 조도 영향, 판독 방식, 네트워크 의존성, 112 신고)의 차별성을 고대비 테이블로 시각화합니다.
 * (모든 주석 한글 작성)
 */

/**
 * 차별점 비교표 컴포넌트를 렌더링합니다.
 * @param {HTMLElement} container - 마운트 대상 컨테이너
 */
export function renderComparisonTable(container) {
  const element = document.createElement('section');
  element.className = 'glass-card';

  element.innerHTML = `
    <div style="margin-bottom: 20px;">
      <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary);">
        📊 기존 마약 감지 키트 대비 Lip-Safe AI 핵심 차별점 비교
      </h3>
      <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 2px;">
        단순 종이 시험지의 한계를 극복하고 엣지AI 및 GPS 긴급 신고를 결합한 종합 안전 솔루션입니다.
      </p>
    </div>

    <!-- 고대비 차별점 비교표 Table -->
    <div class="table-wrapper">
      <table class="matrix-table">
        <thead>
          <tr>
            <th>비교 항목</th>
            <th>기존 시판 마약 감지 키트</th>
            <th class="highlight-col" style="color: var(--color-primary); font-weight: 800;">
              Lip-Safe AI (스틱 + 엣지AI 앱)
            </th>
            <th>기술적 차별점 & 이점</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>동시 감지 종수</strong></td>
            <td style="color: var(--text-secondary);">1~2종 (단일 성분 위주)</td>
            <td class="highlight-col" style="color: var(--color-primary); font-weight: 800;">
              5종 동시 감지 (GHB, 케타민 등)
            </td>
            <td>커버리지 2.5배 확대 및 변색 오차 최소화</td>
          </tr>

          <tr>
            <td><strong>어두운 조명 영향성</strong></td>
            <td style="color: var(--text-secondary);">클럽/음영 환경 육안 판독 불가</td>
            <td class="highlight-col" style="color: var(--color-secondary); font-weight: 800;">
              AI 조명 자동 보정 파이프라인
            </td>
            <td>어두운 조명(10 lux 이하)에서도 98.5% 판독 성공</td>
          </tr>

          <tr>
            <td><strong>판독 방식 & 주관성</strong></td>
            <td style="color: var(--text-secondary);">육안 색상 비교 (오판 위험 큼)</td>
            <td class="highlight-col" style="color: var(--color-primary); font-weight: 800;">
              엣지AI 이미지 스캐닝 (정확도 99.2%)
            </td>
            <td>정량적 디지털 수치 및 위험 지수 즉시 안내</td>
          </tr>

          <tr>
            <td><strong>네트워크 의존성</strong></td>
            <td style="color: var(--text-secondary);">서버 전송형 (통신미약 시 지연)</td>
            <td class="highlight-col" style="color: var(--color-accent-purple); font-weight: 800;">
              온디바이스 100% 오프라인 구동
            </td>
            <td>통신 불능 지하/클럽에서도 0.3초 내 즉시 연산</td>
          </tr>

          <tr>
            <td><strong>위급 상황 비상 대응</strong></td>
            <td style="color: var(--text-secondary);">별도 112 직접 전화 필요</td>
            <td class="highlight-col" style="color: #EF4444; font-weight: 800;">
              112 · 보호자 원터치 GPS 자동 신고
            </td>
            <td>3초 이내 현재 위치 발송 & 위장 UI 오버레이</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;

  container.appendChild(element);
}
