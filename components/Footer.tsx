import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#f8f9fa] py-12 px-8 border-t border-[#c1c6d7]/15 mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto gap-8">
        <div className="flex flex-col items-center md:items-start gap-4">
          <span className="font-['Manrope'] font-bold text-[#191c1d] text-xl headline">CloudNote</span>
          <p className="font-['Inter'] text-xs text-[#405e96]">© 2024 CloudNote. 모든 권리 보유.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          <Link className="font-['Inter'] text-xs text-[#405e96] hover:text-[#0058bc] transition-colors opacity-80 hover:opacity-100" href="#">이용약관</Link>
          <Link className="font-['Inter'] text-xs text-[#405e96] hover:text-[#0058bc] transition-colors opacity-80 hover:opacity-100" href="#">개인정보처리방침</Link>
          <Link className="font-['Inter'] text-xs text-[#405e96] hover:text-[#0058bc] transition-colors opacity-80 hover:opacity-100" href="#">쿠키 정책</Link>
          <Link className="font-['Inter'] text-xs text-[#405e96] hover:text-[#0058bc] transition-colors opacity-80 hover:opacity-100" href="#">문의하기</Link>
        </div>
        <div className="flex gap-4">
          <Link className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:bg-primary-container hover:text-white transition-all" href="#">
            <span className="material-symbols-outlined text-lg">public</span>
          </Link>
          <Link className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:bg-primary-container hover:text-white transition-all" href="#">
            <span className="material-symbols-outlined text-lg">mail</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
