const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://jjbiigtnwjxokkkucwcq.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqYmlpZ3Rud2p4b2tra3Vjd2NxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTEzNTcyNywiZXhwIjoyMDkwNzExNzI3fQ.yJh29rdOA4WR2f7BpSRRaGYbzkgtTj7i3h3FSejWEgk';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const DEFAULT_PASSWORD = 'Blessed2026!';

const USERS_TO_CREATE = [
  { email: 'town@blessed.com', name: 'Town Media Crew', role: 'media_town', campus: 'kabwe' },
  { email: 'main@blessed.com', name: 'Main Media Crew', role: 'media_main', campus: 'main' },
  { email: 'pastor@blessed.com', name: 'Pastor Reuben', role: 'pastor', campus: 'main' },
  { email: 'admin@blessed.com', name: 'Super Admin', role: 'admin', campus: 'main' }
];

async function seed() {
  console.log('--- STARTING USER SEEDING ---');

  for (const user of USERS_TO_CREATE) {
    console.log(`Checking user: ${user.email}...`);

    // 1. Create/Check User in auth.users
    const { data: authData, error: authError, status: authStatus } = await supabase.auth.admin.createUser({
      email: user.email,
      password: DEFAULT_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: user.name }
    });

    if (authError) {
      if (authStatus === 422 || authError.message.includes('already registered')) {
        console.log(`  User ${user.email} already exists in Auth. Retrieving ID...`);
        const { data: usersData } = await supabase.auth.admin.listUsers();
        const existing = usersData.users.find(u => u.email === user.email);
        if (existing) {
          user.id = existing.id;
        }
      } else {
        console.error(`  Error creating auth user ${user.email}:`, authError.message);
        continue;
      }
    } else {
      console.log(`  Created auth user: ${authData.user.id}`);
      user.id = authData.user.id;
    }

    // 2. Upsert into public.users
    if (user.id) {
       console.log(`  Updating public profile for ${user.email} with role ${user.role}...`);
       const { error: profileError } = await supabase
         .from('users')
         .upsert({
           id: user.id,
           name: user.name,
           email: user.email,
           role: user.role,
           campus: user.campus
         }, { onConflict: 'id' });

       if (profileError) {
         console.error(`  Error updating public profile:`, profileError.message);
       } else {
         console.log(`  Successfully seeded ${user.email}`);
       }
    }
  }

  console.log('--- SEEDING COMPLETE ---');
}

seed();
