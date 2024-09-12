import { CheckCircle } from "lucide-react"
import { Navbar } from "../Navbar"
import { GoToDashboardButton } from "./GoToDashboardButton"
import { Suspense } from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Popuply | Payment Successful",
  description: "Payment suceeded",
}

export default function PaymentSuccessPage() {
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="pt-32 pb-12">
          <div className="bg-gradient-to-br from-green-50/20 to-blue-50/20 dark:from-gray-900/10 dark:to-green-900/10 dark:border px-8 py-16 rounded-xl">
            <div className="container mx-auto px-4">
              <div className="flex flex-col items-center justify-center text-center space-y-8">
                <CheckCircle className="w-16 h-16 text-green-500" />
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  Payment{" "}
                  <span className="inline bg-gradient-to-r from-green-500 to-blue-500 text-transparent bg-clip-text">Successful</span>
                </h1>
                <p className="text-xl text-foreground md:w-3/4 mx-auto">
                  Great news! Your payment has been processed successfully. Thank you for your purchase. We&apos;re excited to have you on
                  board!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Suspense>
                    <GoToDashboardButton />
                  </Suspense>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
