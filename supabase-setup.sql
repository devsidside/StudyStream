-- Supabase Authentication Setup Compatible with Existing Schema
-- Run this SQL in your Supabase project's SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table compatible with existing schema but linked to auth.users
-- Note: This preserves the existing varchar ID structure while enabling Supabase Auth
CREATE TABLE IF NOT EXISTS public.users (
  id text PRIMARY KEY, -- Using text to match auth.uid()::text
  email text UNIQUE,
  first_name text,
  last_name text,
  profile_image_url text,
  role text DEFAULT 'student', -- student, vendor, admin
  university text,
  course text,
  year text,
  course_year text, -- Legacy field - keeping for backward compatibility
  business_type text,
  business_name text,
  created_at timestamptz DEFAULT NOW(),
  updated_at timestamptz DEFAULT NOW()
);

-- Enable Row Level Security on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid()::text = id) 
  WITH CHECK (auth.uid()::text = id);

-- Create a function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  safe_role text := 'student';
BEGIN
  -- Security: Only allow 'student' or 'vendor' roles, default to 'student'
  -- Never trust client-provided role for admin privileges
  IF NEW.raw_user_meta_data->>'role' = 'vendor' THEN
    safe_role := 'vendor';
  END IF;
  
  INSERT INTO public.users (
    id, 
    email, 
    first_name, 
    last_name,
    role,
    university,
    course,
    year,
    business_type,
    business_name
  )
  VALUES (
    NEW.id::text,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', NEW.raw_user_meta_data->>'firstName'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', NEW.raw_user_meta_data->>'lastName'),
    safe_role, -- Use safe_role instead of trusting client input
    NEW.raw_user_meta_data->>'university',
    NEW.raw_user_meta_data->>'course',
    NEW.raw_user_meta_data->>'year',
    NEW.raw_user_meta_data->>'business_type',
    NEW.raw_user_meta_data->>'business_name'
  )
  ON CONFLICT (id) DO NOTHING; -- Prevent duplicate inserts
  
  RETURN NEW;
END;
$$;

-- Create trigger for automatic user profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create a function to prevent role changes by regular users
CREATE OR REPLACE FUNCTION public.protect_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Prevent role changes unless admin (this requires admin role to be set server-side)
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    -- Only allow role changes if current user has admin privileges
    -- For now, we'll completely forbid role changes via client updates
    RAISE EXCEPTION 'Role changes are not permitted via client updates';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to protect role changes
DROP TRIGGER IF EXISTS protect_user_role_trigger ON public.users;
CREATE TRIGGER protect_user_role_trigger
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.protect_user_role();

-- Enable RLS for common tables with basic security policies
DO $$
BEGIN
  -- Notes table - basic protection
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'notes') THEN
    ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
    
    -- Basic read policy - allow read access to authenticated users
    CREATE POLICY "Authenticated users can read notes" ON public.notes
      FOR SELECT USING (auth.role() = 'authenticated');
    
    -- Check if uploader_id column exists for write policies
    IF EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'notes' AND column_name = 'uploader_id'
    ) THEN
      CREATE POLICY "Users can create own notes" ON public.notes
        FOR INSERT WITH CHECK (uploader_id = auth.uid()::text);
      CREATE POLICY "Users can update own notes" ON public.notes
        FOR UPDATE USING (uploader_id = auth.uid()::text) 
        WITH CHECK (uploader_id = auth.uid()::text);
      CREATE POLICY "Users can delete own notes" ON public.notes
        FOR DELETE USING (uploader_id = auth.uid()::text);
    ELSE
      -- Fallback: only allow read if owner column doesn't exist
      CREATE POLICY "Read only notes fallback" ON public.notes
        FOR INSERT WITH CHECK (false);
      CREATE POLICY "No updates notes fallback" ON public.notes
        FOR UPDATE USING (false);
      CREATE POLICY "No deletes notes fallback" ON public.notes
        FOR DELETE USING (false);
    END IF;
  END IF;

  -- Vendors table - basic protection
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'vendors') THEN
    ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
    
    -- Allow reading all vendors (typically public information)
    CREATE POLICY "Anyone can read vendors" ON public.vendors
      FOR SELECT USING (true);
    
    -- Check if owner_id column exists for write policies
    IF EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'vendors' AND column_name = 'owner_id'
    ) THEN
      CREATE POLICY "Users can create own vendors" ON public.vendors
        FOR INSERT WITH CHECK (owner_id = auth.uid()::text);
      CREATE POLICY "Users can update own vendors" ON public.vendors
        FOR UPDATE USING (owner_id = auth.uid()::text) 
        WITH CHECK (owner_id = auth.uid()::text);
      CREATE POLICY "Users can delete own vendors" ON public.vendors
        FOR DELETE USING (owner_id = auth.uid()::text);
    ELSE
      -- Fallback: restrict writes if owner column doesn't exist
      CREATE POLICY "Authenticated can create vendors fallback" ON public.vendors
        FOR INSERT WITH CHECK (auth.role() = 'authenticated');
      CREATE POLICY "No updates vendors fallback" ON public.vendors
        FOR UPDATE USING (false);
      CREATE POLICY "No deletes vendors fallback" ON public.vendors
        FOR DELETE USING (false);
    END IF;
  END IF;

  -- Accommodations table - basic protection
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'accommodations') THEN
    ALTER TABLE public.accommodations ENABLE ROW LEVEL SECURITY;
    
    -- Allow reading accommodations (typically public)
    CREATE POLICY "Anyone can read accommodations" ON public.accommodations
      FOR SELECT USING (true);
    
    -- Check for owner column - if not found, restrict writes heavily
    IF EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'accommodations' AND column_name IN ('vendor_id', 'owner_id')
    ) THEN
      -- Allow creation and management based on ownership
      CREATE POLICY "Users can create accommodations" ON public.accommodations
        FOR INSERT WITH CHECK (
          CASE 
            WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'accommodations' AND column_name = 'vendor_id') 
            THEN vendor_id::text = auth.uid()::text
            ELSE owner_id::text = auth.uid()::text
          END
        );
    ELSE
      -- No ownership column found - restrict writes completely for security
      CREATE POLICY "No accommodation writes without ownership" ON public.accommodations
        FOR INSERT WITH CHECK (false);
      CREATE POLICY "No accommodation updates without ownership" ON public.accommodations
        FOR UPDATE USING (false);  
      CREATE POLICY "No accommodation deletes without ownership" ON public.accommodations
        FOR DELETE USING (false);
    END IF;
  END IF;

  -- Tutors table - basic protection
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tutors') THEN
    ALTER TABLE public.tutors ENABLE ROW LEVEL SECURITY;
    
    -- Allow reading tutors (typically public)
    CREATE POLICY "Anyone can read tutors" ON public.tutors
      FOR SELECT USING (true);
    
    -- Check if user_id column exists for write policies
    IF EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'tutors' AND column_name = 'user_id'
    ) THEN
      CREATE POLICY "Users can create own tutor profile" ON public.tutors
        FOR INSERT WITH CHECK (user_id = auth.uid()::text);
      CREATE POLICY "Users can update own tutor profile" ON public.tutors
        FOR UPDATE USING (user_id = auth.uid()::text) 
        WITH CHECK (user_id = auth.uid()::text);
      CREATE POLICY "Users can delete own tutor profile" ON public.tutors
        FOR DELETE USING (user_id = auth.uid()::text);
    ELSE
      -- Fallback: restrict writes if user column doesn't exist
      CREATE POLICY "Authenticated can create tutors fallback" ON public.tutors
        FOR INSERT WITH CHECK (auth.role() = 'authenticated');
      CREATE POLICY "No updates tutors fallback" ON public.tutors
        FOR UPDATE USING (false);
      CREATE POLICY "No deletes tutors fallback" ON public.tutors
        FOR DELETE USING (false);
    END IF;
  END IF;
END $$;

-- Enable realtime for tables (idempotent)
DO $$
BEGIN
  -- Add users table to realtime publication if not already added
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'users'
    AND schemaname = 'public'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
  END IF;
  
  -- Add other tables to realtime publication if they exist and not already added
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'notes') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables 
      WHERE pubname = 'supabase_realtime' 
      AND tablename = 'notes'
      AND schemaname = 'public'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.notes;
    END IF;
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'accommodations') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables 
      WHERE pubname = 'supabase_realtime' 
      AND tablename = 'accommodations'
      AND schemaname = 'public'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.accommodations;
    END IF;
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'vendors') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables 
      WHERE pubname = 'supabase_realtime' 
      AND tablename = 'vendors'
      AND schemaname = 'public'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.vendors;
    END IF;
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'tutors') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables 
      WHERE pubname = 'supabase_realtime' 
      AND tablename = 'tutors'
      AND schemaname = 'public'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.tutors;
    END IF;
  END IF;
END $$;

-- Set replica identity for better realtime performance (optional)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'notes') THEN
    ALTER TABLE public.notes REPLICA IDENTITY FULL;
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'accommodations') THEN
    ALTER TABLE public.accommodations REPLICA IDENTITY FULL;
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'vendors') THEN
    ALTER TABLE public.vendors REPLICA IDENTITY FULL;
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'tutors') THEN
    ALTER TABLE public.tutors REPLICA IDENTITY FULL;
  END IF;
END $$;