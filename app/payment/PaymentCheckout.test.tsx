import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PaymentCheckout from './PaymentCheckout';

// Mock the tosspayments sdk
vi.mock('@tosspayments/tosspayments-sdk', () => ({
  loadTossPayments: vi.fn().mockResolvedValue({
    widgets: vi.fn().mockReturnValue({
      setAmount: vi.fn().mockResolvedValue(undefined),
      renderPaymentMethods: vi.fn().mockResolvedValue(undefined),
      renderAgreement: vi.fn().mockResolvedValue(undefined),
      requestPayment: vi.fn().mockResolvedValue(undefined),
    }),
  }),
}));

describe('PaymentCheckout', () => {
  it('renders payment method and agreement containers', () => {
    render(<PaymentCheckout />);
    
    // Check if the containers for the widget exist
    expect(screen.getByTestId('payment-method')).toBeInTheDocument();
    expect(screen.getByTestId('agreement')).toBeInTheDocument();
    
    // It should render the payment button
    expect(screen.getByRole('button', { name: /14,190원 결제하기/i })).toBeInTheDocument();
  });
});
