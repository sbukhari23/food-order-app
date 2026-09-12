import Link from 'next/link';
export default function NotFound(){return <section className="shell form-page"><span className="kicker">404</span><h1 style={{fontSize:'clamp(3rem,8vw,6rem)'}}>That plate wandered off.</h1><p className="lede">The page you’re looking for does not exist.</p><Link href="/" className="button">Back to menu</Link></section>}
