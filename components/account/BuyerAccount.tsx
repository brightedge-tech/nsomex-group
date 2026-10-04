"use client";

import Link from "next/link";
import { orders } from "@/lib/data/platform";
import { Card } from "@/components/ui/card";
import { PlatformShell, QuickLink, Status } from "@/components/platform/PlatformUI";
import { ProfileEditor } from "@/components/account/ProfileEditor";
import { InquiryList } from "@/components/inquiries/InquiryList";
import { useAuth } from "@/components/auth/AuthProvider";

const sections = [
  ["/account", "Overview"], ["/account/profile", "Profile"], ["/account/inquiries", "Inquiries"], ["/account/favorites", "Favorites"], ["/account/orders", "Orders"], ["/account/messages", "Messages"], ["/account/settings", "Settings"],
];

export function BuyerAccount({ view = "overview" }: { view?: string }) {
  const { session } = useAuth();
  const profileFields = [session.name, session.email, session.company, session.country];
  const profileCompleteness = Math.round(profileFields.filter(Boolean).length / profileFields.length * 100);
  if (view !== "overview") return <AccountPanel view={view} />;
  return <PlatformShell eyebrow="Buyer workspace" title={`Welcome back, ${session.name.split(" ")[0]}`} description={`${session.company} · ${session.role}`} action={<Link href="/rfq/create" className="rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white">Post an RFQ</Link>}>
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{sections.slice(1, 5).map(([href, label]) => <QuickLink key={href} href={href} title={label} description={label === "Profile" ? `${profileCompleteness}% complete` : `View your ${label.toLowerCase()}`} />)}</div>
    <div className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_1fr]">
      <Card><div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Recent product inquiries</h2><Link href="/account/inquiries" className="text-sm font-semibold text-indigo-600">View all</Link></div><div className="mt-4"><InquiryList audience="buyer" /></div></Card>
      <Card><div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Account summary</h2><Link href="/account/profile" className="text-sm font-semibold text-indigo-600">Edit</Link></div><div className="mt-5 flex items-center gap-4"><div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-950 font-semibold text-white">{session.name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase()}</div><div><p className="font-semibold">{session.name}</p><p className="text-sm text-slate-500">{session.company}</p><p className="text-sm text-slate-500">{session.country}</p></div></div><div className="mt-6"><div className="flex justify-between text-sm"><span>Profile completeness</span><strong>{profileCompleteness}%</strong></div><div className="mt-2 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-indigo-600" style={{ width: `${profileCompleteness}%` }} /></div></div></Card>
    </div>
    <div className="mt-6 grid gap-6 lg:grid-cols-2"><Card><div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Recent orders</h2><Link href="/account/orders" className="text-sm font-semibold text-indigo-600">View all</Link></div><div className="mt-4 space-y-3">{orders.map((order) => <Link href="/account/orders" key={order.id} className="flex items-center justify-between rounded-lg bg-slate-50 p-3"><div><p className="font-medium">{order.title}</p><p className="text-xs text-slate-500">{order.id} · {order.supplier}</p></div><Status>{order.status}</Status></Link>)}</div></Card><div className="grid gap-3 sm:grid-cols-2"><QuickLink href="/products" title="Browse products" description="Find verified industrial suppliers" /><QuickLink href="/messages" title="Open messages" description="Continue supplier conversations" /><QuickLink href="/account/favorites" title="Saved products" description="Review your shortlist" /><QuickLink href="/account/settings" title="Account settings" description="Manage preferences and security" /></div></div>
  </PlatformShell>;
}

function AccountPanel({ view }: { view: string }) {
  const labels: Record<string, [string, string]> = { profile: ["Profile", "Keep your buyer profile current for better supplier responses."], inquiries: ["My inquiries", "Track requests, responses and negotiations in one place."], favorites: ["Favorites", "Your saved products and suppliers will appear here."], orders: ["Orders", "Monitor fulfillment and delivery for marketplace purchases."], messages: ["Messages", "Your supplier conversations are available in Messages."], settings: ["Settings", "Manage notifications, preferences and account security."] };
  const [title, description] = labels[view] ?? ["Account", "Manage your buyer workspace."];
  return <PlatformShell eyebrow="Buyer account" title={title} description={description}><div className="mt-8 grid gap-6 lg:grid-cols-[15rem_1fr]"><aside className="space-y-1">{sections.map(([href, label]) => <Link key={href} href={href} className={`block rounded-lg px-3 py-2 text-sm ${href.endsWith(view) || (view === "overview" && href === "/account") ? "bg-indigo-50 font-semibold text-indigo-700" : "text-slate-600 hover:bg-white"}`}>{label}</Link>)}</aside><Card><h2 className="text-lg font-semibold">{title}</h2>{view === "profile" && <div className="mt-5"><ProfileEditor /></div>}{view === "inquiries" && <div className="mt-4"><InquiryList audience="buyer" /></div>}{view === "orders" && <div className="mt-4 space-y-3">{orders.map((item) => <div key={item.id} className="flex flex-wrap justify-between gap-3 rounded-lg bg-slate-50 p-4"><div><p className="font-medium">{item.title}</p><p className="text-sm text-slate-500">{item.id} · {item.amount}</p></div><Status>{item.status}</Status></div>)}</div>}{view === "favorites" && <div className="mt-4"><p className="text-slate-600">Your saved products are stored with your account.</p><Link href="/account/favorites" className="mt-3 inline-flex text-sm font-semibold text-indigo-600">View saved products</Link></div>}{["messages", "settings"].includes(view) && <p className="mt-3 text-slate-600">This section is ready for your next marketplace workflow. Use the links below to continue.</p>}<div className="mt-6 flex flex-wrap gap-3"><QuickLink href={view === "messages" ? "/messages" : view === "inquiries" ? "/rfq/my-requests" : view === "favorites" ? "/account/favorites" : "/rfq/create"} title={view === "messages" ? "Open messages" : view === "favorites" ? "View favorites" : "Continue"} description="Open the next workspace view" /></div></Card></div></PlatformShell>;
}
