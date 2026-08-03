import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { QueryProvider } from "@/components/providers/query-provider";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </QueryProvider>
  );
}
