import { type SQL, sql } from "drizzle-orm";
import {
  type AnySQLiteColumn,
  integer,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import * as auth from "./auth";

const currentTimestamp = () => sql`(CURRENT_TIMESTAMP)`;

/**
 * TODO: REPLACE THIS WITH THE ACTUAL SCHEMA
 *
 * INSERT YOUR CUSTOM BUSINESS LOGIC SCHEMA AFTER THIS COMMENT
 */

const lower = (email: AnySQLiteColumn): SQL => sql`lower(${email})`;

// Vehicle types enum for filtering
export const vehicleTypes = [
  "sedan",
  "suv",
  "hatchback",
  "pickup",
  "van",
  "coupe",
  "convertible",
  "wagon",
  "other",
] as const;

export const fuelTypes = [
  "gasoline",
  "diesel",
  "electric",
  "hybrid",
  "plug-in-hybrid",
] as const;

// MVP-1 Entities

/**
 * Vehicles table for storing vehicle information
 * Used for filtering and trip logging
 */
export const vehicles = sqliteTable("vehicles", {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  make: text().notNull(), // e.g., "Toyota", "Honda"
  model: text().notNull(), // e.g., "Camry", "Accord"
  year: integer(), // e.g., 2023
  vehicleType: text({ enum: vehicleTypes }).notNull().default("sedan"),
  fuelType: text({ enum: fuelTypes }).notNull().default("gasoline"),
  engineSize: text(), // e.g., "2.0L", "3.5L V6"
  createdAt: text().notNull().default(currentTimestamp()),
});

/**
 * Trip logs table for MVP-1 basic trip logging
 * No user authentication required for MVP-1, but ready for future phases
 */
export const tripLogs = sqliteTable("trip_logs", {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  vehicleId: text()
    .references(() => vehicles.id)
    .notNull(),

  // Optional user reference for authenticated users (future phases)
  userId: text().references(() => auth.user.id, { onDelete: "set null" }),

  // Trip details
  startLocation: text().notNull(), // e.g., "New York, NY"
  endLocation: text().notNull(), // e.g., "Boston, MA"
  country: text().notNull(), // e.g., "United States"

  // Fuel efficiency data
  distanceTraveled: real().notNull(), // in miles
  fuelUsed: real().notNull(), // in gallons (or kWh for electric)
  fuelEfficiency: real().notNull(), // calculated MPG (or miles/kWh)

  // Cost information
  tripCost: real().notNull(), // total fuel cost

  // Metadata
  createdAt: text().notNull().default(currentTimestamp()),
  updatedAt: text().notNull().default(currentTimestamp()),
});

/**
 * Garage table - junction table linking users to vehicles they've driven
 * Tracks the many-to-many relationship between users and vehicles
 */
export const garage = sqliteTable(
  "garage",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text()
      .references(() => auth.user.id, { onDelete: "cascade" })
      .notNull(),
    vehicleId: text()
      .references(() => vehicles.id, { onDelete: "cascade" })
      .notNull(),

    // When they first drove this vehicle
    firstDriven: text().notNull().default(currentTimestamp()),

    // Optional nickname for the vehicle (e.g., "My Daily Driver", "Weekend Cruiser")
    nickname: text(),

    // Whether this is their primary/favorite vehicle
    isPrimary: integer({ mode: "boolean" }).default(false),

    // Metadata
    createdAt: text().notNull().default(currentTimestamp()),
    updatedAt: text().notNull().default(currentTimestamp()),
  },
  (table) => [
    // Ensure a user can't have duplicate vehicles in their garage
    uniqueIndex("userVehicleIndex").on(table.userId, table.vehicleId),
  ],
);

// Type exports for MVP-1
export type NewVehicle = typeof vehicles.$inferInsert;
export type Vehicle = typeof vehicles.$inferSelect;

export type NewTripLog = typeof tripLogs.$inferInsert;
export type TripLog = typeof tripLogs.$inferSelect;

export type NewGarageEntry = typeof garage.$inferInsert;
export type GarageEntry = typeof garage.$inferSelect;

// Existing user types
export type NewUser = typeof auth.user.$inferInsert;
export type User = typeof auth.user.$inferSelect;
