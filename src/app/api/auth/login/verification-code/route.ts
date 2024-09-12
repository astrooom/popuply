import { db, eq } from "@/db"
import { users } from "@/db/schema"
// import { setSession } from "@/lib/auth/session";
import { generateEmailVerificationCode } from "@/lib/auth/email"
import { sendVerificationCodeEmail } from "@/lib/emails/verificationCodeEmail"
import { NextResponse, type NextRequest } from "next/server"
import { rateLimitByIp } from "@/lib/ratelimit"
import { setSession } from "@/lib/auth/session"
import { serverLogger } from "@/lib/utils/server/logging"
import { getErrorMessage } from "@/lib/error"
import { IS_PRODUCTION } from "@/lib/constants"
import { generateUserId } from "@/lib/auth/misc"

type RegisterBody = {
  email: string
}

export const POST = async (request: NextRequest) => {
  try {
    await rateLimitByIp({ key: "verification-code-send", limit: 3, window: 30000 })

    serverLogger.info("Received request to send email verification code")

    const params: RegisterBody = await request.json()

    let email = params.email

    if (!email) {
      throw new Error("Email is required")
    }

    // Ensure email is lowercased
    email = email.toLowerCase()

    // Check if the user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    })

    let id

    if (existingUser) {
      id = existingUser.id
      serverLogger.info("Email already exists, resending verification code")
    } else {
      id = generateUserId()
      await db.insert(users).values({
        id,
        email,
        emailVerified: null, // Will be set to a date once email is verified
      })
    }

    const verificationCode = await generateEmailVerificationCode(id, email)

    if (IS_PRODUCTION) {
      // generateEmailVerificationCode logs the code to the console in DEVELOPMENT
      serverLogger.info({ type: "AUTH", msg: "Sending verification code", details: { id, email, verificationCode } })
      await sendVerificationCodeEmail({ email, token: verificationCode })
    }

    await setSession(id)

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 400 })
  }
}
