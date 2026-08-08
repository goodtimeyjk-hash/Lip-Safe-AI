/**
 * Lip-Safe AI & 개인 포트폴리오 - 알림 및 클립보드 복사 유틸리티 모듈
 * 원터치 복사 헬퍼 및 UI 토스트 알림 메시지를 화면에 렌더링합니다.
 * (모든 주석 한글 작성)
 */

/**
 * 전달받은 텍스트를 클립보드에 복사하고 사용자 안내 토스트 팝업을 표시합니다.
 * @param {string} text - 복사할 텍스트 (이메일, 전화번호, 기술 스택)
 * @param {string} successMessage - 성공 완료 시 노출할 안내 메시지
 */
export async function copyToClipboard(text, successMessage = '클립보드에 복사되었습니다!') {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    showToast(successMessage, 'success');
  } catch (err) {
    console.error('클립보드 복사 실패:', err);
    showToast('복사에 실패했습니다. 직접 복사해 주세요.', 'error');
  }
}

/**
 * 화면 우측 하단에 고품질 서리 유리 토스트 알림 팝업을 띄웁니다.
 * @param {string} message - 노출할 알림 메시지 텍스트
 * @param {'info'|'success'|'warning'|'error'} type - 알림 종류 (성공/주의/경고 등)
 * @param {number} duration - 유지 시간 (밀리초 단위, 기본 3000ms)
 */
export function showToast(message, type = 'info', duration = 3000) {
  let toastContainer = document.getElementById('app-toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'app-toast-container';
    toastContainer.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    `;
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.style.cssText = `
    pointer-events: auto;
    padding: 12px 20px;
    border-radius: 10px;
    font-size: 0.9rem;
    font-weight: 600;
    color: #FFFFFF;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(12px);
    display: flex;
    align-items: center;
    gap: 8px;
    transform: translateY(20px);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  `;

  let bgColor = 'rgba(30, 41, 59, 0.95)';
  let borderColor = 'rgba(255, 255, 255, 0.2)';
  let icon = 'ℹ️';

  if (type === 'success') {
    bgColor = 'rgba(225, 29, 72, 0.95)';
    borderColor = 'rgba(244, 63, 94, 0.5)';
    icon = '✅';
  } else if (type === 'warning') {
    bgColor = 'rgba(245, 158, 11, 0.95)';
    borderColor = 'rgba(251, 191, 36, 0.5)';
    icon = '⚠️';
  } else if (type === 'error') {
    bgColor = 'rgba(239, 68, 68, 0.95)';
    borderColor = 'rgba(248, 113, 113, 0.5)';
    icon = '🚨';
  }

  toast.style.background = bgColor;
  toast.style.border = `1px solid ${borderColor}`;
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;

  toastContainer.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
  });

  setTimeout(() => {
    toast.style.transform = 'translateY(10px)';
    toast.style.opacity = '0';
    setTimeout(() => {
      if (toastContainer.contains(toast)) {
        toastContainer.removeChild(toast);
      }
    }, 300);
  }, duration);
}
