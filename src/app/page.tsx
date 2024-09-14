import { Hero } from "./Hero"
import { Navbar } from "./Navbar"
import { HomeFaq } from "./HomeFaq"
import { LearnMore } from "./LearnMore"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Popuply",
  description: "Turn visitors into loyal customers",
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

          <LearnMore />
        </div>
        <div className="p-6">
          <h2 className="text-xl md:text-2xl font-bold">Frequently Asked Questions</h2>
          <HomeFaq />
        </div>
      </div>
    </>
  )
}
