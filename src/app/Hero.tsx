import { PricingCard } from "./PricingCard"
import { ArrowRight, Zap, Webhook, TrendingUp } from "lucide-react"
import { buttonVariants } from "@/components/ui/Button"
import Link from "next/link"
import { HeroPopupButton } from "./HeroPopupButton"
export const Hero = () => {
  return (
    <div className="bg-gradient-to-br from-purple-50/20 to-pink-50/20 dark:from-gray-900/10 dark:to-purple-900/10 dark:border lg:px-8 py-16 rounded-xl">
      <div className="container mx-auto px-4">
        <div className="flex lg:flex-row flex-col items-center justify-between gap-10">
          <section className="text-center lg:text-start space-y-8 lg:w-8/12">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Turn <span className="inline bg-gradient-to-r from-[#F596D3] to-[#D247BF] text-transparent bg-clip-text">visitors</span> into{" "}
              <span className="inline bg-gradient-to-r from-[#F596D3] to-[#D247BF] text-transparent bg-clip-text">loyal customers</span>
            </h1>
            <p className="text-xl text-foreground md:w-11/12 mx-auto lg:mx-0">
              Deliver configurable, impactful, and <strong>attention-grabbing</strong> popup toasts that drive engagement and boost
              conversions on your site. 🚀
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center lg:justify-start">
              {/* <Suspense fallback={<HeroPopupButtonSkeleton />}>
                <HeroPopupButtonContainer />
              </Suspense> */}
              <HeroPopupButton />

              <Link href="#learnMore" className={buttonVariants({ variant: "positive" })}>
                Learn More <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            <div className="lg:grid lg:grid-cols-3 lg:gap-4 lg:pt-8 flex flex-col gap-y-8 items-center">
              {[
                { icon: Zap, text: "Super fast setup" },
                { icon: TrendingUp, text: "Increased engagement" },
                { icon: Webhook, text: "Hook to events in real time" },
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <item.icon className="h-6 w-6 text-purple-500" />
                  <span className="text-base font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </section>
          <section className="lg:w-1/2 flex justify-center items-center">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-25"></div>
              <PricingCard />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
