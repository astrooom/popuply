"use client"

import { Button } from "@/components/ui/Button"
import { NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, PRODUCTS } from "@/lib/constants/checkout"
import { cn } from "@/utils/cn"
import { loadStripe } from "@stripe/stripe-js"
import { toast } from "sonner"
// import { useEffect, useState } from "react";

export function PricingCardOrderButton({ plan }: { plan: (typeof PRODUCTS)[number] }) {
  // const [isDarkMode, setIsDarkMode] = useState(false);

  // useEffect(() => {
  //   const checkDarkMode = () => {
  //     setIsDarkMode(document.documentElement.classList.contains('dark'));
  //   };

  //   // Initial check
  //   checkDarkMode();

  //   // Set up an observer to watch for changes to the class attribute
  //   const observer = new MutationObserver(checkDarkMode);
  //   observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  //   // Clean up the observer when the component unmounts
  //   return () => observer.disconnect();
  // }, []);

  async function handleCheckout() {
    const response = await fetch("/api/billing/stripe-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pricingId: plan.pricingId }),
    })

    const { sessionId, error } = await response.json()

    if (error) {
      toast.error(error)
    } else {
      // Redirect to Stripe Checkout
      const stripePublishableKey = NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      if (!stripePublishableKey) {
        toast.error("Missing Stripe publishable key")
        return
      }
      const stripe = await loadStripe(stripePublishableKey)
      await stripe?.redirectToCheckout({ sessionId })
    }
  }

  return (
    <Button
      className={cn(
        "w-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-gradient-to-r hover:from-green-500 hover:to-blue-600 transition duration-300",
        plan.pricingId === "free" && "bg-gray-300 text-gray-800",
      )}
      onClick={handleCheckout}
    >
      Order
    </Button>
  )
}

{
  /* <button className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 transition duration-300">
  Get Started Now
</button> */
}
