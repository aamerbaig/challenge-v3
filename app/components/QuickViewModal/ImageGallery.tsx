"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useReducedMotion } from "@/app/hooks/useReducedMotion";
import { getImageUrl, getImageAlt } from "@/lib/utils/format";
import type { ImageFragment } from "@/lib/shopify/graphql/.generated/storefront.generated";

type ImageGalleryProps = {
  images: ImageFragment[];
  featuredImage: ImageFragment | null | undefined;
  selectedVariantImage?: ImageFragment | null;
};

/**
 * Image gallery component with thumbnail navigation
 * Supports variant-specific images with crossfade animation
 */
export function ImageGallery({
  images,
  featuredImage,
  selectedVariantImage,
}: ImageGalleryProps) {
  const prefersReducedMotion = useReducedMotion();
  
  // Use variant image if available, otherwise use featured image, otherwise first image
  const primaryImage =
    selectedVariantImage || featuredImage || images[0] || null;
  const allImages = primaryImage
    ? [primaryImage, ...images.filter((img) => img.id !== primaryImage?.id)]
    : images;

  const [selectedIndex, setSelectedIndex] = useState(0);
  
  // Update selected index when variant image changes
  useEffect(() => {
    if (selectedVariantImage) {
      const variantImageIndex = allImages.findIndex(
        (img) => img.id === selectedVariantImage.id
      );
      if (variantImageIndex !== -1) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedIndex(variantImageIndex);
      }
    } else if (featuredImage) {
      const featuredImageIndex = allImages.findIndex(
        (img) => img.id === featuredImage.id
      );
      if (featuredImageIndex !== -1) {
        setSelectedIndex(featuredImageIndex);
      }
    }
  }, [selectedVariantImage, featuredImage, allImages]);
  
  const displayedImage = allImages[selectedIndex] || null;

  if (!displayedImage) {
    return (
      <div className="w-full aspect-square bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
        <span className="text-gray-400">No image available</span>
      </div>
    );
  }

  const imageUrl = getImageUrl(displayedImage);
  const imageAlt = getImageAlt(displayedImage, "Product image");

  return (
    <div className="flex flex-col h-full">
      {/* Main Image */}
      <div className="relative flex-1 overflow-hidden bg-gray-100 dark:bg-gray-900">
        <AnimatePresence mode="wait">
          <motion.img
            key={displayedImage.id}
            src={imageUrl}
            alt={imageAlt}
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
          />
        </AnimatePresence>
      </div>

      {/* Thumbnail Strip */}
      {allImages.length > 1 && (
        <div className="flex gap-2 p-4 overflow-x-auto bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          {allImages.map((image, index) => {
            const thumbUrl = getImageUrl(image);
            const isSelected = index === selectedIndex;

            return (
              <button
                key={image.id}
                onClick={() => setSelectedIndex(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                  isSelected
                    ? "border-gray-900 dark:border-white"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
                aria-label={`View image ${index + 1}`}
              >
                <img
                  src={thumbUrl}
                  alt={getImageAlt(image, `Thumbnail ${index + 1}`)}
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
