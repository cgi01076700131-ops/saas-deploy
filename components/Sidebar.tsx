'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

interface SidebarProps {
  userName: string;
  plan: 'free' | 'pro' | 'enterprise';
  isPro: boolean;
}

export default function Sidebar({ userName, plan, isPro }: SidebarProps) {
  const pathname = usePathname() || '';
  const router = useRouter();
  const supabase = createClient();

  // 로그아웃 처리
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  // 일반 네비게이션 항목
  const navItems = [
    { name: '대시보드', path: '/dashboard', icon: 'dashboard' },
    { name: '멤버십 관리', path: '/payment', icon: 'workspace_premium' },
  ];

  // 내 메모 버튼 — 구독 여부에 따라 경로 분기
  const notesPath = isPro ? '/notes' : '/payment';

  const planLabel = {
    free: 'Free 플랜',
    pro: 'Pro 플랜',
    enterprise: 'Enterprise 플랜',
  }[plan];

  const planColor = {
    free: 'text-secondary',
    pro: 'text-primary font-semibold',
    enterprise: 'text-amber-600 font-semibold',
  }[plan];

  return (
    <aside className="h-[calc(100vh-5rem)] w-64 fixed left-0 top-20 bg-[#f3f4f5] flex flex-col p-6 gap-6 z-40 border-r border-[#c1c6d7]/15">
      {/* 워크스페이스 헤더 */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-container rounded-lg flex items-center justify-center text-white">
          <span className="material-symbols-outlined text-sm filled">cloud</span>
        </div>
        <span className="text-lg font-bold text-[#191c1d] headline">내 워크스페이스</span>
      </div>

      {/* 내 메모 버튼 — 핵심 CTA */}
      <Link
        href={notesPath}
        className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold shadow-sm transition-all duration-200 ${
          isPro
            ? 'bg-gradient-to-r from-primary to-primary-container text-white hover:opacity-90 hover:translate-x-1'
            : 'bg-surface-container-high text-on-surface-variant border border-dashed border-outline-variant hover:border-primary hover:text-primary hover:translate-x-1'
        }`}
      >
        <span className={`material-symbols-outlined text-sm ${isPro ? 'filled' : ''}`}>
          {isPro ? 'note_stack' : 'lock'}
        </span>
        <span>{isPro ? '내 메모' : '내 메모 (구독 필요)'}</span>
      </Link>

      {/* 네비게이션 */}
      <nav className="flex flex-col gap-1 overflow-y-auto no-scrollbar flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-white text-[#0058bc] shadow-sm font-semibold'
                  : 'text-[#405e96] hover:bg-[#ffffff]/50 hover:translate-x-1'
              }`}
            >
              <span
                className={`material-symbols-outlined text-xl ${isActive ? 'filled' : ''}`}
              >
                {item.icon}
              </span>
              <span className={isActive ? 'font-bold' : 'font-medium'}>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* 하단: 사용자 정보 + 로그아웃 */}
      <div className="mt-auto flex flex-col gap-1 pt-4 border-t border-outline-variant/15">
        {/* 사용자 정보 */}
        <div className="flex items-center gap-3 px-3 py-3 mb-1 bg-white/60 rounded-xl">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-primary-container/30 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary text-lg filled">person</span>
          </div>
          <div className="overflow-hidden flex-1 min-w-0">
            <p className="text-sm font-bold truncate">{userName}</p>
            <p className={`text-xs truncate ${planColor}`}>{planLabel}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 text-[#405e96] hover:bg-[#ffffff]/50 rounded-xl text-sm transition-all duration-200 hover:translate-x-1 w-full text-left"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          로그아웃
        </button>
        <Link href="/settings" className="flex items-center gap-3 px-4 py-2 text-[#405e96] hover:bg-[#ffffff]/50 rounded-xl text-sm transition-all duration-200 hover:translate-x-1">
          <span className="material-symbols-outlined text-lg">settings</span>
          설정
        </Link>
      </div>
    </aside>
  );
}
