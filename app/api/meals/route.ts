import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { MealModel } from "@/models/Meal";
import { meals } from "@/lib/catalog";
import { getSession, requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim().toLowerCase() ?? "";
  const category = searchParams.get("category") ?? "";
  const sort = searchParams.get("sort") ?? "";
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = 12;
  try {
    const database = await connectDb();
    const filter = {
      ...(category ? { category } : {}),
      ...(search
        ? {
            $or: [
              { name: new RegExp(search, "i") },
              { description: new RegExp(search, "i") },
            ],
          }
        : {}),
    };
    const source = database
      ? await MealModel.find(filter)
          .sort(
            sort === "price-asc"
              ? { price: 1 }
              : sort === "price-desc"
                ? { price: -1 }
                : sort === "name"
                  ? { name: 1 }
                  : {},
          )
          .lean()
      : meals
          .filter(
            (meal) =>
              (!category || meal.category === category) &&
              (!search ||
                `${meal.name} ${meal.description}`
                  .toLowerCase()
                  .includes(search)),
          )
          .sort((a, b) =>
            sort === "price-asc"
              ? a.price - b.price
              : sort === "price-desc"
                ? b.price - a.price
                : sort === "name"
                  ? a.name.localeCompare(b.name)
                  : 0,
          );
    const total = source.length;
    const data = source.slice((page - 1) * limit, page * limit).map((meal) => ({
      ...meal,
      id: String(
        (meal as { _id?: unknown; id?: string }).id ??
          (meal as { _id?: unknown })._id,
      ),
    }));
    return NextResponse.json({
      meals: data,
      page,
      total,
      pages: Math.max(1, Math.ceil(total / limit)),
      categories: [...new Set(meals.map((meal) => meal.category))],
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "We could not load the menu right now. Please try again shortly.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!requireAdmin(session))
    return NextResponse.json(
      { error: "Admin access required." },
      { status: 403 },
    );
  const body = await request.json();
  if (
    !body.name ||
    !body.description ||
    !body.price ||
    !body.category ||
    !body.image
  )
    return NextResponse.json(
      { error: "All meal fields are required." },
      { status: 400 },
    );
  const database = await connectDb();
  if (!database)
    return NextResponse.json(
      {
        error:
          "We could not save that meal right now. Please try again shortly.",
      },
      { status: 503 },
    );
  const meal = await MealModel.create({
    ...body,
    slug: body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  });
  return NextResponse.json({ meal }, { status: 201 });
}
