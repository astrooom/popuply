import { NextRequest, NextResponse } from "next/server"
import { externalGetSite } from "@/lib/api/sites"
import { rateLimitByIp } from "@/lib/ratelimit"
import { getErrorMessage } from "@/lib/error"
import { headers } from "next/headers"
import { serverLogger } from "@/lib/utils/server/logging"
import { clients } from "@/lib/api/ws"

export const GET = async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await rateLimitByIp({ key: "external-site-get", limit: 8, window: 60000 })

    const { id } = params

    if (!id) {
      throw new Error("Missing site id")
    }

    const headersList = headers()
    const host = headersList.get("x-forwarded-host") || headersList.get("host")

    if (!host) {
      throw new Error("Missing host")
    }

    return NextResponse.json({ data: await externalGetSite({ siteId: id, host }) }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 400 })
  }
}

export function SOCKET(client: import("ws").WebSocket, request: import("node:http").IncomingMessage, server: import("ws").WebSocketServer) {
  serverLogger.info({ type: "WS", msg: "Received incoming WS connection." })
  const url = new URL(request.url || "", `http://${request.headers.host}`)
  const siteId = url.searchParams.get("id")

  if (!siteId) {
    serverLogger.error({ type: "WS", msg: "Missing site id" })
    client.close(1008, "Missing site id")
    return
  }
  console.log({ siteId })

  if (!clients.has(siteId)) {
    clients.set(siteId, new Set())
  }
  clients.get(siteId)!.add(client)

  const { send, broadcast } = createHelpers(client, server)

  // When a new client connects broadcast a connect message
  broadcast({ author: "Server", content: "A new client has connected." })
  send({ author: "Server", content: "Welcome!" })

  client.on("close", () => {
    serverLogger.info({ type: "WS", msg: "Client disconnected." })

    // Remove the client from the set when it disconnects
    clients.get(siteId)?.delete(client)

    // If the set is empty, remove the siteId from the map
    if (clients.get(siteId)?.size === 0) {
      clients.delete(siteId)
    }
  })
}

function createHelpers(client: import("ws").WebSocket, server: import("ws").WebSocketServer) {
  const send = (payload: unknown) => client.send(JSON.stringify(payload))
  const broadcast = (payload: unknown) => {
    if (payload instanceof Buffer) payload = payload.toString()
    if (typeof payload !== "string") payload = JSON.stringify(payload)
    for (const other of server.clients) if (other !== client) other.send(String(payload))
  }
  return { send, broadcast }
}
