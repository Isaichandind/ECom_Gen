import { createClient } from '@/shared/lib/supabase/server';
import { createAdminClient } from '@/shared/lib/supabase/admin';
import { Profile } from './types';

export async function getProfile(userId: string): Promise<Profile> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data as Profile;
}

export async function resolveUsernameToEmail(username: string): Promise<string | null> {
  const supabaseAdmin = createAdminClient();
  
  // Service role key bypasses RLS so we can find the email before they log in
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('email')
    .eq('username', username)
    .single();

  if (error) return null;
  return data?.email || null;
}
