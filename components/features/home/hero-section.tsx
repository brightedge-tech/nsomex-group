"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const highlights = [
  "Modern Next.js App Router foundation",
  "Tailwind styling for a fast, polished interface",
  "Accessible structure ready for product expansion",
];

export function HeroSection() {
  return (
    <section className="mt-16 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <motion.div
        initial={{ opacity: 0, x: -18 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="max-w-2xl"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-indigo-600">Product starter</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          A confident starting point for the NSOMEX Orbit experience.
        </h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">
          This app establishes a modern, accessible shell for the platform and reflects the engineering discipline needed for secure growth, reliable delivery, and future expansion.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <a href="#pillars">View platform pillars</a>
          </Button>
          <Button asChild variant="outline">
            <a href="https://nextjs.org/docs" target="_blank" rel="noopener noreferrer">
              Read Next.js docs
            </a>
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 18 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card className="border-slate-200 bg-slate-950 p-8 text-slate-100 shadow-2xl shadow-indigo-950/20">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-300">Current focus</p>
          <ul className="mt-6 space-y-4">
            {highlights.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm leading-6 text-slate-300">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-indigo-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Card>
      </motion.div>
    </section>
  );
}
