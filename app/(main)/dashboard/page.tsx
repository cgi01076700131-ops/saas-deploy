import { createClient } from '@/utils/supabase/server';
import DashboardUI, { UserInfo, Subscription, UserUsage, Activity } from './DashboardUI';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // UI 확인을 임시로 돕기 위한 더미 데이터 렌더링 (인증 구현 전까지)
    return <DashboardUI 
      user={{ full_name: '게스트', email: 'guest@example.com', avatar_url: null }} 
      subscription={{ plan: 'free', status: 'active', next_billing_date: new Date().toISOString() }} 
      usage={{ notes_count: 5, storage_bytes: 1024, ai_summaries_count: 3 }} 
      activities={[
        { id: '1', action_type: 'created', description: '환영합니다! 새로운 계정이 생성되었습니다.', created_at: new Date().toISOString() }
      ]} 
    />;
  }

  // Fetch all necessary data
  const [
    { data: profile },
    { data: sub },
    { data: usage },
    { data: activitiesData }
  ] = await Promise.all([
    supabase.from('users').select('full_name, email, avatar_url').eq('id', user.id).single(),
    supabase.from('subscriptions').select('plan, status, next_billing_date').eq('user_id', user.id).single(),
    supabase.from('user_usage').select('notes_count, storage_bytes, ai_summaries_count').eq('user_id', user.id).single(),
    supabase.from('activities').select('id, action_type, description, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5)
  ]);

  const userInfo: UserInfo = profile || { full_name: user.email?.split('@')[0] || '사용자', email: user.email, avatar_url: null };
  // eslint-disable-next-line react-hooks/purity
  const subscription: Subscription = sub || { plan: 'free', status: 'active', next_billing_date: new Date(Date.now() + 30*24*60*60*1000).toISOString() };
  const userUsage: UserUsage = usage || { notes_count: 0, storage_bytes: 0, ai_summaries_count: 0 };
  const activities: Activity[] = activitiesData || [];

  return (
    <DashboardUI
      user={userInfo}
      subscription={subscription}
      usage={userUsage}
      activities={activities}
    />
  );
}
