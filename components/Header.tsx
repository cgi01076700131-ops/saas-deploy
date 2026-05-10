import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#f8f9fa]/80 backdrop-blur-xl border-b border-outline-variant/10">
      <nav className="flex justify-between items-center px-8 h-20 max-w-[1440px] mx-auto">
        <div className="flex items-center gap-12">
          <Link className="text-2xl font-black text-[#191c1d] tracking-tighter headline" href="/">CloudNote</Link>
          <ul className="hidden md:flex gap-8 items-center">
            <li><Link className="text-[#405e96] font-medium hover:bg-[#f3f4f5] transition-colors px-3 py-2 rounded-xl" href="#">기능</Link></li>
            <li><Link className="text-[#405e96] font-medium hover:bg-[#f3f4f5] transition-colors px-3 py-2 rounded-xl" href="#">가격</Link></li>
            <li><Link className="text-[#405e96] font-medium hover:bg-[#f3f4f5] transition-colors px-3 py-2 rounded-xl" href="#">커뮤니티</Link></li>
            <li><Link className="text-[#405e96] font-medium hover:bg-[#f3f4f5] transition-colors px-3 py-2 rounded-xl" href="#">고객지원</Link></li>
          </ul>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/auth" className="text-[#405e96] font-medium hover:bg-[#f3f4f5] transition-colors px-4 py-2 rounded-xl scale-95 active:scale-90 transition-transform">로그인</Link>
          <Link href="/auth" className="bg-[#0058bc] text-white font-bold px-6 py-2.5 rounded-xl shadow-[0px_8px_20px_rgba(0,88,188,0.25)] scale-95 active:scale-90 transition-transform">시작하기</Link>
        </div>
      </nav>
    </header>
  );
}
