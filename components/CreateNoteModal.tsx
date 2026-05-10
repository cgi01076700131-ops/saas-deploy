'use client';

type CreateNoteModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CreateNoteModal({ isOpen, onClose }: CreateNoteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-on-surface/40 backdrop-blur-sm p-6">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-[0px_24px_64px_rgba(25,28,29,0.15)] flex flex-col overflow-hidden">
        <div className="p-6 flex justify-between items-center border-b border-outline-variant/10">
          <h2 className="text-xl font-bold tracking-tight headline">새 노트 작성</h2>
          <button onClick={onClose} className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-secondary uppercase tracking-wider">노트 제목</label>
            <input className="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all text-on-surface outline-none" placeholder="제목을 입력하세요" type="text" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-secondary uppercase tracking-wider">카테고리</label>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 py-3 border-2 border-primary bg-primary/5 text-primary font-bold rounded-xl">
                <span className="material-symbols-outlined text-lg">work</span>
                업무
              </button>
              <button className="flex items-center justify-center gap-2 py-3 border-2 border-transparent bg-surface-container-low text-secondary font-bold rounded-xl hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined text-lg">person</span>
                개인
              </button>
              <button className="flex items-center justify-center gap-2 py-3 border-2 border-transparent bg-surface-container-low text-secondary font-bold rounded-xl hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined text-lg">lightbulb</span>
                아이디어
              </button>
              <button className="flex items-center justify-center gap-2 py-3 border-2 border-transparent bg-surface-container-low text-secondary font-bold rounded-xl hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined text-lg">more_horiz</span>
                기타
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-secondary uppercase tracking-wider">내용</label>
            <textarea className="w-full px-4 py-3 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all text-on-surface resize-none outline-none" placeholder="생각을 기록해 보세요..." rows={4}></textarea>
          </div>
        </div>
        <div className="p-6 bg-surface-container-low flex gap-3 justify-end">
          <button onClick={onClose} className="px-6 py-3 font-bold text-secondary hover:bg-surface-container-high rounded-xl transition-colors">
            취소
          </button>
          <button className="px-8 py-3 bg-gradient-to-r from-primary to-primary-container text-white font-bold rounded-xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all">
            노트 생성
          </button>
        </div>
      </div>
    </div>
  );
}
