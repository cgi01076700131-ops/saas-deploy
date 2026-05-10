-- Drop existing owner policies for public.notes
DROP POLICY IF EXISTS "사용자는 자신의 노트를 조회할 수 있습니다." ON public.notes;
DROP POLICY IF EXISTS "사용자는 새 노트를 생성할 수 있습니다." ON public.notes;
DROP POLICY IF EXISTS "사용자는 자신의 노트를 수정할 수 있습니다." ON public.notes;
DROP POLICY IF EXISTS "사용자는 자신의 노트를 삭제할 수 있습니다." ON public.notes;

-- Recreate policies with subscription checks (Requires 'pro' or 'enterprise' and 'active' status)
CREATE POLICY "결제 완료 사용자 자신의 노트 조회 권한" ON public.notes 
  FOR SELECT USING (
    auth.uid() = user_id AND 
    EXISTS (
      SELECT 1 FROM public.subscriptions 
      WHERE subscriptions.user_id = auth.uid() 
        AND subscriptions.plan IN ('pro', 'enterprise') 
        AND subscriptions.status = 'active'
    )
  );

CREATE POLICY "결제 완료 사용자 새 노트 생성 권한" ON public.notes 
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND 
    EXISTS (
      SELECT 1 FROM public.subscriptions 
      WHERE subscriptions.user_id = auth.uid() 
        AND subscriptions.plan IN ('pro', 'enterprise') 
        AND subscriptions.status = 'active'
    )
  );

CREATE POLICY "결제 완료 사용자 자신의 노트 수정 권한" ON public.notes 
  FOR UPDATE USING (
    auth.uid() = user_id AND 
    EXISTS (
      SELECT 1 FROM public.subscriptions 
      WHERE subscriptions.user_id = auth.uid() 
        AND subscriptions.plan IN ('pro', 'enterprise') 
        AND subscriptions.status = 'active'
    )
  );

CREATE POLICY "결제 완료 사용자 자신의 노트 삭제 권한" ON public.notes 
  FOR DELETE USING (
    auth.uid() = user_id AND 
    EXISTS (
      SELECT 1 FROM public.subscriptions 
      WHERE subscriptions.user_id = auth.uid() 
        AND subscriptions.plan IN ('pro', 'enterprise') 
        AND subscriptions.status = 'active'
    )
  );
