import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getOrder } from '@/lib/order-store';
import { connectDb } from '@/lib/db';
import { OrderModel } from '@/models/Order';

export async function POST(request: Request) {
	const { orderId } = await request.json();
	const database = await connectDb();
	const order = getOrder(orderId)
		?? (database ? await OrderModel.findOne({ id: orderId }).lean() : null);

	if (!order) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
	if (!stripe) return NextResponse.json({ url: `/order-confirmation/${orderId}`, demo: true });

	const session = await stripe.checkout.sessions.create({
		mode: 'payment',
		line_items: order.items.map((item: { name: string; price: number; quantity: number }) => ({
			price_data: {
				currency: 'usd',
				product_data: { name: item.name },
				unit_amount: Math.round(item.price * 100),
			},
			quantity: item.quantity,
		})),
		customer_email: order.customer.email,
		metadata: { orderId },
		success_url: `${process.env.NEXTAUTH_URL}/order-confirmation/${orderId}?paid=1`,
		cancel_url: `${process.env.NEXTAUTH_URL}/checkout?cancelled=1`,
	});

	return NextResponse.json({ url: session.url });
}
