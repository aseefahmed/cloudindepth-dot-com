# Overview

This is a modern one-page marketing website for AWS Solution Architect training services. The site promotes Aseef Ahmed's AWS training course, highlighting his expertise as a Senior DevOps Engineer with 12 AWS and 5 Azure certifications. The website features a professional design with multiple sections including hero, about, curriculum, testimonials, and pricing tiers for different training formats (1-to-1, group training with various discount levels).

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development and building
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Shadcn/ui component library built on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Fonts**: Google Fonts integration (Inter and Poppins) for modern typography

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **TypeScript**: Full TypeScript support across client and server
- **Development**: Hot module replacement with Vite integration
- **Build System**: ESBuild for production server bundling
- **Static Files**: Vite handles client-side assets, Express serves them in production

## Data Storage Solutions
- **Database**: PostgreSQL with Neon serverless database
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Shared schema definitions between client and server
- **Migrations**: Drizzle Kit for database schema migrations
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple

## Authentication and Authorization
- **Session Management**: Express sessions with PostgreSQL storage
- **Schema**: Basic user table with username/password fields
- **Storage Interface**: Abstracted storage layer with in-memory fallback for development

## Project Structure
- **Monorepo**: Single repository with client, server, and shared code
- **Client**: React application in `/client` directory
- **Server**: Express API in `/server` directory  
- **Shared**: Common types and schemas in `/shared` directory
- **Path Aliases**: TypeScript path mapping for clean imports (@/, @shared/)

## Development Workflow
- **Hot Reload**: Vite dev server with Express API proxy
- **Type Safety**: Strict TypeScript configuration across all code
- **Component Development**: Incremental component loading with fade-in animations
- **Responsive Design**: Mobile-first approach with Tailwind responsive utilities

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting for production database
- **Connection**: Environment variable-based database URL configuration

## UI and Styling
- **Shadcn/ui**: Pre-built accessible React components
- **Radix UI**: Headless UI primitives for complex components
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **Lucide React**: Icon library for consistent iconography
- **Google Fonts**: External font loading for Inter and Poppins typefaces

## Development Tools
- **Replit Integration**: Vite plugins for Replit-specific development features
- **PostCSS**: CSS processing with Tailwind and Autoprefixer
- **TypeScript**: Static type checking and IDE support

## Runtime Libraries
- **React Query**: Server state synchronization and caching
- **React Hook Form**: Form validation and state management
- **Date-fns**: Date manipulation and formatting utilities
- **Class Variance Authority**: Type-safe CSS class composition
- **Zod**: Runtime type validation for forms and API data

## Build and Deployment
- **Vite**: Frontend build tool and development server
- **ESBuild**: Fast JavaScript/TypeScript bundling for production
- **Node.js**: Server runtime environment