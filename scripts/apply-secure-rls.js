const { Client } = require('pg');

// Use the password URL encoded safely
const encodedPassword = encodeURIComponent('reaganmbao31?');
const connectionString = `postgres://postgres:${encodedPassword}@db.jjbiigtnwjxokkkucwcq.supabase.co:5432/postgres`;

const client = new Client({
  connectionString,
});

async function applyRLS() {
  try {
    await client.connect();
    console.log('Connected to Supabase database successfully!');

    // The SQL to secure the installation
    // 1. Enable RLS everywhere
    // 2. Revoke the "ALL" open grants
    // 3. Create SELECT for anon
    // 4. Create ALL for authenticated
    // 5. Setup Storage policies
    const sql = `
      -- 1. Secure Frontend Tables
      ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.highlights ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.sermons ENABLE ROW LEVEL SECURITY;

      -- Revoke the overly permissive grants
      REVOKE ALL ON public.gallery FROM anon;
      REVOKE ALL ON public.highlights FROM anon;
      REVOKE ALL ON public.site_content FROM anon;
      REVOKE ALL ON public.visitors FROM anon;
      REVOKE ALL ON public.users FROM anon;
      REVOKE ALL ON public.events FROM anon;
      REVOKE ALL ON public.sermons FROM anon;

      -- Create Read-Only (SELECT) policies for anon & authenticated
      DO $$
      DECLARE
          t text;
      BEGIN
          FOR t IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
              EXECUTE format('DROP POLICY IF EXISTS "Enable read access for all" ON %I', t);
              EXECUTE format('CREATE POLICY "Enable read access for all" ON %I FOR SELECT USING (true)', t);
              
              EXECUTE format('DROP POLICY IF EXISTS "Enable full access for authenticated" ON %I', t);
              EXECUTE format('CREATE POLICY "Enable full access for authenticated" ON %I USING (auth.role() = ''authenticated'')', t);
          END LOOP;
      END
      $$;

      -- Ensure proper grants
      GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
      GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
      GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

      -- 2. Create Storage Bucket (media) if not exists
      INSERT INTO storage.buckets (id, name, public) 
      VALUES ('media', 'media', true)
      ON CONFLICT (id) DO NOTHING;

      -- 3. Secure Storage Objects
      -- Allow public access to read files
      DROP POLICY IF EXISTS "Public Access" ON storage.objects;
      CREATE POLICY "Public Access" 
      ON storage.objects FOR SELECT 
      USING (bucket_id = 'media');

      -- Allow authenticated users to insert/update/delete
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
    `;

    console.log('Applying secure RLS policies and Storage configuration...');
    await client.query(sql);
    console.log('Security protocols deployed successfully!');
    
  } catch (err) {
    console.error('Database setup failed:', err.message);
  } finally {
    await client.end();
  }
}

applyRLS();
