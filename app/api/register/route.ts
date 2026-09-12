import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { connectDb } from "@/lib/db";
import { UserModel } from "@/models/User";

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email(),
  password: z.string().min(8).max(100),
});
export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success)
    return NextResponse.json(
      { error: "Please provide a valid name, email, and password." },
      { status: 400 },
    );
  const database = await connectDb();
  if (!database)
    return NextResponse.json(
      {
        error:
          "We could not create your account right now. Please try again shortly.",
      },
      { status: 503 },
    );
  const existing = await UserModel.findOne({ email: parsed.data.email });
  if (existing)
    return NextResponse.json(
      { error: "An account with that email already exists." },
      { status: 409 },
    );
  const user = await UserModel.create({
    ...parsed.data,
    password: await bcrypt.hash(parsed.data.password, 12),
  });
  return NextResponse.json({ id: String(user._id) }, { status: 201 });
}
