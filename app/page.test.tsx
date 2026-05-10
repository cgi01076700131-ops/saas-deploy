import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Home from './page';

describe('Landing Page', () => {
  it('renders the main heading correctly', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { name: /당신의 아이디어를/i })).toBeInTheDocument();
  });

  it('renders the pricing plan section', () => {
    render(<Home />);
    expect(screen.getByText(/나에게 맞는 플랜 찾기/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Free/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Pro/i })).toBeInTheDocument();
  });

  it('renders the AI features section', () => {
    render(<Home />);
    expect(screen.getByText(/AI가 당신의 생각을/i)).toBeInTheDocument();
  });
});
