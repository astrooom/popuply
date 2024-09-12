import { Popup } from "@/db/schema"
import type { ReadableStreamDefaultController } from "stream/web"

type SSEClient = {
  id: number
  controller: ReadableStreamDefaultController
}

export type SiteClients = Map<string, Set<SSEClient>>

export const clients: SiteClients = new Map()

export function triggerPopup(siteId: string, popup: Popup) {
  if (!popup.theme) {
    popup.theme = "light"
  }

  if (clients.has(siteId)) {
    const siteClients = clients.get(siteId)
    const message = `data: ${JSON.stringify({ type: "show_popup", popup })}\n\n`
    const encoder = new TextEncoder()

    siteClients?.forEach((client) => {
      client.controller.enqueue(encoder.encode(message))
    })
  }
}
