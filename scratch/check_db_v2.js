
const { createClient } = require('@supabase/supabase-js');

// .env 파일의 실제 값을 사용하여 직접 연결 테스트
const supabaseUrl = 'https://deqetymgwmkzdvvvzqeu.supabase.co';
const supabaseAnonKey = 'sb_publishable_KJ25hPOXsediveH-FyOvfA_PYNNEudu'; // 실제 키로 대체 (서버에서만 실행)

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDatabase() {
  console.log("Checking users table...");
  const { data: users, error: userError } = await supabase
    .from('users')
    .select('id, email');
  
  if (userError) {
    console.error("Error fetching users:", userError.message);
  } else {
    console.log("Registered Users:", users.map(u => u.email));
  }

  console.log("\nChecking subscriptions table...");
  const { data: subs, error: subError } = await supabase
    .from('subscriptions')
    .select('user_id, plan, status');
    
  if (subError) {
    console.error("Error fetching subscriptions:", subError.message);
  } else {
    console.log("Subscriptions Data:", subs);
  }
}

checkDatabase();
