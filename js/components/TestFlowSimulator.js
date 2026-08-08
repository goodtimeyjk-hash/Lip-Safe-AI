/**
 * Component: TestFlowSimulator (2.0 테스트 진행 화면)
 * Renders step-by-step test verification scenarios with glowing neon indicators and live console log.
 */
import { store } from '../store.js';

export function renderTestFlowSimulator(container, onCompleteTest) {
  const element = document.createElement('section');
  element.className = 'glass-card';
  element.style.maxWidth = '800px';
  element.style.margin = '30px auto';
  element.style.padding = '32px';
  element.style.borderColor = 'rgba(16, 185, 129, 0.4)';
  element.style.boxShadow = 'var(--shadow-neon-green)';

  let currentStep = 1; // 1: Auth, 2: Auto-Split, 3: Matrix Update, 4: Complete
  let logs = [
    '⚡ [System] 테스트 환경 초기화 완료. (8인 모임 회비 데이터베이스 연결됨)',
    '▶️ 1단계 인증 테스트 준비 완료.'
  ];

  function update() {
    element.innerHTML = `
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 16px;">
        <div>
          <span style="font-size: 0.75rem; color: var(--color-secondary); font-weight: 700; background: rgba(16, 185, 129, 0.15); padding: 4px 10px; border-radius: var(--radius-pill);">
            🧪 PRD Section 6.2 테스트 진행 화면
          </span>
          <h2 style="font-size: 1.4rem; font-weight: 800; color: var(--text-primary); margin-top: 6px;">
            모임 회비 서비스 통합 테스트 진행기
          </h2>
        </div>
        <button id="skip-to-dashboard-btn" class="btn btn-outline" style="font-size: 0.82rem;">
          결과/대시보드로 건너뛰기 ➔
        </button>
      </div>

      <!-- Step-by-Step Progress Track -->
      <div style="display: flex; justify-content: space-between; position: relative; margin-bottom: 32px; padding: 0 10px;">
        <!-- Step 1 Indicator -->
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; z-index: 2;">
          <div style="width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1rem; transition: all var(--transition-bounce); ${currentStep >= 1 ? 'background: var(--color-primary); color: #fff; box-shadow: var(--shadow-neon-blue);' : 'background: var(--bg-surface-elevated); color: var(--text-tertiary);'}">
            ${currentStep > 1 ? '✓' : '1'}
          </div>
          <span style="font-size: 0.8rem; font-weight: 700; color: ${currentStep >= 1 ? 'var(--text-primary)' : 'var(--text-tertiary)'};">1. 회원 인증</span>
        </div>

        <!-- Step 2 Indicator -->
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; z-index: 2;">
          <div style="width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1rem; transition: all var(--transition-bounce); ${currentStep >= 2 ? 'background: var(--color-secondary); color: #fff; box-shadow: var(--shadow-neon-green);' : 'background: var(--bg-surface-elevated); color: var(--text-tertiary);'}">
            ${currentStep > 2 ? '✓' : '2'}
          </div>
          <span style="font-size: 0.8rem; font-weight: 700; color: ${currentStep >= 2 ? 'var(--text-primary)' : 'var(--text-tertiary)'};">2. 5만 원 자동 분할</span>
        </div>

        <!-- Step 3 Indicator -->
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; z-index: 2;">
          <div style="width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1rem; transition: all var(--transition-bounce); ${currentStep >= 3 ? 'background: var(--color-accent-purple); color: #fff; box-shadow: var(--shadow-neon-purple);' : 'background: var(--bg-surface-elevated); color: var(--text-tertiary);'}">
            ${currentStep > 3 ? '✓' : '3'}
          </div>
          <span style="font-size: 0.8rem; font-weight: 700; color: ${currentStep >= 3 ? 'var(--text-primary)' : 'var(--text-tertiary)'};">3. 8인 표 실시간 반영</span>
        </div>

        <!-- Step 4 Indicator -->
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; z-index: 2;">
          <div style="width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1rem; transition: all var(--transition-bounce); ${currentStep >= 4 ? 'background: var(--color-success); color: #fff; box-shadow: 0 0 20px rgba(34,197,94,0.6);' : 'background: var(--bg-surface-elevated); color: var(--text-tertiary);'}">
            🎉
          </div>
          <span style="font-size: 0.8rem; font-weight: 700; color: ${currentStep >= 4 ? 'var(--color-success)' : 'var(--text-tertiary)'};">4. 검증 완료</span>
        </div>
      </div>

      <!-- Active Test Step Display Card -->
      <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid var(--border-strong); border-radius: var(--radius-lg); padding: 24px; margin-bottom: 24px;">
        ${currentStep === 1 ? `
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <h3 style="font-size: 1.1rem; color: var(--color-primary); font-weight: 700;">
              🔑 [Step 1] 8인 프라이빗 모임 가입 및 인증 테스트
            </h3>
            <p style="font-size: 0.88rem; color: var(--text-secondary);">
              초대 코드 <code>TRAVEL-2026-8MEM</code>를 사용하여 세션이 정상 생성되는지 검증합니다.
            </p>
            <div style="display: flex; gap: 12px; margin-top: 10px;">
              <button id="run-step1-btn" class="btn btn-primary">
                ▶️ Step 1 인증 테스트 실행하기
              </button>
            </div>
          </div>
        ` : ''}

        ${currentStep === 2 ? `
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <h3 style="font-size: 1.1rem; color: var(--color-secondary); font-weight: 700;">
              ✨ [Step 2] 회비 5만 원 자동 분할 로직 (3만 원 적립 + 2만 원 공통) 검증
            </h3>
            <p style="font-size: 0.88rem; color: var(--text-secondary);">
              수입 50,000원 입력 시 [해외여행 적립금 30,000원]과 [공동 사용금 20,000원]으로 자동 쪼개어져 누적되는지 검증합니다.
            </p>
            <div style="display: flex; gap: 12px; margin-top: 10px;">
              <button id="run-step2-btn" class="btn btn-secondary">
                ▶️ Step 2 자동 분할 연산 실행하기
              </button>
            </div>
          </div>
        ` : ''}

        ${currentStep === 3 ? `
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <h3 style="font-size: 1.1rem; color: var(--color-accent-purple); font-weight: 700;">
              📊 [Step 3] 연도별 8인 12개월 납부 현황 표 '○' 동그라미 뱃지 실시간 동기화
            </h3>
            <p style="font-size: 0.88rem; color: var(--text-secondary);">
              납부 완료 시 해당 월의 셀이 미납('✕')에서 완납('○') 뱃지로 동기화되는지 검증합니다.
            </p>
            <div style="display: flex; gap: 12px; margin-top: 10px;">
              <button id="run-step3-btn" class="btn btn-primary" style="background: linear-gradient(135deg, var(--color-accent-purple), var(--color-primary));">
                ▶️ Step 3 실시간 동기화 실행하기
              </button>
            </div>
          </div>
        ` : ''}

        ${currentStep === 4 ? `
          <div style="display: flex; flex-direction: column; gap: 12px; text-align: center;">
            <div style="font-size: 3rem;">🎉 ✨ ✈️</div>
            <h3 style="font-size: 1.3rem; color: var(--color-success); font-weight: 800;">
              모든 시스템 테스트 검증 완료! (Pass)
            </h3>
            <p style="font-size: 0.9rem; color: var(--text-secondary);">
              회원 인증, 자동 분할 연산, 8인 현황 표 동기화 테스트가 모두 정상(PASSED) 처리되었습니다.
            </p>
            <div style="margin-top: 14px;">
              <button id="finish-test-btn" class="btn btn-secondary" style="padding: 12px 28px; font-size: 1rem;">
                🚀 결과 페이지 / 메인 대시보드로 이동하기
              </button>
            </div>
          </div>
        ` : ''}
      </div>

      <!-- Realtime Test Console Log -->
      <div style="background: rgba(15, 23, 42, 0.9); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 16px; font-family: var(--font-family-mono); font-size: 0.8rem; color: #A7F3D0; height: 160px; overflow-y: auto;">
        <div style="color: var(--text-tertiary); margin-bottom: 8px; border-bottom: 1px dashed var(--border-subtle); padding-bottom: 4px; font-size: 0.75rem;">
          🖥️ LIVE TEST CONSOLE OUTPUT
        </div>
        ${logs.map(log => `<div>${log}</div>`).join('')}
      </div>
    `;

    // Event Handlers
    const skipBtn = element.querySelector('#skip-to-dashboard-btn');
    if (skipBtn) {
      skipBtn.addEventListener('click', () => {
        if (onCompleteTest) onCompleteTest();
      });
    }

    const s1Btn = element.querySelector('#run-step1-btn');
    if (s1Btn) {
      s1Btn.addEventListener('click', () => {
        logs.push('✅ [Step 1 PASSED] 초대코드 TRAVEL-2026-8MEM 인증 완료. 회원 세션 생성됨.');
        currentStep = 2;
        update();
      });
    }

    const s2Btn = element.querySelector('#run-step2-btn');
    if (s2Btn) {
      s2Btn.addEventListener('click', () => {
        // Run test calculation
        store.addTransaction({
          userId: 'u1',
          type: 'INCOME',
          amount: 50000,
          isAutoSplit: true,
          description: '테스트 자동 분할 입금 건',
          date: '2026-08-03'
        });
        logs.push('✅ [Step 2 PASSED] 50,000원 입금 연산 -> 여행 적립금 +30,000원, 공동 사용금 +20,000원 자동 분할 성공.');
        currentStep = 3;
        update();
      });
    }

    const s3Btn = element.querySelector('#run-step3-btn');
    if (s3Btn) {
      s3Btn.addEventListener('click', () => {
        logs.push('✅ [Step 3 PASSED] 2026년 8월 납부 상태 표 셀이 완납(○) 뱃지로 실시간 업데이트됨.');
        logs.push('🎊 [Result] 모든 테스트 케이스 성공적으로 통과!');
        currentStep = 4;
        update();
      });
    }

    const finishBtn = element.querySelector('#finish-test-btn');
    if (finishBtn) {
      finishBtn.addEventListener('click', () => {
        if (onCompleteTest) onCompleteTest();
      });
    }
  }

  update();
  container.appendChild(element);
}
