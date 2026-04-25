const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://jjbiigtnwjxokkkucwcq.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqYmlpZ3Rud2p4b2tra3Vjd2NxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTEzNTcyNywiZXhwIjoyMDkwNzExNzI3fQ.yJh29rdOA4WR2f7BpSRRaGYbzkgtTj7i3h3FSejWEgk';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function createBucket() {
  console.log('--- INITIALIZING STORAGE BUCKET ---');

  const { data, error } = await supabase.storage.createBucket('media', {
    public: true,
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'video/mp4', 'video/quicktime'],
    fileSizeLimit: 52428800 // 50MB
  });

  if (error) {
    if (error.message.includes('already exists')) {
      console.log('  Bucket "media" already exists.');
    } else {
      console.error('  Error creating bucket:', error.message);
    }
  } else {
    console.log('  Successfully created "media" bucket.');
  }

  console.log('--- STORAGE INITIALIZATION COMPLETE ---');
}

createBucket();
