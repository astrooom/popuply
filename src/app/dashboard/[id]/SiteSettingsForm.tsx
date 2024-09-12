"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/Button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/Form"

import { Input } from "@/components/ui/Input"
import { useRouter } from "next/navigation"
import type { Site } from "@/db/schema"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { toast } from "sonner"
import { Checkbox } from "@/components/ui/Checkbox"
import Link from "next/link"
import { PlusIcon, XIcon } from "lucide-react"

const FormSchema = z.object({
  startAfter: z.number().min(100).max(Number.MAX_SAFE_INTEGER),
  hideAfter: z.number().min(100).max(Number.MAX_SAFE_INTEGER),
  frequency: z.number().min(100).max(Number.MAX_SAFE_INTEGER),
  orderMode: z.enum(["ordered", "randomized"]),
  enableWebhook: z.boolean(),
  pageRuleType: z.enum(["whitelist", "blacklist"]),
  pageRulePatterns: z.array(z.string()),
})

export function SiteSettingsForm({ site, className }: { site: Site; className?: string }) {
  const { refresh } = useRouter()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      startAfter: site?.startAfter ?? 500,
      hideAfter: site?.hideAfter ?? 500,
      frequency: site?.frequency ?? 500,
      orderMode: site?.orderMode ?? "ordered",
      enableWebhook: site?.enableWebhook ?? false,
      pageRuleType: site?.pageRuleType ?? "whitelist",
      pageRulePatterns: (site?.pageRulePatterns as string[]) ?? [],
    },
  })

  const { clearErrors } = form

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const response = await fetch(`/api/sites/${site.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    const { error } = await response.json()

    if (error) {
      toast.error(error)
    } else {
      toast.success("Settings updated!")
      refresh()
    }
  }

  const handleFormBlur = (e: React.FocusEvent) => {
    const currentTarget = e.currentTarget
    // Use setTimeout to check if the focus is outside the form after the current event loop
    setTimeout(() => {
      if (!currentTarget.contains(document.activeElement)) {
        clearErrors()
      }
    }, 0)
  }

  const handleAddPattern = () => {
    const pattern = prompt("Enter a path:")
    if (pattern) {
      const currentPatterns = form.getValues("pageRulePatterns")
      form.setValue("pageRulePatterns", [...currentPatterns, pattern])
    }
  }

  const handleRemovePattern = (index: number) => {
    const currentPatterns = form.getValues("pageRulePatterns")
    form.setValue(
      "pageRulePatterns",
      currentPatterns.filter((_, i) => i !== index),
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className} onBlur={handleFormBlur}>
        <FormField
          control={form.control}
          name="startAfter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start After</FormLabel>
              <FormDescription>The number of seconds after which the first popup will appear.</FormDescription>
              <FormControl>
                <Input type="number" placeholder="500" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hideAfter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hide After</FormLabel>
              <FormDescription>The number of seconds after which a visible popup will disappear.</FormDescription>
              <FormControl>
                <Input type="number" placeholder="500" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="frequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Frequency</FormLabel>
              <FormDescription>The number of seconds between each popup.</FormDescription>
              <FormControl>
                <Input type="number" placeholder="500" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="orderMode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Order Mode</FormLabel>

              <FormDescription>The order in which popups will appear.</FormDescription>

              <Select defaultValue={field.value} onValueChange={field.onChange}>
                <FormControl>
                  {/* <Input placeholder="500" {...field} /> */}

                  <SelectTrigger>
                    <SelectValue placeholder="Select order" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  <SelectItem value="ordered">Ordered</SelectItem>
                  <SelectItem value="randomized">Randomized</SelectItem>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="enableWebhook"
          render={({ field }) => (
            <FormItem
              id="enableWebhook" // Used for local href
            >
              <div className="flex gap-x-2">
                <FormLabel>Enable Webhooks</FormLabel>

                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </div>
              <FormDescription>
                Allow triggering realtime popups through{" "}
                <Link href="#configureWebhooks" className="underline text-blue-500">
                  webhooks
                </Link>{" "}
                for this site.
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pageRuleType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Page Rule Type</FormLabel>
              <FormDescription>The type of page rule that will trigger the popup according to the page rule patterns.</FormDescription>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a page rule type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="whitelist">Whitelist</SelectItem>
                  <SelectItem value="blacklist">Blacklist</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pageRulePatterns"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Page Rule Patterns</FormLabel>
              <FormDescription>
                The patterns that will skip triggering the popup.<br></br>For example, a pattern of{" "}
                <span className="font-semibold">/login</span> will skip triggering the popup on all paths starting with{" "}
                <span className="font-semibold">/login</span> including all subpaths. Vice versa if whitelist is selected.
              </FormDescription>
              <FormControl>
                <div>
                  {field.value.map((pattern, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <Input value={pattern} readOnly className="mr-2" />
                      <Button type="button" variant="ghost" size="sm" onClick={() => handleRemovePattern(index)}>
                        <XIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={handleAddPattern}>
                    <PlusIcon className="w-4 h-4 mr-2" /> Add Pattern
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button variant="default" size="sm" type="submit">
          Save
        </Button>
      </form>
    </Form>
  )
}
