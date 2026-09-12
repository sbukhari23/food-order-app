import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { sendOrderConfirmation } from '@/lib/email';
import { connectDb } from '@/lib/db';
import { OrderModel } from '@/models/Order';

export async function POST(request: Request) {
	if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
		return NextResponse.json({ error: 'Stripe is not configured.' }, { status: 503 });
	}

	const signature = request.headers.get('stripe-signature');
	if (!signature) return NextResponse.json({ error: 'Missing signature.' }, { status: 400 });

	let event;
	try {
		event = stripe.webhooks.constructEvent(
			await request.text(),
			signature,
			process.env.STRIPE_WEBHOOK_SECRET,
		);
	} catch {
		return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 });
	}

	const database = await connectDb();
	if (!database) {
		return NextResponse.json({ error: 'Database is not configured.' }, { status: 503 });
	}

	if (event.type === 'checkout.session.completed') {
		const session = event.data.object;
		const orderId = session.metadata?.orderId;
		if (orderId) {
			const order = await OrderModel.findOneAndUpdate(
				{ id: orderId },
				{ paymentStatus: 'paid' },
				{ new: true },
			).lean();
			if (order) {
				await sendOrderConfirmation({
					id: order.id,
					items: order.items,
					customer: order.customer,
					total: order.total,
					status: order.status,
					paymentStatus: order.paymentStatus,
					createdAt: order.createdAt.toISOString(),
				});
			}
		}
	}

	return NextResponse.json({ received: true });
}
