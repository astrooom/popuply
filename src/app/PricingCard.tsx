import React from "react"
import { PRODUCTS } from "@/lib/constants/checkout"
import { Check, CheckCheck, Sparkles } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { PricingCardOrderButton } from "./PricingCardOrderButton"

export function PricingCard() {
  const benefits = ["Unlimited Popups", "No Coding Required"]

  return (
    <div className="relative bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-md overflow-visible">
      <div className="absolute top-0 right-0 -mt-4 -mr-4 bg-gradient-to-r from-green-400 to-blue-500 text-white text-xs font-bold rounded-full py-2 px-4 transform rotate-12 shadow-lg">
        Lifetime Access
      </div>
      <h2 className="text-3xl font-extrabold mb-6 flex items-center justify-between text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        One and Done <CheckCheck className="text-green-500 ml-2" />
      </h2>
      <Tabs defaultValue="5sites" className="w-full">
        <TabsList className="grid w-full grid-cols-3 rounded-xl bg-gray-200 dark:bg-gray-700 mb-6">
          {PRODUCTS.map((plan) => (
            <TabsTrigger key={plan.id} value={plan.id} className="text-sm font-medium transition-all duration-200 ease-in-out rounded-xl">
              {plan.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {PRODUCTS.map((plan) => (
          <TabsContent key={plan.id} value={plan.id}>
            <div className="space-y-6">
              <div className="flex items-baseline justify-center">
                <span className="text-5xl font-bold text-gray-900 dark:text-white">${plan.price}</span>
                <span className="ml-2 text-gray-500 dark:text-gray-400">One-time</span>
              </div>
              <p className="text-center text-gray-600 dark:text-gray-300">Pay once - own forever. No recurring fees!</p>
              <PricingCardOrderButton plan={plan} />
              <hr className="border-t border-gray-300 dark:border-gray-600" />
              <ul className="space-y-4">
                <li className="flex items-center space-x-3 group">
                  <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                  <span className="text-gray-700 dark:text-gray-200 group-hover:text-green-500 transition-colors duration-200">
                    {plan.sites} {plan.sites === 1 ? "Site" : "Sites"}
                  </span>
                </li>
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center space-x-3 group">
                    <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-200 group-hover:text-green-500 transition-colors duration-200">
                      {benefit}
                    </span>
                    <Sparkles className="h-5 w-5 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
