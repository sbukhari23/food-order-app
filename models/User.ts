import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: String,
    role: { type: String, enum: ["user", "admin"], default: "user" },
    address: { street: String, postalCode: String, city: String },
  },
  { timestamps: true },
);

export const UserModel =
  mongoose.models.User || mongoose.model("User", userSchema);
