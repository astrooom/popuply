"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function LogoutHandler() {
  const { push, refresh } = useRouter()

  useEffect(() => {
    const logout = async () => {
      const response = await fetch("/api/auth/logout", { method: "POST" })
      if (!response.ok) {
        console.error("Failed to logout")
        push("/dashboard")
      }
      push("/")
      refresh()
    }

    logout()
  }, [push])

  return null
}
