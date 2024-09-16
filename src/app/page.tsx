import { Hero } from "./Hero"
import { Navbar } from "./Navbar"
import { HomeFaq } from "./HomeFaq"
import { LearnMore } from "./LearnMore"
import type { Metadata } from "next"
import { WithContext, Product, Offer } from "schema-dts"
import { PRODUCTS } from "@/lib/constants/checkout"
import { GettingStarted } from "./GettingStarted"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Popuply | Simple Popup Toasts for Better Engagement",
  description:
    "Boost conversions with Popuply's easy-to-use popup toasts. No coding needed. Increase visitor engagement and drive results on your website.",
  keywords: "popup toasts, website engagement, conversion boost, no-code popups",
  openGraph: {
    title: "Popuply - Engage Visitors with Simple Popup Toasts",
    description: "Increase conversions and engagement with easy-to-implement popup toasts. No coding required.",
    type: "website",
    url: "https://popuply.net",
    images: [
      {
        url: "https://popuply.net/images/popups-light.png",
        width: 1200,
        height: 630,
        alt: "Popuply - Simple Popup Toasts",
      },
    ],
  },
}

const jsonLd: WithContext<Product> = {
  "@context": "https://schema.org",
  // @ts-ignore
  "@type": "WebApplication",
  "@id": "https://popuply.net#application",
  name: "Popuply",
  description: "Simple popup toasts that drive engagement and boost conversions.",

  // @ts-ignore
  applicationCategory: "BusinessApplication",

  browserRequirements: ["requires HTML5 support", "requires JavaScript"],
  operatingSystem: "Web",
  offerCount: "3",
  offers: PRODUCTS.map((product) => ({
    "@type": "Offer",
    name: product.name,
    price: product.price,
    priceCurrency: "USD",
    description: `Popup toasts configurable on ${product.sites} site${product.sites > 1 ? "s" : ""}`,
  })),
  url: "https://popuply.net",
}

export default function HomePage() {
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="md:pt-20 pb-12">
          <Hero />

          <div className="flex justify-center mt-4 md:-mt-8">
            <a
              href="https://www.producthunt.com/posts/popuply?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-popuply"
              target="_blank"
            >
              <img
                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=489254&theme=light"
                alt="Popuply - Simple&#0032;popup&#0032;toasts&#0032;that&#0032;engage&#0032;visitors&#0044;&#0032;no&#0032;coding&#0032;needed | Product Hunt"
                className="w-[250px] h-[54px]"
              />
            </a>
          </div>

          {/* <div className="p-8">
            <Suspense>
              <GettingStarted />
            </Suspense>
          </div> */}

          <LearnMore />
        </div>
        <div className="p-6">
          <h2 className="text-xl md:text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <HomeFaq />
        </div>
      </div>
    </>
  )
}
