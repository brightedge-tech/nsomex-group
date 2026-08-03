import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

const navItems = [
  { label: "Pillars", href: "#pillars" },
  { label: "Platform", href: "#platform" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 backdrop-blur">
      <Container className="flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">
            NO
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">
              NSOMEX
            </p>
            <p className="text-xs text-slate-500">Orbit platform</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition hover:text-indigo-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Button asChild size="sm" className="hidden md:inline-flex">
          <a href="#contact">Get started</a>
        </Button>
      </Container>
    </header>
  );
}
