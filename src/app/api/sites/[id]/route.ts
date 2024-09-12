import type { NextRequest } from "next/server"
import { rateLimitByIp } from "@/lib/ratelimit"
import { getErrorMessage } from "@/lib/error"
import { editSite } from "@/lib/api/sites"
import { serverLogger } from "@/lib/utils/server/logging"
import type { Site } from "@/db/schema"
import { NextResponse } from "next/server"

export const PATCH = async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await rateLimitByIp({ key: "site-edit", limit: 5, window: 60000 })

    serverLogger.info({ type: "API", msg: "Received request to reorder popups", details: { params } })

    const { id: siteId } = params
    if (!siteId) {
      throw new Error("Missing site id")
    }

    const site: Partial<Site> = await request.json()

    await editSite({ siteId, site })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 400 })
  }
}
