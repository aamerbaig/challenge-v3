"use client";

import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { useLockBodyScroll } from "@/app/hooks/useLockBodyScroll";
import { useFocusTrap } from "@/app/hooks/useFocusTrap";
import { useReducedMotion } from "@/app/hooks/useReducedMotion";
import { ModalContent } from "./ModalContent";

type QuickViewModalProps = {
  isOpen: boolean;
  productHandle: string | null;
  onClose: () => void;
};

/**
 * Quick View Modal component with animations and accessibility
 * 
 * Features:
 * - Portal rendering to body
 * - Backdrop fade animation
 * - Modal scale + fade entrance/exit
 * - Click outside to close
 * - ARIA attributes for accessibility
 */
export function QuickViewModal({
  isOpen,
  productHandle,
  onClose,
}: QuickViewModalProps) {
  useLockBodyScroll(isOpen);
  const focusTrapRef = useFocusTrap(isOpen);
  const prefersReducedMotion = useReducedMotion();

  // Handle backdrop click (but not modal content clicks)
  const handleBackdropClick = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // Don't render if no product handle
  if (!productHandle) return null;

  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="quick-view-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleBackdropClick}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
          />

          {/* Modal Content */}
          <motion.div
            ref={focusTrapRef}
            className="relative bg-white dark:bg-gray-900 rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.95 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.2,
              ease: [0.16, 1, 0.3, 1], // Custom easing for smooth animation
            }}
            onClick={(e) => e.stopPropagation()} // Prevent backdrop click
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:ring-offset-2"
              aria-label="Close quick view modal"
            >
              <svg
                className="w-6 h-6 text-gray-900 dark:text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Modal Content */}
            <ModalContent productHandle={productHandle} onClose={onClose} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
