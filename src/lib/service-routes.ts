import type { Locale } from "@/i18n/config";

export function toServiceSlug(label: string): string {
  return label
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

type Timeline = Record<Locale, string>;

const constructionTimelines: Record<string, Timeline> = {
  "custom-home-design-and-build": { en: "Approximately 6–12 months", fr: "Environ 6 à 12 mois" },
  "single-family-homes-duplexes-and-villas": { en: "Approximately 6–12 months", fr: "Environ 6 à 12 mois" },
  "apartment-buildings-and-multi-unit-housing": { en: "Approximately 10–18 months", fr: "Environ 10 à 18 mois" },
  "home-extensions-and-residential-renovations": { en: "Approximately 8–20 weeks", fr: "Environ 8 à 20 semaines" },
  "office-buildings-and-business-premises": { en: "Approximately 6–14 months", fr: "Environ 6 à 14 mois" },
  "retail-showroom-and-hospitality-spaces": { en: "Approximately 3–9 months", fr: "Environ 3 à 9 mois" },
  "commercial-fit-out-and-refurbishment": { en: "Approximately 6–20 weeks", fr: "Environ 6 à 20 semaines" },
  "warehouses-and-distribution-facilities": { en: "Approximately 6–14 months", fr: "Environ 6 à 14 mois" },
  "workshops-and-production-buildings": { en: "Approximately 5–12 months", fr: "Environ 5 à 12 mois" },
  "industrial-site-development-and-upgrades": { en: "Approximately 3–9 months", fr: "Environ 3 à 9 mois" },
};

export function getIndicativeTimeline(
  divisionSlug: string,
  unitSlug: string,
  serviceSlug: string,
  locale: Locale,
): string {
  const specific = constructionTimelines[serviceSlug];
  if (specific) return specific[locale];

  const ranges: Record<string, Timeline> = {
    "civil-engineering": { en: "Approximately 3–12 months", fr: "Environ 3 à 12 mois" },
    "mechanical-engineering": { en: "Approximately 4–16 weeks", fr: "Environ 4 à 16 semaines" },
    "electrical-engineering": { en: "Approximately 3–16 weeks", fr: "Environ 3 à 16 semaines" },
    "structural-engineering": { en: "Approximately 3–10 weeks", fr: "Environ 3 à 10 semaines" },
    "project-management": { en: "Defined during project mobilisation", fr: "Défini lors du lancement du projet" },
    cloud: { en: "Approximately 2–10 weeks", fr: "Environ 2 à 10 semaines" },
    cybersecurity: { en: "Approximately 2–8 weeks", fr: "Environ 2 à 8 semaines" },
    software: { en: "Approximately 4–16 weeks", fr: "Environ 4 à 16 semaines" },
    "ai-data": { en: "Approximately 4–16 weeks", fr: "Environ 4 à 16 semaines" },
    networks: { en: "Approximately 2–10 weeks", fr: "Environ 2 à 10 semaines" },
    digital: { en: "Approximately 2–8 weeks", fr: "Environ 2 à 8 semaines" },
    "solar-energy": { en: "Approximately 3–12 weeks", fr: "Environ 3 à 12 semaines" },
    "energy-storage": { en: "Approximately 3–10 weeks", fr: "Environ 3 à 10 semaines" },
    "wind-energy": { en: "Feasibility and development schedule assessed per site", fr: "Calendrier de faisabilité et de développement évalué selon le site" },
    "power-systems": { en: "Approximately 4–16 weeks", fr: "Environ 4 à 16 semaines" },
    "energy-consulting": { en: "Approximately 2–6 weeks", fr: "Environ 2 à 6 semaines" },
    "international-trade": { en: "Approximately 2–8 weeks for initial coordination", fr: "Environ 2 à 8 semaines pour la coordination initiale" },
    "global-sourcing": { en: "Approximately 2–8 weeks for supplier discovery", fr: "Environ 2 à 8 semaines pour la recherche de fournisseurs" },
    "import-export": { en: "Depends on route, goods, and regulatory clearance", fr: "Dépend de l'itinéraire, des marchandises et des formalités réglementaires" },
    "supply-chain": { en: "Approximately 3–10 weeks for assessment and planning", fr: "Environ 3 à 10 semaines pour l'évaluation et la planification" },
    "business-development": { en: "Scoped around the agreed market and objectives", fr: "Défini selon le marché et les objectifs convenus" },
  };

  if (divisionSlug === "engineering" && unitSlug.includes("construction")) {
    return locale === "fr" ? "À définir selon la conception, le site et l'ampleur des travaux" : "Set according to design, site conditions, and construction scope";
  }
  return ranges[unitSlug]?.[locale] ?? (locale === "fr" ? "À définir après étude du besoin" : "To be defined after requirements review");
}
