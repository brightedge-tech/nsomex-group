"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";

export function OrbitAI() {
  return (
    <section id="orbit-ai" aria-label="Orbit AI" className="py-16">
      <Container>
        <div className="mb-6 max-w-3xl">
          <h2 className="text-2xl font-bold text-slate-900">Orbit AI</h2>
          <p className="mt-2 text-slate-600">AI assistant tailored for enterprise operations and infrastructure.</p>
        </div>

        <motion.div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="p-6">
            <div className="mb-3 rounded-md bg-slate-50 p-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-indigo-600/10 text-indigo-600">🤖</div>
                <div>
                  <p className="font-semibold text-slate-900">Ask Orbit AI</p>
                  <p className="text-sm text-slate-600">Get quick answers about projects, suppliers, and equipment.</p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="rounded-md border border-slate-100 bg-white p-3 shadow-sm">
                  <div className="text-sm text-slate-700">Project status for Solar Infrastructure Project - last update 3 days ago</div>
                </div>
                <div className="rounded-md border border-slate-100 bg-white p-3 shadow-sm">
                  <div className="text-sm text-slate-700">List available renewable energy suppliers in Ghana</div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex h-full flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Conversation Preview</h3>
                <p className="mt-2 text-sm text-slate-600">Example interactions with Orbit AI for operations and procurement workflows.</p>

                <div className="mt-4 space-y-3">
                  <div className="rounded-md bg-gradient-to-r from-white to-slate-50 p-3">
                    <div className="text-sm text-slate-800">User: Which equipment needs maintenance this month?</div>
                    <div className="mt-1 text-sm text-slate-600">Orbit AI: The backup generators at Site B require filter replacements on 2026-09-10.</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-sm text-slate-500">Note: This is a UI mockup only — AI connectivity will be added later.</div>
            </div>
          </Card>
        </motion.div>
      </Container>
    </section>
  );
}

export default OrbitAI;
