import { Container } from "@/components/ui/container";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/70">
      <Container className="flex flex-col gap-4 py-8 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
        <p>© 2026 NSOMEX Orbit. Designed for secure, scalable product delivery.</p>
        <div className="flex gap-4">
          <a href="#pillars" className="transition hover:text-indigo-700">
            Pillars
          </a>
          <a href="#contact" className="transition hover:text-indigo-700">
            Contact
          </a>
        </div>
      </Container>
    </footer>
  );
}
