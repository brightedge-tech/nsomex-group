"use client";

import { useState } from "react";
import { useRFQ } from "./RFQContext";
import { Card } from "@/components/ui/card";

export function RFQModal() {
  const { closeRFQ, product } = useRFQ();
  const [quantity, setQuantity] = useState(1);
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<Array<{ name: string; dataUrl: string }>>([]);
  const [errors, setErrors] = useState<string[]>([]);

  function submit() {
    const errs: string[] = [];
    if (!destination) errs.push("Destination is required");
    if (!date) errs.push("Required date is required");
    if (quantity <= 0) errs.push("Quantity must be greater than zero");
    setErrors(errs);
    if (errs.length) return;

    const rfq = {
      id: `rfq-${Date.now()}`,
      product: product ?? null,
      quantity,
      destination,
      date,
      message,
      attachments,
    };
    const existing = JSON.parse(localStorage.getItem("nsomex_rfqs") || "[]");
    existing.unshift(rfq);
    localStorage.setItem("nsomex_rfqs", JSON.stringify(existing));
    closeRFQ();
    alert("RFQ submitted (demo)");
  }

  function onAttach(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || "");
      setAttachments((s) => [...s, { name: f.name, dataUrl }]);
    };
    reader.readAsDataURL(f);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
      <Card className="max-w-2xl">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold">Request a Quote</h3>
          <button onClick={closeRFQ} className="text-sm text-slate-500">Close</button>
        </div>

        <div className="mt-4 grid gap-3">
          {product && (
            <div>
              <div className="font-semibold">Product</div>
              <div className="text-sm text-slate-700">{product.name}</div>
            </div>
          )}

          <label className="text-sm">Quantity</label>
          <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-full rounded border px-3 py-2" />

          <label className="text-sm">Destination</label>
          <input value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full rounded border px-3 py-2" />

          <label className="text-sm">Required date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded border px-3 py-2" />

          <label className="text-sm">Message / requirements</label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="w-full rounded border px-3 py-2" />

          <label className="text-sm">Attachments</label>
          <input type="file" onChange={onAttach} className="w-full" />
          {attachments.length > 0 && (
            <div className="mt-2 space-y-2">
              {attachments.map((a, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded bg-slate-100">
                    <img src={a.dataUrl} alt={a.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="text-sm">{a.name}</div>
                </div>
              ))}
            </div>
          )}

          {errors.length > 0 && (
            <div className="mt-2 rounded bg-rose-50 p-2 text-sm text-rose-700">
              {errors.map((e, i) => (
                <div key={i}>{e}</div>
              ))}
            </div>
          )}

          <div className="mt-2 flex gap-2">
            <button onClick={submit} className="rounded-full bg-indigo-600 px-4 py-2 text-white">Submit RFQ</button>
            <button onClick={closeRFQ} className="rounded-full border px-4 py-2">Cancel</button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default RFQModal;
