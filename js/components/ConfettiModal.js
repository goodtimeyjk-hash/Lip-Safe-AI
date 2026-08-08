/**
 * Component: ConfettiModal
 * Celebratory milestone popup modal for reaching target savings threshold (e.g., 50%).
 */

export function renderConfettiModal(container) {
  const overlay = document.createElement('div');
  overlay.id = 'confetti-modal-overlay';
  overlay.className = 'modal-overlay';

  overlay.innerHTML = `
    <div class="modal-box" style="text-align: center; border-color: rgba(139, 92, 246, 0.5); box-shadow: var(--shadow-neon-purple);">
      <div style="font-size: 3.5rem; margin-bottom: 12px; animation: pop-in 0.6s ease-out;">🎉 🥳 ✈️</div>
      <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary); margin-bottom: 8px;">
        축하합니다! 목표 50% 달성!
      </h2>
      <p style="font-size: 0.95rem; color: var(--text-secondary); margin-bottom: 20px;">
        8명 회원의 뜨거운 납부 덕분에 <strong style="color: var(--color-primary);">해외여행 적립금 7,200,000원</strong> 모금을 돌파했습니다! 5년 후 바르셀로나 여행이 코앞으로 다가왔습니다.
      </p>

      <div style="background: rgba(139, 92, 246, 0.15); border: 1px solid rgba(139, 92, 246, 0.3); padding: 14px; border-radius: var(--radius-md); font-size: 0.85rem; color: #C084FC; margin-bottom: 24px;">
        🎖️ 해금된 마일스톤 뱃지: <strong>[5년 여행 절반의 기적]</strong>
      </div>

      <button id="close-confetti-btn" class="btn btn-primary" style="width: 100%;">
        신나게 여행 준비 계속하기! ✨
      </button>
    </div>
  `;

  overlay.querySelector('#close-confetti-btn').addEventListener('click', () => {
    overlay.classList.remove('active');
  });

  container.appendChild(overlay);
}

export function triggerConfetti() {
  const modal = document.querySelector('#confetti-modal-overlay');
  if (modal) modal.classList.add('active');
}
