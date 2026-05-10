
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Manually read .env file
const envFile = fs.readFileSync('d:/AI/saas/.env', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) env[key.trim()] = value.trim();
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugSignup(email, password) {
  console.log(`\n--- Attempting signup for: ${email} ---`);
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: 'Debug User'
      }
    }
  });

  if (error) {
    console.error('Signup Error Object:', JSON.stringify(error, null, 2));
    console.error('Error Message:', error.message);
    console.error('Status:', error.status);
  } else {
    console.log('Signup Successful (on Auth side). User ID:', data.user.id);
  }
}

async function run() {
  await debugSignup('hello@cloudnote.app', 'Test123!');
  await debugSignup('user123@gmail.com', 'Test123!');
}

run();



