const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// password is url encoded (reaganmbao31? -> reaganmbao31%3F)
const connectionString = 'postgres://postgres.jjbiigtnwjxokkkucwcq:reaganmbao31%3F@aws-1-eu-central-1.pooler.supabase.com:6543/postgres';

const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function setupDatabase() {
  try {
    await client.connect();
    console.log('Connected to Supabase database successfully!');

    const sqlPath = path.join(__dirname, 'supabase', 'schema.sql');
    let sql = fs.readFileSync(sqlPath, 'utf8');
    // Simple sanitization for potential backticks if copied as markdown
    sql = sql.replace(/```sql/g, '').replace(/```/g, '');

    console.log('Executing schema script...');
    await client.query(sql);
    console.log('Tables created successfully!');
    
  } catch (err) {
    console.error('Database setup failed:', err.message);
  } finally {
    await client.end();
  }
}

setupDatabase();
