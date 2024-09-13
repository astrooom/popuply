import { headers } from "next/headers"

export function getIp() {
  const headersList = headers()

  // Cloudflare-specific headers
  const cfConnectingIp = headersList.get("cf-connecting-ip")

  // Other common headers
  const xForwardedFor = headersList.get("x-forwarded-for")
  const xRealIp = headersList.get("x-real-ip")

  // Prioritize Cloudflare headers
  if (cfConnectingIp) {
    return cfConnectingIp.trim()
  }

  // Fall back to other headers if Cloudflare headers are not available
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0].trim()
  }

  if (xRealIp) {
    return xRealIp.trim()
  }

  // If no IP is found, return null
  return null
}
