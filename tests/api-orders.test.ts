import { describe, expect, it, vi, beforeEach } from 'vitest';

const getSession = vi.fn();
const connectDb = vi.fn();
const findOneMeal = vi.fn();
const findByIdMeal = vi.fn();
const createOrder = vi.fn();
const findOrders = vi.fn();

vi.mock('../lib/auth', () => ({ getSession }));
vi.mock('../lib/db', () => ({ connectDb }));
vi.mock('../models/Meal', () => ({ MealModel: { findOne: findOneMeal, findById: findByIdMeal } }));
vi.mock('../models/Order', () => ({ OrderModel: { create: createOrder, find: findOrders } }));

const { POST, GET } = await import('../app/api/orders/route');

const customer = { name: 'Ada Lovelace', email: 'ada@example.com', street: '1 Analytical Way', postalCode: '10001', city: 'London' };
const meal = { _id: '507f1f77bcf86cd799439011', id: 'admin-meal', name: 'Admin Special', description: 'Special', price: 22.5, image: 'images/mac-and-cheese.jpg', category: 'Mains' };

function request(body: unknown) { return new Request('http://localhost/api/orders', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }); }

describe('POST /api/orders', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    connectDb.mockResolvedValue({});
    getSession.mockResolvedValue(null);
    findByIdMeal.mockResolvedValue(null);
    findOneMeal.mockReturnValue({ lean: () => Promise.resolve(meal) });
    createOrder.mockImplementation(async (order: unknown) => order);
  });

  it('uses the database meal price and creates a valid order', async () => {
    const response = await POST(request({ items: [{ id: 'admin-meal', quantity: 2 }], customer }));
    const body = await response.json();
    expect(response.status).toBe(201);
    expect(body.order.total).toBe(45);
    expect(createOrder).toHaveBeenCalledWith(expect.objectContaining({ total: 45 }));
  });

  it('returns field-specific validation details for missing customer fields', async () => {
    const response = await POST(request({ items: [{ id: 'admin-meal', quantity: 1 }], customer: {} }));
    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.details).toHaveProperty('name');
    expect(body.details).toHaveProperty('email');
  });

  it('rejects an item that is not in the database', async () => {
    findOneMeal.mockReturnValue({ lean: () => Promise.resolve(null) });
    const response = await POST(request({ items: [{ id: 'missing-meal', quantity: 1 }], customer }));
    expect(response.status).toBe(400);
    expect(createOrder).not.toHaveBeenCalled();
  });

  it('associates a logged-in order and returns it from order history', async () => {
    getSession.mockResolvedValue({ user: { id: 'user-1', role: 'user', email: customer.email } });
    const response = await POST(request({ items: [{ id: 'admin-meal', quantity: 1 }], customer }));
    const created = await response.json();
    findOrders.mockReturnValue({ sort: () => ({ lean: () => Promise.resolve([created.order]) }) });
    const history = await GET();
    expect(createOrder).toHaveBeenCalledWith(expect.objectContaining({ userId: 'user-1' }));
    expect((await history.json()).orders).toHaveLength(1);
    expect(findOrders).toHaveBeenCalledWith({ userId: 'user-1' });
  });
});
