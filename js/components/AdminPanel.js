/**
 * Component: AdminPanel
 * Manager analytics chart, statistics cards, and member management.
 */
import { store } from '../store.js';
import { copyToClipboard, showToast } from '../utils/notifications.js';

export function renderAdminPanel(container) {
  const element = document.createElement('section');
  element.className = 'glass-card';

  function update() {
    const { totalBalance, travelBalance } = store.getTotals();

    element.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
        <div>
          <h2 style="font-size: 1.2rem; font-weight: 700; color: var(--text-primary);">
            ⚙️ 총무(관리자) 통계 및 모임 관리
          </h2>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 2px;">
            월별 입출금 추이 통계 시각화 및 모임통장 QR 코드 설정
          </p>
        </div>

        <button id="copy-bank-btn" class="btn btn-outline" style="font-size: 0.85rem; color: var(--color-warning); border-color: rgba(245, 158, 11, 0.4);">
          🏦 모임통장 계좌 복사 (카카오뱅크 3333-01-1234567)
        </button>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px;">
        <div style="background: rgba(15, 23, 42, 0.6); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <div style="font-size: 0.8rem; color: var(--text-secondary);">총 모임 회원 인원</div>
          <div style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary); margin-top: 4px;">총 8 명 (전원 완료)</div>
        </div>
        <div style="background: rgba(15, 23, 42, 0.6); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <div style="font-size: 0.8rem; color: var(--text-secondary);">이달의 총 입금액</div>
          <div style="font-size: 1.5rem; font-weight: 800; color: var(--color-primary); margin-top: 4px;">₩ 150,000</div>
        </div>
        <div style="background: rgba(15, 23, 42, 0.6); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <div style="font-size: 0.8rem; color: var(--text-secondary);">이달의 총 지출액</div>
          <div style="font-size: 1.5rem; font-weight: 800; color: var(--color-danger); margin-top: 4px;">₩ 25,000</div>
        </div>
      </div>

      <!-- 👑 8인 회원 중 총무 지정/선출 세션 -->
      <div style="background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); padding: 18px; border-radius: var(--radius-md); margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
        <div>
          <div style="font-size: 0.95rem; font-weight: 700; color: var(--color-primary);">
            👑 8인 회원 내 총무(관리자) 지정/선출
          </div>
          <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 2px;">
            8명의 회원 중 한 명을 모임 총무로 지정하여 재정 관리 및 미납자 콕 찌르기 권한을 부여합니다.
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 8px;">
          <select id="select-manager" class="form-select" style="width: auto; font-weight: 700;">
            ${store.members.map(m => `<option value="${m.id}" ${m.role === 'admin' ? 'selected' : ''}>${m.avatar} ${m.name}</option>`).join('')}
          </select>
          <button id="change-manager-btn" class="btn btn-primary" style="font-size: 0.8rem; padding: 8px 14px;">
            총무 지정
          </button>
        </div>
      </div>

      <!-- SVG Chart for Monthly Income vs Expense Trend -->
      <div style="background: rgba(15, 23, 42, 0.6); padding: 20px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
        <h3 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 16px; color: var(--text-primary);">
          📈 2026년 월별 수입 vs 지출 추이 차트
        </h3>

        <div style="height: 180px; width: 100%; display: flex; align-items: flex-end; gap: 16px; padding-top: 20px; border-bottom: 1px solid var(--border-subtle);">
          <!-- Bar 1 (Jan) -->
          <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px;">
            <div style="width: 100%; max-width: 30px; height: 100px; background: linear-gradient(180deg, var(--color-primary), rgba(59, 130, 246, 0.3)); border-radius: 4px 4px 0 0;"></div>
            <span style="font-size: 0.75rem; color: var(--text-tertiary);">1월</span>
          </div>
          <!-- Bar 2 (Feb) -->
          <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px;">
            <div style="width: 100%; max-width: 30px; height: 120px; background: linear-gradient(180deg, var(--color-primary), rgba(59, 130, 246, 0.3)); border-radius: 4px 4px 0 0;"></div>
            <span style="font-size: 0.75rem; color: var(--text-tertiary);">2월</span>
          </div>
          <!-- Bar 3 (Mar) -->
          <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px;">
            <div style="width: 100%; max-width: 30px; height: 90px; background: linear-gradient(180deg, var(--color-primary), rgba(59, 130, 246, 0.3)); border-radius: 4px 4px 0 0;"></div>
            <span style="font-size: 0.75rem; color: var(--text-tertiary);">3월</span>
          </div>
          <!-- Bar 4 (Apr) -->
          <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px;">
            <div style="width: 100%; max-width: 30px; height: 110px; background: linear-gradient(180deg, var(--color-primary), rgba(59, 130, 246, 0.3)); border-radius: 4px 4px 0 0;"></div>
            <span style="font-size: 0.75rem; color: var(--text-tertiary);">4월</span>
          </div>
          <!-- Bar 5 (May) -->
          <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px;">
            <div style="width: 100%; max-width: 30px; height: 130px; background: linear-gradient(180deg, var(--color-primary), rgba(59, 130, 246, 0.3)); border-radius: 4px 4px 0 0;"></div>
            <span style="font-size: 0.75rem; color: var(--text-tertiary);">5월</span>
          </div>
          <!-- Bar 6 (Jun) -->
          <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px;">
            <div style="width: 100%; max-width: 30px; height: 105px; background: linear-gradient(180deg, var(--color-primary), rgba(59, 130, 246, 0.3)); border-radius: 4px 4px 0 0;"></div>
            <span style="font-size: 0.75rem; color: var(--text-tertiary);">6월</span>
          </div>
          <!-- Bar 7 (Jul) -->
          <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px;">
            <div style="width: 100%; max-width: 30px; height: 140px; background: linear-gradient(180deg, var(--color-primary), rgba(59, 130, 246, 0.3)); border-radius: 4px 4px 0 0;"></div>
            <span style="font-size: 0.75rem; color: var(--text-tertiary);">7월</span>
          </div>
          <!-- Bar 8 (Aug) -->
          <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px;">
            <div style="width: 100%; max-width: 30px; height: 150px; background: linear-gradient(180deg, var(--color-secondary), rgba(16, 185, 129, 0.3)); border-radius: 4px 4px 0 0;"></div>
            <span style="font-size: 0.75rem; color: var(--color-secondary); font-weight: 700;">8월 (당월)</span>
          </div>
        </div>
      </div>
    `;

    element.querySelector('#change-manager-btn').addEventListener('click', () => {
      const selectedId = element.querySelector('#select-manager').value;
      store.setManager(selectedId);
      const newManager = store.getCurrentManager();
      showToast(`👑 8명의 회원 중 '${newManager.name}' 님이 새로운 총무로 지정되었습니다!`, 'success');
    });

    element.querySelector('#copy-bank-btn').addEventListener('click', () => {
      const currentManager = store.getCurrentManager();
      copyToClipboard(
        `카카오뱅크 3333-01-1234567 (${currentManager.name})`,
        `📋 총무(${currentManager.name}) 모임통장 계좌번호가 복사되었습니다! (카카오뱅크 3333-01-1234567)`
      );
    });
  }

  update();
  store.subscribe(update);
  container.appendChild(element);
}
