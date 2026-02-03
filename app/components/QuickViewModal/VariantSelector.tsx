"use client";

import { motion } from "motion/react";
import { useVariantSelection } from "@/app/hooks/useVariantSelection";
import { useReducedMotion } from "@/app/hooks/useReducedMotion";
import type { GetProductByHandleQuery } from "@/lib/shopify/graphql/.generated/storefront.generated";

type VariantSelectorProps = {
  options: GetProductByHandleQuery["product"]["options"];
  variants: GetProductByHandleQuery["product"]["variants"]["nodes"];
};

/**
 * Variant selector component with pill-style option controls
 * Shows availability states and handles selection with animations
 */
export function VariantSelector({
  options,
  variants,
}: VariantSelectorProps) {
  const prefersReducedMotion = useReducedMotion();
  const {
    selectedOptions,
    selectOption,
    isOptionAvailable,
  } = useVariantSelection({ options, variants });

  return (
    <div className="space-y-4">
      {options.map((option) => {
        const selectedValue = selectedOptions[option.name];

        return (
          <div key={option.id || option.name}>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
              {option.name}
            </label>
            <div className="flex flex-wrap gap-2">
              {option.values.map((value) => {
                const isSelected = selectedValue === value;
                const isAvailable = isOptionAvailable(option.name, value);

                return (
                  <motion.button
                    key={value}
                    onClick={() => {
                      if (isAvailable) {
                        selectOption(option.name, value);
                      }
                    }}
                    disabled={!isAvailable}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      isSelected
                        ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                        : isAvailable
                        ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
                        : "bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-600 border border-gray-200 dark:border-gray-800 opacity-50 cursor-not-allowed line-through"
                    }`}
                    whileHover={
                      !prefersReducedMotion && isAvailable && !isSelected
                        ? { scale: 1.05 }
                        : {}
                    }
                    whileTap={
                      !prefersReducedMotion && isAvailable ? { scale: 0.95 } : {}
                    }
                    aria-label={`Select ${option.name} ${value}${!isAvailable ? " (unavailable)" : ""}`}
                    aria-pressed={isSelected}
                    aria-disabled={!isAvailable}
                    role="radio"
                    aria-checked={isSelected}
                  >
                    {value}
                  </motion.button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
