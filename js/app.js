/**
 * Lip-Safe AI - 메인 애플리케이션 진입점 (Main Entry Point)
 * 독립된 UI 컴포넌트를 각각의 HTML 컨테이너에 마운트하고 뷰 초기화를 수행합니다.
 * (모든 주석 한글 작성)
 */
import { renderHeader } from './components/Header.js';
import { renderProfileCard } from './components/ProfileCard.js';
import { renderHeroShowcase } from './components/HeroShowcase.js';
import { renderEdgeAISimulator } from './components/EdgeAISimulator.js';
import { renderChemicalSensors } from './components/ChemicalSensors.js';
import { renderComparisonTable } from './components/ComparisonTable.js';
import { renderWorksGallery } from './components/WorksGallery.js';
import { renderAdminDashboard } from './components/AdminDashboard.js';
import { renderEmergencyReportModal } from './components/EmergencyReportModal.js';
import { renderAdminEditModal } from './components/AdminEditModal.js';
import { renderContactFooter } from './components/ContactFooter.js';
import { showToast } from './utils/notifications.js';

/**
 * DOM 로드 완료 후 컴포넌트 마운트 초기화 실행
 */
document.addEventListener('DOMContentLoaded', () => {
  // 1. 헤더 바인딩
  const headerElem = document.getElementById('header-container');
  if (headerElem) renderHeader(headerElem);

  // 2. 김영주 개발자 프로필 카드 마운트
  const profileElem = document.getElementById('profile-container');
  if (profileElem) renderProfileCard(profileElem);

  // 3. Lip-Safe AI 메인 히어로 쇼케이스 (99.2% / 0.3초 지표) 마운트
  const heroElem = document.getElementById('hero-showcase-container');
  if (heroElem) renderHeroShowcase(heroElem);

  // 4. 어두운 조명 보정 & 온디바이스 엣지AI 판독 시뮬레이터 마운트
  const simElem = document.getElementById('edge-ai-simulator-container');
  if (simElem) renderEdgeAISimulator(simElem);

  // 5. 5종 마약 감지 변색 색상 칩 마운트
  const sensorsElem = document.getElementById('chemical-sensors-container');
  if (sensorsElem) renderChemicalSensors(sensorsElem);

  // 6. 차별점 고대비 비교표 Table 마운트
  const tableElem = document.getElementById('comparison-table-container');
  if (tableElem) renderComparisonTable(tableElem);

  // 7. Lip-Safe AI 주요 작업물 및 프로젝트 카드 갤러리 마운트
  const galleryElem = document.getElementById('works-gallery-container');
  if (galleryElem) renderWorksGallery(galleryElem);

  // 8. 제작자 김영주 전용 관리자 대시보드 페이지 마운트
  const adminDashboardElem = document.getElementById('admin-dashboard-container');
  if (adminDashboardElem) renderAdminDashboard(adminDashboardElem);

  // 9. 하단 문의 푸터 마운트
  const footerElem = document.getElementById('contact-footer-container');
  if (footerElem) renderContactFooter(footerElem);

  // 10. 🚨 112 긴급 신고 모달 & ⚙️ 관리자 Auth 로그인 모달 마운트
  const emergencyModalElem = document.getElementById('emergency-modal-container');
  if (emergencyModalElem) renderEmergencyReportModal(emergencyModalElem);

  const adminModalElem = document.getElementById('admin-modal-container');
  if (adminModalElem) renderAdminEditModal(adminModalElem);

  // 11. 환영 토스트 알림 노출
  showToast('👋 Lip-Safe AI (제작자: 김영주) 서비스에 오신 것을 환영합니다!', 'info', 3500);
});
