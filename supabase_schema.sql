-- ============================================================================
-- Lip-Safe AI - Supabase Database Schema & Initial Data
-- 제작자: 김영주 (Lip-Safe AI 메인 개발자/기획자)
-- Supabase 대시보드 (https://tyvsnuyjilhvhfkcwmcm.supabase.co) -> SQL Editor에서 실행하세요.
-- ============================================================================

-- 1. 제작자 소개 및 프로필 테이블 (profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id VARCHAR(50) PRIMARY KEY DEFAULT 'main',
  name TEXT NOT NULL DEFAULT '김영주',
  title TEXT NOT NULL DEFAULT '온디바이스 엣지AI & 헬스케어/안전 분야 전문 개발자 / 기획자',
  slogan TEXT NOT NULL DEFAULT '어두운 조명에서도 0.3초 만에 무색무취 약물을 판독하는 Lip-Safe AI 기술로 안전한 사회를 만듭니다.',
  email TEXT NOT NULL DEFAULT 'youngju.kim@lipsafe-ai.com',
  phone TEXT NOT NULL DEFAULT '010-9876-5432',
  github TEXT NOT NULL DEFAULT 'https://github.com/youngju-kim',
  interests JSONB DEFAULT '["온디바이스/엣지 AI 모델 연동 모바일 앱 (iOS/Android)", "헬스케어 및 안전 분야 고대비 UI/UX 기획", "반응형 웹 Frontend 개발 (HTML5 / CSS3 / ES Modules)"]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 서비스 작업물 및 프로젝트 테이블 (projects)
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  period TEXT NOT NULL,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  summary TEXT NOT NULL,
  thumbnail TEXT NOT NULL,
  link TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 보유 기술 스택 태그 테이블 (skills)
CREATE TABLE IF NOT EXISTS public.skills (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 실증 데이터 수치 테이블 (metrics)
CREATE TABLE IF NOT EXISTS public.metrics (
  id VARCHAR(50) PRIMARY KEY DEFAULT 'main',
  accuracy NUMERIC(5,2) DEFAULT 99.20,
  response_time NUMERIC(5,2) DEFAULT 0.30,
  drug_types_count INT DEFAULT 5,
  low_light_accuracy NUMERIC(5,2) DEFAULT 98.50,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Row Level Security (RLS) 활성화 및 퍼블릭 접근 정책 설정
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metrics ENABLE ROW LEVEL SECURITY;

-- 익명/퍼블릭 누구나 읽기(SELECT) 허용 정책
DROP POLICY IF EXISTS "Allow public read profiles" ON public.profiles;
CREATE POLICY "Allow public read profiles" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read projects" ON public.projects;
CREATE POLICY "Allow public read projects" ON public.projects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read skills" ON public.skills;
CREATE POLICY "Allow public read skills" ON public.skills FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read metrics" ON public.metrics;
CREATE POLICY "Allow public read metrics" ON public.metrics FOR SELECT USING (true);

-- 쓰기(INSERT/UPDATE/DELETE) 허용 정책
DROP POLICY IF EXISTS "Allow all write profiles" ON public.profiles;
CREATE POLICY "Allow all write profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all write projects" ON public.projects;
CREATE POLICY "Allow all write projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all write skills" ON public.skills;
CREATE POLICY "Allow all write skills" ON public.skills FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all write metrics" ON public.metrics;
CREATE POLICY "Allow all write metrics" ON public.metrics FOR ALL USING (true) WITH CHECK (true);

-- ============================================================================
-- 초기 기본 데이터 삽입 (Pre-population)
-- ============================================================================

-- 프로필 초기 데이터
INSERT INTO public.profiles (id, name, title, slogan, email, phone, github)
VALUES (
  'main',
  '김영주',
  '온디바이스 엣지AI & 헬스케어/안전 분야 전문 개발자 / 기획자',
  '어두운 조명에서도 0.3초 만에 무색무취 약물을 판독하는 Lip-Safe AI 기술로 안전한 사회를 만듭니다.',
  'youngju.kim@lipsafe-ai.com',
  '010-9876-5432',
  'https://github.com/youngju-kim'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  slogan = EXCLUDED.slogan,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  github = EXCLUDED.github;

-- 메트릭 수치 초기 데이터
INSERT INTO public.metrics (id, accuracy, response_time, drug_types_count, low_light_accuracy)
VALUES ('main', 99.2, 0.3, 5, 98.5)
ON CONFLICT (id) DO NOTHING;

-- 기술 스택 초기 데이터
INSERT INTO public.skills (name, category) VALUES
  ('iOS/Android (Flutter/Native)', 'Mobile'),
  ('Edge AI (TFLite/TensorRT)', 'AI/ML'),
  ('Low-Light Image Processing', 'Algorithm'),
  ('UI/UX System Design', 'Design'),
  ('HTML5/CSS3/Vanilla JS', 'Web'),
  ('Supabase Auth & Database', 'Backend')
ON CONFLICT (name) DO NOTHING;

-- 관련 작업물/프로젝트 초기 데이터
INSERT INTO public.projects (id, title, category, period, tags, summary, thumbnail, link) VALUES
  (
    'work-1',
    'Lip-Safe AI On-Device Mobile App',
    'Mobile AI & Healthcare',
    '2026.01 - 2026.08',
    '["Flutter", "TFLite", "OpenCV", "iOS/Android"]'::jsonb,
    '클럽 및 음영 환경에서도 0.3초 내 무색무취 마약 변색 패턴을 99.2% 정확도로 자동 판독하는 엣지AI 모바일 앱',
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    'https://github.com/youngju-kim/lip-safe-app'
  ),
  (
    'work-2',
    'Low-Light Automated Image Processor',
    'Algorithm & Computer Vision',
    '2025.09 - 2025.12',
    '["OpenCV", "Low-Light Enhancement", "C++", "Python"]'::jsonb,
    '10 lux 이하의 초저조도 클럽 조도 환경에서 립스틱 스틱 센서 색상을 선명하게 인핸스해주는 모바일 전처리 알고리즘',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    'https://github.com/youngju-kim/lowlight-processor'
  ),
  (
    'work-3',
    '112 GPS One-Touch Emergency Gateway',
    'Safety & Emergency Infrastructure',
    '2025.05 - 2025.08',
    '["GPS Location API", "SMS Gateway", "Camouflage UI"]'::jsonb,
    '위급 상황 시 3초 카운트다운 후 경찰청 112 및 지정 보호자에게 실시간 위치와 SOS 문자를 전송하는 긴급 연동 게이트웨이',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80',
    'https://github.com/youngju-kim/emergency-gateway'
  )
ON CONFLICT (id) DO NOTHING;
