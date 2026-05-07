import { nhostConfig, toNhostFileUrl } from "@/lib/nhost";
import {
  products as fallbackProducts,
  getByCategory as fallbackByCategory,
  getProductBySlug as fallbackBySlug,
  navDrawer as fallbackNavDrawer,
  inspiration as fallbackInspiration,
  collectionMeta as fallbackCollectionMeta,
  type CategorySlug,
  type Product,
} from "@/lib/data";

type GqlProduct = {
  id: string;
  sku?: string | null;
  name: string;
  slug: string | null;
  short_description: string | null;
  detailed_desc: string | null;
  base_price: number | null;
  sale_price: number | null;
  currency: string | null;
  status?: string | null;
  storefront_visible?: boolean | null;
  show_new_badge_until?: string | null;
  fabric?: string | null;
  style?: string | null;
  care_instructions?: string | null;
  size_options?: string[] | null;
  storefront_specs?: Record<string, unknown> | null;
  product_cat?: { name?: string | null; slug?: string | null } | null;
  product_images?: Array<{ image_id?: string | null; position?: number | null }> | null;
  product_attributes?:
    | Array<{
        name?: string | null;
        product_attributes_values?: Array<{ value?: string | null }> | null;
      }>
    | null;
  product_variations?:
    | Array<{
        id?: string | null;
        sku?: string | null;
        base_price?: number | null;
        sale_price?: number | null;
        product_variation_attributes?:
          | Array<{
              product_attribute?: { name?: string | null } | null;
              product_attributes_value?: { value?: string | null } | null;
            }>
          | null;
      }>
    | null;
};

type ProductsQueryResponse = {
  products: GqlProduct[];
};

type GqlCategory = {
  id: string;
  name: string;
  slug: string;
  image_id?: string | null;
  storefront_title?: string | null;
  storefront_description?: string | null;
  storefront_visible?: boolean | null;
  storefront_sort?: number | null;
  taxonomy_type?: "collection" | "inspiration" | "category" | null;
  is_sticked?: boolean | null;
  parent_id?: string | null;
};

type CategoriesQueryResponse = {
  product_cats: GqlCategory[];
};

const PRODUCTS_QUERY = `
  query WearinStoreProducts {
    products(order_by: { created_at: desc }) {
      id
      sku
      name
      slug
      short_description
      detailed_desc
      base_price
      sale_price
      currency
      status
      storefront_visible
      show_new_badge_until
      fabric
      style
      care_instructions
      size_options
      storefront_specs
      product_cat {
        name
        slug
      }
      product_images(order_by: { position: asc }) {
        image_id
        position
      }
      product_attributes {
        name
        product_attributes_values {
          value
        }
      }
      product_variations {
        id
        sku
        base_price
        sale_price
        product_variation_attributes {
          product_attribute {
            name
          }
          product_attributes_value {
            value
          }
        }
      }
    }
  }
`;

const CATEGORIES_QUERY = `
  query WearinStorefrontCategories {
    product_cats(
      order_by: [{ storefront_sort: asc }, { name: asc }]
    ) {
      id
      name
      slug
      image_id
      storefront_title
      storefront_description
      storefront_visible
      storefront_sort
      taxonomy_type
      is_sticked
      parent_id
    }
  }
`;

function isCategoryVisible(row: GqlCategory) {
  return row.storefront_visible !== false;
}

function normalizeCategoryType(
  value?: string | null,
): "collection" | "inspiration" | "category" {
  const v = (value || "category").toLowerCase();
  if (v === "collection" || v === "inspiration" || v === "category") return v;
  return "category";
}

function normalizeSlug(slug?: string | null) {
  return (slug || "")
    .trim()
    .replace(/^\/+/, "")
    .toLowerCase();
}

function toCategorySlug(raw?: string | null): CategorySlug {
  return normalizeSlug(raw || "ready-to-wear");
}

function toProductSlug(name: string, fallbackId: string, slug?: string | null) {
  const source = slug || name || fallbackId;
  return source
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || fallbackId;
}

function toCurrencyCode(raw?: string | null) {
  const value = (raw || "").trim();
  if (!value) return "PKR";
  const code = value.split("-")[0]?.trim().toUpperCase() || "PKR";
  return /^[A-Z]{3}$/.test(code) ? code : "PKR";
}

function stripHtml(raw?: string | null) {
  if (!raw) return "";
  return raw
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function mapProduct(row: GqlProduct): Product {
  const sizesAttr = row.product_attributes?.find((a) => a?.name?.toLowerCase() === "size");
  const sizeValuesFromAttr = (sizesAttr?.product_attributes_values ?? [])
    .map((v) => v.value?.trim())
    .filter((v): v is string => Boolean(v));
  const sizeValues = sizeValuesFromAttr.length
    ? sizeValuesFromAttr
    : (row.size_options ?? []).filter((v): v is string => Boolean(v?.trim()));
  const imageUrls = (row.product_images ?? [])
    .map((img) => toNhostFileUrl(img?.image_id))
    .filter((v): v is string => Boolean(v));
  const category = toCategorySlug(row.product_cat?.slug || row.product_cat?.name);
  const mappedVariations = (row.product_variations ?? [])
    .map((variation, index) => {
      const attrs = variation.product_variation_attributes ?? [];
      const sizeAttr = attrs.find(
        (attr) => attr?.product_attribute?.name?.toLowerCase() === "size",
      );
      const sizeValue = sizeAttr?.product_attributes_value?.value?.trim();
      const label = attrs
        .map(
          (attr) =>
            `${attr?.product_attribute?.name || "Option"}: ${attr?.product_attributes_value?.value || "-"}`,
        )
        .join(" / ");
      const price = variation.sale_price ?? variation.base_price ?? null;
      if (typeof price !== "number" || !Number.isFinite(price)) return null;
      return {
        id: variation.id || `${row.id}-var-${index}`,
        sku: variation.sku || undefined,
        label: label || sizeValue || `Variant ${index + 1}`,
        size: sizeValue || undefined,
        price,
        compareAtPrice:
          typeof variation.base_price === "number" &&
          Number.isFinite(variation.base_price) &&
          variation.base_price > price
            ? variation.base_price
            : undefined,
      };
    })
    .filter((variation): variation is NonNullable<typeof variation> => variation !== null);

  const variationPrices = mappedVariations
    .map((variation) => variation.price)
    .filter((price): price is number => typeof price === "number" && Number.isFinite(price));
  const variationCompareAtPrices = mappedVariations
    .map((variation) => variation.compareAtPrice ?? null)
    .filter(
      (compareAtPrice): compareAtPrice is number =>
        typeof compareAtPrice === "number" && Number.isFinite(compareAtPrice),
    );
  const isOnSaleSimple =
    row.status === "on-sale" &&
    typeof row.sale_price === "number" &&
    typeof row.base_price === "number" &&
    row.base_price > row.sale_price;
  const price = variationPrices.length
    ? Math.min(...variationPrices)
    : isOnSaleSimple
      ? (row.sale_price as number)
      : (row.base_price ?? row.sale_price ?? 0);
  const compareAtPrice = variationPrices.length
    ? (variationCompareAtPrices.length ? Math.min(...variationCompareAtPrices) : undefined)
    : isOnSaleSimple
      ? row.base_price ?? undefined
      : undefined;
  const description = stripHtml(row.detailed_desc || row.short_description) || undefined;
  const details: string[] = [];
  if (row.fabric) details.push(`Fabric: ${row.fabric}`);
  if (row.style) details.push(`Style: ${row.style}`);
  if (row.care_instructions) details.push(`Care: ${row.care_instructions}`);
  if (sizeValues.length) details.push(`Available sizes: ${sizeValues.join(", ")}`);
  if (row.storefront_specs && typeof row.storefront_specs === "object") {
    Object.entries(row.storefront_specs).forEach(([key, value]) => {
      if (value !== null && value !== undefined && String(value).trim()) {
        details.push(`${key}: ${String(value)}`);
      }
    });
  }

  const now = Date.now();
  const newBadgeUntil = row.show_new_badge_until
    ? new Date(row.show_new_badge_until).getTime()
    : 0;
  const newIn = Boolean(newBadgeUntil && newBadgeUntil >= now);

  return {
    id: row.id,
    sku: row.sku || row.id,
    slug: toProductSlug(row.name, row.id, row.slug),
    name: row.name,
    subtitle: stripHtml(row.short_description) || row.product_cat?.name || "Wearin Collection",
    price,
    compareAtPrice,
    currency: toCurrencyCode(row.currency),
    category,
    collection: row.product_cat?.name || "Ready to Wear",
    image: imageUrls[0] || "/images/products/p01.svg",
    gallery: imageUrls.length ? imageUrls : undefined,
    newIn,
    sizes: sizeValues.length
      ? sizeValues
      : mappedVariations.map((variation) => variation.size).filter((value): value is string => Boolean(value)),
    variations: mappedVariations.length ? mappedVariations : undefined,
    description,
    details: details.length
      ? details
      : description
        ? [description]
        : ["Fabric and product details are available on request."],
    tags: [category, "dynamic"],
  };
}

async function runProductsQuery() {
  if (!nhostConfig.graphqlUrl) return [];
  const response = await fetch(nhostConfig.graphqlUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(nhostConfig.adminSecret
        ? {
            "x-hasura-admin-secret": nhostConfig.adminSecret,
          }
        : {}),
    },
    body: JSON.stringify({ query: PRODUCTS_QUERY }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.status} ${response.statusText}`);
  }

  const json = (await response.json()) as {
    data?: ProductsQueryResponse;
    errors?: Array<{ message?: string }>;
  };

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message || "Unknown GraphQL error").join(", "));
  }

  return json.data?.products ?? [];
}

async function runCategoriesQuery() {
  if (!nhostConfig.graphqlUrl) return [];
  const response = await fetch(nhostConfig.graphqlUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(nhostConfig.adminSecret
        ? {
            "x-hasura-admin-secret": nhostConfig.adminSecret,
          }
        : {}),
    },
    body: JSON.stringify({ query: CATEGORIES_QUERY }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.status} ${response.statusText}`);
  }

  const json = (await response.json()) as {
    data?: CategoriesQueryResponse;
    errors?: Array<{ message?: string }>;
  };

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message || "Unknown GraphQL error").join(", "));
  }

  return json.data?.product_cats ?? [];
}

export async function getStoreProducts(): Promise<Product[]> {
  if (!nhostConfig.graphqlUrl) {
    return fallbackProducts;
  }
  try {
    const rows = await runProductsQuery();
    const mapped = rows
      .filter((row) => row.storefront_visible !== false)
      .map(mapProduct)
      .filter((p) => p.name && p.slug);
    return mapped.length ? mapped : fallbackProducts;
  } catch (error) {
    console.error("GraphQL products fetch failed, using fallback data:", error);
    return fallbackProducts;
  }
}

export async function getStoreProductBySlug(slug: string) {
  const all = await getStoreProducts();
  return all.find((p) => p.slug === slug) ?? fallbackBySlug(slug);
}

export async function getStoreProductsByCategory(slug: string | "all") {
  const all = await getStoreProducts();
  if (slug === "all") return all;
  const filtered = all.filter((p) => p.category === slug || p.collection.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") === slug);
  if (filtered.length) return filtered;
  if (
    slug === "ready-to-wear" ||
    slug === "unstitched" ||
    slug === "west" ||
    slug === "modest-wear" ||
    slug === "accessories"
  ) {
    return fallbackByCategory(slug as CategorySlug);
  }
  return all;
}

export type StoreCollectionMeta = {
  slug: string;
  title: string;
  description: string;
  image?: string;
};

export type StoreInspiration = {
  name: string;
  quote: string;
  slug: string;
  isSticked: boolean;
};

export type StoreNavSection = {
  title: string;
  href: string;
  children: { label: string; href: string }[];
};

export type StoreProductCat = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  type: "collection" | "inspiration" | "category";
  isSticked: boolean;
};

export async function getStoreCategories(): Promise<StoreCollectionMeta[]> {
  if (!nhostConfig.graphqlUrl) {
    return Object.entries(fallbackCollectionMeta).map(([slug, value]) => ({
      slug,
      title: value.title,
      description: value.description,
    }));
  }

  try {
    const rows = await runCategoriesQuery();
    const collections = rows.filter(
      (r) => isCategoryVisible(r) && normalizeCategoryType(r.taxonomy_type) === "collection",
    );
    return collections.map((row) => ({
      slug: normalizeSlug(row.slug),
      title: row.storefront_title || row.name,
      description: (row.storefront_description || "").trim(),
      image: toNhostFileUrl(row.image_id) || undefined,
    }));
  } catch (error) {
    console.error("GraphQL categories fetch failed, using fallback data:", error);
    return Object.entries(fallbackCollectionMeta).map(([slug, value]) => ({
      slug,
      title: value.title,
      description: value.description,
    }));
  }
}

export async function getStoreProductCats(): Promise<StoreProductCat[]> {
  if (!nhostConfig.graphqlUrl) {
    return [];
  }

  try {
    const rows = await runCategoriesQuery();
    return rows.filter(isCategoryVisible).map((row) => ({
      id: row.id,
      name: row.storefront_title || row.name,
      slug: normalizeSlug(row.slug),
      parentId: row.parent_id || null,
      type: normalizeCategoryType(row.taxonomy_type),
      isSticked: Boolean(row.is_sticked),
    }));
  } catch (error) {
    console.error("GraphQL product_cats fetch failed:", error);
    return [];
  }
}

export async function getStoreInspirations(): Promise<StoreInspiration[]> {
  if (!nhostConfig.graphqlUrl) {
    return fallbackInspiration.map((i) => ({
      name: i.name,
      quote: i.quote,
      slug: i.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      isSticked: false,
    }));
  }

  try {
    const rows = await runCategoriesQuery();
    return rows
      .filter(
        (r) => isCategoryVisible(r) && normalizeCategoryType(r.taxonomy_type) === "inspiration",
      )
      .map((r) => ({
        name: r.storefront_title || r.name,
        quote: r.storefront_description || `${r.name} inspiration`,
        slug: normalizeSlug(r.slug),
        isSticked: Boolean(r.is_sticked),
      }));
  } catch (error) {
    console.error("GraphQL inspirations fetch failed, using fallback data:", error);
    return fallbackInspiration.map((i) => ({
      name: i.name,
      quote: i.quote,
      slug: i.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      isSticked: false,
    }));
  }
}

export async function getStoreNavSections(): Promise<StoreNavSection[]> {
  if (!nhostConfig.graphqlUrl) {
    return fallbackNavDrawer.map((s) => ({
      title: s.title,
      href: s.href,
      children: (s.children || []).map((c) => ({ label: c.label, href: c.href })),
    }));
  }

  try {
    const rows = await runCategoriesQuery();
    const collections = rows.filter(
      (r) => isCategoryVisible(r) && normalizeCategoryType(r.taxonomy_type) === "collection",
    );
    const categories = rows.filter(
      (r) => isCategoryVisible(r) && normalizeCategoryType(r.taxonomy_type) === "category",
    );
    const byParent = new Map<string, GqlCategory[]>();

    categories.forEach((cat) => {
      if (!cat.parent_id) return;
      const arr = byParent.get(cat.parent_id) || [];
      arr.push(cat);
      byParent.set(cat.parent_id, arr);
    });

    return collections.map((collection) => ({
      title: collection.storefront_title || collection.name,
      href: `/collections/${normalizeSlug(collection.slug)}`,
      children: (byParent.get(collection.id) || []).map((child) => ({
        label: child.storefront_title || child.name,
        href: `/collections/${normalizeSlug(child.slug)}`,
      })),
    }));
  } catch (error) {
    console.error("GraphQL navigation fetch failed, using fallback data:", error);
    return fallbackNavDrawer.map((s) => ({
      title: s.title,
      href: s.href,
      children: (s.children || []).map((c) => ({ label: c.label, href: c.href })),
    }));
  }
}
