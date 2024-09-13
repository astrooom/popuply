import { github, lucia } from "@/lib/auth"
import { cookies } from "next/headers"
import { OAuth2RequestError } from "arctic"
import { db, eq, or } from "@/db"
import { setSession } from "@/lib/auth/session"
import { serverLogger } from "@/lib/utils/server/logging"
import { NextResponse } from "next/server"
import { getErrorMessage } from "@/lib/error"
import { users } from "@/db/schema"
import { generateUserId } from "@/lib/auth/misc"

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const origin = url.origin
  const dashboardUrl = new URL(`/dashboard`, origin)
  const code = url.searchParams.get("code")
  const state = url.searchParams.get("state")
  const storedState = cookies().get("github_oauth_state")?.value ?? null
  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
    })
  }

  try {
    const tokens = await github.validateAuthorizationCode(code)

    const [userResponse, emailResponse] = await Promise.all([
      fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }),
      fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }),
    ])

    const githubUser: GitHubUser = await userResponse.json()
    const githubEmails: GithubEmails[] = await emailResponse.json()

    // Loop through the users emails and grab the primary one
    const githubEmail = githubEmails.find((email) => email.primary === true)?.email
    if (!githubEmail) {
      serverLogger.error({
        type: "GitHub",
        msg: "No primary email found for GitHub user",
        details: { user: githubUser, emails: githubEmails },
      })
      throw new Error("No email found for GitHub user")
    }

    const email = githubEmail.toLowerCase()

    const existingUser = await db.query.users.findFirst({
      where: or(eq(users.githubId, githubUser.id), eq(users.email, email)),
    })

    if (existingUser) {
      if (existingUser.githubId === githubUser.id) {
        // User already linked with GitHub
        serverLogger.info({ type: "GitHub", msg: "User already linked with GitHub", details: existingUser })
      } else if (existingUser.email === email) {
        // User exists with email, but GitHub not linked. Link it now.
        await db.update(users).set({ githubId: githubUser.id }).where(eq(users.id, existingUser.id))
        serverLogger.info({ type: "GitHub", msg: "Linked GitHub to existing email account", details: existingUser })
      }

      await setSession(existingUser.id)
      return NextResponse.redirect(dashboardUrl)
    }

    const userId = generateUserId()

    await db.insert(users).values({
      id: userId,
      email,
      emailVerified: new Date(), // Immediately set email as verified since email must already exist
      githubId: githubUser.id,
    })

    await setSession(userId)

    serverLogger.info({ type: "GitHub", msg: "User created", details: { userId, email } })

    return NextResponse.redirect(dashboardUrl)
  } catch (error) {
    if (error instanceof OAuth2RequestError) {
      // invalid code
      serverLogger.error({ type: "GitHub", msg: "Invalid github oauth code" })
      return NextResponse.json({ error: "Invalid code" }, { status: 400 })
    }
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 })
  }
}

interface GitHubUser {
  id: number
  login: string
  email?: string
}

type GithubEmails = {
  email: string
  primary: boolean
  verified: boolean
  visibility: string
}
