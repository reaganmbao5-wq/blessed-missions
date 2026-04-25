const { Client } = require('pg');

const connectionString = 'postgresql://postgres:reaganmbao31%3F@db.jjbiigtnwjxokkkucwcq.supabase.co:5432/postgres';

const client = new Client({
  connectionString: connectionString,
});

async function checkRLS() {
  console.log('--- CHECKING RLS STATUS ---');
  try {
    await client.connect();
    
    // Query to check if RLS is enabled for public tables
    const res = await client.query(`
      SELECT tablename, rowsecurity 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename IN ('users', 'gallery', 'highlights', 'site_content', 'visitors');
    `);
    
    console.log('RLS Status:');
    res.rows.forEach(row => {
      console.log(`  - ${row.tablename}: RLS ${row.rowsecurity ? 'ENABLED' : 'DISABLED'}`);
    });

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

checkRLS();
