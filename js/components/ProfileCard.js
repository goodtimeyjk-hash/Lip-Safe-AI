/**
 * UI 컴포넌트: ProfileCard (김영주 개발자 자기소개 및 기술 스택 뱃지)
 * 개발자/기획자 김영주 님의 관심 분야, 핵심 스택 및 관리자 CMS 편집 모드를 렌더링합니다.
 * (모든 주석 한글 작성)
 */
import { store } from '../store.js';
import { copyToClipboard } from '../utils/notifications.js';

/**
 * 프로필 자기소개 카드를 렌더링합니다.
 * @param {HTMLElement} container - 프로필 카드가 마운트될 컨테이너
 */
export function renderProfileCard(container) {
  const element = document.createElement('section');
  element.className = 'glass-card';

  function update() {
    const { profile, isAdmin } = store;

    // 기술 스택 뱃지 HTML 생성
    const skillsHtml = profile.skills.map(s => `
      <span style="background: rgba(6, 182, 212, 0.15); color: var(--color-secondary); border: 1px solid rgba(6, 182, 212, 0.3); padding: 6px 14px; border-radius: var(--radius-pill); font-size: 0.82rem; font-weight: 700; display: inline-flex; align-items: center; gap: 6px;">
        <span>⚡</span> ${s.name}
      </span>
    `).join('');

    // 관심 분야 항목 리스트 생성
    const interestsHtml = profile.interests.map(i => `
      <li style="margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
        <span style="color: var(--color-primary); font-weight: 800;">✓</span> ${i}
      </li>
    `).join('');

    element.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 20px;">
        <!-- 개발자 이력 및 프로필 정보 -->
        <div style="flex: 1; min-width: 300px;">
          <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 16px;">
            <div style="width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, var(--color-primary), var(--color-accent-purple)); display: flex; align-items: center; justify-content: center; font-size: 2rem; box-shadow: var(--shadow-neon-rose);">
              👩‍💻
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: 10px;">
                <h2 style="font-size: 1.6rem; font-weight: 800; color: var(--text-primary);">${profile.name}</h2>
                <span style="background: rgba(225, 29, 72, 0.2); color: var(--color-primary); border: 1px solid var(--border-glow-rose); padding: 4px 10px; border-radius: var(--radius-pill); font-size: 0.75rem; font-weight: 700;">
                  여성 엣지AI & 헬스케어/안전 분야
                </span>
              </div>
              <p style="font-size: 0.95rem; color: var(--color-secondary); font-weight: 700; margin-top: 2px;">
                ${profile.title}
              </p>
            </div>
          </div>

          <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 20px; background: rgba(15, 23, 42, 0.5); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
            "${profile.slogan}"
          </p>

          <!-- 관심 분야 목록 -->
          <div style="margin-bottom: 20px;">
            <h4 style="font-size: 0.9rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 10px;">🎯 관심 분야 및 할 수 있는 것</h4>
            <ul style="list-style: none; font-size: 0.88rem; color: var(--text-primary);">
              ${interestsHtml}
            </ul>
          </div>

          <!-- 기술 스택 뱃지 모음 -->
          <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px;">
            ${skillsHtml}
          </div>
        </div>

        <!-- 우측 퀵 연락처 & 관리자 라이브 편집 제어 -->
        <div style="display: flex; flex-direction: column; gap: 12px; min-width: 220px;">
          ${isAdmin ? `
            <div style="background: rgba(225, 29, 72, 0.15); border: 1px solid var(--color-primary); padding: 16px; border-radius: var(--radius-md); text-align: center;">
              <span style="font-size: 0.8rem; color: var(--color-primary); font-weight: 700;">👑 관리자 라이브 CMS 편집 모드</span>
              <button id="btn-edit-profile-cms" class="btn btn-sm btn-primary" style="width: 100%; margin-top: 10px;">
                ✏️ 프로필 / 스택 내용 수정
              </button>
            </div>
          ` : ''}

          <button id="btn-copy-email" class="btn btn-md btn-outline" style="width: 100%;">
            📧 이메일 복사 (youngju.kim@...)
          </button>
          <button id="btn-copy-github" class="btn btn-md btn-outline" style="width: 100%;">
            💻 GitHub 링크 복사
          </button>
        </div>
      </div>
    `;

    // 이메일 복사 클릭 이벤트
    element.querySelector('#btn-copy-email')?.addEventListener('click', () => {
      copyToClipboard(profile.email, `📧 김영주 님의 이메일(${profile.email})이 복사되었습니다!`);
    });

    // GitHub 복사 클릭 이벤트
    element.querySelector('#btn-copy-github')?.addEventListener('click', () => {
      copyToClipboard(profile.github, `💻 GitHub 주소(${profile.github})가 복사되었습니다!`);
    });

    // CMS 모달 편집 열기 클릭 이벤트
    element.querySelector('#btn-edit-profile-cms')?.addEventListener('click', () => {
      const modal = document.getElementById('edit-cms-modal-overlay');
      if (modal) modal.classList.add('active');
    });
  }

  update();
  store.subscribe(update);
  container.appendChild(element);
}
