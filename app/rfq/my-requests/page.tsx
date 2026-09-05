import Link from "next/link";
import { rfqs } from "@/lib/data/platform";
import { PlatformShell, Status } from "@/components/platform/PlatformUI";
import { Card } from "@/components/ui/card";
export default function MyRequestsPage() { return <PlatformShell eyebrow="Buyer workspace" title="My RFQs" description="Track requests and supplier responses."><Card className="mt-8"><div className="divide-y divide-slate-200">{rfqs.map((r) => <Link href={`/rfq/${r.id}`} key={r.id} className="flex flex-wrap justify-between gap-4 py-5"><div><p className="font-semibold">{r.title}</p><p className="mt-1 text-sm text-slate-500">Posted {r.date} · {r.quantity} · {r.destination}</p></div><div className="text-right"><Status>{r.status}</Status><p className="mt-2 text-xs text-slate-500">{r.responses} responses · Due {r.deadline}</p></div></Link>)}</div></Card></PlatformShell>; }
