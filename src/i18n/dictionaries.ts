import type { Locale } from "./config";

const dictionaries = {
  en: {
    media: { groupVisual: "NSOMEX GROUP / CORPORATE IMAGE", divisionVisual: "DIVISION / INDUSTRY IMAGE", capabilityVisual: "CAPABILITY / PROJECT IMAGE", placeholderDetail: "Reserved for an approved company photograph" },
    navigation: { about: "About", divisions: "Divisions", projects: "Projects", insights: "Insights", contact: "Contact", connect: "Let's connect" },
    home: {
      eyebrow: "A GLOBAL BUSINESS GROUP", headlineFirst: "Connecting global business", headlineSecond: "to global opportunity.",
      intro: "We bring together technology, engineering, renewable energy, and global business to help organizations access opportunity and move forward with confidence.",
      explore: "Explore our divisions", discover: "Discover NSOMEX", orbit: "CONNECTED BY PURPOSE",
      capabilities: "INTEGRATED CAPABILITIES", world: "BUILT FOR A CONNECTED WORLD", who: "WHO WE ARE",
      one: "One group.", multiple: "Multiple capabilities.", ambition: "Shared ambition.",
      aboutOne: "NSOMEX Group is a technology-driven global business company connecting businesses, products, services, talent, and opportunities across markets.",
      aboutTwo: "Operating across complementary sectors, we focus on trust, distribution, technology, and execution—helping organizations navigate complexity and pursue sustainable growth.",
      more: "More about the group", ourDivisions: "OUR DIVISIONS", divisionHeading: "Expertise across connected industries.",
      divisionIntro: "Four focused divisions. A shared commitment to creating value across markets.",
      exploreDivision: "Explore division", move: "LET'S MOVE FORWARD", opportunity: "Opportunity begins",
      connection: "with a connection.", start: "Start a conversation", copyright: "All rights reserved.",
    },
    divisions: { eyebrow: "OUR DIVISIONS", title: "Four divisions. One connected group.", intro: "Explore the capabilities and areas of focus that bring the NSOMEX Group vision to life.", back: "All divisions", focus: "AREAS OF FOCUS", overview: "Division overview", enquire: "Discuss an opportunity", exploreCapability: "Explore capability", capabilityEyebrow: "CAPABILITY", capabilityOverview: "Capability overview", offerings: "Service areas", scopeHeading: "How this capability can support your organization", contactPrompt: "Have a requirement to discuss?", contactPromptText: "Share your objectives and context with our team. We can explore the scope, practical considerations, and a suitable next step.", contactCta: "Start an enquiry", serviceApproach: "How we approach the work", serviceApproachText: "We begin by understanding the operating context, objectives, constraints, and stakeholders. Scope, technical requirements, responsibilities, and delivery milestones are then defined with the client before work proceeds.", partnership: "A considered approach to every engagement", partnershipText: "Every organization has different requirements. We shape conversations around the intended outcome, practical feasibility, risk, and long-term value rather than a one-size-fits-all package." },
    sections: {
      about: { eyebrow: "ABOUT NSOMEX GROUP", title: "Connecting capability with opportunity.", description: "NSOMEX Group brings together complementary capabilities across technology, engineering, renewable energy, and global business. Our focus is on trust, collaboration, and practical execution across markets.", note: "Company profile, leadership information, and verified corporate details will be added after final review.", imageLabel: "COMPANY / HEADQUARTERS IMAGE", imageDetail: "Reserved for an approved corporate photograph" },
      projects: { eyebrow: "OUR WORK", title: "Projects and experience.", description: "This portfolio will present selected projects, their scope, locations, delivery stages, and approved media.", note: "Project case studies will be published only after their details and images have been verified and approved.", imageLabel: "PROJECT PHOTOGRAPHY", imageDetail: "Reserved for approved project and case-study images" },
      insights: { eyebrow: "INSIGHTS", title: "Perspectives and updates.", description: "News, company updates, and useful perspectives from across the NSOMEX Group divisions.", note: "Editorial content is being prepared for publication." },
      contact: { eyebrow: "CONTACT", title: "Start a conversation.", description: "Tell us about your organization, project, or partnership opportunity. Contact our team directly using the official channels below.", directEyebrow: "DIRECT CONTACT", directTitle: "Connect with our team.", directDescription: "For business enquiries, partnerships, project discussions, and general information, reach us through one of our official contact channels.", emailLabel: "GENERAL ENQUIRIES", emailAction: "Send an email", chinaLabel: "CHINA CONTACT", cameroonLabel: "CAMEROON CONTACT", callAction: "Call this number", responseNote: "Please include your name, organization, country, and a short description of your enquiry so we can direct it to the appropriate team." },
    },
  },
  fr: {
    media: { groupVisual: "NSOMEX GROUP / IMAGE INSTITUTIONNELLE", divisionVisual: "DIVISION / IMAGE SECTORIELLE", capabilityVisual: "COMPÉTENCE / IMAGE DE PROJET", placeholderDetail: "Emplacement réservé à une photographie approuvée" },
    navigation: { about: "À propos", divisions: "Nos divisions", projects: "Projets", insights: "Actualités", contact: "Contact", connect: "Parlons ensemble" },
    home: {
      eyebrow: "UN GROUPE D'AFFAIRES INTERNATIONAL", headlineFirst: "Connecter les entreprises", headlineSecond: "aux opportunités mondiales.",
      intro: "Nous réunissons la technologie, l'ingénierie, les énergies renouvelables et le commerce international pour aider les organisations à saisir les opportunités et à avancer avec confiance.",
      explore: "Découvrir nos divisions", discover: "Découvrir NSOMEX", orbit: "UNIS PAR UNE MÊME VISION",
      capabilities: "DES COMPÉTENCES INTÉGRÉES", world: "PENSÉ POUR UN MONDE CONNECTÉ", who: "QUI SOMMES-NOUS",
      one: "Un seul groupe.", multiple: "Des compétences multiples.", ambition: "Une ambition commune.",
      aboutOne: "NSOMEX Group est un groupe international axé sur la technologie, qui met en relation les entreprises, les produits, les services, les talents et les opportunités sur différents marchés.",
      aboutTwo: "Grâce à des secteurs complémentaires, nous mettons l'accent sur la confiance, la distribution, la technologie et l'exécution afin d'aider les organisations à relever les défis et à poursuivre une croissance durable.",
      more: "En savoir plus sur le groupe", ourDivisions: "NOS DIVISIONS", divisionHeading: "Des expertises au service de secteurs connectés.",
      divisionIntro: "Quatre divisions spécialisées, un engagement commun pour créer de la valeur sur les marchés.",
      exploreDivision: "Découvrir la division", move: "AVANÇONS ENSEMBLE", opportunity: "Les opportunités commencent",
      connection: "par une connexion.", start: "Entrer en contact", copyright: "Tous droits réservés.",
    },
    divisions: { eyebrow: "NOS DIVISIONS", title: "Quatre divisions. Un groupe connecté.", intro: "Découvrez les compétences et les domaines d'intervention qui donnent vie à la vision de NSOMEX Group.", back: "Toutes les divisions", focus: "DOMAINES D'INTERVENTION", overview: "Présentation de la division", enquire: "Discuter d'une opportunité", exploreCapability: "Découvrir cette compétence", capabilityEyebrow: "COMPÉTENCE", capabilityOverview: "Présentation de la compétence", offerings: "Domaines de services", scopeHeading: "Comment cette compétence peut accompagner votre organisation", contactPrompt: "Un besoin à discuter ?", contactPromptText: "Présentez-nous vos objectifs et votre contexte. Nous pourrons examiner le périmètre, les aspects pratiques et les prochaines étapes adaptées.", contactCta: "Envoyer une demande", serviceApproach: "Notre approche", serviceApproachText: "Nous commençons par comprendre le contexte opérationnel, les objectifs, les contraintes et les parties prenantes. Le périmètre, les exigences techniques, les responsabilités et les étapes de réalisation sont ensuite définis avec le client avant le démarrage des travaux.", partnership: "Une approche adaptée à chaque collaboration", partnershipText: "Chaque organisation a des besoins différents. Nos échanges portent sur les résultats attendus, la faisabilité, les risques et la valeur à long terme, plutôt que sur une offre standardisée." },
    sections: {
      about: { eyebrow: "À PROPOS DE NSOMEX GROUP", title: "Relier les compétences aux opportunités.", description: "NSOMEX Group réunit des compétences complémentaires dans les domaines de la technologie, de l'ingénierie, des énergies renouvelables et du commerce international. Nous privilégions la confiance, la collaboration et une exécution concrète sur les marchés.", note: "La présentation de l'entreprise, les informations sur la direction et les détails institutionnels vérifiés seront ajoutés après validation finale.", imageLabel: "ENTREPRISE / SIÈGE", imageDetail: "Emplacement réservé à une photographie institutionnelle approuvée" },
      projects: { eyebrow: "NOS RÉALISATIONS", title: "Projets et expériences.", description: "Ce portfolio présentera une sélection de projets, leur périmètre, leur localisation, leurs étapes de réalisation et les médias approuvés.", note: "Les études de cas ne seront publiées qu'après vérification et approbation des informations et des images.", imageLabel: "PHOTOGRAPHIES DE PROJETS", imageDetail: "Emplacement réservé aux images approuvées des projets et études de cas" },
      insights: { eyebrow: "ACTUALITÉS ET ANALYSES", title: "Perspectives et actualités.", description: "Actualités, informations du groupe et perspectives utiles issues des différentes divisions de NSOMEX Group.", note: "Les contenus éditoriaux sont en préparation." },
      contact: { eyebrow: "CONTACT", title: "Engageons la conversation.", description: "Parlez-nous de votre organisation, de votre projet ou d'une opportunité de partenariat. Contactez directement notre équipe par l’un des canaux officiels ci-dessous.", directEyebrow: "CONTACT DIRECT", directTitle: "Échangez avec notre équipe.", directDescription: "Pour toute demande commerciale, partenariat, discussion de projet ou information générale, contactez-nous par l’un de nos canaux officiels.", emailLabel: "DEMANDES GÉNÉRALES", emailAction: "Envoyer un e-mail", chinaLabel: "CONTACT EN CHINE", cameroonLabel: "CONTACT AU CAMEROUN", callAction: "Appeler ce numéro", responseNote: "Veuillez indiquer votre nom, votre organisation, votre pays et une brève description de votre demande afin que nous puissions vous orienter vers l’équipe concernée." },
    },
  },
} as const;

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
