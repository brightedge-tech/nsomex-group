import type { Locale } from "@/i18n/config";

const capabilityOfferings: Record<string, Record<Locale, string[]>> = {
  cloud: {
    en: ["Cloud architecture and migration planning", "DevOps, platform automation, and deployment pipelines", "Backup, disaster recovery, and cloud resilience"],
    fr: ["Architecture cloud et planification des migrations", "DevOps, automatisation des plateformes et pipelines de déploiement", "Sauvegarde, reprise après sinistre et résilience cloud"],
  },
  cybersecurity: {
    en: ["Security reviews and risk assessments", "Identity, access, and network security controls", "Security monitoring and incident-readiness planning"],
    fr: ["Revues de sécurité et évaluations des risques", "Contrôles d'identité, d'accès et de sécurité réseau", "Surveillance de la sécurité et préparation à la gestion des incidents"],
  },
  software: {
    en: ["Business websites and web applications", "Custom business software and workflow platforms", "API design, integration, and system modernization"],
    fr: ["Sites web professionnels et applications web", "Logiciels métier et plateformes de gestion des processus", "Conception d'API, intégration et modernisation des systèmes"],
  },
  "ai-data": {
    en: ["Data architecture, pipelines, and integration", "Reporting, analytics, and decision-support dashboards", "Practical AI applications and workflow automation"],
    fr: ["Architecture des données, pipelines et intégration", "Rapports, analytique et tableaux de bord décisionnels", "Applications concrètes de l'IA et automatisation des processus"],
  },
  networks: {
    en: ["Enterprise network architecture and design", "LAN, WAN, wireless, and connectivity infrastructure", "Network performance, monitoring, and operations"],
    fr: ["Architecture et conception de réseaux d'entreprise", "Infrastructures LAN, WAN, sans fil et connectivité", "Performance, surveillance et exploitation des réseaux"],
  },
  digital: {
    en: ["Digital strategy and technology advisory", "Business process mapping and automation", "IT operating models and transformation roadmaps"],
    fr: ["Stratégie numérique et conseil technologique", "Cartographie et automatisation des processus métier", "Modèles opérationnels IT et feuilles de route de transformation"],
  },
  construction: {
    en: ["Residential, commercial, and industrial construction", "Renovation, fit-out, and building improvement works", "Construction planning and site coordination"],
    fr: ["Construction résidentielle, commerciale et industrielle", "Rénovation, aménagement et amélioration de bâtiments", "Planification des travaux et coordination de chantier"],
  },
  "civil-engineering": {
    en: ["Roads, access routes, and transport infrastructure", "Drainage, water management, and civil works", "Site development and infrastructure coordination"],
    fr: ["Routes, voies d'accès et infrastructures de transport", "Drainage, gestion de l'eau et travaux de génie civil", "Aménagement de sites et coordination des infrastructures"],
  },
  "mechanical-engineering": {
    en: ["Mechanical systems planning and design coordination", "Industrial machinery and equipment solutions", "Maintenance planning and reliability improvement"],
    fr: ["Planification des systèmes mécaniques et coordination de conception", "Solutions de machines et d'équipements industriels", "Planification de la maintenance et amélioration de la fiabilité"],
  },
  "electrical-engineering": {
    en: ["Building electrical installations and distribution", "Power systems planning and integration", "Testing, commissioning, and electrical safety coordination"],
    fr: ["Installations électriques de bâtiments et distribution", "Planification et intégration des systèmes électriques", "Essais, mise en service et coordination de la sécurité électrique"],
  },
  "structural-engineering": {
    en: ["Structural design coordination and technical reviews", "Foundations, framing, and building structure solutions", "Structural assessment and rehabilitation planning"],
    fr: ["Coordination de la conception structurelle et revues techniques", "Fondations, ossatures et solutions de structure de bâtiment", "Évaluation structurelle et planification de réhabilitation"],
  },
  "project-management": {
    en: ["Project scope, scheduling, and delivery planning", "Procurement coordination and contractor interfaces", "Progress reporting, risk, and quality oversight"],
    fr: ["Définition du périmètre, calendrier et planification des projets", "Coordination des achats et interfaces avec les prestataires", "Suivi d'avancement, gestion des risques et contrôle qualité"],
  },
  "solar-energy": {
    en: ["Solar feasibility studies and system sizing", "Rooftop and ground-mounted photovoltaic concepts", "Installation coordination and maintenance planning"],
    fr: ["Études de faisabilité solaire et dimensionnement des systèmes", "Solutions photovoltaïques en toiture et au sol", "Coordination de l'installation et planification de la maintenance"],
  },
  "energy-storage": {
    en: ["Battery storage sizing and configuration", "Solar-plus-storage and hybrid energy concepts", "Energy management and backup-power strategies"],
    fr: ["Dimensionnement et configuration du stockage par batteries", "Solutions hybrides et systèmes solaires avec stockage", "Gestion de l'énergie et stratégies d'alimentation de secours"],
  },
  "wind-energy": {
    en: ["Wind resource screening and project feasibility", "Wind system integration and power connection planning", "Project development and technical coordination"],
    fr: ["Pré-évaluation du potentiel éolien et faisabilité des projets", "Intégration des systèmes éoliens et planification du raccordement", "Développement de projets et coordination technique"],
  },
  "power-systems": {
    en: ["Power distribution and electrical infrastructure planning", "Backup power, microgrid, and system integration concepts", "Power system studies and reliability improvement"],
    fr: ["Planification de la distribution et des infrastructures électriques", "Solutions d'alimentation de secours, micro-réseaux et intégration", "Études des systèmes électriques et amélioration de la fiabilité"],
  },
  "energy-consulting": {
    en: ["Energy-use assessments and efficiency reviews", "Demand, operating-cost, and consumption analysis", "Energy transition strategies and implementation roadmaps"],
    fr: ["Évaluations des usages énergétiques et de l'efficacité", "Analyse de la demande, des coûts d'exploitation et de la consommation", "Stratégies de transition énergétique et feuilles de route"],
  },
  "international-trade": {
    en: ["Market-entry research and trade opportunity mapping", "Cross-border trade planning and coordination", "International partner and distribution development"],
    fr: ["Études d'accès aux marchés et identification d'opportunités commerciales", "Planification et coordination des échanges transfrontaliers", "Développement de partenaires et de réseaux de distribution internationaux"],
  },
  "global-sourcing": {
    en: ["Supplier discovery and market screening", "Supplier qualification and due-diligence coordination", "Sourcing strategy and procurement support"],
    fr: ["Recherche de fournisseurs et analyse des marchés", "Qualification des fournisseurs et coordination des vérifications", "Stratégie d'approvisionnement et accompagnement des achats"],
  },
  "import-export": {
    en: ["Import and export planning and coordination", "Trade documentation and customs-process coordination", "Market access and shipping partner coordination"],
    fr: ["Planification et coordination des opérations d'import-export", "Coordination des documents commerciaux et des formalités douanières", "Accès aux marchés et coordination des partenaires de transport"],
  },
  "supply-chain": {
    en: ["Supply chain mapping and logistics planning", "Freight, warehousing, and distribution coordination", "Supply chain visibility and operational improvement"],
    fr: ["Cartographie de la chaîne d'approvisionnement et planification logistique", "Coordination du fret, de l'entreposage et de la distribution", "Visibilité de la chaîne logistique et amélioration opérationnelle"],
  },
  "business-development": {
    en: ["Market research and commercial opportunity assessment", "Strategic partnership and stakeholder development", "Growth planning and business expansion support"],
    fr: ["Études de marché et évaluation des opportunités commerciales", "Développement de partenariats stratégiques et de parties prenantes", "Planification de la croissance et accompagnement à l'expansion"],
  },
};

export function getCapabilityOfferings(slug: string, locale: Locale): string[] {
  return capabilityOfferings[slug]?.[locale] ?? [];
}
