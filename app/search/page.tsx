import { Suspense } from "react";
import { SearchResults } from "@/components/search/SearchResults";

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="py-10 text-center text-slate-500">Loading search results...</div>}>
      <SearchResults />
    </Suspense>
  );
}
