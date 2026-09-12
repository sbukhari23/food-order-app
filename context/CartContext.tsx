'use client';

import { createContext, useContext, useEffect, useReducer, useState, type ReactNode } from 'react';
import type { CartItem, Meal } from '@/lib/types';

type Action = { type:'add'; meal:Meal; quantity?:number } | { type:'remove'; id:string } | { type:'update'; id:string; quantity:number } | { type:'clear' };
export function cartReducer(state:CartItem[], action:Action):CartItem[] {
  if (action.type === 'clear') return [];
  if (action.type === 'remove') return state.filter((item) => item.id !== action.id);
  if (action.type === 'update') return action.quantity <= 0 ? state.filter((item) => item.id !== action.id) : state.map((item) => item.id === action.id ? {...item, quantity:action.quantity} : item);
  const existing = state.find((item) => item.id === action.meal.id);
  if (existing) return state.map((item) => item.id === action.meal.id ? {...item, quantity:item.quantity + (action.quantity ?? 1)} : item);
  return [...state, {...action.meal, quantity:action.quantity ?? 1}];
}

type CartContextValue = { items:CartItem[]; count:number; total:number; dispatch:React.Dispatch<Action>; open:boolean; setOpen:(open:boolean)=>void };
const CartContext = createContext<CartContextValue | null>(null);
export function CartProvider({children}:{children:ReactNode}) {
  const [items, dispatch] = useReducer(cartReducer, []);
  const [hydrated, setHydrated] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => { queueMicrotask(() => { const saved = localStorage.getItem('reactfood-cart'); if (saved) { for (const item of JSON.parse(saved) as CartItem[]) dispatch({type:'add', meal:item, quantity:item.quantity}); } setHydrated(true); }); }, []);
  useEffect(() => { if (hydrated) localStorage.setItem('reactfood-cart', JSON.stringify(items)); }, [items, hydrated]);
  return <CartContext.Provider value={{items, count:items.reduce((sum,item)=>sum+item.quantity,0), total:items.reduce((sum,item)=>sum+item.price*item.quantity,0), dispatch, open, setOpen}}>{children}</CartContext.Provider>;
}
export function useCart() { const value = useContext(CartContext); if (!value) throw new Error('useCart must be used inside CartProvider'); return value; }
