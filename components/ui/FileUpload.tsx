"use client";

import { useState } from "react";

export function FileUpload({ accept, label = "Choose a file", onChange }: { accept?: string; label?: string; onChange?: (file: File | null) => void }) { const [name, setName] = useState(""); return <label className="block cursor-pointer rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600 hover:border-indigo-400"><span className="font-semibold text-slate-900">{name || label}</span><input type="file" accept={accept} className="sr-only" onChange={(event) => { const file = event.target.files?.[0] ?? null; setName(file?.name || ""); onChange?.(file); }} /></label>; }
