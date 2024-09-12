"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/Button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/Form"
import { Input } from "@/components/ui/Input"

import { toast } from "sonner"
import { useRouter } from "next/navigation"

const FormSchema = z.object({
  code: z.string().min(1, { message: "Please enter a code" }),
})

export function ConfirmCodeForm({ className, displayEmail }: { className?: string; displayEmail?: boolean }) {
  const { push } = useRouter()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      code: "",
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const response = await fetch("/api/auth/login/verification-code/confirm", {
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
      toast.success("Email verified!")
      push("/dashboard")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verify Email</FormLabel>
              <FormDescription>Please enter the verification code sent to {displayEmail || "your email"}</FormDescription>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button variant="default" type="submit">
          Confirm
        </Button>
      </form>
    </Form>
  )
}
