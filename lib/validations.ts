import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email(),
  street: z.string().trim().min(3).max(120),
  postalCode: z.string().trim().min(3).max(20),
  city: z.string().trim().min(2).max(80),
});

export const orderSchema = z.object({
  items: z
    .array(
      z.object({ id: z.string(), quantity: z.number().int().min(1).max(20) }),
    )
    .min(1)
    .max(50),
  customer: customerSchema,
  promoCode: z.string().trim().max(24).optional(),
});

export const reviewSchema = z.object({
  mealId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(3).max(500),
});
