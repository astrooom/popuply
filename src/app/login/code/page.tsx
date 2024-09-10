
import Image from "next/image";
import { ConfirmCodeForm } from "./ConfirmCodeForm";

export default async function ConfirmCode() {
  return (
    <div className="container">
      <div className="pt-32 pb-12 mx-auto w-6/12 flex flex-col gap-y-8">
        <Image className="mx-auto" src="/logo/logo.png" alt="logo" width={82} height={82} />
        <p className="text-xl text-foreground">
          Enter the code that was sent to your email.
        </p>
        <ConfirmCodeForm className="w-full gap-y-2 flex flex-col" />
      </div>
    </div>
  )
}

