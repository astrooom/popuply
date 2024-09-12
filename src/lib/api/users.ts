import { eq } from "drizzle-orm"
import { serverLogger } from "../utils/server/logging"
import { orders, users } from "@/db/schema"
import { db } from "@/db"
import { generateUserId } from "../auth/misc"

export async function upsertUser({ email }: { email: string }) {
  // Create unverified user based on this email.
  // Ensure email is lowercased
  email = email.toLowerCase()

  // Check if the user already exists
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  })

  let id

  if (existingUser) {
    id = existingUser.id
    serverLogger.info("Email already exists. Resending verification code")
  } else {
    id = generateUserId()
    await db.insert(users).values({
      id,
      email,
      emailVerified: null, // Will be set to a date once email is verified
    })
  }

  return id
}

export async function getUserBySessionId(sessionId: string) {
  const result = await db.query.orders.findFirst({
    where: eq(orders.sessionId, sessionId),
    with: {
      user: true,
    },
  })

  // If no order is found or the order has no associated user, return null
  if (!result || !result.user) {
    return null
  }

  // Return just the user object
  return result.user
}
