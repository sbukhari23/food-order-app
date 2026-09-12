import { NextResponse } from 'next/server';
import { connectDb } from '@/lib/db';
import { MealModel } from '@/models/Meal';
import { ReviewModel } from '@/models/Review';
import { meals } from '@/lib/catalog';
import { getSession } from '@/lib/auth';

export async function GET(_: Request, { params }: { params: Promise<{ mealId: string }> }) {
  const { mealId } = await params;
  const database = await connectDb();
  const meal = database ? await MealModel.findOne({ $or: [{ _id: mealId }, { slug: mealId }] }).lean() : meals.find((item) => item.id === mealId);
  if (!meal) return NextResponse.json({ error: 'Meal not found.' }, { status: 404 });
  const reviews = database ? await ReviewModel.find({ mealId }).sort({ createdAt: -1 }).lean() : [];
  return NextResponse.json({ meal: { ...meal, id: String((meal as { _id?: unknown; id?: string }).id ?? (meal as { _id?: unknown })._id) }, reviews });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ mealId: string }> }) {
  const session = await getSession();
  if (session?.user.role !== 'admin') return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  const database = await connectDb();
  if (!database) return NextResponse.json({ error: 'Database is not configured.' }, { status: 503 });
  const { mealId } = await params;
  const meal = await MealModel.findByIdAndUpdate(mealId, await request.json(), { new: true, runValidators: true });
  return meal ? NextResponse.json({ meal }) : NextResponse.json({ error: 'Meal not found.' }, { status: 404 });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ mealId: string }> }) {
  const session = await getSession();
  if (session?.user.role !== 'admin') return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  const database = await connectDb();
  if (!database) return NextResponse.json({ error: 'Database is not configured.' }, { status: 503 });
  const { mealId } = await params;
  await MealModel.findByIdAndDelete(mealId);
  return NextResponse.json({ ok: true });
}
