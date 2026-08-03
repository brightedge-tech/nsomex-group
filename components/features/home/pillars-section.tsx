import { FeatureCard } from "@/components/feature-card";
import { Section } from "@/components/ui/section";

const pillars = [
  {
    title: "Secure by design",
    description:
      "A foundation for trusted operations, thoughtful access controls, and dependable delivery workflows.",
  },
  {
    title: "Built to scale",
    description:
      "A clear app shell that can grow from a starter experience into a richer platform over time.",
  },
  {
    title: "Engineered for clarity",
    description:
      "Readable structure, modern tooling, and documentation that make the project easy to extend.",
  },
];

export function PillarsSection() {
  return (
    <Section
      id="pillars"
      title="Platform pillars"
      description="These building blocks form the foundation for an enterprise-ready experience."
      className="mt-16"
    >
      <div className="grid gap-6 md:grid-cols-3">
        {pillars.map((pillar) => (
          <FeatureCard key={pillar.title} title={pillar.title} description={pillar.description} />
        ))}
      </div>
    </Section>
  );
}
