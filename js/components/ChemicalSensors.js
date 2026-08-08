/**
 * UI 컴포넌트: ChemicalSensors (5종 마약 동시 감지 변색 색상 칩)
 * GHB, 케타민, 메스암페타민, 코카인, MDMA 5종의 화학 센싱 변색 칩을 시각화합니다.
 * (모든 주석 한글 작성)
 */
import { store } from '../store.js';

/**
 * 5종 마약 감지 색상 칩 컴포넌트를 렌더링합니다.
 * @param {HTMLElement} container - 마운트 대상 컨테이너
 */
export function renderChemicalSensors(container) {
  const element = document.createElement('section');
  element.className = 'glass-card';

  function update() {
    const { chemicalSensors } = store;

    const chipsHtml = chemicalSensors.map(chip => `
      <div class="sensor-chip" style="--chip-color: ${chip.color};">
        <div class="sensor-dot"></div>
        <div style="flex: 1;">
          <div style="font-size: 0.88rem; font-weight: 700; color: var(--text-primary);">${chip.name}</div>
          <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 2px;">${chip.status}</div>
          <div style="font-size: 0.7rem; color: var(--text-tertiary); margin-top: 2px;">${chip.desc}</div>
        </div>
      </div>
    `).join('');

    element.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
        <div>
          <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary);">
            🧪 립스틱 스틱 5종 마약 동시 감지 변색 센서
          </h3>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 2px;">
            단일 마약 감지 시판 키트 대비 2.5배 넓은 스펙트럼의 5종 약물 동시 반응 센싱
          </p>
        </div>

        <span style="background: rgba(225, 29, 72, 0.15); color: var(--color-primary); border: 1px solid var(--border-glow-rose); padding: 4px 12px; border-radius: var(--radius-pill); font-size: 0.78rem; font-weight: 700;">
          5-in-1 Simultaneous Detection
        </span>
      </div>

      <!-- 5종 마약 변색 색상 칩 그리드 -->
      <div class="sensor-chips-grid">
        ${chipsHtml}
      </div>
    `;
  }

  update();
  store.subscribe(update);
  container.appendChild(element);
}
