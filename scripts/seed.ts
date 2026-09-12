import mongoose from 'mongoose';
import { meals } from '../lib/catalog';
import { MealModel } from '../models/Meal';
if(!process.env.MONGODB_URI)throw new Error('MONGODB_URI is required to seed the database.');
await mongoose.connect(process.env.MONGODB_URI);
await MealModel.deleteMany({});
await MealModel.insertMany(meals.map((meal)=>({...meal,slug:meal.name.toLowerCase().replace(/[^a-z0-9]+/g,'-')})));
await mongoose.disconnect();
console.log(`Seeded ${meals.length} meals.`);
