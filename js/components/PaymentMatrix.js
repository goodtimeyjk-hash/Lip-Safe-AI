/**
 * Component: PaymentMatrix
 * Renders the 8-member x 12-month annual payment status matrix table.
 */
import { store } from '../store.js';
import { showToast } from '../utils/notifications.js';

export function renderPaymentMatrix(container) {
  const element = document.createElement('section');
  element.className = 'glass-card';

  function update() {
    const year = store.currentYear;
    const matrix = store.paymentMatrix[year] || {};
    const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

    let rowsHtml = '';
    store.members.forEach(member => {
      const statuses = matrix[member.id] || Array(12).fill(0);
      let cellsHtml = '';
      let paidCount = 0;

      statuses.forEach((status, mIdx) => {
        if (status === 1) {
          paidCount++;
          cellsHtml += `<td><span class="badge-paid" title="${year}년 ${mIdx + 1}월 완납">○</span></td>`;
        } else if (mIdx <= 7) { // Up to current month (August = index 7)
          cellsHtml += `<td>
            <span class="badge-unpaid" data-user="${member.id}" data-name="${member.name}" data-month="${mIdx + 1}" title="미납 (클릭 시 콕 찌르기 알림)">✕</span>
          </td>`;
        } else {
          cellsHtml += `<td><span class="badge-future">-</span></td>`;
        }
      });

      rowsHtml += `
        <tr>
          <td>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span>${member.avatar}</span>
              <span>${member.name}</span>
            </div>
          </td>
          ${cellsHtml}
          <td style="font-weight: 700; color: var(--color-primary);">${paidCount} / 12 개월</td>
        </tr>
      `;
    });

    element.innerHTML = `
      <div class="matrix-section-header">
        <div>
          <h2 style="font-size: 1.2rem; font-weight: 700; color: var(--text-primary);">
            📊 2026년 회원별 종합 납부 현황 표
          </h2>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 2px;">
            8인 회원의 1~12월 회비 납부 상태 (완납: <strong style="color: var(--color-success);">○</strong> / 미납: <strong style="color: var(--color-danger);">✕</strong>)
          </p>
        </div>
        <div style="display: flex; gap: 8px;">
          <select id="year-select" class="form-select" style="width: auto; padding: 6px 12px;">
            <option value="2026" selected>2026년</option>
            <option value="2027">2027년</option>
            <option value="2028">2028년</option>
          </select>
        </div>
      </div>

      <div class="table-wrapper">
        <table class="matrix-table">
          <thead>
            <tr>
              <th>회원 성명</th>
              ${months.map(m => `<th>${m}</th>`).join('')}
              <th>완납 달성</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    `;

    // Add event listeners for "Poke" on unpaid cells
    element.querySelectorAll('.badge-unpaid').forEach(el => {
      el.addEventListener('click', (e) => {
        const name = e.currentTarget.getAttribute('data-name');
        const month = e.currentTarget.getAttribute('data-month');
        showToast(`🔔 [콕 찌르기] ${name} 회원님에게 ${month}월 회비 미납 안내 알림을 전송했습니다!`, 'warning');
      });
    });
  }

  update();
  store.subscribe(update);
  container.appendChild(element);
}
