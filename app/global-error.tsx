"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <html lang="en"><body className="bg-slate-50 text-slate-900"><main className="flex min-h-screen items-center justify-center p-6"><section className="max-w-lg rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-sm"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-600">NSOMEX error</p><h1 className="mt-3 text-3xl font-bold">Something went wrong</h1><p className="mt-3 text-slate-600">Please try again or return to the marketplace.</p><button onClick={reset} className="mt-6 rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white">Try again</button></section></main></body></html>;
}
