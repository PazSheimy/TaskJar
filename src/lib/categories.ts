export const CATEGORIES = [
  { slug: "yard", label: "Yard & lawn" },
  { slug: "pressure-washing", label: "Pressure washing" },
  { slug: "cleaning", label: "House cleaning" },
  { slug: "laundry", label: "Laundry & ironing" },
  { slug: "cooking", label: "Cooking & meal prep" },
  { slug: "pets", label: "Pet sitting & dog walking" },
  { slug: "moving", label: "Moving & hauling" },
  { slug: "handyman", label: "Handyman & small repairs" },
  { slug: "car", label: "Car wash & detailing" },
  { slug: "errands", label: "Errands & delivery" },
  { slug: "tech", label: "Tech help" },
  { slug: "other", label: "Other" },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

const BY_SLUG = new Map<string, string>(CATEGORIES.map((c) => [c.slug, c.label]));

export function categoryLabel(slug: string): string {
  return BY_SLUG.get(slug) ?? slug;
}

export function isCategory(slug: string): slug is CategorySlug {
  return BY_SLUG.has(slug);
}
