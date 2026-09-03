"use client";

import { useRFQ } from "./RFQContext";
import dynamic from "next/dynamic";

const RFQModal = dynamic(() => import("./RFQModal").then((m) => m.RFQModal), { ssr: false });

export default function ClientRFQHost() {
  const { open } = useRFQ();
  if (!open) return null;
  return <RFQModal />;
}
