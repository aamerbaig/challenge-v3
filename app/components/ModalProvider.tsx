"use client";

import { useModal } from "@/app/hooks/useModal";
import { QuickViewModal } from "./QuickViewModal";
import { createContext, useContext, type ReactNode } from "react";

type ModalContextType = ReturnType<typeof useModal>;

const ModalContext = createContext<ModalContextType | null>(null);

export function useModalContext() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModalContext must be used within ModalProvider");
  }
  return context;
}

type ModalProviderProps = {
  children: ReactNode;
};

/**
 * Provider component that manages modal state and provides it to children
 */
export function ModalProvider({ children }: ModalProviderProps) {
  const modal = useModal();

  return (
    <ModalContext.Provider value={modal}>
      {children}
      <QuickViewModal
        isOpen={modal.isOpen}
        productHandle={modal.selectedProductHandle}
        onClose={modal.closeModal}
      />
    </ModalContext.Provider>
  );
}
