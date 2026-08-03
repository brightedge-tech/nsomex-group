import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <article
      className={cn(
        "rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-sm backdrop-blur",
        className,
      )}
      {...props}
    >
      {children}
    </article>
  );
}
