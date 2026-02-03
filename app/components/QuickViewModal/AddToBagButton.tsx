"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useReducedMotion } from "@/app/hooks/useReducedMotion";
import type { GetProductByHandleQuery } from "@/lib/shopify/graphql/.generated/storefront.generated";

type ProductVariant = GetProductByHandleQuery["product"]["variants"]["nodes"][number];

type AddToBagButtonProps = {
  resolvedVariant: ProductVariant | null;
  onClose?: () => void;
};

type ButtonState = "idle" | "loading" | "success";

/**
 * Add to Bag button with three states: idle, loading, and success
 * Simulates async add-to-cart with deterministic delay
 */
export function AddToBagButton({
  resolvedVariant,
  onClose,
}: AddToBagButtonProps) {
  const prefersReducedMotion = useReducedMotion();
  const [state, setState] = useState<ButtonState>("idle");
  const isDisabled = !resolvedVariant || !resolvedVariant.availableForSale;

  const handleClick = async () => {
    if (isDisabled || state !== "idle") return;

    setState("loading");

    // Simulate async add with deterministic delay (800-1200ms)
    const delay = 800 + Math.random() * 400;
    await new Promise((resolve) => setTimeout(resolve, delay));

    setState("success");

    // Reset to idle after 1.5s (or close modal - we'll reset to idle for consistency)
    setTimeout(() => {
      setState("idle");
    }, 1500);
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={isDisabled || state === "loading"}
      className="w-full py-4 px-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
      whileHover={
        !prefersReducedMotion && !isDisabled && state === "idle"
          ? { scale: 1.02 }
          : {}
      }
      whileTap={
        !prefersReducedMotion && !isDisabled && state === "idle"
          ? { scale: 0.98 }
          : {}
      }
      aria-label={
        state === "success"
          ? "Added to bag"
          : state === "loading"
          ? "Adding to bag"
          : "Add to bag"
      }
    >
      <AnimatePresence mode="wait">
        {state === "idle" && (
          <motion.span
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Add to Bag
          </motion.span>
        )}
        {state === "loading" && (
          <motion.span
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-2"
          >
            <motion.svg
              className="w-5 h-5"
              animate={prefersReducedMotion ? {} : { rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear",
              }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </motion.svg>
            Adding...
          </motion.span>
        )}
        {state === "success" && (
          <motion.span
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center justify-center gap-2"
          >
            <motion.svg
              className="w-5 h-5"
              initial={prefersReducedMotion ? { scale: 1 } : { scale: 0 }}
              animate={{ scale: 1 }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 500, damping: 30 }
              }
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path d="M20 6L9 17l-5-5" />
            </motion.svg>
            Added
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
