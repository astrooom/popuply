import { NextResponse } from "next/server"
import type { NextFetchEvent, NextMiddleware, NextRequest } from "next/server"

async function middlewareSettings(request: NextRequest) {
  //const { pathname } = request.nextUrl

  // Clone the request headers
  const requestHeaders = new Headers(request.headers)

  requestHeaders.set("X-DNS-Prefetch-Control", "on")
  requestHeaders.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload")
  requestHeaders.set("X-XSS-Protection", "1; mode=block")

  // Set a custom `X-Pathname` header that can be used to get the current path in server components...
  //requestHeaders.set("X-Pathname", pathname)

  // create new response - https://nextjs.org/docs/pages/building-your-application/routing/middleware#setting-headers
  const response = NextResponse.next({
    request: {
      // New request headers
      headers: requestHeaders,
    },
  })

  return response
}

// Wrapper to replace the host header with the host from the request url, which is needed if running behind a reverse proxy.
function withHostFromHeaders(middleware: NextMiddleware) {
  return (...args: [NextRequest, NextFetchEvent]) => {
    const [request] = args

    const hostHeader = request.headers.get("Host")

    if (hostHeader) {
      const [host, port = ""] = hostHeader.split(":")
      if (host) {
        request.nextUrl.host = host
        request.nextUrl.port = port
      }
    }

    return middleware(...args)
  }
}

export default withHostFromHeaders(middlewareSettings)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
}
