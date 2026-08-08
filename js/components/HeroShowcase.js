/**
 * UI 컴포넌트: HeroShowcase (Lip-Safe AI 메인 히어로 쇼케이스 및 핵심 성과 지표)
 * 립스틱 형태 감지 스틱 키 비주얼, 99.2% 판독 정확도 카운터 카드 및 0.3초 오프라인 연산 지표를 렌더링합니다.
 * (모든 주석 한글 작성)
 */
import { store } from '../store.js';

/**
 * 히어로 쇼케이스 컴포넌트를 렌더링합니다.
 * @param {HTMLElement} container - 마운트될 대상 컨테이너
 */
export function renderHeroShowcase(container) {
  const element = document.createElement('section');
  element.className = 'glass-card';
  element.style.borderColor = 'rgba(225, 29, 72, 0.4)';
  element.style.boxShadow = 'var(--shadow-neon-rose)';

  function update() {
    const accuracyStr = store.getAccuracyString();
    const responseTimeStr = store.getResponseTimeString();

    element.innerHTML = `
      <!-- 쇼케이스 헤더 배너 -->
      <div style="text-align: center; margin-bottom: 32px;">
        <span style="background: rgba(225, 29, 72, 0.15); color: var(--color-primary); border: 1px solid var(--border-glow-rose); padding: 6px 16px; border-radius: var(--radius-pill); font-size: 0.85rem; font-weight: 800; display: inline-block; margin-bottom: 12px;">
          🚀 MAIN PROJECT SHOWCASE
        </span>
        <h2 style="font-size: 1.8rem; font-weight: 800; color: var(--text-primary); margin-bottom: 8px;">
          Lip-Safe AI (립스틱형 마약 감지 스틱 & 엣지AI 앱)
        </h2>
        <p style="font-size: 0.95rem; color: var(--text-secondary); max-width: 720px; margin: 0 auto;">
          클럽 및 밤길 어두운 조도 환경에서 무색무취 성범죄 약물을 0.3초 만에 판독하고, 위기 상황 발생 시 112 및 보호자에게 원터치 GPS 자동 신고를 수행하는 통합 시스템입니다.
        </p>
      </div>

      <!-- 3D 립스틱 스틱 키 비주얼 & 핵심 정량 성과 지표 4종 카드 -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 32px;">
        <!-- 카운터 카드 1: 판독 정확도 -->
        <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 20px; text-align: center;">
          <div style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 600;">🎯 AI 판독 정확도</div>
          <div style="font-size: 2rem; font-weight: 800; color: var(--color-primary); font-family: var(--font-family-mono); margin: 6px 0;">
            ${accuracyStr}
          </div>
          <div style="font-size: 0.75rem; color: var(--text-tertiary);">어두운 조명(10 lux 이하) 보정 연산</div>
        </div>

        <!-- 카운터 카드 2: 오프라인 연산 속도 -->
        <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 20px; text-align: center;">
          <div style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 600;">⚡ 온디바이스 연산 속도</div>
          <div style="font-size: 2rem; font-weight: 800; color: var(--color-secondary); font-family: var(--font-family-mono); margin: 6px 0;">
            ${responseTimeStr}
          </div>
          <div style="font-size: 0.75rem; color: var(--text-tertiary);">네트워크 미연결 100% 독립 구동</div>
        </div>

        <!-- 카운터 카드 3: 동시 감지 약물 종수 -->
        <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 20px; text-align: center;">
          <div style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 600;">🧪 동시 감지 마약 종수</div>
          <div style="font-size: 2rem; font-weight: 800; color: var(--color-accent-purple); font-family: var(--font-family-mono); margin: 6px 0;">
            5종 동시
          </div>
          <div style="font-size: 0.75rem; color: var(--text-tertiary);">GHB, 케타민, 메스암페타민 등</div>
        </div>

        <!-- 카운터 카드 4: 비상 자동 신고 속도 -->
        <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 20px; text-align: center;">
          <div style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 600;">🚨 112 자동 신고 연동</div>
          <div style="font-size: 2rem; font-weight: 800; color: #EF4444; font-family: var(--font-family-mono); margin: 6px 0;">
            3초 원터치
          </div>
          <div style="font-size: 0.75rem; color: var(--text-tertiary);">GPS 현재 위치 자동 발송 & 위장 UI</div>
        </div>
      </div>

      <!-- 하단 액션 버튼 모음 (112 신고 시뮬레이션 & 시뮤레이터 이동) -->
      <div style="display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;">
        <button id="btn-trigger-emergency-modal" class="btn btn-lg btn-danger-emergency">
          🚨 112 원터치 GPS 자동 신고 시뮬레이션
        </button>
        <a href="#sec-edge-ai" class="btn btn-lg btn-secondary">
          🧪 온디바이스 엣지AI 판독 연산 보기 ➔
        </a>
      </div>
    `;

    // 112 긴급 신고 시뮬레이션 모달 열기 이벤트
    element.querySelector('#btn-trigger-emergency-modal')?.addEventListener('click', () => {
      const modal = document.getElementById('emergency-modal-overlay');
      if (modal) modal.classList.add('active');
    });
  }

  update();
  store.subscribe(update);
  container.appendChild(element);
}
