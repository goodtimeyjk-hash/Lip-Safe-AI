/**
 * Component: CommunityBoard
 * Renders verification photo board & member comments.
 */
import { store } from '../store.js';
import { showToast } from '../utils/notifications.js';

export function renderCommunityBoard(container) {
  const element = document.createElement('section');
  element.className = 'glass-card';

  element.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <div>
        <h2 style="font-size: 1.2rem; font-weight: 700; color: var(--text-primary);">
          💬 모임 입금 인증샷 및 게시판
        </h2>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 2px;">
          회원들이 직접 올린 회비 영수증 인증샷 및 모임 소통 공간입니다.
        </p>
      </div>
      <button id="add-post-btn" class="btn btn-secondary" style="font-size: 0.85rem;">
        📷 인증샷 글쓰기
      </button>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
      <!-- Post 1 -->
      <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 16px;">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
          <span style="font-size: 1.5rem;">👨‍💼</span>
          <div>
            <div style="font-size: 0.9rem; font-weight: 700;">김민수 (총무)</div>
            <div style="font-size: 0.75rem; color: var(--text-tertiary);">2026-08-01 14:30</div>
          </div>
        </div>
        <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 12px;">
          8월 정기 회비 5만 원 입금 완료했습니다! (여행 3만 + 공통 2만 분할 적립 완료)
        </p>
        <div style="background: rgba(59, 130, 246, 0.1); border: 1px dashed rgba(59, 130, 246, 0.4); padding: 12px; border-radius: var(--radius-sm); text-align: center; color: var(--color-primary); font-size: 0.8rem; display: flex; align-items: center; justify-content: center; gap: 6px;">
          <span>🧾</span>
          <a href="assets/images/receipt_sample.png" target="_blank" style="color: var(--color-primary); text-decoration: underline;">assets/images/receipt_sample.png</a>
        </div>
      </div>

      <!-- Post 2 -->
      <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 16px;">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
          <span style="font-size: 1.5rem;">👩‍💻</span>
          <div>
            <div style="font-size: 0.9rem; font-weight: 700;">이서연</div>
            <div style="font-size: 0.75rem; color: var(--text-tertiary);">2026-08-02 11:15</div>
          </div>
        </div>
        <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 12px;">
          저도 토스 모임통장으로 회비 5만 원 송금 완료! 5년 후 바르셀로나 꼭 갑시다 🔥
        </p>
        <div style="background: rgba(16, 185, 129, 0.1); border: 1px dashed rgba(16, 185, 129, 0.4); padding: 12px; border-radius: var(--radius-sm); text-align: center; color: var(--color-secondary); font-size: 0.8rem;">
          🧾 이서연_송금내역서.pdf
        </div>
      </div>
    </div>
  `;

  element.querySelector('#add-post-btn').addEventListener('click', () => {
    showToast('📷 인증샷 글쓰기 팝업이 활성화되었습니다.', 'info');
  });

  container.appendChild(element);
}
