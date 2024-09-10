import type { Site } from "@/db/schema";
import { getSite } from "@/lib/api/sites";
import { SiteSettingsForm } from "./SiteSettingsForm";


export async function SiteSettings({ siteId }: { siteId: Site["id"] }) {

  const site = await getSite({ siteId })
  if (!site) {
    throw new Error("Site not found");
  }

  return (
    <SiteSettingsForm site={site} className="flex flex-col gap-y-4" />
  )
}