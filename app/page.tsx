import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="selection:bg-secondary-container selection:text-on-secondary-container bg-background text-on-surface min-h-screen">
      <main>
        {/* Hero Section */}
        <section className="relative px-8 pt-24 pb-32 overflow-hidden">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div className="relative z-10">
              <span className="inline-block py-1.5 px-4 rounded-full bg-secondary-container/30 text-primary font-bold text-sm tracking-tight mb-6">CloudNote AI Beta v2.0</span>
              <h1 className="text-[3.5rem] leading-[1.1] font-extrabold text-on-surface tracking-[-0.03em] mb-6 headline">
                당신의 아이디어를<br />
                <span className="bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent">클라우드에</span>
              </h1>
              <p className="text-lg text-on-surface-variant leading-relaxed mb-10 max-w-md">
                어디서든 메모하고, AI가 알아서 정리해드립니다. 복잡한 생각의 조각들을 하나의 인사이트로 연결하세요.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/login" className="bg-gradient-to-r from-primary to-primary-container text-center text-on-primary px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-primary/20 hover:shadow-2xl transition-all scale-100 active:scale-95">
                  무료로 시작하기
                </Link>
                <button className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-lg text-primary hover:bg-surface-container-low transition-colors">
                  <span className="material-symbols-outlined">play_circle</span>
                  데모 보기
                </button>
              </div>
            </div>
            <div className="relative">
              {/* Bento-style Hero Visuals */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 aspect-video rounded-[2rem] overflow-hidden shadow-2xl relative bg-surface-container-low">
                  <Image alt="Hero Image" className="w-full h-full object-cover" width={800} height={450} src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_ErXxVvQYQG3iqwUpHqQZltnxH59kzjZOn3DHTFu4Hz2GUejUA6n-8xmEL7dDBd_f9yIEQ-OtSbn6Ks_qH229swiXcXyDd0oiCskFRm1IneL5jr3MlDiL_4SzlBHR7z-2ctHyQnchkh2Z8_XlUu668XeKmjOzfhwAoPxmD8XFJmlv0EUB1W8wPooaC6QMoHmsoQ1wLki9jNhgMJPzuxNcxOiG3ZoW2TObGhMp3kvwO9r2IkNL7fcKQ8ujWywRie-iG5pvVQU1977K" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <div className="bg-surface-container-lowest p-6 rounded-[2rem] shadow-xl flex flex-col justify-between">
                  <div className="flex gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-error"></div>
                    <div className="w-2 h-2 rounded-full bg-tertiary"></div>
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-surface-container-high rounded-full"></div>
                    <div className="h-2 w-3/4 bg-surface-container-high rounded-full"></div>
                    <div className="h-2 w-1/2 bg-primary/20 rounded-full"></div>
                  </div>
                  <p className="mt-4 text-xs font-bold text-primary">AI 분석중...</p>
                </div>
                <div className="bg-primary text-white p-6 rounded-[2rem] shadow-xl flex flex-col justify-center items-center text-center">
                  <span className="material-symbols-outlined text-4xl mb-2 filled">cloud_done</span>
                  <p className="text-sm font-bold">실시간 동기화</p>
                  <p className="text-[10px] opacity-80">모든 기기에서 연결</p>
                </div>
              </div>
            </div>
          </div>
          {/* Background Decorative Elements */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-t from-surface-container-low/50 to-transparent pointer-events-none"></div>
        </section>
        
        {/* Pricing Section */}
        <section className="py-32 bg-surface-container-low px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-extrabold tracking-tight mb-4 headline">나에게 맞는 플랜 찾기</h2>
              <p className="text-on-surface-variant max-w-lg mx-auto">간단한 개인 메모부터 팀 단위의 프로젝트 관리까지, 합리적인 가격으로 시작하세요.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 items-stretch">
              {/* Free Plan */}
              <div className="bg-surface-container-lowest p-10 rounded-[2rem] flex flex-col hover:-translate-y-2 transition-transform duration-300">
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-2 headline">Free</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black headline">0</span>
                    <span className="text-on-surface-variant font-medium">KRW / 월</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-10 flex-grow">
                  <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                    무제한 기본 메모 생성
                  </li>
                  <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                    기기 2대 동기화
                  </li>
                  <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                    기본적인 AI 요약 (월 10회)
                  </li>
                </ul>
                <button className="w-full py-4 rounded-xl border-2 border-outline-variant text-on-surface-variant font-bold hover:bg-surface-container-high transition-colors">현재 플랜</button>
              </div>
              
              {/* Pro Plan */}
              <div className="bg-white p-10 rounded-[2.5rem] flex flex-col relative shadow-[0px_24px_48px_rgba(0,88,188,0.12)] border-2 border-primary/10 hover:-translate-y-2 transition-transform duration-300">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-on-primary text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">Most Popular</div>
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-2 text-primary headline">Pro</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black headline">9,900</span>
                    <span className="text-on-surface-variant font-medium">KRW / 월</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-10 flex-grow">
                  <li className="flex items-center gap-3 text-sm font-semibold">
                    <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                    모든 Free 기능 포함
                  </li>
                  <li className="flex items-center gap-3 text-sm font-semibold">
                    <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                    무제한 기기 동기화
                  </li>
                  <li className="flex items-center gap-3 text-sm font-semibold">
                    <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                    고급 AI 분석 및 스마트 태그
                  </li>
                  <li className="flex items-center gap-3 text-sm font-semibold">
                    <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                    10GB 클라우드 저장공간
                  </li>
                </ul>
                <button className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold shadow-lg shadow-primary/20">지금 시작하기</button>
              </div>

              {/* Enterprise Plan */}
              <div className="bg-surface-container-lowest p-10 rounded-[2rem] flex flex-col hover:-translate-y-2 transition-transform duration-300">
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-2 headline">Enterprise</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black headline">29,900</span>
                    <span className="text-on-surface-variant font-medium">KRW / 월</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-10 flex-grow">
                  <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                    모든 Pro 기능 포함
                  </li>
                  <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                    팀 협업 툴 및 권한 관리
                  </li>
                  <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                    무제한 클라우드 저장공간
                  </li>
                  <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                    1:1 전담 기술 지원
                  </li>
                </ul>
                <button className="w-full py-4 rounded-xl border-2 border-primary text-primary font-bold hover:bg-primary/5 transition-colors">영업팀 문의</button>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-32 px-8 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 md:col-span-7 bg-surface-container-low p-12 rounded-[2.5rem] flex flex-col justify-between aspect-[16/10]">
                <div>
                  <h3 className="text-3xl font-extrabold mb-4 headline">AI가 당신의 생각을<br />논리적으로 재구성합니다</h3>
                  <p className="text-on-surface-variant text-lg leading-relaxed">복잡하게 얽힌 생각의 실타래를 AI가 자동으로 분류하고 주제별로 묶어줍니다. 당신은 오직 영감에만 집중하세요.</p>
                </div>
                <div className="mt-8 overflow-hidden rounded-2xl border border-outline-variant/10 shadow-lg bg-white">
                  <Image alt="AI Feature" className="w-full object-cover" width={800} height={400} src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_SFoIi39Yt6jkKXaWApWfLt8DIjMbB1isJW47gYQO1wezffQWpwLzyl-bwFgDgUL8IYLr27Uuol9AYc30JByW-rsy1krufz_7yEQBuZZU6bTkqmjgav9RXBsWAN75ROOm5TV0YO8UckmhKqonczZ4rQkxEX-kKoJ_ihaNkJaE2sSaMYfAdXCLhMa7ZVsSrjghbIGTYH81Ej6JvweRXxIslswAEUPObgj58-C6wjkaCTOIk22dL9cfuFUnyAxV-thFdYhf0SXa7C5a" />
                </div>
              </div>
              
              <div className="col-span-12 md:col-span-5 bg-primary text-white p-12 rounded-[2.5rem] flex flex-col justify-center">
                <span className="material-symbols-outlined text-6xl mb-8 filled">security</span>
                <h3 className="text-3xl font-extrabold mb-4 headline">군사 등급의<br />보안 솔루션</h3>
                <p className="opacity-80 text-lg">모든 메모는 종단간 암호화(End-to-End Encryption)를 통해 당신 외에는 누구도 접근할 수 없도록 철저히 보호됩니다.</p>
              </div>

              <div className="col-span-12 md:col-span-4 bg-surface-container-highest p-12 rounded-[2.5rem]">
                <h3 className="text-2xl font-extrabold mb-4 headline">모든 기기 지원</h3>
                <p className="text-on-surface-variant mb-8">모바일, 태블릿, 데스크탑까지. 어디서나 끊김 없는 워크플로우를 경험하세요.</p>
                <div className="flex gap-4">
                  <span className="material-symbols-outlined text-primary text-3xl">smartphone</span>
                  <span className="material-symbols-outlined text-primary text-3xl">laptop_mac</span>
                  <span className="material-symbols-outlined text-primary text-3xl">tablet_mac</span>
                </div>
              </div>

              <div className="col-span-12 md:col-span-8 bg-surface-container-low p-12 rounded-[2.5rem] flex items-center justify-between flex-wrap gap-6">
                <div className="max-w-md">
                  <h3 className="text-2xl font-extrabold mb-4 headline">지금 바로 생산성을 높여보세요</h3>
                  <p className="text-on-surface-variant">CloudNote와 함께라면 더 이상 중요한 아이디어를 놓치지 않습니다.</p>
                </div>
                <Link href="/login" className="bg-primary text-white px-8 py-4 rounded-xl font-bold shadow-xl">Get Started</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
