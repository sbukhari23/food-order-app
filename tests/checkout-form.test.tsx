import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import CheckoutForm from '../components/checkout/CheckoutForm';
import { CartProvider } from '../context/CartContext';

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));

describe('CheckoutForm', () => {
  it('shows field validation errors and keeps submit disabled until valid', async () => {
    const user = userEvent.setup();
    render(<CartProvider><CheckoutForm /></CartProvider>);
    const submit = screen.getByRole('button', { name: /Place order/ });

    expect(submit).toBeDisabled();
    await user.type(screen.getByLabelText('Email'), 'not-an-email');

    expect(await screen.findByText(/Invalid email/)).toBeInTheDocument();
    expect(submit).toBeDisabled();
  });
});
