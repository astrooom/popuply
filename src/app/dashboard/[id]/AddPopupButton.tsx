"use client"

import { Button } from "@/components/ui/Button"
import { PlusIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function AddPopupButton({ siteId, ...props }: { siteId: string } & React.ComponentProps<typeof Button>) {
  const { refresh } = useRouter()

  async function addPopup() {
    const response = await fetch(`/api/sites/${siteId}/popups`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const { error } = await response.json()

    if (error) {
      toast.error(error)
    } else {
      toast.success("Popup added!")
      refresh()
    }
  }

  return (
    <Button {...props} onClick={() => addPopup()}>
      {" "}
      <PlusIcon className="w-3 h-3 mr-2" /> Add Popup
    </Button>
  )
}
