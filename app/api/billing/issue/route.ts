import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * 빌링키 발급 API 엔드포인트
 * 
 * 토스페이먼츠 결제창에서 카드 인증 성공 후 리다이렉트되는 URL.
 * authKey와 customerKey를 받아 빌링키를 발급하고,
 * 발급된 빌링키로 즉시 첫 번째 결제를 실행합니다.
 * 
 * 흐름: 카드 등록 → authKey 수신 → 빌링키 발급 → 첫 결제 승인 → DB 저장
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const authKey = searchParams.get('authKey');
  const customerKey = searchParams.get('customerKey');

  // 필수 파라미터 검증
  if (!authKey || !customerKey) {
    return NextResponse.redirect(
      new URL('/payment/fail?message=필수 파라미터가 누락되었습니다.&code=MISSING_PARAMS', request.url)
    );
  }

  // 토스페이먼츠 시크릿 키 (환경변수 우선, 없으면 테스트 키 사용)
  const secretKey = process.env.TOSS_SECRET_KEY || 'test_sk_4vZnjEJeQVxJzDoab4d8PmOoBN0k';
  const encryptedSecretKey = Buffer.from(`${secretKey}:`).toString('base64');

  try {
    // ========================================
    // 1단계: 빌링키 발급 (authKey → billingKey)
    // ========================================
    const billingResponse = await fetch(
      'https://api.tosspayments.com/v1/billing/authorizations/issue',
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${encryptedSecretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authKey,
          customerKey,
        }),
      }
    );

    if (!billingResponse.ok) {
      const error = await billingResponse.json();
      console.error('빌링키 발급 실패:', error);
      return NextResponse.redirect(
        new URL(`/payment/fail?message=${encodeURIComponent(error.message)}&code=${error.code}`, request.url)
      );
    }

    const billingData = await billingResponse.json();
    const billingKey = billingData.billingKey;

    console.log('빌링키 발급 성공:', billingKey);

    // ========================================
    // 2단계: 빌링키로 첫 번째 결제 실행
    // ========================================
    const orderId = `billing-${Date.now()}`;
    const amount = 12900; // Pro 플랜 월 결제 금액

    const paymentResponse = await fetch(
      `https://api.tosspayments.com/v1/billing/${billingKey}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${encryptedSecretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerKey,
          amount,
          orderId,
          orderName: 'CloudNote Pro 구독',
          customerEmail: '', // 선택사항
        }),
      }
    );

    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();

    if (!paymentResponse.ok) {
      const error = await paymentResponse.json();
      console.error('첫 결제 승인 실패:', error);

      // 빌링키는 발급되었으나 결제 실패 시, 빌링키만 저장해두고 안내
      if (userData?.user) {
        await supabase
          .from('subscriptions')
          .upsert({
            user_id: userData.user.id,
            billing_key: billingKey,
            customer_key: customerKey,
            status: 'past_due',
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id' });
      }

      return NextResponse.redirect(
        new URL(`/payment/fail?message=${encodeURIComponent(error.message)}&code=${error.code}&orderId=${orderId}`, request.url)
      );
    }

    const paymentData = await paymentResponse.json();
    console.log('첫 결제 승인 성공:', paymentData.paymentKey);

    // ========================================
    // 3단계: DB 업데이트 (빌링키 + 구독 정보 + 결제 내역)
    // ========================================
    if (userData?.user) {
      // 다음 결제일 계산 (30일 후)
      const nextBillingDate = new Date();
      nextBillingDate.setDate(nextBillingDate.getDate() + 30);

      // 구독 정보 업데이트 (빌링키, 플랜, 다음 결제일)
      const { error: subError } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: userData.user.id,
          plan: 'pro',
          status: 'active',
          billing_key: billingKey,
          customer_key: customerKey,
          next_billing_date: nextBillingDate.toISOString(),
          current_period_end: nextBillingDate.toISOString(),
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' })
        .select();

      if (subError) {
        console.error('구독 정보 업데이트 실패:', subError.message);
      }

      // 결제 내역 기록
      await supabase
        .from('payment_history')
        .insert({
          user_id: userData.user.id,
          order_id: orderId,
          payment_key: paymentData.paymentKey,
          amount,
          status: 'SUCCESS',
        });
    } else {
      console.error('인증된 사용자를 찾을 수 없습니다.');
      return NextResponse.redirect(new URL('/login?reason=billing_completed', request.url));
    }

    // 캐시 강제 갱신
    revalidatePath('/', 'layout');

    // 결제 완료 페이지로 이동
    const successUrl = new URL('/payment-done', request.url);
    successUrl.searchParams.set('orderId', orderId);
    successUrl.searchParams.set('amount', String(amount));
    return NextResponse.redirect(successUrl);

  } catch (error) {
    console.error('빌링 처리 중 예외 발생:', error);
    return NextResponse.redirect(
      new URL('/payment/fail?message=서버 내부 오류가 발생했습니다.&code=INTERNAL_ERROR', request.url)
    );
  }
}
