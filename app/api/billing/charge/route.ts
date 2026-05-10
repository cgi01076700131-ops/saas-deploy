import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { fetchDueBillingKeys, processAllDueBillings } from '@/lib/billing/billingService';

/**
 * 정기 결제 실행 API 엔드포인트
 *
 * 외부 스케줄러(Vercel Cron Job)에서 호출하거나 수동으로 실행하는 정기결제 청구 API.
 * 핵심 비즈니스 로직은 lib/billing/billingService.ts 에 위임됩니다.
 *
 * 보안: CRON_SECRET 헤더로 인증된 요청만 처리합니다.
 *
 * 사용법:
 * POST /api/billing/charge
 * Headers: { "Authorization": "Bearer <CRON_SECRET>" }
 */
async function handleCharge(request: Request) {
  // ── 1단계: 인증 검증 ─────────────────────────────────────────────
  const authHeader = request.headers.get('Authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { error: '인증되지 않은 요청입니다.' },
      { status: 401 }
    );
  }

  // ── 2단계: 환경변수 검증 및 Supabase 관리자 클라이언트 생성 ───────
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseServiceKey) {
    return NextResponse.json(
      { error: 'SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았습니다.' },
      { status: 500 }
    );
  }

  // Service Role 키: RLS를 우회하여 모든 구독 행에 접근
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // ── 3단계: 결제 대상 빌링키 조회 ─────────────────────────────
    const dueSubs = await fetchDueBillingKeys(supabaseAdmin);

    if (dueSubs.length === 0) {
      return NextResponse.json({
        message: '결제 대상 구독자가 없습니다.',
        processed: 0,
      });
    }

    console.log(`[charge] 정기결제 대상: ${dueSubs.length}명`);

    // ── 4단계: 전체 빌링키 결제 실행 ─────────────────────────────
    const summary = await processAllDueBillings(dueSubs, supabaseAdmin);

    return NextResponse.json({
      message: `정기결제 처리 완료: 성공 ${summary.success}건, 실패 ${summary.failed}건`,
      ...summary,
    });

  } catch (error) {
    console.error('[charge] 정기결제 처리 중 예외 발생:', error);
    return NextResponse.json(
      { error: '정기결제 처리 중 서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  return handleCharge(request);
}

export async function POST(request: Request) {
  return handleCharge(request);
}
