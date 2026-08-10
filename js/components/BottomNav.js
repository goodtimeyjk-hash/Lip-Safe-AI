/**
 * Lip-Safe AI - 하단 4개 스마트 내비게이션 바 (Bottom Navigation Bar)
 */
import { store } from '../store.js';

export function renderBottomNav(container) {
  if (!container) return;

  const update = () => {
    const activeTab = store.activeTab;

    container.innerHTML = `
      <div class="bottom-nav-bar">
        <!-- 1.0 립스틱 셔터 (메인 AI 스캐너) -->
        <button class="nav-item ${activeTab === 'shutter' ? 'active' : ''}" id="nav-item-shutter">
          <span class="nav-icon">📷</span>
          <span>립스틱 셔터</span>
        </button>

        <!-- 2.0 🚨 SOS (중앙 빨간 글로우 비상 핫키) -->
        <div class="nav-item-sos-center">
          <button class="sos-circle-trigger" id="nav-item-sos" title="🚨 비상 112 긴급 신고 SOS">
            <span style="font-size: 1.2rem;">🛡️</span>
            <span class="sos-label-text">SOS</span>
          </button>
        </div>

        <!-- 3.0 스토어 (교체용 시약 립스틱 주문) -->
        <button class="nav-item ${activeTab === 'store' ? 'active' : ''}" id="nav-item-store">
          <span class="nav-icon">🛍️</span>
          <span>스토어</span>
        </button>

        <!-- 4.0 기록 (과거 스캔 장부 이력) -->
        <button class="nav-item ${activeTab === 'history' ? 'active' : ''}" id="nav-item-history">
          <span class="nav-icon">🕒</span>
          <span>기록</span>
        </button>
      </div>
    `;

    // 탭 이벤트 핸들러
    container.querySelector('#nav-item-shutter')?.addEventListener('click', () => {
      store.setActiveTab('shutter');
    });

    container.querySelector('#nav-item-sos')?.addEventListener('click', () => {
      store.openModal('sos');
    });

    container.querySelector('#nav-item-store')?.addEventListener('click', () => {
      store.setActiveTab('store');
    });

    container.querySelector('#nav-item-history')?.addEventListener('click', () => {
      store.setActiveTab('history');
    });
  };

  update();
  return store.subscribe(update);
}
