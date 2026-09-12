'use client';
import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { toast } from 'sonner';
import type { Meal } from '@/lib/types';
import { useCart } from '@/context/CartContext';
export default function MealDetailActions({meal}:{meal:Meal}){const [quantity,setQuantity]=useState(1);const {dispatch,setOpen}=useCart();return <div className="card-actions"><div className="quantity"><button aria-label="Decrease quantity" onClick={()=>setQuantity(Math.max(1,quantity-1))}><Minus size={15}/></button><span>{quantity}</span><button aria-label="Increase quantity" onClick={()=>setQuantity(quantity+1)}><Plus size={15}/></button></div><button className="button" onClick={()=>{dispatch({type:'add',meal,quantity});toast.success('Added to your basket');setOpen(true)}}>Add to basket</button></div>}
