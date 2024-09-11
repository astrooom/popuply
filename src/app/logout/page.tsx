import { logOut } from "@/lib/auth/session"
import { redirect } from "next/navigation";
import { withQuery } from "ufo";

export default async function Logout() {
  await logOut();
  return redirect(withQuery("/", { loggedOut: true }));
}