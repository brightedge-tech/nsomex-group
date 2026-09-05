import { buyer, inquiries as legacyInquiries, orders as legacyOrders, rfqs, quotations, notifications } from "@/lib/data/platform";
import { getProduct, getSupplier } from "@/lib/data/marketplace";

export const procurementInquiries = [
  { id: "inq-204", productId: "p-1001", product: "Industrial Solar Inverter", supplier: "SolarTech Africa", quantity: "12 units", targetPrice: "$23,500", quotedPrice: "$24,800", status: "Quotation Received", lastMessage: "The revised specification sheet is ready.", date: "02 Sep 2026" },
  { id: "inq-203", productId: "p-1002", product: "Hydraulic Excavator 320", supplier: "BuildWorks Ltd", quantity: "4 units", targetPrice: "$80,000", quotedPrice: "$85,000", status: "Negotiating", lastMessage: "We can confirm delivery for October.", date: "28 Aug 2026" },
  { id: "inq-201", productId: "p-1003", product: "Water Filtration Unit Model A", supplier: "PureWater Co", quantity: "1 system", targetPrice: "$42,000", quotedPrice: "$44,500", status: "Accepted", lastMessage: "Commissioning option included.", date: "19 Aug 2026" },
];

export const procurementQuotations = [
  { id: "quote-901", rfqId: "rfq-204", supplier: "SolarTech Africa", product: "Industrial Solar Inverter", buyer: buyer.company, quantity: "12 units", targetPrice: "$23,500", supplierPrice: "$24,800", moq: "1 unit", leadTime: "6 weeks", shippingTerms: "FOB Johannesburg", paymentTerms: "30% deposit, 70% before dispatch", status: "Shortlisted", message: "Includes commissioning support and five-year warranty.", verified: true },
  { id: "quote-902", rfqId: "rfq-204", supplier: "SunGrid Engineering", product: "Industrial Solar Inverter", buyer: buyer.company, quantity: "12 units", targetPrice: "$23,500", supplierPrice: "$26,100", moq: "2 units", leadTime: "8 weeks", shippingTerms: "CIF Lagos", paymentTerms: "50% deposit, balance on shipment", status: "Under review", message: "Alternative delivery schedule available.", verified: true },
];

export const procurementOrders = [
  { id: "NSX-1048", inquiryId: "inq-204", productId: "p-1001", product: "Industrial Solar Inverter", supplier: "SolarTech Africa", quantity: "12 units", unitPrice: "$2,066.67", subtotal: "$24,800", shipping: "$1,250", serviceFee: "$260", total: "$26,310", date: "01 Sep 2026", paymentStatus: "Pending payment", status: "Production", buyer: buyer.company, destination: "Lagos, Nigeria", shippingMethod: "Sea freight", estimatedDelivery: "18 Oct 2026" },
  { id: "NSX-1039", inquiryId: "inq-203", productId: "p-1004", product: "Edge Gateway X1", supplier: "IoT Hub Ltd", quantity: "10 units", unitPrice: "$1,200", subtotal: "$12,000", shipping: "$480", serviceFee: "$125", total: "$12,605", date: "24 Aug 2026", paymentStatus: "Paid", status: "In Transit", buyer: buyer.company, destination: "Lagos, Nigeria", shippingMethod: "Air freight", estimatedDelivery: "12 Sep 2026" },
  { id: "NSX-1028", inquiryId: "inq-201", productId: "p-1003", product: "Water Filtration Unit Model A", supplier: "PureWater Co", quantity: "1 system", unitPrice: "$44,500", subtotal: "$44,500", shipping: "$2,100", serviceFee: "$466", total: "$47,066", date: "05 Aug 2026", paymentStatus: "Paid", status: "Completed", buyer: buyer.company, destination: "Abuja, Nigeria", shippingMethod: "Flat-rack sea freight", estimatedDelivery: "28 Aug 2026" },
];

export const shipments = [
  { id: "SHP-7781", orderId: "NSX-1039", shipmentNumber: "NSX-AF-1039", carrier: "DHL Global Forwarding", origin: "Cairo, Egypt", destination: "Lagos, Nigeria", currentLocation: "Port of Valencia, Spain", estimatedDelivery: "12 Sep 2026", status: "In Transit", date: "28 Aug 2026", supplier: "IoT Hub Ltd", tracking: ["Order Confirmed", "Cargo Prepared", "Picked Up", "Export Processing", "Departed Origin", "In Transit", "Arrived Destination", "Customs", "Out for Delivery", "Delivered"], currentStep: 5 },
  { id: "SHP-7764", orderId: "NSX-1048", shipmentNumber: "NSX-SF-1048", carrier: "Maersk Logistics", origin: "Johannesburg, South Africa", destination: "Lagos, Nigeria", currentLocation: "Johannesburg warehouse", estimatedDelivery: "18 Oct 2026", status: "Cargo Prepared", date: "03 Sep 2026", supplier: "SolarTech Africa", tracking: ["Order Confirmed", "Cargo Prepared", "Picked Up", "Export Processing", "Departed Origin", "In Transit", "Arrived Destination", "Customs", "Out for Delivery", "Delivered"], currentStep: 1 },
  { id: "SHP-7702", orderId: "NSX-1028", shipmentNumber: "NSX-PW-1028", carrier: "CMA CGM", origin: "Lagos, Nigeria", destination: "Abuja, Nigeria", currentLocation: "Abuja distribution hub", estimatedDelivery: "28 Aug 2026", status: "Delivered", date: "22 Aug 2026", supplier: "PureWater Co", tracking: ["Order Confirmed", "Cargo Prepared", "Picked Up", "Export Processing", "Departed Origin", "In Transit", "Arrived Destination", "Customs", "Out for Delivery", "Delivered"], currentStep: 9 },
];

export const disputes = [
  { id: "DSP-1001", orderId: "NSX-1028", issue: "Damaged goods", description: "One membrane housing arrived with visible impact damage.", resolution: "Replacement parts", status: "Under Review", date: "30 Aug 2026" },
];

export const procurementNotifications = [
  ...notifications,
  { id: "n-5", title: "Payment pending", body: "Order NSX-1048 is ready for payment review.", time: "Today", unread: true },
  { id: "n-6", title: "Shipment in transit", body: "Shipment NSX-AF-1039 departed origin.", time: "Yesterday", unread: false },
  { id: "n-7", title: "Delivery completed", body: "Order NSX-1028 was delivered.", time: "28 Aug 2026", unread: false },
];

export const procurementSummary = {
  openRfqs: rfqs.filter((item) => item.status !== "Draft").length,
  supplierResponses: procurementQuotations.length,
  pendingOrders: procurementOrders.filter((item) => item.paymentStatus.includes("Pending")).length,
  inProduction: procurementOrders.filter((item) => item.status === "Production").length,
  inTransit: shipments.filter((item) => item.status === "In Transit").length,
  completed: procurementOrders.filter((item) => item.status === "Completed").length,
};

export function getProcurementOrder(id: string) { return procurementOrders.find((order) => order.id === id); }
export function getShipment(id: string) { return shipments.find((shipment) => shipment.id === id || shipment.orderId === id || shipment.shipmentNumber === id); }
export function getDispute(id: string) { return disputes.find((dispute) => dispute.id === id); }
export function getProductForInquiry(id: string) { const inquiry = procurementInquiries.find((item) => item.id === id); return inquiry ? getProduct(inquiry.productId) : undefined; }
export function getSupplierForOrder(id: string) { const order = getProcurementOrder(id); return order ? getSupplier(order.supplier.toLowerCase().replace(/\s+/g, "-")) : undefined; }

export { buyer, legacyInquiries, legacyOrders };
