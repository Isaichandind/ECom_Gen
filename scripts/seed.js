/* eslint-disable @typescript-eslint/no-require-imports */
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read env file
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

const newProducts = [
  { name: 'Prod 1 - 250g', description: 'Premium Superfood Prod 1', price: 450, inventory_count: 50 },
  { name: 'Prod 2 - 500g', description: 'Premium Superfood Prod 2', price: 800, inventory_count: 45 },
  { name: 'Prod 3 - 1kg', description: 'Premium Superfood Prod 3', price: 1500, inventory_count: 30 },
  { name: 'Prod 4 - 250g', description: 'Premium Superfood Prod 4', price: 500, inventory_count: 50 },
  { name: 'Prod 5 - 500g', description: 'Premium Superfood Prod 5', price: 900, inventory_count: 40 },
  { name: 'Prod 6 - 1kg', description: 'Premium Superfood Prod 6', price: 1700, inventory_count: 25 },
  { name: 'Prod 7 - 250g', description: 'Premium Superfood Prod 7', price: 600, inventory_count: 30 },
  { name: 'Prod 8 - 500g', description: 'Premium Superfood Prod 8', price: 1100, inventory_count: 20 },
  { name: 'Prod 9 - 1kg', description: 'Premium Superfood Prod 9', price: 2000, inventory_count: 15 },
  { name: 'Prod 10 - 250g', description: 'Premium Superfood Prod 10', price: 550, inventory_count: 40 },
];

async function seed() {
  console.log('Clearing existing products...');
  const { error: deleteError } = await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
  if (deleteError) {
    console.error('Error deleting:', deleteError);
    return;
  }
  
  console.log('Inserting 10 new Superfood products (Prod 1 - Prod 10)...');
  const { error: insertError } = await supabase.from('products').insert(newProducts);
  if (insertError) {
    console.error('Error inserting:', insertError);
  } else {
    console.log('Successfully seeded 10 Superfood products!');
  }
}

seed();
