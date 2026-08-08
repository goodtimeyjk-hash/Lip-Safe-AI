/**
 * UI 컴포넌트: AdminEditModal (관리자 로그인 & 라이브 CMS 편집 모달 컴포넌트)
 * 관리자(김영주 님) 세션 로그인 및 프로필 문구, 기술 스택을 실시간 편집하여 DB에 반영합니다.
 * (모든 주석 한글 작성)
 */
import { store } from '../store.js';
import { showToast } from '../utils/notifications.js';

/**
 * 관리자 CMS 로그인 모달 및 프로필 편집 모달을 렌더링합니다.
 * @param {HTMLElement} container - 마운트 대상 컨테이너
 */
export function renderAdminEditModal(container) {
  // 1. 관리자 비밀번호 로그인 팝업 모달
  const loginOverlay = document.createElement('div');
  loginOverlay.id = 'admin-modal-overlay';
  loginOverlay.className = 'modal-overlay';

  loginOverlay.innerHTML = `
    <div class="modal-box">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary);">
          ⚙️ 관리자 본인 인증 (Supabase Auth)
        </h3>
        <button id="btn-close-admin-modal" class="btn btn-sm btn-outline" style="padding: 4px 8px;">✕</button>
      </div>
      <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 20px;">
        김영주 님만 프로필/기술 스택을 편집할 수 있는 관리자 세션입니다.<br>
        (테스트 암호: <code style="color: var(--color-primary);">admin1234</code> 또는 <code style="color: var(--color-primary);">youngju2026</code>)
      </p>

      <form id="admin-login-form">
        <div class="form-group">
          <label class="form-label">관리자 비밀번호</label>
          <input type="password" id="input-admin-password" class="form-input" placeholder="비밀번호를 입력하세요..." required />
        </div>
        <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 24px;">
          <button type="button" id="btn-cancel-admin-login" class="btn btn-md btn-outline">취소</button>
          <button type="submit" class="btn btn-md btn-primary">인증 및 로그인 ➔</button>
        </div>
      </form>
    </div>
  `;

  // 2. 관리자 프로필 라이브 편집 CMS 모달
  const editOverlay = document.createElement('div');
  editOverlay.id = 'edit-cms-modal-overlay';
  editOverlay.className = 'modal-overlay';

  const updateEditForm = () => {
    const { profile } = store;
    editOverlay.innerHTML = `
      <div class="modal-box" style="max-width: 600px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--color-primary);">
            ✏️ 프로필 & 기술 스택 라이브 CMS 편집
          </h3>
          <button id="btn-close-edit-cms" class="btn btn-sm btn-outline" style="padding: 4px 8px;">✕</button>
        </div>

        <form id="cms-edit-form">
          <div class="form-group">
            <label class="form-label">성명</label>
            <input type="text" id="cms-input-name" class="form-input" value="${profile.name}" required />
          </div>

          <div class="form-group">
            <label class="form-label">대표 개발자 타이틀</label>
            <input type="text" id="cms-input-title" class="form-input" value="${profile.title}" required />
          </div>

          <div class="form-group">
            <label class="form-label">브랜드 한 줄 슬로건</label>
            <textarea id="cms-input-slogan" class="form-textarea" rows="3" required>${profile.slogan}</textarea>
          </div>

          <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 24px;">
            <button type="button" id="btn-cancel-edit-cms" class="btn btn-md btn-outline">취소</button>
            <button type="submit" class="btn btn-md btn-primary">💾 DB에 동기화 저장</button>
          </div>
        </form>
      </div>
    `;

    // CMS 모달 닫기
    editOverlay.querySelector('#btn-close-edit-cms')?.addEventListener('click', () => editOverlay.classList.remove('active'));
    editOverlay.querySelector('#btn-cancel-edit-cms')?.addEventListener('click', () => editOverlay.classList.remove('active'));

    // CMS 저장 폼 서브밋 이벤트
    editOverlay.querySelector('#cms-edit-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const updated = {
        name: editOverlay.querySelector('#cms-input-name').value,
        title: editOverlay.querySelector('#cms-input-title').value,
        slogan: editOverlay.querySelector('#cms-input-slogan').value
      };
      store.updateProfile(updated);
      editOverlay.classList.remove('active');
      showToast('💾 프로필 변경사항이 Supabase DB에 동기화 저장되었습니다!', 'success');
    });
  };

  updateEditForm();
  store.subscribe(updateEditForm);

  // 로그인 폼 서브밋 이벤트
  loginOverlay.querySelector('#admin-login-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const pwdInput = loginOverlay.querySelector('#input-admin-password');
    const pwd = pwdInput ? pwdInput.value : '';

    if (store.loginAdmin(pwd)) {
      loginOverlay.classList.remove('active');
      if (pwdInput) pwdInput.value = '';
      showToast('👑 관리자 김영주 님으로 인증되었습니다. 관리자 전용 대시보드가 활성화되었습니다.', 'success');

      // 관리자 대시보드 위치로 자동 포커싱 이동
      const adminContainer = document.getElementById('admin-dashboard-container');
      if (adminContainer) {
        adminContainer.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      showToast('비밀번호가 올바르지 않습니다. (admin1234 또는 youngju2026)', 'error');
    }
  });

  // 모달 닫기 제어
  const closeLogin = () => loginOverlay.classList.remove('active');
  loginOverlay.querySelector('#btn-close-admin-modal')?.addEventListener('click', closeLogin);
  loginOverlay.querySelector('#btn-cancel-admin-login')?.addEventListener('click', closeLogin);

  container.appendChild(loginOverlay);
  container.appendChild(editOverlay);
}
