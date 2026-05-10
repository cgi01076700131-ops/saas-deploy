import { SupabaseClient } from '@supabase/supabase-js';

// ─── 타입 정의 ──────────────────────────────────────────────────────
/** 오늘 결제해야 하는 구독 항목 */
export interface DueSubscription {
  user_id: string;
  billing_key: string;
  customer_key: string;
  plan: string;
  next_billing_date: string;
}

/** 개별 결제 처리 결과 */
export interface BillingResult {
  userId: string;
  status: 'success' | 'failed';
  orderId?: string;
  error?: string;
}

/** processAllDueBillings 반환 형태 */
export interface BillingRunSummary {
  processed: number;
  success: number;
  failed: number;
  results: BillingResult[];
}

// 플랜별 결제 금액 매핑 (KRW)
const PLAN_PRICE_MAP: Record<string, number> = {
  pro: 12900,
  enterprise: 49000,
};

// ─── 빌링키 조회 함수 ────────────────────────────────────────────────
/**
 * 오늘(현재 시각 기준) 결제해야 하는 빌링키 목록을 조회합니다.
 *
 * 조건:
 *  - status = 'active' (활성 구독)
 *  - billing_key IS NOT NULL (빌링키가 발급된 항목만)
 *  - next_billing_date <= now (결제일이 지났거나 오늘인 항목)
 *
 * @param supabase - Supabase 관리자 클라이언트 (Service Role, RLS 우회)
 * @returns 결제 대상 구독 배열 (오류 시 빈 배열 반환)
 */
export async function fetchDueBillingKeys(
  supabase: SupabaseClient
): Promise<DueSubscription[]> {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('subscriptions')
    .select('user_id, billing_key, customer_key, plan, next_billing_date')
    .eq('status', 'active')
    .not('billing_key', 'is', null)
    .lte('next_billing_date', now);

  if (error) {
    console.error('[billingService] 결제 대상 조회 실패:', error.message);
    return [];
  }

  return data ?? [];
}

// ─── 전체 빌링 처리 함수 ─────────────────────────────────────────────
/**
 * 전달받은 빌링키 목록 전체에 대해 토스페이먼츠 자동결제를 순차 실행합니다.
 *
 * 결제 성공 시: subscriptions.next_billing_date를 30일 후로 갱신하고 payment_history에 기록
 * 결제 실패 시: subscriptions.status를 'past_due'로 변경하고 실패 내역 기록
 * 개별 예외:   해당 건만 failed 처리하고 나머지 처리를 계속 진행
 *
 * @param dueSubs - fetchDueBillingKeys 로 조회된 결제 대상 목록
 * @param supabase - Supabase 관리자 클라이언트 (Service Role, RLS 우회)
 * @returns 처리 요약 (성공/실패 건수 및 개별 결과)
 */
export async function processAllDueBillings(
  dueSubs: DueSubscription[],
  supabase: SupabaseClient
): Promise<BillingRunSummary> {
  // 결제 대상 없을 때 조기 반환
  if (!dueSubs || dueSubs.length === 0) {
    return { processed: 0, success: 0, failed: 0, results: [] };
  }

  const secretKey = process.env.TOSS_SECRET_KEY || 'test_sk_4vZnjEJeQVxJzDoab4d8PmOoBN0k';
  // 토스페이먼츠 인증 헤더: Basic base64(secretKey:)
  const encryptedSecretKey = Buffer.from(`${secretKey}:`).toString('base64');

  const results: BillingResult[] = [];

  for (const sub of dueSubs) {
    const amount = PLAN_PRICE_MAP[sub.plan] ?? 12900;
    const orderId = `recurring-${sub.user_id.slice(0, 8)}-${Date.now()}`;

    try {
      // ── 토스페이먼츠 자동결제 승인 API 호출 ─────────────────────
      const paymentResponse = await fetch(
        `https://api.tosspayments.com/v1/billing/${sub.billing_key}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${encryptedSecretKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customerKey: sub.customer_key,
            amount,
            orderId,
            orderName: `CloudNote ${sub.plan === 'pro' ? 'Pro' : 'Enterprise'} 정기결제`,
          }),
        }
      );

      if (paymentResponse.ok) {
        const paymentData = await paymentResponse.json();

        // 다음 결제일 = 오늘 + 30일
        const nextBillingDate = new Date();
        nextBillingDate.setDate(nextBillingDate.getDate() + 30);

        // 구독 정보 갱신
        await supabase
          .from('subscriptions')
          .update({
            next_billing_date: nextBillingDate.toISOString(),
            current_period_end: nextBillingDate.toISOString(),
            status: 'active',
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', sub.user_id);

        // 결제 내역 기록
        await supabase.from('payment_history').insert({
          user_id: sub.user_id,
          order_id: orderId,
          payment_key: paymentData.paymentKey,
          amount,
          status: 'SUCCESS',
        });

        results.push({ userId: sub.user_id, status: 'success', orderId });
        console.log(`[billingService] 결제 성공: userId=${sub.user_id}, orderId=${orderId}`);
      } else {
        const errorBody = await paymentResponse.json();

        // 구독 상태 → past_due
        await supabase
          .from('subscriptions')
          .update({ status: 'past_due', updated_at: new Date().toISOString() })
          .eq('user_id', sub.user_id);

        // 실패 내역 기록
        await supabase.from('payment_history').insert({
          user_id: sub.user_id,
          order_id: orderId,
          amount,
          status: 'FAIL',
          error_code: errorBody.code,
          error_message: errorBody.message,
        });

        results.push({ userId: sub.user_id, status: 'failed', error: errorBody.message });
        console.error(`[billingService] 결제 실패: userId=${sub.user_id}, code=${errorBody.code}`);
      }
    } catch (err) {
      // 네트워크 오류 등 예외: 이 건만 failed 처리하고 계속 진행
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      results.push({ userId: sub.user_id, status: 'failed', error: errorMessage });
      console.error(`[billingService] 결제 예외: userId=${sub.user_id}`, err);
    }
  }

  const success = results.filter((r) => r.status === 'success').length;
  const failed = results.filter((r) => r.status === 'failed').length;

  return { processed: results.length, success, failed, results };
}
