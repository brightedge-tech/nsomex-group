"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type ToastKind = "success" | "error" | "warning" | "info";
type Toast = { id: number; kind: ToastKind; message: string };
const ToastContext = createContext<{ notify: (message: string, kind?: ToastKind) => void } | undefined>(undefined);
export function ToastProvider({ children }: { children: React.ReactNode }) { const [toasts, setToasts] = useState<Toast[]>([]); const notify = useCallback((message: string, kind: ToastKind = "info") => { const id = Date.now(); setToasts((current) => [...current, { id, message, kind }]); window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 4000); }, []); const value = useMemo(() => ({ notify }), [notify]); return <ToastContext.Provider value={value}>{children}<div aria-live="polite" className="fixed bottom-4 right-4 z-50 grid gap-2">{toasts.map((toast) => <div key={toast.id} className={`rounded-xl px-4 py-3 text-sm font-medium shadow-lg ${toast.kind === "error" ? "bg-rose-600 text-white" : toast.kind === "success" ? "bg-emerald-600 text-white" : toast.kind === "warning" ? "bg-amber-500 text-white" : "bg-slate-900 text-white"}`}>{toast.message}</div>)}</div></ToastContext.Provider>; }
export function useToast() { const context = useContext(ToastContext); if (!context) throw new Error("useToast must be used within ToastProvider"); return context; }
