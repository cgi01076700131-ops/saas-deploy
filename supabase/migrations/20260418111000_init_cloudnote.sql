-- ==============================================================================
-- CloudNote Database Schema Migration & RLS Policies
-- Description: Initializes user synchronization, tables, and RLS for CloudNote
-- ==============================================================================

-- 1. UUID 확장 활성화 (필요한 경우)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- TABLES
-- ==============================================================================

-- 2. 사용자 테이블 (public.users)
-- 설명: auth.users 정보를 시스템 전반에서 참조하기 위해 동기화되는 메인 유저 테이블.
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 3. 멤버십/구독 테이블 (public.subscriptions)
-- 설명: 사용자의 플랜(Free, Pro, Enterprise) 및 결제 상태 저장
CREATE TABLE public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  plan TEXT NOT NULL DEFAULT 'free', -- 'free', 'pro', 'enterprise'
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'canceled', 'past_due'
  current_period_end TIMESTAMPTZ,
  next_billing_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 4. 워크스페이스 테이블 (public.workspaces)
-- 설명: 노트북 및 폴더 관리의 최상위 개념
CREATE TABLE public.workspaces (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 5. 노트 테이블 (public.notes)
-- 설명: 에디터 데이터, 스마트 태그, 카테고리 정보 저장
CREATE TABLE public.notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT '제목을 입력하세요',
  content TEXT, -- Markdown or HTML format string
  category TEXT DEFAULT '기타', -- '업무', '개인', '아이디어', '목록', '디자인', '기타'
  tags TEXT[] DEFAULT '{}',
  is_favorite BOOLEAN DEFAULT false,
  is_trash BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 6. 노트 공유 테이블 (public.note_shares)
-- 설명: 노트 공동 작업 및 공유 권한 제어
CREATE TABLE public.note_shares (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  note_id UUID REFERENCES public.notes(id) ON DELETE CASCADE NOT NULL,
  shared_with_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  permission TEXT DEFAULT 'read', -- 'read', 'edit'
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(note_id, shared_with_user_id)
);

-- 7. 사용량 현황 테이블 (public.user_usage)
-- 설명: 대시보드에서 쓰이는 리소스 한도 및 사용량 추적
CREATE TABLE public.user_usage (
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE PRIMARY KEY,
  notes_count INTEGER DEFAULT 0 NOT NULL,
  storage_bytes BIGINT DEFAULT 0 NOT NULL,
  ai_summaries_count INTEGER DEFAULT 0 NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 8. 활동 로그 테이블 (public.activities)
-- 설명: 대시보드 "최근 활동(Activity)" 컴포넌트를 위한 로깅 테이블
CREATE TABLE public.activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  action_type TEXT NOT NULL, -- 'edit_document', 'auto_awesome', 'payments', 'share', 'star'
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ==============================================================================
-- TRIGGERS & FUNCTIONS
-- ==============================================================================

-- 9. auth.users <-> public.users 동기화 트리거
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url'
  );
  
  -- 기본 사용량 및 구독 정보 초기화
  INSERT INTO public.user_usage (user_id) VALUES (new.id);
  INSERT INTO public.subscriptions (user_id, plan, status) VALUES (new.id, 'free', 'active');
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 10. updated_at 자동 갱신 트리거
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER set_workspaces_updated_at BEFORE UPDATE ON public.workspaces FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER set_notes_updated_at BEFORE UPDATE ON public.notes FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER set_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER set_user_usage_updated_at BEFORE UPDATE ON public.user_usage FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.note_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- [Users] 
-- 본인의 프로필만 조회 및 수정 가능
CREATE POLICY "사용자는 자신의 프로필을 볼 수 있습니다." ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "사용자는 자신의 프로필을 수정할 수 있습니다." ON public.users FOR UPDATE USING (auth.uid() = id);

-- [Workspaces]
-- 본인의 워크스페이스만 전체 접근 제어 가능
CREATE POLICY "사용자는 생성한 워크스페이스를 볼 수 있습니다." ON public.workspaces FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "사용자는 워크스페이스를 생성할 수 있습니다." ON public.workspaces FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "사용자는 워크스페이스를 수정할 수 있습니다." ON public.workspaces FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "사용자는 워크스페이스를 삭제할 수 있습니다." ON public.workspaces FOR DELETE USING (auth.uid() = user_id);

-- [Notes]
-- 노트의 소유자는 모든 권한을 가진다.
CREATE POLICY "사용자는 자신의 노트를 조회할 수 있습니다." ON public.notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "사용자는 새 노트를 생성할 수 있습니다." ON public.notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "사용자는 자신의 노트를 수정할 수 있습니다." ON public.notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "사용자는 자신의 노트를 삭제할 수 있습니다." ON public.notes FOR DELETE USING (auth.uid() = user_id);

-- 참고: 공유받은 사용자들에게도 조회 및 수정 권한 부여
CREATE POLICY "공유된 사용자 조회 권한" ON public.notes FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.note_shares WHERE note_shares.note_id = notes.id AND note_shares.shared_with_user_id = auth.uid()));
CREATE POLICY "공유된 사용자 수정 권한" ON public.notes FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.note_shares WHERE note_shares.note_id = notes.id AND note_shares.shared_with_user_id = auth.uid() AND note_shares.permission = 'edit'));

-- [Note Shares]
-- 노트를 공유한 내역(소유자 관점) 또는 접근 가능한 공유 내역 조회
CREATE POLICY "공유 관계는 소유자나 관련된 사용자가 볼 수 있습니다." ON public.note_shares FOR SELECT
  USING (shared_with_user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.notes WHERE notes.id = note_shares.note_id AND notes.user_id = auth.uid()));

CREATE POLICY "노트 소유자는 공유를 추가/수정/삭제할 수 있습니다." ON public.note_shares FOR ALL
  USING (EXISTS (SELECT 1 FROM public.notes WHERE notes.id = note_shares.note_id AND notes.user_id = auth.uid()));

-- [Subscriptions]
CREATE POLICY "사용자는 자신의 구독 정보를 볼 수 있습니다." ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
-- (결제 관련 생성/업데이트는 보안상 서버 측 Webhook 등에서 admin 권한으로 수행함을 권장하기 때문에 일반 유저의 추가 권한은 제한함)

-- [User Usage]
CREATE POLICY "사용자는 자신의 사용량을 조회할 수 있습니다." ON public.user_usage FOR SELECT USING (auth.uid() = user_id);

-- [Activities]
CREATE POLICY "사용자는 자신의 최근 활동 내역을 조회할 수 있습니다." ON public.activities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "시스템은 사용자의 활동을 기록할 수 있습니다." ON public.activities FOR INSERT WITH CHECK (auth.uid() = user_id);
