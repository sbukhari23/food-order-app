import mongoose, { Schema } from 'mongoose';

const mealSchema = new Schema({
  id: { type: String, unique: true, sparse: true },
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, required: true },
  category: { type: String, required: true, index: true },
}, { timestamps: true });

export const MealModel = mongoose.models.Meal || mongoose.model('Meal', mealSchema);
