/**
 * Lip-Safe AI - 🟣 Indigo: 온디바이스 AI 광학 스펙트럼 엔진 기술 명세 모달
 */
import { store } from '../store.js';

export function renderSpectrumTechModal(container) {
  if (!container) return;

  const update = () => {
    const activeModal = store.activeModal;

    if (activeModal !== 'techInfo' && activeModal !== 'precisionGuide') {
      container.innerHTML = '';
      return;
    }

    const isTech = activeModal === 'techInfo';

    container.innerHTML = `
      <div class="modal-full-overlay">
        <div class="modal-card" style="border-color: ${isTech ? 'var(--rainbow-indigo)' : 'var(--rainbow-orange)'};">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 1.5rem;">${isTech ? '🟣' : '🟠'}</span>
              <h3 style="font-size: 1.15rem; font-weight: 900; color: var(--text-primary);">
                ${isTech ? '온디바이스 AI 광학 스펙트럼 엔진' : '미세 반응 & 재촬영 주의사항'}
              </h3>
            </div>
            <button class="popup-close-btn" id="tech-modal-close">✕</button>
          </div>

          ${isTech ? `
            <div style="background: rgba(88, 86, 214, 0.15); border: 1px solid rgba(88, 86, 214, 0.4); border-radius: 14px; padding: 14px; margin-bottom: 14px; font-size: 0.82rem; line-height: 1.5;">
              <h4 style="color: var(--rainbow-indigo); margin-bottom: 6px;">🧠 99.4% 신뢰도 온디바이스 신경망 (MobileNetV3)</h4>
              <p>서버 연동 없는 오프라인 온디바이스 엣지 연산으로, 네트워크가 차단된 지하 클럽 및 음영 구역에서도 1초 만에 시약 팁의 변색 파장($\\Delta\\lambda$)을 광학 분석합니다.</p>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px;">
              <div style="background: rgba(0,0,0,0.5); padding: 12px; border-radius: 12px; font-size: 0.78rem;">
                <div style="color: var(--text-gold); font-weight: 800;">판독 타겟 약물</div>
                <div>GHB(물뽕), 케타민, 필로폰, 코카인, MDMA 5종</div>
              </div>
              <div style="background: rgba(0,0,0,0.5); padding: 12px; border-radius: 12px; font-size: 0.78rem;">
                <div style="color: var(--text-gold); font-weight: 800;">조도 보정 특허</div>
                <div>5600K 파장 스페셜라이트 앰비언트 엔진</div>
              </div>
            </div>
          ` : `
            <div style="background: rgba(255, 149, 0, 0.15); border: 1px solid rgba(255, 149, 0, 0.4); border-radius: 14px; padding: 14px; margin-bottom: 14px; font-size: 0.82rem; line-height: 1.5;">
              <h4 style="color: var(--rainbow-orange); margin-bottom: 6px;">🟠 미세 변색 반응 촬영 가이드</h4>
              <p>음료 적심 후 1초 간 기다린 뒤, 립스틱 스틱 시약 팁이 카메라 중앙 가이드 링 안에 오도록 위치시켜 주세요.</p>
            </div>

            <ul style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.6; padding-left: 20px; margin-bottom: 16px;">
              <li>립스틱 시약 팁을 음료에 1초 간 살짝 적십니다.</li>
              <li>클럽 내부가 지나치게 어두운 경우 🟡 노란색 버튼을 눌러 조도를 보정하세요.</li>
              <li>약한 미세 반응 시 5초 후 재촬영을 권장합니다.</li>
            </ul>
          `}

          <button class="btn btn-lg btn-primary" style="width: 100%;" id="tech-modal-confirm">
            확인 완료
          </button>
        </div>
      </div>
    `;

    container.querySelector('#tech-modal-close')?.addEventListener('click', () => store.closeModal());
    container.querySelector('#tech-modal-confirm')?.addEventListener('click', () => store.closeModal());
  };

  update();
  return store.subscribe(update);
}
