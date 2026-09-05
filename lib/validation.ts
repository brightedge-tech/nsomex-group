import { z } from "zod";

export const loginSchema = z.object({ email: z.email("Enter a valid email address"), password: z.string().min(6, "Password must be at least 6 characters") });
export const registrationSchema = z.object({ name: z.string().trim().min(2, "Enter your name"), email: z.email("Enter a valid email address"), company: z.string().trim().min(2, "Enter your company"), country: z.string().trim().min(2, "Select your country"), password: z.string().min(6, "Password must be at least 6 characters") });
export const rfqSchema = z.object({ title: z.string().trim().min(3), quantity: z.coerce.number().positive(), destination: z.string().trim().min(2), requirements: z.string().trim().min(10) });
export const reviewSchema = z.object({ rating: z.number().int().min(1).max(5), body: z.string().trim().min(3) });
