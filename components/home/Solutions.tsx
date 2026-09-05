"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";

const industries = [
  { key: "technologies", title: "NSOMEX Technologies", desc: "Digital platforms and enterprise software" },
  { key: "industrial", title: "NSOMEX Industrial", desc: "Automation and industrial control systems" },
  { key: "trade", title: "NSOMEX Trade & Logistics", desc: "Supply chain and logistics solutions" },
  { key: "energy", title: "NSOMEX Energy", desc: "Renewables and grid infrastructure" },
  { key: "water", title: "NSOMEX Water", desc: "Smart water management" },
  { key: "construction", title: "NSOMEX Construction", desc: "Infrastructure and construction tech" },
  { key: "mining", title: "NSOMEX Mining", desc: "Fleet management and site automation" },
  { key: "agriculture", title: "NSOMEX Agriculture", desc: "Precision agriculture solutions" },
  { key: "healthcare", title: "NSOMEX Healthcare", desc: "Connected care and health IT" },
  { key: "academy", title: "NSOMEX Academy", desc: "Training and certification" },
  { key: "capital", title: "NSOMEX Capital", desc: "Financing and investment products" },
];

function IndustryCard({ title, desc }: { title: string; desc: string }) {
  return (
    <Card className="group flex h-full flex-col gap-4 p-6 hover:scale-102 transform transition">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-lg bg-indigo-50/60 p-2 text-indigo-600">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="opacity-90">
            <path d="M12 2v20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 7h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm text-slate-600">{desc}</p>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between">
        <Link className="text-sm font-medium text-indigo-600 transition group-hover:underline" href="/categories">Learn more</Link>
        <div className="text-xs text-slate-400">&gt;</div>
      </div>
    </Card>
  );
}

export function Solutions() {
  return (
    <section id="solutions" aria-label="Industry solutions" className="py-16">
      <Container>
        <div className="mb-8 max-w-3xl">
          <h2 className="text-2xl font-bold text-slate-900">Industry Solutions</h2>
          <p className="mt-2 text-slate-600">Tailored platforms and services across core industries.</p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          {industries.map((it) => (
            <IndustryCard key={it.key} title={it.title} desc={it.desc} />
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

export default Solutions;
