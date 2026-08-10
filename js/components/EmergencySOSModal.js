/**
 * Lip-Safe AI - 비상 SOS 긴급 대응 모달 (Emergency SOS Modal)
 */
import { store } from '../store.js';
import { startEmergencySiren, stopEmergencySiren } from '../utils/audio.js';

export function renderEmergencySOSModal(container) {
  if (!container) return;

  let isSirenOn = false;
  let countdown = 5;
  let timerId = null;

  const update = () => {
    const activeModal = store.activeModal;

    if (activeModal !== 'sos') {
      stopEmergencySiren();
      if (timerId) clearInterval(timerId);
      container.innerHTML = '';
      return;
    }

    container.innerHTML = `
      <div class="modal-full-overlay">
        <div class="modal-card" style="border-color: var(--color-danger); box-shadow: 0 0 40px rgba(239, 68, 68, 0.6);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 1.6rem;">🚨</span>
              <h3 style="font-size: 1.2rem; font-weight: 900; color: var(--color-danger);">
                112 긴급 비상 SOS 발송 게이트웨이
              </h3>
            </div>
            <button class="popup-close-btn" id="sos-modal-close">✕</button>
          </div>

          <div style="background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.4); border-radius: 14px; padding: 14px; margin-bottom: 16px;">
            <div style="font-size: 0.85rem; font-weight: 800; color: var(--color-danger); margin-bottom: 4px;">
              📍 GPS 실시간 비상 위치 추적 완료
            </div>
            <div style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--text-primary);">
              위도: 37.5665° N | 경도: 126.9780° E (서울특별시 강남구 테헤란로 124 부근)
            </div>
          </div>

          <h4 style="font-size: 0.9rem; font-weight: 800; color: var(--text-gold); margin-bottom: 8px;">
            📱 지정 비상 보호자 자동 발송 목록
          </h4>
          <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px;">
            ${store.emergencyContacts.map(c => `
              <div style="background: rgba(0,0,0,0.5); padding: 10px 14px; border-radius: 10px; display: flex; justify-content: space-between; align-items: center; font-size: 0.82rem;">
                <span>👤 ${c.name} (${c.phone})</span>
                <span style="color: var(--color-success); font-weight: 800;">✓ 전송 준비완료</span>
              </div>
            `).join('')}
          </div>

          <!-- 사이렌 사운드 토글 -->
          <div style="display: flex; gap: 10px; margin-bottom: 16px;">
            <button class="btn btn-md" style="flex: 1; background: ${isSirenOn ? '#DC2626' : 'rgba(255,255,255,0.1)'}; color: #FFF; border: 1px solid var(--color-danger);" id="toggle-siren-btn">
              ${isSirenOn ? '🔊 비상 사이렌 끄기' : '📢 비상 경보 사이렌 울리기'}
            </button>
          </div>

          <div style="display: flex; gap: 10px;">
            <button class="btn btn-lg btn-danger-emergency" style="flex: 1;" id="trigger-112-call">
              📞 112 즉시 경찰 전화 연결
            </button>
            <button class="btn btn-lg btn-outline" style="flex: 1;" id="cancel-sos">
              취소
            </button>
          </div>
        </div>
      </div>
    `;

    container.querySelector('#sos-modal-close')?.addEventListener('click', () => {
      stopEmergencySiren();
      store.closeModal();
    });

    container.querySelector('#cancel-sos')?.addEventListener('click', () => {
      stopEmergencySiren();
      store.closeModal();
    });

    container.querySelector('#toggle-siren-btn')?.addEventListener('click', () => {
      isSirenOn = !isSirenOn;
      if (isSirenOn) startEmergencySiren();
      else stopEmergencySiren();
      update();
    });

    container.querySelector('#trigger-112-call')?.addEventListener('click', () => {
      alert('🚨 112 경찰청 다이렉트 통화 연결을 시도합니다.\n(현재 위치 정보가 전달됩니다)');
    });
  };

  update();
  return store.subscribe(update);
}
