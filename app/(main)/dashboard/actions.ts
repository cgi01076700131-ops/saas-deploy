"use server";

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function cancelSubscription() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: '인증되지 않은 사용자입니다.' };
  }

  // 빌링키를 null로 변경하여 자동 결제 방지 (사용 권한은 만료일까지 유지됨)
  const { error } = await supabase
    .from('subscriptions')
    .update({ billing_key: null })
    .eq('user_id', user.id);

  if (error) {
    console.error('구독 취소 실패:', error);
    return { success: false, error: '구독 취소 중 문제가 발생했습니다.' };
  }

  // 액티비티 로깅
  await supabase.from('activities').insert({
    user_id: user.id,
    action_type: 'payments',
    description: '구독(멤버십)을 해지했습니다. 다음 결제일부터 청구되지 않습니다.'
  });

  revalidatePath('/dashboard');
  return { success: true };
}
