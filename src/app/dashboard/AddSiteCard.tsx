import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { AddSiteForm } from "./AddSiteForm";

export function AddSiteCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Site</CardTitle>
      </CardHeader>

      <CardContent className="flex justify-between">
        <AddSiteForm className="flex w-full flex-col gap-y-4" />
      </CardContent>
    </Card>
  )
}