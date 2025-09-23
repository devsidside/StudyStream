# StudyConnect Development Setup Guide

This guide provides step-by-step instructions for setting up the StudyConnect development environment.

## Prerequisites

Before starting, ensure you have the following installed:

### Required Software
- **Node.js** (v20.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v9.0.0 or higher) - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)
- **PostgreSQL** (v14.0 or higher) - [Download](https://postgresql.org/) *(optional for local development)*

### Recommended Tools
- **VS Code** - [Download](https://code.visualstudio.com/)
- **Thunder Client** or **Postman** - For API testing
- **PostgreSQL Admin Tool** (pgAdmin, DBeaver, etc.)

---

## Quick Start (Replit)

If you're using Replit, the setup is simplified:

### 1. Fork/Clone the Repository
```bash
# In Replit, you can directly import from GitHub
# Or fork the existing Replit project
```

### 2. Install Dependencies
Replit will automatically install dependencies, but you can manually run:
```bash
npm install
```

### 3. Configure Environment Variables
Add the following secrets in Replit's Secrets tab:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Authentication
REPLIT_DOMAINS=your-repl-name.your-username.repl.co
SESSION_SECRET=your-long-random-session-secret
```

### 4. Database Setup
```bash
# Push database schema
npm run db:push
```

### 5. Start Development Server
```bash
npm run dev
```

The application will be available at your Replit URL.

---

## Local Development Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/studyconnect.git
cd studyconnect
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup

#### Option A: Using Neon (Recommended)
1. Create a free account at [Neon](https://neon.tech/)
2. Create a new database project
3. Copy the connection string

#### Option B: Local PostgreSQL
```bash
# Install PostgreSQL (macOS with Homebrew)
brew install postgresql@14

# Start PostgreSQL service
brew services start postgresql@14

# Create database
createdb studyconnect_dev

# Create user (optional)
createuser -s studyconnect_user
```

#### Option C: Docker PostgreSQL
```bash
# Run PostgreSQL in Docker
docker run -d \
  --name studyconnect-postgres \
  -e POSTGRES_USER=studyconnect \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=studyconnect_dev \
  -p 5432:5432 \
  postgres:14
```

### 4. Supabase Setup

#### Create Supabase Project
1. Go to [Supabase](https://supabase.com/)
2. Create a new project
3. Wait for setup to complete
4. Navigate to Settings → API

#### Get API Keys
1. **Project URL**: Copy from "Project URL" section
2. **Anon Key**: Copy from "Project API keys" → "anon public"
3. **Service Role Key**: Copy from "Project API keys" → "service_role"

#### Configure Authentication
1. Go to Authentication → Settings
2. Configure OAuth providers if needed
3. Set up email templates (optional)

### 5. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/studyconnect_dev

# Supabase
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Authentication
REPLIT_DOMAINS=localhost:5000
SESSION_SECRET=your-super-secret-session-key-minimum-32-characters

# Development
NODE_ENV=development
PORT=5000
```

### 6. Database Schema Setup

#### Push Schema to Database
```bash
npm run db:push
```

#### Run Supabase Setup Scripts
Execute these SQL scripts in your Supabase SQL editor:

1. **supabase-setup.sql** - Basic setup and extensions
2. **supabase-profiles-schema.sql** - User profiles schema

### 7. Start Development Server
```bash
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5000
- **API**: http://localhost:5000/api

---

## Detailed Configuration

### Package Manager Configuration

#### Node.js Version Management
```bash
# Using nvm (recommended)
nvm install 20
nvm use 20

# Verify versions
node --version  # Should be v20.x.x
npm --version   # Should be v9.x.x or higher
```

#### npm Configuration
```bash
# Set npm registry (if needed)
npm config set registry https://registry.npmjs.org/

# Clear npm cache (if issues)
npm cache clean --force
```

### TypeScript Configuration

The project uses TypeScript with strict type checking. Verify configuration:

```bash
# Type check the project
npm run check

# Watch mode for continuous type checking
npx tsc --watch --noEmit
```

### Database Configuration Options

#### Drizzle Configuration File
The `drizzle.config.ts` file should look like:

```typescript
import { defineConfig } from 'drizzle-kit';

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

export default defineConfig({
  schema: './shared/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
});
```

#### Database Connection Testing
```bash
# Test database connection
npx drizzle-kit introspect:pg

# View current schema
npx drizzle-kit studio
```

### Authentication Configuration

#### Replit Auth Setup
```typescript
// server/replitAuth.ts configuration
import { Issuer, Strategy } from 'openid-client';

const issuer = await Issuer.discover('https://replit.com');
const client = new issuer.Client({
  client_id: 'your-client-id',
  client_secret: 'your-client-secret',
  redirect_uris: ['http://localhost:5000/auth/callback'],
  response_types: ['code'],
});
```

#### Session Configuration
```typescript
// server/index.ts session setup
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    conString: process.env.DATABASE_URL,
    tableName: 'session',
    createTableIfMissing: true
  }),
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  }
}));
```

---

## Development Workflow

### Project Structure Understanding
```
studyconnect/
├── client/               # React frontend application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Route-level components
│   │   ├── contexts/     # React Context providers
│   │   ├── hooks/        # Custom React hooks
│   │   └── lib/          # Utilities and configurations
│   └── index.html        # HTML entry point
├── server/               # Express.js backend
│   ├── index.ts         # Server entry point
│   ├── routes.ts        # API routes
│   ├── storage.ts       # Database interface
│   └── ...              # Other server modules
├── shared/               # Shared TypeScript schemas
└── docs/                # Documentation files
```

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run check           # TypeScript type checking

# Database
npm run db:push         # Push schema changes to database
npm run db:push --force # Force push (destructive changes)

# Build & Production
npm run build           # Build for production
npm start              # Start production server
```

### Hot Module Replacement (HMR)

The development server supports HMR for both frontend and backend:

- **Frontend**: Vite HMR for React components
- **Backend**: File watching with automatic restart
- **Shared Types**: Automatic recompilation on schema changes

### Code Quality Tools

#### ESLint Configuration
```json
{
  "extends": [
    "@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "react/react-in-jsx-scope": "off"
  }
}
```

#### Prettier Configuration
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

---

## Troubleshooting

### Common Issues and Solutions

#### 1. Database Connection Issues
```bash
# Error: "database does not exist"
createdb studyconnect_dev

# Error: "role does not exist"
createuser -s studyconnect_user

# Error: "connection refused"
# Check if PostgreSQL is running
brew services list | grep postgresql
```

#### 2. Port Already in Use
```bash
# Error: "EADDRINUSE: address already in use :::5000"
# Kill process using port 5000
lsof -ti:5000 | xargs kill -9

# Or use a different port
PORT=3000 npm run dev
```

#### 3. Module Resolution Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear npm cache
npm cache clean --force
```

#### 4. TypeScript Compilation Errors
```bash
# Check TypeScript configuration
npx tsc --showConfig

# Restart TypeScript language server in VS Code
# Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

#### 5. Supabase Connection Issues
```bash
# Verify environment variables
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY

# Test Supabase connection
curl -H "apikey: $VITE_SUPABASE_ANON_KEY" \
     "$VITE_SUPABASE_URL/rest/v1/profiles?select=id"
```

#### 6. Authentication Issues
```bash
# Clear browser cookies and local storage
# Check session configuration in network tab
# Verify REPLIT_DOMAINS environment variable
```

### Debug Mode

Enable debug logging:

```env
# Add to .env.local
DEBUG=studyconnect:*
LOG_LEVEL=debug
```

### Performance Monitoring

#### Development Performance
```bash
# Bundle analysis
npm run build -- --analyze

# Memory usage monitoring
node --inspect server/index.ts
```

#### Database Performance
```sql
-- Enable query logging in PostgreSQL
ALTER SYSTEM SET log_statement = 'all';
SELECT pg_reload_conf();

-- Check slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;
```

---

## IDE Setup

### VS Code Extensions (Recommended)

```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-json",
    "ms-vscode.vscode-eslint",
    "esbenp.prettier-vscode",
    "formulahendry.auto-rename-tag",
    "ms-vscode.vscode-postgres"
  ]
}
```

### VS Code Settings
```json
{
  "typescript.preferences.includePackageJsonAutoImports": "auto",
  "typescript.suggest.autoImports": true,
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.emmetCompletions": true,
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

### IntelliJ/WebStorm Setup
1. Enable TypeScript service
2. Configure Prettier as default formatter
3. Install Tailwind CSS plugin
4. Set up database connection

---

## Testing Setup

### Unit Testing
```bash
# Install testing dependencies
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom

# Run tests
npm test

# Watch mode
npm run test:watch
```

### E2E Testing
```bash
# Install Playwright
npm install --save-dev @playwright/test

# Run E2E tests
npx playwright test
```

### API Testing
```bash
# Install testing tools
npm install --save-dev supertest @types/supertest

# Test API endpoints
npm run test:api
```

---

## Production Deployment Preparation

### Environment Variables
```env
# Production environment
NODE_ENV=production
PORT=5000

# Database (production)
DATABASE_URL=postgresql://prod_user:secure_password@prod_host:5432/studyconnect

# Supabase (production project)
VITE_SUPABASE_URL=https://prod-project.supabase.co
VITE_SUPABASE_ANON_KEY=prod_anon_key
SUPABASE_SERVICE_ROLE_KEY=prod_service_key

# Security
SESSION_SECRET=production-grade-secret-key
ALLOWED_ORIGINS=https://yourdomain.com
```

### Build Process
```bash
# Production build
npm run build

# Verify build output
ls -la dist/

# Test production build locally
npm start
```

### Database Migration
```bash
# Create production database
npm run db:push

# Seed production data (if applicable)
npm run db:seed
```

---

This setup guide should get you up and running with StudyConnect development. If you encounter any issues not covered here, please check the troubleshooting section or reach out to the development team.