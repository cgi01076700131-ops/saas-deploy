-- 20260427121500_create_payment_history.sql
-- 설명: 결제 시도 내역 및 성공/실패/취소 상태 추적

CREATE TABLE public.payment_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  order_id TEXT NOT NULL UNIQUE,
  payment_key TEXT,
  amount BIGINT NOT NULL,
  status TEXT NOT NULL, -- 'PENDING', 'SUCCESS', 'FAIL', 'CANCELED'
  error_message TEXT,
  error_code TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- RLS 설정
ALTER TABLE public.payment_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "사용자는 자신의 결제 내역을 조회할 수 있습니다." 
  ON public.payment_history FOR SELECT 
  USING (auth.uid() = user_id);

-- 시스템(서버)에서 로그를 남기기 위한 권한은 서비스 롤 등을 통해 수행되거나, 
-- 인증된 사용자 본인이 자신의 '시도'를 기록할 수 있도록 INSERT 허용
CREATE POLICY "사용자는 자신의 결제 내역을 기록할 수 있습니다."
  ON public.payment_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "사용자는 자신의 결제 내역을 업데이트할 수 있습니다."
  ON public.payment_history FOR UPDATE
  USING (auth.uid() = user_id);

-- updated_at 트리거 추가
CREATE TRIGGER set_payment_history_updated_at 
  BEFORE UPDATE ON public.payment_history 
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
