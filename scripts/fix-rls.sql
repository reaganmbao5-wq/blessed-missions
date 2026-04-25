-- =============================================
-- Blessed Missions: RLS Fix & Policy Setup
-- Run this in Supabase SQL Editor
-- =============================================

-- 1. DISABLE RLS on all ministry tables (fastest fix for development)
ALTER TABLE public.gallery DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.highlights DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitors DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- 2. Grant full access to authenticated and anon roles (belt-and-suspenders)
GRANT ALL ON public.gallery TO authenticated, anon, service_role;
GRANT ALL ON public.highlights TO authenticated, anon, service_role;
GRANT ALL ON public.site_content TO authenticated, anon, service_role;
GRANT ALL ON public.visitors TO authenticated, anon, service_role;
GRANT ALL ON public.users TO authenticated, anon, service_role;

-- 3. Grant usage on sequences (for auto-increment IDs)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated, anon, service_role;

-- Verify RLS status
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'gallery', 'highlights', 'site_content', 'visitors');
