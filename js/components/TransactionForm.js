/**
 * Component: TransactionForm
 * Modal dialog form for adding new income/expense entries with 50,000 KRW Auto-Split logic.
 */
import { store } from '../store.js';
import { showToast } from '../utils/notifications.js';

export function renderTransactionForm(container) {
  const overlay = document.createElement('div');
  overlay.id = 'tx-modal-overlay';
  overlay.className = 'modal-overlay';

  const memberOptions = store.members.map(m => `<option value="${m.id}">${m.name}</option>`).join('');

  overlay.innerHTML = `
    <div class="modal-box">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--text-primary);">
          ➕ 회비 / 수입·지출 내역 등록
        </h3>
        <button id="close-modal-btn" class="btn btn-outline" style="padding: 4px 10px; font-size: 0.8rem;">✕ 닫기</button>
      </div>

      <form id="tx-form">
        <div class="form-group">
          <label class="form-label">거래 구분</label>
          <select id="tx-type" class="form-select">
            <option value="INCOME">수입 (회비 납부 / 입금)</option>
            <option value="EXPENSE">지출 (모임 사용 / 차감)</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">대상 회원 선택</label>
          <select id="tx-user" class="form-select">
            ${memberOptions}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">금액 (원)</label>
          <input type="number" id="tx-amount" class="form-input" value="50000" placeholder="예: 50000" required />
        </div>

        <!-- 5만 원 회비 자동 분할 토글 -->
        <div id="auto-split-container" class="auto-split-banner">
          <input type="checkbox" id="tx-auto-split" checked style="width: 18px; height: 18px; cursor: pointer;" />
          <div>
            <div style="font-size: 0.9rem; font-weight: 700; color: var(--color-primary);">
              ✨ 회비 5만 원 자동 분할 적용
            </div>
            <div style="font-size: 0.78rem; color: var(--text-secondary);">
              [여행 적립금: 3만 원] + [공동 사용금: 2만 원]으로 자동 적립
            </div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">적요 / 사용 내용</label>
          <input type="text" id="tx-desc" class="form-input" value="8월 정기 회비 납부 (자동 분할적용)" placeholder="내용을 입력하세요" required />
        </div>

        <div class="form-group">
          <label class="form-label">거래 일자</label>
          <input type="date" id="tx-date" class="form-input" value="${new Date().toISOString().split('T')[0]}" required />
        </div>

        <div style="display: flex; gap: 12px; margin-top: 24px;">
          <button type="button" id="cancel-tx-btn" class="btn btn-outline" style="flex: 1;">취소</button>
          <button type="submit" class="btn btn-primary" style="flex: 2;">즉시 반영하기</button>
        </div>
      </form>
    </div>
  `;

  // Event handlers
  const closeModal = () => overlay.classList.remove('active');

  overlay.querySelector('#close-modal-btn').addEventListener('click', closeModal);
  overlay.querySelector('#cancel-tx-btn').addEventListener('click', closeModal);

  // Type change handler
  const typeSelect = overlay.querySelector('#tx-type');
  const autoSplitBanner = overlay.querySelector('#auto-split-container');
  typeSelect.addEventListener('change', () => {
    if (typeSelect.value === 'EXPENSE') {
      autoSplitBanner.style.display = 'none';
    } else {
      autoSplitBanner.style.display = 'flex';
    }
  });

  // Submit handler
  overlay.querySelector('#tx-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const userId = overlay.querySelector('#tx-user').value;
    const type = overlay.querySelector('#tx-type').value;
    const amount = parseInt(overlay.querySelector('#tx-amount').value, 10);
    const isAutoSplit = overlay.querySelector('#tx-auto-split').checked;
    const description = overlay.querySelector('#tx-desc').value;
    const date = overlay.querySelector('#tx-date').value;

    store.addTransaction({ userId, type, amount, isAutoSplit, description, date });
    closeModal();
    showToast('✅ 회비 내역이 즉시 장부 및 대시보드 잔액에 반영되었습니다!', 'success');
  });

  container.appendChild(overlay);
}
