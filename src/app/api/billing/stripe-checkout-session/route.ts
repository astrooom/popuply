import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/api/stripe';
// import { assertAuthenticated } from '@/lib/auth/session';
import { getErrorMessage } from '@/lib/error';
import { serverLogger } from '@/lib/utils/server/logging';

export async function POST(request: NextRequest) {
  try {

    // Parse the request body
    const body = await request.json();
    const { pricingId } = body;

    if (!pricingId) {
      return NextResponse.json({ error: 'Price ID is required' }, { status: 400 });
    }

    // Create the checkout session
    const checkoutSession = await createCheckoutSession({
      pricingId,
    });

    // Return the session ID to the client
    return NextResponse.json({ sessionId: checkoutSession.id }, { status: 200 });
  } catch (error) {
    serverLogger.error({ type: "STRIPE", msg: "Checkout Session Error", details: { error: getErrorMessage(error) } });
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 400 });
  }
}