const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...val] = line.split('=');
  if (key && val) {
    env[key.trim()] = val.join('=').trim();
  }
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function seedUsers() {
  console.log('Creating users...');

  // Admin User
  const { data: adminData, error: adminError } = await supabase.auth.admin.createUser({
    email: 'admin@vitality.com',
    password: 'admin123',
    email_confirm: true,
  });

  if (adminError && !adminError.message.includes('already exists')) {
    console.error('Error creating admin auth:', adminError.message);
  } else if (adminData.user) {
    await supabase.from('profiles').upsert({
      id: adminData.user.id,
      username: 'admin',
      email: 'admin@vitality.com',
      role: 'admin'
    });
    console.log('Admin user created successfully.');
  } else {
    console.log('Admin user already exists.');
  }

  // Normal User
  const { data: userData, error: userError } = await supabase.auth.admin.createUser({
    email: 'user@vitality.com',
    password: 'user123',
    email_confirm: true,
  });

  if (userError && !userError.message.includes('already exists')) {
    console.error('Error creating normal user auth:', userError.message);
  } else if (userData.user) {
    await supabase.from('profiles').upsert({
      id: userData.user.id,
      username: 'shopper',
      email: 'user@vitality.com',
      role: 'user'
    });
    console.log('Normal user created successfully.');
  } else {
    console.log('Normal user already exists.');
  }
}

seedUsers();
