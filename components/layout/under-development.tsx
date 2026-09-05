import Link from "next/link";
import { Container } from "@/components/ui/container";

export function UnderDevelopment({ title, description }: { title: string; description?: string }) {
  return (
    <section className="py-16">
      <Container>
        <div className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">NSOMEX</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">{title}</h1>
          <p className="mt-3 text-slate-600">
            {description ?? "This area is under development. The route is ready for the next implementation step."}
          </p>
          <Link href="/" className="mt-6 inline-flex rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white">
            Return home
          </Link>
        </div>
      </Container>
    </section>
  );
}
