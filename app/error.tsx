"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/container";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) { useEffect(() => { console.error(error); }, [error]); return <main className="py-20"><Container><div className="mx-auto max-w-xl rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center"><h1 className="text-3xl font-bold text-slate-900">We hit an unexpected error</h1><p className="mt-3 text-sm text-rose-700">Please try again or return to the marketplace.</p><button onClick={reset} className="mt-6 rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white">Try again</button></div></Container></main>; }
