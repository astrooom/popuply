import { isCurrentUserValid } from "@/lib/auth/session"
import { DashboardNavbar } from "./DashboardNavbar";
import { Sites } from "./Sites";
import { redirect } from "next/navigation";
import { AddSiteCard } from "./AddSiteCard";
export default async function DashboardPage() {

  const valid = await isCurrentUserValid();

  // If not authorized, redirect to login
  if (!valid) {
    redirect("/login");
  }

  return (
    <div className="container">

      <DashboardNavbar />

      <div className="pt-32 pb-12 mx-auto w-8/12 flex flex-col lg:flex-row gap-y-8 lg:justify-between">

        <div className="lg:w-8/12 ">
          <Sites />
        </div>

        <div className="lg:w-3/12">
          <AddSiteCard />
        </div>

      </div>
    </div>
  )
}
