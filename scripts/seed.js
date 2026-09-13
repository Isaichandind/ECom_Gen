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
  { name: 'Product A - 250g Packet', description: 'Premium quality Product A in a 250g packet.', price: 150, inventory_count: 50 },
  { name: 'Product A - 500g Packet', description: 'Premium quality Product A in a 500g packet.', price: 280, inventory_count: 45 },
  { name: 'Product A - 1kg Packet', description: 'Premium quality Product A in a 1kg bulk packet.', price: 500, inventory_count: 30 },
  { name: 'Product B - 250g Packet', description: 'High-grade Product B in a 250g packet.', price: 200, inventory_count: 50 },
  { name: 'Product B - 500g Packet', description: 'High-grade Product B in a 500g packet.', price: 380, inventory_count: 40 },
  { name: 'Product B - 1kg Packet', description: 'High-grade Product B in a 1kg packet.', price: 700, inventory_count: 25 },
  { name: 'Product C - 1kg Packet', description: 'Exclusive Product C in a 1kg bulk packet.', price: 1200, inventory_count: 20 },
  { name: 'Product C - 2kg Packet', description: 'Exclusive Product C in a 2kg family packet.', price: 2200, inventory_count: 15 },
  { name: 'Product D - 1kg Packet', description: 'Everyday Product D in a 1kg packet.', price: 400, inventory_count: 100 },
  { name: 'Product D - 2kg Packet', description: 'Everyday Product D in a 2kg packet.', price: 750, inventory_count: 80 },
];

async function seed() {
  console.log('Clearing existing products...');
  const { error: deleteError } = await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
  if (deleteError) {
    console.error('Error deleting:', deleteError);
    return;
  }
  
  console.log('Inserting 10 new products...');
  const { error: insertError } = await supabase.from('products').insert(newProducts);
  if (insertError) {
    console.error('Error inserting:', insertError);
  } else {
    console.log('Successfully seeded 10 products!');
  }
}

seed();
