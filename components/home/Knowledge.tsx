"use client";

import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";

const items = [
  { id: 1, title: "Articles", desc: "Industry insights and commentary" },
  { id: 2, title: "Industry Reports", desc: "Data-driven reports and analysis" },
  { id: 3, title: "Case Studies", desc: "Real-world deployments and outcomes" },
  { id: 4, title: "Academy Courses", desc: "Training and certification paths" },
];

export function Knowledge() {
  return (
    <section aria-label="Knowledge Center" className="py-16">
      <Container>
        <div className="mb-6 max-w-3xl">
          <h2 className="text-2xl font-bold text-slate-900">Knowledge Center</h2>
          <p className="mt-2 text-slate-600">Guides, case studies and learning for enterprise teams.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {items.map((it) => (
            <Card key={it.id} className="p-4">
              <h3 className="font-semibold text-slate-900">{it.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{it.desc}</p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default Knowledge;
