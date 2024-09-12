import { db } from "."
import { users, sites } from "./schema"

async function seed() {
  console.log("Starting seed process...")
  try {
    // Ensure test user exists
    const testUser = await db
      .insert(users)
      .values({
        id: "test-user-id",
        email: "test@example.com",
        emailVerified: new Date(),
        allowedSites: 1,
      })
      .onConflictDoUpdate({
        target: users.id,
        set: { email: "test@example.com", emailVerified: new Date(), allowedSites: 1 },
      })
      .returning()
      .then((res) => res[0])

    console.log("Test user ensured:", testUser)

    // Ensure showcase site exists for the test user
    const showcaseSite = await db
      .insert(sites)
      .values({
        userId: testUser.id,
        domain: "popuply.net",
        orderMode: "ordered",
        startAfter: 500,
        hideAfter: 1000,
        frequency: 1000,
        isShowcase: true,
      })
      .onConflictDoUpdate({
        target: [sites.id],
        set: {
          orderMode: "ordered",
          startAfter: 500,
          hideAfter: 1000,
          frequency: 1000,
          isShowcase: true,
        },
      })
      .returning()
      .then((res) => res[0])

    console.log("Showcase site ensured:", showcaseSite)
    console.log("Seed process completed successfully.")
  } catch (error) {
    console.error("Error during seed process:", error)
  }
}

seed()
  .then(() => {
    console.log("Seeding complete.")
  })
  .catch((error) => {
    console.error("Seeding failed:", error)
  })
