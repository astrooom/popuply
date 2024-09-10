import { isCurrentUserValid } from "@/lib/auth/session"
import { DashboardNavbar } from "../DashboardNavbar";
import { redirect } from "next/navigation";
export default async function DashboardPage() {

  const valid = await isCurrentUserValid();

  // If not authorized, redirect to login
  if (!valid) {
    redirect("/login");
  }

  return (
    <div className="container">
      <DashboardNavbar />
      <div className="pt-32 pb-12 mx-auto w-6/12 flex flex-col gap-y-8">
        Nothing here yet...
      </div>
    </div>
  )
}
