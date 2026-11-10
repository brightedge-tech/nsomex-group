// Homepage assets are global; division images are independent and replaceable.
export const stockImages = {
  // Add the approved globe-and-skyline composite at public/images/homepage-hero.jpg.
  heroSkyline: "/images/homepage-hero.jpg",
  // Add the approved NSOMEX meeting photo at public/images/homepage-corporate.jpg.
  corporate: "/images/homepage-corporate.jpg",
  technology: "https://images.unsplash.com/photo-1775519520461-6b6e068d9250?auto=format&fit=crop&fm=jpg&ixid=NHwxM3JkZDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",
  engineering: "https://images.unsplash.com/photo-1757436382135-5cb8e5cbcda5?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",
  renewableEnergy: "https://images.unsplash.com/photo-1771178301028-49a922aefccd?auto=format&fit=crop&fm=jpg&ixid=NHwxMJA3fDA%3D&ixlib=rb-4.1.0&q=60&w=3000",
  globalBusiness: "https://images.unsplash.com/photo-1774199102899-db6a49abb42b?auto=format&fit=crop&fm=jpg&ixid=NHwxMJA3fDA%3D&ixlib=rb-4.1.0&q=60&w=3000",
} as const;

export const divisionImages: Record<string, string> = {
  technology: stockImages.technology,
  engineering: stockImages.engineering,
  "renewable-energy": stockImages.renewableEnergy,
  "global-business": stockImages.globalBusiness,
};

export const capabilityImages: Record<string, string> = {
  "residential-construction": "https://images.unsplash.com/photo-1761158497156-c8f202a07b42?auto=format&fit=crop&fm=jpg&ixid=NHwxMJA3fDA%3D&ixlib=rb-4.1.0&q=60&w=3000",
  "commercial-construction": "https://images.unsplash.com/photo-1778961419928-2968ddd57c05?auto=format&fit=crop&fm=jpg&ixid=NHwxMJA3fDA%3D&ixlib=rb-4.1.0&q=60&w=3000",
  "industrial-construction": "https://images.unsplash.com/photo-1761396716215-9ccb2a7eda9d?auto=format&fit=crop&fm=jpg&ixid=NHwxMJA3fDA%3D&ixlib=rb-4.1.0&q=60&w=3000",
};
