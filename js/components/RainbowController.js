/**
 * Lip-Safe AI - 립스틱 하단 무지개 색상 동그라미 버튼 (7가지 스마트 컨트롤러)
 */
import { store } from '../store.js';

export function renderRainbowController(container) {
  if (!container) return;

  const update = () => {
    const isLightOn = store.isStudioLightOn;

    container.innerHTML = `
      <div class="rainbow-controller-container">
        <!-- 🔴 Red: 위험 성분 (GHB) 검출 데모 & SOS -->
        <button class="rainbow-circle-btn btn-red" id="btn-rainbow-red" title="🔴 Red: GHB 위험 성분 검출 데모 & SOS">
          <span style="font-size: 0.7rem; font-weight: 900; color: #FFF;">🔴</span>
        </button>

        <!-- 🟠 Orange: 미세 반응 & 재촬영 주의사항 -->
        <button class="rainbow-circle-btn btn-orange" id="btn-rainbow-orange" title="🟠 Orange: 미세 반응 및 재촬영 주의사항 확인">
          <span style="font-size: 0.7rem; font-weight: 900; color: #FFF;">🟠</span>
        </button>

        <!-- 🟡 Yellow: 5600K 스튜디오 조도 보정 라이트 ON/OFF -->
        <button class="rainbow-circle-btn btn-yellow ${isLightOn ? 'active' : ''}" id="btn-rainbow-yellow" title="🟡 Yellow: 5600K 스튜디오 조도 보정 라이트 ON/OFF">
          <span style="font-size: 0.7rem; font-weight: 900; color: #FFF;">💡</span>
        </button>

        <!-- 🟢 Green: 정상 음료 판독 안내 -->
        <button class="rainbow-circle-btn btn-green" id="btn-rainbow-green" title="🟢 Green: 정상 음료 판독 결과 안내">
          <span style="font-size: 0.7rem; font-weight: 900; color: #FFF;">🟢</span>
        </button>

        <!-- 🔵 Blue: 1초 AI 카메라 스캔 실행 -->
        <button class="rainbow-circle-btn btn-blue" id="btn-rainbow-blue" title="🔵 Blue: 1초 Fast AI 스캔 실행">
          <span style="font-size: 0.7rem; font-weight: 900; color: #FFF;">📷</span>
        </button>

        <!-- 🟣 Indigo: 온디바이스 AI 스펙트럼 분석 기술 정보 -->
        <button class="rainbow-circle-btn btn-indigo" id="btn-rainbow-indigo" title="🟣 Indigo: 온디바이스 AI 광학 스펙트럼 엔진 기술 정보">
          <span style="font-size: 0.7rem; font-weight: 900; color: #FFF;">🧠</span>
        </button>

        <!-- 🔮 Violet: 비상 핫라인 & 시약 주문 -->
        <button class="rainbow-circle-btn btn-violet" id="btn-rainbow-violet" title="🔮 Violet: 비상 핫라인 설정 & 교체용 시약 주문">
          <span style="font-size: 0.7rem; font-weight: 900; color: #FFF;">🔮</span>
        </button>
      </div>
    `;

    // 7가지 스마트 컨트롤러 리스너 연결
    container.querySelector('#btn-rainbow-red')?.addEventListener('click', () => {
      store.startAIScan('danger');
    });

    container.querySelector('#btn-rainbow-orange')?.addEventListener('click', () => {
      store.openModal('precisionGuide');
    });

    container.querySelector('#btn-rainbow-yellow')?.addEventListener('click', () => {
      store.toggleStudioLight();
    });

    container.querySelector('#btn-rainbow-green')?.addEventListener('click', () => {
      store.startAIScan('safe');
    });

    container.querySelector('#btn-rainbow-blue')?.addEventListener('click', () => {
      store.startAIScan('random');
    });

    container.querySelector('#btn-rainbow-indigo')?.addEventListener('click', () => {
      store.openModal('techInfo');
    });

    container.querySelector('#btn-rainbow-violet')?.addEventListener('click', () => {
      store.openModal('reagentOrder');
    });
  };

  update();
  return store.subscribe(update);
}
