import Image from "next/image";
import { LoginForm } from "./LoginForm";
import { getCurrentUser, isCurrentUserValid } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { GithubLoginButton } from "./GithubLoginButton";
import { serverLogger } from "@/lib/utils/server/logging";

export default async function Login() {

  const valid = await isCurrentUserValid();

  // if user is already signed in and has verified email, redirect to dashboard
  if (valid) {
    serverLogger.info({ type: "AUTH", msg: "User already logged in. Redirecting to dashboard" });
    redirect("/dashboard");
  }

  return (
    <div className="container">

      <div className="pt-32 pb-12 mx-auto w-6/12 flex flex-col gap-y-8">

        <Image className="mx-auto" src="/logo/logo.png" alt="logo" width={82} height={82} />

        <p className="text-xl text-foreground">
          Enter your email-address to get started.
        </p>

        <LoginForm className="w-full gap-y-2 flex flex-col" />

        <GithubLoginButton />


      </div>

    </div>
  )
}
