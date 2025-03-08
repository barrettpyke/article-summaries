import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const rows = await request.json();

    for (const row of rows) {
    }

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      ui_mode: 'custom',
      return_url: `http://${process.env.BASE_URL}/checkout-success`,
    });

    return NextResponse.json({ clientSecret: session.client_secret }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
