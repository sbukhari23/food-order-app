import type { MetadataRoute } from "next";
import { meals } from "@/lib/catalog";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXTAUTH_URL ?? "https://example.com";
  return [
    { url: base, lastModified: new Date() },
    ...meals.map((meal) => ({
      url: `${base}/meals/${meal.id}`,
      lastModified: new Date(),
    })),
  ];
}
