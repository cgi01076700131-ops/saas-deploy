import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export const revalidate = 0;

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 비로그인 사용자 → 로그인 페이지로 이동
  if (!user) {
    redirect('/login');
  }

  // 구독 정보 조회
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('plan, status')
    .eq('user_id', user.id)
    .single();

  const plan = (sub?.plan as 'free' | 'pro' | 'enterprise') || 'free';
  const isPro = ['pro', 'enterprise'].includes(plan) && sub?.status === 'active';

  // 사용자 표시 이름 (이메일 앞부분 사용)
  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || '사용자';

  return (
    <div className="bg-background text-on-surface flex min-h-[calc(100vh-5rem)]">
      {/* 사이드바 (사용자·구독 정보 주입) */}
      <Sidebar
        userName={userName}
        plan={plan}
        isPro={isPro}
      />

      {/* 메인 컨텐츠 */}
      <main className="ml-64 flex-1 min-h-[calc(100vh-5rem)] flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}
