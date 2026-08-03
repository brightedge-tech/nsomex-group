import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";

export function StructureSection() {
  return (
    <Section
      id="platform"
      title="Why this structure scales"
      description="The app now has reusable building blocks for future screens and product modules."
      className="mt-16"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="text-lg font-semibold text-slate-950">Shared design system</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Reusable container, section, card, button, and layout primitives make the app easier to extend responsibly.
          </p>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold text-slate-950">Enterprise-ready foundation</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            The structure is ready for feature modules, environments, and additional product experiences without redesigning the shell.
          </p>
        </Card>
      </div>
    </Section>
  );
}
