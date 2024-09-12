import { db } from "."
import { users, sites } from "./schema"

async function seed() {
  console.log("Starting seed process...")
  try {
    // Ensure test user exists
    const testUser = await db
      .insert(users)
      .values({
        id: "showcase-user-id", // Consistent id!
        email: "olle.ljung@gmail.com",
        emailVerified: new Date(),
        allowedSites: 1,
      })
      .onConflictDoUpdate({
        target: users.id,
        set: { email: "olle.ljung@gmail.com", emailVerified: new Date(), allowedSites: 1 },
      })
      .returning()
      .then((res) => res[0])

    console.log("Test user ensured:", testUser)

    // Ensure showcase site exists for the test user
    const showcaseSite = await db
      .insert(sites)
      .values({
        id: "eb4730df-8e36-474a-8034-15926a4eaf96", // Consistent uuid!
        userId: testUser.id,
        domain: "popuply.net",
        orderMode: "ordered",
        startAfter: 500,
        hideAfter: 1000,
        frequency: 1000,
        enableWebhook: true,
        isShowcase: true,
      })
      .onConflictDoUpdate({
        target: [sites.id],
        set: {
          orderMode: "ordered",
          startAfter: 500,
          hideAfter: 1000,
          frequency: 1000,
          enableWebhook: true,
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
