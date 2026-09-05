import Link from "next/link";
import { Container } from "@/components/ui/container";

export default function UnauthorizedPage() {
  return (
    <main className="py-16">
      <Container>
        <div className="mx-auto max-w-xl rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center shadow-sm">
          <div className="text-4xl">⛔</div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-rose-700">Access denied</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">You don’t have permission to access this page.</h1>
          <p className="mt-3 text-slate-600">This is a mock frontend authorization state and does not enforce security yet.</p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/marketplace" className="rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white">Return to Marketplace</Link>
            <Link href="/account" className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700">Go to dashboard</Link>
          </div>
        </div>
      </Container>
    </main>
  );
}
