"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import type { GetProductByHandleQuery } from "@/lib/shopify/graphql/.generated/storefront.generated";

type ProductOption = NonNullable<GetProductByHandleQuery["product"]>["options"][number];
type ProductVariant = NonNullable<GetProductByHandleQuery["product"]>["variants"]["nodes"][number];

type UseVariantSelectionProps = {
  options: ProductOption[];
  variants: ProductVariant[];
};

type UseVariantSelectionReturn = {
  selectedOptions: Record<string, string>;
  selectOption: (optionName: string, value: string) => void;
  resolvedVariant: ProductVariant | null;
  isOptionAvailable: (optionName: string, value: string) => boolean;
  price: string | null;
  selectedVariantImage: ProductVariant["image"] | null;
};

/**
 * Hook for managing product variant selection
 * 
 * Features:
 * - Tracks selected options (e.g., { Size: "M", Color: "Blue" })
 * - Resolves the matching variant from selected options
 * - Checks if an option value is available given current selection
 * - Provides price and image from resolved variant
 */
export function useVariantSelection({
  options,
  variants,
}: UseVariantSelectionProps): UseVariantSelectionReturn {
  // Initialize selectedOptions with first available value for each option
  const initialOptions = useMemo(() => {
    const initial: Record<string, string> = {};
    options.forEach((option) => {
      // Try to find first available value for this option
      const firstAvailableValue = option.values.find((value) =>
        isOptionValueAvailable(option.name, value, {}, variants)
      );
      if (firstAvailableValue) {
        initial[option.name] = firstAvailableValue;
      }
    });
    return initial;
  }, [options, variants]);

  const [selectedOptions, setSelectedOptions] =
    useState<Record<string, string>>(initialOptions);

  // Track previous options/variants to detect actual changes
  const prevOptionsVariantsRef = useRef<string>("");

  // Reset selected options when product changes (options/variants change)
  useEffect(() => {
    // Serialize options and variants to detect actual content changes
    const currentKey = JSON.stringify({
      options: options.map((opt) => ({ name: opt.name, values: opt.values })),
      variants: variants.map((v) => ({
        id: v.id,
        availableForSale: v.availableForSale,
        selectedOptions: v.selectedOptions,
      })),
    });

    // Only update if the actual content changed, not just the reference
    if (prevOptionsVariantsRef.current !== currentKey) {
      prevOptionsVariantsRef.current = currentKey;
      // Recalculate initial options when product actually changes
      const newInitial: Record<string, string> = {};
      options.forEach((option) => {
        const firstAvailableValue = option.values.find((value) =>
          isOptionValueAvailable(option.name, value, {}, variants)
        );
        if (firstAvailableValue) {
          newInitial[option.name] = firstAvailableValue;
        }
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedOptions(newInitial);
    }
  }, [options, variants]);

  // Check if selecting optionValue for optionName leads to any available variant
  const isOptionAvailable = useCallback(
    (optionName: string, optionValue: string): boolean => {
      return isOptionValueAvailable(
        optionName,
        optionValue,
        selectedOptions,
        variants
      );
    },
    [selectedOptions, variants]
  );

  // Select an option value
  const selectOption = useCallback(
    (optionName: string, value: string) => {
      setSelectedOptions((prev) => ({
        ...prev,
        [optionName]: value,
      }));
    },
    []
  );

  // Resolve the variant that matches all selected options
  const resolvedVariant = useMemo(() => {
    // If no options, return first available variant (default variant)
    if (options.length === 0 && variants.length > 0) {
      return variants.find((v) => v.availableForSale) || variants[0] || null;
    }

    // Match variant based on selected options
    return variants.find((variant) => {
      // Check if variant's selectedOptions match our selectedOptions
      // For variants with no selectedOptions (default variant), this will match empty selectedOptions
      return variant.selectedOptions.every(
        (opt) => selectedOptions[opt.name] === opt.value
      );
    }) || null;
  }, [variants, selectedOptions, options.length]);

  // Get price from resolved variant or fallback to product price range
  const price = useMemo(() => {
    if (resolvedVariant?.price) {
      return resolvedVariant.price.amount;
    }
    return null;
  }, [resolvedVariant]);

  // Get image from resolved variant
  const selectedVariantImage = useMemo(() => {
    return resolvedVariant?.image || null;
  }, [resolvedVariant]);

  return {
    selectedOptions,
    selectOption,
    resolvedVariant,
    isOptionAvailable,
    price,
    selectedVariantImage,
  };
}

/**
 * Helper function to check if an option value is available
 * given a hypothetical selection state
 */
function isOptionValueAvailable(
  optionName: string,
  optionValue: string,
  currentSelection: Record<string, string>,
  variants: ProductVariant[]
): boolean {
  // Create hypothetical selection with this option value
  const hypotheticalSelection = {
    ...currentSelection,
    [optionName]: optionValue,
  };

  // Check if any variant matches this hypothetical selection and is available
  return variants.some(
    (variant) =>
      variant.availableForSale &&
      variant.selectedOptions.every(
        (opt) =>
          !hypotheticalSelection[opt.name] ||
          hypotheticalSelection[opt.name] === opt.value
      )
  );
}
