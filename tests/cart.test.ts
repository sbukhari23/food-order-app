import { describe, expect, it } from 'vitest';
import { cartReducer } from '../context/CartContext';
import type { Meal } from '../lib/types';
const meal:Meal={id:'m1',name:'Soup',price:8,description:'Warm',image:'images/soup.jpg',category:'Mains'};
describe('cartReducer',()=>{it('increments an existing line instead of duplicating it',()=>{const once=cartReducer([],{type:'add',meal});const twice=cartReducer(once,{type:'add',meal});expect(twice).toHaveLength(1);expect(twice[0].quantity).toBe(2)});it('removes a line when its last unit is decremented',()=>{expect(cartReducer([{...meal,quantity:1}],{type:'update',id:'m1',quantity:0})).toEqual([])});it('clears every line',()=>{expect(cartReducer([{...meal,quantity:2}],{type:'clear'})).toEqual([])});});
