import { notifications } from "@/lib/data/platform";
import { Card } from "@/components/ui/card";
import { PlatformShell } from "@/components/platform/PlatformUI";
export default function NotificationsPage() { return <PlatformShell eyebrow="Activity" title="Notifications" description="Stay current on supplier responses, orders and account updates."><Card className="mt-8 max-w-3xl divide-y divide-slate-200 p-0">{notifications.map((n) => <div key={n.id} className="flex gap-4 p-5"><div className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${n.unread ? "bg-indigo-600" : "bg-slate-200"}`} /><div><p className="font-semibold">{n.title}</p><p className="mt-1 text-sm text-slate-600">{n.body}</p><p className="mt-2 text-xs text-slate-400">{n.time}</p></div></div>)}</Card></PlatformShell>; }
