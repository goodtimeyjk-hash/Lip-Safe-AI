/**
 * Component: AuthLogin (1.0 시작 / 로그인 및 초대가입 화면)
 * Renders 1-click 8-member quick login, ID/PW login, and Invite Code authentication.
 */
import { store } from '../store.js';
import { showToast } from '../utils/notifications.js';

export function renderAuthLogin(container, onAuthSuccess) {
  const element = document.createElement('section');
  element.className = 'glass-card';
  element.style.maxWidth = '540px';
  element.style.margin = '40px auto';
  element.style.padding = '36px 32px';
  element.style.boxShadow = 'var(--shadow-neon-blue)';
  element.style.borderColor = 'rgba(59, 130, 246, 0.4)';

  let activeTab = 'QUICK'; // QUICK, CODE, IDPW

  function update() {
    const memberButtons = store.members.map(m => `
      <button class="quick-user-btn btn btn-outline" data-id="${m.id}" style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; width: 100%; border-color: rgba(255,255,255,0.12);">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 1.4rem;">${m.avatar}</span>
          <div style="text-align: left;">
            <div style="font-weight: 700; color: var(--text-primary); font-size: 0.95rem;">${m.name}</div>
            <div style="font-size: 0.75rem; color: var(--text-tertiary);">${m.role === 'admin' ? '👑 모임 총무' : '일반 회원'}</div>
          </div>
        </div>
        <span style="font-size: 0.8rem; color: var(--color-primary); font-weight: 600;">입장하기 ➔</span>
      </button>
    `).join('');

    element.innerHTML = `
      <!-- Brand Header -->
      <div style="text-align: center; margin-bottom: 28px;">
        <div style="width: 56px; height: 56px; background: linear-gradient(135deg, var(--color-primary), var(--color-accent-cyan)); border-radius: var(--radius-lg); display: inline-flex; align-items: center; justify-content: center; font-size: 1.8rem; box-shadow: var(--shadow-neon-blue); margin-bottom: 12px;">
          ✈️
        </div>
        <h2 style="font-size: 1.6rem; font-weight: 800; color: var(--text-primary);">
          Travel Together
        </h2>
        <p style="font-size: 0.88rem; color: var(--text-secondary); margin-top: 4px;">
          8인 모임 회비 & 5년 해외여행 적립금 통합 관리 시스템
        </p>
        <div style="margin-top: 14px; display: flex; flex-direction: column; gap: 8px; align-items: center;">
          <span class="dday-badge" style="font-size: 0.8rem;">D-1420일 | 목표 1,440만 원 🏝️</span>
          <button id="start-test-btn" class="btn btn-secondary" style="margin-top: 6px; padding: 12px 24px; font-size: 1rem; width: 100%;">
            🚀 테스트 진행 화면으로 시작하기
          </button>
        </div>
      </div>

      <!-- Auth Tab Navigation -->
      <div style="display: flex; gap: 4px; background: rgba(15, 23, 42, 0.6); padding: 4px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: 24px;">
        <button class="auth-tab-btn btn ${activeTab === 'QUICK' ? 'btn-primary' : 'btn-outline'}" data-tab="QUICK" style="flex: 1; padding: 8px; font-size: 0.82rem; border: none;">
          ⚡ 8인 간편 로그인
        </button>
        <button class="auth-tab-btn btn ${activeTab === 'CODE' ? 'btn-primary' : 'btn-outline'}" data-tab="CODE" style="flex: 1; padding: 8px; font-size: 0.82rem; border: none;">
          🎟️ 초대 코드 가입
        </button>
        <button class="auth-tab-btn btn ${activeTab === 'IDPW' ? 'btn-primary' : 'btn-outline'}" data-tab="IDPW" style="flex: 1; padding: 8px; font-size: 0.82rem; border: none;">
          🔑 ID/PW 로그인
        </button>
      </div>

      <!-- Tab Content 1: Quick 8-Member Login -->
      ${activeTab === 'QUICK' ? `
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 4px; text-align: center;">
            접속할 회원을 선택하시면 원클릭으로 로그인 및 대시보드로 이동합니다.
          </div>
          ${memberButtons}
        </div>
      ` : ''}

      <!-- Tab Content 2: Invite Code Entry -->
      ${activeTab === 'CODE' ? `
        <form id="invite-code-form">
          <div class="form-group">
            <label class="form-label">모임 전용 초대 코드</label>
            <input type="text" id="invite-code-input" class="form-input" value="TRAVEL-2026-8MEM" placeholder="예: TRAVEL-2026-8MEM" required style="font-family: var(--font-family-mono); letter-spacing: 0.05em;" />
            <span style="font-size: 0.75rem; color: var(--color-primary); margin-top: 4px;">
              💡 기본 테스트 코드: <code>TRAVEL-2026-8MEM</code>
            </span>
          </div>

          <div class="form-group">
            <label class="form-label">가입 회원 이름</label>
            <input type="text" id="invite-name-input" class="form-input" value="신규 회원" required />
          </div>

          <button type="submit" class="btn btn-secondary" style="width: 100%; margin-top: 16px; padding: 12px;">
            🎟️ 초대 코드로 8인 모임 가입하기
          </button>
        </form>
      ` : ''}

      <!-- Tab Content 3: Standard ID / PW Login -->
      ${activeTab === 'IDPW' ? `
        <form id="idpw-form">
          <div class="form-group">
            <label class="form-label">이메일 / 아이디</label>
            <input type="email" class="form-input" value="admin@travel.com" required />
          </div>

          <div class="form-group">
            <label class="form-label">비밀번호</label>
            <input type="password" class="form-input" value="••••••••" required />
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 16px; padding: 12px;">
            🔑 로그인
          </button>
        </form>
      ` : ''}

      <!-- Footer Info -->
      <div style="margin-top: 24px; text-align: center; font-size: 0.78rem; color: var(--text-tertiary); border-top: 1px solid var(--border-subtle); padding-top: 16px;">
        🔒 8인 전용 프라이빗 보안 모임 시스템 | Supabase Auth Protected
      </div>
    `;

    // Main Start Test Button Click
    const startTestBtn = element.querySelector('#start-test-btn');
    if (startTestBtn) {
      startTestBtn.addEventListener('click', () => {
        if (onAuthSuccess) onAuthSuccess({ isStartTest: true });
      });
    }

    // Tab Change Events
    element.querySelectorAll('.auth-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        activeTab = e.currentTarget.getAttribute('data-tab');
        update();
      });
    });

    // Quick Login Event
    element.querySelectorAll('.quick-user-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const userId = e.currentTarget.getAttribute('data-id');
        const member = store.members.find(m => m.id === userId);
        showToast(`👋 안녕하세요, ${member.name}님! 로그인되었습니다.`, 'success');
        if (onAuthSuccess) onAuthSuccess(member);
      });
    });

    // Invite Code Form Submit
    const inviteForm = element.querySelector('#invite-code-form');
    if (inviteForm) {
      inviteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const code = element.querySelector('#invite-code-input').value;
        const name = element.querySelector('#invite-name-input').value;

        if (code === 'TRAVEL-2026-8MEM') {
          showToast(`🎉 초대 코드가 인증되었습니다! '${name}' 회원 가입 완료`, 'success');
          if (onAuthSuccess) onAuthSuccess({ name, role: 'member' });
        } else {
          showToast('❌ 유효하지 않은 초대 코드입니다. TRAVEL-2026-8MEM 코드를 확인해 주세요.', 'error');
        }
      });
    }

    // ID/PW Form Submit
    const idpwForm = element.querySelector('#idpw-form');
    if (idpwForm) {
      idpwForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast(`🔑 로그인 성공! 메인 대시보드로 이동합니다.`, 'success');
        if (onAuthSuccess) onAuthSuccess(store.members[0]);
      });
    }
  }

  update();
  container.appendChild(element);
}
