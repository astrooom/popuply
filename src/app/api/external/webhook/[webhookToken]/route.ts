import { NextRequest, NextResponse } from "next/server"
import { validateWebhookToken } from "@/lib/api/sites"
import { rateLimitByIp } from "@/lib/ratelimit"
import { getErrorMessage } from "@/lib/error"
import { triggerPopup } from "@/lib/api/sse"
import { Popup } from "@/db/schema"

export const POST = async (request: NextRequest, { params }: { params: { webhookToken: string } }) => {
  try {
    await rateLimitByIp({ key: "external-webhook-trigger", limit: 8, window: 4000 })

    const { webhookToken } = params

    if (!webhookToken) {
      throw new Error("Missing webhook token")
    }

    const { siteId } = await validateWebhookToken({ token: webhookToken })

    const popupData: Popup = await request.json()

    triggerPopup(siteId, popupData)

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 400 })
  }
}
