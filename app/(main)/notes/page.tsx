import { createClient } from '@/utils/supabase/server';
import NoteUI, { Note } from './NoteUI';
import { redirect } from 'next/navigation';

export default async function NotesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 비로그인 → 로그인 페이지 (layout.tsx에서도 처리하지만 이중 보호)
  if (!user) {
    redirect('/login');
  }

  // 구독 상태 확인
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('plan, status')
    .eq('user_id', user.id)
    .single();

  const isPro =
    sub &&
    ['pro', 'enterprise'].includes(sub.plan) &&
    sub.status === 'active';

  // 미구독 사용자 → 결제 페이지로 리다이렉트
  if (!isPro) {
    redirect('/payment');
  }

  // Pro 이상 → 실제 노트 조회
  const { data: notes } = await supabase
    .from('notes')
    .select('id, title, content, category, tags, created_at, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  return <NoteUI notes={(notes as Note[]) || []} />;
}
