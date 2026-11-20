import { Hero } from "@/components/home/hero";
import {
  CategoriesSection,
  CtaBand,
  FeaturedSection,
  HowItWorks,
  ReviewsSection,
  WhyChooseUs,
} from "@/components/home/sections";
import { publicApi } from "@/lib/api";
import { FALLBACK_CATEGORIES } from "@/lib/categories";
import type { Category, Equipment, Review } from "@/types";

export const dynamic = "force-dynamic";

async function loadHomeData() {
  try {
    const [featured, categories, reviews] = await Promise.all([
      publicApi<{ data: Equipment[] }>("/api/equipment/featured"),
      publicApi<{ data: Category[] }>("/api/equipment/categories"),
      publicApi<{ data: Review[] }>("/api/reviews?limit=4"),
    ]);

    return {
      featured: featured.data,
      categories: categories.data.length ? categories.data : FALLBACK_CATEGORIES,
      reviews: reviews.data,
    };
  } catch {
    return {
      featured: [] as Equipment[],
      categories: FALLBACK_CATEGORIES,
      reviews: [] as Review[],
    };
  }
}

export default async function HomePage() {
  const { featured, categories, reviews } = await loadHomeData();

  return (
    <>
      <Hero />
      <FeaturedSection equipment={featured} />
      <CategoriesSection categories={categories} />
      <WhyChooseUs />
      <HowItWorks />
      <ReviewsSection reviews={reviews} />
      <CtaBand />
    </>
  );
}
