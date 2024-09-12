import { Hero } from "./Hero"
import { Navbar } from "./Navbar"
import { HomeFaq } from "./HomeFaq"
import { LearnMore } from "./LearnMore"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Popuply",
  description: "Turn visitors into loyal customers",
}

export default function HomePage() {
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="pt-32 pb-12">
          <Hero />
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
