import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { getSession } from '@/lib/auth';
import { orderSchema } from '@/lib/validations';
import { connectDb } from '@/lib/db';
import { MealModel } from '@/models/Meal';
import { OrderModel } from '@/models/Order';
import { getOrder, listOrders, saveOrder } from '@/lib/order-store';
import mongoose from 'mongoose';

export async function POST(request: Request) {
  const parsed = orderSchema.safeParse(await request.json());
  if (!parsed.success) {
    const details = Object.fromEntries(parsed.error.issues.flatMap((issue) => {
      const path = issue.path.join('.');
      const leaf = issue.path.at(-1);
      return leaf && path !== leaf ? [[path, issue.message], [leaf, issue.message]] : [[path, issue.message]];
    }));
    return NextResponse.json(
      { error: 'Please correct the highlighted fields.', details },
      { status: 400 },
    );
  }

  const database = await connectDb();
  if (!database) return NextResponse.json({ error: 'Database is not configured.' }, { status: 503 });

  const session = await getSession();
  const items = [];
  for (const item of parsed.data.items) {
    const meal = await MealModel.findOne({ id: item.id }).lean()
      ?? (mongoose.isValidObjectId(item.id) ? await MealModel.findById(item.id).lean() : null);
    if (!meal) {
      return NextResponse.json({ error: 'One or more meals are no longer available.' }, { status: 400 });
    }
    items.push({
      id: meal.id ?? String(meal._id),
      name: meal.name,
      price: meal.price,
      description: meal.description,
      image: meal.image,
      category: meal.category,
      quantity: item.quantity,
    });
  }

  const order = {
    id: randomUUID(),
    userId: session?.user.id,
    items,
    customer: parsed.data.customer,
    total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    status: 'pending' as const,
    paymentStatus: 'pending' as const,
    createdAt: new Date().toISOString(),
  };
  await OrderModel.create(order);
  return NextResponse.json({ order }, { status: 201 });
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  const database = await connectDb();
  if (database) { const query = session.user.role === 'admin' ? {} : { userId: session.user.id }; return NextResponse.json({ orders: await OrderModel.find(query).sort({ createdAt: -1 }).lean() }); }
  return NextResponse.json({ orders: session.user.role === 'admin' ? listOrders() : listOrders().filter((order) => order.customer.email === session.user.email) });
}
