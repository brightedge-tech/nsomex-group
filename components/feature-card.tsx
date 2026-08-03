interface FeatureCardProps {
  title: string;
  description: string;
}

export function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm backdrop-blur">
      <div className="flex items-center gap-3">
        <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
        <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
      </div>
      <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
    </article>
  );
}
