'use client';

import { useEffect, useState } from 'react';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';

// 토스페이먼츠 클라이언트 키 (환경변수 우선, 없으면 테스트용 키 사용)
const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || "test_ck_4vZnjEJeQVxJzDoab4d8PmOoBN0k";

export default function PaymentCheckout() {
  // 결제 SDK 인스턴스 (빌링 전용)
  const [payment, setPayment] = useState<ReturnType<Awaited<ReturnType<typeof loadTossPayments>>['payment']> | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [price] = useState(12900);
  const planName = 'Pro (Professional)';

  useEffect(() => {
    async function initBillingSDK() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return;

        // 구매자 키는 Supabase 사용자 ID 기반으로 고유하게 생성
        const customerKey = user.id;

        const tossPayments = await loadTossPayments(clientKey);

        // 빌링(정기결제)은 payment() 메서드로 초기화 (widgets가 아님)
        const paymentInstance = tossPayments.payment({ customerKey });
        setPayment(paymentInstance);
        setIsReady(true);
      } catch (error) {
        console.error("빌링 SDK 초기화 오류:", error);
      }
    }
    initBillingSDK();
  }, []);

  // 카드 등록 요청 (빌링키 발급 시작)
  const handleBillingAuth = async () => {
    if (!payment || isProcessing) return;

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("결제를 진행하려면 로그인이 필요합니다.");
      return;
    }

    setIsProcessing(true);

    try {
      // requestBillingAuth: 카드 등록 결제창을 열어 빌링키 발급을 시작
      // 성공 시 successUrl로 authKey와 customerKey가 전달됨
      await payment.requestBillingAuth({
        method: "CARD",
        successUrl: window.location.origin + "/api/billing/issue",
        failUrl: window.location.origin + "/payment/fail",
        customerEmail: user.email || "test@cloudnote.com",
        customerName: user.user_metadata?.full_name || "CloudNoteUser",
      });
    } catch (error: any) {
      // 사용자가 결제창을 닫은 경우 등 처리
      if (error && error.message !== 'User closed the payment widget') {
        console.error("빌링 인증 오류:", error);
        alert(`결제창 호출 중 오류가 발생했습니다: ${error.message} (코드: ${error.code || '알수없음'})`);
      }
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      {/* 플랜 선택 영역: 왼쪽 (Col 8) */}
      <div className="lg:col-span-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free 플랜 */}
          <div className="group relative bg-surface-container-low p-8 rounded-3xl transition-all duration-300 hover:translate-y-[-4px]">
            <div className="mb-8">
              <span className="text-sm font-semibold text-secondary mb-2 block">Standard</span>
              <h3 className="text-2xl font-bold text-on-surface headline">Free</h3>
            </div>
            <div className="mb-10">
              <span className="text-3xl font-black text-on-surface">₩0</span>
              <span className="text-secondary text-sm">/월</span>
            </div>
            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                최대 5개 워크스페이스
              </li>
              <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                기본 텍스트 에디터
              </li>
            </ul>
            <button className="w-full py-4 rounded-xl font-bold text-sm bg-surface-container-high text-on-surface-variant transition-all hover:bg-surface-variant">선택됨</button>
          </div>

          {/* Pro 플랜 (강조) */}
          <div className="relative bg-surface-container-lowest p-8 rounded-3xl shadow-[0px_20px_48px_rgba(0,88,188,0.12)] border-2 border-primary transition-all duration-300 scale-105 z-10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-widest">Recommended</div>
            <div className="mb-8">
              <span className="text-sm font-semibold text-primary mb-2 block">Professional</span>
              <h3 className="text-2xl font-bold text-on-surface headline">Pro</h3>
            </div>
            <div className="mb-10">
              <span className="text-3xl font-black text-on-surface">₩12,900</span>
              <span className="text-secondary text-sm">/월</span>
            </div>
            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3 text-sm text-on-surface">
                <span className="material-symbols-outlined text-primary text-lg filled">check_circle</span>
                무제한 워크스페이스
              </li>
              <li className="flex items-center gap-3 text-sm text-on-surface">
                <span className="material-symbols-outlined text-primary text-lg filled">check_circle</span>
                AI 글쓰기 어시스턴트
              </li>
              <li className="flex items-center gap-3 text-sm text-on-surface">
                <span className="material-symbols-outlined text-primary text-lg filled">check_circle</span>
                오프라인 모드 지원
              </li>
            </ul>
            <button className="w-full py-4 rounded-xl font-bold text-sm bg-gradient-to-br from-primary to-primary-container text-white shadow-lg shadow-primary/20 transition-all hover:opacity-90 active:scale-95">플랜 변경하기</button>
          </div>

          {/* Enterprise 플랜 */}
          <div className="group relative bg-surface-container-low p-8 rounded-3xl transition-all duration-300 hover:translate-y-[-4px]">
            <div className="mb-8">
              <span className="text-sm font-semibold text-secondary mb-2 block">Organization</span>
              <h3 className="text-2xl font-bold text-on-surface headline">Enterprise</h3>
            </div>
            <div className="mb-10">
              <span className="text-3xl font-black text-on-surface">₩49,000</span>
              <span className="text-secondary text-sm">/월</span>
            </div>
            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                보안 및 관리 콘솔
              </li>
              <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                맞춤형 계약 및 지원
              </li>
            </ul>
            <button className="w-full py-4 rounded-xl font-bold text-sm bg-surface-container-high text-on-surface-variant transition-all hover:bg-surface-variant">문의하기</button>
          </div>
        </div>

        {/* 정기결제 안내 */}
        <div className="bg-primary/5 border border-primary/15 p-6 rounded-2xl">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-primary text-xl mt-0.5">info</span>
            <div className="space-y-1">
              <p className="text-sm font-bold text-on-surface">정기결제 안내</p>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                카드를 한 번 등록하시면 매월 자동으로 결제됩니다. 구독 취소는 대시보드 설정에서 언제든 가능하며, 취소 시 다음 결제일부터 청구되지 않습니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 결제 요약 영역: 오른쪽 (Col 4) */}
      <div className="lg:col-span-4 sticky top-24">
        <div className="bg-surface-container-low p-8 rounded-[2.5rem] space-y-8">
          <h4 className="text-xl font-bold text-on-surface headline">결제 요약</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-on-surface-variant">선택한 플랜</span>
              <span className="font-bold text-on-surface">{planName}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-on-surface-variant">결제 방식</span>
              <span className="font-medium text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-primary">autorenew</span>
                월간 자동결제
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-on-surface-variant">결제 주기</span>
              <span className="font-medium text-on-surface">30일</span>
            </div>
            <div className="pt-4 border-t border-outline-variant/20 flex justify-between items-end">
              <div>
                <span className="text-sm text-on-surface-variant block mb-1">월 결제 금액</span>
                <span className="text-xs text-secondary">(부가가치세 포함)</span>
              </div>
              <span className="text-3xl font-black text-primary">₩{price.toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleBillingAuth}
              disabled={!isReady || isProcessing}
              className="w-full py-5 rounded-2xl bg-on-surface text-white font-bold text-lg hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                  <span>처리 중...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-xl">credit_card</span>
                  <span>카드 등록하고 결제하기</span>
                </>
              )}
            </button>
          </div>

          {/* 안내 사항 */}
          <div className="bg-surface-container-high/40 p-5 rounded-2xl space-y-3">
            <div className="flex gap-2">
              <span className="material-symbols-outlined text-sm text-secondary">info</span>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                <strong>환불 및 취소 안내</strong><br/>
                구독 취소는 언제든지 설정 페이지에서 가능하며, 취소 시 다음 결제일부터 청구되지 않습니다. 환불은 결제 후 7일 이내 사용 이력이 없는 경우에 한해 전액 환불이 가능합니다.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-6">
          <Image alt="Secure Payment" className="h-8 w-auto opacity-50 grayscale" width={120} height={32} src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIIraAFKObyy7N3JPruHaTLhxW4i3bzVXGkrqRDRMXu_wlfAoAoQOabVvSpbDX8ZpyARv-FikvXrW1zICFF8X5ISRmlD4ooaYnK3JjFRGKsD2TC5YUtsluWBJrttpmw3ETj683wh5QQfjsxjXG_9Xu-YCAbzyWHBrDAezxjagLZxJ7TXWIQIFHto3ajzISFJlhcHuNA4vzoTUtryEPuhNafGkH8pLAK9cUnAf3DJvKoHxcknyX70m1L-Loar8p3d5359Fr6SvqRf3z" />
          <Image alt="Cards" className="h-8 w-auto opacity-40 grayscale" width={160} height={32} src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlkK4HLms6m3QzCk-TCp5YG1h2j_zRVCP9RpOh-5MJ4aSt9LS_ohSR8gbDQcxXc6TCV3WHOAyyoO7-6gjzByycVRufesBy4bzgUgQ8Zl5nQTi6X9vVBTl-WVkFuwhAAQP7xn882nKYpLM9bUcxo1Ag5EbVHXwbf4iQKp3D6YtxWS5mepa18WBG752lE7D2GuPBSOqWCEHylboK8I1vfRtjywl6JMOeR6B1Ve5DYxv3EpopOMQqHwgiIFbt-SlRUCfVU5uKgqNC060n" />
        </div>
      </div>
    </div>
  );
}
