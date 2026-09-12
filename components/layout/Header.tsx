'use client';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, UserRound } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function Header() { const {count,setOpen}=useCart(); return <header className="header"><div className="shell header-inner"><Link href="/" className="brand"><Image src="/logo.jpg" alt="ReactFood logo" width={42} height={42}/><span>ReactFood</span></Link><nav className="nav"><Link className="nav-link" href="/#menu">Menu</Link><Link className="nav-link" href="/account"><UserRound size={17}/>Account</Link><button className="icon-button" onClick={()=>setOpen(true)} aria-label="Open cart"><ShoppingBag size={19}/>Cart <span className="badge">{count}</span></button></nav></div></header>; }
