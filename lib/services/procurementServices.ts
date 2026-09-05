import { mockDisputes, mockNotifications, mockRfqs, mockShipments, orders, quotes } from "@/lib/data/domains";
import { mockGet, mockList } from "@/lib/services/mock-service";
export const rfqService = { list: () => mockList(mockRfqs), getById: (id: string) => mockGet(mockRfqs.find((item) => item.id === id), "RFQ") };
export const quoteService = { list: () => mockList(quotes) };
export const orderService = { list: () => mockList(orders), getById: (id: string) => mockGet(orders.find((item) => item.id === id), "Order") };
export const shipmentService = { list: () => mockList(mockShipments), getById: (id: string) => mockGet(mockShipments.find((item) => item.id === id || item.orderId === id), "Shipment") };
export const notificationService = { list: () => mockList(mockNotifications) };
export const disputeService = { list: () => mockList(mockDisputes) };
