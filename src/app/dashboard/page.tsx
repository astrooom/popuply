import { getCurrentUser } from "@/lib/auth/session"
import { DashboardNavbar } from "./DashboardNavbar";
import { Sites } from "./Sites";
import { redirect } from "next/navigation";
import { AddSiteCard } from "./AddSiteCard";
export default async function DashboardPage() {

  const user = await getCurrentUser();

  // If the user doesn't exist at all, redirect to the login page
  if (!user) {
    return redirect("/login");
  }

  // If the user exists but the email is not verified, redirect to the code verification page
  const { emailVerified } = user;
  if (!emailVerified) {
    return redirect("/login/code");
  }


  return (

    <>
      <DashboardNavbar />
      <div className="container">
        <div className="pt-32 pb-12 mx-auto w-8/12 flex flex-col lg:flex-row gap-y-8 lg:justify-between">
          <div className="lg:w-8/12 ">
            <Sites />
          </div>

          <div className="lg:w-3/12">
            <AddSiteCard />
          </div>

        </div>
      </div>
    </>
  )
}
