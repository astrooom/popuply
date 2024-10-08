import Image from "next/image"
import { ConfirmCodeForm } from "./ConfirmCodeForm"
import { getCurrentUser } from "@/lib/auth/session"
import { redirect } from "next/navigation"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Popuply | Confirm Email",
  description: "Verify your email address",
}

export default async function ConfirmCode({ searchParams }: { searchParams: { displayEmail?: boolean } }) {
  const user = await getCurrentUser()

  // If the user doesn't exist at all, redirect to the login page
  if (!user) {
    return redirect("/login")
  }

  // INESCURE - Do not redirect if the email is already verified. This could cause users to be able to log in to other users accounts
  // // If the user is already verified and, redirect to the dashboard with a success message (if one is provided)
  // if (user.emailVerified) {
  //   return redirect("/dashboard")
  // }

  return (
    <div className="container">
      <div className="pt-32 pb-12 mx-auto w-6/12 flex flex-col gap-y-8">
        <Image className="mx-auto" src="/logo/logo.png" alt="logo" width={82} height={82} />
        <ConfirmCodeForm className="w-full gap-y-2 flex flex-col" displayEmail={searchParams.displayEmail} />
      </div>
    </div>
  )
}
