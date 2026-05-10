import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MainLayout from './layout';

// Mock the Sidebar component to isolate layout test
vi.mock('@/components/Sidebar', () => ({
  default: () => <div data-testid="mock-sidebar">Mock Sidebar</div>
}));

describe('Main Layout (Private Route)', () => {
  it('renders the Sidebar and the children content correctly', () => {
    render(
      <MainLayout>
        <div data-testid="main-content">Hello Content</div>
      </MainLayout>
    );

    // Verify Sidebar is rendered
    expect(screen.getByTestId('mock-sidebar')).toBeInTheDocument();
    
    // Verify children are rendered within the main area
    expect(screen.getByTestId('main-content')).toBeInTheDocument();
  });
});
