import { redirect } from 'next/navigation';
import CheckoutForm from '@/components/checkout/CheckoutForm';

export default function CheckoutPage(){return <section className="shell form-page"><span className="kicker">Almost there</span><h1 style={{fontSize:'clamp(2.5rem,6vw,5rem)'}}>Your table is waiting.</h1><p className="lede">Tell us where to send it. Payment-ready checkout can be connected with Stripe by adding the server keys in .env.local.</p><CheckoutForm/><p className="muted" style={{marginTop:'1rem'}}>Guest checkout is enabled. Your order is created with a secure server-generated id.</p></section>}
