"use client";

import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";

const projects = [
  { id: 1, title: "Solar Infrastructure Project", desc: "Large scale solar deployment in East Africa" },
  { id: 2, title: "Water Access Project", desc: "Smart water systems for rural communities" },
  { id: 3, title: "Industrial Automation Project", desc: "Factory automation and predictive maintenance" },
  { id: 4, title: "Digital Transformation Project", desc: "Enterprise ERP modernization" },
];

export function Projects() {
  return (
    <section aria-label="Featured projects" className="py-16">
      <Container>
        <div className="mb-6 max-w-3xl">
          <h2 className="text-2xl font-bold text-slate-900">Featured Projects</h2>
          <p className="mt-2 text-slate-600">Selected initiatives demonstrating NSOMEX Orbit capabilities.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {projects.map((p) => (
            <Card key={p.id} className="p-4">
              <div className="h-28 w-full rounded-md bg-slate-100" />
              <h3 className="mt-3 font-semibold text-slate-900">{p.title}</h3>
              <p className="text-sm text-slate-600">{p.desc}</p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default Projects;
