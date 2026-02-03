"use client";

import { motion } from "motion/react";
import { useRef } from "react";
import { formatPriceRange, formatPrice } from "@/lib/utils/format";
import { getImageUrl, getImageAlt } from "@/lib/utils/format";
import { useModalContext } from "./ModalProvider";
import type { ImageFragment, MoneyFragment } from "@/lib/shopify/graphql/.generated/storefront.generated";

type ProductCardProps = {
  id: string;
  handle: string;
  title: string;
  featuredImage: ImageFragment | null | undefined;
  priceRange: {
    minVariantPrice: MoneyFragment;
    maxVariantPrice: MoneyFragment;
  };
  compareAtPriceRange: {
    minVariantPrice: MoneyFragment;
    maxVariantPrice: MoneyFragment;
  };
};

/**
 * Product card component displaying product image, title, and price
 * Includes a Quick View button trigger
 */
export function ProductCard({
  id,
  handle,
  title,
  featuredImage,
  priceRange,
  compareAtPriceRange,
}: ProductCardProps) {
  const { openModal, triggerRef } = useModalContext();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const imageUrl = getImageUrl(featuredImage);
  const imageAlt = getImageAlt(featuredImage, title);
  const price = formatPriceRange(
    priceRange.minVariantPrice,
    priceRange.maxVariantPrice
  );

  const handleQuickView = () => {
    // Save button ref for focus restoration
    if (buttonRef.current) {
      // eslint-disable-next-line react-hooks/immutability
      (triggerRef as React.MutableRefObject<HTMLElement | null>).current =
        buttonRef.current;
    }
    openModal(handle);
  };

  return (
    <motion.div
      className="group relative flex flex-col bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
        <motion.img
          src={imageUrl}
          alt={imageAlt}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
        {/* Quick View Overlay */}
        <motion.div
          className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        >
          <motion.button
            ref={buttonRef}
            onClick={handleQuickView}
            className="px-6 py-3 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-medium rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:ring-offset-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Quick view ${title}`}
          >
            Quick View
          </motion.button>
        </motion.div>
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
          {title}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            {price}
          </span>
          {compareAtPriceRange.minVariantPrice &&
            parseFloat(compareAtPriceRange.minVariantPrice.amount) >
              parseFloat(priceRange.minVariantPrice.amount) && (
              <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                {formatPriceRange(
                  compareAtPriceRange.minVariantPrice,
                  compareAtPriceRange.maxVariantPrice
                )}
              </span>
            )}
        </div>
      </div>
    </motion.div>
  );
}
