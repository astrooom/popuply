import { isCurrentUserValid } from "@/lib/auth/session"
import { redirect } from "next/navigation"
import { DragDropPopupsContainer } from "./DragDropPopupsContainer"
import { SiteSettings } from "./SiteSettings"
import { AccessContainer } from "./AccessContainer"
import { SiteNavbar } from "./SiteNavbar"
import type { Metadata } from "next"
import { DeleteSiteButton } from "./DeleteSiteButton"

export const metadata: Metadata = {
  title: "Popuply | Site",
  description: "Managing site",
}

export default async function SitePage({ params }: { params: { id: string } }) {
  const valid = await isCurrentUserValid()

  // If not authorized, redirect to login
  if (!valid) {
    return redirect("/login")
  }

  const siteId = params.id

  return (
    <>
      <SiteNavbar />

      <div className="container">
        <div className="pt-32 pb-12 lg:flex lg:flex-col gap-y-12">
          <h2 className="mx-auto lg:w-8/12 lg:text-3xl text-2xl font-bold">Configure Site</h2>

          <div className="mx-auto lg:w-8/12 flex flex-col lg:flex-row gap-y-8 gap-x-8 justify-between">
            <div className="lg:w-6/12">
              <SiteSettings siteId={siteId} />
            </div>

            <div className="lg:w-6/12">
              <DragDropPopupsContainer siteId={siteId} />
            </div>
          </div>

          <div className="lg:mx-auto lg:w-8/12 flex flex-col gap-y-8">
            <AccessContainer siteId={siteId} />

            <DeleteSiteButton siteId={siteId} />
          </div>
        </div>
      </div>
    </>
  )
}
