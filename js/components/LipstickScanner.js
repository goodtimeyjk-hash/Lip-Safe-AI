/**
 * Lip-Safe AI - 3D 루비 레드 & 골드 립스틱 통합 AI 판독기 (All-in-One 3D Lipstick Viewport)
 */
import { store } from '../store.js';
import { playScanBeep, playSuccessChime } from '../utils/audio.js';

export function renderLipstickScanner(container) {
  if (!container) return;

  const update = () => {
    const isScanning = store.isScanning;
    const progress = store.scanProgress;
    const isTipColorChanged = store.lipstickTipColorChanged;
    const isLightOn = store.isStudioLightOn;

    if (isScanning && progress % 30 === 0) {
      playScanBeep();
    }
    if (progress === 100) {
      playSuccessChime();
    }

    container.innerHTML = `
      <div class="lipstick-scanner-stage">
        <!-- 상단 좌우 미니멀 퀵 아이콘 컨트롤러 (좌: 데모 시뮬레이션 설정, 우: 5600K 조도 보정 ON/OFF) -->
        <div class="stage-top-actions">
          <button class="top-action-btn" id="top-demo-preset-btn" title="⚙️ 데모 시뮬레이션 설정 (GHB/주의/정상)">
            ⚙️
          </button>
          
          <button class="top-action-btn ${isLightOn ? 'active' : ''}" id="top-light-toggle-btn" title="💡 5600K 스튜디오 조도 보정 ON/OFF">
            💡
          </button>
        </div>

        <!-- 스캔 프로그레스 링 레이저 애니메이션 -->
        <div class="scan-progress-ring ${isScanning ? 'active' : ''}">
          ${isScanning ? `<span style="font-family: var(--font-mono); font-size: 1.5rem; font-weight: 900; color: var(--text-gold); text-shadow: 0 0 15px var(--gold-primary);">${progress}%</span>` : ''}
        </div>

        <!-- 단 하나의 정중앙 3D 루비 레드 & 골드 립스틱 오브제 (카메라 피드 + AI 시약 스캔 + 3D 셔터 버튼) -->
        <div class="lipstick-3d-wrapper ${isScanning ? 'is-scanning' : ''}" id="lipstick-touch-target" title="터치하여 1초 AI 판독 스캔 실행">
          <!-- 1초 AI 광학 스펙트럼 레이저 파형 -->
          <div class="scan-laser-line"></div>

          <!-- 루비 레드 시약 팁 (음료 적심 시 자색/보라색으로 변색) -->
          <div class="lipstick-bullet-tip ${isTipColorChanged ? 'color-changed' : ''}"></div>
          
          <!-- 골드 이너 튜브 -->
          <div class="lipstick-inner-tube"></div>

          <!-- 3D 골드 스퀘어 메인 케이싱 바디 -->
          <div class="lipstick-gold-body">
            <span class="lipstick-brand-label">LIP-SAFE AI</span>
          </div>

          <!-- 바닥 3D 그림자 -->
          <div class="lipstick-shadow"></div>
        </div>

        <!-- 하단 은은한 가이드 텍스트 -->
        <div style="margin-top: 14px; font-size: 0.76rem; font-weight: 700; color: var(--text-gold); letter-spacing: -0.01em; opacity: 0.85;">
          ${isScanning ? '⚡ 1초 온디바이스 AI 광학 스펙트럼 판독 중...' : '💄 3D 립스틱을 터치하면 1초 AI 판독이 작동합니다'}
        </div>
      </div>
    `;

    // 1.0 정중앙 립스틱 터치 시 1초 AI 판독 구동
    const lipstickBtn = container.querySelector('#lipstick-touch-target');
    if (lipstickBtn) {
      lipstickBtn.addEventListener('click', () => {
        if (!store.isScanning) {
          store.startAIScan('random');
        }
      });
    }

    // 2.0 상단 좌측 ⚙️ 데모 시뮬레이션 설정 토글
    const demoBtn = container.querySelector('#top-demo-preset-btn');
    if (demoBtn) {
      demoBtn.addEventListener('click', () => {
        const mode = prompt('🧪 데모 시뮬레이션 모드를 선택하세요:\n1: 🔴 GHB 마약 위험 감지\n2: 🟡 어두운 조명 주의\n3: 🟢 정상 안전 음료', '1');
        if (mode === '1') store.startAIScan('danger');
        else if (mode === '2') store.startAIScan('warning');
        else if (mode === '3') store.startAIScan('safe');
      });
    }

    // 3.0 상단 우측 💡 5600K 조도 보정 토글
    const lightBtn = container.querySelector('#top-light-toggle-btn');
    if (lightBtn) {
      lightBtn.addEventListener('click', () => {
        store.toggleStudioLight();
      });
    }
  };

  update();
  return store.subscribe(update);
}
