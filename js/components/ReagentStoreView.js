/**
 * Lip-Safe AI - 🔮 Violet: 교체용 시약 립스틱 스틱 주문 & 안전 스토어
 */
import { store } from '../store.js';

export function renderReagentStoreView(container) {
  if (!container) return;

  const update = () => {
    const activeTab = store.activeTab;
    const activeModal = store.activeModal;

    const isStoreTab = activeTab === 'store';
    const isStoreModal = activeModal === 'reagentOrder';

    if (!isStoreTab && !isStoreModal) {
      if (!isStoreModal) container.innerHTML = '';
      return;
    }

    const storeHTML = `
      <div class="${isStoreModal ? 'modal-full-overlay' : 'subview-container'}">
        <div class="modal-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 1.5rem;">🔮</span>
              <h3 style="font-size: 1.15rem; font-weight: 900; color: var(--text-gold);">
                Lip-Safe 교체용 시약 립스틱 스토어
              </h3>
            </div>
            ${isStoreModal ? '<button class="popup-close-btn" id="store-modal-close">✕</button>' : ''}
          </div>

          <p style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 16px;">
            정품 Lip-Safe AI 마약 감지 시약 팁 리필 패키지 및 스마트 세이프티 키트를 주문하실 수 있습니다.
          </p>

          <!-- 아이템 1: 시약 립스틱 리필 패키지 -->
          <div class="store-item-card">
            <div>
              <div style="font-weight: 800; font-size: 0.88rem; color: var(--text-primary);">
                💄 Lip-Safe AI 시약 립스틱 리필 팁 (5개입)
              </div>
              <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 2px;">
                GHB/케타민/필로폰/코카인/MDMA 5종 반응
              </div>
              <div style="font-family: var(--font-mono); font-size: 0.85rem; font-weight: 800; color: var(--gold-primary); margin-top: 4px;">
                19,800원
              </div>
            </div>
            <button class="btn btn-sm btn-primary" onclick="alert('🛍️ Lip-Safe 시약 립스틱 리필 팁 5개입이 장바구니에 담겼습니다!')">
              담기
            </button>
          </div>

          <!-- 아이템 2: 5600K 클럽용 셀피 조명 키링 -->
          <div class="store-item-card">
            <div>
              <div style="font-weight: 800; font-size: 0.88rem; color: var(--text-primary);">
                💡 5600K 스튜디오 조도 보정 스마트 키링
              </div>
              <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 2px;">
                어두운 클럽/바 조도 보정 및 SOS 스트로브 겸용
              </div>
              <div style="font-family: var(--font-mono); font-size: 0.85rem; font-weight: 800; color: var(--gold-primary); margin-top: 4px;">
                12,500원
              </div>
            </div>
            <button class="btn btn-sm btn-outline" onclick="alert('🛍️ 5600K 스마트 키링이 장바구니에 담겼습니다!')">
              담기
            </button>
          </div>

          <!-- 아이템 3: 올인원 안심 파우치 세트 -->
          <div class="store-item-card">
            <div>
              <div style="font-weight: 800; font-size: 0.88rem; color: var(--text-primary);">
                🛡️ Lip-Safe AI 올인원 안심 파우치 풀세트
              </div>
              <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 2px;">
                골드 립스틱 케이스 + 시약 팁 10개입 + SOS 스마트 키링
              </div>
              <div style="font-family: var(--font-mono); font-size: 0.85rem; font-weight: 800; color: var(--gold-primary); margin-top: 4px;">
                38,000원
              </div>
            </div>
            <button class="btn btn-sm btn-primary" onclick="alert('🛍️ 올인원 안심 파우치 풀세트가 장바구니에 담겼습니다!')">
              담기
            </button>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = storeHTML;

    if (isStoreModal) {
      container.querySelector('#store-modal-close')?.addEventListener('click', () => store.closeModal());
    }
  };

  update();
  return store.subscribe(update);
}
