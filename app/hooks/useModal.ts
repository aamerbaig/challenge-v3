"use client";

import { useState, useCallback, useRef, useEffect } from "react";

type UseModalReturn = {
  isOpen: boolean;
  selectedProductHandle: string | null;
  openModal: (handle: string) => void;
  closeModal: () => void;
  triggerRef: React.RefObject<HTMLElement | null>;
};

/**
 * Hook for managing modal state and focus management
 * 
 * Features:
 * - Tracks open/close state
 * - Manages selected product handle
 * - Saves/restores focus to trigger element
 * - Handles Escape key to close
 */
export function useModal(): UseModalReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProductHandle, setSelectedProductHandle] =
    useState<string | null>(null);
  const triggerRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const openModal = useCallback((handle: string) => {
    // Save current focus before opening
    previousFocusRef.current =
      (document.activeElement as HTMLElement) || null;
    setSelectedProductHandle(handle);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setSelectedProductHandle(null);

    // Restore focus to trigger element or previous focus
    // Use setTimeout to ensure modal is fully closed first
    setTimeout(() => {
      const elementToFocus =
        triggerRef.current || previousFocusRef.current;
      if (elementToFocus) {
        elementToFocus.focus();
      }
      previousFocusRef.current = null;
    }, 0);
  }, []);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, closeModal]);

  return {
    isOpen,
    selectedProductHandle,
    openModal,
    closeModal,
    triggerRef,
  };
}
