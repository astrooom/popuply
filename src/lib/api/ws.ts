import { Popup } from "@/db/schema"

import { WebSocket } from "ws"
import { serverLogger } from "../utils/server/logging"

export const clients: Map<string, Set<WebSocket>> = new Map()

export function triggerPopup(siteId: string, popup: Popup) {
  const siteClients = clients.get(siteId)
  if (siteClients) {
    serverLogger.info({ type: "WS", msg: "Found Clients - Triggering popup", details: { siteId, popup } })
    const message = JSON.stringify({ type: "show_popup", popup })
    for (const client of siteClients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message)
      }
    }
  } else {
    serverLogger.info({ type: "WS", msg: "No clients found for site", details: { siteId } })
  }
}
