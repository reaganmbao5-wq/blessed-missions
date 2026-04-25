const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkColumns() {
  const { data, error } = await supabase.from('highlights').select('*').limit(1);
  if (error) {
    console.error('Error fetching highlights:', error.message);
  } else {
    console.log('Successfully fetched highlights. Structure:');
    if (data.length > 0) {
      console.log(Object.keys(data[0]));
    } else {
      console.log('No rows exist, attempting to query with a fake condition to get error context or inserting a fake row and rolling back...');
      
      // Attempt insert to trigger exact errors
      const res = await supabase.from('highlights').insert({ fake_column_to_trigger_error: 1 });
      console.log('Insert error details:', res.error);
    }
  }
}

checkColumns();
