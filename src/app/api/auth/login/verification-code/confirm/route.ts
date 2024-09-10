import { db, eq } from "@/db";
import { User, users } from "@/db/schema";
import { getCurrentUser, setSession } from "@/lib/auth/session";
import { verifyEmailVerificationCode } from "@/lib/auth/email";
import { NextResponse, type NextRequest } from "next/server";
import { rateLimitByIp } from "@/lib/ratelimit";
import { getErrorMessage } from "@/lib/error";

type ConfirmCodeBody = {
  code: string
}

export const POST = async (request: NextRequest) => {
  try {

    await rateLimitByIp({ key: "verification-code-confirm", limit: 5, window: 60000 });

    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not found");
    }

    const body: ConfirmCodeBody = await request.json();
    const code = body.code;

    if (!code) {
      throw new Error("Code is required");
    }

    // Verify token against database
    const validCode = await verifyEmailVerificationCode(user as User, code);
    if (!validCode) {
      throw new Error("Invalid code. Please try sending another one.")
    }

    await db.update(users)
      .set({ emailVerified: new Date() })
      .where(eq(users.id, user.id));

    await setSession(user.id);

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 400 });
  }
};
