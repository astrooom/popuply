import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { AddSiteForm } from "./AddSiteForm"
import { getSites } from "@/lib/api/sites"
import { getCurrentUser } from "@/lib/auth/session"

export async function AddSiteCard() {
  const [sites, user] = await Promise.all([getSites(), getCurrentUser()])

  const allowedSites = user?.allowedSites ?? 0
  const usedSites = sites.length

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Site</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-4">
        <div className="text-sm text-muted-foreground">
          <p>
            Used {usedSites} of {allowedSites} sites
          </p>
        </div>
        <AddSiteForm className="flex w-full flex-col gap-y-4" />
      </CardContent>
    </Card>
  )
}
