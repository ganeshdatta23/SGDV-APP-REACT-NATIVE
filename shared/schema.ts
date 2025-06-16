import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const guruLocations = pgTable("guru_locations", {
  id: serial("id").primaryKey(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  country: text("country").notNull(),
  updatedBy: text("updated_by").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const deviceSessions = pgTable("device_sessions", {
  id: serial("id").primaryKey(),
  deviceId: text("device_id").notNull(),
  lastSeen: timestamp("last_seen").defaultNow().notNull(),
  pushSubscription: text("push_subscription"),
  isActive: boolean("is_active").default(true).notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertGuruLocationSchema = createInsertSchema(guruLocations).pick({
  latitude: true,
  longitude: true,
  address: true,
  city: true,
  state: true,
  country: true,
  updatedBy: true,
});

export const insertDeviceSessionSchema = createInsertSchema(deviceSessions).pick({
  deviceId: true,
  pushSubscription: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type GuruLocation = typeof guruLocations.$inferSelect;
export type InsertGuruLocation = z.infer<typeof insertGuruLocationSchema>;
export type DeviceSession = typeof deviceSessions.$inferSelect;
export type InsertDeviceSession = z.infer<typeof insertDeviceSessionSchema>;
