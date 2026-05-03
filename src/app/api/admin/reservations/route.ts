import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabaseServer';
import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_ADMIN_EMAILS = [
  'mbagnickg@gmail.com',
  'infos.east.west@gmail.com',
  'hannamoubayed@hotmail.com'
];

let supabaseAdmin: ReturnType<typeof createClient> | null = null;

function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error('Missing Supabase configuration');
    supabaseAdmin = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false }
    });
  }
  return supabaseAdmin;
}

async function verifyAdmin(request: NextRequest): Promise<boolean> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return false;

  const token = authHeader.replace('Bearer ', '');
  const admin = getSupabaseAdmin();
  const { data: { user }, error } = await admin.auth.getUser(token);

  if (error || !user?.email) return false;
  return ALLOWED_ADMIN_EMAILS.includes(user.email.toLowerCase());
}

export async function GET(request: NextRequest) {
  const isAdmin = await verifyAdmin(request);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await getSupabaseAdmin()
    .from('reservations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function PATCH(request: NextRequest) {
  const isAdmin = await verifyAdmin(request);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { id, ids, ...updateData } = body;

  // Batch update (for auto-completing past reservations)
  if (ids && Array.isArray(ids)) {
    const results = await Promise.all(
      ids.map((reservationId: string) =>
        getSupabaseAdmin()
          .from('reservations')
          .update(updateData)
          .eq('id', reservationId)
      )
    );
    const failed = results.filter(r => r.error);
    if (failed.length > 0) {
      return NextResponse.json({ error: 'Some updates failed' }, { status: 500 });
    }
    return NextResponse.json({ success: true, updated: ids.length });
  }

  // Single update
  if (!id) {
    return NextResponse.json({ error: 'Missing reservation id' }, { status: 400 });
  }

  const { data, error } = await getSupabaseAdmin()
    .from('reservations')
    .update(updateData)
    .eq('id', id)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
