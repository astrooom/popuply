import { rateLimitByIp } from "@/lib/ratelimit"
import { NextRequest, NextResponse } from "next/server"
import { clients } from "@/lib/api/sse"
import { getErrorMessage } from "@/lib/error"
import { serverLogger } from "@/lib/utils/server/logging"
import { headers } from "next/headers"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await rateLimitByIp({ key: "external-site-sse", limit: 4, window: 1000 })
    serverLogger.info({
      type: "API",
      msg: "Received request to connect to SSE stream",
      details: {
        params,
      },
    })

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

        // Set up keep-alive interval
        const keepAliveInterval = setInterval(() => {
          const keepAliveMessage = encoder.encode(`: keepalive\n\n`)
          controller.enqueue(keepAliveMessage)
        }, 50000) // Send keep-alive every 50 seconds

        // Remove client and clear interval when connection is closed
        request.signal.addEventListener("abort", () => {
          clearInterval(keepAliveInterval)
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
        "Cache-Control": "no-cache, no-store",
        "X-Accel-Buffering": "no",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 400 })
  }
}
