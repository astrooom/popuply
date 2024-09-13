import { Popup } from "@/db/schema"

import { WebSocket } from "ws"

export const clients: Map<string, Set<WebSocket>> = new Map()

export function triggerPopup(siteId: string, popup: Popup) {
  const siteClients = clients.get(siteId)
  if (siteClients) {
    const message = JSON.stringify({ type: "show_popup", popup })
    for (const client of siteClients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message)
      }
    }
  }
}
