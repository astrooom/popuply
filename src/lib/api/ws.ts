import { Popup } from "@/db/schema"

import { WebSocket } from "ws"
import { serverLogger } from "../utils/server/logging"

export const clients: Map<string, Set<WebSocket>> = new Map()

export function triggerPopup(siteId: string, popup: Popup) {
  serverLogger.info({ type: "WS", msg: "Attempting to trigger popup", details: { siteId } })
  const siteClients = clients.get(siteId)
  if (siteClients) {
    serverLogger.info({ type: "WS", msg: "Found Clients - Triggering popup", details: { siteId, clientCount: siteClients.size } })
    const message = JSON.stringify({ type: "show_popup", popup })
    let sentCount = 0
    for (const client of siteClients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message)
        sentCount++
      }
    }
    serverLogger.info({ type: "WS", msg: "Popup triggered", details: { siteId, sentCount } })
  } else {
    serverLogger.info({ type: "WS", msg: "No clients found for site", details: { siteId } })
  }
  serverLogger.info({ type: "WS", msg: "Current Map state", details: { mapSize: clients.size, allSiteIds: Array.from(clients.keys()) } })
}
