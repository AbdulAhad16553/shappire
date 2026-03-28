export type CategorySlug =
  | "ready-to-wear"
  | "unstitched"
  | "west"
  | "modest-wear"
  | "accessories";

export type Product = {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  price: number;
  currency: string;
  category: CategorySlug;
  collection: string;
  image: string;
  newIn?: boolean;
  tags: string[];
};

export const SITE = {
  name: "Aurelia",
  tagline: "Unstitched & Pret — Spring Summer '26",
};

export const navDrawer: { title: string; href: string; children?: { label: string; href: string }[] }[] = [
  {
    title: "Ready to Wear",
    href: "/collections/ready-to-wear",
    children: [
      { label: "Spring Summer '26", href: "/collections/ready-to-wear" },
      { label: "Shirts", href: "/collections/ready-to-wear" },
      { label: "Bottoms", href: "/collections/ready-to-wear" },
      { label: "Dupattas & Shawls", href: "/collections/ready-to-wear" },
    ],
  },
  {
    title: "Unstitched",
    href: "/collections/unstitched",
    children: [
      { label: "Sukoon", href: "/collections/unstitched" },
      { label: "Andaaz", href: "/collections/unstitched" },
      { label: "Raunak", href: "/collections/unstitched" },
    ],
  },
  {
    title: "West",
    href: "/collections/west",
    children: [
      { label: "Tops & Shirts", href: "/collections/west" },
      { label: "Dresses", href: "/collections/west" },
      { label: "Trousers", href: "/collections/west" },
    ],
  },
  {
    title: "Modest Wear",
    href: "/collections/modest-wear",
    children: [
      { label: "Abayas", href: "/collections/modest-wear" },
      { label: "Hijabs", href: "/collections/modest-wear" },
    ],
  },
  {
    title: "Accessories",
    href: "/collections/accessories",
    children: [
      { label: "Bags", href: "/collections/accessories" },
      { label: "Belts", href: "/collections/accessories" },
    ],
  },
];

const imgs = [
  "/images/products/p01.svg",
  "/images/products/p02.svg",
  "/images/products/p03.svg",
  "/images/products/p04.svg",
  "/images/products/p05.svg",
  "/images/products/p06.svg",
  "/images/products/p07.svg",
  "/images/products/p08.svg",
];

function img(i: number) {
  return imgs[i % imgs.length];
}

const names: [string, string, string][] = [
  ["3 Piece Embroidered Lawn Suit", "unstitched", "Unstitched SS '26"],
  ["3 Piece Embroidered Raw Silk Suit", "unstitched", "Unstitched SS '26"],
  ["3 Piece Embroidered Net Suit", "unstitched", "Unstitched SS '26"],
  ["Embroidered Zari Cotton Shirt", "ready-to-wear", "RTW SS '26"],
  ["3 Piece Printed Cambric Suit", "ready-to-wear", "RTW SS '26"],
  ["Tier Dress With Puffed Sleeve", "west", "WEST — SS '26"],
  ["Button Through Cocoon Shirt", "west", "WEST — SS '26"],
  ["Printed Lawn Dupatta", "ready-to-wear", "RTW SS '26"],
  ["Chiffon Embroidered Dupatta", "ready-to-wear", "RTW SS '26"],
  ["Flared Skirt", "west", "WEST — SS '26"],
  ["Abaya Open Front", "modest-wear", "Modest SS '26"],
  ["Silk Hijab Set", "modest-wear", "Modest SS '26"],
  ["Structured Tote Bag", "accessories", "Bags"],
  ["Leather Belt Gold Buckle", "accessories", "Belts"],
  ["Jacquard 3 Piece Suit", "unstitched", "Unstitched SS '26"],
  ["Organza Dupatta Shawl", "ready-to-wear", "RTW SS '26"],
  ["Pleated Wide Leg Trousers", "west", "WEST — SS '26"],
  ["Smocked Midi Dress", "west", "WEST — SS '26"],
  ["Embroidered Dobby Kurta", "ready-to-wear", "RTW SS '26"],
  ["Printed Silk Suit 3 Piece", "unstitched", "Unstitched SS '26"],
  ["Kimono Sleeve Top", "west", "WEST — SS '26"],
  ["Longline Abaya Belted", "modest-wear", "Modest SS '26"],
  ["Crossbody Quilted Bag", "accessories", "Bags"],
  ["Velvet Evening Clutch", "accessories", "Bags"],
  ["Pearl Drop Earrings Set", "accessories", "Jewelry"],
  ["Zari Border Dupatta", "ready-to-wear", "RTW SS '26"],
  ["Schiffli Embroidered Shirt", "ready-to-wear", "RTW SS '26"],
  ["Tiered Maxi Skirt", "west", "WEST — SS '26"],
  ["Chiffon 3 Piece Formal", "unstitched", "Unstitched SS '26"],
  ["Crinkle Hijab Pack", "modest-wear", "Modest SS '26"],
];

export const products: Product[] = names.map(([name, cat, sub], idx) => {
  const category = cat as CategorySlug;
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48)
    + `-${idx}`;
  const base = 3290 + idx * 370 + (idx % 7) * 100;
  return {
    id: `sku-${idx + 1}`,
    slug: slug || `product-${idx + 1}`,
    name,
    subtitle: sub,
    price: base,
    currency: "USD",
    category,
    collection: sub,
    image: img(idx),
    newIn: idx % 4 === 1 || idx % 5 === 0,
    tags: ["Spring", category],
  };
});

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getByCategory(slug: CategorySlug | string) {
  if (slug === "all") return products;
  return products.filter((p) => p.category === slug);
}

export const collectionMeta: Record<string, { title: string; description: string }> = {
  "ready-to-wear": {
    title: "Ready to Wear",
    description: "Enduring artistry and elegance — shirts, bottoms, and dupattas for every occasion.",
  },
  unstitched: {
    title: "Unstitched",
    description: "Sukoon, Andaaz, Raunak — refined concepts for unstitched luxury.",
  },
  west: {
    title: "West",
    description: "Layering pieces that stack, shift, and adapt with the season.",
  },
  "modest-wear": {
    title: "Modest Wear",
    description: "Contemporary silhouettes, elegant hues, airy fabrics.",
  },
  accessories: {
    title: "Accessories",
    description: "Bags, belts, and finishing touches.",
  },
};

export const trendTiles = [
  { title: "It Was All Yellow", subtitle: "Shop the trend", href: "/collections/ready-to-wear" },
  { title: "Embroidered Elegance", subtitle: "Shop the trend", href: "/collections/ready-to-wear" },
  { title: "Lawn Loving", subtitle: "Shop the trend", href: "/collections/unstitched" },
  { title: "Festive Blues", subtitle: "Shop the trend", href: "/collections/ready-to-wear" },
];

export const inspiration = [
  { quote: "It’s giving maximalism — shop the RTW edit.", name: "Editorial" },
  { quote: "Little moments, big style — unstitched for Eid.", name: "Lookbook" },
  { quote: "Denim redefined — Y2K energy from West.", name: "West Journal" },
  { quote: "Warm autumn hues — draped in Intermix.", name: "Seasonal" },
];
