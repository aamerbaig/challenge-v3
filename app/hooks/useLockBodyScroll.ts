import { useEffect } from "react";

/**
 * Hook to lock body scroll when modal is open
 * Adds overflow: hidden to body element and cleans up on unmount
 */
export function useLockBodyScroll(lock: boolean): void {
  useEffect(() => {
    if (!lock) return;

    // Save original overflow value
    const originalStyle = window.getComputedStyle(document.body).overflow;

    // Lock scroll
    document.body.style.overflow = "hidden";

    // Cleanup: restore original overflow
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [lock]);
}
