# Podcast App

## Overview

This is a modern podcast application built with React, Express, and TypeScript that has been successfully converted to a native Android app using Capacitor. The app follows a full-stack architecture with a React frontend and Express backend, using PostgreSQL for data storage through Drizzle ORM. The application provides podcast subscription management, episode playback, queue management, and offline download capabilities, now available as both a web app and native Android application.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack React Query for server state management
- **UI Components**: Radix UI with shadcn/ui component library
- **Styling**: Tailwind CSS with custom theme support (dark/light mode)
- **Build Tool**: Vite for development and production builds
- **Mobile-First**: Responsive design optimized for mobile devices

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: PostgreSQL-backed sessions
- **API Design**: RESTful endpoints with JSON responses
- **Development**: Hot module replacement with Vite integration
- **Production**: Compiled ESM bundle with esbuild

### Key Components

#### Database Schema
- **Podcasts**: Store podcast metadata, subscription status, and feed URLs
- **Episodes**: Episode details, playback position, download status
- **Playback Queue**: User's episode queue with position ordering
- **User Settings**: Theme, playback speed, skip intervals, and other preferences

#### Audio Player System
- Custom audio player hook (`useAudioPlayer`) managing:
  - Playback state and controls
  - Progress tracking and seeking
  - Speed adjustment and volume control
  - Sleep timer functionality
  - Queue management

#### External Service Integration
- **Podcast Index API**: For podcast search functionality
- **RSS Feed Parser**: For parsing podcast feeds and episodes
- **Neon Database**: PostgreSQL hosting service

## Data Flow

1. **Search Flow**: User searches → Frontend calls backend → Backend queries Podcast Index API → Results displayed
2. **Subscription Flow**: User subscribes → Frontend sends feed URL → Backend parses RSS → Podcast and episodes saved to database
3. **Playback Flow**: User plays episode → Audio player loads → Progress tracked → Position saved to database
4. **Download Flow**: User downloads episode → Backend fetches audio file → File stored locally → Database updated

## External Dependencies

### Frontend Dependencies
- `@tanstack/react-query`: Server state management
- `@radix-ui/*`: UI component primitives
- `wouter`: Lightweight routing
- `tailwindcss`: Styling framework
- `class-variance-authority`: Component variant management
- `date-fns`: Date formatting utilities

### Backend Dependencies
- `express`: Web framework
- `drizzle-orm`: Type-safe database ORM
- `@neondatabase/serverless`: PostgreSQL driver
- `connect-pg-simple`: PostgreSQL session store
- `zod`: Runtime type validation
- `drizzle-zod`: Schema validation integration

### Development Dependencies
- `vite`: Build tool and dev server
- `typescript`: Type checking
- `esbuild`: Production bundling
- `tsx`: TypeScript execution

## Deployment Strategy

### Development
- Uses Vite dev server with HMR
- Express server runs with tsx for TypeScript execution
- Database migrations handled by Drizzle Kit
- Replit-specific development features integrated

### Production
- Frontend built with Vite to static assets
- Backend compiled to ESM bundle with esbuild
- Static assets served by Express
- Database connection via environment variables
- Health checks and error handling middleware

### Database Management
- Schema defined in TypeScript with Drizzle
- Migrations generated and applied via Drizzle Kit
- Connection pooling handled by Neon serverless driver
- Session storage in PostgreSQL with automatic cleanup

### Mobile Optimization
- PWA-ready with service worker support
- Responsive design with mobile-first approach
- Touch-friendly UI components
- Offline functionality for downloaded episodes
- Local storage for user preferences

## Architecture Decisions

### Database Choice
- **PostgreSQL**: Chosen for ACID compliance, JSON support for categories/metadata, and robust querying capabilities
- **Drizzle ORM**: Provides type safety, excellent TypeScript integration, and lightweight overhead compared to heavier ORMs

### Frontend State Management
- **TanStack React Query**: Handles server state, caching, and synchronization automatically
- **Local State**: React hooks for UI state, custom hooks for complex logic like audio player

### API Design
- **RESTful**: Simple, predictable endpoints following REST conventions
- **JSON**: Consistent response format with error handling
- **Middleware**: Request logging, error handling, and session management

### UI/UX Approach
- **Mobile-First**: Designed primarily for mobile podcast listening experience
- **Component Library**: Radix UI for accessibility, shadcn/ui for consistent design
- **Theme System**: CSS variables for light/dark mode with system preference detection

## Recent Changes

### Android App Conversion (January 2025)
- **Capacitor Integration**: Successfully converted web app to native Android app
- **Native Features Added**: Status bar controls, splash screen, haptic feedback, background audio
- **Mobile Optimizations**: Touch-friendly interface, offline detection, device integration
- **Build System**: Android Studio project ready for APK generation and Google Play Store
- **File Structure**: Created `android/` directory with native Android project files
- **Documentation**: Added comprehensive Android build guide (`ANDROID_BUILD_GUIDE.md`)

### App Identity
- **App ID**: `com.podcastapp.mobile`
- **App Name**: PodcastApp
- **Platform**: Web + Android (via Capacitor)

This architecture provides a solid foundation for a podcast application with room for future enhancements like push notifications, social features, and advanced audio processing. The Android version maintains full feature parity with the web app while adding native mobile capabilities.