import { NextRequest, NextResponse } from 'next/server';
import { getErrorMessage } from '@/lib/error';
import { serverLogger } from '@/lib/utils/server/logging';
import { db, eq } from '@/db';
import { orders } from '@/db/schema';
import { setSession } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  try {

    const { sessionId }: { sessionId: string } = await request.json();
    if (!sessionId) {
      throw new Error('Session ID is required');
    }

    // Query user by checkout session id
    const user = await getUserBySessionId(sessionId);
    if (!user) {
      throw new Error('User not found');
    }

    // Set session for user
    await setSession(user.id);

    // Return the session ID to the client
    return NextResponse.json({ email: user.email }, { status: 200 });
  } catch (error) {
    serverLogger.error({ type: "STRIPE", msg: "Confirm Checkout Success Error", details: { error: getErrorMessage(error) } });
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 400 });
  }
}

export async function getUserBySessionId(sessionId: string) {
  const result = await db.query.orders.findFirst({
    where: eq(orders.sessionId, sessionId),
    with: {
      user: true
    }
  });

  // If no order is found or the order has no associated user, return null
  if (!result || !result.user) {
    return null;
  }

  // Return just the user object
  return result.user;
}