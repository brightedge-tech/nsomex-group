import { FeatureCard } from "../components/feature-card";

const pillars = [
  {
    title: "Secure by design",
    description:
      "A foundation for trusted operations, thoughtful access controls, and dependable delivery workflows.",
  },
  {
    title: "Built to scale",
    description:
      "A clear app shell that can grow from a starter experience into a richer platform over time.",
  },
  {
    title: "Engineered for clarity",
    description:
      "Readable structure, modern tooling, and documentation that make the project easy to extend.",
  },
];

const highlights = [
  "Modern Next.js App Router foundation",
  "Tailwind styling for a fast, polished interface",
  "Accessible structure ready for product expansion",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.16),_transparent_42%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_100%)] text-slate-900">
      <main className="mx-auto flex max-w-6xl flex-col px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-full border border-slate-200/80 bg-white/80 px-5 py-3 shadow-sm backdrop-blur">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-indigo-600">
              NSOMEX Orbit
            </p>
            <p className="text-sm text-slate-600">
              Engineering foundation for a dependable digital platform
            </p>
          </div>
          <a
            href="#pillars"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700"
          >
            Explore the pillars
          </a>
        </header>

        <section className="mt-16 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-indigo-600">
              Product starter
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              A confident starting point for the NSOMEX Orbit experience.
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              This app establishes a modern, accessible shell for the platform and reflects the engineering discipline needed for secure growth, reliable delivery, and future expansion.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#pillars"
                className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                View platform pillars
              </a>
              <a
                href="https://nextjs.org/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700"
              >
                Read Next.js docs
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-950 p-8 text-slate-100 shadow-2xl shadow-indigo-950/20">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-300">
              Current focus
            </p>
            <ul className="mt-6 space-y-4">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-6 text-slate-300">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-indigo-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="pillars" className="mt-16 grid gap-6 md:grid-cols-3">
          {pillars.map((pillar) => (
            <FeatureCard
              key={pillar.title}
              title={pillar.title}
              description={pillar.description}
            />
          ))}
        </section>
      </main>
    </div>
  );
}
