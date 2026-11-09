// Temporary illustrative photography from Unsplash. Replace these URLs with approved NSOMEX-owned images when available.
// Each source is published under the Unsplash License; photographer and source-page details are retained for reference.

export const stockImages = {
  // Eric Stoynov — https://unsplash.com/photos/city-buildings-at-dusk-with-illuminated-windows-XVINQJOVpbA
  corporate: "https://images.unsplash.com/photo-1775521206281-758df02df428?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",
  // Eric Stoynov — https://unsplash.com/photos/two-server-racks-filled-with-electronic-components-and-wires-k27hkqXuveo
  technology: "https://images.unsplash.com/photo-1775519520461-6b6e068d9250?auto=format&fit=crop&fm=jpg&ixid=NHwxMjA3fDA%3D&ixlib=rb-4.1.0&q=60&w=3000",
  // Pavel Avakumov — https://unsplash.com/es/fotos/modernos-rascacielos-en-construccion-con-gruas-y-puB7TgIe0
  engineering: "https://images.unsplash.com/photo-1757436382135-5cb8e5cbcda5?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",
  // Sikwe Scarter — https://unsplash.com/photos/rows-of-solar-panels-under-a-cloudy-sky-yJZY4LT0QnM
  renewableEnergy: "https://images.unsplash.com/photo-1771178301028-49a922aefccd?auto=format&fit=crop&fm=jpg&ixid=NHwxMJA3fDA%3D&ixlib=rb-4.1.0&q=60&w=3000",
  // Wolfgang Weiser — https://unsplash.com/photos/cargo-ship-loaded-with-shipping-containers-at-a-port-T2zsJgHKW3U
  globalBusiness: "https://images.unsplash.com/photo-1774199102899-db6a49abb42b?auto=format&fit=crop&fm=jpg&ixid=NHwxMJA3fDA%3D&ixlib=rb-4.1.0&q=60&w=3000",
} as const;

export const divisionImages: Record<string, string> = {
  technology: stockImages.technology,
  engineering: stockImages.engineering,
  "renewable-energy": stockImages.renewableEnergy,
  "global-business": stockImages.globalBusiness,
};
