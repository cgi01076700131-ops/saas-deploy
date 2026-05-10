"use client";

import { useState } from 'react';
import { cancelSubscription } from './actions';

export type UserInfo = {
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
};

export type Subscription = {
  plan: string;
  status: string;
  next_billing_date: string;
};

export type UserUsage = {
  notes_count: number;
  storage_bytes: number;
  ai_summaries_count: number;
};

export type Activity = {
  id: string;
  action_type: string;
  description: string;
  created_at: string;
};

type DashboardUIProps = {
  user: UserInfo;
  subscription: Subscription;
  usage: UserUsage;
  activities: Activity[];
};

export default function DashboardUI({ user, subscription, usage, activities }: DashboardUIProps) {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const planPrice = subscription.plan === 'pro' ? '₩12,900' : subscription.plan === 'enterprise' ? '₩29,900' : '₩0';

  const handleCancelClick = () => {
    setIsCancelModalOpen(true);
  };

  const confirmCancel = async () => {
    setIsCancelling(true);
    try {
      const result = await cancelSubscription();
      if (result.success) {
        setIsCancelModalOpen(false);
        alert('구독이 정상적으로 해지되었습니다. 다음 결제일 전까지는 서비스를 계속 이용할 수 있습니다.');
      } else {
        alert(result.error || '구독 해지에 실패했습니다.');
      }
    } catch (error) {
      alert('오류가 발생했습니다.');
    } finally {
      setIsCancelling(false);
    }
  };

  const formatBytes = (bytes: number) => {
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };

  const maxNotes = subscription.plan === 'free' ? 100 : '무제한';
  const maxStorage = subscription.plan === 'free' ? '2 GB' : subscription.plan === 'enterprise' ? '무제한' : '20 GB';
  const maxAI = subscription.plan === 'free' ? 10 : 500;

  const storagePercentage = subscription.plan === 'free' ? (usage.storage_bytes / (2 * 1024 * 1024 * 1024)) * 100 : subscription.plan === 'enterprise' ? 1 : (usage.storage_bytes / (20 * 1024 * 1024 * 1024)) * 100;
  const notesPercentage = subscription.plan === 'free' ? Math.min(100, (usage.notes_count / 100) * 100) : 5;
  const aiPercentage = Math.min(100, (usage.ai_summaries_count / maxAI) * 100);

  return (
    <div className="max-w-6xl mx-auto w-full px-12 py-16">
      {/* Welcome Header */}
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold text-on-surface mb-2 leading-tight headline">안녕하세요, {user.full_name || '고객'}님!</h1>
        <p className="text-lg text-secondary leading-[1.6]">
          현재 <span className="text-primary font-bold">{subscription.plan.toUpperCase()} 플랜</span>을 이용 중입니다. 모든 기능을 자유롭게 사용해 보세요.
        </p>
      </header>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-8 items-start">
        {/* Subscription Info Card */}
        <section className="col-span-12 lg:col-span-7 bg-surface-container-lowest rounded-[2rem] p-10 tonal-depth relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
              <div>
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider mb-3 inline-block">현재 플랜</span>
                <h2 className="text-3xl font-black text-on-surface headline">
                  {subscription.plan === 'free' ? 'Standard 워크스페이스' : 
                   subscription.plan === 'pro' ? 'Professional 워크스페이스' : 'Enterprise 워크스페이스'}
                </h2>
              </div>
              <div className="text-right">
                <p className="text-sm text-secondary font-medium">다음 결제일</p>
                <p className="text-xl font-bold text-on-surface">
                  {new Date(subscription.next_billing_date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="bg-surface-container-low p-5 rounded-2xl">
                <p className="text-xs text-secondary mb-1">결제 금액</p>
                <p className="text-xl font-bold text-on-surface">{planPrice} <span className="text-sm font-normal text-secondary">/ 월</span></p>
              </div>
              <div className="bg-surface-container-low p-5 rounded-2xl">
                <p className="text-xs text-secondary mb-1">상태</p>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full animate-pulse ${subscription.status === 'active' ? 'bg-green-500' : 'bg-error'}`}></div>
                  <p className="text-xl font-bold text-on-surface">{subscription.status === 'active' ? '활성 중' : '비활성'}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-all flex items-center gap-2">
                플랜 변경하기
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
              <button 
                onClick={handleCancelClick}
                className="px-8 py-4 bg-transparent text-secondary hover:bg-surface-container-high rounded-xl font-semibold transition-all"
              >
                멤버십 해지
              </button>
            </div>
          </div>
        </section>

        {/* Usage Metrics */}
        <section className="col-span-12 lg:col-span-5 flex flex-col gap-6">
          <div className="bg-surface-container-lowest p-8 rounded-[2rem] tonal-depth">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 headline">
              <span className="material-symbols-outlined text-primary filled">analytics</span>
              사용량 현황
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-on-surface">노트 개수</span>
                  <span className="text-secondary">{usage.notes_count} / {maxNotes}</span>
                </div>
                <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-primary rounded-full transition-all w-${Math.round(notesPercentage)}p`}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-on-surface">스토리지</span>
                  <span className="text-secondary">{formatBytes(usage.storage_bytes)} / {maxStorage}</span>
                </div>
                <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-primary rounded-full transition-all w-${Math.round(storagePercentage)}p`}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-on-surface">AI 요약</span>
                  <span className="text-secondary">{usage.ai_summaries_count} / {maxAI}</span>
                </div>
                <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-tertiary rounded-full transition-all w-${Math.round(aiPercentage)}p`}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Promotional Card */}
          <div className="bg-primary p-8 rounded-[2rem] text-white tonal-depth relative overflow-hidden group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-container opacity-50"></div>
            <div className="relative z-10">
              <h4 className="text-lg font-bold mb-2 headline">연간 결제 혜택</h4>
              <p className="text-sm opacity-90 mb-4">연간 플랜으로 전환하고 2개월 무료 혜택을 받으세요.</p>
              <span className="text-xs font-bold underline">자세히 보기</span>
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="col-span-12 mt-4">
          <div className="flex justify-between items-end mb-6">
            <h3 className="text-2xl font-black text-on-surface headline">최근 활동</h3>
            <button className="text-sm text-primary font-bold hover:underline">전체 보기</button>
          </div>
          <div className="bg-surface-container-lowest rounded-[2rem] p-4 tonal-depth">
            <div className="divide-y divide-outline-variant/10">
              {activities.length === 0 ? (
                <div className="p-6 text-center text-secondary">최근 활동이 없습니다.</div>
              ) : (
                activities.map(activity => (
                  <div key={activity.id} className="flex items-center gap-6 p-6 hover:bg-surface-container-low/50 transition-colors rounded-2xl">
                    <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined">
                        {activity.action_type === 'edit_document' ? 'edit_document' :
                         activity.action_type === 'auto_awesome' ? 'auto_awesome' :
                         activity.action_type === 'share' ? 'share' :
                         activity.action_type === 'payments' ? 'payments' : 'star'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-on-surface">{activity.description}</p>
                      <p className="text-xs text-secondary mt-1">
                        {new Date(activity.created_at).toLocaleString('ko-KR')} · 시스템
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-outline-variant">chevron_right</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Cancel Subscription Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-surface rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-on-surface mb-4">정말로 구독을 해지하시겠습니까?</h2>
            <p className="text-secondary mb-6 leading-relaxed">
              멤버십을 해지하면 다음 결제일에 금액이 청구되지 않으며, 자동 결제용 <strong className="text-error">빌링키가 즉시 삭제</strong>됩니다.
              <br/><br/>
              단, <strong className="text-primary">다음 결제일({new Date(subscription.next_billing_date).toLocaleDateString('ko-KR')}) 전까지는 현재 멤버십 혜택을 그대로 이용</strong>하실 수 있습니다.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setIsCancelModalOpen(false)}
                disabled={isCancelling}
                className="flex-1 py-3 bg-surface-container-high text-on-surface font-bold rounded-xl hover:bg-surface-container-highest transition-colors disabled:opacity-50"
              >
                유지하기
              </button>
              <button 
                onClick={confirmCancel}
                disabled={isCancelling}
                className="flex-1 py-3 bg-error text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isCancelling ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : null}
                {isCancelling ? '처리 중...' : '해지하기'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
