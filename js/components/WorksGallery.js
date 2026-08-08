/**
 * UI 컴포넌트: WorksGallery (작업물/프로젝트 갤러리 컴포넌트)
 * 메인 Lip-Safe AI 서비스 페이지에 동적으로 등록된 작업물(프로젝트) 카드를 렌더링합니다.
 * (모든 주석 한글 작성)
 */
import { store } from '../store.js';
import { copyToClipboard, showToast } from '../utils/notifications.js';

export function renderWorksGallery(container) {
  const element = document.createElement('section');
  element.className = 'glass-card';
  element.id = 'works-gallery-section';
  element.style.marginTop = '32px';

  function update() {
    const { projects, isAdmin } = store;

    element.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 12px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 1.25rem;">📁</span>
            <h2 style="font-size: 1.35rem; font-weight: 800; color: var(--text-primary);">
              Lip-Safe AI 주요 관련 작업물 & 프로젝트
            </h2>
            <span class="badge badge-primary" style="font-size: 0.75rem;">총 ${projects.length}개</span>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 4px;">
            제작자 김영주 님이 구축한 엣지AI, 이미지 전처리 및 긴급 신고 시스템 작업물 라이브러리
          </p>
        </div>

        ${isAdmin ? `
          <button id="btn-gallery-open-admin" class="btn btn-sm btn-primary" style="font-weight: 700;">
            ⚙️ 관리자 페이지에서 작업물 관리하기 ➔
          </button>
        ` : ''}
      </div>

      ${projects.length === 0 ? `
        <div style="text-align: center; padding: 48px 16px; background: rgba(15, 23, 42, 0.4); border-radius: var(--radius-md); border: 1px dashed var(--border-subtle);">
          <div style="font-size: 2.5rem; margin-bottom: 12px;">📭</div>
          <p style="font-size: 0.95rem; color: var(--text-secondary);">등록된 작업물이 없습니다.</p>
          ${isAdmin ? `<p style="font-size: 0.8rem; color: var(--color-primary); margin-top: 6px;">관리자 페이지에서 첫 번째 작업물을 등록해 보세요!</p>` : ''}
        </div>
      ` : `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">
          ${projects.map(project => `
            <div class="card-work-item" style="background: rgba(15, 23, 42, 0.7); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); overflow: hidden; display: flex; flex-direction: column; transition: transform 0.2s ease, border-color 0.2s ease;">
              <!-- 카드 상단 대표 이미지 -->
              <div style="position: relative; width: 100%; height: 170px; overflow: hidden; background: #1e293b;">
                <img src="${project.thumbnail}" alt="${project.title}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80'" />
                <div style="position: absolute; top: 12px; left: 12px; display: flex; gap: 6px; flex-wrap: wrap;">
                  <span class="badge badge-secondary" style="font-size: 0.7rem; background: rgba(6, 182, 212, 0.9);">${project.category}</span>
                </div>
                <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(4px); padding: 3px 8px; border-radius: 4px; font-size: 0.7rem; color: var(--text-tertiary);">
                  📅 ${project.period}
                </div>
              </div>

              <!-- 카드 바디 정보 -->
              <div style="padding: 20px; display: flex; flex-direction: column; flex: 1; justify-content: space-between;">
                <div>
                  <h3 style="font-size: 1.1rem; font-weight: 800; color: var(--text-primary); margin-bottom: 8px;">
                    ${project.title}
                  </h3>
                  <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 16px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                    ${project.summary}
                  </p>

                  <!-- 기술 스택 태그 목록 -->
                  <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 20px;">
                    ${(project.tags || []).map(tag => `
                      <span style="font-size: 0.72rem; padding: 3px 8px; background: rgba(139, 92, 246, 0.15); border: 1px solid rgba(139, 92, 246, 0.3); color: #c084fc; border-radius: 4px; font-weight: 600;">
                        # ${tag}
                      </span>
                    `).join('')}
                  </div>
                </div>

                <!-- 하단 작업물 링크 및 관리자 전용 삭제/수정 액션 -->
                <div style="display: flex; justify-content: space-between; align-items: center; pt: 12px; border-top: 1px solid rgba(255,255,255,0.06); gap: 8px;">
                  <a href="${project.link}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-outline" style="font-size: 0.8rem; text-decoration: none;">
                    🔗 프로젝트 링크 ➔
                  </a>

                  ${isAdmin ? `
                    <div style="display: flex; gap: 6px;">
                      <button data-delete-id="${project.id}" class="btn-delete-work btn btn-sm btn-outline" style="padding: 4px 8px; color: var(--color-danger); border-color: rgba(225, 29, 72, 0.4);" title="작업물 삭제">
                        🗑️ 삭제
                      </button>
                    </div>
                  ` : ''}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    `;

    // 관리자 페이지 버튼 클릭 시 대시보드 오픈
    element.querySelector('#btn-gallery-open-admin')?.addEventListener('click', () => {
      const adminContainer = document.getElementById('admin-dashboard-container');
      if (adminContainer) {
        adminContainer.scrollIntoView({ behavior: 'smooth' });
      }
    });

    // 관리자 빠른 삭제 버튼 이벤트
    element.querySelectorAll('.btn-delete-work').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-delete-id');
        if (confirm('이 작업물을 삭제하시겠습니까? (로컬스토리지에 즉시 반영됩니다)')) {
          store.deleteProject(id);
          showToast('🗑️ 작업물이 성공적으로 삭제되었습니다.', 'info');
        }
      });
    });
  }

  update();
  store.subscribe(update);
  container.appendChild(element);
}
