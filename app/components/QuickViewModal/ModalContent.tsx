"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "./Skeleton";
import { ImageGallery } from "./ImageGallery";
import { VariantSelector } from "./VariantSelector";
import { AddToBagButton } from "./AddToBagButton";
import { useVariantSelection } from "@/app/hooks/useVariantSelection";
import { formatPrice } from "@/lib/utils/format";
import type { GetProductByHandleQuery } from "@/lib/shopify/graphql/.generated/storefront.generated";

type ModalContentProps = {
  productHandle: string;
  onClose: () => void;
};

/**
 * Modal content component that fetches and displays product details
 * Handles loading state with skeleton UI
 */
export function ModalContent({
  productHandle,
  onClose,
}: ModalContentProps) {
  const [product, setProduct] =
    useState<GetProductByHandleQuery["product"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use variant selection hook - MUST be called before any conditional returns
  // Provide empty arrays as defaults when product is not loaded yet
  const {
    resolvedVariant,
    price: variantPrice,
    selectedVariantImage,
  } = useVariantSelection({
    options: product?.options ?? [],
    variants: product?.variants.nodes ?? [],
  });

  // Fetch product data
  useEffect(() => {
    let isCancelled = false;

    async function fetchProduct() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/product/${productHandle}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }

        const data = await response.json();

        if (!isCancelled) {
          setProduct(data.product ?? null);
          setIsLoading(false);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : "Failed to load product");
          setIsLoading(false);
        }
      }
    }

    fetchProduct();

    return () => {
      isCancelled = true;
    };
  }, [productHandle]);

  if (isLoading) {
    return <Skeleton />;
  }

  if (error || !product) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 dark:text-red-400 mb-4">
          {error || "Product not found"}
        </p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-md"
        >
          Close
        </button>
      </div>
    );
  }

  // Determine displayed price - use variant price if available, otherwise product price range
  const displayPrice = variantPrice && resolvedVariant?.price
    ? formatPrice(resolvedVariant.price)
    : formatPrice(product.priceRange.minVariantPrice);
  
  const compareAtPrice = resolvedVariant?.compareAtPrice
    ? formatPrice(resolvedVariant.compareAtPrice)
    : product.compareAtPriceRange?.minVariantPrice
    ? formatPrice(product.compareAtPriceRange.minVariantPrice)
    : null;

  return (
    <div
      className="flex flex-col md:flex-row h-full max-h-[90vh] overflow-auto"
    >
      {/* Image Gallery - Left side on desktop, top on mobile */}
      <div className="flex-shrink-0 w-full md:w-1/2 bg-gray-50 dark:bg-gray-800">
        <ImageGallery
          images={product.images.nodes}
          featuredImage={product.featuredImage}
          selectedVariantImage={selectedVariantImage}
        />
      </div>

      {/* Product Details - Right side on desktop, bottom on mobile */}
      <div className="flex-1 p-6 md:p-8 overflow-y-auto">
        <h2
          id="quick-view-title"
          className="text-3xl font-bold mb-4 text-gray-900 dark:text-white"
        >
          {product.title}
        </h2>

        {product.vendor && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {product.vendor}
          </p>
        )}

        {/* Price */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {displayPrice}
            </span>
            {compareAtPrice && compareAtPrice !== displayPrice && (
              <span className="text-xl text-gray-500 dark:text-gray-400 line-through">
                {compareAtPrice}
              </span>
            )}
          </div>
        </div>

        {/* Variant Selector */}
        {product.options.length > 0 && (
          <div className="mb-6">
            <VariantSelector
              options={product.options}
              variants={product.variants.nodes}
            />
          </div>
        )}

        {/* Add to Bag Button */}
        <AddToBagButton
          resolvedVariant={resolvedVariant}
          onClose={onClose}
        />

        {/* Description */}
        {product.description && (
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              Description
            </h3>
            <div
              className="text-gray-700 dark:text-gray-300 prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{
                __html: product.descriptionHtml || product.description,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
