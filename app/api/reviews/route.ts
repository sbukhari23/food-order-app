import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { reviewSchema } from '@/lib/validations';
import { connectDb } from '@/lib/db';
import { ReviewModel } from '@/models/Review';

export async function GET(request: Request) {
  const mealId = new URL(request.url).searchParams.get('mealId');
  if (!mealId) return NextResponse.json({ error: 'mealId is required.' }, { status: 400 });
  const database = await connectDb();
  return NextResponse.json({ reviews: database ? await ReviewModel.find({ mealId }).sort({ createdAt: -1 }).lean() : [] });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Please sign in to review a meal.' }, { status: 401 });
  const parsed = reviewSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: 'Invalid review.', details: parsed.error.flatten().fieldErrors }, { status: 400 });
  const database = await connectDb();
  if (!database) return NextResponse.json({ error: 'Database is not configured.' }, { status: 503 });
  return NextResponse.json({ review: await ReviewModel.create({ ...parsed.data, userId: session.user.id, reviewerName: session.user.name }) }, { status: 201 });
}
