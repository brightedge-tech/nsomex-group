export type Supplier = {
  id: string;
  name: string;
  slug: string;
  location: string;
  verified: boolean;
  rating: number;
  yearsInBusiness: number;
  description: string;
  certifications: string[];
  factory: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  description: string;
  price: string;
  moq: string;
  availableQuantity: string;
  location: string;
  verified: boolean;
  rating: number;
  sku: string;
  applications: string[];
  shipping: string;
  specifications: { label: string; value: string }[];
  supplier: Supplier;
  images: string[];
};

export const categories = [
  { slug: "industrial-equipment", title: "Industrial Equipment" },
  { slug: "construction-equipment", title: "Construction Equipment" },
  { slug: "mining-equipment", title: "Mining Equipment" },
  { slug: "renewable-energy", title: "Renewable Energy" },
  { slug: "electrical-equipment", title: "Electrical Equipment" },
  { slug: "security-surveillance", title: "Security & Surveillance" },
  { slug: "automotive-parts", title: "Automotive Parts" },
  { slug: "tools-hardware", title: "Tools & Hardware" },
];

const suppliers: Supplier[] = [
  { id: "s-201", name: "SolarTech Africa", slug: "solartech-africa", location: "Johannesburg, South Africa", verified: true, rating: 4.8, yearsInBusiness: 12, description: "Engineering and manufacturing partner for commercial solar infrastructure across Africa.", certifications: ["ISO 9001", "IEC 62109", "SABS Certified"], factory: "12,000 m2 power electronics facility with in-house testing laboratory." },
  { id: "s-202", name: "BuildWorks Ltd", slug: "buildworks-ltd", location: "Nairobi, Kenya", verified: true, rating: 4.6, yearsInBusiness: 18, description: "Heavy equipment distributor and service partner for civil construction projects.", certifications: ["ISO 9001", "OEM Authorized Dealer"], factory: "Regional equipment yard with parts warehouse and service bays." },
  { id: "s-203", name: "PureWater Co", slug: "purewater-co", location: "Lagos, Nigeria", verified: true, rating: 4.9, yearsInBusiness: 9, description: "Modular water treatment manufacturer serving municipal and industrial customers.", certifications: ["ISO 14001", "NSF Certified"], factory: "Fabrication and membrane assembly plant with water quality testing." },
  { id: "s-204", name: "IoT Hub Ltd", slug: "iot-hub-ltd", location: "Cairo, Egypt", verified: false, rating: 4.4, yearsInBusiness: 7, description: "Industrial connectivity specialist building rugged edge computing systems.", certifications: ["CE", "FCC"], factory: "Electronics integration and device validation workshop." },
  { id: "s-205", name: "MineEquip", slug: "mineequip", location: "Accra, Ghana", verified: true, rating: 4.7, yearsInBusiness: 21, description: "Mining equipment supplier supporting quarrying and mineral processing operations.", certifications: ["ISO 9001", "CE"], factory: "Heavy fabrication yard with machining, assembly and field service teams." },
];

const makeProduct = (details: Omit<Product, "supplier" | "images"> & { supplierId: string }): Product => ({
  ...details,
  supplier: suppliers.find((supplier) => supplier.id === details.supplierId)!,
  images: ["Primary product view", "Technical detail", "Factory-ready configuration"],
});

export const products: Product[] = [
  makeProduct({ id: "p-1001", name: "Industrial Solar Inverter", slug: "industrial-solar-inverter", category: "Renewable Energy", categorySlug: "renewable-energy", description: "High-efficiency three-phase inverter for large-scale solar installations.", price: "Request Quote", moq: "1 unit", availableQuantity: "48 units available", location: "South Africa", verified: true, rating: 4.8, sku: "STA-INV-125K", applications: ["Commercial solar farms", "Industrial microgrids", "Backup power systems"], shipping: "FOB Johannesburg; export packing available.", specifications: [{ label: "Rated power", value: "125 kW" }, { label: "Efficiency", value: "98.6% maximum" }, { label: "Warranty", value: "5 years" }], supplierId: "s-201" }),
  makeProduct({ id: "p-1002", name: "Hydraulic Excavator 320", slug: "hydraulic-excavator-320", category: "Construction Equipment", categorySlug: "construction-equipment", description: "Medium-duty hydraulic excavator for earthmoving and civil works.", price: "$85,000", moq: "1 unit", availableQuantity: "6 units available", location: "Kenya", verified: true, rating: 4.6, sku: "BWL-HEX-320", applications: ["Earthmoving", "Road construction", "Quarry operations"], shipping: "Delivered to Nairobi; regional freight quoted on request.", specifications: [{ label: "Operating weight", value: "21.5 tonnes" }, { label: "Bucket capacity", value: "1.0 m3" }, { label: "Engine", value: "122 kW diesel" }], supplierId: "s-202" }),
  makeProduct({ id: "p-1003", name: "Water Filtration Unit Model A", slug: "water-filtration-unit-model-a", category: "Industrial Equipment", categorySlug: "industrial-equipment", description: "Compact modular water filtration for rural communities and industrial process water.", price: "Request Quote", moq: "1 system", availableQuantity: "15 systems available", location: "Nigeria", verified: true, rating: 4.9, sku: "PWC-MF-A-500", applications: ["Drinking water", "Industrial process water", "Remote communities"], shipping: "Modular flat-rack shipping available from Lagos.", specifications: [{ label: "Capacity", value: "500,000 litres/day" }, { label: "Footprint", value: "12 m x 4 m" }, { label: "Commissioning", value: "Included" }], supplierId: "s-203" }),
  makeProduct({ id: "p-1004", name: "Edge Gateway X1", slug: "edge-gateway-x1", category: "Electrical Equipment", categorySlug: "electrical-equipment", description: "Rugged edge gateway for industrial IoT use cases.", price: "$1,200", moq: "10 units", availableQuantity: "120 units available", location: "Egypt", verified: false, rating: 4.4, sku: "IOT-X1-EDGE", applications: ["Factory monitoring", "Fleet telemetry", "Remote asset management"], shipping: "DHL and sea freight options from Cairo.", specifications: [{ label: "Connectivity", value: "4G, Ethernet, Wi-Fi" }, { label: "Operating range", value: "-20 to 60 C" }, { label: "Ingress protection", value: "IP65" }], supplierId: "s-204" }),
  makeProduct({ id: "p-1005", name: "Mining Crusher 5000", slug: "mining-crusher-5000", category: "Mining Equipment", categorySlug: "mining-equipment", description: "High-capacity crusher for mining operations.", price: "Request Quote", moq: "1 unit", availableQuantity: "3 units available", location: "Ghana", verified: true, rating: 4.7, sku: "ME-C5000-JAW", applications: ["Hard rock processing", "Aggregate production", "Quarrying"], shipping: "Project logistics and site delivery available.", specifications: [{ label: "Throughput", value: "400 tonnes/hour" }, { label: "Feed opening", value: "1,200 x 800 mm" }, { label: "Drive", value: "250 kW" }], supplierId: "s-205" }),
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug || product.id === slug);
}

export function getSupplier(slug: string) {
  return suppliers.find((supplier) => supplier.slug === slug || supplier.id === slug);
}

export function getProductsByCategory(slug: string) {
  return products.filter((product) => product.categorySlug === slug);
}
