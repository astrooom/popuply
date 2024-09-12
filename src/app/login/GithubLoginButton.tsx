"use client"

import { Button } from "@/components/ui/Button"
import { GitHubLogoIcon } from "@radix-ui/react-icons"
import { toast } from "sonner"

export function GithubLoginButton() {
  async function githubLogin() {
    const response = await fetch("/api/auth/login/github")

    const { error, data } = await response.json()

    if (error) {
      toast.error(error)
    } else {
      const { url } = data
      return (window.location = url)
    }
  }

  return (
    <Button variant="outline" onClick={() => githubLogin()}>
      {" "}
      <GitHubLogoIcon className="mr-2 h-5 w-5" /> Login with GitHub
    </Button>
  )
}
