import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { meals } from '@/lib/catalog';
import MealDetailActions from '@/components/meals/MealDetailActions';

export function generateStaticParams(){return meals.map((meal)=>({mealId:meal.id}));}
export default async function MealPage({params}:{params:Promise<{mealId:string}>}){const {mealId}=await params;const meal=meals.find((item)=>item.id===mealId);if(!meal)notFound();return <section className="shell form-page"><Link className="muted" href="/">← Back to menu</Link><div style={{display:'grid',gridTemplateColumns:'minmax(0,1fr) minmax(0,1fr)',gap:'2rem',marginTop:'2rem'}}><Image className="card-image" src={`/${meal.image}`} alt={meal.name} width={700} height={560}/><div><span className="kicker">{meal.category}</span><h1 style={{fontSize:'clamp(2.5rem,6vw,5rem)'}}>{meal.name}</h1><p className="price" style={{fontSize:'1.5rem'}}>${meal.price.toFixed(2)}</p><p className="lede">{meal.description}</p><MealDetailActions meal={meal}/><div className="panel" style={{marginTop:'2rem'}}><h3>Reviews</h3><p className="muted">Reviews from the ReactFood table are coming soon. Sign in to share yours.</p></div></div></div></section>}
