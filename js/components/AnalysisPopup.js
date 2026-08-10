/**
 * Lip-Safe AI - 립스틱 화면 위 '성분 분석 팝업' (Overlay Analysis Result Popup)
 */
import { store } from '../store.js';

export function renderAnalysisPopup(container) {
  if (!container) return;

  const update = () => {
    const popup = store.activePopup;

    if (!popup) {
      container.innerHTML = '';
      return;
    }

    const { status, title, drugName, confidence, wavelengthDelta, beforeColor, afterColor, message, lightLux } = popup;

    let actionBtnHTML = '';
    if (status === 'danger') {
      actionBtnHTML = `
        <button class="popup-action-btn btn-danger-emergency" id="popup-sos-trigger">
          🚨 비상 SOS 긴급 신고 연동 실행
        </button>
      `;
    } else if (status === 'warning') {
      actionBtnHTML = `
        <button class="popup-action-btn" style="background: linear-gradient(135deg, #F59E0B, #D97706); color: #FFF;" id="popup-light-trigger">
          🟡 5600K 스튜디오 조도 보정 켜기 (재촬영)
        </button>
      `;
    } else {
      actionBtnHTML = `
        <button class="popup-action-btn" style="background: linear-gradient(135deg, #10B981, #059669); color: #FFF;" id="popup-confirm-trigger">
          🟢 안심 음용 확인 완료
        </button>
      `;
    }

    container.innerHTML = `
      <div class="analysis-popup-container status-${status}">
        <div class="popup-header">
          <span class="popup-status-pill">
            ${status === 'danger' ? '🔴 위험 (Danger)' : status === 'warning' ? '🟡 주의 (Warning)' : '🟢 정상 (Safe)'}
          </span>
          <button class="popup-close-btn" id="popup-close-btn" title="팝업 닫기">✕</button>
        </div>

        <h4 style="font-size: 0.95rem; font-weight: 800; color: var(--text-primary); margin-bottom: 4px;">
          ${title}
        </h4>
        
        <p style="font-size: 0.78rem; color: var(--text-secondary); line-height: 1.4;">
          ${message}
        </p>

        <!-- 시약 변색 전/후 비교 컬러 닷 (Before / After Color Shift) -->
        <div class="color-comparison-row">
          <div class="color-dot-item">
            <div class="color-dot" style="background: ${beforeColor}; color: ${beforeColor};"></div>
            <span>적시기 전</span>
          </div>

          <span class="arrow-icon">➔</span>

          <div class="color-dot-item">
            <div class="color-dot" style="background: ${afterColor}; color: ${afterColor};"></div>
            <span>적신 후 변색</span>
          </div>

          <div style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-gold); text-align: right;">
            <div>신뢰도: <b>${confidence}%</b></div>
            <div>변색: <b>+${wavelengthDelta}nm</b></div>
            <div>조도: <b>${lightLux} lux</b></div>
          </div>
        </div>

        ${actionBtnHTML}
      </div>
    `;

    // 이벤트 리스너
    const closeBtn = container.querySelector('#popup-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', () => store.closePopup());

    const sosTrigger = container.querySelector('#popup-sos-trigger');
    if (sosTrigger) {
      sosTrigger.addEventListener('click', () => {
        store.closePopup();
        store.openModal('sos');
      });
    }

    const lightTrigger = container.querySelector('#popup-light-trigger');
    if (lightTrigger) {
      lightTrigger.addEventListener('click', () => {
        store.toggleStudioLight();
        store.closePopup();
        store.startAIScan('random');
      });
    }

    const confirmTrigger = container.querySelector('#popup-confirm-trigger');
    if (confirmTrigger) {
      confirmTrigger.addEventListener('click', () => store.closePopup());
    }
  };

  update();
  return store.subscribe(update);
}
