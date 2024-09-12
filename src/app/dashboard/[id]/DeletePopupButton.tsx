"use client"

import { Popup as PopupType } from "@/db/schema"
import { TrashIcon } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function DeletePopupButton({ siteId, popup }: { siteId: string; popup: PopupType }) {
  const { refresh } = useRouter()

  async function deletePopup() {
    const response = await fetch(`/api/sites/${siteId}/popups/${popup.id}`, {
      method: "DELETE",
    })

    const { error } = await response.json()

    if (error) {
      toast.error(error)
    } else {
      toast.success("Popup deleted!")
      refresh()
    }
  }

  return (
    <Button variant="ghost" className="hover:bg-muted-foreground/20" size="sm" onClick={async () => await deletePopup()}>
      <TrashIcon className="w-[15px] h-[15px] text-red-500" />
    </Button>
  )
}
