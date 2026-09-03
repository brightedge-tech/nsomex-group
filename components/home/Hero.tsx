"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function Hero() {
  return (
    <section aria-label="NSOMEX Orbit hero" className="relative min-h-screen py-24">
      <Container className="relative z-10 flex w-full max-w-7xl flex-col items-start gap-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-full border border-slate-200/60 bg-white/70 px-4 py-2 shadow-sm backdrop-blur"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">NSOMEX Orbit</p>
          <p className="text-sm text-slate-600">Enterprise digital infrastructure for Africa</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.12, duration: 0.6 }}
          className="max-w-3xl"
        >
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            NSOMEX Orbit — Engineering Africa&#39;s digital backbone
          </h1>
          <p className="mt-4 text-lg text-slate-700">
            A cloud-native, secure, and AI-enabled platform connecting industries, infrastructure, and enterprises across the continent.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <a href="#solutions">Explore Solutions</a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#orbit-ai">Talk to Orbit AI</a>
            </Button>
          </div>
        </motion.div>

        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="pointer-events-none absolute right-8 top-24 hidden w-2/5 max-w-xl md:block"
        >
          <div className="relative h-72 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-500 to-sky-400/80 shadow-xl">
            <svg className="absolute -right-10 -top-10 opacity-30" width="260" height="260" viewBox="0 0 260 260" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="130" cy="130" r="130" fill="white" />
            </svg>
          </div>
        </motion.div>
      </Container>

      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/30 via-transparent to-white/90" />
    </section>
  );
}

export default Hero;
