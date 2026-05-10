'use client';

import { useState } from 'react';


export type Note = {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  created_at: string;
  updated_at: string;
};

type NoteUIProps = {
  notes: Note[];
};

export default function NoteUI({ notes }: NoteUIProps) {
  const [selectedNote, setSelectedNote] = useState<Note | null>(notes[0] || null);

  const formatRelTime = (dateString: string) => {
    // eslint-disable-next-line react-hooks/purity
    const diff = Date.now() - new Date(dateString).getTime();
    if (diff < 3600000) return '방금 전';
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}시간 전`;
    return `${Math.floor(diff / 86400000)}일 전`;
  };

  return (
    <div className="flex flex-1 h-full w-full overflow-hidden">
        {/* Note List */}
        <section className="w-[30%] bg-surface-container-low flex flex-col h-full border-r border-outline-variant/15">
          <div className="p-6 border-b border-outline-variant/15">
            <h2 className="text-xl font-bold tracking-tight mb-4 headline">나의 노트</h2>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
              <input className="w-full pl-10 pr-4 py-2 bg-surface-container-high border-none rounded-full text-sm focus:ring-2 focus:ring-primary/20 transition-all" placeholder="노트 검색..." type="text" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
            {notes.map(note => (
              <div 
                key={note.id} 
                onClick={() => setSelectedNote(note)}
                className={`p-5 rounded-xl cursor-pointer transition-colors group ${selectedNote?.id === note.id ? 'bg-surface-container-lowest shadow-sm border-l-4 border-primary' : 'bg-surface-container-lowest/60 hover:bg-surface-container-lowest'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className={`font-semibold line-clamp-1 ${selectedNote?.id === note.id ? 'font-bold text-on-surface' : 'text-on-surface group-hover:text-primary transition-colors'}`}>
                    {note.title}
                  </h3>
                  <span className="text-[10px] text-outline font-medium flex-shrink-0 ml-2">{formatRelTime(note.updated_at)}</span>
                </div>
                {/* using dangerouslySetInnerHTML to strip tags for preview or just show string if no tags. we assume plain text for mockup */}
                <p className="text-xs text-secondary line-clamp-2 leading-relaxed" dangerouslySetInnerHTML={{ __html: note.content }} />
                <div className="mt-3 flex gap-2">
                  <span className="px-2 py-0.5 bg-surface-container-high text-[10px] rounded-full text-secondary">{note.category}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Note Editor */}
        <section className="flex-1 bg-white flex flex-col h-full">
          <div className="px-10 py-6 flex justify-between items-center border-b border-outline-variant/10">
            <div className="flex gap-4">
              <button className="p-2 hover:bg-surface-container-low rounded-lg transition-colors">
                <span className="material-symbols-outlined text-secondary">format_bold</span>
              </button>
              <button className="p-2 hover:bg-surface-container-low rounded-lg transition-colors">
                <span className="material-symbols-outlined text-secondary">format_italic</span>
              </button>
              <button className="p-2 hover:bg-surface-container-low rounded-lg transition-colors">
                <span className="material-symbols-outlined text-secondary">format_list_bulleted</span>
              </button>
              <div className="w-px h-6 bg-outline-variant/30 self-center mx-1"></div>
              <button className="p-2 hover:bg-surface-container-low rounded-lg transition-colors">
                <span className="material-symbols-outlined text-secondary">attach_file</span>
              </button>
              <button className="p-2 hover:bg-surface-container-low rounded-lg transition-colors">
                <span className="material-symbols-outlined text-secondary">image</span>
              </button>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-secondary hover:bg-surface-container-low rounded-lg transition-colors">
                <span className="material-symbols-outlined text-lg">share</span>
                공유하기
              </button>
              <button className="px-4 py-2 text-sm font-bold text-white bg-primary rounded-lg shadow-sm hover:bg-primary-container transition-colors">
                저장
              </button>
            </div>
          </div>
          {selectedNote ? (
            <div className="flex-1 overflow-y-auto p-12 max-w-4xl mx-auto w-full">
              <header className="mb-10">
                <div className="flex items-center gap-2 text-sm text-outline mb-4">
                  <span className="font-medium">작성일: {new Date(selectedNote.created_at).toLocaleDateString('ko-KR')}</span>
                  <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
                  <span className="font-medium">마지막 수정: {formatRelTime(selectedNote.updated_at)}</span>
                </div>
                <input 
                  className="w-full text-4xl font-black tracking-tight text-on-surface border-none focus:ring-0 p-0 mb-6 placeholder-surface-variant outline-none" 
                  placeholder="제목을 입력하세요" 
                  type="text" 
                  defaultValue={selectedNote.title} 
                />
                <div className="flex gap-2 items-center flex-wrap">
                  {selectedNote.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">#{tag}</span>
                  ))}
                  <span className="px-3 py-1 bg-surface-container-high text-on-surface-variant text-xs font-bold rounded-full cursor-pointer hover:bg-surface-container-highest">+ 태그 추가</span>
                </div>
              </header>
              <div 
                className="note-editor-canvas text-lg text-on-surface outline-none min-h-[500px]" 
                contentEditable="true"
                dangerouslySetInnerHTML={{ __html: selectedNote.content }}
              />
            </div>
          ) : (
            <div className="flex-1 flex justify-center items-center text-secondary">
              노트를 선택해주세요.
            </div>
          )}
        </section>
    </div>
  );
}
