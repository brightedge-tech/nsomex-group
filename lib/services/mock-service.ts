import type { ApiResult } from "@/lib/types/api";
import { fail, ok } from "@/lib/types/api";

export async function mockList<T>(items: T[]): Promise<ApiResult<T[]>> { return ok(items); }
export async function mockGet<T>(item: T | undefined, label = "Record"): Promise<ApiResult<T>> { return item === undefined ? fail({ code: "NOT_FOUND", message: `${label} not found.` }) : ok(item); }
export async function mockCreate<T>(item: T): Promise<ApiResult<T>> { return ok(item); }
