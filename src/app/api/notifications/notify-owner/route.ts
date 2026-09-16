import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { orderId, total, utr, items, customerWhatsapp } = await req.json();

    // In a production app, the webhook URL would be stored in environment variables:
    // const webhookUrl = process.env.WHATSAPP_WEBHOOK_URL;
    const webhookUrl = process.env.WHATSAPP_WEBHOOK_URL || '';

    const messagePayload = {
      orderId,
      amount: total,
      utr,
      customerWhatsapp,
      items: items.map((i: any) => `${i.name} (Qty: ${i.quantity})`).join(', '),
      message: `New Order Received!\n\nOrder ID: ${orderId}\nTotal: ₹${total}\nUTR: ${utr}\nCustomer WA: ${customerWhatsapp}\n\nItems:\n${items.map((i: any) => `- ${i.name} x${i.quantity}`).join('\n')}`
    };

    // If a webhook is configured, send the notification to it
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messagePayload),
      });
    } else {
      console.log('No WHATSAPP_WEBHOOK_URL configured. Payload that would be sent:', messagePayload);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error notifying owner:', error);
    return NextResponse.json({ error: 'Failed to notify owner' }, { status: 500 });
  }
}
