"use client"

import { useState } from "react"
import { Button, buttonVariants } from "@/components/ui/Button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/AlertDialog"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function DeleteSiteButton({ siteId }: { siteId: string }) {
  const { push } = useRouter()

  const [isDeleting, setIsDeleting] = useState(false)

  const deleteSite = async () => {
    setIsDeleting(true)

    const response = await fetch(`/api/sites/${siteId}`, {
      method: "DELETE",
    })

    const { error } = await response.json()

    if (error) {
      toast.error(error)
    } else {
      toast.success("Site deleted!")
      push("/dashboard")
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-full md:w-1/3">
          Delete Site
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your site and remove all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteSite} disabled={isDeleting} className={buttonVariants({ variant: "destructive" })}>
            {isDeleting ? "Deleting..." : "Delete Site"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
