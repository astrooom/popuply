import { NextResponse, type NextRequest } from "next/server"
import { rateLimitByIp } from "@/lib/ratelimit"
import { getErrorMessage } from "@/lib/error"
import { createPopup } from "@/lib/api/popups"

export const POST = async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await rateLimitByIp({ key: "popup-create", limit: 5, window: 60000 })

    const { id } = params

    if (!id) {
      throw new Error("Missing site id")
    }

    await createPopup({ siteId: id })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 400 })
  }
}
