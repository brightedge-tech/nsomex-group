import type { Document, Message, Review } from "@/lib/types/domain";
import { messages, reviews } from "@/lib/data/domains";
import { mockCreate, mockList } from "@/lib/services/mock-service";

export const paymentService = {
  createCheckout: async (orderId: string) => mockCreate({ orderId, status: "pending" as const }),
};

export const messageService = {
  list: () => mockList<Message>(messages),
};

export const reviewService = {
  list: () => mockList<Review>(reviews),
};

export const fileService = {
  prepareUpload: async (file: Pick<Document, "name" | "type">) => mockCreate({ ...file, status: "pending" as const }),
};
