const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with Service Role Key for robust server-side access
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;

if (supabaseUrl && supabaseServiceRoleKey) {
  supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
  console.log('Supabase Client initialized with Service Role Key.');
} else {
  console.warn('Supabase credentials missing. Local storage fallback is active.');
}

module.exports = supabase;
