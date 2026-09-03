"use client";

import { useRef, useState } from "react";
import { imageSearchService } from "@/lib/services/imageSearchService";
import { Card } from "@/components/ui/card";

export function ImageSearchModal() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const captureRef = useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [results, setResults] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);

  function onChoose() {
    inputRef.current?.click();
  }

  function onTakePhoto() {
    captureRef.current?.click();
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
    setOpen(true);
  }

  function onCapture(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
    setOpen(true);
  }

  async function onSearch() {
    setLoading(true);
    const res = await imageSearchService(file);
    setResults(res.results || []);
    setLoading(false);
  }

  return (
    <div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
      <input ref={captureRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={onCapture} />
      <div className="flex items-center gap-2">
        <button aria-label="Image search" onClick={onChoose} className="ml-2 mr-2 hidden h-9 w-9 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 md:inline-flex">
          📁
        </button>
        <button aria-label="Take photo" onClick={onTakePhoto} className="ml-2 mr-2 hidden h-9 w-9 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 md:inline-flex">
          📷
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
          <Card className="max-w-2xl">
            <div className="flex items-start gap-4">
              <div className="w-1/3">
                {preview ? <img src={preview} alt="preview" className="h-40 w-full object-cover" /> : <div className="h-40 w-full rounded bg-slate-100" />}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">Search by image</h3>
                <p className="mt-1 text-sm text-slate-600">Upload a photo of the product or take a photo to find similar items in the marketplace.</p>

                <div className="mt-4 flex gap-2">
                  <button onClick={onSearch} disabled={loading} className="rounded-full bg-indigo-600 px-4 py-2 text-white">
                    {loading ? "Searching..." : "Search by image"}
                  </button>
                  <button onClick={() => setOpen(false)} className="rounded-full border px-4 py-2">Close</button>
                </div>

                <div className="mt-4">
                  {results && (
                    <div>
                      <h4 className="text-sm font-semibold">Results</h4>
                      <ul className="mt-2 list-inside list-disc text-sm text-slate-700">
                        {results.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default ImageSearchModal;
