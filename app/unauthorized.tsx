import Link from 'next/link';
export default function Unauthorized(){return <section className="shell form-page"><span className="kicker">403</span><h1 style={{fontSize:'clamp(3rem,8vw,6rem)'}}>This table is reserved.</h1><p className="lede">You do not have permission to view this page.</p><Link href="/" className="button">Back to menu</Link></section>}
