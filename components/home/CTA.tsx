"use client";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section aria-label="Call to action" className="py-16">
      <Container className="flex w-full flex-col items-center gap-6 text-center">
        <h2 className="text-2xl font-bold text-slate-900">Build the future with NSOMEX Orbit</h2>
        <p className="max-w-2xl text-slate-600">Partner with us to modernize infrastructure, deliver AI-enabled operations, and scale securely across regions.</p>
        <div className="flex gap-3">
          <Button asChild size="lg">
            <a href="#contact">Contact NSOMEX</a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="#solutions">Explore Platform</a>
          </Button>
        </div>
      </Container>
    </section>
  );
}

export default CTA;
