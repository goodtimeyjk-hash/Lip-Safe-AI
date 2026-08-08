/**
 * UI 컴포넌트: Header (상단 브랜딩 헤더 및 관리자 세션 제어)
 * Lip-Safe AI 서비스 상단 브랜딩, ⚙️ 관리자 CMS 로그인 버튼 및 🛡️ 위장 UI 모드 스위치를 제공합니다.
 * (모든 주석 한글 작성)
 */
import { store } from '../store.js';
import { showToast } from '../utils/notifications.js';

/**
 * 상단 헤더 컴포넌트를 렌더링하고 상태 변화를 구독합니다.
 * @param {HTMLElement} container - 헤더가 삽입될 HTML 컨테이너 요소
 */
export function renderHeader(container) {
  const element = document.createElement('header');
  element.className = 'header-bar';

  function update() {
    const { isAdmin, camouflagedMode } = store;

    element.innerHTML = `
      <!-- 서비스 상단 로고 및 개발자 성명 -->
      <a href="#" class="header-logo">
        <div class="header-logo-icon">💄</div>
        <div>
          <span class="header-title-text">Lip-Safe AI</span>
          <div style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 600;">
            제작자: 김영주 | On-Device Edge AI
          </div>
        </div>
      </a>

      <!-- 헤더 우측 액션 버튼 모음 (관리자 로그인, 위장 UI 모드 토글) -->
      <div class="header-actions">
        <!-- 🛡️ 위장 UI 모드 토글 스위치 -->
        <button id="btn-toggle-camo" class="btn btn-sm ${camouflagedMode ? 'btn-primary' : 'btn-outline'}" title="위기 상황 시 일반 뷰티 립스틱 앱 화면으로 위장 오버레이">
          ${camouflagedMode ? '💄 뷰티 모드 활성화됨' : '🛡️ 위장 UI 모드'}
        </button>

        <!-- ⚙️ 관리자 CMS 로그인 / 로그아웃 버튼 -->
        ${isAdmin ? `
          <button id="btn-admin-logout" class="btn btn-sm btn-outline" style="border-color: var(--color-primary); color: var(--color-primary);">
            🔒 관리자 로그아웃 (김영주)
          </button>
        ` : `
          <button id="btn-admin-login" class="btn btn-sm btn-outline">
            ⚙️ 관리자 로그인
          </button>
        `}
      </div>
    `;

    // 위장 UI 모드 토글 이벤트 연결
    element.querySelector('#btn-toggle-camo')?.addEventListener('click', () => {
      store.toggleCamouflageMode();
      if (store.camouflagedMode) {
        showToast('💄 일반 뷰티 립스틱 쇼핑몰 화면으로 위장 오버레이 전환되었습니다.', 'warning');
      } else {
        showToast('🛡️ 메인 Lip-Safe AI 화면으로 복귀되었습니다.', 'info');
      }
    });

    // 관리자 로그인 클릭 ➔ 모달 열기
    element.querySelector('#btn-admin-login')?.addEventListener('click', () => {
      const modal = document.getElementById('admin-modal-overlay');
      if (modal) modal.classList.add('active');
    });

    // 관리자 로그아웃 클릭
    element.querySelector('#btn-admin-logout')?.addEventListener('click', () => {
      store.logoutAdmin();
      showToast('🔒 관리자 세션이 로그아웃되었습니다.', 'info');
    });
  }

  update();
  store.subscribe(update);
  container.appendChild(element);
}
