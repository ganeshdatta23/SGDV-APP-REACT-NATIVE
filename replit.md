# Guru Direction Finder App

## Overview

This is a spiritual compass application that helps users find the direction to their Guru's current location in real-time. The app combines location tracking, device orientation sensing, and WebSocket communication to provide an immersive spiritual experience with audio features and visual feedback.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for the user interface
- **Vite** as the build tool and development server
- **Tailwind CSS** with custom spiritual color theming
- **shadcn/ui** component library for consistent UI components
- **wouter** for lightweight client-side routing
- **React Query** for server state management and data fetching

### Backend Architecture
- **Express.js** server with TypeScript
- **WebSocket** server for real-time location updates
- **Drizzle ORM** for database operations with PostgreSQL
- **Neon Database** serverless PostgreSQL for data persistence

### Mobile PWA Features
- Service worker registration for offline capabilities
- Device orientation and geolocation APIs for compass functionality
- Responsive design optimized for mobile devices
- Audio controls for spiritual background music and content

## Key Components

### Database Schema
- **users**: Basic user authentication (id, username, password)
- **guru_locations**: Real-time location tracking (latitude, longitude, address, city, state, country, updatedBy, createdAt, isActive)
- **device_sessions**: Device management for push notifications (deviceId, lastSeen, pushSubscription, isActive)

### Core Features
1. **Compass View**: Real-time compass showing direction to Guru with device orientation
2. **Location Services**: GPS tracking of user location and Guru location
3. **Darshan Mode**: Immersive spiritual experience with visual and audio elements
4. **Admin Panel**: Protected interface for updating Guru's location
5. **Audio Controls**: Background music and spiritual content playback
6. **WebSocket Integration**: Real-time updates when Guru's location changes

### Permission Management
- Device orientation access for compass functionality
- Geolocation services for user positioning
- Progressive permission requests with user-friendly modals

## Data Flow

1. **User Location**: App requests geolocation permission and tracks user's current position
2. **Guru Location**: Admin updates Guru's location through protected admin interface
3. **Real-time Updates**: WebSocket broadcasts location changes to all connected clients
4. **Compass Calculation**: App calculates bearing and distance between user and Guru positions
5. **Orientation Tracking**: Device orientation API provides compass heading for direction indication

## External Dependencies

### Core Libraries
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **@tanstack/react-query**: Server state management
- **@radix-ui/react-***: Accessible UI primitives
- **drizzle-orm**: Type-safe database ORM
- **react-hook-form**: Form state management
- **date-fns**: Date manipulation utilities

### Device APIs
- **Geolocation API**: User location tracking
- **DeviceOrientation API**: Compass functionality
- **WebSocket API**: Real-time communication
- **Service Worker API**: PWA capabilities

## Deployment Strategy

The application is configured for deployment on Replit with:
- **Build Process**: Vite builds the client, esbuild bundles the server
- **Development**: Hot module replacement with Vite dev server
- **Production**: Optimized builds with static asset serving
- **Database**: Automatic PostgreSQL provisioning through environment variables
- **WebSocket**: Full-duplex communication over HTTP upgrade

### Environment Configuration
- Requires `DATABASE_URL` environment variable for PostgreSQL connection
- Supports both development and production modes
- Static asset serving integrated with Express

## Changelog
```
Changelog:
- June 16, 2025. Initial setup - Progressive Web App with compass functionality
- June 16, 2025. Native mobile app implementation - React Native project with Android/iOS support
```

## User Preferences
```
Preferred communication style: Simple, everyday language.
```