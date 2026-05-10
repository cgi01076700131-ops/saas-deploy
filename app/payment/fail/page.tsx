import { createClient } from '@/utils/supabase/server';

import Link from 'next/link';

export default async function PaymentFailPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; code?: string; orderId?: string }>;
}) {
  const params = await searchParams;
  const { message, code, orderId } = params;

  if (orderId) {
    const supabase = await createClient();
    const status = code === 'PAY_PROCESS_CANCELED' ? 'CANCELED' : 'FAIL';
    
    await supabase
      .from('payment_history')
      .update({ 
        status: status,
        error_message: message || 'Unknown Error',
        error_code: code || 'UNKNOWN'
      })
      .eq('order_id', orderId);
  }
  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col items-center justify-center p-6">
      <main className="w-full max-w-[520px] animate-in fade-in duration-700">
        <div className="bg-surface-container-lowest rounded-xl shadow-[0px_12px_32px_rgba(25,28,29,0.06)] overflow-hidden relative">
          <div className="pt-12 pb-8 flex flex-col items-center text-center px-8">
            <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-error text-5xl filled">error</span>
            </div>
            <h1 className="text-2xl font-extrabold text-on-surface tracking-[-0.02em] mb-2 headline">결제에 실패했습니다</h1>
            <p className="text-secondary font-medium">문제가 발생하여 결제가 완료되지 않았습니다.</p>
          </div>

          <div className="px-8 pb-10 space-y-6">
            {params.message && (
              <div className="bg-error/5 text-error rounded-xl p-4 text-sm text-center">
                {params.message}
              </div>
            )}

            <div className="flex flex-col gap-3 mt-6">
              <Link className="bg-gradient-to-r from-[#0058bc] to-[#0070eb] text-white py-4 px-6 rounded-xl font-bold text-center transition-transform active:scale-95 shadow-lg shadow-primary/20" href="/payment">
                다시 시도하기
              </Link>
              <Link className="bg-surface-container-high text-on-surface-variant py-4 px-6 rounded-xl font-semibold text-center transition-colors hover:bg-surface-container-highest active:scale-95" href="/dashboard">
                대시보드로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
