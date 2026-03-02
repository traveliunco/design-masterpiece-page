const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');

const getEnv = (key) => {
  const match = envContent.match(new RegExp(`${key}=(.+)`));
  return match ? match[1].trim().replace(/["']/g, '') : '';
};

const url = getEnv('VITE_SUPABASE_URL');
const key = getEnv('VITE_SUPABASE_PUBLISHABLE_KEY') || getEnv('VITE_SUPABASE_ANON_KEY');
const supabase = createClient(url, key);

async function setRole(email, role, firstName) {
  // First try update
  const { data: updated, error: updateErr } = await supabase
    .from('users')
    .update({ role, status: 'active' })
    .eq('email', email)
    .select('id, email, role');

  if (updated && updated.length > 0) {
    console.log('✅ Updated ' + email + ' → ' + role);
    return;
  }

  // If not found, insert with a generated id
  console.log('📝 User not in table, inserting...');
  const { data: inserted, error: insertErr } = await supabase
    .from('users')
    .insert({
      email: email,
      first_name: firstName || email.split('@')[0],
      last_name: '',
      role: role,
      status: 'active',
      phone: '',
    })
    .select('id, email, role');

  if (insertErr) {
    console.error('❌ Insert error for ' + email + ':', insertErr.message);
    // List all users to debug
    const { data: all } = await supabase.from('users').select('id, email, role').limit(10);
    console.log('📋 Current users in table:', JSON.stringify(all, null, 2));
  } else {
    console.log('✅ Inserted ' + email + ' → ' + role);
  }
}

async function main() {
  // First, list existing users
  const { data: existing, error } = await supabase.from('users').select('id, email, role, status');
  console.log('📋 Users in table:', existing ? existing.length : 0);
  if (existing) existing.forEach(u => console.log('  -', u.email, '→', u.role || 'no role'));

  await setRole('klidmorre@gmail.com', 'admin', 'خالد');
  await setRole('eng.khalid.work@gmail.com', 'employee', 'خالد');
  console.log('\n✅ Done!');
}

main();
