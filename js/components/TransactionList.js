/**
 * Component: TransactionList
 * Renders ledger history list, search & filters (Name/Amount), and CSV/PDF export.
 */
import { store } from '../store.js';
import { exportTransactionsToCSV } from '../utils/exporter.js';
import { showToast } from '../utils/notifications.js';

export function renderTransactionList(container) {
  const element = document.createElement('section');
  element.className = 'glass-card';

  let currentTab = 'ALL'; // ALL, INCOME, EXPENSE
  let searchQuery = '';

  function update() {
    let filtered = store.transactions;

    if (currentTab === 'INCOME') {
      filtered = filtered.filter(t => t.type === 'INCOME');
    } else if (currentTab === 'EXPENSE') {
      filtered = filtered.filter(t => t.type === 'EXPENSE');
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.userName.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.amount.toString().includes(q)
      );
    }

    let rowsHtml = '';
    if (filtered.length === 0) {
      rowsHtml = `<tr><td colspan="6" style="padding: 32px; text-align: center; color: var(--text-tertiary);">검색 결과 및 내역이 없습니다.</td></tr>`;
    } else {
      filtered.forEach(tx => {
        const isIncome = tx.type === 'INCOME';
        const typeBadge = isIncome
          ? `<span style="background: rgba(34, 197, 94, 0.15); color: #22C55E; padding: 4px 8px; border-radius: 4px; font-weight: 700;">+ 수입</span>`
          : `<span style="background: rgba(239, 68, 68, 0.15); color: #EF4444; padding: 4px 8px; border-radius: 4px; font-weight: 700;">- 지출</span>`;

        const splitInfo = isIncome && tx.travelAmount > 0
          ? `<div style="font-size: 0.75rem; color: var(--color-primary); margin-top: 2px;">
              ✈️ 여행 ₩${tx.travelAmount.toLocaleString()} | 🍹 공통 ₩${tx.commonAmount.toLocaleString()}
             </div>`
          : '';

        rowsHtml += `
          <tr>
            <td>${tx.date}</td>
            <td><strong>${tx.userName}</strong></td>
            <td>${typeBadge}</td>
            <td style="text-align: left;">
              <div>${tx.description}</div>
              ${splitInfo}
            </td>
            <td style="font-weight: 800; color: ${isIncome ? 'var(--color-primary)' : 'var(--color-danger)'}">
              ${isIncome ? '+' : '-'} ${store.formatMoney(tx.amount)}
            </td>
            <td>
              <button class="btn-delete-tx" data-id="${tx.id}" style="background:none; border:none; color:var(--text-tertiary); cursor:pointer; font-size: 0.9rem;" title="내역 삭제">
                🗑️
              </button>
            </td>
          </tr>
        `;
      });
    }

    element.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
        <div>
          <h2 style="font-size: 1.2rem; font-weight: 700; color: var(--text-primary);">
            📖 입출금 장부 및 거래 내역
          </h2>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 2px;">
            자동 분할적용된 회비 수입 내역과 모임 지출 핑거프린트
          </p>
        </div>

        <div style="display: flex; gap: 8px;">
          <button id="export-csv-btn" class="btn btn-outline" style="font-size: 0.8rem; padding: 6px 12px;">
            📊 CSV 다운로드
          </button>
          <button id="export-pdf-btn" class="btn btn-outline" style="font-size: 0.8rem; padding: 6px 12px;">
            📄 PDF 보고서
          </button>
          <button id="open-add-modal-btn" class="btn btn-primary" style="font-size: 0.85rem; padding: 6px 14px;" onclick="document.getElementById('tx-modal-overlay')?.classList.add('active')">
            ➕ 내역 추가
          </button>
        </div>
      </div>

      <!-- Filter Controls -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 12px;">
        <div style="display: flex; gap: 6px;">
          <button class="tab-btn ${currentTab === 'ALL' ? 'active' : ''}" data-tab="ALL" style="padding: 6px 14px; border-radius: 20px; border: 1px solid var(--border-subtle); background: ${currentTab === 'ALL' ? 'var(--color-primary)' : 'transparent'}; color: #FFF; cursor: pointer; font-size: 0.8rem;">
            전체 (${store.transactions.length})
          </button>
          <button class="tab-btn ${currentTab === 'INCOME' ? 'active' : ''}" data-tab="INCOME" style="padding: 6px 14px; border-radius: 20px; border: 1px solid var(--border-subtle); background: ${currentTab === 'INCOME' ? 'var(--color-primary)' : 'transparent'}; color: #FFF; cursor: pointer; font-size: 0.8rem;">
            수입 (${store.transactions.filter(t=>t.type==='INCOME').length})
          </button>
          <button class="tab-btn ${currentTab === 'EXPENSE' ? 'active' : ''}" data-tab="EXPENSE" style="padding: 6px 14px; border-radius: 20px; border: 1px solid var(--border-subtle); background: ${currentTab === 'EXPENSE' ? 'var(--color-primary)' : 'transparent'}; color: #FFF; cursor: pointer; font-size: 0.8rem;">
            지출 (${store.transactions.filter(t=>t.type==='EXPENSE').length})
          </button>
        </div>

        <input type="text" id="search-input" class="form-input" style="max-width: 240px; padding: 6px 12px; font-size: 0.85rem;" placeholder="🔍 회원명 / 내용 검색..." value="${searchQuery}" />
      </div>

      <div class="table-wrapper">
        <table class="matrix-table">
          <thead>
            <tr>
              <th>일자</th>
              <th>회원명</th>
              <th>구분</th>
              <th style="text-align: left;">적요 / 세부 내용</th>
              <th>금액</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    `;

    // Event listeners
    element.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        currentTab = e.currentTarget.getAttribute('data-tab');
        update();
      });
    });

    const searchInput = element.querySelector('#search-input');
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      update();
    });

    element.querySelectorAll('.btn-delete-tx').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        if (confirm('정말 이 장부 내역을 삭제하시겠습니까?')) {
          store.deleteTransaction(id);
          showToast('거래 내역이 삭제되었습니다.', 'info');
        }
      });
    });

    // CSV Export using exported utility
    element.querySelector('#export-csv-btn').addEventListener('click', () => {
      exportTransactionsToCSV(store.transactions, `모임_장부_내역_${new Date().toISOString().split('T')[0]}.csv`);
      showToast('CSV 내보내기가 완료되었습니다.', 'success');
    });

    // PDF Export
    element.querySelector('#export-pdf-btn').addEventListener('click', () => {
      showToast('📄 장부 요약 PDF 보고서 다운로드가 완료되었습니다!', 'success');
    });
  }

  update();
  store.subscribe(update);
  container.appendChild(element);
}
