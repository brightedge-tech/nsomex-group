export type UserRole = "guest" | "buyer" | "supplier" | "admin";
export type AccountStatus = "active" | "pending" | "suspended" | "disabled";
export type VerificationStatus = "not_started" | "incomplete" | "submitted" | "under_review" | "additional_information_required" | "verified" | "rejected";

export interface User {
  id: string;
  role: Exclude<UserRole, "guest">;
  name: string;
  email: string;
  phone?: string;
  country: string;
  company: string;
  status: AccountStatus;
  verificationStatus: VerificationStatus;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  supplierId: string;
  images: string[];
  description: string;
  specifications: Record<string, string>;
  price: number | null;
  currency: string;
  moq: number;
  availability: number;
  status: "draft" | "pending" | "published" | "suspended";
}

export interface Supplier {
  id: string;
  companyName: string;
  slug: string;
  logo?: string;
  country: string;
  businessType: string;
  verified: boolean;
  verificationStatus: VerificationStatus;
  certifications: string[];
  products: string[];
}

export interface RFQ {
  id: string;
  buyerId: string;
  title: string;
  category: string;
  quantity: number;
  requirements: string;
  destination: string;
  status: "draft" | "published" | "receiving_quotes" | "negotiating" | "closed";
  deadline: string;
  responses: string[];
}

export interface Quote {
  id: string;
  rfqId: string;
  supplierId: string;
  amount: number;
  currency: string;
  leadTime: string;
  status: "submitted" | "shortlisted" | "accepted" | "rejected";
}

export interface OrderLine {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  buyerId: string;
  supplierId: string;
  products: OrderLine[];
  amount: number;
  currency: string;
  paymentStatus: "pending" | "paid" | "refunded" | "under_review";
  orderStatus: "awaiting_payment" | "processing" | "completed" | "cancelled" | "disputed";
  shippingStatus: "preparing" | "in_transit" | "customs" | "delivered";
}

export interface TrackingEvent { status: string; location: string; timestamp: string; }
export interface Shipment {
  id: string;
  orderId: string;
  trackingNumber: string;
  carrier: string;
  origin: string;
  destination: string;
  status: "preparing" | "in_transit" | "customs" | "delivered";
  estimatedDelivery: string;
  trackingEvents: TrackingEvent[];
}

export interface Message { id: string; threadId: string; senderId: string; body: string; createdAt: string; read: boolean; }
export interface Notification { id: string; userId: string; title: string; body: string; read: boolean; createdAt: string; }
export interface Review { id: string; authorId: string; subjectId: string; rating: number; body: string; status: "pending" | "published" | "hidden"; }
export interface Dispute { id: string; orderId: string; openedBy: string; issue: string; description: string; status: "open" | "under_review" | "resolved" | "rejected"; }
export interface Document { id: string; ownerId: string; name: string; type: string; url?: string; status: "pending" | "approved" | "rejected"; }
