/**
 * UI 컴포넌트: AdminDashboard (관리자 전용 페이지 대시보드 컴포넌트)
 * PRD(prd.md) 및 디자인 가이드라인(design.md)을 준수하여 제작자 김영주 님이
 * 소개 문구, 보유 기술 태그, 관련 작업물(프로젝트) CRUD를 수행하고 로컬스토리지에 저장합니다.
 * (모든 주석 한글 작성)
 */
import { store } from '../store.js';
import { showToast } from '../utils/notifications.js';

export function renderAdminDashboard(container) {
  const element = document.createElement('section');
  element.id = 'admin-dashboard-container';
  element.className = 'glass-card admin-dashboard-card';
  element.style.marginTop = '32px';
  element.style.border = '1px solid rgba(225, 29, 72, 0.4)';
  element.style.boxShadow = '0 0 25px rgba(225, 29, 72, 0.15)';

  let currentTab = 'works'; // 기본 활성 탭: 'works' (작업물 CRUD)
  let editingProjectId = null; // 수정 중인 작업물 ID

  function update() {
    const { isAdmin, profile, metrics, projects } = store;

    // 관리자가 아닌 경우 안내 카드로 대체
    if (!isAdmin) {
      element.innerHTML = `
        <div style="text-align: center; padding: 40px 20px;">
          <div style="font-size: 3rem; margin-bottom: 12px;">🔒</div>
          <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary);">
            관리자 전용 대시보드 접근 제한
          </h3>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 8px 0 20px;">
            상단 헤더의 <code style="color: var(--color-primary);">⚙️ 관리자 로그인</code> 버튼을 눌러 인증을 진행해 주세요.
          </p>
          <button id="btn-admin-access-login" class="btn btn-md btn-primary">
            ⚙️ 관리자 로그인하기 ➔
          </button>
        </div>
      `;

      element.querySelector('#btn-admin-access-login')?.addEventListener('click', () => {
        const modal = document.getElementById('admin-modal-overlay');
        if (modal) modal.classList.add('active');
      });
      return;
    }

    element.innerHTML = `
      <!-- 관리자 대시보드 헤더 바 -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 16px;">
        <div>
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 1.4rem;">⚙️</span>
            <h2 style="font-size: 1.4rem; font-weight: 800; color: var(--color-primary);">
              Lip-Safe AI 관리자 전용 대시보드 페이지
            </h2>
            <span class="badge badge-primary">제작자 김영주</span>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 4px;">
            소개 프로필, 보유 기술 태그, 서비스 작업물(프로젝트) CRUD 관리 & 로컬스토리지 영구 동기화
          </p>
        </div>

        <!-- 상단 제어 액션 버튼 모음 -->
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button id="btn-admin-save-storage" class="btn btn-sm btn-primary" style="font-weight: 700;">
            💾 로컬스토리지 저장
          </button>
          <button id="btn-admin-reset-data" class="btn btn-sm btn-outline" style="color: var(--color-warning); border-color: rgba(245, 158, 11, 0.4);">
            🔄 초기 데이터로 복원
          </button>
          <button id="btn-admin-return-public" class="btn btn-sm btn-outline">
            🏠 메인 서비스 뷰로 돌아가기
          </button>
          <button id="btn-admin-dashboard-logout" class="btn btn-sm btn-outline" style="color: var(--color-danger); border-color: rgba(225, 29, 72, 0.4);">
            🔒 로그아웃
          </button>
        </div>
      </div>

      <!-- 4개 서브 탭 네비게이션 -->
      <div style="display: flex; gap: 8px; margin-bottom: 24px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 12px; overflow-x: auto;">
        <button data-tab="works" class="admin-tab-btn btn btn-sm ${currentTab === 'works' ? 'btn-primary' : 'btn-outline'}">
          📁 1. 작업물 / 프로젝트 CRUD (${projects.length})
        </button>
        <button data-tab="profile" class="admin-tab-btn btn btn-sm ${currentTab === 'profile' ? 'btn-primary' : 'btn-outline'}">
          👤 2. 제작자 소개 & 프로필 수정
        </button>
        <button data-tab="skills" class="admin-tab-btn btn btn-sm ${currentTab === 'skills' ? 'btn-primary' : 'btn-outline'}">
          🛠️ 3. 보유 기술 스택 태그 관리 (${profile.skills.length})
        </button>
        <button data-tab="metrics" class="admin-tab-btn btn btn-sm ${currentTab === 'metrics' ? 'btn-primary' : 'btn-outline'}">
          📊 4. 실증 데이터 수치 관리
        </button>
      </div>

      <!-- 탭 패널 컨테이너 -->
      <div id="admin-tab-content">
        ${renderTabContent(currentTab, profile, metrics, projects, editingProjectId)}
      </div>

      <!-- 하단 데이터 동기화 상태 바 -->
      <div style="margin-top: 28px; padding-top: 16px; border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; color: var(--text-tertiary); flex-wrap: wrap; gap: 10px;">
        <div>
          🟢 로컬스토리지 저장 키: <code style="color: var(--color-secondary);">lip_safe_app_data</code> (작업물 ${projects.length}개 / 기술 ${profile.skills.length}개)
        </div>
        <div>
          실시간 동기화 상태: <span style="color: #10b981; font-weight: 700;">정상 구동 중</span>
        </div>
      </div>
    `;

    // 탭 전환 이벤트 바인딩
    element.querySelectorAll('.admin-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        currentTab = e.currentTarget.getAttribute('data-tab');
        update();
      });
    });

    // 로컬스토리지 저장 버튼 클릭
    element.querySelector('#btn-admin-save-storage')?.addEventListener('click', () => {
      if (store.saveToLocalStorage()) {
        showToast('💾 변경된 모든 데이터가 로컬스토리지에 저장되었습니다!', 'success');
      }
    });

    // 초기 데이터 복원 버튼 클릭
    element.querySelector('#btn-admin-reset-data')?.addEventListener('click', () => {
      if (confirm('초기 기본 데이터로 복원하시겠습니까? (로컬스토리지 내용이 초기화됩니다)')) {
        store.resetToDefaultData();
        editingProjectId = null;
        showToast('🔄 초기 시동 데이터로 복원되었습니다.', 'info');
      }
    });

    // 메인 서비스 뷰로 돌아가기
    element.querySelector('#btn-admin-return-public')?.addEventListener('click', () => {
      const mainHeader = document.getElementById('header-container');
      if (mainHeader) mainHeader.scrollIntoView({ behavior: 'smooth' });
    });

    // 관리자 로그아웃
    element.querySelector('#btn-admin-dashboard-logout')?.addEventListener('click', () => {
      store.logoutAdmin();
      showToast('🔒 관리자 세션이 로그아웃되었습니다.', 'info');
    });

    // 탭별 이벤트 처리 바인딩
    bindTabEvents(element, currentTab, editingProjectId, (newEditingId) => {
      editingProjectId = newEditingId;
      update();
    });
  }

  update();
  store.subscribe(update);
  container.appendChild(element);
}

/**
 * 탭 선택에 따른 서브 HTML 템플릿 렌더링
 */
function renderTabContent(activeTab, profile, metrics, projects, editingProjectId) {
  if (activeTab === 'profile') {
    return `
      <div style="background: rgba(15, 23, 42, 0.6); padding: 24px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
        <h3 style="font-size: 1.1rem; font-weight: 800; color: var(--text-primary); margin-bottom: 16px;">
          👤 제작자 소개 & 기본 정보 수정
        </h3>
        <form id="admin-form-profile">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; margin-bottom: 16px;">
            <div class="form-group">
              <label class="form-label">성명</label>
              <input type="text" id="admin-input-name" class="form-input" value="${profile.name}" required />
            </div>
            <div class="form-group">
              <label class="form-label">이메일</label>
              <input type="email" id="admin-input-email" class="form-input" value="${profile.email}" required />
            </div>
            <div class="form-group">
              <label class="form-label">연락처</label>
              <input type="text" id="admin-input-phone" class="form-input" value="${profile.phone}" required />
            </div>
            <div class="form-group">
              <label class="form-label">GitHub URL</label>
              <input type="url" id="admin-input-github" class="form-input" value="${profile.github}" required />
            </div>
          </div>

          <div class="form-group" style="margin-bottom: 16px;">
            <label class="form-label">대표 타이틀</label>
            <input type="text" id="admin-input-title" class="form-input" value="${profile.title}" required />
          </div>

          <div class="form-group" style="margin-bottom: 20px;">
            <label class="form-label">브랜드 한 줄 슬로건</label>
            <textarea id="admin-input-slogan" class="form-textarea" rows="3" required>${profile.slogan}</textarea>
          </div>

          <button type="submit" class="btn btn-md btn-primary">
            💾 제작자 프로필 수정 및 로컬스토리지 저장
          </button>
        </form>
      </div>
    `;
  }

  if (activeTab === 'skills') {
    return `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">
        <!-- 신규 기술 스택 추가 폼 -->
        <div style="background: rgba(15, 23, 42, 0.6); padding: 24px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <h3 style="font-size: 1.1rem; font-weight: 800; color: var(--text-primary); margin-bottom: 16px;">
            ➕ 신규 보유 기술 태그 추가
          </h3>
          <form id="admin-form-add-skill">
            <div class="form-group" style="margin-bottom: 14px;">
              <label class="form-label">기술명</label>
              <input type="text" id="admin-input-skill-name" class="form-input" placeholder="예: TensorFlow Lite, Flutter..." required />
            </div>
            <div class="form-group" style="margin-bottom: 20px;">
              <label class="form-label">카테고리</label>
              <select id="admin-select-skill-category" class="form-select">
                <option value="AI/ML">AI / ML</option>
                <option value="Mobile">Mobile App</option>
                <option value="Algorithm">Algorithm</option>
                <option value="Web">Web Frontend</option>
                <option value="Backend">Backend / DB</option>
                <option value="Design">Design System</option>
              </select>
            </div>
            <button type="submit" class="btn btn-md btn-primary" style="width: 100%;">
              ✨ 기술 태그 추가하기
            </button>
          </form>
        </div>

        <!-- 현재 등록된 기술 태그 목록 -->
        <div style="background: rgba(15, 23, 42, 0.6); padding: 24px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <h3 style="font-size: 1.1rem; font-weight: 800; color: var(--text-primary); margin-bottom: 16px;">
            🛠️ 등록된 기술 태그 (${profile.skills.length}개)
          </h3>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${profile.skills.map(skill => `
              <div style="display: flex; align-items: center; gap: 6px; background: rgba(30, 41, 59, 0.9); border: 1px solid var(--border-subtle); padding: 6px 10px; border-radius: 6px;">
                <span style="font-size: 0.8rem; font-weight: 700; color: var(--color-primary);">${skill.name}</span>
                <span style="font-size: 0.65rem; color: var(--text-tertiary); font-weight: 600;">[${skill.category}]</span>
                <button data-delete-skill="${skill.name}" class="btn-delete-skill" style="background: none; border: none; color: var(--text-tertiary); cursor: pointer; font-size: 0.8rem; margin-left: 4px;" title="삭제">✕</button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  if (activeTab === 'metrics') {
    return `
      <div style="background: rgba(15, 23, 42, 0.6); padding: 24px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); max-width: 600px;">
        <h3 style="font-size: 1.1rem; font-weight: 800; color: var(--text-primary); margin-bottom: 16px;">
          📊 Lip-Safe AI 실증 데이터 수치 수정
        </h3>
        <form id="admin-form-metrics">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
            <div class="form-group">
              <label class="form-label">판독 정확도 (%)</label>
              <input type="number" step="0.1" id="admin-input-accuracy" class="form-input" value="${metrics.accuracy}" required />
            </div>
            <div class="form-group">
              <label class="form-label">평균 연산 속도 (초)</label>
              <input type="number" step="0.1" id="admin-input-response-time" class="form-input" value="${metrics.responseTime}" required />
            </div>
            <div class="form-group">
              <label class="form-label">동시 감지 마약 (종)</label>
              <input type="number" id="admin-input-drug-count" class="form-input" value="${metrics.drugTypesCount}" required />
            </div>
            <div class="form-group">
              <label class="form-label">어두운 조명 성공률 (%)</label>
              <input type="number" step="0.1" id="admin-input-lowlight-acc" class="form-input" value="${metrics.lowLightAccuracy}" required />
            </div>
          </div>
          <button type="submit" class="btn btn-md btn-primary">
            💾 실증 수치 저장 및 로컬스토리지 동기화
          </button>
        </form>
      </div>
    `;
  }

  // 기본 탭: 'works' (작업물 CRUD)
  const targetEditProject = projects.find(p => p.id === editingProjectId);

  return `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 24px;">
      <!-- 작업물 입력/수정 폼 -->
      <div style="background: rgba(15, 23, 42, 0.6); padding: 24px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h3 style="font-size: 1.1rem; font-weight: 800; color: ${targetEditProject ? 'var(--color-warning)' : 'var(--color-primary)'};">
            ${targetEditProject ? '✏️ 작업물 수정 모드' : '✨ 신규 서비스 작업물 등록'}
          </h3>
          ${targetEditProject ? `
            <button id="btn-cancel-project-edit" class="btn btn-sm btn-outline" style="padding: 2px 8px;">취소</button>
          ` : ''}
        </div>

        <form id="admin-form-project">
          <div class="form-group" style="margin-bottom: 14px;">
            <label class="form-label">작업물 / 프로젝트명</label>
            <input type="text" id="proj-input-title" class="form-input" placeholder="예: Lip-Safe AI On-Device Mobile App" value="${targetEditProject ? targetEditProject.title : ''}" required />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px;">
            <div class="form-group">
              <label class="form-label">카테고리</label>
              <input type="text" id="proj-input-category" class="form-input" placeholder="예: Mobile AI & Healthcare" value="${targetEditProject ? targetEditProject.category : 'Mobile AI & Healthcare'}" required />
            </div>
            <div class="form-group">
              <label class="form-label">수행 기간</label>
              <input type="text" id="proj-input-period" class="form-input" placeholder="예: 2026.01 - 2026.08" value="${targetEditProject ? targetEditProject.period : '2026.08'}" required />
            </div>
          </div>

          <div class="form-group" style="margin-bottom: 14px;">
            <label class="form-label">기술 스택 태그 (쉼표로 구분)</label>
            <input type="text" id="proj-input-tags" class="form-input" placeholder="예: Flutter, TFLite, OpenCV, iOS/Android" value="${targetEditProject ? (targetEditProject.tags || []).join(', ') : 'Flutter, TFLite, OpenCV'}" required />
          </div>

          <div class="form-group" style="margin-bottom: 14px;">
            <label class="form-label">대표 이미지 / 썸네일 URL</label>
            <input type="url" id="proj-input-thumbnail" class="form-input" placeholder="https://images.unsplash.com/..." value="${targetEditProject ? targetEditProject.thumbnail : ''}" required />
          </div>

          <div class="form-group" style="margin-bottom: 14px;">
            <label class="form-label">프로젝트 URL / GitHub 링크</label>
            <input type="url" id="proj-input-link" class="form-input" placeholder="https://github.com/youngju-kim/..." value="${targetEditProject ? targetEditProject.link : ''}" required />
          </div>

          <div class="form-group" style="margin-bottom: 20px;">
            <label class="form-label">작업물 요약 및 주요 설명</label>
            <textarea id="proj-input-summary" class="form-textarea" rows="3" placeholder="작업물의 핵심 기능과 기술적 성과를 기술하세요..." required>${targetEditProject ? targetEditProject.summary : ''}</textarea>
          </div>

          <button type="submit" class="btn btn-md ${targetEditProject ? 'btn-primary' : 'btn-primary'}" style="width: 100%; font-weight: 800;">
            ${targetEditProject ? '💾 작업물 수정사항 반영' : '➕ 신규 작업물 추가 및 로컬스토리지 저장'}
          </button>
        </form>
      </div>

      <!-- 작업물 관리 목록 -->
      <div style="background: rgba(15, 23, 42, 0.6); padding: 24px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); display: flex; flex-direction: column;">
        <h3 style="font-size: 1.1rem; font-weight: 800; color: var(--text-primary); margin-bottom: 16px;">
          📋 등록된 작업물 목록 (${projects.length}개)
        </h3>

        <div style="display: flex; flex-direction: column; gap: 12px; overflow-y: auto; max-height: 480px; padding-right: 4px;">
          ${projects.map(proj => `
            <div style="background: rgba(30, 41, 59, 0.7); border: 1px solid ${proj.id === editingProjectId ? 'var(--color-primary)' : 'var(--border-subtle)'}; padding: 14px; border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center; gap: 12px;">
              <div style="display: flex; gap: 12px; align-items: center;">
                <img src="${proj.thumbnail}" alt="${proj.title}" style="width: 48px; height: 48px; object-fit: cover; border-radius: 6px;" onerror="this.src='https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200'" />
                <div>
                  <div style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary);">${proj.title}</div>
                  <div style="font-size: 0.75rem; color: var(--text-tertiary); margin-top: 2px;">
                    ${proj.category} | 📅 ${proj.period}
                  </div>
                </div>
              </div>

              <div style="display: flex; gap: 6px;">
                <button data-edit-proj-id="${proj.id}" class="btn-edit-proj-item btn btn-sm btn-outline" style="padding: 4px 8px;">
                  ✏️ 수정
                </button>
                <button data-delete-proj-id="${proj.id}" class="btn-delete-proj-item btn btn-sm btn-outline" style="padding: 4px 8px; color: var(--color-danger); border-color: rgba(225,29,72,0.4);">
                  🗑️ 삭제
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

/**
 * 탭별 서브 폼 서브밋 & 삭제 액션 이벤트 등록
 */
function bindTabEvents(element, activeTab, editingProjectId, setEditingId) {
  if (activeTab === 'profile') {
    element.querySelector('#admin-form-profile')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const updated = {
        name: element.querySelector('#admin-input-name').value,
        title: element.querySelector('#admin-input-title').value,
        slogan: element.querySelector('#admin-input-slogan').value,
        email: element.querySelector('#admin-input-email').value,
        phone: element.querySelector('#admin-input-phone').value,
        github: element.querySelector('#admin-input-github').value
      };
      store.updateProfile(updated);
      showToast('💾 제작자 프로필이 수정되고 로컬스토리지에 저장되었습니다!', 'success');
    });
  }

  if (activeTab === 'skills') {
    element.querySelector('#admin-form-add-skill')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = element.querySelector('#admin-input-skill-name');
      const categorySelect = element.querySelector('#admin-select-skill-category');
      if (nameInput && nameInput.value.trim()) {
        const added = store.addSkill(nameInput.value.trim(), categorySelect.value);
        if (added) {
          nameInput.value = '';
          showToast('✨ 새 기술 태그가 추가되어 로컬스토리지에 저장되었습니다!', 'success');
        } else {
          showToast('이미 존재하는 기술 태그입니다.', 'error');
        }
      }
    });

    element.querySelectorAll('.btn-delete-skill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const name = e.currentTarget.getAttribute('data-delete-skill');
        store.deleteSkill(name);
        showToast(`🗑️ '${name}' 기술 태그가 삭제되었습니다.`, 'info');
      });
    });
  }

  if (activeTab === 'metrics') {
    element.querySelector('#admin-form-metrics')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const updated = {
        accuracy: parseFloat(element.querySelector('#admin-input-accuracy').value),
        responseTime: parseFloat(element.querySelector('#admin-input-response-time').value),
        drugTypesCount: parseInt(element.querySelector('#admin-input-drug-count').value, 10),
        lowLightAccuracy: parseFloat(element.querySelector('#admin-input-lowlight-acc').value)
      };
      store.updateMetrics(updated);
      showToast('📊 실증 데이터 수치가 업데이트되어 로컬스토리지에 저장되었습니다!', 'success');
    });
  }

  if (activeTab === 'works') {
    element.querySelector('#admin-form-project')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const projectData = {
        title: element.querySelector('#proj-input-title').value,
        category: element.querySelector('#proj-input-category').value,
        period: element.querySelector('#proj-input-period').value,
        tags: element.querySelector('#proj-input-tags').value,
        thumbnail: element.querySelector('#proj-input-thumbnail').value,
        link: element.querySelector('#proj-input-link').value,
        summary: element.querySelector('#proj-input-summary').value
      };

      if (editingProjectId) {
        store.updateProject(editingProjectId, projectData);
        setEditingId(null);
        showToast('💾 작업물 내용이 수정되어 로컬스토리지에 저장되었습니다!', 'success');
      } else {
        store.addProject(projectData);
        showToast('✨ 신규 서비스 작업물이 추가되어 로컬스토리지에 저장되었습니다!', 'success');
      }
    });

    element.querySelector('#btn-cancel-project-edit')?.addEventListener('click', () => {
      setEditingId(null);
    });

    element.querySelectorAll('.btn-edit-proj-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-edit-proj-id');
        setEditingId(id);
      });
    });

    element.querySelectorAll('.btn-delete-proj-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-delete-proj-id');
        if (confirm('이 작업물을 삭제하시겠습니까?')) {
          store.deleteProject(id);
          if (editingProjectId === id) setEditingId(null);
          showToast('🗑️ 작업물이 삭제되었습니다.', 'info');
        }
      });
    });
  }
}
