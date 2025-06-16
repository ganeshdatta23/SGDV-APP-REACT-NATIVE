import { users, guruLocations, deviceSessions, type User, type InsertUser, type GuruLocation, type InsertGuruLocation, type DeviceSession, type InsertDeviceSession } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;
  
  // Guru location methods
  getCurrentGuruLocation(): Promise<GuruLocation | undefined>;
  updateGuruLocation(location: InsertGuruLocation): Promise<GuruLocation>;
  
  // Device session methods
  registerDevice(device: InsertDeviceSession): Promise<DeviceSession>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getCurrentGuruLocation(): Promise<GuruLocation | undefined> {
    const [location] = await db
      .select()
      .from(guruLocations)
      .where(eq(guruLocations.isActive, true))
      .orderBy(desc(guruLocations.createdAt))
      .limit(1);
    return location || undefined;
  }

  async updateGuruLocation(location: InsertGuruLocation): Promise<GuruLocation> {
    // Deactivate all previous locations
    await db
      .update(guruLocations)
      .set({ isActive: false })
      .where(eq(guruLocations.isActive, true));

    // Insert new active location
    const [newLocation] = await db
      .insert(guruLocations)
      .values({
        ...location,
        isActive: true,
        createdAt: new Date()
      })
      .returning();
    
    return newLocation;
  }

  async registerDevice(device: InsertDeviceSession): Promise<DeviceSession> {
    // Update existing device or create new one
    const [existingSession] = await db
      .select()
      .from(deviceSessions)
      .where(eq(deviceSessions.deviceId, device.deviceId));

    if (existingSession) {
      const [updatedSession] = await db
        .update(deviceSessions)
        .set({
          lastSeen: new Date(),
          pushSubscription: device.pushSubscription,
          isActive: true
        })
        .where(eq(deviceSessions.deviceId, device.deviceId))
        .returning();
      
      return updatedSession;
    } else {
      const [newSession] = await db
        .insert(deviceSessions)
        .values({
          ...device,
          lastSeen: new Date(),
          isActive: true
        })
        .returning();
      
      return newSession;
    }
  }
}

export const storage = new DatabaseStorage();