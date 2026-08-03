import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  asChild?: boolean;
}

export function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  children,
  ...props
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center rounded-full font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2";

  const variantClasses = {
    default: "bg-slate-950 text-white hover:bg-indigo-700",
    outline:
      "border border-slate-300 bg-white text-slate-700 hover:border-indigo-300 hover:text-indigo-700",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
  };

  const sizeClasses = {
    default: "px-5 py-3 text-sm",
    sm: "px-4 py-2 text-sm",
    lg: "px-6 py-3.5 text-base",
  };

  if (asChild) {
    return (
      <span className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}>
        {children}
      </span>
    );
  }

  return (
    <button
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
