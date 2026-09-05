import { buyers } from "@/lib/data/domains";
import { mockGet, mockList } from "@/lib/services/mock-service";

export const userService = {
  list: () => mockList(buyers),
  getById: (id: string) => mockGet(buyers.find((user) => user.id === id), "User"),
};
