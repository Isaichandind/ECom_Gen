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
  { name: 'Essential Plant Protein - 250g', description: 'Clean, easily digestible plant-based protein for daily vitality.', price: 450, inventory_count: 50 },
  { name: 'Essential Plant Protein - 500g', description: 'Clean, easily digestible plant-based protein for daily vitality.', price: 800, inventory_count: 45 },
  { name: 'Essential Plant Protein - 1kg', description: 'Clean, easily digestible plant-based protein for daily vitality.', price: 1500, inventory_count: 30 },
  
  { name: 'Organic Greens Superblend - 250g', description: 'A nutrient-dense blend of spirulina, chlorella, and wheatgrass.', price: 500, inventory_count: 50 },
  { name: 'Organic Greens Superblend - 500g', description: 'A nutrient-dense blend of spirulina, chlorella, and wheatgrass.', price: 900, inventory_count: 40 },
  { name: 'Organic Greens Superblend - 1kg', description: 'A nutrient-dense blend of spirulina, chlorella, and wheatgrass.', price: 1700, inventory_count: 25 },
  
  { name: 'Recovery Matcha Powder - 250g', description: 'Ceremonial grade matcha infused with adaptogens for calm energy.', price: 600, inventory_count: 30 },
  { name: 'Recovery Matcha Powder - 500g', description: 'Ceremonial grade matcha infused with adaptogens for calm energy.', price: 1100, inventory_count: 20 },
  { name: 'Recovery Matcha Powder - 1kg', description: 'Ceremonial grade matcha infused with adaptogens for calm energy.', price: 2000, inventory_count: 15 },
  
  { name: 'Marine Collagen Peptides - 500g', description: 'Sustainably sourced marine collagen for skin and joint health.', price: 1200, inventory_count: 40 },
];

async function seed() {
  console.log('Clearing existing products...');
  const { error: deleteError } = await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
  if (deleteError) {
    console.error('Error deleting:', deleteError);
    return;
  }
  
  console.log('Inserting 10 new health powder products...');
  const { error: insertError } = await supabase.from('products').insert(newProducts);
  if (insertError) {
    console.error('Error inserting:', insertError);
  } else {
    console.log('Successfully seeded 10 health powder products!');
  }
}

seed();
