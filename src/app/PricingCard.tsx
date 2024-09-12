"use client"

import { PRODUCTS } from "@/lib/constants/checkout"
import { Check, CheckCheck } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { PricingCardOrderButton } from "./PricingCardOrderButton"

export function PricingCard() {
  const benefits = ["Unlimited Popups", "No Coding Required", "24/7 Support", "Regular Updates"]

  return (
    <div className="relative bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
      <div className="absolute top-0 right-0 -mt-4 -mr-4 bg-green-500 text-white text-xs font-bold rounded-full p-2">Lifetime Access</div>
      <h2 className="text-2xl font-bold mb-4 flex items-center justify-between">
        One and Done <CheckCheck className="text-green-500" />
      </h2>

      <Tabs defaultValue="5sites" className="w-full">
        <TabsList className="sm:grid w-full sm:grid-cols-3 sm:py-0 py-14 flex flex-col sm:rounded-none rounded-xl">
          {PRODUCTS.map((plan) => (
            <TabsTrigger key={plan.id} value={plan.id}>
              {plan.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {PRODUCTS.map((plan) => (
          <TabsContent key={plan.id} value={plan.id}>
            <div className="mt-4 mb-4">
              <span className="text-4xl font-bold">${plan.price}</span>
              <span className="text-gray-500 dark:text-gray-400"> One-time</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Pay once - own forever. No recurring fees!</p>
            <PricingCardOrderButton plan={plan} />
            <hr className="my-6" />
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                <span>
                  {plan.sites} {plan.sites === 1 ? "Site" : "Sites"}
                </span>
              </li>
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center space-x-3">
                  <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
