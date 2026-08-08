/**
 * UI 컴포넌트: ContactFooter (이메일/연락처 복사 및 프로젝트 문의 푸터 컴포넌트)
 * 채용 담당자, 헤드헌터, 잠재 클라이언트를 위한 원터치 복사 및 문의 전송 폼을 렌더링합니다.
 * (모든 주석 한글 작성)
 */
import { store } from '../store.js';
import { copyToClipboard, showToast } from '../utils/notifications.js';

/**
 * 푸터 문의 및 저작권 컴포넌트를 렌더링합니다.
 * @param {HTMLElement} container - 마운트 대상 컨테이너
 */
export function renderContactFooter(container) {
  const element = document.createElement('footer');
  element.className = 'glass-card';
  element.style.marginTop = '24px';

  function update() {
    const { profile } = store;

    element.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 32px; margin-bottom: 24px;">
        <!-- 좌측: 프로젝트 문의 및 채용 제안 안내 -->
        <div>
          <h3 style="font-size: 1.3rem; font-weight: 800; color: var(--text-primary); margin-bottom: 8px;">
            💬 프로젝트 외주 문의 & 채용/이직 제안
          </h3>
          <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 16px;">
            온디바이스 엣지AI 앱 개발, 헬스케어 및 안전 분야 UI/UX 기획, 반응형 웹 프로젝트에 대해 언제든 편하게 문의해 주세요.
          </p>

          <div style="display: flex; flex-direction: column; gap: 10px;">
            <button id="footer-btn-copy-email" class="btn btn-md btn-outline" style="justify-content: flex-start;">
              📧 이메일: ${profile.email} (클릭 시 복사)
            </button>
            <button id="footer-btn-copy-phone" class="btn btn-md btn-outline" style="justify-content: flex-start;">
              📱 연락처: ${profile.phone} (클릭 시 복사)
            </button>
          </div>
        </div>

        <!-- 우측: 빠른 이메일 문의 작성 폼 -->
        <div style="background: rgba(15, 23, 42, 0.6); padding: 20px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin-bottom: 12px;">
            ✉️ 메세지 남기기
          </h4>
          <form id="contact-quick-form">
            <div class="form-group">
              <input type="text" id="contact-sender-name" class="form-input" placeholder="성함 또는 기업명 (예: 00테크 채용팀)" required />
            </div>
            <div class="form-group">
              <textarea id="contact-sender-msg" class="form-textarea" rows="3" placeholder="문의 내용 또는 채용 제안 메시지..." required></textarea>
            </div>
            <button type="submit" class="btn btn-md btn-primary" style="width: 100%;">
              🚀 문의 메시지 전송하기
            </button>
          </form>
        </div>
      </div>

      <!-- 하단 카피라이트 표기 -->
      <div style="border-top: 1px solid var(--border-subtle); pt: 16px; padding-top: 16px; text-align: center; font-size: 0.78rem; color: var(--text-tertiary);">
        © 2026 Kim Young-ju (김영주). All rights reserved. Designed for Edge AI & Healthcare Safety Innovation.
      </div>
    `;

    // 이메일 복사 클릭 이벤트
    element.querySelector('#footer-btn-copy-email')?.addEventListener('click', () => {
      copyToClipboard(profile.email, `📧 김영주 님의 이메일(${profile.email})이 복사되었습니다!`);
    });

    // 전화번호 복사 클릭 이벤트
    element.querySelector('#footer-btn-copy-phone')?.addEventListener('click', () => {
      copyToClipboard(profile.phone, `📱 김영주 님의 연락처(${profile.phone})가 복사되었습니다!`);
    });

    // 문의 폼 서브밋 이벤트
    element.querySelector('#contact-quick-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const sender = element.querySelector('#contact-sender-name').value;
      element.querySelector('#contact-sender-name').value = '';
      element.querySelector('#contact-sender-msg').value = '';
      showToast(`✉️ ${sender} 님의 소중한 문의 메시지가 성공적으로 전달되었습니다!`, 'success');
    });
  }

  update();
  store.subscribe(update);
  container.appendChild(element);
}
