import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { connectDb } from '@/lib/db';
import { OrderModel } from '@/models/Order';
import { getOrder } from '@/lib/order-store';
import mongoose from 'mongoose';

async function findOrder(orderId: string) {
  const byPublicId = await OrderModel.findOne({ id: orderId }).lean();
  return byPublicId ?? (mongoose.isValidObjectId(orderId) ? OrderModel.findById(orderId).lean() : null);
}

export async function GET(_: Request, { params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const session = await getSession();
  const database = await connectDb();
  const order = database ? await findOrder(orderId) : getOrder(orderId);
  if (!order) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
  const isAdmin = session?.user.role === 'admin';
  const isOwner = Boolean(session?.user.email && session.user.email === order.customer.email);
  if (session && !isAdmin && !isOwner) return NextResponse.json({ error: 'You cannot view this order.' }, { status: 403 });
  return NextResponse.json({ order });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ orderId: string }> }) {
  const session = await getSession();
  if (session?.user.role !== 'admin') return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  const { orderId } = await params;
  const { status } = await request.json();
  if (!['pending', 'preparing', 'out-for-delivery', 'delivered'].includes(status)) return NextResponse.json({ error: 'Invalid status.' }, { status: 400 });
  const database = await connectDb();
  if (database) return NextResponse.json({ order: await OrderModel.findOneAndUpdate({ id: orderId }, { status }, { new: true }).lean() });
  const order = getOrder(orderId); if (!order) return NextResponse.json({ error: 'Order not found.' }, { status: 404 }); order.status = status; return NextResponse.json({ order });
}
