/**
 * Lip-Safe AI - 🕒 판독 기록 장부 (History Log View)
 */
import { store } from '../store.js';

export function renderHistoryLogView(container) {
  if (!container) return;

  let currentFilter = 'all';

  const update = () => {
    if (store.activeTab !== 'history') {
      container.innerHTML = '';
      return;
    }

    const logs = store.scanHistory.filter(l => {
      if (currentFilter === 'all') return true;
      return l.status === currentFilter;
    });

    container.innerHTML = `
      <div class="subview-container">
        <div class="modal-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 1.4rem;">🕒</span>
              <h3 style="font-size: 1.15rem; font-weight: 900; color: var(--text-gold);">
                1초 AI 광학 판독 기록 장부
              </h3>
            </div>
            <button class="btn btn-sm btn-outline" id="export-history-csv">
              📥 CSV 내보내기
            </button>
          </div>

          <!-- 필터 탭 -->
          <div style="display: flex; gap: 8px; margin-bottom: 16px;">
            <button class="btn btn-sm ${currentFilter === 'all' ? 'btn-primary' : 'btn-outline'}" id="filter-all">전체 (${store.scanHistory.length})</button>
            <button class="btn btn-sm ${currentFilter === 'danger' ? 'btn-danger-emergency' : 'btn-outline'}" id="filter-danger">🔴 위험만</button>
            <button class="btn btn-sm ${currentFilter === 'safe' ? 'btn-primary' : 'btn-outline'}" id="filter-safe">🟢 정상만</button>
          </div>

          <!-- 기록 리스트 -->
          <div style="max-height: 480px; overflow-y: auto;">
            ${logs.length === 0 ? `
              <div style="text-align: center; color: var(--text-secondary); padding: 30px; font-size: 0.85rem;">
                저장된 스캔 판독 기록이 없습니다.
              </div>
            ` : logs.map(log => `
              <div class="history-log-card" style="--log-color: ${log.status === 'danger' ? 'var(--color-danger)' : log.status === 'warning' ? 'var(--color-warning)' : 'var(--color-success)'}">
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem;">
                  <span style="font-family: var(--font-mono); color: var(--text-gold); font-weight: 700;">${log.time}</span>
                  <span style="font-weight: 800; color: ${log.status === 'danger' ? 'var(--color-danger)' : log.status === 'warning' ? 'var(--color-warning)' : 'var(--color-success)'}">
                    ${log.status === 'danger' ? '🔴 위험 감지' : log.status === 'warning' ? '🟡 저조도 주의' : '🟢 정상 안전'}
                  </span>
                </div>

                <div style="font-size: 0.88rem; font-weight: 800; color: var(--text-primary);">
                  ${log.drugName} (신뢰도 ${log.confidence}%)
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.72rem; color: var(--text-secondary); margin-top: 4px;">
                  <span>📍 ${log.location}</span>
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <span style="width: 10px; height: 10px; border-radius: 50%; background: ${log.beforeColor}; display: inline-block;"></span>
                    ➔
                    <span style="width: 10px; height: 10px; border-radius: 50%; background: ${log.afterColor}; display: inline-block;"></span>
                    <span>+${log.wavelengthDelta}nm</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    // 필터 리스너
    container.querySelector('#filter-all')?.addEventListener('click', () => { currentFilter = 'all'; update(); });
    container.querySelector('#filter-danger')?.addEventListener('click', () => { currentFilter = 'danger'; update(); });
    container.querySelector('#filter-safe')?.addEventListener('click', () => { currentFilter = 'safe'; update(); });

    container.querySelector('#export-history-csv')?.addEventListener('click', () => {
      const csvHeader = 'Time,Status,DrugName,Confidence,Location,WavelengthDelta\n';
      const csvBody = store.scanHistory.map(h => `"${h.time}","${h.status}","${h.drugName}",${h.confidence},"${h.location}",${h.wavelengthDelta}`).join('\n');
      const blob = new Blob(['\uFEFF' + csvHeader + csvBody], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `LipSafe_ScanHistory_${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  update();
  return store.subscribe(update);
}
