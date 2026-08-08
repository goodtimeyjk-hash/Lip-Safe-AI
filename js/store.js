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
      accuracy: 99.2,         // 판독 정확도 (퍼센트)
      responseTime: 0.3,      // 처리 속도 (초)
      drugTypesCount: 5,      // 동시 감지 마약 종류 수
      lowLightAccuracy: 98.5  // 어두운 조명 (10 lux 이하) 환경 판독 성공률
    };

    this.defaultProjects = [
      {
        id: 'work-1',
        title: 'Lip-Safe AI On-Device Mobile App',
        category: 'Mobile AI & Healthcare',
        period: '2026.01 - 2026.08',
        tags: ['Flutter', 'TFLite', 'OpenCV', 'iOS/Android'],
        summary: '클럽 및 음영 환경에서도 0.3초 내 무색무취 마약 변색 패턴을 99.2% 정확도로 자동 판독하는 엣지AI 모바일 앱',
        thumbnail: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
        link: 'https://github.com/youngju-kim/lip-safe-app'
      },
      {
        id: 'work-2',
        title: 'Low-Light Automated Image Processor',
        category: 'Algorithm & Computer Vision',
        period: '2025.09 - 2025.12',
        tags: ['OpenCV', 'Low-Light Enhancement', 'C++', 'Python'],
        summary: '10 lux 이하의 초저조도 클럽 조도 환경에서 립스틱 스틱 센서 색상을 선명하게 인핸스해주는 모바일 전처리 알고리즘',
        thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
        link: 'https://github.com/youngju-kim/lowlight-processor'
      },
      {
        id: 'work-3',
        title: '112 GPS One-Touch Emergency Gateway',
        category: 'Safety & Emergency Infrastructure',
        period: '2025.05 - 2025.08',
        tags: ['GPS Location API', 'SMS Gateway', 'Camouflage UI'],
        summary: '위급 상황 시 3초 카운트다운 후 경찰청 112 및 지정 보호자에게 실시간 위치와 SOS 문자를 전송하는 긴급 연동 게이트웨이',
        thumbnail: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80',
        link: 'https://github.com/youngju-kim/emergency-gateway'
      }
    ];

    // 관리자 인증 및 화면 뷰 세션 상태
    this.isAdmin = false;
    this.camouflagedMode = false;
    this.isSupabaseConnected = false;

    // 시뮬레이터 조명 상태 (Lux 단위)
    this.currentLux = 8;

    // 5종 마약 동시 감지 변색 센서 반응 상태
    this.chemicalSensors = [
      { id: 'ghb', name: 'GHB (물뽕)', color: '#8B5CF6', status: '음성 (안전)', desc: '보라색 무반응' },
      { id: 'ketamine', name: '케타민 (Ketamine)', color: '#06B6D4', status: '음성 (안전)', desc: '시안 무반응' },
      { id: 'meth', name: '메스암페타민 (필로폰)', color: '#E11D48', status: '음성 (안전)', desc: '로즈 무반응' },
      { id: 'cocaine', name: '코카인 (Cocaine)', color: '#F59E0B', status: '음성 (안전)', desc: '황색 무반응' },
      { id: 'mdma', name: 'MDMA (엑스터시)', color: '#10B981', status: '음성 (안전)', desc: '에메랄드 무반응' }
    ];

    // 구독자 리스너 배열
    this.listeners = [];

    // 1차: 로컬스토리지 복원
    this.loadFromLocalStorage();

    // 2차: Supabase DB 비동기 데이터 동기화 시도
    this.initFromSupabase();
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
      if (remoteProjects && remoteProjects.length > 0) {
        this.projects = remoteProjects;
        updated = true;
      }
      if (remoteSkills && remoteSkills.length > 0) {
        this.profile.skills = remoteSkills;
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
      console.warn('[Store] Supabase DB 연동 실패 (로컬 데이터 유지):', e);
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
        this.profile = parsed.profile || JSON.parse(JSON.stringify(this.defaultProfile));
        this.metrics = parsed.metrics || JSON.parse(JSON.stringify(this.defaultMetrics));
        this.projects = parsed.projects || JSON.parse(JSON.stringify(this.defaultProjects));
        return true;
      }
    } catch (e) {
      console.warn('로컬스토리지 불러오기 오류:', e);
    }

    // 저장된 데이터가 없는 경우 기본값 적용
    this.profile = JSON.parse(JSON.stringify(this.defaultProfile));
    this.metrics = JSON.parse(JSON.stringify(this.defaultMetrics));
    this.projects = JSON.parse(JSON.stringify(this.defaultProjects));
    return false;
  }

  /**
   * 현재 상태 데이터를 로컬스토리지에 저장합니다.
   */
  saveToLocalStorage() {
    try {
      const dataToSave = {
        profile: this.profile,
        metrics: this.metrics,
        projects: this.projects,
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
   * 초기 기본 데이터로 원복하고 로컬스토리지 및 Supabase 데이터를 갱신합니다.
   */
  resetToDefaultData() {
    this.profile = JSON.parse(JSON.stringify(this.defaultProfile));
    this.metrics = JSON.parse(JSON.stringify(this.defaultMetrics));
    this.projects = JSON.parse(JSON.stringify(this.defaultProjects));
    this.saveToLocalStorage();
    
    // Supabase DB 비동기 업서트
    upsertProfileToSupabase(this.profile);
    upsertMetricsToSupabase(this.metrics);
    this.projects.forEach(p => upsertProjectToSupabase(p));

    this.notify();
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

  /**
   * 관리자 서명 인증 및 로그인 처리
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
   * 제작자 소개 프로필 정보 업데이트 (Supabase + LocalStorage)
   */
  async updateProfile(updatedProfile) {
    this.profile = { ...this.profile, ...updatedProfile };
    this.saveToLocalStorage();
    this.notify();

    // Supabase DB 동기화
    await upsertProfileToSupabase(this.profile);
  }

  /**
   * 실증 데이터 메트릭 수치 업데이트 (Supabase + LocalStorage)
   */
  async updateMetrics(updatedMetrics) {
    this.metrics = { ...this.metrics, ...updatedMetrics };
    this.saveToLocalStorage();
    this.notify();

    // Supabase DB 동기화
    await upsertMetricsToSupabase(this.metrics);
  }

  /**
   * 보유 기술 스택 태그 추가 (Supabase + LocalStorage)
   */
  async addSkill(name, category = 'General') {
    if (!name || this.profile.skills.some(s => s.name.toLowerCase() === name.toLowerCase())) {
      return false;
    }
    this.profile.skills.push({ name, category });
    this.saveToLocalStorage();
    this.notify();

    // Supabase DB 동기화
    await addSkillToSupabase(name, category);
    return true;
  }

  /**
   * 보유 기술 스택 태그 삭제 (Supabase + LocalStorage)
   */
  async deleteSkill(name) {
    this.profile.skills = this.profile.skills.filter(s => s.name !== name);
    this.saveToLocalStorage();
    this.notify();

    // Supabase DB 동기화
    await deleteSkillFromSupabase(name);
  }

  /**
   * 신규 서비스 작업물(프로젝트) 추가 (Supabase + LocalStorage)
   */
  async addProject(projectData) {
    const newProject = {
      id: 'work-' + Date.now(),
      title: projectData.title || '새 작업물',
      category: projectData.category || 'Mobile & Web',
      period: projectData.period || '2026.08',
      tags: Array.isArray(projectData.tags) ? projectData.tags : (projectData.tags ? projectData.tags.split(',').map(t => t.trim()) : ['Lip-Safe AI']),
      summary: projectData.summary || '',
      thumbnail: projectData.thumbnail || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
      link: projectData.link || 'https://github.com/youngju-kim'
    };
    this.projects.unshift(newProject);
    this.saveToLocalStorage();
    this.notify();

    // Supabase DB 동기화
    await upsertProjectToSupabase(newProject);
    return newProject;
  }

  /**
   * 기존 작업물(프로젝트) 수정 (Supabase + LocalStorage)
   */
  async updateProject(id, updatedData) {
    const index = this.projects.findIndex(p => p.id === id);
    if (index !== -1) {
      if (typeof updatedData.tags === 'string') {
        updatedData.tags = updatedData.tags.split(',').map(t => t.trim());
      }
      this.projects[index] = { ...this.projects[index], ...updatedData };
      this.saveToLocalStorage();
      this.notify();

      // Supabase DB 동기화
      await upsertProjectToSupabase(this.projects[index]);
      return true;
    }
    return false;
  }

  /**
   * 작업물(프로젝트) 삭제 (Supabase + LocalStorage)
   */
  async deleteProject(id) {
    this.projects = this.projects.filter(p => p.id !== id);
    this.saveToLocalStorage();
    this.notify();

    // Supabase DB 동기화
    await deleteProjectFromSupabase(id);
  }

  /**
   * 위장 UI 모드 토글
   */
  toggleCamouflageMode() {
    this.camouflagedMode = !this.camouflagedMode;
    this.notify();
  }

  /**
   * 시뮬레이터 조명 Lux 값 변경
   */
  setAmbientLux(lux) {
    this.currentLux = lux;
    this.notify();
  }

  /**
   * 포맷팅된 정확도 문자열 반환
   */
  getAccuracyString() {
    return formatAccuracy(this.metrics.accuracy);
  }

  /**
   * 포맷팅된 반응 속도 문자열 반환
   */
  getResponseTimeString() {
    return formatResponseTime(this.metrics.responseTime);
  }
}

export const store = new LipSafeStore();
