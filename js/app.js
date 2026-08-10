/**
 * Lip-Safe AI - 메인 애플리케이션 진입점 (Main Application Entry Point)
 * 3D 골드 립스틱 AI 판독기, 7가지 무지개 컨트롤러, 성분 분석 팝업, SOS 모달을 바인딩합니다.
 */
import { store } from './store.js';
import { renderLipstickScanner } from './components/LipstickScanner.js';
import { renderAnalysisPopup } from './components/AnalysisPopup.js';
import { renderRainbowController } from './components/RainbowController.js';
import { renderBottomNav } from './components/BottomNav.js';
import { renderEmergencySOSModal } from './components/EmergencySOSModal.js';
import { renderSpectrumTechModal } from './components/SpectrumTechModal.js';
import { renderReagentStoreView } from './components/ReagentStoreView.js';
import { renderHistoryLogView } from './components/HistoryLogView.js';
import { showToast } from './utils/notifications.js';

document.addEventListener('DOMContentLoaded', () => {
  const deviceShell = document.getElementById('mobile-device-shell');
  const scannerWrapper = document.getElementById('scanner-view-wrapper');

  // 1.0 3D 골드 립스틱 스캐너 마운트
  const scannerContainer = document.getElementById('scanner-container');
  if (scannerContainer) renderLipstickScanner(scannerContainer);

  // 2.0 성분 분석 팝업 오버레이 마운트
  const popupContainer = document.getElementById('analysis-popup-container');
  if (popupContainer) renderAnalysisPopup(popupContainer);

  // 3.0 7가지 무지개 원형 스마트 버튼 컨트롤러 마운트
  const rainbowContainer = document.getElementById('rainbow-controller-container');
  if (rainbowContainer) renderRainbowController(rainbowContainer);

  // 4.0 하단 내비게이션 바 마운트
  const bottomNavContainer = document.getElementById('bottom-nav-container');
  if (bottomNavContainer) renderBottomNav(bottomNavContainer);

  // 5.0 비상 SOS 긴급 대응 모달 마운트
  const modalContainer = document.getElementById('modal-container');
  if (modalContainer) {
    renderEmergencySOSModal(modalContainer);
    renderSpectrumTechModal(modalContainer);
  }

  // 6.0 서브 뷰 마운트 (스토어 & 기록)
  const subviewContainer = document.getElementById('subview-container');
  if (subviewContainer) {
    renderReagentStoreView(subviewContainer);
    renderHistoryLogView(subviewContainer);
  }

  // 7.0 글로벌 상태 반응 리스너
  store.subscribe(s => {
    // 5600K 스튜디오 조명 활성화 여부
    if (deviceShell) {
      if (s.isStudioLightOn) {
        deviceShell.classList.add('studio-light-active');
      } else {
        deviceShell.classList.remove('studio-light-active');
      }
    }

    // 탭 전환 시 뷰 토글
    if (scannerWrapper) {
      if (s.activeTab === 'shutter') {
        scannerWrapper.style.display = 'block';
      } else {
        scannerWrapper.style.display = 'none';
      }
    }
  });

  // 8.0 좌측 원터치 컨트롤 패널 버튼 리스너 바인딩
  document.getElementById('btn-trigger-danger')?.addEventListener('click', () => {
    store.startAIScan('danger');
  });

  document.getElementById('btn-trigger-warning')?.addEventListener('click', () => {
    store.startAIScan('warning');
  });

  document.getElementById('btn-trigger-safe')?.addEventListener('click', () => {
    store.startAIScan('safe');
  });

  // 환영 토스트 메시지
  showToast('💄 Lip-Safe AI 1초 변색 판독 시스템이 활성화되었습니다!', 'info', 3000);
});
