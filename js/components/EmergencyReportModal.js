/**
 * UI 컴포넌트: EmergencyReportModal (🚨 112 · 보호자 원터치 GPS 자동 신고 시뮬레이션 모달)
 * 3초 카운트다운 타이머, 현재 위치 GPS 좌표 생성 및 위장 UI 스위칭 토글을 테스트합니다.
 * (모든 주석 한글 작성)
 */
import { store } from '../store.js';
import { showToast } from '../utils/notifications.js';

let countdownTimer = null;

/**
 * 비상 신고 시뮬레이션 모달 컴포넌트를 렌더링합니다.
 * @param {HTMLElement} container - 마운트 대상 컨테이너
 */
export function renderEmergencyReportModal(container) {
  const overlay = document.createElement('div');
  overlay.id = 'emergency-modal-overlay';
  overlay.className = 'modal-overlay';

  overlay.innerHTML = `
    <div class="modal-box" style="border-color: rgba(239, 68, 68, 0.6); box-shadow: 0 0 32px rgba(239, 68, 68, 0.4); text-align: center;">
      <div style="font-size: 3rem; margin-bottom: 12px; animation: pulse-danger 1.5s infinite;">
        🚨
      </div>
      <h3 style="font-size: 1.4rem; font-weight: 800; color: #EF4444; margin-bottom: 8px;">
        112 및 보호자 원터치 GPS 비상 신고
      </h3>
      <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 20px;">
        약물 감지 또는 위급 상황 발생 시 3초 카운트다운 후 경찰청(112) 및 보호자에게 실시간 위성 GPS 위치 정보가 자동 발송됩니다.
      </p>

      <!-- 카운트다운 디스플레이 -->
      <div style="background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: var(--radius-md); padding: 18px; margin-bottom: 20px;">
        <div style="font-size: 0.8rem; color: var(--text-secondary);">자동 위치 전송까지 남은 시간</div>
        <div id="emergency-countdown-display" style="font-size: 3rem; font-weight: 800; color: #EF4444; font-family: var(--font-family-mono); margin: 4px 0;">
          3초
        </div>
        <div style="font-size: 0.75rem; color: var(--color-secondary);">
          📍 현재 GPS 좌표: 위도 37.5665° N / 경도 126.9780° E (자동 수집 중)
        </div>
      </div>

      <!-- 위장 UI 모드 스위치 버튼 -->
      <div style="margin-bottom: 24px; text-align: left; background: rgba(15, 23, 42, 0.6); padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
        <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">
          🛡️ 신변 보호 위장 UI (Camouflage Overlay)
        </div>
        <div style="font-size: 0.75rem; color: var(--text-tertiary);">
          스위치 클릭 시 주변 시선 차단을 위해 일반 뷰티 립스틱 쇼핑몰 앱 화면으로 즉시 오버레이 전환됩니다.
        </div>
      </div>

      <!-- 모달 하단 버튼 모음 -->
      <div style="display: flex; gap: 12px; justify-content: center;">
        <button id="btn-cancel-emergency" class="btn btn-md btn-outline" style="flex: 1;">
          신고 취소 (Cancel)
        </button>
        <button id="btn-force-emergency-send" class="btn btn-md btn-primary" style="flex: 1; background: #EF4444;">
          즉시 전송 (Send Now)
        </button>
      </div>
    </div>
  `;

  // 모달 닫기 / 취소 이벤트
  const closeModal = () => {
    overlay.classList.remove('active');
    if (countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }
  };

  overlay.querySelector('#btn-cancel-emergency')?.addEventListener('click', () => {
    closeModal();
    showToast('비상 신고 시뮬레이션이 취소되었습니다.', 'info');
  });

  // 즉시 전송 버튼 이벤트
  overlay.querySelector('#btn-force-emergency-send')?.addEventListener('click', () => {
    closeModal();
    showToast('🚨 [긴급] 112 경찰청 및 보호자 3인에게 GPS 좌표 전송이 완료되었습니다!', 'error', 4000);
  });

  // 모달 배경 클릭 닫기
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  container.appendChild(overlay);
}
