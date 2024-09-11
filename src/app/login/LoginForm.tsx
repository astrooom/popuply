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

const FormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
})

export function LoginForm({ isVerified, className }: { isVerified: boolean, className?: string }) {

  const { push } = useRouter()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const response = await fetch("/api/auth/login/verification-code", {
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
      if (isVerified) {
        toast.success("Redirecting to dashboard...")
      } else {
        toast.success("Email sent! Redirecting to verification code...")
      }

      push("/login/code")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="me@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button variant="outline" type="submit">Log In</Button>
      </form>
    </Form>
  )
}
