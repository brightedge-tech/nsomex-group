"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ContactSection } from "@/components/features/home/contact-section";
import { HeroSection } from "@/components/features/home/hero-section";
import { PillarsSection } from "@/components/features/home/pillars-section";
import { StructureSection } from "@/components/features/home/structure-section";

export default function Home() {
  return (
    <div className="bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.16),_transparent_42%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_100%)] text-slate-900">
      <Container className="flex flex-col py-16 lg:py-24">
        <motion.header
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-wrap items-center justify-between gap-4 rounded-full border border-slate-200/80 bg-white/80 px-5 py-3 shadow-sm backdrop-blur"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-indigo-600">
              NSOMEX Orbit
            </p>
            <p className="text-sm text-slate-600">
              Engineering foundation for a dependable digital platform
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <a href="#pillars">Explore the pillars</a>
          </Button>
        </motion.header>

        <HeroSection />
        <PillarsSection />
        <StructureSection />
        <ContactSection />
      </Container>
    </div>
  );
}
