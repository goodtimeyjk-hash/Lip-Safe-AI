/**
 * Lip-Safe AI - 중앙 상태 관리 Store (Supabase DB & LocalStorage 이중 동기화)
 * 제작자 김영주 님의 소개 정보, 관리자 CMS 세션, 관련 작업물(프로젝트) CRUD를 관리합니다.
 * (모든 주석 한글 작성)
 */
import { formatAccuracy, formatResponseTime } from './utils/formatters.js';
import {
  fetchProfileFromSupabase,
  upsertProfileToSupabase,
  fetchProjectsFromSupabase,
  upsertProjectToSupabase,
  deleteProjectFromSupabase,
  fetchSkillsFromSupabase,
  addSkillToSupabase,
  deleteSkillFromSupabase,
  fetchMetricsFromSupabase,
  upsertMetricsToSupabase
} from './utils/supabaseClient.js';

const STORAGE_KEY = 'lip_safe_app_data';

class LipSafeStore {
  constructor() {
    // 기본 초기 데이터 정의
    this.defaultProfile = {
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

    this.defaultMetrics = {
      accuracy: 99.4,         // 판독 정확도 (퍼센트)
      responseTime: 1.0,      // Fast AI 스캔 처리 속도 (1초)
      drugTypesCount: 5,      // 동시 감지 마약 종류 수
      lowLightAccuracy: 98.5  // 어두운 조명 (10 lux 이하) 환경 판독 성공률
    };

    this.defaultProjects = [];

    // 관리자 인증 및 화면 뷰 세션 상태
    this.isAdmin = false;
    this.camouflagedMode = false;
    this.isSupabaseConnected = false;

    // ------------------------------------------------------------------------
    // Lip-Safe AI 1초 AI 판독 & 무지개 컨트롤러 상태 관리
    // ------------------------------------------------------------------------
    this.activeTab = 'shutter';     // 'shutter' | 'sos' | 'store' | 'history'
    this.isScanning = false;        // AI 스캔 중 여부
    this.scanProgress = 0;          // 0 ~ 100% 스캔 진행도
    this.isStudioLightOn = false;   // 🟡 5600K 스튜디오 조도 보정 라이트 ON/OFF
    this.activePopup = null;        // 성분 분석 팝업 (🔴위험 / 🟡주의 / 🟢정상)
    this.activeModal = null;        // 'sos' | 'techInfo' | 'precisionGuide' | 'reagentOrder'
    this.lipstickTipColorChanged = false; // 립스틱 스틱 변색 상태

    // 비상 긴급 연락처
    this.emergencyContacts = [
      { name: '보호자 1 (엄마)', phone: '010-1234-5678', enabled: true },
      { name: '신뢰 친구 (김민지)', phone: '010-8765-4321', enabled: true }
    ];

    // 과거 스캔 이력 기록 장부
    this.scanHistory = [
      {
        id: 'scan-101',
        time: '2026-08-10 23:10',
        location: '강남 클럽 앰비언스',
        status: 'danger',
        drugName: 'GHB (물뽕)',
        confidence: 99.4,
        beforeColor: '#FF2A6D',
        afterColor: '#7B2CBF',
        wavelengthDelta: 42,
        lightLux: 8
      },
      {
        id: 'scan-102',
        time: '2026-08-10 22:45',
        location: '홍대 바 라운지',
        status: 'safe',
        drugName: '검출 안 됨 (안전)',
        confidence: 99.8,
        beforeColor: '#FF2A6D',
        afterColor: '#FF2A6D',
        wavelengthDelta: 0,
        lightLux: 120
      }
    ];

    // 구독자 리스너 배열
    this.listeners = [];

    // 1차: 로컬스토리지 복원
    this.loadFromLocalStorage();

    // 2차: Supabase DB 비동기 데이터 동기화 시도
    this.initFromSupabase();
  }

  /**
   * 1초 AI 카메라 스캔 구동 엔진 (0% -> 100%)
   */
  startAIScan(presetMode = 'random') {
    if (this.isScanning) return;

    this.isScanning = true;
    this.scanProgress = 0;
    this.activePopup = null;
    this.notify();

    let step = 0;
    const interval = setInterval(() => {
      step += 10;
      this.scanProgress = Math.min(step, 100);
      this.notify();

      if (step >= 100) {
        clearInterval(interval);
        this.isScanning = false;
        this.finishScan(presetMode);
      }
    }, 90); // 총 약 0.9초 완료
  }

  /**
   * 스캔 완료 후 분석 결과 생성 및 팝업 출력
   */
  finishScan(presetMode = 'random') {
    let resultMode = presetMode;
    if (presetMode === 'random') {
      const rand = Math.random();
      if (rand < 0.45) resultMode = 'danger';
      else if (rand < 0.70) resultMode = 'warning';
      else resultMode = 'safe';
    }

    let popupData = {};

    if (resultMode === 'danger') {
      this.lipstickTipColorChanged = true;
      popupData = {
        status: 'danger',
        title: '🔴 위험 (Danger) - 마약 성분 감지',
        drugName: 'GHB (물뽕 / Gamma-Hydroxybutyrate)',
        confidence: 99.4,
        wavelengthDelta: 42,
        beforeColor: '#FF2A6D',
        afterColor: '#7B2CBF',
        message: '음료 내 위험 마약성 물질(GHB)이 높은 신뢰도로 검출되었습니다. 절대로 음용하지 마시고 즉시 비상 SOS를 실행하세요!',
        lightLux: this.isStudioLightOn ? 560 : 12
      };
    } else if (resultMode === 'warning') {
      this.lipstickTipColorChanged = false;
      popupData = {
        status: 'warning',
        title: '🟡 주의 (Warning) - 저조도 환경',
        drugName: '스펙트럼 판독 미달',
        confidence: 81.2,
        wavelengthDelta: 5,
        beforeColor: '#FF2A6D',
        afterColor: '#E63946',
        message: '현재 장소가 어두워 광학 스펙트럼 수치가 부족합니다. 하단의 🟡 노란색 버튼을 눌러 5600K 스튜디오 조도를 보정 후 재촬영하세요.',
        lightLux: 6
      };
    } else {
      this.lipstickTipColorChanged = false;
      popupData = {
        status: 'safe',
        title: '🟢 정상 (Safe) - 안심 음용 안내',
        drugName: '마약 물질 미검출 (정상)',
        confidence: 99.8,
        wavelengthDelta: 0,
        beforeColor: '#FF2A6D',
        afterColor: '#FF2A6D',
        message: 'GHB, 케타민 등 5종 마약 성분이 검출되지 않았습니다. 안심하고 음료를 이용하셔도 좋습니다.',
        lightLux: this.isStudioLightOn ? 560 : 95
      };
    }

    this.activePopup = popupData;

    // 히스토리 장부 추가
    const historyRecord = {
      id: 'scan-' + Date.now(),
      time: new Date().toLocaleString('ko-KR', { hour12: false }),
      location: '실시간 AI 스캔 장소',
      status: popupData.status,
      drugName: popupData.drugName,
      confidence: popupData.confidence,
      beforeColor: popupData.beforeColor,
      afterColor: popupData.afterColor,
      wavelengthDelta: popupData.wavelengthDelta,
      lightLux: popupData.lightLux
    };

    this.scanHistory.unshift(historyRecord);
    this.saveToLocalStorage();
    this.notify();
  }

  /**
   * 🟡 5600K 스튜디오 조도 보정 라이트 ON/OFF 토글
   */
  toggleStudioLight() {
    this.isStudioLightOn = !this.isStudioLightOn;
    this.notify();
  }

  /**
   * 분석 팝업 닫기
   */
  closePopup() {
    this.activePopup = null;
    this.notify();
  }

  /**
   * 팝업 모달 열기
   */
  openModal(modalName) {
    this.activeModal = modalName;
    this.notify();
  }

  /**
   * 팝업 모달 닫기
   */
  closeModal() {
    this.activeModal = null;
    this.notify();
  }

  /**
   * 하단 내비게이션 탭 변경
   */
  setActiveTab(tabName) {
    this.activeTab = tabName;
    if (tabName === 'sos') {
      this.activeModal = 'sos';
    }
    this.notify();
  }

  /**
   * Supabase 데이터베이스에서 실시간 데이터 로드
   */
  async initFromSupabase() {
    try {
      const [remoteProfile, remoteProjects, remoteSkills, remoteMetrics] = await Promise.all([
        fetchProfileFromSupabase(),
        fetchProjectsFromSupabase(),
        fetchSkillsFromSupabase(),
        fetchMetricsFromSupabase()
      ]);

      let updated = false;

      if (remoteProfile) {
        this.profile = { ...this.profile, ...remoteProfile };
        updated = true;
      }
      if (remoteMetrics) {
        this.metrics = {
          accuracy: parseFloat(remoteMetrics.accuracy) || this.metrics.accuracy,
          responseTime: parseFloat(remoteMetrics.response_time) || this.metrics.responseTime,
          drugTypesCount: parseInt(remoteMetrics.drug_types_count, 10) || this.metrics.drugTypesCount,
          lowLightAccuracy: parseFloat(remoteMetrics.low_light_accuracy) || this.metrics.lowLightAccuracy
        };
        updated = true;
      }

      if (updated) {
        this.isSupabaseConnected = true;
        this.saveToLocalStorage();
        this.notify();
      }
    } catch (e) {
      console.warn('[Store] Supabase DB 연동 비활성화 (로컬 모드):', e);
    }
  }

  /**
   * 로컬스토리지에서 저장된 데이터를 불러옵니다.
   */
  loadFromLocalStorage() {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.scanHistory) this.scanHistory = parsed.scanHistory;
        if (parsed.emergencyContacts) this.emergencyContacts = parsed.emergencyContacts;
        return true;
      }
    } catch (e) {
      console.warn('로컬스토리지 불러오기 오류:', e);
    }
    return false;
  }

  /**
   * 현재 상태 데이터를 로컬스토리지에 저장합니다.
   */
  saveToLocalStorage() {
    try {
      const dataToSave = {
        scanHistory: this.scanHistory,
        emergencyContacts: this.emergencyContacts,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      return true;
    } catch (e) {
      console.error('로컬스토리지 저장 오류:', e);
      return false;
    }
  }

  /**
   * 구독자(컴포넌트) 등록 함수
   */
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * 모든 구독자에게 상태 변경 이벤트를 전달합니다.
   */
  notify() {
    this.listeners.forEach(l => l(this));
  }
}

export const store = new LipSafeStore();

