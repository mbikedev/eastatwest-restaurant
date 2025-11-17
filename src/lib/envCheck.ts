export function checkSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url) {
    console.error('NEXT_PUBLIC_SUPABASE_URL is not configured');
    return false;
  }
  
  if (!key) {
    console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured');
    return false;
  }
  
  if (!url.startsWith('https://')) {
    console.error('NEXT_PUBLIC_SUPABASE_URL should start with https://');
    return false;
  }
  
  if (key.length < 20) {
    console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY appears to be invalid (too short)');
    return false;
  }
  
  return true;
}

export function getSupabaseConfig() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    isConfigured: checkSupabaseConfig()
  };
}

// Debug function to help troubleshoot
export function debugSupabaseConfig() {
  const config = getSupabaseConfig();

  return config;
} 