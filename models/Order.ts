import mongoose, { Schema } from "mongoose";
import { ORDER_STATUSES } from "@/lib/types";

const orderSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, index: true },
    items: [
      {
        id: String,
        name: String,
        image: String,
        price: Number,
        quantity: Number,
      },
    ],
    customer: {
      name: String,
      email: String,
      street: String,
      postalCode: String,
      city: String,
    },
    total: { type: Number, required: true },
    status: { type: String, enum: ORDER_STATUSES, default: "pending" },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    stripeSessionId: String,
  },
  { timestamps: true },
);

export const OrderModel =
  mongoose.models.Order || mongoose.model("Order", orderSchema);
