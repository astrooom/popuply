"use client"

import { HOST_NAME, IS_DEVELOPMENT } from "@/lib/constants"

export default function Home() {
  // await getServerSession(authOptions);

  return (
    <div className="container">
      <script src={`${HOST_NAME}/scripts/popuply-client.js`} data-site-id="b80b7d4e-76a9-4267-a885-eaca07805eda" data-api-url={IS_DEVELOPMENT ? "http://localhost:3456/api/external/sites" : undefined} defer></script>
    </div>
  )
}
