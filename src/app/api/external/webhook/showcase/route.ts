import { NextRequest, NextResponse } from "next/server"
import { getTestSite } from "@/lib/api/sites"
import { rateLimitByIp } from "@/lib/ratelimit"
import { getErrorMessage } from "@/lib/error"
import { triggerPopup } from "@/lib/api/sse"
import { Popup } from "@/db/schema"

// This endpoint is only for the landing page popup test. This is because the test popups have a static site ID
export const POST = async (request: NextRequest, { params }: { params: { webhookToken: string } }) => {
  try {
    await rateLimitByIp({ key: "showcase-webhook-trigger", limit: 8, window: 4000 })

    // query the site id by isShowcase
    const { id } = await getTestSite()

    const popupData: Popup = await request.json()

    triggerPopup(id, popupData)

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 400 })
  }
}
