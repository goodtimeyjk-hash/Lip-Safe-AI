/**
 * Supabase DB Client & REST API Integration Module
 * Lip-Safe AI 데이터베이스 연동 유틸리티 (URL: https://tyvsnuyjilhvhfkcwmcm.supabase.co)
 * (모든 주석 한글 작성)
 */

export const SUPABASE_CONFIG = {
  url: 'https://tyvsnuyjilhvhfkcwmcm.supabase.co',
  apiKey: 'sb_publishable_w7sj3I100KRZ28ozYDQVSQ_ZKF0DGUz'
};

const getHeaders = (extraHeaders = {}) => ({
  'apikey': SUPABASE_CONFIG.apiKey,
  'Authorization': `Bearer ${SUPABASE_CONFIG.apiKey}`,
  'Content-Type': 'application/json',
  ...extraHeaders
});

/**
 * 1. 제작자 프로필 조회 (Supabase REST API)
 */
export async function fetchProfileFromSupabase() {
  try {
    const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/profiles?id=eq.main&select=*`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data && data.length > 0 ? data[0] : null;
  } catch (e) {
    console.warn('[Supabase API] 프로필 조회 실패 (로컬 데이터로 대체):', e);
    return null;
  }
}

/**
 * 1-2. 제작자 프로필 저장/업서트 (Supabase DB)
 */
export async function upsertProfileToSupabase(profileData) {
  try {
    const payload = {
      id: 'main',
      name: profileData.name,
      title: profileData.title,
      slogan: profileData.slogan,
      email: profileData.email,
      phone: profileData.phone,
      github: profileData.github,
      interests: profileData.interests || [],
      updated_at: new Date().toISOString()
    };
    const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/profiles`, {
      method: 'POST',
      headers: getHeaders({ 'Prefer': 'resolution=merge-duplicates,return=representation' }),
      body: JSON.stringify(payload)
    });
    return res.ok;
  } catch (e) {
    console.error('[Supabase API] 프로필 업서트 실패:', e);
    return false;
  }
}

/**
 * 2. 서비스 작업물 / 프로젝트 목록 조회
 */
export async function fetchProjectsFromSupabase() {
  try {
    const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/projects?select=*`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.warn('[Supabase API] 작업물 목록 조회 실패:', e);
    return null;
  }
}

/**
 * 2-2. 신규/기존 작업물 업서트
 */
export async function upsertProjectToSupabase(project) {
  try {
    const payload = {
      id: project.id,
      title: project.title,
      category: project.category,
      period: project.period,
      tags: Array.isArray(project.tags) ? project.tags : [],
      summary: project.summary,
      thumbnail: project.thumbnail,
      link: project.link
    };
    const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/projects`, {
      method: 'POST',
      headers: getHeaders({ 'Prefer': 'resolution=merge-duplicates,return=representation' }),
      body: JSON.stringify(payload)
    });
    return res.ok;
  } catch (e) {
    console.error('[Supabase API] 작업물 업서트 실패:', e);
    return false;
  }
}

/**
 * 2-3. 작업물 삭제
 */
export async function deleteProjectFromSupabase(id) {
  try {
    const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/projects?id=eq.${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.ok;
  } catch (e) {
    console.error('[Supabase API] 작업물 삭제 실패:', e);
    return false;
  }
}

/**
 * 3. 보유 기술 스택 조회
 */
export async function fetchSkillsFromSupabase() {
  try {
    const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/skills?select=*`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.warn('[Supabase API] 기술 스택 조회 실패:', e);
    return null;
  }
}

/**
 * 3-2. 기술 스택 추가
 */
export async function addSkillToSupabase(name, category) {
  try {
    const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/skills`, {
      method: 'POST',
      headers: getHeaders({ 'Prefer': 'resolution=merge-duplicates' }),
      body: JSON.stringify({ name, category })
    });
    return res.ok;
  } catch (e) {
    console.error('[Supabase API] 기술 스택 추가 실패:', e);
    return false;
  }
}

/**
 * 3-3. 기술 스택 삭제
 */
export async function deleteSkillFromSupabase(name) {
  try {
    const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/skills?name=eq.${encodeURIComponent(name)}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.ok;
  } catch (e) {
    console.error('[Supabase API] 기술 스택 삭제 실패:', e);
    return false;
  }
}

/**
 * 4. 실증 데이터 수치 조회
 */
export async function fetchMetricsFromSupabase() {
  try {
    const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/metrics?id=eq.main&select=*`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data && data.length > 0 ? data[0] : null;
  } catch (e) {
    console.warn('[Supabase API] 메트릭 수치 조회 실패:', e);
    return null;
  }
}

/**
 * 4-2. 실증 데이터 수치 업서트
 */
export async function upsertMetricsToSupabase(metricsData) {
  try {
    const payload = {
      id: 'main',
      accuracy: metricsData.accuracy,
      response_time: metricsData.responseTime,
      drug_types_count: metricsData.drugTypesCount,
      low_light_accuracy: metricsData.lowLightAccuracy,
      updated_at: new Date().toISOString()
    };
    const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/metrics`, {
      method: 'POST',
      headers: getHeaders({ 'Prefer': 'resolution=merge-duplicates,return=representation' }),
      body: JSON.stringify(payload)
    });
    return res.ok;
  } catch (e) {
    console.error('[Supabase API] 메트릭 업서트 실패:', e);
    return false;
  }
}
