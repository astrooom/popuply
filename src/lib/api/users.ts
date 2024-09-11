import { eq } from "drizzle-orm";
import { serverLogger } from "../utils/server/logging";
import { users } from "@/db/schema";
import { db } from "@/db";
import { generateUserId } from "../auth/misc";

export async function upsertUser({ email }: { email: string }) {
  // Create unverified user based on this email.
  // Ensure email is lowercased
  email = email.toLowerCase();

  // Check if the user already exists
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  })

  let id;

  if (existingUser) {
    id = existingUser.id;
    serverLogger.info("Email already exists. Resending verification code");
  } else {
    id = generateUserId()
    await db.insert(users).values({
      id,
      email,
      emailVerified: null, // Will be set to a date once email is verified
    });
  }

  return id
}