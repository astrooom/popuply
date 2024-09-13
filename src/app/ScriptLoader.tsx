"use client"

import { HOST_URL, IS_DEVELOPMENT } from "@/lib/constants"

export function ScriptLoader() {
  return (
    <script
      src={`${HOST_URL}/scripts/popuply-client.js`}
      data-site-id="eb4730df-8e36-474a-8034-15926a4eaf96" // This ID is consistent from the seed.ts script
      data-api-url={IS_DEVELOPMENT ? "http://localhost:3456/api/external/sites" : undefined}
      defer
    ></script>
  )
}
