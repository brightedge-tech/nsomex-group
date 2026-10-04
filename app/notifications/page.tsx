"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { PlatformShell } from "@/components/platform/PlatformUI";
import { config } from "@/lib/config";
import { notifications as mockNotifications } from "@/lib/data/platform";

type NotificationItem = {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
};

export default function NotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>(() => config.supabaseConfigured
    ? []
    : mockNotifications.map((item) => ({
        id: item.id,
        title: item.title,
        body: item.body,
        read: !item.unread,
        createdAt: item.time,
      })));
  const [loading, setLoading] = useState(config.supabaseConfigured);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    if (!config.supabaseConfigured) return;

    const controller = new AbortController();
    fetch("/api/notifications", { signal: controller.signal })
      .then(async (response) => {
        const result = await response.json() as {
          notifications?: { id: string; title: string; body: string; read_at: string | null; created_at: string }[];
          error?: string;
        };
        if (!response.ok) throw new Error(result.error ?? "Notifications could not be loaded.");
        setItems((result.notifications ?? []).map((item) => ({
          id: item.id,
          title: item.title,
          body: item.body,
          read: item.read_at !== null,
          createdAt: new Date(item.created_at).toLocaleString(),
        })));
        setError("");
      })
      .catch((loadError: unknown) => {
        if (loadError instanceof DOMException && loadError.name === "AbortError") return;
        setError(loadError instanceof Error ? loadError.message : "Notifications could not be loaded.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [refresh]);

  return (
    <PlatformShell eyebrow="Activity" title="Notifications" description="Stay current on supplier responses, orders and account updates.">
      <Card className="mt-8 max-w-3xl divide-y divide-slate-200 p-0">
        {loading ? (
          <p role="status" className="p-5 text-sm text-slate-500">Loading notifications...</p>
        ) : error ? (
          <div className="p-5">
            <p role="alert" className="text-sm text-rose-700">{error}</p>
            {error.startsWith("Sign in") && <Link href="/login" className="mt-3 inline-flex text-sm font-semibold text-indigo-600">Sign in</Link>}
            <button onClick={() => { setLoading(true); setRefresh((current) => current + 1); }} className="mt-3 block text-sm font-semibold text-indigo-600">Try again</button>
          </div>
        ) : items.length === 0 ? (
          <p className="p-5 text-sm text-slate-500">You have no notifications yet.</p>
        ) : items.map((item) => (
          <div key={item.id} className="flex gap-4 p-5">
            <div className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${item.read ? "bg-slate-200" : "bg-indigo-600"}`} />
            <div>
              <p className="font-semibold">{item.title}</p>
              <p className="mt-1 text-sm text-slate-600">{item.body}</p>
              <p className="mt-2 text-xs text-slate-400">{item.createdAt}</p>
            </div>
          </div>
        ))}
      </Card>
    </PlatformShell>
  );
}
