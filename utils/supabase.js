import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

if (!supabaseUrl) {
  console.warn('WARNING: NEXT_PUBLIC_SUPABASE_URL is not set or empty. Please restart your dev server if you just added it to .env.local.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder-please-set-your-env-variables.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);

