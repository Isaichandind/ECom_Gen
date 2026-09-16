import { NextResponse } from 'next/server';
import { createClient } from '@/shared/lib/supabase/server';
import { createOrder } from '@/domains/orders/services';
import { getProductById, reserveInventory } from '@/domains/inventory/services';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { items } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await getProductById(item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);
      
      const hasStock = await reserveInventory(product.id, item.quantity);
      if (!hasStock) throw new Error(`Insufficient stock for ${product.name}`);

      totalAmount += product.price * item.quantity;
      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        unitPrice: product.price
      });
    }

    const order = await createOrder(
      user.id,
      totalAmount,
      orderItems
    );

    return NextResponse.json({ 
      orderId: order.id, 
      amount: totalAmount, 
      currency: 'INR' 
    });

  } catch (error: any) {
    console.error('Create order error:', error);
    const message = error?.message || String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
