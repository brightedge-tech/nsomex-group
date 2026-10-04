"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

type ProductLink = { id: string; name: string; slug: string } | null;
type SupplierLink = { id: string; company_name: string; slug: string } | null;
type Inquiry = {
  id: string;
  subject: string;
  message: string;
  quantity: number;
  status: "pending" | "viewed" | "responded" | "closed";
  response_text: string | null;
  created_at: string;
  product: ProductLink;
  supplier: SupplierLink;
};

const statusStyles: Record<Inquiry["status"], string> = {
  pending: "bg-amber-50 text-amber-800",
  viewed: "bg-sky-50 text-sky-800",
  responded: "bg-emerald-50 text-emerald-800",
  closed: "bg-slate-100 text-slate-700",
};

export function InquiryList({ audience }: { audience: "buyer" | "supplier" }) {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [responseDrafts, setResponseDrafts] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/product-inquiries?page=${page}`, { signal: controller.signal })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error ?? "Inquiries could not be loaded.");
        setInquiries(result.inquiries ?? []);
        setTotalPages(result.totalPages ?? 0);
        setError("");
      })
      .catch((loadError: unknown) => {
        if (loadError instanceof DOMException && loadError.name === "AbortError") return;
        setError(loadError instanceof Error ? loadError.message : "Inquiries could not be loaded.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [page, refresh]);

  async function updateInquiry(inquiry: Inquiry, status: "viewed" | "responded" | "closed") {
    setSavingId(inquiry.id);
    setError("");
    try {
      const response = await fetch("/api/product-inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: inquiry.id,
          status,
          ...(audience === "supplier" && status === "responded" ? { response: responseDrafts[inquiry.id] ?? "" } : {}),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Inquiry could not be updated.");
      setLoading(true);
      setRefresh((current) => current + 1);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Inquiry could not be updated.");
    } finally {
      setSavingId("");
    }
  }

  if (loading) return <p role="status" className="py-6 text-sm text-slate-500">Loading inquiries...</p>;
  if (error && inquiries.length === 0) return <p role="alert" className="py-6 text-sm text-rose-700">{error}</p>;
  if (inquiries.length === 0) {
    return <div className="py-8 text-center">
      <p className="font-medium text-slate-900">No {audience === "buyer" ? "product inquiries" : "incoming inquiries"} yet.</p>
      <p className="mt-2 text-sm text-slate-500">{audience === "buyer" ? "Contact a supplier from a product page to start an inquiry." : "New buyer inquiries for your products will appear here."}</p>
    </div>;
  }

  return <div className="space-y-4">
    {error && <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
    {inquiries.map((inquiry) => (
      <Card key={inquiry.id} className="p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold text-slate-900">{inquiry.subject}</h3>
            <p className="mt-1 text-sm text-slate-500">{new Date(inquiry.created_at).toLocaleDateString()}</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[inquiry.status]}`}>{inquiry.status}</span>
        </div>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">{inquiry.message}</p>
        <p className="mt-2 text-sm text-slate-500">Requested quantity: {Number(inquiry.quantity).toLocaleString()}</p>
        {inquiry.product && <Link href={`/products/${inquiry.product.slug}`} className="mt-3 inline-flex text-sm font-semibold text-indigo-600 hover:underline">{inquiry.product.name}</Link>}
        {audience === "buyer" && inquiry.supplier && <Link href={`/supplier/${inquiry.supplier.slug}`} className="mt-2 block text-sm text-slate-600 hover:text-indigo-600">{inquiry.supplier.company_name}</Link>}
        {inquiry.response_text && <div className="mt-4 rounded-lg bg-emerald-50 p-3"><p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">Supplier response</p><p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{inquiry.response_text}</p></div>}
        {audience === "supplier" && inquiry.status !== "closed" && <div className="mt-4 space-y-3">
          {inquiry.status !== "responded" && <label className="block text-sm font-medium text-slate-700">Reply to buyer
            <textarea value={responseDrafts[inquiry.id] ?? ""} onChange={(event) => setResponseDrafts((drafts) => ({ ...drafts, [inquiry.id]: event.target.value }))} maxLength={4000} rows={3} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" />
          </label>}
          <div className="flex flex-wrap gap-2">
            {inquiry.status === "pending" && <button disabled={savingId === inquiry.id} onClick={() => void updateInquiry(inquiry, "viewed")} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold disabled:opacity-50">Mark viewed</button>}
            {inquiry.status !== "responded" && <button disabled={savingId === inquiry.id || !(responseDrafts[inquiry.id] ?? "").trim()} onClick={() => void updateInquiry(inquiry, "responded")} className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Send response</button>}
            <button disabled={savingId === inquiry.id} onClick={() => void updateInquiry(inquiry, "closed")} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold disabled:opacity-50">Close</button>
          </div>
        </div>}
        {audience === "buyer" && inquiry.status !== "closed" && <button disabled={savingId === inquiry.id} onClick={() => void updateInquiry(inquiry, "closed")} className="mt-4 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold disabled:opacity-50">Cancel inquiry</button>}
      </Card>
    ))}
    <div className="flex items-center justify-between pt-2">
      <button disabled={page <= 1} onClick={() => { setLoading(true); setPage((current) => current - 1); }} className="rounded-full border border-slate-300 px-4 py-2 text-sm disabled:opacity-50">Previous</button>
      <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
      <button disabled={page >= totalPages} onClick={() => { setLoading(true); setPage((current) => current + 1); }} className="rounded-full border border-slate-300 px-4 py-2 text-sm disabled:opacity-50">Next</button>
    </div>
  </div>;
}
