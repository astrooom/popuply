import { rateLimitByIp } from "@/lib/ratelimit"
import { NextRequest, NextResponse } from "next/server"
import { clients } from "@/lib/api/sse"
import { getErrorMessage } from "@/lib/error"

export const runtime = "nodejs"

// This is required to enable streaming
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await rateLimitByIp({ key: "external-site-sse", limit: 4, window: 1000 })

    const { id } = params

    if (!id) {
      throw new Error("Missing site id")
    }

    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder()

        const newClient = {
          id: Date.now(),
          controller,
        }

        if (!clients.has(id)) {
          clients.set(id, new Set())
        }
        clients.get(id)!.add(newClient)

        // Send an initial message
        const initialMessage = encoder.encode(`data: ${JSON.stringify({ status: "connected" })}\n\n`)
        controller.enqueue(initialMessage)

        // Remove client when connection is closed
        request.signal.addEventListener("abort", () => {
          clients.get(id)!.delete(newClient)
          if (clients.get(id)!.size === 0) {
            clients.delete(id)
          }
        })
      },
    })

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 400 })
  }
}
