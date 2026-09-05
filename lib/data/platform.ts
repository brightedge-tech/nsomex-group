export const buyer = {
  name: "Amara Okafor",
  role: "Procurement manager",
  company: "Meridian Infrastructure Group",
  country: "Nigeria",
  completeness: 82,
};

export const inquiries = [
  { id: "inq-204", title: "125 kW solar inverter package", supplier: "SolarTech Africa", status: "Receiving Quotes", date: "02 Sep 2026", responses: 4 },
  { id: "inq-203", title: "Hydraulic excavator fleet", supplier: "BuildWorks Ltd", status: "Negotiating", date: "28 Aug 2026", responses: 2 },
  { id: "inq-201", title: "Industrial filtration system", supplier: "PureWater Co", status: "Closed", date: "19 Aug 2026", responses: 6 },
];

export const orders = [
  { id: "NSX-1048", title: "Industrial Solar Inverter", supplier: "SolarTech Africa", status: "In production", amount: "$24,800", date: "01 Sep 2026" },
  { id: "NSX-1039", title: "Edge Gateway X1", supplier: "IoT Hub Ltd", status: "Shipped", amount: "$12,000", date: "24 Aug 2026" },
];

export const messages = [
  { id: "conv-1", name: "SolarTech Africa", product: "Industrial Solar Inverter", preview: "The revised specification sheet is ready.", time: "09:42", online: true },
  { id: "conv-2", name: "BuildWorks Ltd", product: "Hydraulic Excavator 320", preview: "We can confirm delivery for October.", time: "Yesterday", online: false },
  { id: "conv-3", name: "PureWater Co", product: "Water Filtration Unit Model A", preview: "Would you like the commissioning option included?", time: "Mon", online: true },
];

export const notifications = [
  { id: "n-1", title: "New supplier response", body: "SolarTech Africa replied to your inverter inquiry.", time: "12 min ago", unread: true },
  { id: "n-2", title: "Order update", body: "Order NSX-1048 moved to In production.", time: "2 hours ago", unread: true },
  { id: "n-3", title: "New message", body: "PureWater Co sent you a message.", time: "Yesterday", unread: false },
  { id: "n-4", title: "Verification update", body: "Your buyer profile is 82% complete.", time: "2 days ago", unread: false },
];

export const supplierStats = [
  { label: "Total products", value: "28", detail: "+4 this month" },
  { label: "Active products", value: "24", detail: "86% of catalog" },
  { label: "New inquiries", value: "17", detail: "5 need attention" },
  { label: "Pending RFQs", value: "8", detail: "$184k potential" },
];

export const supplierInquiries = [
  { title: "125 kW solar inverter package", buyer: "Meridian Infrastructure Group", status: "New", date: "Today", value: "$24,800" },
  { title: "Remote gateway deployment", buyer: "Kivu Telecom", status: "Responded", date: "Yesterday", value: "$12,000" },
  { title: "Quarry crusher replacement", buyer: "Atlas Aggregates", status: "Negotiating", date: "28 Aug 2026", value: "$96,000" },
];

export const verificationItems = [
  { label: "Company information", status: "Verified" },
  { label: "Business registration", status: "Pending Review" },
  { label: "Business license", status: "Requires Additional Information" },
  { label: "Identity verification", status: "Not Started" },
  { label: "Factory information", status: "Verified" },
  { label: "Certifications", status: "Pending Review" },
];

export const rfqs = [
  { id: "rfq-204", title: "125 kW solar inverter package", status: "Receiving Quotes", date: "02 Sep 2026", responses: 4, deadline: "20 Sep 2026", destination: "Lagos, Nigeria", quantity: "12 units" },
  { id: "rfq-203", title: "Hydraulic excavator fleet", status: "Negotiating", date: "28 Aug 2026", responses: 2, deadline: "15 Sep 2026", destination: "Nairobi, Kenya", quantity: "4 units" },
  { id: "rfq-202", title: "Industrial water treatment system", status: "Draft", date: "25 Aug 2026", responses: 0, deadline: "30 Sep 2026", destination: "Abuja, Nigeria", quantity: "1 system" },
];

export const quotations = [
  { supplier: "SolarTech Africa", amount: "$24,800", leadTime: "6 weeks", status: "Shortlisted", verified: true },
  { supplier: "SunGrid Engineering", amount: "$26,100", leadTime: "8 weeks", status: "Under review", verified: true },
];
