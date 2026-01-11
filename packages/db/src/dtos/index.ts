import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import * as schema from "../db/schema";

// MVP-1 Vehicle DTOs
export const ZVehicleInsert = createInsertSchema(schema.vehicles, {
  make: z.string().min(1, "Make is required").max(50),
  model: z.string().min(1, "Model is required").max(50),
  year: z
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear() + 1)
    .optional(),
  engineSize: z.string().max(20).optional(),
}).pick({
  make: true,
  model: true,
  year: true,
  vehicleType: true,
  fuelType: true,
  engineSize: true,
});

export const ZVehicleSelect = createSelectSchema(schema.vehicles, {
  id: z.string().uuid(),
});

// MVP-1 Trip Log DTOs
export const ZTripLogInsert = createInsertSchema(schema.tripLogs, {
  vehicleId: z.string().uuid("Invalid vehicle ID"),
  userId: z.string().uuid("Invalid user ID").optional(), // Optional for MVP-1
  startLocation: z.string().min(1, "Start location is required").max(100),
  endLocation: z.string().min(1, "End location is required").max(100),
  country: z.string().min(1, "Country is required").max(50),
  distanceTraveled: z.number().positive("Distance must be positive"),
  fuelUsed: z.number().positive("Fuel used must be positive"),
  fuelEfficiency: z.number().positive("Fuel efficiency must be positive"),
  tripCost: z.number().min(0, "Trip cost cannot be negative"),
}).pick({
  vehicleId: true,
  userId: true,
  startLocation: true,
  endLocation: true,
  country: true,
  distanceTraveled: true,
  fuelUsed: true,
  fuelEfficiency: true,
  tripCost: true,
});

export const ZTripLogSelect = createSelectSchema(schema.tripLogs, {
  id: z.string().uuid(),
  vehicleId: z.string().uuid(),
});

// MVP-1 API Parameter schemas
export const ZTripLogParams = z.object({
  id: z.string().uuid(),
});

export const ZVehicleParams = z.object({
  id: z.string().uuid(),
});

// MVP-1 Query schemas for filtering
export const ZTripLogQuery = z.object({
  vehicleType: z.enum(schema.vehicleTypes).optional(),
  country: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

export const ZVehicleQuery = z.object({
  make: z.string().optional(),
  vehicleType: z.enum(schema.vehicleTypes).optional(),
  fuelType: z.enum(schema.fuelTypes).optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

// Garage DTOs
export const ZGarageInsert = createInsertSchema(schema.garage, {
  userId: z.string().uuid("Invalid user ID"),
  vehicleId: z.string().uuid("Invalid vehicle ID"),
  nickname: z.string().max(50).optional(),
  isPrimary: z.boolean().default(false),
}).pick({
  userId: true,
  vehicleId: true,
  nickname: true,
  isPrimary: true,
});

export const ZGarageSelect = createSelectSchema(schema.garage, {
  id: z.string().uuid(),
  userId: z.string().uuid(),
  vehicleId: z.string().uuid(),
});

export const ZGarageUpdate = createInsertSchema(schema.garage, {
  nickname: z.string().max(50).optional(),
  isPrimary: z.boolean().optional(),
}).pick({
  nickname: true,
  isPrimary: true,
});

// API Parameter schemas for garage
export const ZGarageParams = z.object({
  id: z.string().uuid(),
});

export const ZUserGarageParams = z.object({
  userId: z.string().uuid(),
});

// Query schema for garage with filtering
export const ZGarageQuery = z.object({
  userId: z.string().uuid().optional(),
  vehicleType: z.enum(schema.vehicleTypes).optional(),
  fuelType: z.enum(schema.fuelTypes).optional(),
  isPrimary: z.boolean().optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

// Existing user DTOs
export const ZUserInsert = createInsertSchema(schema.users, {
  email: (schema) => schema.email(),
}).pick({
  name: true,
  email: true,
});

export const ZUserSelect = createSelectSchema(schema.users, {
  id: (schema) => schema.uuid(),
  email: (schema) => schema.email(),
});

export const ZUserByIDParams = z.object({
  id: z.string().uuid(),
});

// Type exports for MVP-1
export type VehicleInsert = z.infer<typeof ZVehicleInsert>;
export type VehicleSelect = z.infer<typeof ZVehicleSelect>;
export type TripLogInsert = z.infer<typeof ZTripLogInsert>;
export type TripLogSelect = z.infer<typeof ZTripLogSelect>;
export type TripLogQuery = z.infer<typeof ZTripLogQuery>;
export type VehicleQuery = z.infer<typeof ZVehicleQuery>;

// Type exports for garage
export type GarageInsert = z.infer<typeof ZGarageInsert>;
export type GarageSelect = z.infer<typeof ZGarageSelect>;
export type GarageUpdate = z.infer<typeof ZGarageUpdate>;
export type GarageQuery = z.infer<typeof ZGarageQuery>;
