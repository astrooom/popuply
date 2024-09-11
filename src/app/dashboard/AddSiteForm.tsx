"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/Button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form"

import { Input } from "@/components/ui/Input"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { domainSchema } from "@/lib/constants/validation"

const FormSchema = z.object({
  domain: domainSchema,
})

export function AddSiteForm({ className }: { className?: string }) {

  const { refresh } = useRouter()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      domain: "",
    },
  })

  const { clearErrors } = form

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const response = await fetch("/api/sites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    const { error } = await response.json()

    if (error) {
      toast.error(error)
    } else {
      toast.success("Site added!")
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className} onBlur={handleFormBlur}>
        <FormField
          control={form.control}
          name="domain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Site Domain</FormLabel>
              <FormControl>
                <Input placeholder="coolsite.com" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button variant="secondary" type="submit">Add</Button>
      </form>
    </Form>
  )
}
