import Link from "next/link";
import { Container } from "@/components/ui/container";

export default function SuspendedAccountPage() {
  return (
    <main className="py-16">
      <Container>
        <div className="mx-auto max-w-xl rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center shadow-sm">
          <div className="text-4xl">⚠️</div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">Account status</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">Your account is suspended</h1>
          <p className="mt-3 text-slate-600">This is a mock frontend state for account review. Contact support for further assistance.</p>

          <div className="mt-8 rounded-2xl border border-amber-200 bg-white p-4 text-left text-sm text-slate-700">
            <p><span className="font-semibold">Reason:</span> Placeholder review pending</p>
            <p className="mt-2"><span className="font-semibold">Support:</span> support@nsomex.example</p>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/help" className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700">Contact support</Link>
            <Link href="/login" className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white">Logout</Link>
          </div>
        </div>
      </Container>
    </main>
  );
}
