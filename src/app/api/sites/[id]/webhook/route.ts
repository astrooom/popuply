import { regenerateWebhookToken } from "@/lib/api/sites"
import { getErrorMessage } from "@/lib/error"
import { rateLimitByIp } from "@/lib/ratelimit"
import { NextRequest, NextResponse } from "next/server"

export const PATCH = async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await rateLimitByIp({ key: "site-webhook-token-regenerate", limit: 3, window: 30000 })

    const { id } = params

    if (!id) {
      throw new Error("Missing site id")
    }

    await regenerateWebhookToken({ siteId: id })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 400 })
  }
}
