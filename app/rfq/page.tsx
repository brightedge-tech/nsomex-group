"use client";

import { Container } from "@/components/ui/container";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function RFQPage() {
  const [rfqs, setRfqs] = useState<any[]>([]);

  useEffect(() => {
    const existing = JSON.parse(localStorage.getItem("nsomex_rfqs") || "[]");
    setRfqs(existing);
  }, []);

  return (
    <div className="py-10">
      <Container>
        <h1 className="text-2xl font-bold">My RFQs</h1>
        <p className="mt-2 text-slate-600">List of demo RFQs saved in your browser.</p>
        <div className="mt-5 flex flex-wrap gap-3"><Link href="/rfq/create" className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">Post an RFQ</Link><Link href="/rfq/my-requests" className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">View request statuses</Link></div>

        <div className="mt-6 grid grid-cols-1 gap-4">
          {rfqs.length === 0 && <div className="text-sm text-slate-500">No RFQs submitted yet.</div>}
          {rfqs.map((r) => (
            <div key={r.id} className="rounded-md border border-slate-200 p-4">
              <div className="font-semibold">{r.product?.name ?? "Custom RFQ"}</div>
              <div className="text-sm text-slate-600">Quantity: {r.quantity}</div>
              <div className="text-sm text-slate-600">Destination: {r.destination}</div>
              {r.attachments && r.attachments.length > 0 && (
                <div className="mt-3">
                  <div className="text-sm font-semibold">Attachments</div>
                  <div className="mt-2 flex flex-col gap-2">
                    {r.attachments.map((a: any, i: number) => (
                      <a key={i} href={a.dataUrl} download={a.name} className="text-sm text-indigo-600">Download {a.name}</a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
