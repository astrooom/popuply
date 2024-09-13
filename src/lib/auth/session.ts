import "server-only"

import { AuthenticationError } from "@/app/util"
import { lucia, validateRequest } from "@/lib/auth"
import { cache } from "react"
import { cookies } from "next/headers"
import { UserId } from "lucia"

export const getCurrentUser = cache(async () => {
  const session = await validateRequest()
  if (!session.user) {
    return undefined
  }
  return session.user
})

export const isCurrentUserValid = async () => {
  const user = await getCurrentUser()
  if (!user) {
    return false
  }
  return !!user.emailVerified
}

export const assertAuthenticated = async () => {
  const user = await getCurrentUser()
  if (!user || !user.emailVerified) {
    throw new AuthenticationError()
  }
  return user
}

export async function setSession(userId: UserId) {
  const session = await lucia.createSession(userId, {})
  const sessionCookie = lucia.createSessionCookie(session.id)
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
}
