import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import Link from "next/link"
import { RegenerateWebhookTokenButton } from "./RegenerateWebhookTokenButton"
import { getWebhookToken } from "@/lib/api/sites"
import { HOST_URL } from "@/lib/constants"

export async function AccessContainer({ siteId }: { siteId: string }) {
  const exampleWebhookJson = {
    title: "New Video Posted",
    content: "How to create a webhook",
    theme: "light",
    link_url: "https://example.com",
    icon_url: "https://example.com/image.png",
    timestamp: "5 minutes ago",
  }

  const fieldDescriptions = [
    { name: "name", required: true, description: "The title of the popup" },
    { name: "content", required: true, description: "The main text content of the popup" },
    { name: "theme", required: false, description: "The color theme of the popup (e.g., 'light' or 'dark')" },
    { name: "link_url", required: false, description: "URL to go to when the popup is clicked (opens in new tab)" },
    { name: "icon_url", required: false, description: "URL for an icon to display in the popup" },
    { name: "timestamp", required: false, description: "Small top-right text of the popup. E.g 'Now' or '5 Mins Ago'" },
  ]

  const webhookToken = await getWebhookToken({ siteId })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">Install</CardTitle>
      </CardHeader>
      <CardContent className="space-y-12">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Script Tag</h3>
          <p className="text-sm text-muted-foreground">
            Simply add this script tag to your websites to trigger popups.<br></br>Usually, it is recommended to add the tag to the Head tag
            of your website, but you can also add it to the body tag.
          </p>
          <code className="p-2 bg-neutral-100 dark:bg-gray-900 rounded-lg block whitespace-pre overflow-x-auto text-sm">{`<script src="${HOST_URL}/scripts/popuply-client.js" data-site-id="${siteId}" defer></script>`}</code>
        </div>
        <div className="space-y-2" id="configureWebhooks">
          <h3 className="font-semibold text-lg">Webhook (Advanced)</h3>
          <p className="text-sm text-muted-foreground">
            Webhooks will allow you to trigger customized popups in realtime.<br></br>Requires{" "}
            <Link href="#enableWebhook" className="underline text-blue-500">
              enabling webhooks
            </Link>{" "}
            for this site.
          </p>
          <div className="space-y-2">
            <h4 className="font-medium">Send a POST request to:</h4>
            {webhookToken && (
              <code className="mt-2 block whitespace-pre overflow-x-auto text-sm p-2 bg-neutral-100 dark:bg-gray-900 rounded-lg">{`https://popuply.net/api/external/webhook/${webhookToken}`}</code>
            )}
            <RegenerateWebhookTokenButton siteId={siteId} currentToken={webhookToken} />

            <h4 className="font-medium">Example Payload:</h4>
            <code className="block whitespace-pre overflow-x-auto text-sm p-2 bg-neutral-100 dark:bg-gray-900 rounded-lg">
              {JSON.stringify(exampleWebhookJson, null, 2)}
            </code>
            <h4 className="font-medium mt-4">Payload Fields:</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Field</TableHead>
                  <TableHead>Required</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fieldDescriptions.map((field) => (
                  <TableRow key={field.name}>
                    <TableCell className="font-medium">{field.name}</TableCell>
                    <TableCell>{field.required ? "Yes" : "No"}</TableCell>
                    <TableCell>{field.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
