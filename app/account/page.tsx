import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
export default async function Account(){const session=await getSession();if(!session)redirect('/login');return <section className="shell form-page"><span className="kicker">Your account</span><h1 style={{fontSize:'clamp(2.5rem,6vw,5rem)'}}>Hi, {session.user.name?.split(' ')[0] ?? 'there'}.</h1><div className="panel"><p>{session.user.email}</p><p className="muted">Save your delivery details and keep an eye on every order from here.</p><Link href="/account/orders" className="button">View order history</Link></div></section>}
