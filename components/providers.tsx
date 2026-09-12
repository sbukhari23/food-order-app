'use client';
import { CartProvider } from '@/context/CartContext';
import { Toaster } from 'sonner';
import CartDrawer from '@/components/cart/CartDrawer';
export default function Providers({children}:{children:React.ReactNode}){return <CartProvider><Toaster position="top-right" richColors/><CartDrawer/>{children}</CartProvider>;}
