import { NextResponse, type NextRequest } from "next/server"
import { serverLogger } from "@/lib/utils/server/logging"
import { getErrorMessage } from "@/lib/error"
import { lucia } from "@/lib/auth"
import { cookies } from "next/headers"
import { getCurrentUser } from "@/lib/auth/session"

export const POST = async (request: NextRequest) => {
  try {
    serverLogger.info("Received request to log out")

    const user = await getCurrentUser()
    if (!user) {
      throw new Error("User not found")
    }

    lucia.invalidateUserSessions(user.id)
    const sessionCookie = lucia.createBlankSessionCookie()
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

    serverLogger.info({ type: "AUTH", msg: "User logged out", details: user })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    serverLogger.error({ type: "AUTH", msg: "Failed to log out user", details: error })
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 400 })
  }
}
