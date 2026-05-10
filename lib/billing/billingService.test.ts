/**
 * billingService 단위/통합 테스트
 *
 * TDD Red Phase: 아직 구현체가 없으므로 모든 테스트가 실패해야 합니다.
 * 테스트 대상:
 *  - fetchDueBillingKeys: 오늘 결제해야 하는 빌링키 목록 조회
 *  - processAllDueBillings: 조회된 빌링키 전체에 대해 결제 실행
 */
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import {
  fetchDueBillingKeys,
  processAllDueBillings,
  type DueSubscription,
} from './billingService';

// ─── 공통 목(mock) 데이터 ───────────────────────────────────────────
const mockSubscriptions: DueSubscription[] = [
  {
    user_id: 'user-001',
    billing_key: 'billing-key-001',
    customer_key: 'cust-001',
    plan: 'pro',
    next_billing_date: '2026-05-01T00:00:00+00:00', // 이미 지난 날짜
  },
  {
    user_id: 'user-002',
    billing_key: 'billing-key-002',
    customer_key: 'cust-002',
    plan: 'enterprise',
    next_billing_date: '2026-05-04T12:00:00+00:00', // 이미 지난 날짜
  },
];

// ─── Supabase 클라이언트 목(mock) ───────────────────────────────────
const mockSupabaseSelect = vi.fn();
const mockSupabaseAdmin = {
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  not: vi.fn().mockReturnThis(),
  lte: vi.fn(() => ({ data: mockSubscriptions, error: null })),
  update: vi.fn().mockReturnThis(),
  insert: vi.fn().mockResolvedValue({ error: null }),
};

// ─── fetch(토스 API) 목(mock) ────────────────────────────────────────
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

// ─── 환경변수 목(mock) ───────────────────────────────────────────────
vi.stubEnv('TOSS_SECRET_KEY', 'test_sk_mock_secret');

// ════════════════════════════════════════════════════════════════════
// 1. Unit Tests: fetchDueBillingKeys
// ════════════════════════════════════════════════════════════════════
describe('fetchDueBillingKeys (단위 테스트)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // 기본 성공 응답 세팅
    mockSupabaseAdmin.lte.mockResolvedValue({
      data: mockSubscriptions,
      error: null,
    });
  });

  it('오늘 결제해야 하는 빌링키 목록을 반환해야 한다', async () => {
    const result = await fetchDueBillingKeys(mockSupabaseAdmin as any);

    expect(result).toHaveLength(2);
    expect(result[0].billing_key).toBe('billing-key-001');
    expect(result[1].billing_key).toBe('billing-key-002');
  });

  it('next_billing_date가 현재 시각 이하인 항목만 가져와야 한다', async () => {
    // now보다 미래 날짜인 항목은 제외되어야 함
    mockSupabaseAdmin.lte.mockResolvedValue({
      data: [mockSubscriptions[0]], // 1건만 반환된 상황
      error: null,
    });

    const result = await fetchDueBillingKeys(mockSupabaseAdmin as any);

    expect(result).toHaveLength(1);
    expect(result[0].user_id).toBe('user-001');
  });

  it('billing_key가 null인 항목은 조회되지 않아야 한다', async () => {
    // DB 쿼리에서 .not('billing_key', 'is', null) 조건이 적용되어야 함
    mockSupabaseAdmin.lte.mockResolvedValue({ data: [], error: null });

    const result = await fetchDueBillingKeys(mockSupabaseAdmin as any);

    expect(result).toHaveLength(0);
  });

  it('DB 조회 실패 시 빈 배열을 반환해야 한다', async () => {
    mockSupabaseAdmin.lte.mockResolvedValue({
      data: null,
      error: { message: 'DB connection error' },
    });

    const result = await fetchDueBillingKeys(mockSupabaseAdmin as any);

    expect(result).toEqual([]);
  });

  it('active 상태의 구독만 조회해야 한다', async () => {
    // 함수가 .eq('status', 'active') 조건을 포함해야 함을 검증
    await fetchDueBillingKeys(mockSupabaseAdmin as any);

    expect(mockSupabaseAdmin.eq).toHaveBeenCalledWith('status', 'active');
  });
});

// ════════════════════════════════════════════════════════════════════
// 2. Unit Tests: processAllDueBillings
// ════════════════════════════════════════════════════════════════════
describe('processAllDueBillings (단위 테스트)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabaseAdmin.lte.mockResolvedValue({
      data: mockSubscriptions,
      error: null,
    });
  });

  it('결제 대상이 없으면 빈 결과를 반환해야 한다', async () => {
    const result = await processAllDueBillings([], mockSupabaseAdmin as any);

    expect(result.processed).toBe(0);
    expect(result.success).toBe(0);
    expect(result.failed).toBe(0);
    expect(result.results).toEqual([]);
  });

  it('모든 결제가 성공하면 success 카운트가 전체 건수여야 한다', async () => {
    // 토스 API가 모두 200 OK 반환
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ paymentKey: 'pay-key-001', status: 'DONE' }),
    });
    mockSupabaseAdmin.update.mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    });

    const result = await processAllDueBillings(
      mockSubscriptions,
      mockSupabaseAdmin as any
    );

    expect(result.processed).toBe(2);
    expect(result.success).toBe(2);
    expect(result.failed).toBe(0);
  });

  it('모든 결제가 실패하면 failed 카운트가 전체 건수여야 한다', async () => {
    // 토스 API가 모두 400 에러 반환
    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({ code: 'CARD_DECLINED', message: '카드 한도 초과' }),
    });
    mockSupabaseAdmin.update.mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    });

    const result = await processAllDueBillings(
      mockSubscriptions,
      mockSupabaseAdmin as any
    );

    expect(result.processed).toBe(2);
    expect(result.success).toBe(0);
    expect(result.failed).toBe(2);
    expect(result.results[0].status).toBe('failed');
    expect(result.results[0].error).toBe('카드 한도 초과');
  });

  it('일부만 성공하면 각 카운트가 정확해야 한다', async () => {
    // 첫 번째 성공, 두 번째 실패
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ paymentKey: 'pay-key-001', status: 'DONE' }),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ code: 'CARD_DECLINED', message: '카드 오류' }),
      });
    mockSupabaseAdmin.update.mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    });

    const result = await processAllDueBillings(
      mockSubscriptions,
      mockSupabaseAdmin as any
    );

    expect(result.success).toBe(1);
    expect(result.failed).toBe(1);
  });

  it('pro 플랜은 12900원으로, enterprise 플랜은 49000원으로 결제되어야 한다', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ paymentKey: 'pay-key-001', status: 'DONE' }),
    });
    mockSupabaseAdmin.update.mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    });

    await processAllDueBillings(mockSubscriptions, mockSupabaseAdmin as any);

    const firstCall = JSON.parse(mockFetch.mock.calls[0][1].body);
    const secondCall = JSON.parse(mockFetch.mock.calls[1][1].body);

    expect(firstCall.amount).toBe(12900); // pro
    expect(secondCall.amount).toBe(49000); // enterprise
  });

  it('결제 성공 시 구독의 next_billing_date가 30일 후로 갱신되어야 한다', async () => {
    const mockUpdateEq = vi.fn().mockResolvedValue({ error: null });
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ paymentKey: 'pay-key-001', status: 'DONE' }),
    });
    mockSupabaseAdmin.update.mockReturnValue({ eq: mockUpdateEq });

    const beforeCall = new Date();
    await processAllDueBillings(
      [mockSubscriptions[0]],
      mockSupabaseAdmin as any
    );

    expect(mockSupabaseAdmin.update).toHaveBeenCalled();
    const updateArg = mockSupabaseAdmin.update.mock.calls[0][0];
    const nextDate = new Date(updateArg.next_billing_date);
    const diffDays = Math.round(
      (nextDate.getTime() - beforeCall.getTime()) / (1000 * 60 * 60 * 24)
    );
    expect(diffDays).toBe(30);
  });

  it('결제 실패 시 구독 상태가 past_due로 변경되어야 한다', async () => {
    const mockUpdateEq = vi.fn().mockResolvedValue({ error: null });
    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({ code: 'CARD_DECLINED', message: '카드 오류' }),
    });
    mockSupabaseAdmin.update.mockReturnValue({ eq: mockUpdateEq });

    await processAllDueBillings(
      [mockSubscriptions[0]],
      mockSupabaseAdmin as any
    );

    const updateArg = mockSupabaseAdmin.update.mock.calls[0][0];
    expect(updateArg.status).toBe('past_due');
  });

  it('fetch 예외 발생 시 해당 건이 failed로 기록되어도 나머지 처리가 계속되어야 한다', async () => {
    mockFetch
      .mockRejectedValueOnce(new Error('Network error')) // 첫 번째는 네트워크 오류
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ paymentKey: 'pay-key-002', status: 'DONE' }),
      });
    mockSupabaseAdmin.update.mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    });

    const result = await processAllDueBillings(
      mockSubscriptions,
      mockSupabaseAdmin as any
    );

    // 첫 번째 실패해도 두 번째는 성공
    expect(result.failed).toBe(1);
    expect(result.success).toBe(1);
  });
});

// ════════════════════════════════════════════════════════════════════
// 3. Integration Test: fetchDueBillingKeys → processAllDueBillings
// ════════════════════════════════════════════════════════════════════
describe('fetchDueBillingKeys + processAllDueBillings 통합 테스트', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('조회된 빌링키로 자동으로 결제가 실행되어야 한다', async () => {
    // DB에서 구독 조회
    mockSupabaseAdmin.lte.mockResolvedValue({
      data: mockSubscriptions,
      error: null,
    });
    // 토스 결제 성공
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ paymentKey: 'pay-key-001', status: 'DONE' }),
    });
    mockSupabaseAdmin.update.mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    });

    // 실제 통합 흐름 실행
    const dueSubs = await fetchDueBillingKeys(mockSupabaseAdmin as any);
    const result = await processAllDueBillings(dueSubs, mockSupabaseAdmin as any);

    expect(dueSubs).toHaveLength(2);
    expect(result.success).toBe(2);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('DB 조회 결과가 비어있으면 fetch가 호출되지 않아야 한다', async () => {
    mockSupabaseAdmin.lte.mockResolvedValue({ data: [], error: null });

    const dueSubs = await fetchDueBillingKeys(mockSupabaseAdmin as any);
    const result = await processAllDueBillings(dueSubs, mockSupabaseAdmin as any);

    expect(mockFetch).not.toHaveBeenCalled();
    expect(result.processed).toBe(0);
  });
});
