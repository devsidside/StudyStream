# StudyConnect - Student Resource Platform

<div align="center">
  <h3>🎓 A comprehensive platform connecting students with academic resources and campus services</h3>
  
  ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
  ![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
  ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
  ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat&logo=postgresql&logoColor=white)
  ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [🏗️ Architecture](#architecture)
- [💻 Technology Stack](#technology-stack)
- [🗄️ Database Design](#database-design)
- [🚀 Quick Start](#quick-start)
- [📁 Project Structure](#project-structure)
- [🔧 API Documentation](#api-documentation)
- [🛠️ Development](#development)
- [🔒 Authentication](#authentication)
- [📈 Recent Changes & Fixes](#recent-changes--fixes)
- [🚀 Deployment](#deployment)
- [🤝 Contributing](#contributing)

---

## Overview

StudyConnect is a full-stack web application that serves as a centralized platform for students to access academic resources, connect with service vendors, and build community relationships. The platform functions as both an academic resource hub and a marketplace for campus-related services.

### Key Features

- **📚 Academic Resource Sharing**: Upload, browse, and download study materials, notes, and projects
- **🏪 Service Marketplace**: Connect students with local vendors for accommodation, food, tutoring, and entertainment
- **🔍 Advanced Search**: Powerful filtering and search capabilities across all content types
- **⭐ Rating & Review System**: Community-driven quality assessment for resources and services
- **👥 User Management**: Role-based access for students, vendors, and administrators
- **🗺️ Geographic Discovery**: Location-based service discovery with interactive maps
- **💬 Real-time Communication**: Live chat and notification systems
- **📱 Responsive Design**: Mobile-first design with dark/light theme support

---

## 🏗️ Architecture

### System Architecture Overview

```mermaid
graph TB
    subgraph "Frontend (React SPA)"
        A[React App] --> B[Component Library]
        A --> C[State Management]
        A --> D[Routing]
        B --> E[shadcn/ui + Radix]
        C --> F[TanStack Query]
        D --> G[Wouter Router]
    end
    
    subgraph "Backend (Express.js API)"
        H[Express Server] --> I[Authentication]
        H --> J[API Routes]
        H --> K[File Upload]
        I --> L[Passport.js + OAuth]
        J --> M[REST Endpoints]
        K --> N[Multer Middleware]
    end
    
    subgraph "Database Layer"
        O[PostgreSQL] --> P[Drizzle ORM]
        O --> Q[Supabase Integration]
        P --> R[Type-safe Queries]
        Q --> S[Real-time Features]
    end
    
    subgraph "External Services"
        T[Replit Auth] --> U[OAuth Provider]
        V[Supabase] --> W[Database & Auth]
        X[Neon] --> Y[Serverless PostgreSQL]
    end
    
    A --> H
    H --> O
    I --> T
    Q --> V
    O --> X
```

### Component Architecture

The frontend follows a modular component-based architecture:

- **Pages**: High-level route components
- **Components**: Reusable UI building blocks organized by domain
- **Contexts**: Application-wide state management
- **Hooks**: Custom logic encapsulation
- **Lib**: Utility functions and external service integrations

### Backend Architecture

The server implements a clean API architecture:

- **Route-based organization**: Logical grouping of endpoints
- **Middleware pattern**: Authentication, validation, and error handling
- **Type-safe data layer**: Drizzle ORM with TypeScript integration
- **Session management**: Persistent authentication with PostgreSQL storage

---

## 💻 Technology Stack

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | UI framework with hooks and functional components |
| **TypeScript** | 5.6.3 | Type safety and enhanced developer experience |
| **Vite** | 5.4.19 | Build tool and development server |
| **Tailwind CSS** | 3.4.17 | Utility-first CSS framework |
| **Wouter** | 3.3.5 | Lightweight SPA routing |
| **TanStack Query** | 5.60.5 | Server state management and caching |
| **React Hook Form** | 7.55.0 | Form state management and validation |
| **Framer Motion** | 11.18.2 | Animation library |
| **Zod** | 3.24.2 | Schema validation |

#### UI Component Libraries

- **Radix UI**: Accessible, unstyled component primitives
- **shadcn/ui**: Pre-styled component system built on Radix
- **Lucide React**: Icon library for consistent iconography
- **React Icons**: Additional icon sets

### Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 20.x | JavaScript runtime environment |
| **Express.js** | 4.21.2 | Web application framework |
| **TypeScript** | 5.6.3 | Type safety for server-side code |
| **Passport.js** | 0.7.0 | Authentication middleware |
| **Multer** | 2.0.2 | File upload handling |
| **Express Session** | 1.18.1 | Session management |
| **WebSocket (ws)** | 8.18.0 | Real-time communication |

### Database & External Services

| Service | Purpose |
|---------|---------|
| **PostgreSQL** | Primary relational database |
| **Neon** | Serverless PostgreSQL hosting |
| **Supabase** | Authentication and real-time features |
| **Drizzle ORM** | Type-safe database ORM |
| **Replit Auth** | OAuth authentication provider |

### Development Tools

- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production
- **Drizzle Kit**: Database migration tool
- **PostCSS**: CSS post-processing
- **Autoprefixer**: CSS vendor prefixing

---

## 🗄️ Database Design

### Database Schema Overview

The application uses PostgreSQL with a normalized relational schema designed for scalability and data integrity.

#### Core Tables

```sql
-- User Management
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  role TEXT CHECK (role IN ('student', 'vendor', 'admin')) DEFAULT 'student',
  profile_image_url TEXT,
  university TEXT,
  course TEXT,
  year TEXT,
  business_type TEXT,
  business_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vendor Services
CREATE TABLE vendors (
  id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  business_name TEXT NOT NULL,
  category TEXT CHECK (category IN ('hostel','mess','cafe','tuition','service')),
  contact_info JSONB,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Geographic Locations (with PostGIS)
CREATE TABLE locations (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  geom GEOGRAPHY(Point, 4326) NOT NULL,
  vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Academic Resources
CREATE TABLE resources (
  id BIGSERIAL PRIMARY KEY,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('pdf','code','note','project')) NOT NULL,
  storage_path TEXT NOT NULL,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events
CREATE TABLE events (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  location_id BIGINT REFERENCES locations(id) ON DELETE SET NULL,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### PostGIS Extensions

The database includes geospatial capabilities for location-based features:

```sql
-- Enable PostGIS for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

#### Row-Level Security (RLS)

Comprehensive security policies ensure data access control:

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Example policies
CREATE POLICY "View own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Public view of public resources" ON resources
  FOR SELECT USING (is_public OR auth.uid() = owner_id);
```

### Drizzle Schema Integration

The application uses Drizzle ORM for type-safe database operations:

```typescript
// Example schema definition
export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().references(() => authUsers.id, { onDelete: 'cascade' }),
  email: text('email').notNull().unique(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  role: text('role').$type<'student' | 'vendor' | 'admin'>().default('student'),
  // ... other fields
});

// Type inference
export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = typeof profiles.$inferInsert;
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v20 or higher)
- **PostgreSQL** database
- **Supabase** account and project
- **Replit** account (for authentication)

### Environment Variables

Create the following environment variables in your Replit Secrets:

```env
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Authentication
REPLIT_DOMAINS=your-replit-domain.repl.co

# Session Configuration
SESSION_SECRET=your-session-secret
```

### Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Database Setup**
   ```bash
   # Push database schema
   npm run db:push
   
   # Run setup scripts in your Supabase SQL editor
   # Execute: supabase-setup.sql
   # Execute: supabase-profiles-schema.sql
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Access Application**
   - Frontend: `http://localhost:5000`
   - API: `http://localhost:5000/api`

### Build for Production

```bash
# Build application
npm run build

# Start production server
npm start
```

---

## 📁 Project Structure

```
StudyConnect/
├── 📁 client/                    # Frontend React application
│   └── src/
│       ├── 📁 components/        # Reusable UI components
│       │   ├── 📁 ui/           # shadcn/ui component library
│       │   ├── 📁 auth/         # Authentication components
│       │   ├── 📁 hero/         # Landing page components
│       │   ├── 📁 notes/        # Academic resource components
│       │   └── 📁 vendors/      # Vendor marketplace components
│       ├── 📁 pages/            # Route-level components
│       ├── 📁 contexts/         # React Context providers
│       ├── 📁 hooks/            # Custom React hooks
│       ├── 📁 lib/              # Utilities and configurations
│       ├── App.tsx              # Main application component
│       └── main.tsx             # Application entry point
│
├── 📁 server/                    # Backend Express.js API
│   ├── index.ts                 # Server entry point
│   ├── routes.ts                # API route definitions
│   ├── storage.ts               # Database storage interface
│   ├── db.ts                    # Database connection
│   ├── supabaseClient.ts        # Supabase server client
│   └── replitAuth.ts            # Authentication setup
│
├── 📁 shared/                    # Shared TypeScript schemas
│   └── schema.ts                # Drizzle ORM schemas
│
├── 📁 uploads/                   # File upload directory
├── 📁 attached_assets/           # Static assets
├── package.json                 # Dependencies and scripts
├── vite.config.ts               # Vite configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── drizzle.config.ts            # Database ORM configuration
└── README.md                    # Project documentation
```

---

## 🔧 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | User login |
| `POST` | `/api/auth/logout` | User logout |
| `GET` | `/api/auth/profile` | Get current user profile |
| `PUT` | `/api/auth/profile` | Update user profile |

### Resource Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/resources` | List academic resources |
| `POST` | `/api/resources` | Upload new resource |
| `GET` | `/api/resources/:id` | Get specific resource |
| `PUT` | `/api/resources/:id` | Update resource |
| `DELETE` | `/api/resources/:id` | Delete resource |

### Vendor Services

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/vendors` | List all vendors |
| `POST` | `/api/vendors` | Register as vendor |
| `GET` | `/api/vendors/:id` | Get vendor details |
| `PUT` | `/api/vendors/:id` | Update vendor information |

### Search & Discovery

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/search/resources` | Search academic resources |
| `GET` | `/api/search/vendors` | Search vendors and services |
| `GET` | `/api/search/locations` | Geographic search |

### File Upload

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/upload` | Upload files (multipart/form-data) |
| `GET` | `/api/files/:filename` | Download/serve files |

---

## 🛠️ Development

### Development Workflow

1. **Start Development Server**
   ```bash
   npm run dev
   ```
   - Starts Express server on port 5000
   - Enables hot module replacement (HMR)
   - Serves both frontend and API

2. **Database Operations**
   ```bash
   # Push schema changes
   npm run db:push
   
   # Force push (for destructive changes)
   npm run db:push --force
   ```

3. **Type Checking**
   ```bash
   npm run check
   ```

### Code Quality Standards

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting and formatting rules
- **Component Architecture**: Functional components with hooks
- **Error Boundaries**: Comprehensive error handling
- **Responsive Design**: Mobile-first approach

### Testing Strategy

- **Unit Testing**: Component and utility function testing
- **Integration Testing**: API endpoint testing
- **E2E Testing**: Critical user flow validation
- **Type Safety**: Compile-time error prevention

---

## 🔒 Authentication

### Authentication Flow

The application implements a multi-provider authentication system:

1. **OAuth Providers**:
   - Replit OAuth (primary)
   - Supabase Auth (secondary)

2. **Session Management**:
   - Express sessions with PostgreSQL storage
   - HTTP-only cookies for security
   - Automatic session refresh

3. **Role-Based Access**:
   - **Students**: Access to academic resources and marketplace
   - **Vendors**: Service listing and management capabilities
   - **Admins**: Full platform management access

### Security Features

- **CSRF Protection**: Cross-site request forgery prevention
- **Input Validation**: Zod schema validation on all inputs
- **SQL Injection Prevention**: Parameterized queries with Drizzle ORM
- **XSS Protection**: Content sanitization and escaping
- **Rate Limiting**: API endpoint protection

---

## 📈 Recent Changes & Fixes

### Supabase Integration Fixes (September 2025)

#### Issue Resolution
Fixed critical Supabase client initialization errors that were causing application crashes:

**Problems Identified:**
- `supabaseUrl is required` errors due to faulty URL extraction logic
- `Cannot read properties of null (reading 'auth')` runtime crashes
- Missing environment variables causing client initialization failures

**Solutions Implemented:**

1. **Supabase Client Configuration** (`client/src/lib/supabase.ts`):
   ```typescript
   // Before: Faulty URL extraction logic
   const extractUrl = (rawUrl: string) => {
     const urlMatch = rawUrl.match(/https:\/\/[^\s]+\.supabase\.co/)
     return urlMatch ? urlMatch[0] : rawUrl.trim()
   }
   
   // After: Direct environment variable usage
   const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
   const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
   
   // Conditional client creation
   export const supabase = supabaseUrl && supabaseAnonKey 
     ? createClient(supabaseUrl, supabaseAnonKey, { ... })
     : null
   ```

2. **Null Safety Implementation** (`client/src/contexts/auth-context.tsx`):
   ```typescript
   // Added comprehensive null checks before all Supabase operations
   const fetchProfile = async (userId: string) => {
     if (!supabase) {
       console.warn('Supabase client not available')
       return null
     }
     // ... rest of function
   }
   
   useEffect(() => {
     if (!supabase) {
       setLoading(false)
       return
     }
     // ... auth initialization
   }, [])
   ```

3. **Graceful Error Handling**:
   - Application no longer crashes when Supabase credentials are missing
   - Proper warning messages displayed in console
   - Auth context gracefully degrades when unavailable

#### Environment Variable Configuration

**Required Secrets:**
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key (optional)
```

#### Impact of Changes
- ✅ Eliminated all TypeScript compilation errors
- ✅ Resolved runtime crashes and null pointer exceptions
- ✅ Improved application stability and user experience
- ✅ Maintained full functionality when credentials are properly configured

### Hero Section Refactoring (September 2025)

Restructured the landing page hero section for better maintainability:

- **Modular Components**: Split 93-line monolithic component into 5 focused components
- **Improved Reusability**: Created `HeroContent`, `FloatingIcons`, `FloatingStats`, `HeroVisual`
- **Quality Metrics**: Updated from volume-based to quality-based statistics
- **Responsive Design**: Enhanced mobile and tablet layouts

---

## 🚀 Deployment

### Production Build

1. **Build Application**
   ```bash
   npm run build
   ```
   - Compiles TypeScript to JavaScript
   - Bundles frontend assets with Vite
   - Optimizes for production performance

2. **Environment Setup**
   - Configure all required environment variables
   - Set up PostgreSQL database with proper schema
   - Configure Supabase project and authentication

3. **Start Production Server**
   ```bash
   npm start
   ```

### Deployment Platforms

- **Replit**: Native deployment with automatic HTTPS
- **Vercel**: Frontend deployment with serverless functions
- **Railway**: Full-stack deployment with PostgreSQL
- **DigitalOcean**: VPS deployment with custom configuration

### Performance Optimization

- **Code Splitting**: Automatic route-based code splitting
- **Asset Optimization**: Image compression and lazy loading
- **Caching Strategy**: Browser caching and CDN integration
- **Database Optimization**: Connection pooling and query optimization

---

## 🤝 Contributing

### Development Setup

1. **Fork Repository**
2. **Clone Locally**
   ```bash
   git clone https://github.com/your-username/studyconnect.git
   cd studyconnect
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Set Up Environment**
   - Copy environment variables from team lead
   - Configure local database
   - Set up Supabase project

5. **Start Development**
   ```bash
   npm run dev
   ```

### Contribution Guidelines

- **Code Style**: Follow existing TypeScript and React patterns
- **Component Design**: Use functional components with hooks
- **Styling**: Utilize Tailwind CSS utility classes
- **Testing**: Include tests for new features
- **Documentation**: Update relevant documentation

### Pull Request Process

1. Create feature branch from `main`
2. Implement changes with proper testing
3. Update documentation if needed
4. Submit pull request with detailed description
5. Address review feedback
6. Merge after approval

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Replit**: Hosting platform and authentication services
- **Supabase**: Database and real-time functionality
- **Neon**: Serverless PostgreSQL hosting
- **Radix UI**: Accessible component primitives
- **shadcn/ui**: Component system and design patterns
- **Open Source Community**: Various libraries and tools that make this project possible

---

<div align="center">
  <p>Built with ❤️ for the student community</p>
  <p>
    <a href="#top">Back to top</a>
  </p>
</div>