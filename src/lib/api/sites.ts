import "server-only"

import { and, asc, count as countSql, db, eq, sql } from "@/db"
import { popups, Site, sites, webhookTokens } from "@/db/schema"
import { assertAuthenticated } from "@/lib/auth/session"
import { serverLogger } from "../utils/server/logging"
import { v4 as uuidv4 } from "uuid"
import { unstable_cache } from "next/cache"
import { domainSchema } from "../constants/validation"
import { cache } from "react"

export const getSites = cache(async () => {
  const user = await assertAuthenticated()
  if (!user) {
    throw new Error("User not found")
  }
  return await db.query.sites.findMany({
    where: and(eq(sites.userId, user.id), eq(sites.userId, user.id)),
  })
})

export const getSite = async ({ siteId }: { siteId: string }) => {
  const user = await assertAuthenticated()
  if (!user) {
    throw new Error("User not found")
  }

  return await db.query.sites.findFirst({
    where: and(eq(sites.id, siteId), eq(sites.userId, user.id)),
  })
}

export const createSite = async ({ domain }: { domain: string }) => {
  const user = await assertAuthenticated()
  if (!user) {
    throw new Error("User not found")
  }

  // Count sites the user has
  const [{ count }] = await db.select({ count: countSql() }).from(sites).where(eq(sites.userId, user.id))

  if (count >= user.allowedSites) {
    throw new Error("Maximum number of allowed sites reached")
  }

  // Validate domain using the Zod schema
  domainSchema.parse(domain)

  const site = await db.insert(sites).values({
    domain,
    faviconUrl: `https://s2.googleusercontent.com/s2/favicons?domain=${domain}`, // Google provides a default favicon...
    userId: user.id,
  })

  serverLogger.info({ type: "API", msg: "Created site", details: { site, user } })

  return site
}

export const editSite = async ({ siteId, site }: { siteId: string; site: Partial<Site> }) => {
  const user = await assertAuthenticated()
  if (!user) {
    throw new Error("User not found")
  }

  // User is checked here to ensure the site belongs to the user.
  const newSite = await db
    .update(sites)
    .set(site)
    .where(and(eq(sites.id, siteId), eq(sites.userId, user.id)))
    .returning()

  serverLogger.info({ type: "API", msg: "Updated site", details: { site: newSite, user } })

  return newSite
}

export const deleteSite = async ({ siteId }: { siteId: string }) => {
  const user = await assertAuthenticated()
  if (!user) {
    throw new Error("User not found")
  }

  // User is checked here to ensure the site belongs to the user.
  const site = await db
    .delete(sites)
    .where(and(eq(sites.id, siteId), eq(sites.userId, user.id)))
    .returning()
  serverLogger.info({ type: "API", msg: "Deleted site", details: { site, user } })

  return site
}

// EXTERNAL: Get site settings + all of its popups. This is used for the external endpoint hit by users on the clients website so should not be user checked.
export const externalGetSite = async ({ siteId, host }: { siteId: string; host?: string }) => {
  return await db.transaction(async (tx) => {
    // Single query to check domain, update visitor count, and fetch site data
    const siteData = await tx.query.sites.findFirst({
      where: and(
        eq(sites.id, siteId),
        // eq(sites.domain, host) allow all hosts through and instead log if there's a mismatch. Can work on a whitelisting system later if needed..
      ),
      with: {
        popups: {
          orderBy: asc(popups.order),
          columns: {
            title: true,
            content: true,
            link_url: true,
            icon_url: true,
            theme: true,
            order: true,
            timestamp: true,
          },
        },
      },
      columns: {
        id: true,
        domain: true,
        orderMode: true,
        startAfter: true,
        hideAfter: true,
        frequency: true,
        enableWebhook: true,
        pageRuleType: true,
        pageRulePatterns: true,
        visitors: true,
      },
    })

    // If no site is found or the domain doesn't match, return null
    if (!siteData) {
      return null
    }

    // Log if there's a mismatch between the stored domain and the provided host
    if (siteData.domain !== host) {
      serverLogger.warn({
        type: "API",
        msg: "Host mismatch",
        details: { siteId, storedDomain: siteData.domain, clientHostHeader: host },
      })
    }

    // Update the visitors count
    await tx.execute(sql`
      UPDATE ${sites}
      SET visitors = COALESCE(visitors, 0) + 1
      WHERE id = ${siteId}
    `)

    // Update the visitors count in the siteData object
    siteData.visitors = (siteData.visitors || 0) + 1

    return siteData
  })
}

// Geneate or regenerate the webhook token for a site
export const regenerateWebhookToken = async ({ siteId }: { siteId: string }) => {
  const user = await assertAuthenticated()
  if (!user) {
    throw new Error("User not found")
  }

  const newToken = uuidv4()

  // First, verify that the site belongs to the user
  const siteExists = await db.query.sites.findFirst({
    where: and(eq(sites.id, siteId), eq(sites.userId, user.id)),
  })

  if (!siteExists) {
    throw new Error("Site not found or access denied")
  }

  // Now, proceed with token regeneration or generation
  await db
    .insert(webhookTokens)
    .values({
      siteId,
      token: newToken,
    })
    .onConflictDoUpdate({
      target: webhookTokens.siteId,
      set: { token: newToken, updatedAt: new Date() },
    })
    .returning({ updatedToken: webhookTokens.token })
    .execute()

  serverLogger.info({ type: "API", msg: "Regenerated webhook token", details: { siteId, user, token: newToken } })

  return newToken
}

export const validateWebhookToken = async ({ token }: { token: string }): Promise<{ siteId: string }> => {
  const result = await db.query.webhookTokens.findFirst({
    where: eq(webhookTokens.token, token),
    columns: {
      siteId: true,
    },
  })

  const siteId = result?.siteId

  if (!siteId) {
    throw new Error("Invalid webhook token")
  }

  return { siteId }
}

export const getWebhookToken = async ({ siteId }: { siteId: string }) => {
  const user = await assertAuthenticated()
  if (!user) {
    throw new Error("User not found")
  }

  const token = await db.query.webhookTokens.findFirst({
    where: and(eq(webhookTokens.siteId, siteId)),
    columns: {
      token: true,
    },
  })

  return token?.token
}

// This is only used to query the test site for the landing page.
export const getTestSite = unstable_cache(
  async () => {
    const site = await db.query.sites.findFirst({
      where: eq(sites.isShowcase, true),
    })

    if (!site) {
      throw new Error("Test site not found")
    }

    return site
  },
  ["test-site"], // cache key
  {
    revalidate: 60,
    tags: ["test-site-query"],
  },
)
