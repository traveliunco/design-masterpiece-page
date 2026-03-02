// Script to set user roles
// Run with: npx tsx scripts/set-roles.ts
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

// Read .env.local or .env
let envContent = '';
try { envContent = fs.readFileSync('.env.local', 'utf8'); } catch {
  try { envContent = fs.readFileSync('.env', 'utf8'); } catch { /* ignore */ }
}

const getEnv = (key: string) => {
  const match = envContent.match(new RegExp(`${key}=([^\n\r]+)`));
  return match ? match[1].trim() : process.env[key] || '';
};

const url = getEnv('VITE_SUPABASE_URL');
const key = getEnv('VITE_SUPABASE_PUBLISHABLE_KEY') || getEnv('VITE_SUPABASE_ANON_KEY');

if (!url || !key) {
  console.error('Missing SUPABASE_URL or KEY. Provide via .env or .env.local');
  process.exit(1);
}

const supabase = createClient(url, key);

async function setRole(email: string, role: string) {
  const { data, error } = await supabase
    .from('users')
    .update({ role })
    .eq('email', email)
    .select('id, email, role');

  if (error) {
    console.error(`❌ Error updating ${email}:`, error.message);
    return;
  }
  if (!data || data.length === 0) {
    console.log(`⚠️ User ${email} not found in users table`);
    return;
  }
  console.log(`✅ ${email} → ${role}`, data[0]);
}

async function main() {
  console.log('🔄 Setting roles...');
  await setRole('klidmorre@gmail.com', 'admin');
  await setRole('eng.khalid.work@gmail.com', 'employee');
  console.log('✅ Done!');
}

main();
