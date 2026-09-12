import type { Metadata } from 'next';
import { Lato, Raleway } from 'next/font/google';
import Providers from '@/components/providers';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import './globals.css';

const lato = Lato({ weight: ['400', '700', '900'], subsets: ['latin'], variable: '--font-lato' });
const raleway = Raleway({ weight: ['400', '500', '600', '700'], subsets: ['latin'], variable: '--font-raleway' });

export const metadata: Metadata = { title: { default:'ReactFood | Dinner, considered', template:'%s | ReactFood' }, description:'A considered menu of comfort food, bright bowls, and late-night favorites.' };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body className={`${lato.variable} ${raleway.variable}`}><Providers><Header/><main>{children}</main><Footer/></Providers></body></html>;}
