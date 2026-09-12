'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { customerSchema } from '@/lib/validations';
import { z } from 'zod';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const schema = customerSchema;
type FormValues = z.infer<typeof schema>;
export default function CheckoutForm() {
	const { items, total, dispatch } = useCart();
	const router = useRouter();
	const { register, handleSubmit, formState: { errors, isSubmitting, isValid } } = useForm<FormValues>({
		resolver: zodResolver(schema),
		mode: 'onChange',
	});

	const submit = async (values: FormValues) => {
		const response = await fetch('/api/orders', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ items: items.map(({ id, quantity }) => ({ id, quantity })), customer: values }),
		});
		const data = await response.json();
		if (!response.ok) {
			toast.error(data.error ?? 'Could not place order');
			return;
		}

		const checkout = await fetch('/api/checkout', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ orderId: data.order.id }),
		});
		const checkoutData = await checkout.json();
		if (!checkout.ok) {
			toast.error(checkoutData.error ?? 'Could not start payment');
			return;
		}

		dispatch({ type: 'clear' });
		router.push(checkoutData.url);
	};

	return (
		<form className="panel" onSubmit={handleSubmit(submit)}>
			<div className="form-grid">
				{(['name', 'email', 'street', 'postalCode', 'city'] as const).map((field) => (
					<div className={`field ${field === 'street' ? 'full' : ''}`} key={field}>
						<label htmlFor={field}>{field === 'postalCode' ? 'Postal code' : field[0].toUpperCase() + field.slice(1)}</label>
						<input className="input" id={field} type={field === 'email' ? 'email' : 'text'} {...register(field)} />
						{errors[field] && <span className="error-text">{errors[field]?.message}</span>}
					</div>
				))}
			</div>
			<button className="button" disabled={isSubmitting || !isValid} style={{ marginTop: '1.25rem' }}>
				{isSubmitting ? 'Placing order…' : `Place order · $${total.toFixed(2)}`}
			</button>
		</form>
	);
}
