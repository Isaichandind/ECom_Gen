import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { orderId, total, utr, items, customerWhatsapp } = await req.json();

    const itemsList = items.map((i: any) => `- ${i.name} x${i.quantity}`).join('\n');
    const message = `🚨 *New Order Received!* 🚨\n\n*Order ID:* ${orderId}\n*Total:* ₹${total}\n*UTR:* ${utr}\n*Customer WA:* ${customerWhatsapp}\n\n*Items:*\n${itemsList}`;

    // Zero-cost WhatsApp API using CallMeBot
    // The owner needs to get their free API key from https://www.callmebot.com/blog/free-api-whatsapp-messages/
    const phone = process.env.CALLMEBOT_PHONE;
    const apiKey = process.env.CALLMEBOT_API_KEY;

    if (phone && apiKey) {
      const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(message)}&apikey=${apiKey}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        console.error('CallMeBot API failed:', await response.text());
      } else {
        console.log('WhatsApp notification sent successfully via CallMeBot');
      }
    } else {
      console.log('CallMeBot credentials not set in .env.local. Message would be:', message);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error notifying owner:', error);
    return NextResponse.json({ error: 'Failed to notify owner' }, { status: 500 });
  }
}
