export const adminNavigation = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/buyers", label: "Buyers" },
  { href: "/admin/suppliers", label: "Suppliers" },
  { href: "/admin/verifications", label: "Supplier Verification" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/rfqs", label: "RFQs" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/payments", label: "Payments" },
  { href: "/admin/shipments", label: "Shipments" },
  { href: "/admin/disputes", label: "Disputes" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/notifications", label: "Notifications" },
  { href: "/admin/reports", label: "Reports" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/activity", label: "Activity" },
];

export const dashboardMetrics = [
  { label: "Total registered users", value: "128,420", delta: "+8.2%", tone: "indigo" },
  { label: "Total buyers", value: "74,860", delta: "+6.4%", tone: "cyan" },
  { label: "Total suppliers", value: "18,310", delta: "+11.1%", tone: "emerald" },
  { label: "Verified suppliers", value: "13,842", delta: "+7.8%", tone: "violet" },
  { label: "Pending supplier verifications", value: "421", delta: "-3.2%", tone: "amber" },
  { label: "Total products", value: "292,780", delta: "+14.7%", tone: "pink" },
  { label: "Products pending approval", value: "1,143", delta: "+2.4%", tone: "rose" },
  { label: "Active RFQs", value: "4,850", delta: "+9.6%", tone: "sky" },
  { label: "Active orders", value: "21,420", delta: "+5.3%", tone: "teal" },
  { label: "Orders awaiting payment", value: "864", delta: "+1.7%", tone: "orange" },
  { label: "Shipments in transit", value: "3,190", delta: "+4.1%", tone: "blue" },
  { label: "Open disputes", value: "276", delta: "-1.3%", tone: "red" },
];

export const dashboardSeries = {
  userGrowth: [32, 44, 38, 50, 63, 72, 88, 95],
  supplierGrowth: [18, 25, 29, 35, 42, 58, 66, 74],
  productListings: [21, 26, 25, 34, 41, 45, 56, 62],
  orders: [44, 52, 49, 60, 66, 72, 78, 83],
  rfqs: [18, 20, 26, 31, 34, 39, 42, 46],
  revenue: [120, 140, 155, 170, 190, 230, 275, 320],
  marketplaceActivity: [60, 74, 68, 90, 95, 110, 130, 150],
};

export const userRows = [
  { id: "USR-1004", name: "Alicia Morgan", email: "alicia@northstar-industries.com", type: "Supplier", country: "United States", registered: "2024-08-12", status: "Active", verification: "Verified", lastActivity: "2 hours ago" },
  { id: "USR-1048", name: "Ezra Patel", email: "ezra@globaltrade.ai", type: "Buyer", country: "United Arab Emirates", registered: "2025-02-04", status: "Active", verification: "Verified", lastActivity: "14 minutes ago" },
  { id: "USR-1189", name: "Maya Chen", email: "maya@solarex.com", type: "Supplier", country: "Singapore", registered: "2025-04-18", status: "Pending", verification: "Pending", lastActivity: "1 day ago" },
  { id: "USR-1202", name: "Daniel Brooks", email: "daniel@steelbridge.io", type: "Buyer", country: "Canada", registered: "2024-11-30", status: "Suspended", verification: "Verified", lastActivity: "6 days ago" },
  { id: "USR-1291", name: "Lina Mikkelsen", email: "lina@atlaslogistics.no", type: "Admin", country: "Norway", registered: "2023-11-10", status: "Active", verification: "Verified", lastActivity: "4 minutes ago" },
  { id: "USR-1342", name: "Jalal Ahmed", email: "jalal@mechlotus.com", type: "Supplier", country: "Qatar", registered: "2025-06-02", status: "Disabled", verification: "Rejected", lastActivity: "2 weeks ago" },
];

export const buyerRows = [
  { id: "BUY-2041", name: "Nadia Rahman", company: "Falcon Procurement Ltd.", country: "UAE", rfqs: 24, orders: 18, value: "$2.4M", status: "Active", registered: "2024-10-12" },
  { id: "BUY-2087", name: "Mateo Silva", company: "Solstice Build Group", country: "Brazil", rfqs: 31, orders: 22, value: "$3.1M", status: "Active", registered: "2024-07-16" },
  { id: "BUY-2122", name: "Priya Shah", company: "Greenfield Industrial", country: "India", rfqs: 16, orders: 9, value: "$890K", status: "Suspended", registered: "2025-01-09" },
  { id: "BUY-2164", name: "Oliver Payne", company: "Harbor Supply Co.", country: "United Kingdom", rfqs: 13, orders: 7, value: "$620K", status: "Pending", registered: "2025-04-27" },
];

export const supplierRows = [
  { id: "SUP-3012", name: "TerraForce Equipment", company: "TerraForce Equipment Group", country: "China", businessType: "Manufacturer", verification: "Verified", products: 184, orders: 321, rating: "4.9/5", registered: "2023-09-18", status: "Active" },
  { id: "SUP-3039", name: "Vanguard Industrial", company: "Vanguard Industrial Trading", country: "Turkey", businessType: "Trading Company", verification: "Pending", products: 98, orders: 146, rating: "4.6/5", registered: "2025-02-21", status: "Active" },
  { id: "SUP-3071", name: "Northline Metals", company: "Northline Metals LLC", country: "United States", businessType: "Distributor", verification: "Rejected", products: 52, orders: 61, rating: "4.1/5", registered: "2024-11-06", status: "Suspended" },
  { id: "SUP-3116", name: "Apex Engineering Works", company: "Apex Engineering Works", country: "Germany", businessType: "Manufacturer", verification: "Verified", products: 134, orders: 243, rating: "4.8/5", registered: "2024-05-29", status: "Active" },
];

export const verificationRows = [
  { id: "VER-4401", company: "JSK Power Systems", contact: "Haruto Sato", country: "Japan", businessRegistration: "BR-09321", businessLicense: "Valid", factoryInfo: "Osaka - 2,400 sqm", certifications: "ISO 9001/14001", submittedDocs: 6, submittedDate: "2026-08-22", status: "Pending Review" },
  { id: "VER-4408", company: "BluePeak Industrial", contact: "Nora Flem", country: "Belgium", businessRegistration: "BE-11820", businessLicense: "Under review", factoryInfo: "Ghent - 1,800 sqm", certifications: "CE, ISO 45001", submittedDocs: 8, submittedDate: "2026-08-24", status: "Additional Information Required" },
  { id: "VER-4415", company: "Fusion Dynamics Ltd.", contact: "Amina Yusuf", country: "Kenya", businessRegistration: "KE-22844", businessLicense: "Valid", factoryInfo: "Nairobi - 3,100 sqm", certifications: "ISO 9001", submittedDocs: 5, submittedDate: "2026-08-28", status: "Under Review" },
];

export const productRows = [
  { id: "PRD-9001", name: "Diesel Generator 120kVA", supplier: "TerraForce Equipment", category: "Industrial Equipment", price: "$18,200", moq: "4 units", status: "Published", date: "2026-08-29" },
  { id: "PRD-9034", name: "Smart Flow Control Valve", supplier: "Apex Engineering Works", category: "Pipes & Fittings", price: "$1,860", moq: "12 units", status: "Pending Approval", date: "2026-08-30" },
  { id: "PRD-9066", name: "Portable Compressors Kit", supplier: "Northline Metals", category: "Construction Machinery", price: "$6,500", moq: "2 units", status: "Rejected", date: "2026-08-25" },
  { id: "PRD-9108", name: "Heat Exchanger Module", supplier: "Vanguard Industrial", category: "Process Equipment", price: "$4,100", moq: "10 units", status: "Suspended", date: "2026-08-18" },
];

export const categoryRows = [
  { name: "Industrial Equipment", parent: "Root", products: 24, status: "Enabled" },
  { name: "Generators", parent: "Industrial Equipment", products: 144, status: "Enabled" },
  { name: "Diesel Generators", parent: "Generators", products: 91, status: "Enabled" },
  { name: "Pipes & Fittings", parent: "Root", products: 168, status: "Disabled" },
  { name: "Process Equipment", parent: "Industrial Equipment", products: 132, status: "Enabled" },
];

export const rfqRows = [
  { id: "RFQ-2201", title: "Industrial Boiler Upgrade", buyer: "Falcon Procurement", category: "Power Equipment", quantity: "18 units", responses: 7, date: "2026-08-27", status: "Receiving Quotes" },
  { id: "RFQ-2214", title: "Container Handling Gear", buyer: "Harbor Supply", category: "Logistics", quantity: "120 sets", responses: 4, date: "2026-08-21", status: "Negotiating" },
  { id: "RFQ-2248", title: "Water Treatment Filters", buyer: "Greenfield Industrial", category: "Utilities", quantity: "61 units", responses: 9, date: "2026-08-18", status: "Published" },
  { id: "RFQ-2275", title: "Safety Kit Bulk Order", buyer: "Atlas Infrastructure", category: "Safety", quantity: "200 packs", responses: 2, date: "2026-08-10", status: "Closed" },
];

export const orderRows = [
  { id: "ORD-8012", buyer: "Falcon Procurement", supplier: "TerraForce Equipment", amount: "$184,200", paymentStatus: "Paid", orderStatus: "Processing", shippingStatus: "In Transit", date: "2026-08-26" },
  { id: "ORD-8067", buyer: "Greenfield Industrial", supplier: "Apex Engineering Works", amount: "$47,900", paymentStatus: "Pending", orderStatus: "Awaiting Payment", shippingStatus: "Preparing", date: "2026-08-27" },
  { id: "ORD-8124", buyer: "Solstice Build Group", supplier: "Northline Metals", amount: "$91,430", paymentStatus: "Paid", orderStatus: "Completed", shippingStatus: "Delivered", date: "2026-08-22" },
  { id: "ORD-8178", buyer: "Harbor Supply", supplier: "Vanguard Industrial", amount: "$28,700", paymentStatus: "Under Review", orderStatus: "Disputed", shippingStatus: "Customs", date: "2026-08-20" },
];

export const paymentRows = [
  { id: "PAY-97210", order: "ORD-8012", buyer: "Falcon Procurement", supplier: "TerraForce Equipment", amount: "$184,200", currency: "USD", method: "Bank Transfer", status: "Paid", date: "2026-08-26" },
  { id: "PAY-97245", order: "ORD-8067", buyer: "Greenfield Industrial", supplier: "Apex Engineering Works", amount: "$47,900", currency: "USD", method: "Credit Card", status: "Pending", date: "2026-08-27" },
  { id: "PAY-97311", order: "ORD-8178", buyer: "Harbor Supply", supplier: "Vanguard Industrial", amount: "$28,700", currency: "USD", method: "Wire", status: "Under Review", date: "2026-08-20" },
  { id: "PAY-97382", order: "ORD-8124", buyer: "Solstice Build Group", supplier: "Northline Metals", amount: "$91,430", currency: "USD", method: "L/C", status: "Refunded", date: "2026-08-22" },
];

export const shipmentRows = [
  { id: "SHP-5591", order: "ORD-8012", supplier: "TerraForce Equipment", buyer: "Falcon Procurement", origin: "Shanghai", destination: "Jebel Ali", carrier: "Maersk", status: "In Transit", eta: "2026-09-04" },
  { id: "SHP-5604", order: "ORD-8067", supplier: "Apex Engineering Works", buyer: "Greenfield Industrial", origin: "Düsseldorf", destination: "Mumbai", carrier: "DHL", status: "Preparing", eta: "2026-09-06" },
  { id: "SHP-5622", order: "ORD-8178", supplier: "Vanguard Industrial", buyer: "Harbor Supply", origin: "Singapore", destination: "Rotterdam", carrier: "CMA CGM", status: "Customs", eta: "2026-09-11" },
  { id: "SHP-5648", order: "ORD-8124", supplier: "Northline Metals", buyer: "Solstice Build Group", origin: "Houston", destination: "Santos", carrier: "COSCO", status: "Delivered", eta: "2026-08-21" },
];

export const disputeRows = [
  { id: "DSP-1102", order: "ORD-8178", buyer: "Harbor Supply", supplier: "Vanguard Industrial", issue: "Late shipment and damaged packaging", date: "2026-08-20", status: "Under Review" },
  { id: "DSP-1109", order: "ORD-8034", buyer: "Jetstream Energy", supplier: "Miro Forge", issue: "Product spec mismatch", date: "2026-08-19", status: "Waiting for Supplier" },
  { id: "DSP-1118", order: "ORD-7909", buyer: "Blue Harbor Logistics", supplier: "VeloTech", issue: "Payment hold request", date: "2026-08-09", status: "Resolved" },
];

export const reviewRows = [
  { id: "REV-9201", type: "Product", rating: "4.8", status: "Approved", reported: "No", reviewer: "Alicia Evans" },
  { id: "REV-9234", type: "Supplier", rating: "3.7", status: "Hidden", reported: "Yes", reviewer: "Jonathan Wu" },
  { id: "REV-9288", type: "Buyer", rating: "5.0", status: "Investigating", reported: "Yes", reviewer: "Mila Russian" },
];

export const messageThreads = [
  { id: "MSG-100", people: "Falcon Procurement / TerraForce", type: "Buyer conversation", related: "RFQ-2201", status: "Open" },
  { id: "MSG-122", people: "Apex Engineering / Support Desk", type: "Supplier conversation", related: "Order ORD-8067", status: "Resolved" },
  { id: "MSG-145", people: "Buyer support / Harbor Supply", type: "Dispute conversation", related: "DSP-1102", status: "Pending" },
];

export const notificationRows = [
  { id: "NOT-55", title: "Maintenance announcement", type: "Platform", date: "2026-08-30", status: "Scheduled" },
  { id: "NOT-59", title: "Supplier verification update", type: "Supplier", date: "2026-08-29", status: "Published" },
  { id: "NOT-64", title: "Marketplace announcement", type: "Marketing", date: "2026-08-28", status: "Draft" },
  { id: "NOT-72", title: "Security notification", type: "Security", date: "2026-08-27", status: "Published" },
];

export const reportSummary = [
  { label: "Sales report", value: "$16.4M" },
  { label: "Order report", value: "2,146" },
  { label: "Supplier report", value: "1,860" },
  { label: "Buyer report", value: "7,424" },
  { label: "Product report", value: "18,320" },
  { label: "RFQ report", value: "4,850" },
  { label: "Revenue report", value: "$3.2M" },
  { label: "Logistics report", value: "3,190" },
  { label: "Dispute report", value: "276" },
];

export const activityRows = [
  { admin: "Lina Mikkelsen", action: "Supplier verification approved", resource: "VER-4401", date: "2026-08-30 09:40", device: "Chrome / Windows", status: "Success" },
  { admin: "Otis Branch", action: "Product rejected", resource: "PRD-9066", date: "2026-08-30 08:12", device: "Safari / iPad", status: "Completed" },
  { admin: "Aisha Kline", action: "User suspended", resource: "USR-1202", date: "2026-08-29 18:55", device: "Edge / Windows", status: "Flagged" },
  { admin: "Jin Park", action: "Order status updated", resource: "ORD-8178", date: "2026-08-29 16:20", device: "Chrome / Android", status: "Updated" },
];

export const adminOverview = {
  revenueOverview: "$2.4M",
  revenueChange: "+18.2% vs. previous period",
  activityRate: "86%",
  uptime: "99.94%",
};
