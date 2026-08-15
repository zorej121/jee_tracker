// ============================================
// SUPABASE CONFIGURATION
// ============================================

console.log('🔧 Loading Supabase config...');

const SUPABASE_URL = 'https://bloffbytqbbzxqyyakys.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_QhSJzN0qZniC60pjIiVbAg_ft1a7HW6';

// Initialize Supabase client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('✅ Supabase client initialized');

// Export for use in other files
window.supabase = supabaseClient;

// Also expose the config values if needed
window.SUPABASE_URL = SUPABASE_URL;
window.SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;