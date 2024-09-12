"use client"

import { Button } from "@/components/ui/Button"
import { ArrowRight } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { withQuery } from "ufo"

export function GoToDashboardButton() {
  const { push } = useRouter()

  const searchParams = useSearchParams()
  const session_id = searchParams.get("session_id")

  // Set session for this user and redirect to the verification code page.
  async function goToDashboard() {
    const response = await fetch("/api/billing/confirm-success", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionId: session_id }),
    })

    const { error, email } = await response.json()

    if (error) {
      toast.error(error)
    } else {
      // Redirect to email verification page. By now we have the user session set in the browser.
      push(withQuery("/login/code", { displayEmail: email }))
    }
  }

  return (
    <Button onClick={goToDashboard}>
      Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
    </Button>
  )
}
