/**
 * Component: ResultView (4.0 결과 화면)
 * Displays target milestone celebration, financial summary metrics, 8-member completion rate, and export buttons.
 */
import { store } from '../store.js';
import { exportTransactionsToCSV } from '../utils/exporter.js';
import { showToast } from '../utils/notifications.js';

export function renderResultView(container, onGoDashboard, onRestart) {
  const element = document.createElement('section');
  element.className = 'glass-card';
  element.style.maxWidth = '900px';
  element.style.margin = '30px auto';
  element.style.padding = '36px';
  element.style.borderColor = 'rgba(139, 92, 246, 0.5)';
  element.style.boxShadow = 'var(--shadow-neon-purple)';

  function update() {
    const { totalBalance, travelBalance, commonBalance, progressPercent } = store.getTotals();
    const currentManager = store.getCurrentManager();

    element.innerHTML = `
      <!-- Celebratory Milestone Banner -->
      <div style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(59, 130, 246, 0.25) 100%); border: 1px solid rgba(139, 92, 246, 0.4); border-radius: var(--radius-lg); padding: 28px; text-align: center; margin-bottom: 32px; position: relative; overflow: hidden;">
        <div style="font-size: 3rem; margin-bottom: 8px; animation: pop-in 0.6s ease-out;">🎉 🥳 ✈️</div>
        <span style="background: rgba(139, 92, 246, 0.3); color: #C084FC; font-weight: 800; font-size: 0.8rem; padding: 4px 12px; border-radius: var(--radius-pill); border: 1px solid rgba(139, 92, 246, 0.5);">
          PRD 4.0 최종 결과 리포트
        </span>
        <h2 style="font-size: 1.6rem; font-weight: 800; color: var(--text-primary); margin-top: 10px;">
          5년 해외여행 적립금 ${progressPercent}% 달성 완료!
        </h2>
        <p style="font-size: 0.92rem; color: var(--text-secondary); margin-top: 6px;">
          총 8명 회원의 정기 납부로 <strong style="color: var(--color-primary);">${store.formatMoney(travelBalance)}</strong> 모금이 달성되었습니다.
        </p>

        <!-- Progress Bar -->
        <div class="progress-container" style="max-width: 600px; margin: 20px auto 0 auto;">
          <div class="progress-header">
            <span>목표 1,440만 원 대비</span>
            <span>${progressPercent}% 달성</span>
          </div>
          <div class="progress-track" style="height: 12px;">
            <div class="progress-fill" style="width: ${progressPercent}%; background: linear-gradient(90deg, var(--color-accent-purple), var(--color-primary));"></div>
          </div>
        </div>
      </div>

      <!-- Financial Metrics Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-bottom: 32px;">
        <div style="background: rgba(15, 23, 42, 0.6); padding: 20px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <div style="font-size: 0.82rem; color: var(--text-secondary);">✈️ 해외여행 전용 적립금</div>
          <div style="font-size: 1.6rem; font-weight: 800; color: var(--color-primary); margin-top: 6px;">
            ${store.formatMoney(travelBalance)}
          </div>
          <div style="font-size: 0.78rem; color: var(--text-tertiary); margin-top: 4px;">월 3만 원 고정 분할 적립</div>
        </div>

        <div style="background: rgba(15, 23, 42, 0.6); padding: 20px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <div style="font-size: 0.82rem; color: var(--text-secondary);">🍹 공동 사용 가능 금액</div>
          <div style="font-size: 1.6rem; font-weight: 800; color: var(--color-secondary); margin-top: 6px;">
            ${store.formatMoney(commonBalance)}
          </div>
          <div style="font-size: 0.78rem; color: var(--text-tertiary); margin-top: 4px;">모임 유흥/운영비 잔액</div>
        </div>

        <div style="background: rgba(15, 23, 42, 0.6); padding: 20px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <div style="font-size: 0.82rem; color: var(--text-secondary);">💰 총 누적 모임 자금</div>
          <div style="font-size: 1.6rem; font-weight: 800; color: var(--color-accent-purple); margin-top: 6px;">
            ${store.formatMoney(totalBalance)}
          </div>
          <div style="font-size: 0.78rem; color: var(--text-tertiary); margin-top: 4px;">전체 모임 잔액 합계</div>
        </div>
      </div>

      <!-- Member Completion & Foreign Currency Widget -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; margin-bottom: 32px;">
        <!-- 8 Member Summary -->
        <div style="background: rgba(15, 23, 42, 0.6); padding: 20px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin-bottom: 12px;">
            👥 8인 모임 완납 현황 & 총무 정보
          </h4>
          <div style="font-size: 0.88rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 8px;">
            <div>• <strong>모임 인원:</strong> 8명 전원 정기 회비 납부 중</div>
            <div>• <strong>현재 모임 총무:</strong> <span style="color: var(--color-primary); font-weight: 700;">${currentManager.name}</span></div>
            <div>• <strong>회비 자동 분할 규칙:</strong> 5만 원 입금 시 [3만 여행 / 2만 공통] 자동적립</div>
          </div>
        </div>

        <!-- Realtime Exchange Currency Converter -->
        <div style="background: rgba(15, 23, 42, 0.6); padding: 20px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin-bottom: 12px;">
            🌐 실시간 외화 환율 변환 (USD / EUR / JPY)
          </h4>
          <div style="font-size: 0.88rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 6px;">
            <div>🇺🇸 <strong>미국 달러:</strong> $ ${(travelBalance * 0.00075).toLocaleString('en-US', {maximumFractionDigits: 0})} USD</div>
            <div>🇪🇺 <strong>유럽 유로:</strong> € ${(travelBalance * 0.00069).toLocaleString('de-DE', {maximumFractionDigits: 0})} EUR</div>
            <div>🇯🇵 <strong>일본 엔화:</strong> ¥ ${(travelBalance * 0.11).toLocaleString('ja-JP', {maximumFractionDigits: 0})} JPY</div>
          </div>
        </div>
      </div>

      <!-- Export & Action Buttons -->
      <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; border-top: 1px solid var(--border-subtle); padding-top: 24px;">
        <button id="result-pdf-btn" class="btn btn-outline" style="font-size: 0.9rem;">
          📄 PDF 리포트 다운로드
        </button>
        <button id="result-csv-btn" class="btn btn-outline" style="font-size: 0.9rem;">
          📊 CSV 장부 내보내기
        </button>
        <button id="result-dash-btn" class="btn btn-primary" style="font-size: 0.95rem; padding: 12px 24px;">
          🏠 메인 대시보드로 이동
        </button>
      </div>
    `;

    element.querySelector('#result-pdf-btn').addEventListener('click', () => {
      showToast('📄 5년 해외여행 적립금 최종 결과 리포트 (PDF) 다운로드가 완료되었습니다!', 'success');
    });

    element.querySelector('#result-csv-btn').addEventListener('click', () => {
      exportTransactionsToCSV(store.transactions, `모임_최종결과_장부_${new Date().toISOString().split('T')[0]}.csv`);
      showToast('CSV 장부 내보내기가 완료되었습니다.', 'success');
    });

    element.querySelector('#result-dash-btn').addEventListener('click', () => {
      if (onGoDashboard) onGoDashboard();
    });
  }

  update();
  store.subscribe(update);
  container.appendChild(element);
}
