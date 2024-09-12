import { TimeSpan, createDate } from "oslo"
import { generateRandomString, alphabet } from "oslo/crypto"
import { db, eq } from "@/db"
import { emailVerificationCodes, User } from "@/db/schema"
import { isWithinExpirationDate } from "oslo"
import { serverLogger } from "../utils/server/logging"
import { IS_DEVELOPMENT } from "../constants"

export async function generateEmailVerificationCode(userId: string, email: string): Promise<string> {
  await db.delete(emailVerificationCodes).where(eq(emailVerificationCodes.userId, userId))
  const code = generateRandomString(8, alphabet("0-9"))
  await db.insert(emailVerificationCodes).values({
    userId,
    email,
    code,
    expiresAt: createDate(new TimeSpan(15, "m")), // 15 minutes
  })

  if (IS_DEVELOPMENT) {
    serverLogger.info({ type: "AUTH", msg: "Generated verification code", details: { userId, email, code } })
  }

  return code
}

export async function verifyEmailVerificationCode(user: User, code: string): Promise<boolean> {
  const userVerificationCodes = await db.query.emailVerificationCodes.findMany({
    where: (emailVerificationCodes, { eq }) => eq(emailVerificationCodes.userId, user.id) && eq(emailVerificationCodes.code, code),
    orderBy: (emailVerificationCodes, { desc }) => [desc(emailVerificationCodes.createdAt)],
  })

  if (userVerificationCodes.length > 0) {
    serverLogger.info({ type: "AUTH", msg: "Found verification codes", details: { userVerificationCodes } })

    // Delete all users codes
    await db.delete(emailVerificationCodes).where(eq(emailVerificationCodes.userId, user.id))

    // Check expiration date
    if (!isWithinExpirationDate(userVerificationCodes[0].expiresAt)) {
      serverLogger.info({ type: "AUTH", msg: "Verification code expired", details: { userVerificationCodes, currentDate: new Date() } })
      return false
    }

    // Check if email matches
    if (user.email !== userVerificationCodes[0].email) {
      serverLogger.info({ type: "AUTH", msg: "Verification code email does not match", details: { userVerificationCodes } })
      return false
    }

    serverLogger.info({ type: "AUTH", msg: "Verified verification code", details: { userVerificationCodes } })
    return true
  }

  serverLogger.info({ type: "AUTH", msg: "No verification codes found" })

  return false
}
