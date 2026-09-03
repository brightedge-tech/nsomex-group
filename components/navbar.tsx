"use client";

import Link from "next/link";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import dynamic from "next/dynamic";

const ImageSearchWrapper = dynamic(() => import("@/components/image/ImageSearchModal").then((m) => m.ImageSearchModal), { ssr: false });

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur">
      <Container className="flex w-full items-center gap-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">NO</div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">NSOMEX</p>
            <p className="text-xs text-slate-500">Marketplace</p>
          </div>
        </Link>

        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex w-full items-center">
            <input
              aria-label="Search marketplace"
              placeholder="Search products, equipment, suppliers or factories"
              className="w-full rounded-full border border-slate-200 bg-white/80 px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <div className="ml-2 flex items-center gap-2">
              {/* Image search modal button */}
              <div className="hidden md:inline-flex">
                {/* client component lazy loaded */}
                <ImageSearchWrapper />
              </div>
              <button className="hidden h-9 w-9 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 md:flex">🔊</button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm">
            <Link href="/signin">Sign In</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/signup">Sign Up</Link>
          </Button>
          <Link href="/rfq" className="hidden rounded-full bg-indigo-600 px-3 py-2 text-sm font-medium text-white md:inline-block">
            RFQ
          </Link>
        </div>
      </Container>
    </header>
  );
}
