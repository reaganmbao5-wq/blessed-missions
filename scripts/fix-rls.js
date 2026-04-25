const { Client } = require('pg');

const connectionString = 'postgresql://postgres:reaganmbao31%3F@db.jjbiigtnwjxokkkucwcq.supabase.co:5432/postgres';

const client = new Client({
  connectionString: connectionString,
});

const sql = `
-- Disable Row Level Security (RLS) for the main tables to allow Media Crew uploads
ALTER TABLE public.gallery DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.highlights DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitors DISABLE ROW LEVEL SECURITY;

-- Grant all permissions on these tables to authenticated users
GRANT ALL ON TABLE public.gallery TO authenticated;
GRANT ALL ON TABLE public.highlights TO authenticated;
GRANT ALL ON TABLE public.site_content TO authenticated;
GRANT ALL ON TABLE public.visitors TO authenticated;

-- Ensure public access to profiles for the login flow
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE public.users TO authenticated;
GRANT SELECT ON TABLE public.users TO anon;
`;

async function runFix() {
  console.log('--- CONNECTING TO SUPABASE DATABASE ---');
  try {
    await client.connect();
    console.log('  Connected successfully.');
    
    console.log('  Executing RLS fix SQL...');
    await client.query(sql);
    
    console.log('--- RLS FIX COMPLETE ---');
    console.log('  All tables are now unlocked for Media Crew and Staff.');
  } catch (err) {
    console.error('  Database error:', err.message);
  } finally {
    await client.end();
  }
}

runFix();
