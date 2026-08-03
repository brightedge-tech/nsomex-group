import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function Section({ className, children, title, description, ...props }: SectionProps) {
  return (
    <section className={cn("w-full", className)} {...props}>
      {(title || description) && (
        <div className="mb-8 max-w-2xl">
          {title ? <h2 className="text-2xl font-semibold text-slate-950">{title}</h2> : null}
          {description ? (
            <p className="mt-3 text-base leading-7 text-slate-600">{description}</p>
          ) : null}
        </div>
      )}
      {children}
    </section>
  );
}
