/**
 * Component: TravelPoll
 * Interactive voting module for destination polls.
 */
import { store } from '../store.js';
import { showToast } from '../utils/notifications.js';

export function renderTravelPoll(container) {
  const element = document.createElement('section');
  element.className = 'glass-card';

  function update() {
    const poll = store.polls[0];
    if (!poll) return;

    let optionsHtml = '';
    poll.options.forEach(opt => {
      const pct = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
      optionsHtml += `
        <div style="margin-bottom: 14px;">
          <div style="display: flex; justify-content: space-between; font-size: 0.9rem; font-weight: 600; margin-bottom: 6px;">
            <span>${opt.text}</span>
            <span>${opt.votes}표 (${pct}%)</span>
          </div>
          <div style="display: flex; gap: 12px; align-items: center;">
            <div class="progress-track" style="flex: 1; height: 12px;">
              <div class="progress-fill" style="width: ${pct}%; background: linear-gradient(90deg, var(--color-accent-purple), var(--color-primary));"></div>
            </div>
            <button class="btn-vote btn btn-outline" data-opt="${opt.id}" style="padding: 4px 12px; font-size: 0.8rem;">
              투표
            </button>
          </div>
        </div>
      `;
    });

    element.innerHTML = `
      <div style="margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary);">${poll.title}</h3>
          <span style="font-size: 0.8rem; color: var(--text-secondary); background: rgba(139, 92, 246, 0.2); padding: 4px 10px; border-radius: var(--radius-pill);">
            총 8인 중 ${poll.totalVotes}명 참여 완료
          </span>
        </div>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 4px;">
          모임 회원의 다수결 투표로 5년 후 적립금으로 떠날 해외여행지가 결정됩니다!
        </p>
      </div>

      <div style="background: rgba(15, 23, 42, 0.5); padding: 20px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
        ${optionsHtml}
      </div>
    `;

    element.querySelectorAll('.btn-vote').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const optId = e.currentTarget.getAttribute('data-opt');
        store.votePoll(poll.id, optId, 'u1');
        showToast('🗳️ 투표가 성공적으로 반영되었습니다!', 'success');
      });
    });
  }

  update();
  store.subscribe(update);
  container.appendChild(element);
}
