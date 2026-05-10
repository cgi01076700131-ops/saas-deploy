import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import NoteUI from './NoteUI';

describe('Note UI', () => {
  const mockNotes = [
    {
      id: '1',
      title: '2024년 2분기 프로젝트 전략',
      content: '이번 분기 핵심 목표는 사용자 경험의 극대화입니다.',
      category: '업무',
      tags: ['업무', '전략'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      title: '주말 쇼핑 리스트',
      content: '유기농 우유, 샐러드용 채소...',
      category: '개인',
      tags: ['개인'],
      created_at: new Date(Date.now() - 3600000).toISOString(),
      updated_at: new Date(Date.now() - 3600000).toISOString(),
    }
  ];

  it('renders the note list', () => {
    render(<NoteUI notes={mockNotes} />);
    expect(screen.getByText('2024년 2분기 프로젝트 전략')).toBeInTheDocument();
    expect(screen.getByText('주말 쇼핑 리스트')).toBeInTheDocument();
  });

  it('renders the selected note in the editor', () => {
    render(<NoteUI notes={mockNotes} />);
    // The first one is usually selected by default in this mockup
    const headerInput = screen.getByDisplayValue('2024년 2분기 프로젝트 전략');
    expect(headerInput).toBeInTheDocument();
  });

});
