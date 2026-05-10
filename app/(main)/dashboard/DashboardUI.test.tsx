import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DashboardUI from './DashboardUI';

describe('Dashboard UI', () => {
  const mockUser = {
    full_name: '홍길동',
    email: 'hong@example.com',
    avatar_url: 'https://example.com/avatar.png',
  };

  const mockSubscription = {
    plan: 'pro',
    status: 'active',
    next_billing_date: '2024-11-24T00:00:00.000Z',
  };

  const mockUsage = {
    notes_count: 842,
    storage_bytes: 4200000000, // around 4.2 GB
    ai_summaries_count: 156,
  };

  const mockActivities = [
    {
      id: '1',
      action_type: 'edit_document',
      description: '"2024년 4분기 마케팅 전략" 노트 수정',
      created_at: new Date().toISOString(),
    },
  ];

  it('renders the welcome message correctly', () => {
    render(
      <DashboardUI 
        user={mockUser} 
        subscription={mockSubscription} 
        usage={mockUsage} 
        activities={mockActivities} 
      />
    );
    expect(screen.getByRole('heading', { name: /안녕하세요, 홍길동님!/i })).toBeInTheDocument();
  });

  it('renders the subscription details', () => {
    render(
      <DashboardUI 
        user={mockUser} 
        subscription={mockSubscription} 
        usage={mockUsage} 
        activities={mockActivities} 
      />
    );
    expect(screen.getByText('CloudNote Pro')).toBeInTheDocument();
    expect(screen.getByText(/활성 중/i)).toBeInTheDocument();
  });

  it('renders the usage metrics', () => {
    render(
      <DashboardUI 
        user={mockUser} 
        subscription={mockSubscription} 
        usage={mockUsage} 
        activities={mockActivities} 
      />
    );
    expect(screen.getByText(/842 \/ 무제한/i)).toBeInTheDocument();
    expect(screen.getByText(/156 \/ 500/i)).toBeInTheDocument();
  });

  it('renders the recent activities', () => {
    render(
      <DashboardUI 
        user={mockUser} 
        subscription={mockSubscription} 
        usage={mockUsage} 
        activities={mockActivities} 
      />
    );
    expect(screen.getByText(/"2024년 4분기 마케팅 전략" 노트 수정/i)).toBeInTheDocument();
  });
});
