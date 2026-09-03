import Link from "next/link";
import { Container } from "@/components/ui/container";

const services = [
  "Health",
  "Transport",
  "Energy",
  "Construction",
  "Technology",
  "Industrial",
  "Water",
  "Agriculture",
  "Mining",
  "Education",
  "Other Services",
];

export function ServiceMenu() {
  return (
    <div className="border-b border-slate-100 bg-white/60">
      <Container className="flex w-full gap-4 overflow-auto py-3 text-sm">
        {services.map((s) => (
          <Link
            key={s}
            href={`/services/${s.toLowerCase().replace(/\s+/g, "-")}`}
            className="whitespace-nowrap rounded-full px-3 py-1 text-slate-700 hover:bg-slate-100"
          >
            {s}
          </Link>
        ))}
      </Container>
    </div>
  );
}

export default ServiceMenu;
