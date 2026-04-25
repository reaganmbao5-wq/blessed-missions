async function getSchema() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    console.error('Missing env vars');
    return;
  }

  try {
    const res = await fetch(`${url}/rest/v1/?apikey=${anonKey}`);
    const spec = await res.json();
    
    console.log('All available tables:');
    console.log(Object.keys(spec.definitions || {}).join(', '));
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

getSchema();
