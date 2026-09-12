import mongoose, { Schema } from 'mongoose';

const reviewSchema = new Schema({
  mealId: { type: String, required: true, index: true },
  userId: String,
  reviewerName: String,
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, required: true },
}, { timestamps: true });

export const ReviewModel = mongoose.models.Review || mongoose.model('Review', reviewSchema);
