"use client";

import React, { createContext, useContext, useState } from "react";

type RFQContextValue = {
  openRFQ: (product?: any) => void;
  closeRFQ: () => void;
  product: any | null;
  open: boolean;
};

const RFQContext = createContext<RFQContextValue | undefined>(undefined);

export function RFQProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState<any | null>(null);

  function openRFQ(p?: any) {
    setProduct(p ?? null);
    setOpen(true);
  }
  function closeRFQ() {
    setOpen(false);
    setProduct(null);
  }

  return (
    <RFQContext.Provider value={{ openRFQ, closeRFQ, product, open }}>
      {children}
    </RFQContext.Provider>
  );
}

export function useRFQ() {
  const ctx = useContext(RFQContext);
  if (!ctx) throw new Error("useRFQ must be used inside RFQProvider");
  return ctx;
}
