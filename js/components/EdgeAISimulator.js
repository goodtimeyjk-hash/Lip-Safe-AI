/**
 * UI 컴포넌트: EdgeAISimulator (온디바이스 엣지AI 판독 연산 시뮬레이터)
 * 조도(Lux) 조절 슬라이더 및 오프라인 0.3초 판독 AI 알고리즘 연산을 조율합니다.
 * (모든 주석 한글 작성)
 */
import { store } from '../store.js';
import { showToast } from '../utils/notifications.js';

/**
 * 엣지AI 판독 시뮬레이터 컴포넌트를 렌더링합니다.
 * @param {HTMLElement} container - 마운트 대상 컨테이너
 */
export function renderEdgeAISimulator(container) {
  const element = document.createElement('section');
  element.id = 'sec-edge-ai';
  element.className = 'glass-card';

  function update() {
    const { currentLux, metrics } = store;
    const isDarkEnv = currentLux <= 15;

    element.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
        <div>
          <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary);">
            🧪 온디바이스 엣지AI 어두운 조명 자동 보정 파이프라인
          </h3>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 2px;">
            클럽/음영 환경에서도 서버 전송 없이 스마트폰 자체 칩셋(TFLite/TensorRT)으로 0.3초 오프라인 판독
          </p>
        </div>

        <span style="background: rgba(139, 92, 246, 0.2); color: var(--color-accent-purple); border: 1px solid rgba(139, 92, 246, 0.4); padding: 6px 14px; border-radius: var(--radius-pill); font-size: 0.8rem; font-weight: 700;">
          📱 On-Device Local Model (Zero Cloud)
        </span>
      </div>

      <!-- 인터랙티브 조명 조도(Lux) 조절 제어기 -->
      <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid var(--border-subtle); padding: 20px; border-radius: var(--radius-md); margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <label style="font-size: 0.9rem; font-weight: 700; color: var(--text-primary);">
            💡 주변 환경 조도 조절 (현재: <strong style="color: ${isDarkEnv ? 'var(--color-primary)' : 'var(--color-secondary)'};">${currentLux} Lux</strong> - ${isDarkEnv ? '딥 클럽/어두운 음영' : '일반 조명'})
          </label>
          <span style="font-size: 0.78rem; color: var(--text-tertiary);">0 Lux (암흑) ~ 100 Lux (밝음)</span>
        </div>

        <input type="range" id="lux-range-slider" min="0" max="100" value="${currentLux}" style="width: 100%; accent-color: var(--color-primary); cursor: pointer;" />
      </div>

      <!-- AI 판독 처리 시각화 파이프라인 시뮬레이션 카드 -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-bottom: 20px;">
        <!-- 파이프라인 Step 1: 원본 카메라인풋 -->
        <div style="background: rgba(15, 23, 42, 0.6); padding: 18px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <div style="font-size: 0.82rem; color: var(--text-secondary); font-weight: 700; margin-bottom: 8px;">
            Step 1. 원본 이미지 획득 (Raw Camera)
          </div>
          <div style="height: 120px; background: ${isDarkEnv ? 'rgba(5, 8, 16, 0.95)' : 'rgba(30, 41, 59, 0.5)'}; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; color: var(--text-tertiary); font-size: 0.85rem; border: 1px dashed var(--border-strong);">
            ${isDarkEnv ? '🌑 어두운 이미지 (Low-contrast Signal)' : '☀️ 일반 조명 스캔 이미지'}
          </div>
        </div>

        <!-- 파이프라인 Step 2: AI 조명 보정 알고리즘 -->
        <div style="background: rgba(15, 23, 42, 0.6); padding: 18px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <div style="font-size: 0.82rem; color: var(--color-secondary); font-weight: 700; margin-bottom: 8px;">
            Step 2. AI 어두운 조명 자동 보정 연산
          </div>
          <div style="height: 120px; background: rgba(6, 182, 212, 0.1); border: 1px solid rgba(6, 182, 212, 0.3); border-radius: var(--radius-sm); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; padding: 12px; text-align: center;">
            <span style="font-size: 0.82rem; font-weight: 700; color: var(--color-secondary);">
              ✨ Histogram Equalization Engine
            </span>
            <span style="font-size: 0.75rem; color: var(--text-secondary);">
              명암비 4.2배 복원 완료 (성공률 ${metrics.lowLightAccuracy}%)
            </span>
          </div>
        </div>

        <!-- 파이프라인 Step 3: TFLite 판독결과 -->
        <div style="background: rgba(15, 23, 42, 0.6); padding: 18px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <div style="font-size: 0.82rem; color: var(--color-primary); font-weight: 700; margin-bottom: 8px;">
            Step 3. 0.3초 온디바이스 판독 완료
          </div>
          <div style="height: 120px; background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.4); border-radius: var(--radius-sm); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;">
            <span style="font-size: 1.5rem;">✅</span>
            <span style="font-size: 0.9rem; font-weight: 800; color: var(--color-success);">
              음성 (안전한 상태)
            </span>
            <span style="font-size: 0.72rem; color: var(--text-tertiary);">신뢰도 score: 99.2%</span>
          </div>
        </div>
      </div>

      <!-- 테스트 실행 버튼 -->
      <button id="btn-run-ai-test" class="btn btn-md btn-secondary" style="width: 100%;">
        🧪 0.3초 온디바이스 엣지AI 판독 시뮬레이션 실행하기
      </button>
    `;

    // 조도 슬라이더 체인지 이벤트
    const slider = element.querySelector('#lux-range-slider');
    if (slider) {
      slider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        store.setAmbientLux(val);
      });
    }

    // AI 판독 시뮬레이션 실행 버튼 이벤트
    element.querySelector('#btn-run-ai-test')?.addEventListener('click', () => {
      showToast('⚡ 0.3초 오프라인 TFLite 판독 연산이 성공적으로 완료되었습니다! (정확도 99.2%)', 'success');
    });
  }

  update();
  store.subscribe(update);
  container.appendChild(element);
}
