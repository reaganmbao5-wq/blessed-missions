-- Initialize complete reset for schema changes
DROP TABLE IF EXISTS public.highlights CASCADE;
DROP TABLE IF EXISTS public.sermons CASCADE;
DROP TABLE IF EXISTS public.gallery CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;
DROP TABLE IF EXISTS public.visitors CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- 1. Create the Users Table (Links to auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id uuid REFERENCES auth.users NOT NULL PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'media_town' CHECK (role IN ('media_town', 'media_main', 'pastor', 'admin')),
  campus text DEFAULT 'kabwe' CHECK (campus IN ('kabwe', 'main')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Gallery Table
CREATE TABLE IF NOT EXISTS public.gallery (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  image_url text NOT NULL,
  campus text NOT NULL CHECK (campus IN ('kabwe', 'main')),
  is_featured boolean DEFAULT false,
  uploaded_by uuid REFERENCES public.users(id),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Highlights Table
CREATE TABLE IF NOT EXISTS public.highlights (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  video_url text NOT NULL, -- Either external Link (YouTube) or direct Supabase Storage URL
  video_type text NOT NULL DEFAULT 'link' CHECK (video_type IN ('file', 'link')),
  thumbnail text NOT NULL,
  summary text,
  description text,
  author text,
  session_date timestamp with time zone,
  campus text NOT NULL CHECK (campus IN ('kabwe', 'main')),
  is_featured boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Site Content Table (Hero, Landing Boxes)
CREATE TABLE IF NOT EXISTS public.site_content (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  section text NOT NULL CHECK (section IN ('hero_images', 'landing_worship', 'landing_groups', 'landing_baptisms')),
  content_url text NOT NULL,
  campus text NOT NULL CHECK (campus IN ('kabwe', 'main')),
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create Events Table
CREATE TABLE IF NOT EXISTS public.events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  date timestamp with time zone NOT NULL,
  description text,
  image text NOT NULL,
  campus text NOT NULL CHECK (campus IN ('kabwe', 'main')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create Visitors & Souls Table
CREATE TABLE IF NOT EXISTS public.visitors (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  sex text NOT NULL CHECK (sex IN ('Male', 'Female')),
  contact text NOT NULL,
  program_year text NOT NULL,
  hostel text NOT NULL,
  campus text NOT NULL CHECK (campus IN ('kabwe', 'main')),
  needs_help boolean DEFAULT false,
  needs_prayer boolean DEFAULT false,
  date_recorded timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  recorded_by uuid REFERENCES public.users(id) NOT NULL
);

-- Disable Row Level Security temporarily for testing
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.highlights DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.events DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitors DISABLE ROW LEVEL SECURITY;

-- 6. Trigger to Create User Profile in public.users on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, name, email)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'full_name', 'Guest User'), new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Cleanup existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
