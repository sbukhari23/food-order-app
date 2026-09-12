import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import MealCard from '../components/meals/MealCard';
import { CartProvider, useCart } from '../context/CartContext';
import type { Meal } from '../lib/types';

const meal: Meal = {
  id: 'admin-meal',
  name: 'Admin Special',
  price: 18.5,
  description: 'A carefully tested special.',
  image: 'images/mac-and-cheese.jpg',
  category: 'Mains',
  rating: 4.8,
  reviewCount: 12,
};

function CartProbe() {
  const { items } = useCart();
  return <output data-testid="cart-state">{JSON.stringify(items)}</output>;
}

describe('MealCard', () => {
  it('renders meal details, rating, and dispatches the selected quantity', async () => {
    const user = userEvent.setup();
    render(<CartProvider><MealCard meal={meal} /><CartProbe /></CartProvider>);

    expect(screen.getByRole('heading', { name: meal.name })).toBeInTheDocument();
    expect(screen.getByText('$18.50')).toBeInTheDocument();
    expect(screen.getByAltText(meal.name)).toBeInTheDocument();
    expect(screen.getByText('4.8 (12)')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Increase quantity' }));
    await user.click(screen.getByRole('button', { name: 'Increase quantity' }));
    await user.click(screen.getByRole('button', { name: /Add/ }));

    expect(JSON.parse(screen.getByTestId('cart-state').textContent ?? '[]')[0].quantity).toBe(3);
  });
});
