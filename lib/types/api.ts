export type ApiErrorCode = "VALIDATION" | "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "NETWORK" | "SERVER";

export interface ApiError { code: ApiErrorCode; message: string; field?: string; }
export type ApiResult<T> = { data: T; error: null } | { data: null; error: ApiError };

export const ok = <T>(data: T): ApiResult<T> => ({ data, error: null });
export const fail = (error: ApiError): ApiResult<never> => ({ data: null, error });
