/**
 * Component: LoadingScreen (3.0 로딩 화면)
 * Renders glassmorphic loading screen with animated spinner, progress gauge bar, and dynamic message sequence.
 */

export function renderLoadingScreen(container, onLoadingFinished) {
  const element = document.createElement('section');
  element.className = 'glass-card';
  element.style.maxWidth = '520px';
  element.style.margin = '60px auto';
  element.style.padding = '40px 32px';
  element.style.textAlign = 'center';
  element.style.borderColor = 'rgba(59, 130, 246, 0.5)';
  element.style.boxShadow = 'var(--shadow-neon-blue)';

  const messages = [
    '🔐 8인 프라이빗 모임 인증 정보 검증 중...',
    '⚡ 회원 회비 (5만 원 ➔ 여행 3만 / 공통 2만) 자동 분할 연산 중...',
    '📊 연도별 8인 × 12개월 납부 현황 표 데이터 동기화 중...',
    '🎉 모든 계산 완료! 메인 대시보드로 이동합니다...'
  ];

  let currentMsgIdx = 0;
  let progress = 0;

  element.innerHTML = `
    <!-- Glowing Spinner Container -->
    <div style="position: relative; width: 88px; height: 88px; margin: 0 auto 24px auto; display: flex; align-items: center; justify-content: center;">
      <!-- CSS Animated Pulse Circle -->
      <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; border: 4px solid rgba(59, 130, 246, 0.15); border-top-color: var(--color-primary); border-right-color: var(--color-accent-cyan); animation: spin 1s infinite linear;"></div>
      <!-- Center Plane Icon -->
      <div style="font-size: 2.2rem; animation: float-plane 2s infinite ease-in-out;">✈️</div>
    </div>

    <h2 style="font-size: 1.35rem; font-weight: 800; color: var(--text-primary); margin-bottom: 8px;">
      3.0 서비스 로딩 및 데이터 연산 중
    </h2>

    <div id="loading-msg" style="font-size: 0.88rem; color: var(--color-primary); font-weight: 600; min-height: 24px; margin-bottom: 20px;">
      ${messages[0]}
    </div>

    <!-- Progress Gauge Bar -->
    <div class="progress-track" style="height: 12px; margin-bottom: 8px;">
      <div id="loading-bar-fill" class="progress-fill" style="width: 0%; background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));"></div>
    </div>

    <div id="loading-pct" style="font-size: 0.8rem; color: var(--text-secondary); font-family: var(--font-family-mono); text-align: right; font-weight: 700;">
      0%
    </div>

    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes float-plane {
        0%, 100% { transform: translateY(0) scale(1); }
        50% { transform: translateY(-6px) scale(1.1); }
      }
    </style>
  `;

  container.appendChild(element);

  // Interval timer to simulate loading progress
  const barFill = element.querySelector('#loading-bar-fill');
  const pctText = element.querySelector('#loading-pct');
  const msgText = element.querySelector('#loading-msg');

  const interval = setInterval(() => {
    progress += 5;
    if (progress > 100) progress = 100;

    if (barFill) barFill.style.width = progress + '%';
    if (pctText) pctText.innerText = progress + '%';

    if (progress >= 25 && progress < 55) {
      currentMsgIdx = 1;
    } else if (progress >= 55 && progress < 85) {
      currentMsgIdx = 2;
    } else if (progress >= 85) {
      currentMsgIdx = 3;
    }

    if (msgText) msgText.innerText = messages[currentMsgIdx];

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        if (onLoadingFinished) onLoadingFinished();
      }, 500);
    }
  }, 100);
}
