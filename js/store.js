/**
 * Lip-Safe AI & 개인 포트폴리오 - 중앙 상태 관리 Store
 * 김영주 님의 프로필, 관리자 CMS 세션, Lip-Safe AI 엣지AI 판독 시뮬레이션 상태를 중앙 관리합니다.
 * (모든 주석 한글 작성)
 */
import { formatAccuracy, formatResponseTime } from './utils/formatters.js';

class PortfolioStore {
  constructor() {
    // 1. 김영주 님 프로필 및 자기소개 기본 데이터
    this.profile = {
      name: '김영주',
      title: '온디바이스 엣지AI & 헬스케어/안전 분야 전문 개발자 / 기획자',
      slogan: '어두운 조명에서도 0.3초 만에 무색무취 약물을 판독하는 Lip-Safe AI 기술로 안전한 사회를 만듭니다.',
      interests: [
        '온디바이스/엣지 AI 모델 연동 모바일 앱 (iOS/Android)',
        '헬스케어 및 안전 분야 고대비 UI/UX 기획',
        '반응형 웹 Frontend 개발 (HTML5 / CSS3 / ES Modules)'
      ],
      skills: [
        { name: 'iOS/Android (Flutter/Native)', category: 'Mobile' },
        { name: 'Edge AI (TFLite/TensorRT)', category: 'AI/ML' },
        { name: 'Low-Light Image Processing', category: 'Algorithm' },
        { name: 'UI/UX System Design', category: 'Design' },
        { name: 'HTML5/CSS3/Vanilla JS', category: 'Web' },
        { name: 'Supabase Auth & Database', category: 'Backend' }
      ],
      email: 'youngju.kim@lipsafe-ai.com',
      phone: '010-9876-5432',
      github: 'https://github.com/youngju-kim'
    };

    // 2. 관리자 인증 및 CMS 편집 세션 상태 (Supabase Auth 연동)
    this.isAdmin = false;
    this.camouflagedMode = false; // 위장 UI 모드 토글 (일반 뷰티 앱으로 화면 전환)

    // 3. Lip-Safe AI 엣지AI 판독 및 센싱 실증 데이터
    this.metrics = {
      accuracy: 99.2,         // 판독 정확도 (퍼센트)
      responseTime: 0.3,      // 처리 속도 (초)
      drugTypesCount: 5,      // 동시 감지 마약 종류 수
      lowLightAccuracy: 98.5  // 어두운 조명 (10 lux 이하) 환경 판독 성공률
    };

    // 4. 5종 마약 동시 감지 변색 센서 반응 상태
    this.chemicalSensors = [
      { id: 'ghb', name: 'GHB (물뽕)', color: '#8B5CF6', status: '음성 (안전)', desc: '보라색 무반응' },
      { id: 'ketamine', name: '케타민 (Ketamine)', color: '#06B6D4', status: '음성 (안전)', desc: '시안 무반응' },
      { id: 'meth', name: '메스암페타민 (필로폰)', color: '#E11D48', status: '음성 (안전)', desc: '로즈 무반응' },
      { id: 'cocaine', name: '코카인 (Cocaine)', color: '#F59E0B', status: '음성 (안전)', desc: '황색 무반응' },
      { id: 'mdma', name: 'MDMA (엑스터시)', color: '#10B981', status: '음성 (안전)', desc: '에메랄드 무반응' }
    ];

    // 5. 시뮬레이터 조명 상태 (Lux 단위)
    this.currentLux = 8; // 8 lux (클럽/음영 환경)

    // 구독자 리스너 배열
    this.listeners = [];
  }

  /**
   * 구독자(컴포넌트) 등록 함수
   * @param {Function} listener - 상태 변경 시 실행될 콜백 함수
   */
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * 등록된 모든 구독자에게 상태 변경 이벤트를 전달합니다.
   */
  notify() {
    this.listeners.forEach(l => l(this));
  }

  /**
   * 관리자 서명 인증 및 CMS 로그인 처리
   * @param {string} password - 관리자 비밀번호
   * @returns {boolean} 인증 성공 여부
   */
  loginAdmin(password) {
    if (password === 'admin1234' || password === 'youngju2026') {
      this.isAdmin = true;
      this.notify();
      return true;
    }
    return false;
  }

  /**
   * 관리자 로그아웃 처리
   */
  logoutAdmin() {
    this.isAdmin = false;
    this.notify();
  }

  /**
   * 관리자 CMS 모드에서 프로필 문구를 수정합니다.
   * @param {Object} updatedProfile - 수정된 프로필 객체
   */
  updateProfile(updatedProfile) {
    this.profile = { ...this.profile, ...updatedProfile };
    this.notify();
  }

  /**
   * 위장 UI 모드를 토글합니다 (위급 상황 시 뷰티 립스틱 앱 화면으로 오버레이)
   */
  toggleCamouflageMode() {
    this.camouflagedMode = !this.camouflagedMode;
    this.notify();
  }

  /**
   * 시뮬레이터의 조명 Lux 값을 변경하고 AI 연산 상태를 갱신합니다.
   * @param {number} lux - 조명 조도 값 (0 ~ 100 lux)
   */
  setAmbientLux(lux) {
    this.currentLux = lux;
    this.notify();
  }

  /**
   * 포맷팅된 정확도 문자열을 반환합니다.
   */
  getAccuracyString() {
    return formatAccuracy(this.metrics.accuracy);
  }

  /**
   * 포맷팅된 반응 속도 문자열을 반환합니다.
   */
  getResponseTimeString() {
    return formatResponseTime(this.metrics.responseTime);
  }
}

export const store = new PortfolioStore();
