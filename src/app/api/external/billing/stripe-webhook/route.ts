import { handleWebhook, stripe } from '@/lib/api/stripe';
import { getErrorMessage } from '@/lib/error';
import { serverLogger } from '@/lib/utils/server/logging';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error("Missing webhook secret");
  }

  const body = await req.text();
  const signature = headers().get("stripe-signature")!;

  serverLogger.info({ type: "STRIPE", msg: "Webhook received", details: { signature, webhookSecret } });

  const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

  try {
    await handleWebhook(event);
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    serverLogger.error({ type: "STRIPE", msg: "Webhook Error - Error processing webhook handler", details: { error: getErrorMessage(error), body, signature } });
    return NextResponse.json({ error: 'Error processing webhook' }, { status: 500 });
  }
}