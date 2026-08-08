/**
 * Component: BalanceCards
 * Renders 3 glassmorphism cards: Total Balance, Travel Fund (with Progress Bar), Common Fund.
 */
import { store } from '../store.js';

export function renderBalanceCards(container) {
  const element = document.createElement('section');
  element.className = 'cards-grid';

  function update() {
    const { totalBalance, travelBalance, commonBalance, progressPercent } = store.getTotals();

    element.innerHTML = `
      <!-- Card 1: 해외여행 적립금 -->
      <div class="glass-card balance-card" style="--card-accent: var(--color-primary);">
        <div class="balance-card-header">
          <span class="balance-title">✈️ 해외여행 적립금 (목표 1,440만 원)</span>
          <div class="balance-icon" style="color: var(--color-primary);">🏖️</div>
        </div>
        <div class="balance-amount">${store.formatMoney(travelBalance)}</div>
        <div class="balance-subtext">5년 후 해외여행 전용 고정 적립 자금</div>

        <div class="progress-container">
          <div class="progress-header">
            <span>목표 달성률</span>
            <span>${progressPercent}% 달성</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" style="width: ${progressPercent}%;"></div>
          </div>
        </div>
      </div>

      <!-- Card 2: 공동 사용 가능 금액 -->
      <div class="glass-card balance-card" style="--card-accent: var(--color-secondary);">
        <div class="balance-card-header">
          <span class="balance-title">🍹 공동 사용 가능 금액</span>
          <div class="balance-icon" style="color: var(--color-secondary);">💳</div>
        </div>
        <div class="balance-amount">${store.formatMoney(commonBalance)}</div>
        <div class="balance-subtext">모임 유흥, 운영비, 식비 자유 사용 가능 잔액</div>
      </div>

      <!-- Card 3: 총 누적 모임 자금 -->
      <div class="glass-card balance-card" style="--card-accent: var(--color-accent-purple);">
        <div class="balance-card-header">
          <span class="balance-title">💰 총 모임 자금 (전체 잔액)</span>
          <div class="balance-icon" style="color: var(--color-accent-purple);">💎</div>
        </div>
        <div class="balance-amount">${store.formatMoney(totalBalance)}</div>
        <div class="balance-subtext">여행 적립금 + 공동 사용금 합계 자금</div>
      </div>
    `;
  }

  update();
  store.subscribe(update);
  container.appendChild(element);
}
