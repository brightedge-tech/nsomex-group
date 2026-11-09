import type { Locale } from "./config";

const dictionaries = {
  en: {
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
    divisions: { eyebrow: "OUR DIVISIONS", title: "Four divisions. One connected group.", intro: "Explore the capabilities and areas of focus that bring the NSOMEX Group vision to life.", back: "All divisions", focus: "AREAS OF FOCUS", overview: "Division overview", enquire: "Discuss an opportunity" },
    sections: {
      about: { eyebrow: "ABOUT NSOMEX GROUP", title: "Connecting capability with opportunity.", description: "NSOMEX Group brings together complementary capabilities across technology, engineering, renewable energy, and global business. Our focus is on trust, collaboration, and practical execution across markets.", note: "Company profile, leadership information, and verified corporate details will be added after final review." },
      projects: { eyebrow: "OUR WORK", title: "Projects and experience.", description: "This portfolio will present selected projects, their scope, locations, delivery stages, and approved media.", note: "Project case studies will be published only after their details and images have been verified and approved." },
      insights: { eyebrow: "INSIGHTS", title: "Perspectives and updates.", description: "News, company updates, and useful perspectives from across the NSOMEX Group divisions.", note: "Editorial content is being prepared for publication." },
      contact: { eyebrow: "CONTACT", title: "Start a conversation.", description: "Tell us about your organization, project, or partnership opportunity. The enquiry form and verified contact channels will be enabled before public launch.", note: "Official contact details are being confirmed. No unverified phone number or email address will be published." },
    },
  },
  fr: {
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
    divisions: { eyebrow: "NOS DIVISIONS", title: "Quatre divisions. Un groupe connecté.", intro: "Découvrez les compétences et les domaines d'intervention qui donnent vie à la vision de NSOMEX Group.", back: "Toutes les divisions", focus: "DOMAINES D'INTERVENTION", overview: "Présentation de la division", enquire: "Discuter d'une opportunité" },
    sections: {
      about: { eyebrow: "À PROPOS DE NSOMEX GROUP", title: "Relier les compétences aux opportunités.", description: "NSOMEX Group réunit des compétences complémentaires dans les domaines de la technologie, de l'ingénierie, des énergies renouvelables et du commerce international. Nous privilégions la confiance, la collaboration et une exécution concrète sur les marchés.", note: "La présentation de l'entreprise, les informations sur la direction et les détails institutionnels vérifiés seront ajoutés après validation finale." },
      projects: { eyebrow: "NOS RÉALISATIONS", title: "Projets et expériences.", description: "Ce portfolio présentera une sélection de projets, leur périmètre, leur localisation, leurs étapes de réalisation et les médias approuvés.", note: "Les études de cas ne seront publiées qu'après vérification et approbation des informations et des images." },
      insights: { eyebrow: "ACTUALITÉS ET ANALYSES", title: "Perspectives et actualités.", description: "Actualités, informations du groupe et perspectives utiles issues des différentes divisions de NSOMEX Group.", note: "Les contenus éditoriaux sont en préparation." },
      contact: { eyebrow: "CONTACT", title: "Engageons la conversation.", description: "Parlez-nous de votre organisation, de votre projet ou d'une opportunité de partenariat. Le formulaire de demande et les coordonnées vérifiées seront activés avant le lancement public.", note: "Les coordonnées officielles sont en cours de confirmation. Aucun numéro ni aucune adresse électronique non vérifiés ne seront publiés." },
    },
  },
} as const;

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
