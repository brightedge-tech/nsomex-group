
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { QueryProvider } from "@/components/providers/query-provider";
import { RFQProvider } from "@/components/rfq/RFQContext";
import ClientRFQHost from "@/components/rfq/ClientRFQHost";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <RFQProvider>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <ClientRFQHost />
        </div>
      </RFQProvider>
    </QueryProvider>
  );
}
