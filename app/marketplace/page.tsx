import { Container } from "@/components/ui/container";
import MarketplaceComponent from "@/components/home/Marketplace";

export default function Page() {
  return (
    <div className="bg-slate-50">
      <Container className="py-6">
        <MarketplaceComponent />
      </Container>
    </div>
  );
}
