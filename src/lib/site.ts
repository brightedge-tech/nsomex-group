import type { Locale } from "@/i18n/config";

type LocalizedText = Record<Locale, string>;
export type Division = {
  number: string; name: string; slug: string; summary: LocalizedText; overview: LocalizedText;
  focus: Array<{ name: LocalizedText; description: LocalizedText; slug: string }>;
};

export const divisions: Division[] = [
  {
    number: "01", name: "NSOMEX Technology", slug: "technology",
    summary: { en: "Technology, cloud infrastructure, cybersecurity, software, and digital transformation.", fr: "Technologies, infrastructures cloud, cybersécurité, logiciels et transformation numérique." },
    overview: { en: "We support organizations with technology capabilities that strengthen infrastructure, protect digital environments, improve operations, and enable transformation.", fr: "Nous accompagnons les organisations grâce à des compétences technologiques qui renforcent les infrastructures, protègent les environnements numériques, améliorent les opérations et favorisent la transformation." },
    focus: [
      { slug: "cloud", name: { en: "NSOMEX Cloud", fr: "NSOMEX Cloud" }, description: { en: "Cloud hosting, migration, infrastructure, DevOps, managed cloud, and disaster recovery.", fr: "Hébergement cloud, migration, infrastructure, DevOps, services cloud gérés et reprise après sinistre." } },
      { slug: "cybersecurity", name: { en: "NSOMEX Cybersecurity", fr: "NSOMEX Cybersécurité" }, description: { en: "Security assessments, network security, monitoring, and risk management.", fr: "Évaluations de sécurité, sécurité réseau, surveillance et gestion des risques." } },
      { slug: "software", name: { en: "NSOMEX Software", fr: "NSOMEX Logiciels" }, description: { en: "Web applications, enterprise software, and API development.", fr: "Applications web, logiciels d'entreprise et développement d'API." } },
      { slug: "ai-data", name: { en: "NSOMEX AI & Data", fr: "NSOMEX IA & Données" }, description: { en: "Data engineering, analytics, and applied AI services.", fr: "Ingénierie des données, analytique et services d'intelligence artificielle appliquée." } },
      { slug: "networks", name: { en: "NSOMEX Networks", fr: "NSOMEX Réseaux" }, description: { en: "Enterprise networking, connectivity, and network infrastructure.", fr: "Réseaux d'entreprise, connectivité et infrastructures réseau." } },
      { slug: "digital", name: { en: "NSOMEX Digital", fr: "NSOMEX Digital" }, description: { en: "Digital transformation, process automation, and IT consulting.", fr: "Transformation numérique, automatisation des processus et conseil informatique." } },
    ],
  },
  {
    number: "02", name: "NSOMEX Engineering", slug: "engineering",
    summary: { en: "Engineering, construction, infrastructure, and project delivery capabilities.", fr: "Ingénierie, construction, infrastructures et réalisation de projets." },
    overview: { en: "Our engineering division brings together technical disciplines and project delivery capabilities across the built environment and infrastructure.", fr: "Notre division ingénierie rassemble des disciplines techniques et des compétences de réalisation de projets dans les domaines de la construction et des infrastructures." },
    focus: [
      { slug: "construction", name: { en: "Construction", fr: "Construction" }, description: { en: "Residential, commercial, industrial, institutional, and renovation projects.", fr: "Projets résidentiels, commerciaux, industriels, institutionnels et de rénovation." } },
      { slug: "civil-engineering", name: { en: "Civil Engineering", fr: "Génie civil" }, description: { en: "Roads, bridges, drainage, and civil works.", fr: "Routes, ponts, drainage et travaux de génie civil." } },
      { slug: "mechanical-engineering", name: { en: "Mechanical Engineering", fr: "Génie mécanique" }, description: { en: "Industrial machinery and mechanical systems.", fr: "Machines industrielles et systèmes mécaniques." } },
      { slug: "electrical-engineering", name: { en: "Electrical Engineering", fr: "Génie électrique" }, description: { en: "Electrical installations and power systems.", fr: "Installations électriques et systèmes énergétiques." } },
      { slug: "structural-engineering", name: { en: "Structural Engineering", fr: "Ingénierie des structures" }, description: { en: "Building structures, foundations, and design.", fr: "Structures de bâtiments, fondations et conception." } },
      { slug: "project-management", name: { en: "Project Management", fr: "Gestion de projets" }, description: { en: "Planning, supervision, procurement, and execution.", fr: "Planification, supervision, approvisionnement et exécution." } },
    ],
  },
  {
    number: "03", name: "NSOMEX Renewable Energy", slug: "renewable-energy",
    summary: { en: "Renewable energy solutions, solar power, energy storage, and power systems.", fr: "Solutions d'énergies renouvelables, solaire, stockage et systèmes électriques." },
    overview: { en: "We focus on renewable energy and power solutions that can help homes, businesses, and institutions improve energy access and resilience.", fr: "Nous nous intéressons aux énergies renouvelables et aux solutions électriques qui peuvent aider les ménages, les entreprises et les institutions à améliorer leur accès à l'énergie et leur résilience." },
    focus: [
      { slug: "solar-energy", name: { en: "Solar Energy", fr: "Énergie solaire" }, description: { en: "Residential, commercial, and industrial solar solutions.", fr: "Solutions solaires résidentielles, commerciales et industrielles." } },
      { slug: "energy-storage", name: { en: "Energy Storage", fr: "Stockage de l'énergie" }, description: { en: "Battery systems and energy storage solutions.", fr: "Systèmes de batteries et solutions de stockage d'énergie." } },
      { slug: "wind-energy", name: { en: "Wind Energy", fr: "Énergie éolienne" }, description: { en: "Wind energy solutions and project development.", fr: "Solutions d'énergie éolienne et développement de projets." } },
      { slug: "power-systems", name: { en: "Power Systems", fr: "Systèmes électriques" }, description: { en: "Power infrastructure, integration, and system design.", fr: "Infrastructures électriques, intégration et conception de systèmes." } },
      { slug: "energy-consulting", name: { en: "Energy Consulting", fr: "Conseil en énergie" }, description: { en: "Energy assessments, planning, and advisory services.", fr: "Audits énergétiques, planification et services de conseil." } },
    ],
  },
  {
    number: "04", name: "NSOMEX Global Business", slug: "global-business",
    summary: { en: "International trade, sourcing, logistics, market development, and partnerships.", fr: "Commerce international, approvisionnement, logistique, développement de marchés et partenariats." },
    overview: { en: "We help organizations explore cross-border opportunities through trade support, sourcing, distribution, logistics coordination, and business development.", fr: "Nous aidons les organisations à explorer les opportunités transfrontalières grâce à l'accompagnement commercial, à l'approvisionnement, à la distribution, à la coordination logistique et au développement des affaires." },
    focus: [
      { slug: "international-trade", name: { en: "International Trade", fr: "Commerce international" }, description: { en: "Trade development and cross-border business support.", fr: "Développement commercial et accompagnement des activités transfrontalières." } },
      { slug: "global-sourcing", name: { en: "Global Sourcing", fr: "Approvisionnement mondial" }, description: { en: "Supplier discovery and sourcing coordination.", fr: "Recherche de fournisseurs et coordination de l'approvisionnement." } },
      { slug: "import-export", name: { en: "Import & Export", fr: "Import-export" }, description: { en: "Import and export coordination and market access.", fr: "Coordination des opérations d'import-export et accès aux marchés." } },
      { slug: "supply-chain", name: { en: "Supply Chain & Logistics", fr: "Chaîne d'approvisionnement et logistique" }, description: { en: "Supply chain coordination, logistics, and distribution.", fr: "Coordination de la chaîne d'approvisionnement, logistique et distribution." } },
      { slug: "business-development", name: { en: "Business Development", fr: "Développement des affaires" }, description: { en: "Market entry, growth planning, and strategic partnerships.", fr: "Accès aux marchés, planification de la croissance et partenariats stratégiques." } },
    ],
  },
];

export const primaryNavigation = [
  { key: "about", href: "about" },
  { key: "divisions", href: "divisions" },
  { key: "projects", href: "projects" },
  { key: "insights", href: "insights" },
  { key: "contact", href: "contact" },
] as const;

export function getDivision(slug: string) {
  return divisions.find((division) => division.slug === slug);
}
