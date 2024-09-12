import { NextResponse, type NextRequest } from "next/server"
import { rateLimitByIp } from "@/lib/ratelimit"
import { serverLogger } from "@/lib/utils/server/logging"
import { getErrorMessage } from "@/lib/error"
import { generateState } from "arctic"
import { github } from "@/lib/auth"
import { cookies } from "next/headers"
import { IS_PRODUCTION } from "@/lib/constants"

export const GET = async (request: NextRequest) => {
  //await rateLimitByIp({ key: "github-login", limit: 3, window: 30000 });

  try {
    serverLogger.info("Received request to login with GitHub")

    const state = generateState()
    const url = await github.createAuthorizationURL(state, {
      scopes: ["user:email"],
    })

    cookies().set("github_oauth_state", state, {
      path: "/",
      secure: IS_PRODUCTION,
      httpOnly: true,
      maxAge: 60 * 10,
      sameSite: "lax",
    })

    return NextResponse.json({ data: { url } }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 400 })
  }
}
