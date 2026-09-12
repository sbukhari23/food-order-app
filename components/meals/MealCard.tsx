'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, ShoppingBag, Star } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import type { Meal } from '@/lib/types';
import { useCart } from '@/context/CartContext';

export default function MealCard({ meal }: { meal: Meal }) {
	const [quantity, setQuantity] = useState(1);
	const { dispatch } = useCart();
	const add = () => {
		dispatch({ type: 'add', meal, quantity });
		toast.success(`${meal.name} added to your basket`);
	};

	return (
		<article className="card">
			<Link href={`/meals/${meal.id}`}>
				<Image className="card-image" src={`/${meal.image}`} alt={meal.name} width={500} height={420} />
			</Link>
			<div className="card-body">
				<div className="card-top">
					<span className="category">{meal.category}</span>
					<span className="price">${meal.price.toFixed(2)}</span>
				</div>
				<Link href={`/meals/${meal.id}`}>
					<h3>{meal.name}</h3>
				</Link>
				{meal.rating !== undefined && (
					<div className="muted" aria-label={`${meal.rating} out of 5 stars from ${meal.reviewCount ?? 0} reviews`}>
						<Star size={15} fill="currentColor" aria-hidden="true" /> {meal.rating.toFixed(1)} ({meal.reviewCount ?? 0})
					</div>
				)}
				<p className="description">{meal.description}</p>
				<div className="card-actions">
					<div className="quantity">
						<button aria-label="Decrease quantity" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
							<Minus size={15} />
						</button>
						<span>{quantity}</span>
						<button aria-label="Increase quantity" onClick={() => setQuantity(quantity + 1)}>
							<Plus size={15} />
						</button>
					</div>
					<button className="button" onClick={add}>
						<ShoppingBag size={16} /> Add
					</button>
				</div>
			</div>
		</article>
	);
}
