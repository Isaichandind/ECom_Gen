import { NextResponse } from 'next/server';
import { createClient } from '@/shared/lib/supabase/server';
import { submitOrderUTR } from '@/domains/orders/services';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId, utr } = await request.json();

    if (!orderId || !utr) {
      return NextResponse.json({ error: 'Missing order ID or UTR' }, { status: 400 });
    }

    // Submit UTR and change status to pending_verification
    const order = await submitOrderUTR(orderId, utr);

    return NextResponse.json({ success: true, order });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}
