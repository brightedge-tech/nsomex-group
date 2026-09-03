import { Container } from "@/components/ui/container";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/70">
      <Container className="py-12">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
          <div>
            <h4 className="font-semibold text-slate-900">Company</h4>
            <p className="mt-2 text-sm text-slate-600">About NSOMEX Orbit</p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900">Solutions</h4>
            <ul className="mt-2 space-y-1 text-sm text-slate-600">
              <li>Technologies</li>
              <li>Industrial</li>
              <li>Trade & Logistics</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900">Industries</h4>
            <ul className="mt-2 space-y-1 text-sm text-slate-600">
              <li>Energy</li>
              <li>Water</li>
              <li>Construction</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900">Resources</h4>
            <ul className="mt-2 space-y-1 text-sm text-slate-600">
              <li>Knowledge Center</li>
              <li>Case Studies</li>
              <li>Academy</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900">Contact</h4>
            <p className="mt-2 text-sm text-slate-600">contact@nsomex.example</p>
            <div className="mt-3 flex gap-3 text-slate-500">[social links]</div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-100 pt-4 text-sm text-slate-600">© 2026 NSOMEX Orbit. Privacy · Terms</div>
      </Container>
    </footer>
  );
}
