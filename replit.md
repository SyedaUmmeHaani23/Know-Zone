# KnowZone - AI-Powered Educational Platform

## Overview

KnowZone is a comprehensive full-stack web application designed to connect students, alumni, and faculty across Indian colleges. The platform integrates AI-powered features using Google's Gemini API, real-time communication, and multi-college forum systems to create a unified educational ecosystem.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack React Query for server state
- **Routing**: Wouter for client-side routing
- **UI Components**: Radix UI primitives with custom styling
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Authentication**: Firebase Authentication
- **AI Integration**: Google Gemini 2.5 API for AI responses

### Authentication Strategy
- **Provider**: Firebase Auth with Google Sign-in
- **Token Management**: JWT tokens from Firebase for API authentication
- **Role-based Access**: Three user roles (student, alumni, faculty) with different permissions
- **Profile Completion**: Two-step registration process with role-specific fields

## Key Components

### Core Features
1. **AI Chat System**: Gemini-powered Q&A for academic and career guidance
2. **Multi-College Forums**: Hierarchical forum system (college-specific, regional, national)
3. **MentorConnect**: Question-answer platform for peer mentoring
4. **Opportunities Hub**: Job/internship/event listings with AI recommendations
5. **Lost & Found**: Campus item tracking system
6. **Bus Tracker**: Real-time transportation with Google Maps integration
7. **LinkedIn Connect**: Professional networking within the platform
8. **Faculty Dashboard**: Dedicated interface for educators

### Database Schema
- **Users**: Role-based with college affiliation and professional details
- **Colleges**: Multi-institutional support with forum categorization
- **Forum Posts**: Threaded discussions with tagging and anonymous options
- **Questions/Answers**: Mentor-mentee interaction system
- **Opportunities**: Filterable job/event listings
- **Lost & Found**: Item tracking with contact information
- **Bus Routes**: Transportation management with passenger tracking
- **Notifications**: Smart alert system

## Data Flow

### Authentication Flow
1. User initiates Google OAuth through Firebase
2. Frontend receives Firebase user token
3. Backend validates token and checks user existence
4. If new user, redirect to role-based signup form
5. Complete profile creation with college and role-specific data

### AI Integration Flow
1. User submits question through chat interface
2. Frontend sends request with authentication headers
3. Backend validates user and forwards to Gemini API
4. AI response processed and returned to client
5. Chat history maintained in component state

### Forum System Flow
1. Users access forums based on college affiliation
2. Posts categorized by forum type (college, regional, national)
3. Real-time updates through React Query invalidation
4. Anonymous posting supported with privacy controls

## External Dependencies

### Google Services Integration
- **Firebase Authentication**: User management and OAuth
- **Gemini 2.5 API**: AI-powered responses and recommendations
- **Google Maps**: Bus tracking and location services
- **Firebase Cloud Functions**: Notification processing (planned)

### Database and Infrastructure
- **PostgreSQL**: Primary data storage via Neon or similar provider
- **Drizzle ORM**: Type-safe database operations
- **Connect-pg-simple**: Session management for PostgreSQL

### UI and Development Tools
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **React Hook Form**: Form validation and management
- **Zod**: Runtime type validation
- **Date-fns**: Date manipulation utilities

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with hot module replacement
- **Database**: Local PostgreSQL or cloud development instance
- **Environment Variables**: Separate configs for development/production

### Production Build
- **Frontend**: Static assets built with Vite
- **Backend**: Bundled Node.js application with esbuild
- **Database Migrations**: Drizzle Kit for schema management
- **Deployment Target**: Node.js hosting platform (configured for Replit)

### Environment Configuration
- Database URL through environment variables
- Firebase configuration through environment variables
- Gemini API key securely stored
- Google Maps API key for location services

### Key Architectural Decisions

1. **Monorepo Structure**: Single repository with shared types between client and server
2. **Type Safety**: End-to-end TypeScript with Zod validation
3. **Component Organization**: Feature-based folder structure with reusable UI components
4. **State Management**: Server state with React Query, local state with React hooks
5. **Authentication Strategy**: Firebase for simplicity and Google ecosystem integration
6. **Database Choice**: PostgreSQL for relational data and complex queries
7. **AI Integration**: Direct API calls to Gemini for real-time responses
8. **Responsive Design**: Mobile-first approach with Tailwind breakpoints