import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';

export const revalidate = 0;

export default async function PaymentDonePage({
  searchParams,
}: {
  searchParams: Promise<{ paymentKey?: string; orderId?: string; amount?: string }>;
}) {
  const params = await searchParams;

  // 실제 결제 완료 후 Supabase에서 최신 구독 정보 조회
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let subscription = null;
  if (user) {
    const { data } = await supabase
      .from('subscriptions')
      .select('plan, status, updated_at')
      .eq('user_id', user.id)
      .single();
    subscription = data;
  }

  // 결제 완료 시각 포맷
  const now = new Date();
  const formattedDate = now.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // 다음 결제일 (1개월 후)
  const nextBillingDate = new Date(now);
  nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
  const formattedNextBilling = nextBillingDate.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const planDisplayName = subscription?.plan === 'pro' ? 'Pro (Professional)' : 'Enterprise';
  const amount = params.amount ? Number(params.amount).toLocaleString() : '14,190';

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col items-center justify-center p-6 relative">
      {/* 배경 장식 */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden opacity-40">
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-secondary/5 blur-[120px]"></div>
      </div>

      <main className="w-full max-w-[520px] animate-in fade-in duration-700">
        <div className="bg-surface-container-lowest rounded-xl shadow-[0px_12px_32px_rgba(25,28,29,0.06)] overflow-hidden relative">
          
          {/* 성공 인디케이터 */}
          <div className="pt-12 pb-8 flex flex-col items-center text-center px-8">
            <div className="w-20 h-20 bg-primary-container/10 rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-primary text-5xl filled">check_circle</span>
            </div>
            <h1 className="text-2xl font-extrabold text-on-surface tracking-[-0.02em] mb-2 headline">결제가 완료되었습니다!</h1>
            <p className="text-secondary font-medium">
              {subscription ? `${planDisplayName} 플랜이 활성화되었습니다` : 'Pro 플랜이 활성화되었습니다'}
            </p>
          </div>

          {/* 결제 상세 정보 */}
          <div className="px-8 pb-10 space-y-6">
            <div className="bg-surface-container-low rounded-xl p-6 space-y-4">
              {params.orderId && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant">주문 번호</span>
                  <span className="text-on-surface font-semibold font-mono truncate max-w-[200px]">
                    {params.orderId}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm">
                <span className="text-on-surface-variant">결제 금액</span>
                <span className="text-on-surface font-bold text-lg">₩{amount}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-on-surface-variant">구독 플랜</span>
                <span className="text-on-surface font-medium flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-primary">workspace_premium</span>
                  {planDisplayName}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-on-surface-variant">결제 일시</span>
                <span className="text-on-surface font-medium">{formattedDate}</span>
              </div>
              <div className="pt-4 mt-4 border-t border-outline-variant/15 flex justify-between items-center text-sm">
                <span className="text-on-surface-variant">다음 결제일</span>
                <span className="text-primary font-bold">{formattedNextBilling}</span>
              </div>
            </div>

            {/* Pro 혜택 안내 */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 space-y-3">
              <p className="text-sm font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-base">auto_awesome</span>
                이제 이런 기능을 사용하실 수 있습니다
              </p>
              <ul className="space-y-2 text-xs text-on-surface-variant">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm filled">check_circle</span>
                  노트 생성·수정·삭제·조회 (무제한)
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm filled">check_circle</span>
                  AI 글쓰기 어시스턴트 (월 500회)
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm filled">check_circle</span>
                  무제한 워크스페이스 · 20GB 스토리지
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm filled">check_circle</span>
                  오프라인 편집 · 무제한 기기 동기화
                </li>
              </ul>
            </div>

            {/* 액션 버튼 */}
            <div className="flex flex-col gap-3">
              <Link
                className="bg-gradient-to-r from-[#0058bc] to-[#0070eb] text-white py-4 px-6 rounded-xl font-bold text-center transition-transform active:scale-95 shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                href="/notes"
                prefetch={false}
              >
                <span className="material-symbols-outlined text-xl">note_stack</span>
                노트 작성하러 가기
              </Link>
              <Link
                className="bg-surface-container-high text-on-surface-variant py-4 px-6 rounded-xl font-semibold text-center transition-colors hover:bg-surface-container-highest active:scale-95"
                href="/dashboard"
                prefetch={false}
              >
                대시보드로 이동
              </Link>
            </div>
          </div>

          {/* 하단 포인트 라인 */}
          <div className="h-1.5 bg-gradient-to-r from-[#0058bc] to-[#0070eb] w-full"></div>
        </div>
      </main>
    </div>
  );
}
