-- =============================================
-- Blessed Missions: High Security & Storage Fix
-- Run this in Supabase SQL Editor
-- =============================================

-- 1. Secure Frontend Tables (Re-enable RLS)
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- 2. Revoke the open privileges that were granted to everyone
REVOKE ALL ON public.gallery FROM anon;
REVOKE ALL ON public.highlights FROM anon;
REVOKE ALL ON public.site_content FROM anon;
REVOKE ALL ON public.visitors FROM anon;
REVOKE ALL ON public.users FROM anon;
REVOKE ALL ON public.events FROM anon;

-- 3. Safely drop and recreate proper policies
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Enable read access for all" ON %I;', t);
        EXECUTE format('CREATE POLICY "Enable read access for all" ON %I FOR SELECT USING (true);', t);
        
        EXECUTE format('DROP POLICY IF EXISTS "Enable full access for authenticated" ON %I;', t);
        EXECUTE format('CREATE POLICY "Enable full access for authenticated" ON %I USING (auth.role() = ''authenticated'');', t);
    END LOOP;
END
$$;

-- Allow anonymous users to READ the website data safely
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
-- Allow logged-in dashboard users to edit data
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

-- 4. Create the "media" Storage Bucket if it does not exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Secure the Storage Objects so file uploading works on the frontend!
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'media');

DROP POLICY IF EXISTS "Authenticated Insert" ON storage.objects;
CREATE POLICY "Authenticated Insert" 
ON storage.objects FOR INSERT 
WITH CHECK (auth.role() = 'authenticated' AND bucket_id = 'media');

DROP POLICY IF EXISTS "Authenticated Update" ON storage.objects;
CREATE POLICY "Authenticated Update" 
ON storage.objects FOR UPDATE 
USING (auth.role() = 'authenticated' AND bucket_id = 'media');

DROP POLICY IF EXISTS "Authenticated Delete" ON storage.objects;
CREATE POLICY "Authenticated Delete" 
ON storage.objects FOR DELETE 
USING (auth.role() = 'authenticated' AND bucket_id = 'media');
