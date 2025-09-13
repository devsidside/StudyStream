# Student Resource Platform (StudyConnect)

## Overview

StudyConnect is a comprehensive web platform designed to connect students with academic and non-academic resources. The platform serves as a centralized hub where students can access study materials, connect with service vendors, and build community relationships. It functions as a marketplace connecting students with local services like accommodation, food, tutoring, and entertainment while providing robust academic resource sharing capabilities.

The system facilitates two main user types: students who consume resources and vendors who provide services. Students can browse and share academic content, find campus services, and engage with peers through forums and ratings. Vendors can list their services, manage pricing, and connect with their student customer base.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The client-side application uses React with TypeScript in a single-page application (SPA) architecture. The frontend employs:

- **Component Library**: Radix UI components with shadcn/ui styling system for consistent, accessible UI elements
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management and caching
- **Styling**: Tailwind CSS with custom CSS variables for theming and responsive design
- **Form Handling**: React Hook Form with Zod validation schemas
- **Build System**: Vite for fast development and optimized production builds

The architecture follows a component-based structure with shared UI components, page-level components, and custom hooks for business logic. The design system supports both light and dark themes with extensive customization through CSS variables.

### Backend Architecture

The server implements a RESTful API using Express.js with TypeScript. Key architectural decisions include:

- **Authentication**: OpenID Connect integration with Replit's authentication service using Passport.js
- **Session Management**: Express sessions with PostgreSQL storage for persistent user sessions
- **File Upload**: Multer middleware for handling multi-format file uploads with size and type validation
- **API Structure**: Route-based organization with middleware for authentication, logging, and error handling
- **Development Setup**: Hot module replacement and development middleware integration with Vite

The server provides comprehensive API endpoints for user management, content operations, vendor services, and administrative functions.

### Data Storage Solutions

The application uses PostgreSQL as the primary database with Drizzle ORM for type-safe database operations:

- **Database Provider**: Neon serverless PostgreSQL for scalable cloud database hosting
- **Schema Management**: Drizzle Kit for migrations and schema evolution
- **Connection Pooling**: Connection pooling through Neon's serverless driver
- **Session Storage**: Dedicated sessions table for authentication state persistence

The database schema includes tables for users, notes, files, ratings, comments, vendors, and administrative data. The schema uses proper indexing and relationships to support complex queries for search and filtering operations.

### Content Management System

The platform implements a comprehensive content management system for academic resources:

- **File Storage**: Local file storage system with organized directory structure
- **Content Types**: Support for multiple academic content types including notes, projects, assignments, and reference materials
- **Metadata System**: Rich metadata capture including subject, university, course codes, and academic terms
- **Search and Discovery**: Advanced filtering by subject, content type, university, ratings, and full-text search
- **Version Control**: File versioning and update tracking for collaborative content

### Vendor and Service Management

The system includes a vendor marketplace architecture:

- **Service Categories**: Structured categorization for accommodation, food, tutoring, transportation, and entertainment services
- **Rating System**: Comprehensive rating and review system for service quality assessment
- **Geographic Organization**: Location-based service discovery and regional vendor management
- **Advertisement System**: Integrated advertising platform for vendor promotion with audience targeting

### Authentication and Authorization

The authentication system leverages OpenID Connect for secure user management:

- **Identity Provider**: Integration with Replit's OAuth service for user authentication
- **Role-Based Access**: User roles including students, vendors, and administrators with appropriate permissions
- **Session Security**: Secure session management with HTTP-only cookies and CSRF protection
- **User Profiles**: Rich user profiles with academic affiliation and preference management

## External Dependencies

### Authentication Services
- **Replit OAuth**: Primary authentication provider using OpenID Connect protocol
- **Passport.js**: Authentication middleware for Express.js applications

### Database Services
- **Neon Database**: Serverless PostgreSQL database hosting with connection pooling
- **Drizzle ORM**: Type-safe database ORM with migration support

### UI and Component Libraries
- **Radix UI**: Accessible, unstyled UI components for React applications
- **shadcn/ui**: Pre-styled component system built on top of Radix UI
- **Lucide React**: Icon library for consistent iconography

### Development Tools
- **Vite**: Build tool and development server with hot module replacement
- **TypeScript**: Type safety across frontend and backend codebases
- **Tailwind CSS**: Utility-first CSS framework for responsive design

### File Processing
- **Multer**: File upload middleware with validation and storage management
- **File System APIs**: Node.js file system operations for local storage

### Data Validation
- **Zod**: Schema validation for API inputs and form validation
- **React Hook Form**: Form state management with validation integration

The platform is designed to be cloud-ready with consideration for future scalability through containerization and microservices architecture. The current monolithic structure provides a solid foundation that can be decomposed into services as usage grows.