import { NextResponse } from 'next/server';
import { resolveUsernameToEmail } from '@/domains/auth/services';
import { createClient } from '@/shared/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const email = await resolveUsernameToEmail(username);

    if (!email) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json({ user: data.user });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
