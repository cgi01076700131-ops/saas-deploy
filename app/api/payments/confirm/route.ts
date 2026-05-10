import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const paymentKey = searchParams.get('paymentKey');
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');

  if (!paymentKey || !orderId || !amount) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  // TossPayments Confirm API call
  // Using the test secret key from TossPayments documentation
  const secretKey = 'test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6';
  const encryptedSecretKey = Buffer.from(`${secretKey}:`).toString('base64');

  try {
    const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${encryptedSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount: Number(amount),
      }),
    });

    const supabase = await createClient();
    
    if (!response.ok) {
      const error = await response.json();
      console.error('TossPayments confirm error:', error);
      
      // 결제 실패 기록 업데이트
      await supabase
        .from('payment_history')
        .update({ 
          status: 'FAIL', 
          error_message: error.message,
          error_code: error.code,
          payment_key: paymentKey
        })
        .eq('order_id', orderId);

      return NextResponse.redirect(new URL(`/payment/fail?message=${error.message}&code=${error.code}&orderId=${orderId}`, request.url));
    }

    await response.json();

    // Payment confirmed. Now update the user's subscription in Supabase.
    const { data: userData } = await supabase.auth.getUser();

    if (userData?.user) {
      // 결제 성공 기록 업데이트
      await supabase
        .from('payment_history')
        .update({ 
          status: 'SUCCESS', 
          payment_key: paymentKey,
          updated_at: new Date().toISOString()
        })
        .eq('order_id', orderId);

      console.log('Attempting upsert for user:', userData.user.id);
      const { data: upsertData, error: dbError } = await supabase
        .from('subscriptions')
        .upsert({ 
          user_id: userData.user.id, 
          plan: 'pro', 
          status: 'active',
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' })
        .select();

      if (dbError) {
        console.error('CRITICAL: DB Upsert Failed:', dbError.message, dbError.details);
      } else {
        console.log('DB Upsert Success:', upsertData);
      }
    } else {
      console.error('No authenticated user found');
      return NextResponse.redirect(new URL('/login?reason=payment_completed', request.url));
    }

    // 캐시 강제 갱신: 대시보드와 노트 페이지의 구독 상태를 즉시 반영하기 위함
    revalidatePath('/', 'layout');

    // Redirect to the success page
    const successUrl = new URL('/payment-done', request.url);
    successUrl.searchParams.set('orderId', orderId);
    return NextResponse.redirect(successUrl);
  } catch (error) {
    console.error('Payment confirmation process failed:', error);
    return NextResponse.redirect(new URL('/payment/fail?message=InternalServerError', request.url));
  }
}
