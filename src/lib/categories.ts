import type { Category } from "@/types";

export const FALLBACK_CATEGORIES: Category[] = [
  {
    slug: "construction",
    label: "Construction Equipment",
    short: "Construction",
    description: "Excavators, mixers, compactors and site-ready machinery.",
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80",
    count: 0,
  },
  {
    slug: "photography",
    label: "Photography Equipment",
    short: "Photography",
    description: "Cameras, cinema lenses, lighting and studio kits.",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80",
    count: 0,
  },
  {
    slug: "vehicles",
    label: "Vehicles & Transportation",
    short: "Vehicles",
    description: "Vans, pickups and trailers for every kind of haul.",
    image:
      "https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=900&q=80",
    count: 0,
  },
  {
    slug: "agriculture",
    label: "Agriculture Equipment",
    short: "Agriculture",
    description: "Tractors, harvesters and implements built for the field.",
    image:
      "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=900&q=80",
    count: 0,
  },
  {
    slug: "electronics",
    label: "Electronics",
    short: "Electronics",
    description: "Projectors, drones, audio and production gear.",
    image:
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=900&q=80",
    count: 0,
  },
  {
    slug: "events",
    label: "Event Equipment",
    short: "Events",
    description: "Staging, sound, lighting and celebration essentials.",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80",
    count: 0,
  },
];

export const CATEGORY_LABELS = FALLBACK_CATEGORIES.map((item) => item.label);

export const RENTAL_TYPES = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];
