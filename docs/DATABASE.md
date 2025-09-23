# StudyConnect Database Documentation

## Database Overview

StudyConnect uses PostgreSQL as its primary database with several extensions to support advanced features like geospatial queries and real-time updates.

### Database Provider
- **Primary**: Neon Serverless PostgreSQL
- **Development**: Local PostgreSQL instance
- **ORM**: Drizzle ORM with TypeScript integration

### Extensions
```sql
-- PostGIS for geospatial functionality
CREATE EXTENSION IF NOT EXISTS postgis;

-- UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Full-text search (optional)
CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

---

## Schema Design

### Core Principles
- **Normalized Design**: Reduces data redundancy and maintains integrity
- **Type Safety**: All schemas defined with TypeScript integration
- **Scalability**: Designed to handle growing user base and content
- **Security**: Row-Level Security (RLS) policies for data protection
- **Performance**: Proper indexing and query optimization

---

## Table Definitions

### Authentication & User Management

#### profiles
```sql
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
  bio TEXT,
  contact_info JSONB,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_university ON profiles(university);
CREATE INDEX idx_profiles_created_at ON profiles(created_at);
```

**Drizzle Schema:**
```typescript
export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().references(() => authUsers.id, { onDelete: 'cascade' }),
  email: text('email').notNull().unique(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  role: text('role').$type<'student' | 'vendor' | 'admin'>().default('student'),
  profileImageUrl: text('profile_image_url'),
  university: text('university'),
  course: text('course'),
  year: text('year'),
  businessType: text('business_type'),
  businessName: text('business_name'),
  bio: text('bio'),
  contactInfo: jsonb('contact_info'),
  preferences: jsonb('preferences').default('{}'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// Type inference
export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = typeof profiles.$inferInsert;
```

### Vendor Management

#### vendors
```sql
CREATE TABLE vendors (
  id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  business_name TEXT NOT NULL,
  category TEXT CHECK (category IN ('hostel','mess','cafe','tuition','service','transport','entertainment')) NOT NULL,
  description TEXT,
  contact_info JSONB NOT NULL,
  business_hours JSONB,
  pricing_info JSONB,
  verified BOOLEAN DEFAULT FALSE,
  verification_date TIMESTAMPTZ,
  rating_average DECIMAL(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_vendors_category ON vendors(category);
CREATE INDEX idx_vendors_verified ON vendors(verified);
CREATE INDEX idx_vendors_rating ON vendors(rating_average DESC);
CREATE INDEX idx_vendors_business_name ON vendors USING gin(to_tsvector('english', business_name));
```

#### vendor_services
```sql
CREATE TABLE vendor_services (
  id BIGSERIAL PRIMARY KEY,
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price_range TEXT,
  category TEXT,
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_vendor_services_vendor_id ON vendor_services(vendor_id);
CREATE INDEX idx_vendor_services_category ON vendor_services(category);
```

### Geographic Data

#### locations
```sql
CREATE TABLE locations (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  geom GEOGRAPHY(Point, 4326) NOT NULL,
  vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
  location_type TEXT CHECK (location_type IN ('campus', 'hostel', 'restaurant', 'service', 'landmark')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Spatial indexes
CREATE INDEX idx_locations_geom ON locations USING GIST(geom);
CREATE INDEX idx_locations_vendor_id ON locations(vendor_id);
CREATE INDEX idx_locations_type ON locations(location_type);
```

**Spatial Queries Example:**
```sql
-- Find vendors within 5km of a point
SELECT v.*, l.address, ST_Distance(l.geom, ST_Point(-74.0060, 40.7128)::geography) as distance
FROM vendors v
JOIN locations l ON v.id = l.vendor_id
WHERE ST_DWithin(l.geom, ST_Point(-74.0060, 40.7128)::geography, 5000)
ORDER BY distance;
```

### Academic Resources

#### resources
```sql
CREATE TABLE resources (
  id BIGSERIAL PRIMARY KEY,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('pdf','code','note','project','video','audio')) NOT NULL,
  subject TEXT NOT NULL,
  course_code TEXT,
  university TEXT,
  academic_year TEXT,
  semester TEXT,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT,
  download_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  rating_average DECIMAL(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  is_public BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_resources_owner_id ON resources(owner_id);
CREATE INDEX idx_resources_type ON resources(type);
CREATE INDEX idx_resources_subject ON resources(subject);
CREATE INDEX idx_resources_university ON resources(university);
CREATE INDEX idx_resources_public ON resources(is_public);
CREATE INDEX idx_resources_featured ON resources(is_featured);
CREATE INDEX idx_resources_rating ON resources(rating_average DESC);
CREATE INDEX idx_resources_downloads ON resources(download_count DESC);
CREATE INDEX idx_resources_created_at ON resources(created_at DESC);
CREATE INDEX idx_resources_tags ON resources USING gin(tags);

-- Full-text search index
CREATE INDEX idx_resources_search ON resources USING gin(
  to_tsvector('english', title || ' ' || COALESCE(description, ''))
);
```

### Reviews and Ratings

#### resource_reviews
```sql
CREATE TABLE resource_reviews (
  id BIGSERIAL PRIMARY KEY,
  resource_id BIGINT REFERENCES resources(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(resource_id, reviewer_id) -- One review per user per resource
);

CREATE INDEX idx_resource_reviews_resource_id ON resource_reviews(resource_id);
CREATE INDEX idx_resource_reviews_reviewer_id ON resource_reviews(reviewer_id);
CREATE INDEX idx_resource_reviews_rating ON resource_reviews(rating);
```

#### vendor_reviews
```sql
CREATE TABLE vendor_reviews (
  id BIGSERIAL PRIMARY KEY,
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  service_quality_rating INTEGER CHECK (service_quality_rating >= 1 AND service_quality_rating <= 5),
  value_rating INTEGER CHECK (value_rating >= 1 AND value_rating <= 5),
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(vendor_id, reviewer_id)
);
```

### Events and Activities

#### events
```sql
CREATE TABLE events (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT CHECK (event_type IN ('academic', 'social', 'workshop', 'seminar', 'career', 'sports')),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  location_id BIGINT REFERENCES locations(id) ON DELETE SET NULL,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  registration_required BOOLEAN DEFAULT FALSE,
  registration_deadline TIMESTAMPTZ,
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_type ON events(event_type);
CREATE INDEX idx_events_location_id ON events(location_id);
CREATE INDEX idx_events_created_by ON events(created_by);
CREATE INDEX idx_events_active ON events(is_active);
```

#### event_participants
```sql
CREATE TABLE event_participants (
  id BIGSERIAL PRIMARY KEY,
  event_id BIGINT REFERENCES events(id) ON DELETE CASCADE,
  participant_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  registration_date TIMESTAMPTZ DEFAULT NOW(),
  attendance_status TEXT CHECK (attendance_status IN ('registered', 'attended', 'no_show')) DEFAULT 'registered',
  
  UNIQUE(event_id, participant_id)
);
```

### File Management

#### file_uploads
```sql
CREATE TABLE file_uploads (
  id BIGSERIAL PRIMARY KEY,
  filename TEXT NOT NULL UNIQUE,
  original_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  upload_type TEXT CHECK (upload_type IN ('resource', 'profile', 'vendor', 'event')),
  uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_file_uploads_filename ON file_uploads(filename);
CREATE INDEX idx_file_uploads_uploaded_by ON file_uploads(uploaded_by);
CREATE INDEX idx_file_uploads_type ON file_uploads(upload_type);
```

### Notifications

#### notifications
```sql
CREATE TABLE notifications (
  id BIGSERIAL PRIMARY KEY,
  recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_recipient_id ON notifications(recipient_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
```

---

## Row-Level Security (RLS)

### Enable RLS on all tables
```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
```

### Security Policies

#### Profile Access
```sql
-- Users can view their own profile
CREATE POLICY "View own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Public profiles visible to all authenticated users
CREATE POLICY "View public profiles" ON profiles
  FOR SELECT USING (auth.role() = 'authenticated');
```

#### Resource Access
```sql
-- Public resources visible to all
CREATE POLICY "View public resources" ON resources
  FOR SELECT USING (is_public = true OR auth.uid() = owner_id);

-- Resource owners can manage their resources
CREATE POLICY "Owners manage resources" ON resources
  FOR ALL USING (auth.uid() = owner_id);

-- Authenticated users can create resources
CREATE POLICY "Create resources" ON resources
  FOR INSERT WITH CHECK (auth.uid() = owner_id);
```

#### Vendor Access
```sql
-- Vendors can manage their own vendor profile
CREATE POLICY "Vendors manage their profile" ON vendors
  FOR ALL USING (auth.uid() = id);

-- All authenticated users can view vendors
CREATE POLICY "View vendors" ON vendors
  FOR SELECT USING (auth.role() = 'authenticated');
```

#### Review Policies
```sql
-- Users can create reviews
CREATE POLICY "Create reviews" ON resource_reviews
  FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Users can view all reviews
CREATE POLICY "View reviews" ON resource_reviews
  FOR SELECT USING (true);

-- Users can update their own reviews
CREATE POLICY "Update own reviews" ON resource_reviews
  FOR UPDATE USING (auth.uid() = reviewer_id);
```

---

## Database Functions and Triggers

### Update Rating Averages
```sql
CREATE OR REPLACE FUNCTION update_resource_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE resources 
  SET 
    rating_average = (
      SELECT ROUND(AVG(rating)::numeric, 2) 
      FROM resource_reviews 
      WHERE resource_id = NEW.resource_id
    ),
    rating_count = (
      SELECT COUNT(*) 
      FROM resource_reviews 
      WHERE resource_id = NEW.resource_id
    )
  WHERE id = NEW.resource_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for resource reviews
CREATE TRIGGER trigger_update_resource_rating
  AFTER INSERT OR UPDATE OR DELETE ON resource_reviews
  FOR EACH ROW EXECUTE FUNCTION update_resource_rating();
```

### Update Profile Timestamp
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to relevant tables
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resources_updated_at 
  BEFORE UPDATE ON resources 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Full-Text Search Function
```sql
CREATE OR REPLACE FUNCTION search_resources(
  search_query TEXT,
  subject_filter TEXT DEFAULT NULL,
  type_filter TEXT DEFAULT NULL,
  university_filter TEXT DEFAULT NULL
)
RETURNS TABLE(
  id BIGINT,
  title TEXT,
  description TEXT,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.title,
    r.description,
    ts_rank(to_tsvector('english', r.title || ' ' || COALESCE(r.description, '')), 
            plainto_tsquery('english', search_query)) as rank
  FROM resources r
  WHERE 
    to_tsvector('english', r.title || ' ' || COALESCE(r.description, '')) @@ 
    plainto_tsquery('english', search_query)
    AND (subject_filter IS NULL OR r.subject = subject_filter)
    AND (type_filter IS NULL OR r.type = type_filter)
    AND (university_filter IS NULL OR r.university = university_filter)
    AND r.is_public = true
  ORDER BY rank DESC, r.created_at DESC;
END;
$$ LANGUAGE plpgsql;
```

---

## Performance Optimization

### Index Strategy
```sql
-- Composite indexes for common query patterns
CREATE INDEX idx_resources_subject_type ON resources(subject, type);
CREATE INDEX idx_resources_university_subject ON resources(university, subject);
CREATE INDEX idx_resources_public_rating ON resources(is_public, rating_average DESC) WHERE is_public = true;

-- Partial indexes for specific conditions
CREATE INDEX idx_resources_featured ON resources(created_at DESC) WHERE is_featured = true;
CREATE INDEX idx_vendors_verified ON vendors(rating_average DESC) WHERE verified = true;

-- Expression indexes for case-insensitive searches
CREATE INDEX idx_profiles_email_lower ON profiles(lower(email));
CREATE INDEX idx_vendors_business_name_lower ON vendors(lower(business_name));
```

### Query Optimization Examples
```sql
-- Optimized resource search with facets
WITH resource_stats AS (
  SELECT 
    subject,
    type,
    university,
    COUNT(*) as count
  FROM resources 
  WHERE is_public = true
  GROUP BY subject, type, university
)
SELECT 
  r.*,
  p.first_name || ' ' || p.last_name as owner_name
FROM resources r
JOIN profiles p ON r.owner_id = p.id
WHERE r.is_public = true
ORDER BY r.rating_average DESC, r.created_at DESC
LIMIT 20;

-- Geographic vendor search
SELECT 
  v.*,
  l.address,
  ST_Distance(l.geom, ST_Point($1, $2)::geography) as distance_meters
FROM vendors v
JOIN locations l ON v.id = l.vendor_id
WHERE 
  v.verified = true
  AND ST_DWithin(l.geom, ST_Point($1, $2)::geography, 5000)
ORDER BY distance_meters
LIMIT 20;
```

### Connection Pooling
```typescript
// Drizzle with Neon serverless
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const db = drizzle(pool);
```

---

## Data Migration and Seeding

### Migration Scripts
```sql
-- Add new column to existing table
ALTER TABLE resources ADD COLUMN IF NOT EXISTS academic_level TEXT;

-- Update existing data
UPDATE resources 
SET academic_level = CASE 
  WHEN course_code LIKE '1%' THEN 'undergraduate'
  WHEN course_code LIKE '2%' THEN 'undergraduate'
  WHEN course_code LIKE '3%' THEN 'undergraduate'
  WHEN course_code LIKE '4%' THEN 'undergraduate'
  ELSE 'graduate'
END
WHERE academic_level IS NULL;

-- Add constraint after data update
ALTER TABLE resources ADD CONSTRAINT check_academic_level 
CHECK (academic_level IN ('undergraduate', 'graduate', 'doctoral'));
```

### Seed Data
```sql
-- Insert sample subjects
INSERT INTO subjects (name, category) VALUES
('Computer Science', 'Engineering'),
('Mathematics', 'Science'),
('Physics', 'Science'),
('Business Administration', 'Business'),
('Psychology', 'Social Science');

-- Insert sample locations
INSERT INTO locations (name, address, geom, location_type) VALUES
('Main Campus Library', '123 University Ave', ST_Point(-74.0060, 40.7128), 'campus'),
('Student Union Building', '456 Campus Dr', ST_Point(-74.0050, 40.7138), 'campus'),
('Computer Science Building', '789 Tech Blvd', ST_Point(-74.0070, 40.7118), 'campus');
```

---

## Backup and Maintenance

### Automated Backups
```sql
-- Create backup
pg_dump -h hostname -U username -d studyconnect > backup_$(date +%Y%m%d).sql

-- Restore backup
psql -h hostname -U username -d studyconnect < backup_20250918.sql
```

### Maintenance Tasks
```sql
-- Analyze tables for query planner
ANALYZE;

-- Vacuum to reclaim space
VACUUM ANALYZE;

-- Reindex for performance
REINDEX DATABASE studyconnect;

-- Update statistics
UPDATE pg_stat_user_tables SET n_tup_ins = 0, n_tup_upd = 0, n_tup_del = 0;
```

### Monitoring Queries
```sql
-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check index usage
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_tup_read DESC;

-- Active connections
SELECT count(*) FROM pg_stat_activity WHERE state = 'active';
```

---

## Environment-Specific Configurations

### Development
```env
DATABASE_URL=postgresql://localhost:5432/studyconnect_dev
PGDATABASE=studyconnect_dev
PGUSER=developer
PGPASSWORD=devpassword
PGHOST=localhost
PGPORT=5432
```

### Production (Neon)
```env
DATABASE_URL=postgresql://username:password@ep-example.us-east-2.aws.neon.tech/studyconnect
PGDATABASE=studyconnect
PGUSER=neon_user
PGPASSWORD=secure_password
PGHOST=ep-example.us-east-2.aws.neon.tech
PGPORT=5432
```

### Connection String Format
```
postgresql://[user[:password]@][host][:port][/database][?param1=value1&...]
```

This database documentation provides a comprehensive guide to the StudyConnect database schema, security policies, performance optimizations, and maintenance procedures.