// Script to set user roles
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env from project root
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');

const getEnv = (key) => {
  const match = envContent.match(new RegExp(`${key}=(.+)`));
  return match ? match[1].trim().replace(/["']/g, '') : '';
};

const url = getEnv('VITE_SUPABASE_URL');
const key = getEnv('VITE_SUPABASE_PUBLISHABLE_KEY') || getEnv('VITE_SUPABASE_ANON_KEY');

console.log('URL:', url ? url.substring(0, 30) + '...' : 'MISSING');
console.log('KEY:', key ? 'found (' + key.length + ' chars)' : 'MISSING');

if (!url || !key) {
  console.error('Missing env vars!');
  process.exit(1);
}

const supabase = createClient(url, key);

async function setRole(email, role) {
  const { data, error } = await supabase
    .from('users')
    .update({ role })
    .eq('email', email)
    .select('id, email, role');

  if (error) {
    console.error(`❌ ${email}:`, error.message);
    return;
  }
  if (!data || data.length === 0) {
    console.log(`⚠️ ${email} not found in users table`);
    return;
  }
  console.log(`✅ ${email} → ${role}`);
}

async function main() {
  await setRole('klidmorre@gmail.com', 'admin');
  await setRole('eng.khalid.work@gmail.com', 'employee');
  console.log('Done!');
}

main();
