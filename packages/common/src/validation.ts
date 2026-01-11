import { z } from "zod";

// Sanitization helpers
export const sanitizers = {
  email: (email: string) => email.toLowerCase().trim(),
  slug: (str: string) =>
    str
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-"),
  phone: (phone: string) => phone.replace(/\D/g, ""),
  url: (url: string) => url.trim().replace(/\/$/, ""),
};

// Common validation schemas
export const commonSchemas = {
  uuid: z.string().uuid(),

  email: z.string().email().transform(sanitizers.email),

  pagination: z.object({
    limit: z.coerce.number().min(1).max(100).default(20),
    offset: z.coerce.number().min(0).default(0),
    page: z.coerce.number().min(1).default(1),
  }),

  dateRange: z
    .object({
      from: z.coerce.date(),
      to: z.coerce.date(),
    })
    .refine((data) => data.from < data.to, {
      message: "'from' date must be before 'to' date",
    }),

  slug: z.string().min(1).transform(sanitizers.slug),

  url: z.string().url().transform(sanitizers.url),

  phoneNumber: z
    .string()
    .transform(sanitizers.phone)
    .refine((phone) => phone.length >= 10 && phone.length <= 15, {
      message: "Invalid phone number",
    }),
};

// Schema composition helpers
export const withTimestamps = <T extends z.ZodRawShape>(
  schema: z.ZodObject<T>
) => {
  return schema.extend({
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  });
};

export const withPagination = <T extends z.ZodRawShape>(
  schema: z.ZodObject<T>
) => {
  return schema.extend({
    limit: z.coerce.number().min(1).max(100).default(20),
    offset: z.coerce.number().min(0).default(0),
  });
};

