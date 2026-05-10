-- 1. subscriptions 테이블에 RLS 활성화 (이미 되어있을 수 있음)
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- 2. 기존 정책 삭제 (충돌 방지)
DROP POLICY IF EXISTS "Users can view own subscription" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can update own subscription" ON public.subscriptions;
DROP POLICY IF EXISTS "Service can manage subscriptions" ON public.subscriptions;

-- 3. 사용자가 자신의 구독 정보를 볼 수 있도록 허용
CREATE POLICY "Users can view own subscription" 
ON public.subscriptions FOR SELECT 
USING (auth.uid() = user_id);

-- 4. 사용자가 자신의 구독 정보를 생성/수정할 수 있도록 허용 (결제 확인용)
CREATE POLICY "Users can manage own subscription" 
ON public.subscriptions FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 5. 만약 위 정책으로도 부족할 경우를 대비해 권한 부여
GRANT ALL ON public.subscriptions TO authenticated;
GRANT ALL ON public.subscriptions TO service_role;
