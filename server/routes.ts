import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertGuruLocationSchema, insertDeviceSessionSchema } from "@shared/schema";
import { z } from "zod";

const adminTokenSchema = z.object({
  token: z.string(),
});

const updateLocationSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  const connectedClients = new Set<WebSocket>();

  wss.on('connection', (ws) => {
    connectedClients.add(ws);
    
    ws.on('close', () => {
      connectedClients.delete(ws);
    });
    
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      connectedClients.delete(ws);
    });
  });

  function broadcastLocationUpdate(location: any) {
    const message = JSON.stringify({
      type: 'location_update',
      data: location
    });
    
    connectedClients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  // Get current Guru location
  app.get("/api/guru-location", async (req, res) => {
    try {
      const location = await storage.getCurrentGuruLocation();
      if (!location) {
        return res.status(404).json({ message: "No location found" });
      }
      res.json(location);
    } catch (error) {
      console.error("Error fetching guru location:", error);
      res.status(500).json({ message: "Failed to fetch location" });
    }
  });

  // Admin authentication
  app.post("/api/admin/auth", async (req, res) => {
    try {
      const { token } = adminTokenSchema.parse(req.body);
      const expectedToken = process.env.ADMIN_SECRET_TOKEN || "Appaji@1942";
      
      if (token !== expectedToken) {
        return res.status(401).json({ message: "Invalid admin token" });
      }
      
      res.json({ success: true, message: "Authentication successful" });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // Update Guru location (Admin only)
  app.post("/api/admin/update-location", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Missing or invalid authorization header" });
      }
      
      const token = authHeader.substring(7);
      const expectedToken = process.env.ADMIN_SECRET_TOKEN || "Appaji@1942";
      
      if (token !== expectedToken) {
        return res.status(401).json({ message: "Invalid admin token" });
      }

      const locationData = updateLocationSchema.parse(req.body);
      
      const newLocation = await storage.updateGuruLocation({
        ...locationData,
        updatedBy: "admin_web"
      });
      
      // Broadcast update to all connected clients
      broadcastLocationUpdate(newLocation);
      
      res.json({ success: true, location: newLocation });
    } catch (error) {
      console.error("Error updating location:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid location data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update location" });
    }
  });

  // Register device for push notifications
  app.post("/api/device/register", async (req, res) => {
    try {
      const deviceData = insertDeviceSessionSchema.parse(req.body);
      const session = await storage.registerDevice(deviceData);
      res.json({ success: true, session });
    } catch (error) {
      console.error("Error registering device:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid device data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to register device" });
    }
  });

  // Telegram webhook for location updates
  app.post("/api/telegram-webhook", async (req, res) => {
    try {
      const { message } = req.body;
      
      if (!message || !message.location) {
        return res.status(400).json({ message: "No location data in message" });
      }
      
      const { latitude, longitude } = message.location;
      
      // You would implement reverse geocoding here to get address details
      // For now, using placeholder data
      const newLocation = await storage.updateGuruLocation({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        address: "Location from Telegram",
        city: "Unknown",
        state: "Unknown",
        country: "Unknown",
        updatedBy: "telegram_bot"
      });
      
      // Broadcast update to all connected clients
      broadcastLocationUpdate(newLocation);
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error processing telegram webhook:", error);
      res.status(500).json({ message: "Failed to process webhook" });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  return httpServer;
}
