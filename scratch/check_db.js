
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkUsers() {
  const { data: users, error } = await supabase.from('users').select('*');
  if (error) console.error("Error fetching users:", error);
  else console.log("Users:", users);

  const { data: subs, error: subError } = await supabase.from('subscriptions').select('*');
  if (subError) console.error("Error fetching subscriptions:", subError);
  else console.log("Subscriptions:", subs);
}

checkUsers();
