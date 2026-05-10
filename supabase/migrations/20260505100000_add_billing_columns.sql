-- ==============================================================================
-- 빌링(정기결제) 전환을 위한 subscriptions 테이블 컬럼 추가
-- 설명: 토스페이먼츠 빌링키와 구매자키를 저장하고, 다음 결제 예정일을 관리
-- ==============================================================================

-- 1. 빌링키 컬럼 추가 (토스페이먼츠에서 발급받은 암호화된 결제수단 식별값)
ALTER TABLE public.subscriptions 
  ADD COLUMN IF NOT EXISTS billing_key TEXT;

-- 2. 구매자 키 컬럼 추가 (토스페이먼츠에서 사용자를 식별하는 고유값)
ALTER TABLE public.subscriptions 
  ADD COLUMN IF NOT EXISTS customer_key TEXT;

-- 3. 구독(subscriptions) 테이블의 UPDATE 권한 추가
-- 빌링키 발급 시 서버에서 구독 정보를 업데이트해야 하므로 정책 추가
CREATE POLICY "서버는 사용자의 구독 정보를 업데이트할 수 있습니다."
  ON public.subscriptions FOR UPDATE
  USING (auth.uid() = user_id);
