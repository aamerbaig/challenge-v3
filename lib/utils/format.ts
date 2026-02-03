/**
 * Utility functions for formatting Shopify data
 */

import type { MoneyV2 } from "@/lib/shopify/graphql/.generated/storefront.types";

/**
 * Format a MoneyV2 object into a localized currency string
 */
export function formatPrice(money: MoneyV2 | null | undefined): string {
  if (!money) return "";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: money.currencyCode,
  }).format(parseFloat(money.amount));
}

/**
 * Format a price range (min-max) into a string
 * Returns single price if min === max, otherwise "min - max"
 */
export function formatPriceRange(
  minPrice: MoneyV2 | null | undefined,
  maxPrice: MoneyV2 | null | undefined
): string {
  if (!minPrice || !maxPrice) return "";

  const min = parseFloat(minPrice.amount);
  const max = parseFloat(maxPrice.amount);

  if (min === max) {
    return formatPrice(minPrice);
  }

  return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
}

/**
 * Get the primary image URL with fallback
 */
export function getImageUrl(
  image: { url?: string | null } | null | undefined,
  fallback?: string
): string {
  return image?.url || fallback || "/placeholder-image.svg";
}

/**
 * Get image alt text with fallback
 */
export function getImageAlt(
  image: { altText?: string | null } | null | undefined,
  fallback: string
): string {
  return image?.altText || fallback;
}
