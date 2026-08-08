/**
 * Lip-Safe AI & 개인 포트폴리오 - 메인 애플리케이션 진입점 (Main Entry Point)
 * 독립된 9개 UI 컴포넌트를 각각의 HTML 컨테이너에 마운트하고 뷰 초기화를 수행합니다.
 * (모든 주석 한글 작성)
 */
import { renderHeader } from './components/Header.js';
import { renderProfileCard } from './components/ProfileCard.js';
import { renderHeroShowcase } from './components/HeroShowcase.js';
import { renderEdgeAISimulator } from './components/EdgeAISimulator.js';
import { renderChemicalSensors } from './components/ChemicalSensors.js';
import { renderComparisonTable } from './components/ComparisonTable.js';
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

  // 7. 하단 문의 푸터 마운트
  const footerElem = document.getElementById('contact-footer-container');
  if (footerElem) renderContactFooter(footerElem);

  // 8. 🚨 112 긴급 신고 모달 & ⚙️ 관리자 CMS 라이브 편집 모달 마운트
  const emergencyModalElem = document.getElementById('emergency-modal-container');
  if (emergencyModalElem) renderEmergencyReportModal(emergencyModalElem);

  const adminModalElem = document.getElementById('admin-modal-container');
  if (adminModalElem) renderAdminEditModal(adminModalElem);

  // 9. 환영 토스트 알림 노출
  showToast('👋 김영주 님의 Lip-Safe AI 포트폴리오에 오신 것을 환영합니다!', 'info', 3500);
});
